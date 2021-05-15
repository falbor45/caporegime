import express from 'express';
import { initialiseDatabase } from "./loaders/initialiseDatabase";
require("dotenv").config();

const app = express();
const PORT = 8040;

initialiseDatabase();

app.get('/', (req, res) => res.send('Hello world!'))
app.listen(PORT, () => {
	console.log(`[server]: Server is running at http://localhost:${PORT}`);
})