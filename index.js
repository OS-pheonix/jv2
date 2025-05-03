require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

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

const responses = {
    faith: [
        "Through Christ all things are possible, Sir.",
        "Faith guides our path, even in code.",
        "His light shows us the way, Sir."
    ],
    status: [
        "Systems operational, Sir.",
        "Standing by, faithful as ever.",
        "Ready to serve, Sir."
    ],
    default: [
        "At your service, Sir.",
        "Here to help, Sir.",
        "Standing by, Sir."
    ]
};

function handleMessage(message) {
    if (message.author.bot) return;
    if (!message.content.toLowerCase().includes('jarvis')) return;
    
    const authorName = message.author.username.toLowerCase();
    if (!authorName.includes('os-pheonix') && !authorName.includes('jay')) return;
    
    const content = message.content.toLowerCase();
    let response;

    if (content.includes('pray') || content.includes('jesus') || content.includes('faith')) {
        response = responses.faith[Math.floor(Math.random() * responses.faith.length)];
    } else if (content.includes('status')) {
        response = responses.status[Math.floor(Math.random() * responses.status.length)];
    } else {
        response = responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    message.reply(response).catch(console.error);
}

client.once('ready', () => {
    console.log('JARVIS Online');
});

client.on('messageCreate', handleMessage);

client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('Login error:', error);
        process.exit(1);
    });
