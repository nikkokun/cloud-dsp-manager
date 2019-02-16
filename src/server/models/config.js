const env = process.env.NODE_ENV || 'development'; // 'dev' or 'test'

const dbConfig = {
  development: {
    user: 'dspadmin',
    password: '',
    database: 'clouddsp',
    host: 'localhost',
    port: 5432,
  },
  production: {
    user: 'dspadmin',
    password: '',
    database: 'clouddsp',
    host: '127.0.0.1',
    port: 5432
  }
};

module.exports = dbConfig[env];
