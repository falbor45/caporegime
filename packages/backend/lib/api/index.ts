import { Router } from 'express';
import user from './routes/user/user';

export default () => {
	const app = Router();
	user(app);

	return app;
};
