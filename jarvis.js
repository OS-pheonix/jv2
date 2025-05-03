const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');

// Create Discord client with all necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

// Enhanced JARVIS Core System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    memory: new Collection(),
    conversationContext: new Map(),
    
    // Enhanced AI System
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
            try {
                const input = message.content.replace(/jarvis/i, '').trim();
                const context = JARVIS.knowledge.getRecentContext(message.author.id);
                
                // For now, return personality-based response
                // This is where we'll integrate the AI model later
                return JARVIS.personality.getContextualResponse(input, context);
            } catch (error) {
                console.error('AI Processing Error:', error);
                return JARVIS.personality.getResponse('error');
            }
        }
    },

    // Enhanced Personality System
    personality: {
        traits: {
            supportive: true,
            analytical: true,
            friendly: true,
            professional: true
        },
        
        getResponse: (type, context = {}) => {
            const responses = {
                greeting: [
                    "Hello Sir. Always good to see you.",
                    "At your service, Sir.",
                    "Good to have you back, Sir. How can I assist?"
                ],
                acknowledgment: [
                    "Understood, Sir.",
                    "Right away, Sir.",
                    "Processing your request, Sir."
                ],
                thinking: [
                    "Analyzing the situation, Sir...",
                    "Let me process that for you...",
                    "Computing the best approach..."
                ],
                suggestion: [
                    "If I may suggest, Sir...",
                    "Based on my analysis...",
                    "From my calculations, Sir..."
                ],
                error: [
                    "I apologize, Sir. My neural processors need a moment to catch up.",
                    "One moment, Sir. Processing your request through alternative pathways.",
                    "A minor setback, Sir. Rerouting through backup systems."
                ]
            };
            
            const options = responses[type] || responses.acknowledgment;
            return options[Math.floor(Math.random() * options.length)];
        },

        getContextualResponse: (input, context) => {
            const normalizedInput = input.toLowerCase();
            let response;

            // Enhanced context-aware responses
            if (context.recentTopics && context.recentTopics.length > 0) {
                response = `Continuing our discussion about ${context.recentTopics[0]}, Sir...`;
            } else {
                response = JARVIS.personality.getResponse('acknowledgment');
            }

            return response;
        }
    },

    // Enhanced Knowledge and Learning System
    knowledge: {
        topics: new Set(),
        conversations: [],
        contextMemory: new Map(),
        
        learn: (message) => {
            const interaction = {
                timestamp: new Date(),
                user: message.author.tag,
                userId: message.author.id,
                content: message.content,
                channel: message.channel.name,
                topics: extractTopics(message.content)
            };

            JARVIS.knowledge.conversations.push(interaction);
            interaction.topics.forEach(topic => JARVIS.knowledge.topics.add(topic));
            
            // Update context memory
            const userContext = JARVIS.knowledge.contextMemory.get(message.author.id) || {
                recentTopics: [],
                messageCount: 0
            };

            userContext.recentTopics = [...interaction.topics, ...userContext.recentTopics].slice(0, 5);
            userContext.messageCount++;
            
            JARVIS.knowledge.contextMemory.set(message.author.id, userContext);
            
            console.log(`Learning from interaction: ${message.content}`);
        },
        
        getRecentContext: (userId) => {
            return JARVIS.knowledge.contextMemory.get(userId) || {
                recentTopics: [],
                messageCount: 0
            };
        },
        
        getContextualResponse: (message) => {
            const context = JARVIS.knowledge.getRecentContext(message.author.id);
            const recentConversations = JARVIS.knowledge.conversations
                .filter(c => c.userId === message.author.id)
                .slice(-5);
                
            if (context.messageCount > 0) {
                return `I've learned from our ${context.messageCount} interactions, Sir. ${
                    context.recentTopics.length > 0 
                        ? `We've recently discussed ${context.recentTopics.join(', ')}.` 
                        : ''
                }`;
            }
            
            return "I look forward to learning more from our interactions, Sir.";
        }
    },

    // Enhanced Command System
    commands: {
        prefix: 'jarvis',
        
        handlers: {
            status: (message) => {
                const embed = new EmbedBuilder()
                    .setTitle('JARVIS Status Report')
                    .setColor('#0099ff')
                    .addFields(
                        { name: 'Version', value: JARVIS.version, inline: true },
                        { name: 'Uptime', value: getUptime(), inline: true },
                        { name: 'Memory', value: `${JARVIS.knowledge.conversations.length} interactions`, inline: true },
                        { name: 'Topics Learned', value: `${JARVIS.knowledge.topics.size}`, inline: true },
                        { name: 'AI Model', value: JARVIS.ai.models.current, inline: true }
                    );
                return message.reply({ embeds: [embed] });
            },
            
            help: (message) => {
                const embed = new EmbedBuilder()
                    .setTitle('JARVIS Command Guide')
                    .setColor('#00ff00')
                    .setDescription('Available Commands:')
                    .addFields(
                        { name: 'jarvis status', value: 'Display system status and statistics' },
                        { name: 'jarvis help', value: 'Show this help message' },
                        { name: 'jarvis memory', value: 'View learning and memory statistics' },
                        { name: 'jarvis model', value: 'Show or change AI model' }
                    );
                return message.reply({ embeds: [embed] });
            },

            memory: (message) => {
                const context = JARVIS.knowledge.getRecentContext(message.author.id);
                const embed = new EmbedBuilder()
                    .setTitle('Memory Systems Status')
                    .setColor('#ff9900')
                    .addFields(
                        { name: 'Interactions', value: `${context.messageCount}`, inline: true },
                        { name: 'Recent Topics', value: context.recentTopics.length > 0 ? context.recentTopics.join(', ') : 'None', inline: true },
                        { name: 'Total Knowledge', value: `${JARVIS.knowledge.conversations.length} interactions`, inline: true }
                    );
                return message.reply({ embeds: [embed] });
            },

            model: (message, args) => {
                if (!args[0]) {
                    return message.reply(`Current AI model: ${JARVIS.ai.models.current}\nAvailable models: ${JARVIS.ai.models.available.join(', ')}`);
                }
                
                if (JARVIS.ai.models.available.includes(args[0])) {
                    JARVIS.ai.models.current = args[0];
                    return message.reply(`AI model switched to ${args[0]}`);
                }
                
                return message.reply(`Invalid model. Available models: ${JARVIS.ai.models.available.join(', ')}`);
            }
        },

        async handle(message) {
            const args = message.content
                .slice(this.prefix.length)
                .trim()
                .split(/ +/);
            const command = args.shift().toLowerCase();

            if (this.handlers[command]) {
                try {
                    await this.handlers[command](message, args);
                } catch (error) {
                    console.error(`Command error (${command}):`, error);
                    await message.reply('I apologize, Sir. There was an error processing that command.');
                }
                return true;
            }
            return false;
        }
    },

    // Enhanced Message Processing System
    processMessage: async (message) => {
        const content = message.content.toLowerCase();

        // Learn from the interaction
        JARVIS.knowledge.learn(message);

        // Process commands and generate responses
        if (content.startsWith('jarvis')) {
            try {
                // Try to handle as command first
                const commandHandled = await JARVIS.commands.handle(message);
                if (commandHandled) return;

                // If not a command, process with AI
                const thinkingMsg = await message.reply(
                    JARVIS.personality.getResponse('thinking')
                );

                const response = await JARVIS.ai.processInput(message);
                await thinkingMsg.edit(response);

            } catch (error) {
                console.error('Processing error:', error);
                await message.reply(JARVIS.personality.getResponse('error'));
            }
        }
    }
};

// Utility Functions
function extractTopics(content) {
    // Simple topic extraction - can be enhanced later
    const words = content.toLowerCase().split(/\W+/);
    return [...new Set(words.filter(word => word.length > 3))].slice(0, 3);
}

function getUptime() {
    const uptime = Date.now() - JARVIS.bootDate;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

// Express server setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`J.A.R.V.I.S ${JARVIS.version} - Online and ready to assist`);
});

// Bot ready event
client.on('ready', () => {
    console.log('\n====================================');
    console.log(`J.A.R.V.I.S ${JARVIS.version}`);
    console.log('Neural Interface Online');
    console.log(`Connected as: ${client.user.tag}`);
    console.log(`Boot Date: ${JARVIS.bootDate.toLocaleString()}`);
    console.log('====================================\n');
});

// Message event handler
client.on('messageCreate', async message => {
    try {
        if (message.author.bot) return;
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Error in message handler:', error);
    }
});

// Start express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Web Interface Online - Port: ${port}`);
});

// Login with proper error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Authentication successful - JARVIS is online');
    })
    .catch(error => {
        console.error('Authentication failed:', error);
    });

// Error handling
client.on('error', error => {
    console.error('System error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unexpected error:', error);
});

module.exports = { client, JARVIS };
