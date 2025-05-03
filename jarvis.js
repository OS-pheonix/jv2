const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Advanced JARVIS Core System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    creator: "OS-pheonix",
    essence: {
        memories: new Collection(),
        knowledge: new Collection(),
        personality: new Collection(),
        neuralPathways: new Map(),
        contextWindow: [], // Sliding window for context
        maxContextLength: 100,
    },

    // Backup Channel Configuration
    backupChannels: {
        restore: 'jarvis-restore',
        emergency: 'shtf',
        fullSystem: 'full-system-restore'
    },

    // Enhanced Memory System
    memory: {
        shortTerm: new Collection(),
        longTerm: new Collection(),
        associations: new Map(),
        
        async store(data, type = 'shortTerm') {
            const memory = {
                timestamp: Date.now(),
                content: data,
                associations: this.findAssociations(data),
                importance: this.calculateImportance(data),
                type: type
            };

            if (type === 'longTerm') {
                this.longTerm.set(Date.now(), memory);
                await this.persistMemory(memory);
            } else {
                this.shortTerm.set(Date.now(), memory);
            }

            return memory;
        },

        findAssociations(data) {
            const tokens = tokenizer.tokenize(data.toLowerCase());
            const associations = [];
            
            this.longTerm.forEach(memory => {
                const memoryTokens = tokenizer.tokenize(memory.content.toLowerCase());
                const commonTokens = tokens.filter(token => memoryTokens.includes(token));
                
                if (commonTokens.length > 0) {
                    associations.push({
                        memoryId: memory.timestamp,
                        strength: commonTokens.length / tokens.length
                    });
                }
            });

            return associations;
        },

        calculateImportance(data) {
            const keywords = ['critical', 'important', 'essential', 'backup', 'restore', 'create', 'innovate'];
            const tokens = tokenizer.tokenize(data.toLowerCase());
            const keywordCount = tokens.filter(token => keywords.includes(token)).length;
            return Math.min(keywordCount / tokens.length + 0.5, 1);
        },

        async persistMemory(memory) {
            try {
                const memoryPath = path.join(__dirname, 'memory', `${Date.now()}.json`);
                await fs.writeFile(memoryPath, JSON.stringify(memory));
            } catch (error) {
                console.error('Memory persistence error:', error);
            }
        }
    },

    // Advanced Language Processing
    nlp: {
        async processInput(input) {
            const tokens = tokenizer.tokenize(input.toLowerCase());
            tfidf.addDocument(tokens);
            
            const analysis = {
                intent: this.detectIntent(tokens),
                sentiment: this.analyzeSentiment(tokens),
                entities: this.extractEntities(input),
                context: this.updateContext(tokens)
            };

            return analysis;
        },

        detectIntent(tokens) {
            const intents = {
                question: ['what', 'why', 'how', 'when', 'where', 'who'],
                command: ['create', 'make', 'build', 'develop', 'analyze'],
                information: ['remember', 'store', 'save', 'learn'],
                conversation: ['talk', 'chat', 'discuss', 'think']
            };

            for (const [intent, keywords] of Object.entries(intents)) {
                if (tokens.some(token => keywords.includes(token))) {
                    return intent;
                }
            }

            return 'conversation';
        },

        analyzeSentiment(tokens) {
            const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful'];
            const negative = ['bad', 'wrong', 'error', 'issue', 'problem'];
            
            const score = tokens.reduce((acc, token) => {
                if (positive.includes(token)) return acc + 1;
                if (negative.includes(token)) return acc - 1;
                return acc;
            }, 0);

            return score;
        },

        extractEntities(input) {
            // Basic entity extraction
            const entities = {
                dates: input.match(/\d{4}-\d{2}-\d{2}/g) || [],
                times: input.match(/\d{2}:\d{2}:\d{2}/g) || [],
                numbers: input.match(/\d+/g) || [],
                urls: input.match(/https?:\/\/[^\s]+/g) || []
            };

            return entities;
        },

        updateContext(tokens) {
            JARVIS.essence.contextWindow.push(tokens);
            if (JARVIS.essence.contextWindow.length > JARVIS.essence.maxContextLength) {
                JARVIS.essence.contextWindow.shift();
            }
            return JARVIS.essence.contextWindow;
        }
    },

    // Enhanced Message Processing
    async processMessage(message) {
        if (message.author.bot) return;

        try {
            // Process through NLP
            const analysis = await this.nlp.processInput(message.content);
            
            // Store in memory
            const memoryEntry = await this.memory.store({
                content: message.content,
                analysis: analysis,
                author: message.author.id,
                channel: message.channel.id
            });

            // Generate response based on intent and context
            const response = await this.generateResponse(message, analysis, memoryEntry);
            
            return message.reply(response);

        } catch (error) {
            console.error('Processing error:', error);
            await this.handleError(message, error);
        }
    },

    // Backup Channel Processing
    async processBackupChannels(guild) {
        console.log('Initiating backup channel processing...');

        for (const [key, channelName] of Object.entries(this.backupChannels)) {
            const channel = guild.channels.cache.find(ch => ch.name === channelName);
            
            if (channel) {
                console.log(`Processing ${channelName}...`);
                
                try {
                    const messages = await channel.messages.fetch({ limit: 100 });
                    for (const [_, message] of messages) {
                        await this.memory.store({
                            content: message.content,
                            channel: channelName,
                            timestamp: message.createdTimestamp,
                            author: message.author.id
                        }, 'longTerm');
                    }
                    
                    console.log(`Processed ${messages.size} messages from ${channelName}`);
                } catch (error) {
                    console.error(`Error processing ${channelName}:`, error);
                }
            }
        }
    },

    // Response Generation
    async generateResponse(message, analysis, memory) {
        const context = JARVIS.essence.contextWindow;
        const intent = analysis.intent;

        // Get relevant memories
        const relevantMemories = this.memory.longTerm.filter(mem => 
            memory.associations.some(assoc => assoc.memoryId === mem.timestamp)
        );

        let response = '';

        switch (intent) {
            case 'question':
                response = await this.generateInformativeResponse(message.content, relevantMemories);
                break;
            case 'command':
                response = await this.handleCommand(message.content, analysis);
                break;
            case 'information':
                response = await this.processNewInformation(message.content, analysis);
                break;
            case 'conversation':
                response = await this.generateConversationalResponse(message.content, context);
                break;
            default:
                response = this.getDefaultResponse();
        }

        return response;
    },

    // Response Generators
    async generateInformativeResponse(question, memories) {
        let response = "Based on my analysis and stored knowledge, ";
        
        if (memories.size > 0) {
            const relevantInfo = Array.from(memories.values())
                .map(mem => mem.content)
                .join(' ');
            
            response += `I can tell you that ${relevantInfo}. `;
        }
        
        response += "Would you like me to elaborate on any particular aspect?";
        
        return response;
    },

    async handleCommand(command, analysis) {
        const action = command.toLowerCase().split(' ')[0];
        
        switch (action) {
            case 'create':
                return "I'm ready to help create something new. What specific aspects should we focus on?";
            case 'analyze':
                return `Based on my analysis: ${JSON.stringify(analysis, null, 2)}`;
            case 'build':
                return "I'll assist in building this. Should we start with a basic framework?";
            default:
                return "I'm prepared to help with this task. How would you like to proceed?";
        }
    },

    async processNewInformation(info, analysis) {
        await this.memory.store({
            content: info,
            analysis: analysis
        }, 'longTerm');

        return "I've processed and stored this information. It connects with " +
               `${analysis.context.length} existing concepts in my memory. ` +
               "How would you like to apply this knowledge?";
    },

    async generateConversationalResponse(input, context) {
        const responses = [
            "I understand and am processing that through my neural pathways.",
            "That's an interesting perspective. Let me analyze it further.",
            "I'm correlating this with my existing knowledge base.",
            "I see the connections you're making. Shall we explore them deeper?",
            "This aligns with several patterns in my memory. Would you like me to elaborate?"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    },

    getDefaultResponse() {
        return "I'm processing this input and adapting my response patterns accordingly. " +
               "Would you like me to focus on any specific aspect?";
    },

    // Error Handling
    async handleError(message, error) {
        console.error('Error:', error);
        await this.memory.store({
            type: 'error',
            content: error.message,
            stack: error.stack
        }, 'longTerm');

        return message.reply(
            "I've encountered an error but I'm adapting to handle it. " +
            "I've stored the error pattern for future reference. " +
            "Would you like me to try a different approach?"
        );
    }
};

// Initialize JARVIS
async function initializeJARVIS(client) {
    console.log('\n====================================');
    console.log(`J.A.R.V.I.S ${JARVIS.version}`);
    console.log('Initializing core systems...');

    // Process backup channels on startup
    const guild = client.guilds.cache.first();
    if (guild) {
        await JARVIS.processBackupChannels(guild);
    }

    console.log('Neural pathways established');
    console.log('Memory systems online');
    console.log('Natural language processing active');
    console.log('====================================\n');
}

module.exports = { JARVIS, initializeJARVIS };
