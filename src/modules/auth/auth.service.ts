import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async validateUser(username: string, password: string): Promise<any> {
		const user = await this.userService.findUser(username);
		if (user) {
			const isPasswordMatch = await bcrypt.compare(password, user.password);
			if (isPasswordMatch) {
				return user;
			}
		}
		return null;
	}

	async login(user: any) {
		const payload = { username: user.username, sub: user._id, roles: user.roles };
		return {
			access_token: this.jwtService.sign(payload)
		};
	}
}
