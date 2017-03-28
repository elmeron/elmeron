import express from 'express';
import path from 'path';

const server = express();

server.use(express.static(path.join(__dirname, 'static')));

server.listen(3000, () => console.log('Elmeron Web Server running on port 3000'));
