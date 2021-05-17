import argon2 from 'argon2';

import { queryGetUsers } from '../../db/queries/users/queryGetUsers';
import { queryInsertUser } from '../../db/queries/users/queryInsertUser';

export class UserService {
	username: string;
	email: string;
	password: string;

	constructor(user: { username: string; email?: string; password: string }) {
		this.username = user.username;
		this.email = user.email ?? '';
		this.password = user.password;
	}

	public async getUser() {
		try {
			const response = await queryGetUsers(
				{ username: this.username, email: this.email },
				'and',
			);

			const { password, activated, ...safeFields } = response.rows[0];
			return safeFields;
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
}
