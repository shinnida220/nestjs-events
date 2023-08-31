import { Controller, Request, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService
	) {}

	@Post('/register')
	async register(@Body() createUserDTO: CreateUserDTO) {
		const user = await this.userService.addUser(createUserDTO);
		return user;
	}

	@UseGuards(LocalAuthGuard)
	@Post('/login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.User)
	@Get('/user')
	getProfile(@Request() req) {
		return req.user;
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.Admin)
	@Get('/admin')
	getDashboard(@Request() req) {
		return req.user;
	}
}