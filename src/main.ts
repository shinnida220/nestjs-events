import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OutboundResponseOmniSerializer } from './common/message-receiver/common/serializers/outbound-response-omni.serializer';
import { InboundMessageOmniDeserializer } from './common/message-receiver/common/deserializers/inbound-message-omni.deserializer';
import { OutboundResponseExternalSerializer } from './common/message-receiver/common/serializers/outbound-response-external.serializer';
import { InboundMessageExternalDeserializer } from './common/message-receiver/common/deserializers/inbound-message-external.deserializer';

async function bootstrap() {
	const PORT = 4000;
	// const app = await NestFactory.create(AppModule);
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	// microservice #1
	app.connectMicroservice<MicroserviceOptions>(
		{
			transport: Transport.NATS,
			options: {
				servers: ['nats://localhost:4222'],
				queue: 'book_queue',
				timeout: 3000,

				/**
				 * Use the "Omni" (de)serializers for simultaneously supporting
				 * external requestors and any Nest requestors which haven't been
				 * modified to serialize to the "neutral" (external) message
				 * format.
				 */
				// serializer: new OutboundResponseOmniSerializer(),
				// deserializer: new InboundMessageOmniDeserializer()

				/**
				 * Use the "External" (de)serializers for transforming messages to/from
				 * (only) an external responder
				 */
				serializer: new OutboundResponseExternalSerializer(),
				// deserializer: new InboundMessageOmniDeserializer()
				deserializer: new InboundMessageExternalDeserializer()
			}
		},
		{ inheritAppConfig: true }
	);

	// app.connectMicroservice<MicroserviceOptions>(
	// 	{
	// 		transport: Transport.RMQ,
	// 		options: {
	// 			urls: ['amqp://localhost:5672'],
	// 			queue: 'book_queue',
	// 			queueOptions: {
	// 				durable: true
	// 			},
	// 			maxConnectionAttempts: 3
	// 		}
	// 	},
	// 	{ inheritAppConfig: true }
	// );

	//
	await app.startAllMicroservices();
	app.listen(PORT, '0.0.0.0', () => {
		console.log('App running on Port 4000');
	});
}
bootstrap();
