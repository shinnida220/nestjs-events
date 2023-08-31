import { Inject, Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/sequelize';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product)
		private readonly productModel: typeof Product,

		@Inject('GREETING_SERVICE')
		private client: ClientProxy
	) {}

	async findAll(): Promise<Product[]> {
		return this.productModel.findAll();
	}

	findOne(id: string): Promise<Product> {
		return this.productModel.findOne({
			where: { id }
		});
	}

	async getFilteredProducts(filterProductDTO: FilterProductDTO): Promise<Product[]> {
		const { category, search } = filterProductDTO;
		let products = await this.findAll();

		if (search) {
			products = products.filter(
				(product) => product.name.includes(search) || product.description.includes(search)
			);
		}

		if (category) {
			products = products.filter((product) => product.category === category);
		}

		return products;
	}

	async addProduct(createProductDTO: CreateProductDTO): Promise<Product> {
		const newProduct = await this.productModel.create({ ...createProductDTO });
		return newProduct.save();
	}

	async updateProduct(id: string, createProductDTO: CreateProductDTO): Promise<Product> {
		let updatedProduct = await this.productModel.findByPk(id);
		if (updatedProduct) {
			updatedProduct = await updatedProduct.set(createProductDTO).save();
			return updatedProduct;
		} else {
			return;
		}
	}

	async remove(id: string): Promise<Product> {
		const product = await this.findOne(id);
		await product.destroy();
		return product;
	}

	// Message Pattern publishing
	async getHello(): Promise<Observable<any>> {
		return this.client.send({ cmd: 'greeting' }, 'Progressive Coder');
	}

	async getHelloAsync(): Promise<Observable<any>> {
		const message = await this.client.send({ cmd: 'greeting-async' }, { cmd: 'greeting-async' });
		return message;
	}

	// Publish an event
	async publishEvent() {
		this.client.emit('book-created', { bookName: 'The Way Of Kings', author: 'Brandon Sanderson' });
	}
}
