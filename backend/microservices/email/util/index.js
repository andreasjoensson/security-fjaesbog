const { MailtrapClient } = require("mailtrap");
const { normalizeEmail } = require("validator");
require("dotenv").config();

const sendNewPostNotification = (emails) => {
  const TOKEN = process.env.TOKEN;
  const ENDPOINT = process.env.ENDPOINT;

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

  const sender = {
    email: "mailtrap@andreasmoreno.dk",
    name: "Andreas Moreno",
  };

  //Sanitize e-mails
  const sanitizedEmails = emails.map((email) => normalizeEmail(email));

  //vil ikke spamme så gør det kun med de 2 første  brugere.
  const slicedArray = sanitizedEmails.slice(0, 2);

  const recipients = slicedArray.map((email) => {
    return {
      email: email,
    };
  });

  client
    .send({
      from: sender,
      to: recipients,
      subject: "Der er blevet oprettet et nyt opslag",
      text: `hey der er blevet oprettet et nyt opslag`,
      category: "Integration Test",
    })
    .then(console.log, console.error);
};

module.exports = { sendNewPostNotification };
