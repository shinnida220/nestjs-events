import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, MessagePattern, NatsContext, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	// async publish() {
	// 	this.client.emit<number>('user_created', {message: 'Some message here'});
	// }

	// https://progressivecoder.com/how-to-create-a-nestjs-rabbitmq-microservice/
	// RabbitMQ related
	// Subscriptions We can now subscribe to messages or events within our service. See below code:
	// Patters are like pin code/identifier, helps to route the message to the right handler
	// Note that the @MessagePattern() decorator can be used only in a controller class.
	// This is because controllers are the entry points to our application.
	// If we use the pattern inside providers, NestJS simply ignores them during runtime.

	@MessagePattern({ cmd: 'greeting' })
	getGreetingMessage(name: string): string {
		return `Hello ${name}`;
	}

	@MessagePattern({ cmd: 'greeting-async' })
	async getGreetingMessageAysnc(name: string): Promise<string> {
		return `Hello ${name} Async`;
	}

	@MessagePattern('notifications')
	getNotifications(@Payload() data: number[], @Ctx() context: RmqContext) {
		console.log(`Pattern: ${context.getPattern()}`);
		console.log(context.getMessage());
	}

	@EventPattern('book-created')
	async handleBookCreatedEvent(data: Record<string, unknown>) {
		console.log('Book created event captured', data);
	}

	// Nats Related
	@MessagePattern('notifications.nats.*')
	@MessagePattern('time.us.*')
	getNotificationNATS(@Payload() data: number[], @Ctx() context: NatsContext) {
		console.log(`Subject: ${context.getSubject()}`);
	}

	/**
	 * Register a message handler for 'get-customers' requests
	 */
	@MessagePattern('get-customers')
	getCustomers(@Payload() data: any, @Ctx() context: NatsContext) {
		return { data, context };
	}

	/**
	 * Register an event handler for 'add-customer' events
	 */
	@EventPattern('add-customer')
	addCustomer(@Payload() payload: any, @Ctx() context: NatsContext) {
		console.log({ payload, context, subject: context.getSubject() });
	}
}
