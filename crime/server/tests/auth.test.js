process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long';

jest.mock('../models/User', () => {
  const MockUser = jest.fn(function createMockUser(data = {}) {
    Object.assign(this, data);
    this.id = '64b000000000000000000001';
    this._id = this.id;
    this.save = jest.fn().mockResolvedValue(this);
    this.toJSON = () => ({
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role
    });
  });
  MockUser.findOne = jest.fn();
  MockUser.findById = jest.fn();
  MockUser.findOneAndUpdate = jest.fn();
  MockUser.findByIdAndUpdate = jest.fn();
  MockUser.exists = jest.fn();
  return MockUser;
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const User = require('../models/User');
const app = require('../server');

const user = (passwordHash) => ({
  id: '64b000000000000000000001',
  _id: '64b000000000000000000001',
  name: 'Test Citizen',
  email: 'citizen@example.test',
  role: 'citizen',
  passwordHash,
  save: jest.fn().mockResolvedValue(undefined),
  toJSON: () => ({ id: '64b000000000000000000001', name: 'Test Citizen', email: 'citizen@example.test', role: 'citizen' })
});

describe('authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('signs in with email and password and sets an HTTP-only refresh cookie', async () => {
    const passwordHash = await bcrypt.hash('correct horse battery staple', 4);
    const account = user(passwordHash);
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(account) });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'CITIZEN@example.test', password: 'correct horse battery staple' })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.user).toEqual(expect.objectContaining({ email: account.email, role: 'citizen' }));
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(account.save).toHaveBeenCalled();
  });

  test('registers new accounts as citizens regardless of a submitted role', async () => {
    User.exists.mockResolvedValue(false);

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Citizen',
        email: 'new@example.test',
        password: 'a sufficiently long password',
        role: 'administrator'
      })
      .expect(201);

    expect(User).toHaveBeenCalledWith(expect.objectContaining({ role: 'citizen' }));
    expect(response.body.user.role).toBe('citizen');
  });

  test('rotates refresh sessions atomically', async () => {
    const account = user(undefined);
    const refreshToken = jwt.sign(
      { type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { subject: account.id, expiresIn: '5m' }
    );
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({
      ...account,
      refreshTokenHash: require('crypto').createHash('sha256').update(refreshToken).digest('hex')
    }) });
    User.findOneAndUpdate.mockResolvedValue(account);

    const response = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `crime_watch_refresh=${refreshToken}`)
      .expect(200);

    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ _id: account.id, refreshTokenHash: expect.any(String) }),
      { $set: { refreshTokenHash: expect.any(String) } },
      { new: true }
    );
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
  });
});
