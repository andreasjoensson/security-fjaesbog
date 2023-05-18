var amqp = require("amqplib/callback_api");
require("dotenv").config();

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

function createPostMessage(communityId, postId) {
  amqp.connect(process.env.AMQP_URL, function (error0, connection) {
    if (error0) {
      console.error("Fejl ved oprettelse af forbindelse til RabbitMQ:", error0);
      return;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        console.error("Fejl ved oprettelse af RabbitMQ-kanal:", error1);
        return;
      }

      const queueName = "createPostQueue";

      channel.assertQueue(queueName, { durable: true });

      console.log("Creating new post");

      const message = JSON.stringify({ communityId, postId });
      channel.sendToQueue(queueName, Buffer.from(message));
    });
  });
}

function getCommunityByIdName(communityName) {
  return new Promise((resolve, reject) => {
    amqp.connect(process.env.AMQP_URL, function (error0, connection) {
      if (error0) reject(error0);

      connection.createChannel(function (error1, channel) {
        if (error1) reject(error1);

        channel.assertQueue("", { exclusive: true }, function (error2, q) {
          if (error2) reject(error2);

          var correlationId = generateUuid();

          console.log("Requesting community ID");

          channel.consume(
            q.queue,
            function (msg) {
              if (msg.properties.correlationId === correlationId) {
                console.log(
                  "Received community ID: %s",
                  msg.content.toString()
                );
                connection.close();
                resolve(msg.content.toString());
              }
            },
            { noAck: true }
          );

          channel.sendToQueue("rpc_queue", Buffer.from(communityName), {
            correlationId: correlationId,
            replyTo: q.queue,
          });
        });
      });
    });
  });
}

module.exports = { getCommunityByIdName, createPostMessage };
