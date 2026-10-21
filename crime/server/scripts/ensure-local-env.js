const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const requiredSecrets = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

const isValidSecret = (value) => typeof value === 'string' && value.length >= 32;

const ensureLocalEnv = ({
  envPath = path.resolve(__dirname, '..', '.env'),
  environment = process.env,
  logger = console
} = {}) => {
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const parsed = dotenv.parse(existing);
  const missingSecrets = requiredSecrets.filter((key) => {
    const environmentValue = environment[key];
    if (environmentValue && !isValidSecret(environmentValue)) {
      throw new Error(`${key} is set but must contain at least 32 characters`);
    }
    return !isValidSecret(environmentValue || parsed[key]);
  });

  if (environment.NODE_ENV === 'production') {
    if (missingSecrets.length) {
      throw new Error(
        `${missingSecrets.join(' and ')} must be configured with at least 32 characters in the production environment`
      );
    }
    return { generated: [] };
  }

  if (missingSecrets.length === 0) {
    return { generated: [] };
  }

  let lines = existing ? existing.replace(/\s*$/, '').split(/\r?\n/) : [
    'NODE_ENV=development',
    'PORT=5000',
    'CLIENT_URL=http://localhost:3000',
    'MONGODB_URI=mongodb://127.0.0.1:27017/crime-watch',
    'GOOGLE_CLIENT_ID='
  ];

  missingSecrets.forEach((key) => {
    const secret = crypto.randomBytes(48).toString('hex');
    const lineIndex = lines.findIndex((line) => line.startsWith(`${key}=`));
    if (lineIndex >= 0) {
      lines[lineIndex] = `${key}=${secret}`;
    } else {
      lines.push(`${key}=${secret}`);
    }
  });

  fs.writeFileSync(envPath, `${lines.join('\n')}\n`, { mode: 0o600 });
  logger.log(`Generated missing local JWT secrets in ${envPath}. Keep this file private.`);
  return { generated: missingSecrets };
};

if (require.main === module) {
  try {
    ensureLocalEnv();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { ensureLocalEnv };
