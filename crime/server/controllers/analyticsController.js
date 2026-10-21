const Report = require('../models/Report');

const getAnalytics = async (_req, res, next) => {
  try {
    const match = { status: 'verified' };
    const [total, byType, byHour, topLocations] = await Promise.all([
      Report.countDocuments(match),
      Report.aggregate([
        { $match: match },
        { $group: { _id: '$crimeType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Report.aggregate([
        { $match: match },
        { $group: { _id: { $hour: '$time' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Report.aggregate([
        { $match: match },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 5 }
      ])
    ]);

    const byTimeOfDay = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    byHour.forEach(({ _id: hour, count }) => {
      if (hour >= 6 && hour < 12) byTimeOfDay.morning += count;
      else if (hour >= 12 && hour < 18) byTimeOfDay.afternoon += count;
      else if (hour >= 18 && hour < 22) byTimeOfDay.evening += count;
      else byTimeOfDay.night += count;
    });

    return res.status(200).json({
      total,
      byType: byType.map(({ _id, count }) => ({ crimeType: _id, count })),
      byTimeOfDay,
      topLocations: topLocations.map(({ _id, count }) => ({ location: _id, count }))
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAnalytics };
