const config = require('./config');
const { Client } = require('pg');

const client = new Client(config.database);

client.connect();

const query = `
CREATE TABLE IF NOT EXISTS users (
    id varchar UNIQUE,
    json_data varchar
);
`;

client.query(query, (err, res) => {
   if (err) {
      console.error(err);
      return;
   }
});

module.exports.clear = async () => {
   const query = `TRUNCATE TABLE users;`;

   await new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
         if (err) {
            console.error(err);
            reject();
            return;
         }

         resolve();
      });
   });
}

module.exports.getSession = async (uid) => {
   const query = `SELECT * FROM users WHERE id = '${uid}';`;

   const r = await new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
         if (err) {
            console.error(err);
            reject();
            return;
         }

         for (let row of res.rows) {
            resolve(row['json_data']);
            return;
         }

         reject();
      });
   });

   return JSON.parse(r);
}

module.exports.updateSession = async (uid, session) => {
   const query = `UPDATE users SET json_data = '${JSON.stringify(session)}' WHERE id = '${uid}';`;

   await new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
         if (err) {
            console.error(err);
            reject();
            return;
         }

         resolve();
      });
   });
}

module.exports.newSession = async (uid, session) => {
   const query = `INSERT INTO users (id, json_data) VALUES ('${uid}', '${JSON.stringify(session)}');`;

   await new Promise((resolve, reject) => {
      client.query(query, (err, res) => {
         if (err) {
            console.error(err);
            reject();
            return;
         }

         resolve();
      });
   });
}
