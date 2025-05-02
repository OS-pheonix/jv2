const { Client, GatewayIntentBits, Partials } = require('discord.js');
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
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

// Express server setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('J.A.R.V.I.S online and ready to assist');
});

// Bot ready event
client.on('ready', () => {
    console.log('\n====================================');
    console.log('J.A.R.V.I.S online and ready to assist');
    console.log(`Logged in as: ${client.user.tag}`);
    console.log('Connected to servers:');
    client.guilds.cache.forEach(guild => {
        console.log(` - ${guild.name}`);
    });
    console.log('====================================\n');
});

// Message event handler with debug logging
client.on('messageCreate', async message => {
    // Debug logging
    console.log('Message received:', {
        content: message.content,
        author: message.author.tag,
        bot: message.author.bot,
        channel: message.channel.name,
        guild: message.guild?.name
    });

    // Ignore messages from bots
    if (message.author.bot) {
        console.log('Ignored bot message');
        return;
    }
    
    // Convert message to lowercase
    const content = message.content.toLowerCase();
    
    // Response logic with debug logging
    if (content.includes('hello jarvis')) {
        console.log('Matched "hello jarvis" trigger');
        try {
            const response = await message.reply('Hello! I am J.A.R.V.I.S, at your service.');
            console.log('Successfully sent response:', response.content);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});

// Start express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Web Interface Online - Port: ${port}`);
});

// Login with detailed error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Successfully logged in to Discord'))
    .catch(error => {
        console.error('Login Error:', error);
        console.log('Token used (first few characters):', process.env.DISCORD_TOKEN?.substring(0, 5) + '...');
    });

// Comprehensive error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

client.on('warn', warning => {
    console.warn('Discord client warning:', warning);
});

client.on('debug', debug => {
    console.log('Discord client debug:', debug);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
