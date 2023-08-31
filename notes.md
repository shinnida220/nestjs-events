## Hybrid Application

Since we will have a rest api and a microservice instance
telnet localhost 4222

### Setup NATS

https://docs.nats.io/running-a-nats-service/nats_docker/nats-docker-tutorial

A Vocabulary for Transporter Use Cases
With this in mind, we can give names to the two different types of messages our system handles, and also describe the roles of the participants in those messages. Don't worry, we're almost done with the preliminaries! These terms will all become second nature pretty quickly, but it turns out to be extremely useful to have a vocabulary that will let us quickly navigate a bunch of similar-looking data flow diagrams, and keep track of where our custom code fits in!

The first kind of message we can exchange based on the above capabilities is called an event. Any given component participating in event-based messaging can be either:

an event emitter - meaning it publishes a message with a topic (and an optional payload). An event emitter is a pure message publisher.
an event subscriber - meaning it registers interest in a topic, and receives messages (forwarded by the broker) when a message matching that topic is published by an emitter.
The second kind of message we can exchange is called a request/response message. In this exchange, a participating component can be either:

a requestor - meaning it publishes a message it intends to be treated as a request, and it also takes the conventional steps described above — namely, subscribing to a response topic and including that response topic in the message it publishes.
a responder - meaning it subscribes to a topic it intends to treat as an incoming request, it produces a result, and it publishes a response, including the result payload, to the response topic it received on the inbound request.

### Repo-Link

https://github.com/johnbiundo/nest-nats-sample#sample-repository-for-nestnatsmicroservice-article-series

# https://www.npmjs.com/package/@nestjs-plugins/nestjs-nats-jetstream-transport
