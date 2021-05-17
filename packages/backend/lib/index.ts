import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initialiseDatabase } from './loaders/initialiseDatabase';
import router from './api/index';

require('dotenv').config();

const app = express();
const PORT = 8040;

initialiseDatabase();

app.use(cors({ origin: '*' }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(router());

app.get('/', (req, res) => res.send('Hello world!'));

app.listen(PORT, () => {
	console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
