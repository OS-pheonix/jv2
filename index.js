require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Express server to keep Render alive
app.get('/', (req, res) => res.send('JARVIS Online'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Port ${PORT} active`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Simplified JARVIS core
const JARVIS = {
    bootTime: new Date(),
    status: 'online',
    
    async handleMessage(message) {
        if (message.author.bot) return;
        
        const content = message.content.toLowerCase();
        
        // Basic responses to test connectivity
        if (content.includes('jarvis')) {
            return message.reply("At your service, Sir. I'm here and functioning.");
        }
        
        if (content.includes('status')) {
            return message.reply("Systems online and responding. Port connection stable.");
        }
    }
};

// Basic event handlers
client.once('ready', () => {
    console.log('JARVIS Online');
});

client.on('messageCreate', async message => {
    try {
        await JARVIS.handleMessage(message);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Login with error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => console.error('Authentication error:', error));
