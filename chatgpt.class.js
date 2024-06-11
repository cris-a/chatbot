require('dotenv').config();
const { CoreClass } = require('@bot-whatsapp/bot');
const promptPersonalizado = require('./prompt.js');
const { extractUserInfo } = require('./utils.js');

class ChatGPTClass extends CoreClass {
  queue = [];
  userInfo = {}; // Almacenar información del usuario
  opptionsGPT = { model: 'text-davinci-003' };
  openai = undefined;
  constructor(_database, _provider, _optionsGpt = {}) {
    super(null, _database, _provider);
    this.opptionsGPT = { ...this.opptionsGPT, ..._optionsGpt };
    this.init().then();
  }

  //   Iniciando el chatGpt

  init = async () => {
    const { ChatGPTAPI } = await import('chatgpt');
    this.openai = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  };

  handleMsg = async (ctx) => {
    const { from, body } = ctx;

    // Extrae nombre y correo del mensaje
    const { name, email } = extractUserInfo(body);

    // Guarda la información si se encuentra
    if (!this.userInfo[from]) {
      this.userInfo[from] = {}; // Inicializa el objeto si no existe
    }
    if (name) {
      this.userInfo[from].name = name;
    }
    if (email) {
      this.userInfo[from].email = email;
    }
    // Combina el prompt personalizado con el mensaje del usuario
    const mensajeCompleto = `${promptPersonalizado} ${body}`;

    const completion = await this.openai.sendMessage(mensajeCompleto, {
      conversationId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].conversationId,
      parentMessageId: !this.queue.length
        ? undefined
        : this.queue[this.queue.length - 1].id,
    });

    this.queue.push(completion);
    const parseMessage = {
      ...completion,
      answer: completion.text,
    };
    this.sendFlowSimple([parseMessage], from);
  };
}

module.exports = ChatGPTClass;
