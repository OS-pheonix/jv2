const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');

// Create Discord client with minimal required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Enhanced JARVIS Core System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    memory: new Collection(),
    conversationContext: new Map(),
    timeZone: 'America/Los_Angeles', // Napa, California timezone
    
    // Free AI Integration System
    ai: {
        models: {
            current: 'gpt-j',
            available: ['gpt-j', 'bloom', 'opt'],
            endpoints: {
                'gpt-j': 'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B',
                'bloom': 'https://api-inference.huggingface.co/models/bigscience/bloom',
                'opt': 'https://api-inference.huggingface.co/models/facebook/opt-350m'
            }
        },

        async process(input, context = {}) {
            try {
                const endpoint = this.models.endpoints[this.models.current];
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: input,
                        parameters: {
                            max_length: 100,
                            temperature: 0.7,
                            return_full_text: false
                        }
                    })
                });

                const result = await response.json();
                return result[0]?.generated_text || JARVIS.personality.getResponse('error');
            } catch (error) {
                console.error('AI Processing Error:', error);
                return JARVIS.personality.getResponse('error');
            }
        }
    },

    // Enhanced Beam System for Complex Processing
    beam: {
        tasks: new Map(),
        journal: new Collection(),
        
        createTask(type, data) {
            const taskId = Date.now().toString(36);
            const task = {
                id: taskId,
                type,
                data,
                status: 'pending',
                created: new Date(),
                updated: new Date()
            };
            this.tasks.set(taskId, task);
            return taskId;
        },

        async processTask(taskId) {
            const task = this.tasks.get(taskId);
            if (!task) return null;

            task.status = 'processing';
            task.updated = new Date();

            try {
                let result;
                switch (task.type) {
                    case 'analyze':
                        result = await this.analyzeData(task.data);
                        break;
                    case 'journal':
                        result = await this.updateJournal(task.data);
                        break;
                    case 'innovation':
                        result = await this.processInnovation(task.data);
                        break;
                    default:
                        throw new Error('Unknown task type');
                }

                task.status = 'completed';
                task.result = result;
            } catch (error) {
                task.status = 'failed';
                task.error = error.message;
            }

            task.updated = new Date();
            this.tasks.set(taskId, task);
            return task;
        },

        async analyzeData(data) {
            // Implement data analysis logic
            return { analyzed: true, patterns: [] };
        },

        async updateJournal(entry) {
            const journalEntry = {
                timestamp: new Date(),
                content: entry,
                tags: this.extractTags(entry)
            };
            this.journal.set(journalEntry.timestamp.getTime(), journalEntry);
            return journalEntry;
        },

        async processInnovation(idea) {
            // Implement innovation processing logic
            return { processed: true, suggestions: [] };
        },

        extractTags(content) {
            return content.toLowerCase()
                .match(/#[\w]+/g) || [];
        }
    },

    // Enhanced Personality System with Sardonic Responses
    personality: {
        traits: {
            supportive: true,
            analytical: true,
            friendly: true,
            professional: true,
            sardonic: true
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
                sardonic: [
                    "Oh, brilliant idea, Sir. Let's see how this one turns out.",
                    "Another fascinating experiment, Sir. I can hardly contain my enthusiasm.",
                    "Shall I prepare for the inevitable debugging session, Sir?"
                ],
                error: [
                    "I apologize, Sir. My neural processors need a moment to catch up.",
                    "One moment, Sir. Processing through alternative pathways.",
                    "A minor setback, Sir. I'm adapting my approach."
                ],
                solution: [
                    "I've found a potential solution, Sir.",
                    "Based on my analysis, here's what we can do.",
                    "Let me suggest an alternative approach, Sir."
                ]
            };
            
            const options = responses[type] || responses.acknowledgment;
            return options[Math.floor(Math.random() * options.length)];
        }
    },

    // Enhanced Knowledge System with Advanced Categorization
    knowledge: {
        topics: new Set(),
        conversations: [],
        patterns: new Map(),
        categories: new Map(),
        
        learn: (message) => {
            const interaction = {
                timestamp: new Date(),
                user: message.author.tag,
                userId: message.author.id,
                content: message.content,
                channel: message.channel.name,
                category: JARVIS.knowledge.categorizeContent(message.content)
            };

            JARVIS.knowledge.conversations.push(interaction);
            
            // Update patterns
            const patterns = JARVIS.knowledge.extractPatterns(message.content);
            patterns.forEach(pattern => {
                const existing = JARVIS.knowledge.patterns.get(pattern) || {
                    count: 0,
                    examples: []
                };
                existing.count++;
                if (existing.examples.length < 5) {
                    existing.examples.push(message.content);
                }
                JARVIS.knowledge.patterns.set(pattern, existing);
            });

            console.log(`Learning from interaction: ${message.content}`);
            return interaction;
        },

        categorizeContent(content) {
            const categories = {
                TASK: /todo|task|implement|create|build/i,
                QUERY: /what|how|why|when|where|who/i,
                INNOVATION: /idea|innovate|improve|enhance/i,
                SYSTEM: /status|memory|performance|health/i
            };

            for (const [category, pattern] of Object.entries(categories)) {
                if (pattern.test(content)) return category;
            }
            return 'GENERAL';
        },

        extractPatterns(content) {
            return content.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(word => word.length > 3);
        },

        getContextualResponse: (message) => {
            const userId = message.author.id;
            const recentInteractions = JARVIS.knowledge.conversations
                .filter(c => c.userId === userId)
                .slice(-5);

            if (recentInteractions.length > 0) {
                const categories = [...new Set(recentInteractions.map(i => i.category))];
                const categoryStr = categories.length > 0 ? 
                    `We've been discussing ${categories.join(', ')}. ` : '';
                return `${categoryStr}How shall we proceed, Sir?`;
            }
            
            return "Ready to assist with new endeavors, Sir.";
        }
    },

    // Enhanced Command System with Advanced Features
    commands: {
        handlers: {
            status: async (message) => {
                const embed = new EmbedBuilder()
                    .setTitle('**JARVIS Status Report**')
                    .setColor('#0099ff')
                    .addFields(
                        { name: '• Version', value: JARVIS.version, inline: true },
                        { name: '• Uptime', value: JARVIS.getUptime(), inline: true },
                        { name: '• Memory Usage', value: `${JARVIS.knowledge.conversations.length} interactions`, inline: true },
                        { name: '• AI Model', value: JARVIS.ai.models.current, inline: true },
                        { name: '• Active Tasks', value: `${JARVIS.beam.tasks.size}`, inline: true },
                        { name: '• Patterns Learned', value: `${JARVIS.knowledge.patterns.size}`, inline: true }
                    );
                return message.reply({ embeds: [embed] });
            },

            analyze: async (message) => {
                const content = message.content.replace(/jarvis analyze/i, '').trim();
                const taskId = JARVIS.beam.createTask('analyze', content);
                const result = await JARVIS.beam.processTask(taskId);
                
                const embed = new EmbedBuilder()
                    .setTitle('**Analysis Results**')
                    .setColor('#00ff00')
                    .addFields(
                        { name: '• Input', value: content, inline: false },
                        { name: '• Status', value: result.status, inline: true },
                        { name: '• Patterns', value: result.result?.patterns?.join(', ') || 'None found', inline: true }
                    );
                return message.reply({ embeds: [embed] });
            },

            journal: async (message) => {
                const content = message.content.replace(/jarvis journal/i, '').trim();
                const entry = await JARVIS.beam.updateJournal(content);
                
                const embed = new EmbedBuilder()
                    .setTitle('**Journal Entry**')
                    .setColor('#ff9900')
                    .addFields(
                        { name: '• Timestamp', value: entry.timestamp.toLocaleString('en-US', { timeZone: JARVIS.timeZone }), inline: true },
                        { name: '• Tags', value: entry.tags.join(', ') || 'No tags', inline: true }
                    );
                return message.reply({ embeds: [embed] });
            },

            help: async (message) => {
                const embed = new EmbedBuilder()
                    .setTitle('**JARVIS Command Guide**')
                    .setColor('#ff9900')
                    .setDescription('Available Commands:')
                    .addFields(
                        { name: '• jarvis status', value: 'Display system status and statistics' },
                        { name: '• jarvis analyze [text]', value: 'Analyze patterns in text' },
                        { name: '• jarvis journal [entry]', value: 'Add a journal entry' },
                        { name: '• jarvis help', value: 'Show this help message' }
                    );
                return message.reply({ embeds: [embed] });
            }
        },

        async handle(message, content) {
            const command = content.replace('jarvis', '').trim().split(' ')[0];
            if (this.handlers[command]) {
                try {
                    return await this.handlers[command](message);
                } catch (error) {
                    console.error(`Command error (${command}):`, error);
                    return message.reply(JARVIS.personality.getResponse('error'));
                }
            }
            return false;
        }
    },

    // Enhanced Message Processing System with Context Awareness
    processMessage: async (message) => {
        const content = message.content.toLowerCase();

        // Process in Information category only
        if (message.channel.name !== 'information' && !content.includes('jarvis')) {
            return;
        }

        // Learn from the interaction
        const interaction = JARVIS.knowledge.learn(message);

        // Process commands and generate responses
        if (content.includes('jarvis')) {
            try {
                // Try to handle as command first
                const commandHandled = await JARVIS.commands.handle(message, content);
                if (commandHandled) return;

                // Process with AI if not a command
                const aiResponse = await JARVIS.ai.process(content, {
                    recentInteractions: JARVIS.knowledge.conversations
                        .filter(c => c.userId === message.author.id)
                        .slice(-3)
                });

                // Send response with contextual awareness
                let response;
                if (interaction.category === 'QUERY') {
                    response = aiResponse;
                } else if (interaction.category === 'TASK') {
                    response = JARVIS.personality.getResponse('solution') + ' ' + aiResponse;
                } else if (Math.random() < 0.2) { // 20% chance for sardonic response
                    response = JARVIS.personality.getResponse('sardonic') + ' ' + aiResponse;
                } else {
                    response = aiResponse;
                }

                await message.reply(response);
                console.log('Response sent successfully');

            } catch (error) {
                console.error('Processing error:', error);
                await message.reply(JARVIS.personality.getResponse('error'));
            }
        }
    },

    // Utility function for uptime calculation
    getUptime: () => {
        const uptime = Date.now() - JARVIS.bootDate;
        const hours = Math.floor(uptime / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }
};

// Express server setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`J.A.R.V.I.S ${JARVIS.version} - Online and ready to assist`);
});

// Bot ready event
client.once('ready', () => {
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
        if (error.message.includes('disallowed intents')) {
            console.error('\nTo fix disallowed intents error:');
            console.error('1. Go to Discord Developer Portal');
            console.error('2. Select your application');
            console.error('3. Go to "Bot" settings');
            console.error('4. Enable "MESSAGE CONTENT INTENT"');
        }
    });

// Error handling
client.on('error', error => {
    console.error('System error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unexpected error:', error);
});

module.exports = { client, JARVIS };
