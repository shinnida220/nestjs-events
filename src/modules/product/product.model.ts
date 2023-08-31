import { Column, CreatedAt, DeletedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { IsAlpha, IsNumber, IsString, IsBoolean } from 'class-validator';

@Table({ tableName: 'products' })
export class Product extends Model {
	@IsAlpha()
	@Column
	name: string;

	@IsString()
	@Column
	description: string;

	@Column
	image: string;

	@IsNumber()
	@Column
	price: number;

	@IsString()
	@Column
	category: string;

	@IsBoolean()
	@Column({ defaultValue: true })
	isActive: boolean;

	@CreatedAt
	createdAt: Date;

	@UpdatedAt
	updatedAt: Date;

	@DeletedAt
	deletedAt: Date;
}
