import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product } from './product.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
	imports: [
		SequelizeModule.forFeature([Product]),
		ClientsModule.register([
			{
				name: 'GREETING_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://localhost:5672'],
					queue: 'book_queue'
				}
			}
		])
	],
	controllers: [ProductsController],
	providers: [ProductsService]
})
export class ProductsModule {}
