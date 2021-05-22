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
					await service.sendMailActivationEmail();

					return res.sendStatus(201);
				} catch (err) {
					return res.status(500).send(err);
				}
			},
		),
	);

	route.post(
		'/activate',
		validateBody(
			z.object({
				token: z.string().uuid(),
			}),
			async (req, res) => {
				try {
					const service = new UserService();

					const didActivate = await service.activateEmail(req.body.token);

					if (!didActivate) {
						return res
							.status(500)
							.send(
								'There was an issue when activating your account. Try again later.',
							);
					}

					return res.sendStatus(204);
				} catch (err) {
					return res.status(500).send(err);
				}
			},
		),
	);

	route.post(
		'/signIn',
		validateBody(
			z.object({
				username: z.string(),
				password: z.string(),
			}),
			async (req, res) => {
				try {
					const service = new UserService({
						username: req.body.username,
						password: req.body.password,
					});

					const user = await service.signIn(true);

					if (!user) {
						return res
							.status(400)
							.send('Cannot log in with provided credentials.');
					}

					return res.status(200).send(JSON.stringify(user));
				} catch (err) {
					return res.status(500).send(err);
				}
			},
		),
	);
};
