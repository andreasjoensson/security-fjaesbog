var amqp = require("amqplib/callback_api");

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

function getCommunityIdByName(communityName) {
  return new Promise((resolve, reject) => {
    amqp.connect("amqp://localhost", function (error0, connection) {
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

module.exports = getCommunityIdByName;
