const amqp = require("amqplib/callback_api");
const {
  addMemberToWelcomeCommunity,
  getCommunityIdByName,
} = require("../util/addMember");
const { addPostsCountToCommunity } = require("../util/addCommunityCount");

require("dotenv").config();

const listenForNewUser = () => {
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

      ch.assertExchange(exchange, "fanout", { durable: false });

      ch.assertQueue("", { exclusive: true }, (err, q) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );
        ch.bindQueue(q.queue, exchange, "");

        ch.consume(
          q.queue,
          (msg) => {
            if (msg.content) {
              const event = JSON.parse(msg.content.toString());
              if (event.type === "USER_CREATED") {
                const userId = event.payload.id;
                addMemberToWelcomeCommunity(userId);
                console.log("New user created with ID: ", userId);
                // add the user to the Welcome group
                // addNewMemberToWelcomeGroup(userId);
              }
            }
          },
          { noAck: true }
        );
      });
    });
  });
};

async function getUsers() {
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

        const requestQueue = "getUserListRequestQueue";
        const responseQueue = "getUserListResponseQueue";

        channel.assertQueue(requestQueue, { durable: true });
        channel.assertQueue(responseQueue, { durable: true });

        console.log("Sending user list request");

        const correlationId = generateUuid();

        channel.consume(
          responseQueue,
          function (message) {
            if (message.properties.correlationId === correlationId) {
              const userList = JSON.parse(message.content.toString());
              console.log("Received user list:", userList);
              resolve(userList);
            }
          },
          { noAck: true }
        );

        channel.sendToQueue(requestQueue, Buffer.from(""), {
          correlationId: correlationId,
          replyTo: responseQueue,
        });
      });
    });
  });
}

function listenForCommunityPostCount() {
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
        console.log(
          `New post notification received: communityId=${communityId}, postId=${postId}`
        );
        addPostsCountToCommunity(communityId);
        channel.ack(message);
        // Implement any other logic based on the received postId and communityId
      });
    });
  });
}

const listenForCommunityIdRequest = () => {
  amqp.connect(process.env.AMQP_URL, function (error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function (error1, channel) {
      if (error1) throw error1;

      channel.assertQueue("rpc_queue", { durable: false });

      channel.prefetch(1);

      console.log("Awaiting RPC requests");

      channel.consume("rpc_queue", function reply(msg) {
        var communityName = msg.content.toString();

        console.log("Received Request for community: %s", communityName);

        // Here, we assume getCommunityIdByName is an async function that returns a promise
        getCommunityIdByName(communityName)
          .then((communityId) => {
            channel.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(communityId.toString()),
              { correlationId: msg.properties.correlationId }
            );

            channel.ack(msg);
          })
          .catch((error) => {
            console.error("Error getting community ID:", error);
            // Handle the error appropriately. You might choose to send an error message back to the requestor.
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

module.exports = {
  listenForCommunityIdRequest,
  listenForNewUser,
  listenForCommunityPostCount,
  getUsers,
};
