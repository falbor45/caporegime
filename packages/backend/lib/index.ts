import express from 'express';

const app = express();
const PORT = 8040;

app.get('/', (req, res) => res.send('Hello world!'))
app.listen(PORT, () => {
	console.log(`[server]: Server is running at http://localhost:${PORT}`);
})