import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';

@Module({
	exports: [UserService],
	imports: [SequelizeModule.forFeature([User])],
	providers: [UserService]
})
export class UserModule {}
