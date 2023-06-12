const amqp = require("amqplib/callback_api");
const { getAllUserEmails, getAllUsers } = require("../util");
require("dotenv").config();

const listenForUsersRequest = async () => {
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

      const requestQueue = "getUserListRequestQueue";
      const responseQueue = "getUserListResponseQueue";

      channel.assertQueue(requestQueue, { durable: true });
      channel.assertQueue(responseQueue, { durable: true });

      console.log("Listening for user list requests");

      channel.consume(requestQueue, async function (message) {
        try {
          const userList = await getAllUsers();
          const messageContent = JSON.stringify(userList);

          // Publish the user list as a response to the response queue
          channel.sendToQueue(responseQueue, Buffer.from(messageContent), {
            correlationId: message.properties.correlationId,
          });

          // Acknowledge the message
          channel.ack(message);
        } catch (error) {
          console.error("Error fetching user list:", error);
        }
      });
    });
  });
};

const listenForUserListRequest = () => {
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

      const requestQueue = "getUserEmailsRequestQueue";
      const responseQueue = "getUserEmailsResponseQueue";

      channel.assertQueue(requestQueue, { durable: true });
      channel.assertQueue(responseQueue, { durable: true });

      console.log("Listening for user emails requests");

      channel.consume(requestQueue, async function (message) {
        const communityId = message.content.toString();

        try {
          const userEmails = await getAllUserEmails(); // Implement the logic to fetch user emails by community

          const messageContent = JSON.stringify(userEmails);
          const responseProperties = {
            correlationId: message.properties.correlationId,
          };

          channel.sendToQueue(
            responseQueue,
            Buffer.from(messageContent),
            responseProperties
          );

          channel.ack(message);
        } catch (error) {
          console.error("Error fetching user emails:", error);
        }
      });
    });
  });
};

const newUserCreatedMessage = (user_id) => {
  amqp.connect(process.env.AMQP_URL, (err, conn) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    conn.createChannel((err, ch) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      const exchange = "user.events";
      const msg = JSON.stringify({
        type: "USER_CREATED",
        payload: { id: user_id }, // Replace with actual user ID
      });

      ch.assertExchange(exchange, "fanout", { durable: false });
      ch.publish(exchange, "", Buffer.from(msg));
      console.log(" [x] Sent %s", msg);

      // Close the channel and the connection
      ch.close(() => conn.close());
    });
  });
};

module.exports = {
  listenForUsersRequest,
  newUserCreatedMessage,
  listenForUserListRequest,
};
