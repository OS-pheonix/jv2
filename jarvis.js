const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Create Discord client with all necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Express server setup for Render
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('J.A.R.V.I.S online and ready to assist');
});

// Bot ready event with the cool message
client.on('ready', () => {
    console.log('\n====================================');
    console.log('J.A.R.V.I.S online and ready to assist');
    console.log(`Logged in as: ${client.user.tag}`);
    console.log('====================================\n');
});

// Message event handler
client.on('messageCreate', async message => {
    // Ignore messages from bots to prevent loops
    if (message.author.bot) return;
    
    // Convert message to lowercase for easier matching
    const content = message.content.toLowerCase();
    
    // Log incoming messages for debugging
    console.log(`Received message: ${content}`);
    
    // Basic response test
    if (content.includes('hello jarvis')) {
        try {
            await message.reply('Hello! I am J.A.R.V.I.S, at your service.');
            console.log('Successfully responded to hello message');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});

// Start express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Web Interface Online - Port: ${port}`);
});

// Login the bot with error handling
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to login:', error);
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

module.exports = client;
