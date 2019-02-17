// import dbConfig from './config';

const config = require('./config');
const Pool = require('pg').Pool;
const async = require('async');

module.exports = class Audios {
  constructor() {
    this.pool = new Pool({
      user: config.user,
      host: config.host,
      database: config.database,
      password: config.password,
      port: config.port,
    });
  }

  async newAudio(inputFilename, inputUrl, inputUserId) {
    const sql = `
          INSERT INTO audios (filename, url, user_id) VALUES (
            '${inputFilename}',
            '${inputUrl}',
            ${inputUserId}
          );
          `;

    const results = await this.pool.query(sql);
    return results;
  }

  async getAudio(inputFilename, inputUserId) {
    const sql = `
          SELECT * FROM audios WHERE filename = '${inputFilename}' AND user_id = ${inputUserId}; 
          `;

    const results = await this.pool.query(sql);
    return results;
  }

  async getAudios(inputUserId) {
    const sql = `
          SELECT * FROM audios WHERE user_id = ${inputUserId}; 
          `;

    const results = await this.pool.query(sql);
    return results;
  }

  async deleteAudio(inputFilename, inputUserId) {
    const sql = `
          DELETE FROM audios WHERE filename = '${inputFilename}' AND user_id = ${inputUserId}; 
          `;

    const results = await this.pool.query(sql);
    return results;
  }

}
