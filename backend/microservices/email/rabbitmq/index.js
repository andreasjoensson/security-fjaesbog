var amqp = require("amqplib/callback_api");
const { sendNewPostNotification } = require("../util");
require("dotenv").config();

//tesr

const listenForNewPosts = () => {
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

      console.log("Listening for new posts");

      channel.consume(queueName, function (message) {
        const { communityId, postId } = JSON.parse(message.content.toString());
        getUsersEmails(communityId).then((emails) => {
          console.log("emails", emails);
          sendNewPostNotification(emails);
          channel.ack(message);
        });
      });
    });
  });
};

const getUsersEmails = (communityId) => {
  return new Promise((resolve, reject) => {
    amqp.connect(process.env.AMQP_URL, function (error0, connection) {
      if (error0) {
        console.error(
          "Fejl ved oprettelse af forbindelse til RabbitMQ:",
          error0
        );
        reject(error0);
        return;
      }

      connection.createChannel(function (error1, channel) {
        if (error1) {
          console.error("Fejl ved oprettelse af RabbitMQ-kanal:", error1);
          reject(error1);
          return;
        }

        const requestQueue = "getUserEmailsRequestQueue";
        const responseQueue = "getUserEmailsResponseQueue";

        channel.assertQueue(requestQueue, { durable: true });
        channel.assertQueue(responseQueue, { durable: true });

        console.log("Sending user emails request");

        const correlationId = generateUuid();

        channel.consume(
          responseQueue,
          function (message) {
            if (message.properties.correlationId === correlationId) {
              const userEmails = JSON.parse(message.content.toString());
              console.log("Received user emails:", userEmails);
              resolve(userEmails);
            }
          },
          { noAck: true }
        );

        channel.sendToQueue(requestQueue, Buffer.from(communityId), {
          correlationId: correlationId,
          replyTo: responseQueue,
        });
      });
    });
  });
};

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

module.exports = { listenForNewPosts, getUsersEmails };
