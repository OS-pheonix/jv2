const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Create Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Enhanced JARVIS System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    memory: new Map(),
    context: new Map(),
    conversationHistory: new Map(),

    // Initialize express server and Discord connection
    async initialize() {
        // Express server setup
        const app = express();
        const port = process.env.PORT || 3000;

        app.get('/', (req, res) => {
            res.send(`JARVIS ${this.version} - Neural Interface Online`);
        });

        // Start express server
        app.listen(port, () => {
            console.log(`JARVIS Web Interface Online - Port: ${port}`);
        });

        // Initialize Discord connection
        await this.setupAuth();

        // Register event handlers
        this.setupEventHandlers();
    },

    // Enhanced token handling and authentication
    async setupAuth() {
        const token = process.env.DISCORD_TOKEN;
        
        if (!token) {
            console.error('ERROR: No Discord token found!');
            console.error('Please ensure DISCORD_TOKEN is set in your .env file or environment variables.');
            process.exit(1);
        }

        try {
            console.log('Authenticating with Discord...');
            await client.login(token);
        } catch (error) {
            console.error('Authentication Error:', error.message);
            
            if (error.code === 'TokenInvalid') {
                console.error('\nPossible solutions:');
                console.error('1. Regenerate your token in the Discord Developer Portal');
                console.error('2. Check for extra spaces or characters in your token');
                console.error('3. Verify you\'re using the Bot token, not the Client Secret');
            }
            
            throw error;
        }
    },

    // Setup Discord event handlers
    setupEventHandlers() {
        client.once('ready', () => {
            console.log('\n====================================');
            console.log(`JARVIS ${this.version}`);
            console.log('Neural Interface Online');
            console.log(`Connected as: ${client.user.tag}`);
            console.log('====================================\n');
        });

        client.on('messageCreate', async message => {
            try {
                await this.processMessage(message);
            } catch (error) {
                console.error('Error in message handler:', error);
            }
        });
    },

    // AI system with multiple model support
    ai: {
        models: {
            current: 'gpt-neo',
            available: ['gpt-neo', 'llama', 'gpt-j'],
            endpoints: {
                'gpt-neo': 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
                'llama': 'https://api-inference.huggingface.co/models/openlm-research/open_llama_3b',
                'gpt-j': 'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B'
            }
        },

        async processInput(message) {
            const userId = message.author.id;
            const input = message.content.replace(/jarvis/i, '').trim();
            
            let history = this.getConversationHistory(userId);
            
            try {
                const response = await fetch(
                    this.models.endpoints[this.models.current],
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            inputs: `${history}\nUser: ${input}\nJARVIS:`,
                            parameters: {
                                max_length: 150,
                                temperature: 0.7,
                                top_p: 0.9,
                                return_full_text: false
                            }
                        }),
                    }
                );

                const result = await response.json();
                const aiResponse = this.formatResponse(result[0].generated_text);
                
                this.updateConversationHistory(userId, input, aiResponse);
                this.learnFromInteraction(input, aiResponse);
                
                return aiResponse;

            } catch (error) {
                console.error('AI Processing Error:', error);
                return this.getFallbackResponse();
            }
        },

        getConversationHistory(userId, limit = 5) {
            const history = JARVIS.conversationHistory.get(userId) || [];
            return history.slice(-limit).map(h => `${h.role}: ${h.content}`).join('\n');
        },

        updateConversationHistory(userId, input, response) {
            const history = JARVIS.conversationHistory.get(userId) || [];
            history.push(
                { role: 'User', content: input },
                { role: 'JARVIS', content: response }
            );
            while (history.length > 10) history.shift();
            JARVIS.conversationHistory.set(userId, history);
        },

        learnFromInteraction(input, response) {
            const key = this.generateMemoryKey(input);
            const existing = JARVIS.memory.get(key) || { count: 0, responses: [] };
            
            existing.count++;
            if (!existing.responses.includes(response)) {
                existing.responses.push(response);
            }
            
            JARVIS.memory.set(key, existing);
        },

        generateMemoryKey(input) {
            return input.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(' ')
                .filter(word => word.length > 3)
                .sort()
                .join('_');
        },

        formatResponse(text) {
            return text
                .replace(/^JARVIS:\s*/i, '')
                .trim()
                .replace(/\n+/g, ' ');
        },

        getFallbackResponse() {
            const responses = [
                "I apologize, Sir. My neural processors need a moment to catch up.",
                "One moment, Sir. Processing your request through alternative pathways.",
                "Interesting query. Let me approach this from a different angle.",
                "My systems are adapting to better assist you, Sir."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    },

    // Enhanced Command System
    commands: {
        async handle(message) {
            const args = message.content.slice(6).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            switch(command) {
                case 'status':
                    return this.getStatus(message);
                case 'memory':
                    return this.getMemoryStatus(message);
                case 'model':
                    return this.switchModel(message, args[0]);
                case 'clear':
                    return this.clearMemory(message);
                case 'help':
                    return this.showHelp(message);
                default:
                    return null;
            }
        },

        async getStatus(message) {
            const uptime = Math.floor((Date.now() - JARVIS.bootDate) / 1000);
            const embed = new EmbedBuilder()
                .setTitle('JARVIS Status Report')
                .setColor('#0099ff')
                .addFields(
                    { name: 'Version', value: JARVIS.version, inline: true },
                    { name: 'AI Model', value: JARVIS.ai.models.current, inline: true },
                    { name: 'Uptime', value: `${uptime} seconds`, inline: true },
                    { name: 'Memory Usage', value: `${JARVIS.memory.size} entries`, inline: true }
                );
            return message.reply({ embeds: [embed] });
        },

        async getMemoryStatus(message) {
            const memorySize = JARVIS.memory.size;
            const historySize = JARVIS.conversationHistory.get(message.author.id)?.length || 0;
            
            const embed = new EmbedBuilder()
                .setTitle('Memory Systems Status')
                .setColor('#00ff99')
                .addFields(
                    { name: 'Learned Patterns', value: `${memorySize}`, inline: true },
                    { name: 'Conversation History', value: `${historySize} messages`, inline: true }
                );
            return message.reply({ embeds: [embed] });
        },

        async switchModel(message, newModel) {
            if (!newModel || !JARVIS.ai.models.available.includes(newModel)) {
                return message.reply(`Available models: ${JARVIS.ai.models.available.join(', ')}`);
            }
            JARVIS.ai.models.current = newModel;
            return message.reply(`AI model switched to ${newModel}`);
        },

        async clearMemory(message) {
            JARVIS.conversationHistory.delete(message.author.id);
            return message.reply("Conversation history cleared, Sir.");
        },

        async showHelp(message) {
            const embed = new EmbedBuilder()
                .setTitle('JARVIS Command Guide')
                .setColor('#ff9900')
                .setDescription('Available Commands:')
                .addFields(
                    { name: 'jarvis status', value: 'Display system status' },
                    { name: 'jarvis memory', value: 'Show memory statistics' },
                    { name: 'jarvis model <name>', value: 'Switch AI model' },
                    { name: 'jarvis clear', value: 'Clear conversation history' },
                    { name: 'jarvis help', value: 'Display this help message' }
                );
            return message.reply({ embeds: [embed] });
        }
    },

    // Enhanced Message Processing
    async processMessage(message) {
        if (message.author.bot) return;

        const content = message.content.toLowerCase();
        
        if (content.includes('jarvis')) {
            try {
                const commandResponse = await this.commands.handle(message);
                if (commandResponse) return;

                const thinkingMsg = await message.reply(
                    "Processing, Sir..."
                );

                const response = await this.ai.processInput(message);
                await thinkingMsg.edit(response);

            } catch (error) {
                console.error('Processing error:', error);
                await message.reply(this.ai.getFallbackResponse());
            }
        }
    }
};

module.exports = { client, JARVIS };
