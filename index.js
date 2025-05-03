const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { config } = require('dotenv');
config();

// Initialize the client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Core system configuration
const system = {
    memory: new Collection(),  // Initialize memory collection properly
    version: '1.0.0',
    startTime: Date.now(),
    
    // Initialize core functions
    init() {
        this.memory.set('bootTime', this.startTime);
        this.memory.set('status', 'online');
        return this;
    }
};

// Event handler for when the bot is ready
client.once('ready', () => {
    console.log(`System initialized - Version ${system.version}`);
    system.init();
});

// Message handler
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    try {
        // Store message in memory
        system.memory.set(`msg_${message.id}`, {
            content: message.content,
            author: message.author.id,
            timestamp: Date.now()
        });
        
        // Process message
        await message.reply('Message received and processed.');
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

// Error handler
client.on('error', error => {
    console.error('Client error:', error);
    system.memory.set('lastError', {
        timestamp: Date.now(),
        error: error.message
    });
});

// Start the client
client.login(process.env.TOKEN)
    .catch(error => console.error('Login failed:', error));

module.exports = { client, system };
