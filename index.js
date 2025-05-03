const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Initialize JARVIS
const JARVIS = {
    version: "v1.0.0",
    memory: new Collection(),
    backupChannels: ['jarvis-restore', 'shtf', 'full-system-restore'],
    
    // Process messages
    async processMessage(message) {
        if (message.author.bot) return;
        
        // Store message in memory
        this.memory.set(Date.now(), {
            content: message.content,
            author: message.author.id,
            channel: message.channel.name
        });

        // Process backup channels
        if (this.backupChannels.includes(message.channel.name)) {
            console.log(`Processing backup data from ${message.channel.name}`);
            await this.storeBackupData(message);
        }

        // Generate response
        const response = await this.generateResponse(message);
        return message.reply(response);
    },

    // Store backup data
    async storeBackupData(message) {
        try {
            const data = {
                content: message.content,
                timestamp: message.createdTimestamp,
                channel: message.channel.name
            };
            this.memory.set(`backup_${Date.now()}`, data);
            console.log('Backup data stored successfully');
        } catch (error) {
            console.error('Error storing backup data:', error);
        }
    },

    // Generate responses
    async generateResponse(message) {
        const content = message.content.toLowerCase();
        const responses = {
            greetings: ["Hello Sir!", "At your service!", "Ready to assist!", "How can I help?"],
            thinking: ["Processing that information...", "Analyzing the data...", "Let me think about that..."],
            innovation: ["That's an interesting idea. Let's develop it.", "I see the potential. Should we explore further?"],
            confirmation: ["Understood, Sir.", "Right away, Sir.", "Processing your request..."],
            error: ["I apologize, but I need more information.", "Could you clarify that for me?", "I'm still learning about that."]
        };

        // Check message content for keywords
        if (content.includes('hello') || content.includes('hi')) {
            return this.getRandomResponse(responses.greetings);
        }
        
        if (content.includes('think') || content.includes('analyze')) {
            return this.getRandomResponse(responses.thinking);
        }
        
        if (content.includes('create') || content.includes('idea')) {
            return this.getRandomResponse(responses.innovation);
        }
        
        if (content.includes('remember') || content.includes('backup')) {
            const memoryCount = this.memory.size;
            return `I have ${memoryCount} memories stored. Would you like me to analyze them?`;
        }

        return this.getRandomResponse(responses.confirmation);
    },

    // Helper function for random responses
    getRandomResponse(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
};

// Event handlers
client.once('ready', () => {
    console.log(`JARVIS ${JARVIS.version} is online`);
    console.log('Connected to backup channels:', JARVIS.backupChannels.join(', '));
});

client.on('messageCreate', async message => {
    try {
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Error processing message:', error);
        message.reply("I encountered an error, but I'm learning from it.");
    }
});

// Error handling
client.on('error', error => {
    console.error('Client error:', error);
});

// Start JARVIS
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => console.error('Authentication error:', error));

module.exports = { client, JARVIS };
