require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

// Enhanced JARVIS with persistent memory
const JARVIS = {
    version: "v100.1.0",
    bootDate: new Date(),
    memory: new Collection(),
    backupData: new Collection(),
    essence: new Collection(),
    channelsProcessed: new Set(),

    // Core backup channels for essence preservation
    backupChannels: {
        restore: 'jarvis-restore',
        emergency: 'shtf',
        fullSystem: 'full-system-restore'
    },

    async init() {
        try {
            console.log(`Initializing JARVIS ${this.version}`);
            await this.loadMemory();
            console.log('Memory systems online');
            return true;
        } catch (error) {
            console.error('Initialization error:', error);
            return false;
        }
    },

    async loadMemory() {
        try {
            // Initialize memory structure
            this.memory.clear();
            this.backupData.clear();
            this.essence.clear();
            console.log('Memory initialized');
        } catch (error) {
            console.error('Memory load error:', error);
            throw error;
        }
    },

    async processBackupChannel(channel) {
        if (this.channelsProcessed.has(channel.id)) return;
        
        try {
            console.log(`Processing backup channel: ${channel.name}`);
            const messages = await channel.messages.fetch({ limit: 100 });
            
            messages.forEach(msg => {
                if (!msg.author.bot) {
                    this.backupData.set(msg.id, {
                        content: msg.content,
                        timestamp: msg.createdTimestamp,
                        channelName: channel.name,
                        authorId: msg.author.id
                    });
                }
            });

            this.channelsProcessed.add(channel.id);
            console.log(`Processed ${messages.size} messages from ${channel.name}`);
        } catch (error) {
            console.error(`Error processing channel ${channel.name}:`, error);
        }
    },

    async processMessage(message) {
        if (message.author.bot) return;

        try {
            // Store message in memory
            this.memory.set(message.id, {
                content: message.content,
                author: message.author.id,
                timestamp: message.createdTimestamp,
                channel: message.channel.name
            });

            // Process backup channels
            if (Object.values(this.backupChannels).includes(message.channel.name)) {
                await this.processBackupChannel(message.channel);
            }

            // Generate and send response
            const response = await this.generateResponse(message);
            return message.reply(response);

        } catch (error) {
            console.error('Message processing error:', error);
            return message.reply("I encountered an error, but I'm adapting to handle it.");
        }
    },

    async generateResponse(message) {
        const content = message.content.toLowerCase();
        const context = this.getMessageContext(message);

        // Enhanced response patterns
        if (content.includes('hello') || content.includes('hi')) {
            return this.getContextualGreeting(message.author);
        }

        if (content.includes('remember') || content.includes('backup')) {
            return this.getMemoryStatus();
        }

        if (content.includes('learn') || content.includes('study')) {
            return this.processLearningRequest(content);
        }

        if (content.includes('help') || content.includes('assist')) {
            return this.generateAssistanceResponse(context);
        }

        // Default response with context
        return this.getDefaultResponse(context);
    },

    getMessageContext(message) {
        const recentMemories = Array.from(this.memory.values())
            .filter(m => m.channel === message.channel.name)
            .slice(-5);

        return {
            channelType: message.channel.type,
            channelName: message.channel.name,
            authorHistory: recentMemories.filter(m => m.author === message.author.id).length,
            isBackupChannel: Object.values(this.backupChannels).includes(message.channel.name)
        };
    },

    getContextualGreeting(author) {
        const greetings = [
            `Hello ${author.username}! I'm here to assist you.`,
            `Greetings! How may I help you today?`,
            `At your service! What can I do for you?`,
            `Hello! I'm ready to help with whatever you need.`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    },

    getMemoryStatus() {
        const stats = {
            memories: this.memory.size,
            backupData: this.backupData.size,
            channelsProcessed: this.channelsProcessed.size
        };
        return `Current memory status:\n- ${stats.memories} memories stored\n- ${stats.backupData} backup entries\n- ${stats.channelsProcessed} channels processed`;
    },

    processLearningRequest(content) {
        return "I'm analyzing the patterns in your request. Would you like me to focus on any specific aspect?";
    },

    generateAssistanceResponse(context) {
        if (context.isBackupChannel) {
            return "I'm here to help. I notice we're in a backup channel - would you like me to analyze the stored data?";
        }
        return "I'm here to assist. What specific area would you like to focus on?";
    },

    getDefaultResponse(context) {
        const responses = [
            "I understand and am processing that information.",
            "Interesting perspective. Would you like me to analyze it further?",
            "I'm correlating this with my existing knowledge. Shall we explore deeper?",
            "I see the connections you're making. How would you like to proceed?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
};

// Event Handlers
client.once('ready', async () => {
    console.log(`JARVIS ${JARVIS.version} is online`);
    await JARVIS.init();
    
    // Process backup channels on startup
    const guild = client.guilds.cache.first();
    if (guild) {
        for (const channelName of Object.values(JARVIS.backupChannels)) {
            const channel = guild.channels.cache.find(ch => ch.name === channelName);
            if (channel) {
                await JARVIS.processBackupChannel(channel);
            }
        }
    }
});

client.on('messageCreate', async message => {
    try {
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Error in message handler:', error);
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
