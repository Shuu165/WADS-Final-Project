require('dotenv').config();
const { Client } = require('pg');

const client = new Client({ connectionString: process.env.DIRECT_URL });
client.connect()
  .then(() => { console.log('Connected!'); client.end(); })
  .catch(console.error);