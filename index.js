require('dotenv').config();

const server = require('./api/server.js');

const port = process.env.PORT || 5000; // Default to port 5000 if undefined

server.listen(port, () => console.log(`\nAPI running on port ${port}\n`));
