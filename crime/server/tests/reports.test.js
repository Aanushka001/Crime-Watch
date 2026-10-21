process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long';

jest.mock('../models/Report', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn()
}));

const jwt = require('jsonwebtoken');
const request = require('supertest');
const Report = require('../models/Report');
const app = require('../server');

const citizenId = '64b000000000000000000001';
const accessToken = (role = 'citizen') => jwt.sign(
  { type: 'access', role },
  process.env.JWT_ACCESS_SECRET,
  { subject: citizenId, expiresIn: '5m' }
);

describe('report API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects an invalid authorization token on an anonymous report', async () => {
    await request(app)
      .post('/api/reports')
      .set('Authorization', 'Bearer invalid-token')
      .send({ crimeType: 'Theft' })
      .expect(401);
    expect(Report.create).not.toHaveBeenCalled();
  });

  test('creates valid citizen reports in pending status', async () => {
    const report = {
      _id: '64b000000000000000000002',
      userId: citizenId,
      crimeType: 'Theft',
      description: 'A bicycle was taken from the station entrance.',
      location: 'Central Station',
      latitude: 51.5,
      longitude: -0.12,
      status: 'pending',
      time: '2026-10-20T10:00:00.000Z'
    };
    Report.create.mockResolvedValue({ toObject: () => report });

    const response = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${accessToken()}`)
      .send({
        crimeType: 'Theft',
        description: report.description,
        location: report.location,
        latitude: report.latitude,
        longitude: report.longitude,
        time: report.time
      })
      .expect(201);

    expect(Report.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: citizenId,
      geoLocation: { type: 'Point', coordinates: [-0.12, 51.5] }
    }));
    expect(response.body.report).toEqual(expect.objectContaining({
      id: report._id,
      status: 'pending'
    }));
    expect(response.body.report.userId).toBeUndefined();
  });

  test('accepts anonymous reports without authentication and omits reporter details', async () => {
    const report = {
      _id: '64b000000000000000000003',
      userId: null,
      reviewedBy: null,
      isAnonymous: true,
      status: 'pending',
      toObject: () => ({
        _id: '64b000000000000000000003',
        userId: null,
        reviewedBy: null,
        isAnonymous: true,
        status: 'pending'
      })
    };
    Report.create.mockResolvedValue(report);

    const response = await request(app)
      .post('/api/reports')
      .send({
        crimeType: 'Other',
        description: 'A suspicious incident was observed.',
        location: 'Riverside Park',
        latitude: 51.5,
        longitude: -0.12,
        time: '2026-10-20T10:00:00.000Z'
      })
      .expect(201);

    expect(Report.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: null,
      isAnonymous: true
    }));
    expect(response.body.report).toEqual(expect.objectContaining({ isAnonymous: true }));
    expect(response.body.report.userId).toBeUndefined();
  });

  test('keeps signed-in anonymous reports attached to the private history owner', async () => {
    const report = {
      _id: '64b000000000000000000004',
      userId: citizenId,
      isAnonymous: true,
      status: 'pending',
      toObject: () => ({
        _id: '64b000000000000000000004',
        userId: citizenId,
        isAnonymous: true,
        status: 'pending'
      })
    };
    Report.create.mockResolvedValue(report);

    const response = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${accessToken()}`)
      .send({
        crimeType: 'Other',
        description: 'A signed-in anonymous report.',
        location: 'Riverside Park',
        latitude: 51.5,
        longitude: -0.12,
        time: '2026-10-20T10:00:00.000Z',
        isAnonymous: true
      })
      .expect(201);

    expect(Report.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: citizenId,
      isAnonymous: true
    }));
    expect(response.body.report.userId).toBeUndefined();
    expect(response.body.report.isAnonymous).toBe(true);
  });

  test('rejects citizen access to the moderation queue before database access', async () => {
    await request(app)
      .get('/api/reports/moderation')
      .set('Authorization', `Bearer ${accessToken()}`)
      .expect(403);
  });

  test('returns moderation status and review feedback to the report owner', async () => {
    const report = {
      _id: '64b000000000000000000002',
      userId: citizenId,
      status: 'rejected',
      reviewNote: 'Please provide a more specific location.',
      reviewedAt: '2026-10-21T10:00:00.000Z'
    };
    const query = {
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([report])
    };
    Report.find.mockReturnValue(query);

    const response = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${accessToken()}`)
      .expect(200);

    expect(Report.find).toHaveBeenCalledWith({ userId: citizenId });
    expect(response.body[0]).toEqual(expect.objectContaining({
      id: report._id,
      status: 'rejected',
      reviewNote: report.reviewNote,
      reviewedAt: report.reviewedAt
    }));
    expect(response.body[0].userId).toBeUndefined();
  });

  test('moderators can verify a report through the protected review route', async () => {
    const report = {
      _id: '64b000000000000000000002',
      status: 'verified',
      toObject: () => ({
        _id: '64b000000000000000000002',
        crimeType: 'Theft',
        status: 'verified'
      })
    };
    Report.findByIdAndUpdate.mockResolvedValue(report);

    const response = await request(app)
      .patch(`/api/reports/${report._id}/moderate`)
      .set('Authorization', `Bearer ${accessToken('moderator')}`)
      .send({ status: 'verified' })
      .expect(200);

    expect(Report.findByIdAndUpdate).toHaveBeenCalledWith(
      report._id,
      expect.objectContaining({ status: 'verified', reviewedBy: citizenId }),
      { new: true, runValidators: true }
    );
    expect(response.body.report.status).toBe('verified');
  });

  test('only verified reports are returned publicly', async () => {
    const verifiedReport = {
      _id: '64b000000000000000000002',
      toObject: () => ({ _id: '64b000000000000000000002', status: 'verified' })
    };
    const query = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([verifiedReport])
    };
    Report.find.mockReturnValue(query);

    const response = await request(app).get('/api/reports/public').expect(200);

    expect(Report.find).toHaveBeenCalledWith({ status: 'verified' });
    expect(response.body[0]).toEqual(expect.objectContaining({ id: verifiedReport._id }));
    expect(response.body[0].userId).toBeUndefined();
  });

  test('uses the geospatial index query when map coordinates are supplied', async () => {
    const query = {
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([])
    };
    Report.find.mockReturnValue(query);

    await request(app)
      .get('/api/reports/public?latitude=51.5&longitude=-0.12&radiusKm=25')
      .expect(200);

    expect(Report.find).toHaveBeenCalledWith({
      status: 'verified',
      geoLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [-0.12, 51.5] },
          $maxDistance: 25000
        }
      }
    });
  });
});
