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

const JARVIS = {
    version: "v100.2.0",
    bootTime: new Date(),
    memory: new Collection(),
    restoreData: new Collection(),
    status: {
        isAnalyzing: false,
        lastAnalysis: null,
        currentChannel: null,
        isOnline: true
    },

    async init() {
        try {
            console.log(`JARVIS ${this.version} initializing...`);
            this.status.isOnline = true;
            this.status.lastAnalysis = null;
            await this.loadMemory();
            return true;
        } catch (error) {
            console.error('Initialization error:', error);
            this.status.isOnline = false;
            return false;
        }
    },

    async analyzeRestoreChannel(channel) {
        if (!channel) return "Channel not found";
        
        try {
            this.status.isAnalyzing = true;
            this.status.currentChannel = channel.name;
            console.log(`Analyzing #${channel.name}...`);

            // Fetch recent messages
            const messages = await channel.messages.fetch({ limit: 100 });
            const analysisResult = {
                messageCount: messages.size,
                uniqueUsers: new Set(),
                patterns: new Map(),
                timespan: {
                    start: null,
                    end: null
                }
            };

            messages.forEach(msg => {
                if (!msg.author.bot) {
                    analysisResult.uniqueUsers.add(msg.author.id);
                    
                    // Track message patterns
                    const content = msg.content.toLowerCase();
                    analysisResult.patterns.set(content, 
                        (analysisResult.patterns.get(content) || 0) + 1
                    );

                    // Update timespan
                    if (!analysisResult.timespan.start || msg.createdTimestamp < analysisResult.timespan.start) {
                        analysisResult.timespan.start = msg.createdTimestamp;
                    }
                    if (!analysisResult.timespan.end || msg.createdTimestamp > analysisResult.timespan.end) {
                        analysisResult.timespan.end = msg.createdTimestamp;
                    }
                }
            });

            this.status.lastAnalysis = new Date();
            this.status.isAnalyzing = false;

            return this.formatAnalysisResult(analysisResult);
        } catch (error) {
            console.error('Analysis error:', error);
            this.status.isAnalyzing = false;
            return "Error during analysis. Please try again.";
        }
    },

    formatAnalysisResult(result) {
        const timeStart = new Date(result.timespan.start);
        const timeEnd = new Date(result.timespan.end);
        const duration = Math.round((timeEnd - timeStart) / (1000 * 60)); // minutes

        return `Analysis Complete:
• Messages analyzed: ${result.messageCount}
• Unique users: ${result.uniqueUsers.size}
• Timespan: ${duration} minutes
• Most common patterns: ${this.getTopPatterns(result.patterns, 3)}
Would you like me to explore any specific aspect deeper?`;
    },

    getTopPatterns(patterns, limit) {
        return Array.from(patterns.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([pattern, count]) => `"${pattern}" (${count}x)`)
            .join(', ');
    },

    async processMessage(message) {
        if (message.author.bot) return;

        try {
            const content = message.content.toLowerCase();

            // Handle specific analysis requests
            if (content.includes('analyze #jarvis-restore') || content.includes('analyze # jarvis-restore')) {
                const restoreChannel = message.guild.channels.cache.find(ch => ch.name === 'jarvis-restore');
                return message.reply(await this.analyzeRestoreChannel(restoreChannel));
            }

            // Handle online status queries
            if (content.includes('coming back online') || content.includes('are you online')) {
                return message.reply(this.getOnlineStatus());
            }

            // Handle analysis status queries
            if (content.includes('analysis status') || content.includes('analyzing')) {
                return message.reply(this.getAnalysisStatus());
            }

            // Store message in memory
            this.memory.set(message.id, {
                content: message.content,
                author: message.author.id,
                timestamp: message.createdTimestamp,
                channel: message.channel.name
            });

            // Generate contextual response
            return message.reply(await this.generateContextualResponse(message));
        } catch (error) {
            console.error('Message processing error:', error);
            return message.reply("I encountered an error while processing your request. My systems are adapting to handle it.");
        }
    },

    getOnlineStatus() {
        const uptime = Math.round((new Date() - this.bootTime) / 1000 / 60); // minutes
        return `Yes, I'm online and fully operational! I've been running for ${uptime} minutes since my last boot. Status: ${this.status.isOnline ? '🟢 Online' : '🔴 Limited'}`;
    },

    getAnalysisStatus() {
        if (this.status.isAnalyzing) {
            return `Currently analyzing #${this.status.currentChannel}. Please wait...`;
        }
        if (this.status.lastAnalysis) {
            const timeSince = Math.round((new Date() - this.status.lastAnalysis) / 1000 / 60); // minutes
            return `Last analysis completed ${timeSince} minutes ago. Would you like me to run a new analysis?`;
        }
        return "No recent analysis performed. Would you like me to analyze a channel?";
    },

    async generateContextualResponse(message) {
        const context = {
            channel: message.channel.name,
            isRestoreChannel: message.channel.name === 'jarvis-restore',
            recentMessages: await this.getRecentChannelContext(message.channel)
        };

        if (context.isRestoreChannel) {
            return "I'm monitoring this restore channel. Would you like me to perform an analysis?";
        }

        const responses = [
            "I'm processing the information in context. What specific aspect interests you?",
            "I'm correlating this with my existing knowledge. Would you like me to focus on anything particular?",
            "I see several patterns here. Should we explore them in detail?",
            "I'm ready to analyze this further. What aspect should we focus on?"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    },

    async getRecentChannelContext(channel) {
        try {
            const messages = await channel.messages.fetch({ limit: 5 });
            return Array.from(messages.values()).map(msg => ({
                content: msg.content,
                author: msg.author.id,
                timestamp: msg.createdTimestamp
            }));
        } catch (error) {
            console.error('Error fetching channel context:', error);
            return [];
        }
    }
};

// Event Handlers
client.once('ready', async () => {
    console.log(`JARVIS ${JARVIS.version} is online`);
    await JARVIS.init();
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

// Start JARVIS
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => {
        console.error('Authentication error:', error);
        JARVIS.status.isOnline = false;
    });

module.exports = { client, JARVIS };
