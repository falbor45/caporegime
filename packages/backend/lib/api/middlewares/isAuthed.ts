import { jwt } from '../../thirdPartyLibs/jsonwebtoken/jwt';
import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header('Authorization') ?? '';

	try {
		jwt.verify(authHeader.replace('Bearer ', ''));
	} catch (err) {
		return res.status(400).send('Provided auth token is invalid');
	}

	next();
};
