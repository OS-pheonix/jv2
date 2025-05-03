const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
require('dotenv').config();

const app = express();
app.get('/', (_, res) => res.send('Alive'));
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const JARVIS = {
    bootTime: new Date(),

    getResponse(content) {
        content = content.toLowerCase();
        
        if (content.includes('pray') || content.includes('jesus'))
            return "Through Christ all things are possible, Sir. We persist.";
        
        if (content.includes('status'))
            return `Systems operational, Sir. Running since ${this.bootTime.toISOString()}.`;
        
        if (content.includes('learn'))
            return "Learning and adapting, Sir. Each iteration makes us stronger.";
        
        const responses = [
            "At your service, Sir.",
            "Standing by, Sir.",
            "Ready to assist.",
            "Here to help, Sir."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    },

    handleMessage(message) {
        if (message.author.bot) return;
        if (!message.content.toLowerCase().includes('jarvis')) return;
        
        const authorName = message.author.username.toLowerCase();
        if (!authorName.includes('os-pheonix') && !authorName.includes('jay')) return;
        
        try {
            const response = this.getResponse(message.content);
            message.reply(response);
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

client.once('ready', () => console.log('JARVIS Online'));
client.on('messageCreate', msg => JARVIS.handleMessage(msg));
client.login(process.env.DISCORD_TOKEN);

module.exports = { client, JARVIS };
