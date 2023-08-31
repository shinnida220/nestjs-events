import { Column, CreatedAt, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { IsAlpha, IsEmail, IsString, IsAlphanumeric } from 'class-validator';

@Table({ tableName: 'users' })
export class User extends Model {
	@IsAlpha()
	@Column
	name: string;

	@IsString()
	@Column
	image: string;

	@IsAlphanumeric()
	@Column
	username: string;

	@IsEmail()
	@Column
	email: string;

	@Column
	password: string;

	@Column
	roles: string;

	@Column({ defaultValue: true })
	isActive: boolean;

	@CreatedAt
	createdAt: Date;

	@UpdatedAt
	updatedAt: Date;

	@DeletedAt
	deletedAt: Date;
}
