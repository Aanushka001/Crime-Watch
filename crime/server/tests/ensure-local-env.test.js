const fs = require('fs');
const os = require('os');
const path = require('path');
const { ensureLocalEnv } = require('../scripts/ensure-local-env');

describe('local environment setup', () => {
  let directory;
  let envPath;
  let logger;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'crime-watch-env-'));
    envPath = path.join(directory, '.env');
    logger = { log: jest.fn() };
  });

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  test('creates strong local secrets and a default local MongoDB URI', () => {
    const result = ensureLocalEnv({ envPath, environment: {}, logger });
    const config = require('dotenv').parse(fs.readFileSync(envPath, 'utf8'));

    expect(result.generated).toEqual(['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']);
    expect(config.JWT_ACCESS_SECRET).toHaveLength(96);
    expect(config.JWT_REFRESH_SECRET).toHaveLength(96);
    expect(config.JWT_ACCESS_SECRET).not.toBe(config.JWT_REFRESH_SECRET);
    expect(config.MONGODB_URI).toBe('mongodb://127.0.0.1:27017/crime-watch');
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  test('does not overwrite existing local secrets', () => {
    fs.writeFileSync(envPath, [
      'JWT_ACCESS_SECRET=access-secret-that-is-longer-than-32-characters',
      'JWT_REFRESH_SECRET=refresh-secret-that-is-longer-than-32-characters'
    ].join('\n'));

    const before = fs.readFileSync(envPath, 'utf8');
    const result = ensureLocalEnv({ envPath, environment: {}, logger });

    expect(result.generated).toEqual([]);
    expect(fs.readFileSync(envPath, 'utf8')).toBe(before);
  });

  test('requires externally configured secrets in production', () => {
    expect(() => ensureLocalEnv({
      envPath,
      environment: { NODE_ENV: 'production' },
      logger
    })).toThrow('must be configured with at least 32 characters');
    expect(fs.existsSync(envPath)).toBe(false);
  });
});
