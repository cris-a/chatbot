require('dotenv').config();
const { createProvider } = require('@bot-whatsapp/bot');

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MongoAdapter = require('@bot-whatsapp/database/mongo');
const ChatGPTClass = require('./chatgpt.class');

const MONGO_DB_NAME = 'db_bot';
const createBotGPT = async ({ provider, database }) => {
  return new ChatGPTClass(database, provider);
};

const main = async () => {
  const adapterDB = new MongoAdapter({
    dbUri: process.env.MONGODB_URI,
    dbName: MONGO_DB_NAME,
  });
  const adapterProvider = createProvider(BaileysProvider);

  createBotGPT({
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
