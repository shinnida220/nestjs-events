import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Logger } from '@nestjs/common';
import { FilterProductDTO } from './dtos/filter-product.dto';
import { ProductsService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { OutboundMessageIdentitySerializer } from 'src/common/message-sender/common/serializers/outbound-message-identity.serializer';
import { InboundResponseIdentityDeserializer } from 'src/common/message-sender/common/deserializers/inbound-response-identity.deserializer';
import { OutboundMessageExternalSerializer } from 'src/common/message-sender/common/serializers/outbound-message-external.serializer';

@Controller('store/products')
export class ProductsController {
	logger = new Logger('ProductsController');

	@Client({
		transport: Transport.NATS,
		options: {
			url: 'nats://localhost:4222',
			queue: 'book_queue',
			debug: true,
			encoding: 'utf-8',
			verbose: true,
			/**
			 * Use the "Identity" (de)serializers for observing messages for
			 * nest-only deployment.
			 */
			serializer: new OutboundMessageIdentitySerializer()
			// serializer: new OutboundMessageExternalSerializer()
			// deserializer: new InboundResponseIdentityDeserializer()
		}
	})
	natClient: ClientProxy;

	constructor(private productService: ProductsService) {}

	@Get('/')
	async getProducts(@Query() filterProductDTO: FilterProductDTO) {
		if (Object.keys(filterProductDTO).length) {
			const filteredProducts = await this.productService.getFilteredProducts(filterProductDTO);
			return filteredProducts;
		} else {
			const allProducts = await this.productService.findAll();
			return allProducts;
		}
	}

	@Get('/:id')
	async getProduct(@Param('id') id: string) {
		const product = await this.productService.findOne(id);
		if (!product) throw new NotFoundException('Product does not exist!');
		return product;
	}

	@Post('/')
	async addProduct(@Body() createProductDTO: CreateProductDTO) {
		const product = await this.productService.addProduct(createProductDTO);
		console.log(await this.productService.getHello());

		// Publish event
		// this.productService.publishEvent();

		// this.logger.debug(`#client#emit -> topic: "add-customer"`);
		this.natClient.emit('add-customer', JSON.stringify({ ...createProductDTO }));
		// this.natClient.emit('add-customer', 'String message works');
		return product;
	}

	@Put('/:id')
	async updateProduct(@Param('id') id: string, @Body() createProductDTO: CreateProductDTO) {
		const product = await this.productService.updateProduct(id, createProductDTO);
		if (!product) throw new NotFoundException('Product does not exist!');
		return product;
	}

	@Delete('/:id')
	async deleteProduct(@Param('id') id: string) {
		const product = await this.productService.remove(id);
		if (!product) throw new NotFoundException('Product does not exist');
		return product;
	}
}
