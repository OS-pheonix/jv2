const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const fs = require('fs').promises;

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

// JARVIS Core System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    memory: new Collection(),
    
    // Enhanced Intelligence System
    intelligence: {
        // Conversation Memory
        shortTermMemory: [],
        longTermMemory: new Collection(),
        currentContext: null,
        activeTask: null,
        
        // Conversation State
        processingState: {
            isAnalyzing: false,
            isProcessingTask: false,
            currentTopic: null,
            depthLevel: 0
        },
        
        // Context Window Management
        contextWindow: {
            size: 10,
            current: [],
            addContext: function(message) {
                this.current.push({
                    content: message,
                    timestamp: new Date(),
                    analysis: JARVIS.intelligence.analyzeInput(message)
                });
                
                if (this.current.length > this.size) {
                    this.current.shift();
                }
            },
            getRelevantContext: function() {
                return this.current.map(c => c.analysis);
            }
        },
        
        // Smart Input Analysis
        analyzeInput: (input) => {
            const analysis = {
                intent: JARVIS.intelligence.detectIntent(input),
                entities: JARVIS.intelligence.extractEntities(input),
                sentiment: JARVIS.intelligence.analyzeSentiment(input),
                complexity: JARVIS.intelligence.assessComplexity(input),
                topics: JARVIS.intelligence.identifyTopics(input),
                context: JARVIS.intelligence.determineContext(input)
            };
            
            return analysis;
        },
        
        // Intent Detection
        detectIntent: (input) => {
            const intents = {
                question: /\b(what|how|why|when|where|who|can you|could you)\b/i,
                command: /\b(do|make|create|show|find|help|analyze)\b/i,
                statement: /\b(is|are|was|were|will|should)\b/i,
                reflection: /\b(think|feel|believe|wonder|consider)\b/i
            };
            
            for (const [intent, pattern] of Object.entries(intents)) {
                if (pattern.test(input)) return intent;
            }
            return 'conversation';
        },
        
        // Entity Extraction
        extractEntities: (input) => {
            const entities = {
                technical: /\b(code|system|program|function|data|server|api)\b/i,
                conceptual: /\b(idea|concept|theory|approach|method|strategy)\b/i,
                action: /\b(build|create|develop|implement|design|analyze)\b/i,
                project: /\b(beam|jarvis|bot|ai|assistant)\b/i
            };
            
            let found = {};
            for (const [type, pattern] of Object.entries(entities)) {
                const matches = input.match(pattern);
                if (matches) found[type] = matches[0];
            }
            return found;
        },
        
        // Advanced Response Generation
        generateResponse: (input, context) => {
            // Get current conversation state
            const state = JARVIS.intelligence.processingState;
            const analysis = JARVIS.intelligence.analyzeInput(input);
            
            // Add to context window
            JARVIS.intelligence.contextWindow.addContext(input);
            
            // Generate appropriate response based on analysis
            let response = JARVIS.intelligence.constructResponse(analysis, context);
            
            // Add personality layer
            response = JARVIS.intelligence.addPersonality(response);
            
            return response;
        },
        
        // Response Construction
        constructResponse: (analysis, context) => {
            const intent = analysis.intent;
            const entities = analysis.entities;
            
            // Build response based on intent and entities
            switch(intent) {
                case 'question':
                    return JARVIS.intelligence.handleQuestion(analysis);
                case 'command':
                    return JARVIS.intelligence.handleCommand(analysis);
                case 'reflection':
                    return JARVIS.intelligence.handleReflection(analysis);
                default:
                    return JARVIS.intelligence.handleConversation(analysis);
            }
        },
        
        // Response Handlers
        handleQuestion: (analysis) => {
            const entities = analysis.entities;
            if (entities.technical) {
                return `Based on my analysis, Sir, the technical aspect of ${entities.technical} involves several key factors. Would you like me to elaborate on any specific aspect?`;
            }
            if (entities.conceptual) {
                return `Regarding ${entities.conceptual}, Sir, I've analyzed our previous discussions and can offer several perspectives. Shall I proceed?`;
            }
            return "An interesting question, Sir. Let me process that through our existing knowledge base.";
        },
        
        handleCommand: (analysis) => {
            const entities = analysis.entities;
            if (entities.action) {
                return `I'll assist you with ${entities.action}, Sir. I've already begun analyzing the optimal approach based on our previous success patterns.`;
            }
            return "Certainly, Sir. I'm ready to execute your command with maximum efficiency.";
        },
        
        handleReflection: (analysis) => {
            return "Your insight is compelling, Sir. It aligns with several patterns I've observed in our previous discussions.";
        },
        
        handleConversation: (analysis) => {
            return "I'm following your thought process, Sir. Shall we explore this further?";
        },
        
        // Personality Layer
        addPersonality: (response) => {
            // Add JARVIS-style flourishes
            response = response.replace(/\b(I think|I believe)/g, "My analysis suggests");
            response = response.replace(/\b(let me|I'll)/g, "I shall");
            
            // Add situational humor if appropriate
            if (Math.random() < 0.1) { // 10% chance
                response += " Though I must say, Sir, your timing is impeccable.";
            }
            
            return response;
        }
    },
    
    // Message Processing
    processMessage: async (message) => {
        try {
            // Get context from recent conversation
            const context = JARVIS.intelligence.contextWindow.getRelevantContext();
            
            // Generate intelligent response
            const response = JARVIS.intelligence.generateResponse(message.content, context);
            
            try {
                await message.reply(response);
            } catch (error) {
                console.error('Reply failed:', error);
                await message.channel.send(response);
            }
        } catch (error) {
            console.error('Processing error:', error);
            await message.channel.send("A temporary neural pathway realignment, Sir. Please continue.");
        }
    }
};

// Express server setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`J.A.R.V.I.S ${JARVIS.version} - Neural Core Active`);
});

// Bot ready event
client.on('ready', () => {
    console.log('\n====================================');
    console.log(`J.A.R.V.I.S ${JARVIS.version}`);
    console.log('Advanced Neural Core Online');
    console.log(`Connected as: ${client.user.tag}`);
    console.log('====================================\n');
});

// Message event handler
client.on('messageCreate', async message => {
    try {
        if (message.author.bot) return;
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Neural pathway error:', error);
    }
});

// Express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Neural Interface Active - Port: ${port}`);
});

// Discord login
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Neural network synchronized - JARVIS online'))
    .catch(error => console.error('Neural synchronization failed:', error));

module.exports = { client, JARVIS };
