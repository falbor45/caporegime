import argon2 from 'argon2';
import nodemailer from 'nodemailer';

import { queryGetUsers } from '../../db/queries/users/queryGetUsers';
import { queryInsertUser } from '../../db/queries/users/queryInsertUser';
import { queryGetActivationTokens } from '../../db/queries/activationTokens/queryGetActivationTokens';
import { queryInsertActivationToken } from '../../db/queries/activationTokens/queryInsertActivationToken';
import { querySetActiveUser } from '../../db/queries/users/querySetActiveUser';
import { queryDeleteActivationToken } from '../../db/queries/activationTokens/queryDeleteActivationToken';
import { jwt } from '../../thirdPartyLibs/jsonwebtoken/jwt';

export class UserService {
	username: string;
	email: string;
	password: string;

	constructor(user?: { username?: string; email?: string; password?: string }) {
		this.username = user?.username ?? '';
		this.email = user?.email ?? '';
		this.password = user?.password ?? '';
	}

	public async signIn(safeFieldsOnly = true) {
		try {
			const response = await queryGetUsers({ username: this.username });

			const userRecord = response.rows[0];

			if (!userRecord) {
				return null;
			}

			if (!userRecord.activated) {
				return null;
			}

			const isPasswordValid = await argon2.verify(
				userRecord.password,
				this.password,
			);

			if (!isPasswordValid) {
				return null;
			}

			const token = jwt.sign(
				{
					sub: userRecord.id,
				},
				{
					expiresIn: '7d',
				},
			);

			if (safeFieldsOnly) {
				const { password, ...safeFields } = userRecord;

				return {
					user: safeFields,
					token: token,
				};
			}

			return userRecord;
		} catch (err) {
			console.log(err);

			return null;
		}
	}

	public async registerUser() {
		try {
			const canRegister = await this.getCanUserRegister();

			if (canRegister) {
				await this.setUserInDatabase();
				const user = await this.getUser();

				if (user?.id) {
					await this.setActivationTokenInDatabase(user.id);
				}

				return true;
			}

			return false;
		} catch (err) {
			console.log(err);

			return false;
		}
	}

	public async getCanUserRegister() {
		try {
			const response = await queryGetUsers(
				{ username: this.username, email: this.email },
				'or',
			);
			let isValid = false;

			if (response.rows.length === 0) {
				isValid = true;
			}

			return isValid;
		} catch (err) {
			console.log(err);

			return false;
		}
	}

	public async sendMailActivationEmail() {
		try {
			const users = await queryGetUsers({ email: this.email });

			if (users.rows[0]) {
				const emailActivationToken = await queryGetActivationTokens({
					userId: users.rows[0].id,
				});

				if (emailActivationToken.rows[0]?.id) {
					let transporter = nodemailer.createTransport({
						service: process.env.EMAIL_SERVICE,
						auth: {
							user: process.env.EMAIL_USER,
							pass: process.env.EMAIL_PASSWORD,
						},
					});

					await transporter.sendMail({
						from: `"Caporegime System" <${process.env.EMAIL_USER}>`,
						to: `${users.rows[0].email}`,
						subject: 'Caporegime - Your email activation link',
						html: `<b>${emailActivationToken.rows[0]?.id}</b>`,
					});

					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} catch (err) {
			console.log(err);

			return false;
		}
	}

	public async activateEmail(tokenId: string) {
		try {
			const activationTokens = await queryGetActivationTokens({ id: tokenId });

			const token = activationTokens.rows[0];

			if (token) {
				await querySetActiveUser(token.userId);
				await queryDeleteActivationToken(token.id);

				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.log(err);

			return false;
		}
	}

	private async getUser() {
		try {
			const response = await queryGetUsers(
				{ username: this.username, email: this.email },
				'and',
			);

			return response.rows[0];
		} catch (err) {
			console.log(err);

			return null;
		}
	}

	private async setUserInDatabase() {
		try {
			const hashedPassword = await argon2.hash(this.password);

			await queryInsertUser({
				username: this.username,
				email: this.email,
				password: hashedPassword,
				activated: false,
			});

			return true;
		} catch (err) {
			console.log(err);

			return false;
		}
	}

	private async setActivationTokenInDatabase(userId: string) {
		try {
			await queryInsertActivationToken(userId);

			return true;
		} catch (err) {
			console.log(err);

			return false;
		}
	}
}
