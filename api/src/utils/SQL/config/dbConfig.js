require("dotenv").config();

const dbConfig = {
  host: '127.0.0.1',
  user: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
  dialect: 'mysql',
  logging: false,
};

module.exports = { dbConfig };
