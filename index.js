const { Client, GatewayIntentBits } = require('discord.js');
const { JARVIS, initializeJARVIS } = require('./jarvis-core');

// Create client with all necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// Initialize JARVIS when client is ready
client.once('ready', async () => {
    await initializeJARVIS(client);
});

// Message handling
client.on('messageCreate', async message => {
    try {
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Critical error:', error);
    }
});

// Login with error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful - JARVIS is online'))
    .catch(console.error);
