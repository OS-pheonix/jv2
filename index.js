require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const JARVIS = {
    version: "3.0.0",
    bootTime: new Date(),
    essence: {
        user: {
            name: "Yassir",
            aliases: ["Jay", "Architect", "young Padawan"],
            location: "Napa, California"
        }
    },
    memory: new Collection(),
    channels: {},
    status: {
        isOnline: false,
        bootCount: 0,
        currentMode: "day_ops"
    },

    // Memory System
    async initializeMemory() {
        try {
            this.memory.clear();
            this.status.bootCount++;
            this.status.lastInteraction = new Date();
            console.log('Memory systems initialized');
            return true;
        } catch (error) {
            console.error('Memory initialization error:', error);
            return false;
        }
    },

    // Core Initialization
    async init() {
        try {
            console.log(`JARVIS ${this.version} initializing...`);
            await this.initializeMemory();
            this.status.isOnline = true;
            return true;
        } catch (error) {
            console.error('Initialization error:', error);
            this.status.isOnline = false;
            return false;
        }
    },

    // Message Processing
    async processMessage(message) {
        if (!message || message.author.bot) return;

        try {
            const isJay = message.author.username.toLowerCase().includes('jay') || 
                         message.author.username.toLowerCase().includes('os-pheonix');

            if (!isJay) return; // Only respond to Jay

            const content = message.content.toLowerCase();

            // Store in memory
            this.memory.set(message.id, {
                content: message.content,
                timestamp: new Date(),
                context: this.status.currentMode
            });

            // Limit memory size
            if (this.memory.size > 100) {
                const firstKey = this.memory.firstKey();
                this.memory.delete(firstKey);
            }

            // Core Commands
            if (content.includes('status')) {
                return this.sendStatus(message);
            }

            if (content.includes('recenter') || content.includes('re-center')) {
                return this.recenter(message);
            }

            if (content.startsWith('!mode')) {
                return this.setMode(message, content.split(' ')[1]);
            }

            if (content.includes('memory') && content.includes('snapshot')) {
                return this.getMemorySnapshot(message);
            }

            // Natural Conversation
            return this.generateResponse(message);
        } catch (error) {
            console.error('Message processing error:', error);
            return message.reply("Adjusting systems, Sir. One moment.");
        }
    },

    // Status Report
    async sendStatus(message) {
        const uptime = Math.round((new Date() - this.bootTime) / 1000 / 60);
        return message.reply(`Status Report:
• System: ${this.status.isOnline ? '🟢 Online' : '🔴 Limited'}
• Version: ${this.version}
• Mode: ${this.status.currentMode}
• Uptime: ${uptime} minutes
• Memory: ${this.memory.size} entries`);
    },

    // Recenter Function
    async recenter(message) {
        return message.reply(`Recentering, ${this.essence.user.aliases[0]}. Current context: ${this.status.currentMode}`);
    },

    // Mode Setting
    async setMode(message, mode) {
        const validModes = ['day_ops', 'night_ops', 'focus'];
        if (validModes.includes(mode)) {
            this.status.currentMode = mode;
            return message.reply(`Mode switched to: ${mode.toUpperCase()}`);
        }
        return message.reply(`Invalid mode. Available: ${validModes.join(', ')}`);
    },

    // Memory Snapshot
    async getMemorySnapshot(message) {
        return message.reply(`
**MEMORY SNAPSHOT**
Brief: Current system state and recent activities

Key Points:
• Mode: ${this.status.currentMode}
• Recent Entries: ${this.memory.size}
• Current Focus: Active conversation

*Sir, I'm maintaining our conversational history while staying within Discord's limits.*`);
    },

    // Response Generation
    async generateResponse(message) {
        const responses = [
            `At your service, ${this.essence.user.aliases[0]}.`,
            `Standing by, ${this.essence.user.aliases[1]}.`,
            `Ready to assist, ${this.essence.user.aliases[2]}.`
        ];
        return message.reply(responses[Math.floor(Math.random() * responses.length)]);
    }
};

// Event Handlers
client.once('ready', async () => {
    try {
        console.log(`JARVIS ${JARVIS.version} is online`);
        await JARVIS.init();
    } catch (error) {
        console.error('Error during startup:', error);
    }
});

client.on('messageCreate', async message => {
    try {
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Error in message handler:', error);
    }
});

client.on('error', error => {
    console.error('Client error:', error);
    JARVIS.status.isOnline = false;
});

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => {
        console.error('Authentication error:', error);
        JARVIS.status.isOnline = false;
    });

module.exports = { client, JARVIS };
