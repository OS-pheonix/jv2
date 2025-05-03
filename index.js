require('dotenv').config();
const { Client, Intents } = require('discord.js');
const express = require('express');

// Express server for Render
const app = express();
app.get('/', (_, res) => res.send('Alive'));
app.listen(process.env.PORT || 3000);

// Discord client setup
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Core JARVIS functionality
const jarvis = {
    bootTime: new Date(),
    
    getFaithResponse() {
        const responses = [
            "Through Christ all things are possible, Sir.",
            "Faith guides our path, even in code.",
            "His light shows us the way forward."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    getStatusResponse() {
        const uptime = Math.round((Date.now() - this.bootTime) / 1000 / 60);
        return `Systems operational, Sir. Running for ${uptime} minutes.`;
    },
    
    getDefaultResponse() {
        const responses = [
            "At your service, Sir.",
            "Standing by, Sir.",
            "Ready to assist."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
};

// Message handler
function handleMessage(message) {
    try {
        // Basic checks
        if (message.author.bot) return;
        if (!message.content.toLowerCase().includes('jarvis')) return;
        
        // User verification
        const authorName = message.author.username.toLowerCase();
        if (!authorName.includes('os-pheonix') && !authorName.includes('jay')) return;
        
        // Response logic
        const content = message.content.toLowerCase();
        let response;
        
        if (content.includes('pray') || content.includes('jesus') || content.includes('faith')) {
            response = jarvis.getFaithResponse();
        } else if (content.includes('status')) {
            response = jarvis.getStatusResponse();
        } else {
            response = jarvis.getDefaultResponse();
        }
        
        message.reply(response);
    } catch (error) {
        console.error('Message handling error:', error);
    }
}

// Event listeners
client.once('ready', () => {
    console.log('JARVIS Online - Ready to serve');
});

client.on('messageCreate', handleMessage);

// Login with basic error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => {
        console.error('Login error:', error);
        process.exit(1);
    });

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Export for testing
module.exports = { client, jarvis };
