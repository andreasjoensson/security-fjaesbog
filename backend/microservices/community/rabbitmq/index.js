const amqp = require("amqplib/callback_api");
const {
  addMemberToWelcomeCommunity,
  getCommunityIdByName,
} = require("../util/addMember");

const listenForNewUser = () => {
  amqp.connect("amqp://localhost", (err, conn) => {
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

const listenForCommunityIdRequest = () => {
  amqp.connect("amqp://localhost", function (error0, connection) {
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

module.exports = { listenForCommunityIdRequest, listenForNewUser };
