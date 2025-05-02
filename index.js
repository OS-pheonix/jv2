const { Client, GatewayIntentBits, Events } = require('discord.js');
const express = require('express');

// Create Discord client with ALL necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
    ]
});

// Express server setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('J.A.R.V.I.S online and ready to assist');
});

// Bot ready event
client.on(Events.ClientReady, () => {
    console.log('\n====================================');
    console.log('J.A.R.V.I.S online and ready to assist');
    console.log(`Logged in as: ${client.user.tag}`);
    console.log('Connected to servers:');
    client.guilds.cache.forEach(guild => {
        console.log(` - ${guild.name}`);
    });
    console.log('====================================\n');
});

// Message event handler
client.on(Events.MessageCreate, async message => {
    // Debug logging
    console.log(`Received message: "${message.content}" from ${message.author.tag}`);

    // Skip if message is from a bot
    if (message.author.bot) return;

    // Convert message to lowercase for easier matching
    const content = message.content.toLowerCase();

    try {
        // Basic chat responses
        if (content.includes('hello jarvis')) {
            await message.reply('Hello! I am J.A.R.V.I.S, at your service.');
        } else if (content.includes('hey jarvis')) {
            await message.reply('Hey there! How can I assist you today?');
        } else if (content.includes('jarvis')) {
            await message.reply('Yes, I am here. How may I help you?');
        }
    } catch (error) {
        console.error('Error responding to message:', error);
    }
});

// Start express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Web Interface Online - Port: ${port}`);
});

// Login with error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Successfully logged in to Discord'))
    .catch(error => {
        console.error('Login Error:', error);
        console.log('Bot Token Status:', process.env.DISCORD_TOKEN ? 'Present' : 'Missing');
    });

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
