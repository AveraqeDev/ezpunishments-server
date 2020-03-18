module.exports = {
  // Basic Info
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://ezpunishments@localhost/ezpunishments',
  // JWT Info
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3m',
  // Password Reset Email OAuth
  RESET_PASSWORD_EXPIRY: process.env.RESET_PASSWORD_EXPIRY || '300',
  EMAIL_USER: process.env.EMAIL_USER,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN
};
