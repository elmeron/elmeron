import express from 'express';

const server = express();

server.get('/', (req, res) => res.send('Elmeron working!'));

server.listen(3000, () => console.log('Elmeron Web Server running on port 3000'));
