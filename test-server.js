import express from 'express';
const app = express();
const PORT = 3001;

app.get('/', (req, res) => res.send('Hello'));

const server = app.listen(PORT, () => {
	console.log(`Test server running on ${PORT}`);
});

process.on('exit', (code) => console.log('Exit w/ code:', code));
