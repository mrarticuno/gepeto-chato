const { Client, Intents } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const BOT_TOKEN = '';
const userRequestMap = new Map();
const nomesInvertidos = [
  "Amando",
  "Beatrizo",
  "Cecilio",
  "Deniso",
  "Estelo",
  "Giselo",
  "Heleno",
  "Ivono",
  "Janaino",
  "Karino",
  "Leticio",
  "Monico",
  "Nadio",
  "Sonio",
  "Ursulo",
  "Viviano",
  "Grazielo",
  "Samsungo",
  "Iphono",
  "Rito Cadilaco",
  "Microsofto",
  "Facebooko",
  "Amazono",
  "Snapchato",
  "TikToko",
  "WhatsAppo",
  "Linkedinio",
  "Netflixo",
  "Spotifyo",
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(BOT_TOKEN);

client.on('messageCreate', async message => {
  if (message.mentions.has(client.user.id) && !message.author.bot) {
    try {
      const channel = message.channel;
      console.info(channel);

      const userId = message.author.id;
      const currentTime = Date.now();
      const fiveMinutes = 300000; // 5 minutes in milliseconds

      if (userRequestMap.has(userId) && currentTime - userRequestMap.get(userId) < fiveMinutes) {
        // Calculate remaining time
        const remainingTime = fiveMinutes - (currentTime - userRequestMap.get(userId));
        const remainingSeconds = Math.round(remainingTime / 1000);
        // get random index from nomesInvertidos
        const randomIndex = Math.floor(Math.random() * nomesInvertidos.length);

        message.reply(`Calma ai ${nomesInvertidos[randomIndex]} segura ${remainingSeconds} segundos, não sou um robô!`);
        return;
      }

      // Update the user's request time
      userRequestMap.set(userId, currentTime);

      const tempMessage = await message.reply('Só um minuto, estou pensando...');
      const messageContent = message.content.replace(/<@!?\d+>/, '').trim();
      const isRapidao = messageContent.includes('#rapidao');

      const apiEndpoint = 'http://localhost:11434/api/generate';

      console.info(`User ${userId} requested: ${messageContent}`);

      let response;

      if (isRapidao) {
        userRequestMap.set(userId, currentTime / 5);
        response = await axios.post(apiEndpoint, {
          model: "mistral",
          prompt: `Responda de forma breve, simples e resumida. ${messageContent}`,
          stream: false
        });
      } else {
        response = await axios.post(apiEndpoint, {
          model: "codellama:7b-instruct",
          prompt: `Você é um programador especialista que escreve códigos e explicações simples e concisos. ${messageContent}`,
          stream: false
        });
      }

      tempMessage.edit(`<@${userId}> ${response.data.response}`);
    } catch (error) {
      tempMessage.edit("nao faço ideia kkkk");
      console.error(error);
    }
  }
});
