import { default as jsonwebtoken, SignOptions } from 'jsonwebtoken';

export const jwt = {
	...jsonwebtoken,
	sign: (payload: string | Buffer | object, options?: SignOptions) => {
		if (!process.env.JWT_SECRET) {
			throw new Error('No JWT Secret found!');
		}
		return jsonwebtoken.sign(payload, process.env.JWT_SECRET, options);
	},
};
