import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private readonly userModel: typeof User
	) {}

	async addUser(createUserDTO: CreateUserDTO): Promise<User> {
		const newUser = await this.userModel.create({
			...createUserDTO,
			password: await bcrypt.hash(createUserDTO.password, 10)
		});
		return newUser;
	}

	async findUser(username: string): Promise<User | undefined> {
		const user = await this.userModel.findOne({ where: { username } });
		return user;
	}
}
