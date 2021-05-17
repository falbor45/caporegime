import { Router } from 'express';
import * as z from 'zod';
import { validateBody } from 'zod-express-guard/dist';
import { UserService } from '../../../services/user/UserService';

const route = Router();

export default (app: Router) => {
	app.use('/users', route);

	route.post(
		'/signUp',
		validateBody(
			z.object({
				username: z.string().min(3).max(24),
				email: z.string().email(),
				password: z.string().min(6).max(64),
			}),
			async (req, res) => {
				try {
					const service = new UserService(req.body);

					const canUserRegister = await service.getCanUserRegister();

					if (!canUserRegister) {
						return res.status(400).send('You are registered already');
					}

					await service.registerUser();

					const user = await service.getUser();

					return res.status(201).send(JSON.stringify(user));
				} catch (err) {
					return res.status(500).send(err);
				}
			},
		),
	);
};
