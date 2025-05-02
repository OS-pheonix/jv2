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
    res.send('Bot is running!');
});

// Bot ready event
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Message event handler
client.on('messageCreate', async message => {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Convert message to lowercase for easier matching
    const content = message.content.toLowerCase();
    
    // Basic response test
    if (content.includes('hello jarvis')) {
        try {
            await message.reply('Hello! I am J.A.R.V.I.S, at your service.');
            console.log('Responded to hello message');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});

// Start express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Login the bot
client.login(process.env.DISCORD_TOKEN);

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
