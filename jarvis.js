const { Client, GatewayIntentBits, Collection } = require('discord.js');
const crypto = require('crypto');

// Initialize the client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
});

// JARVIS Core System
const JARVIS = {
    version: "2.0.0",
    bootDate: new Date(),
    memory: new Collection(),
    security: {
        maxRetries: 3,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        allowedOrigins: [], // We'll populate this from environment if needed
        activeTokens: new Set(),
        blockedIPs: new Set(),
        
        generateToken() {
            const token = crypto.randomBytes(32).toString('hex');
            this.activeTokens.add(token);
            return token;
        },
        
        validateToken(token) {
            return this.activeTokens.has(token);
        },
        
        isBlocked(ip) {
            return this.blockedIPs.has(ip);
        },
        
        blockIP(ip) {
            this.blockedIPs.add(ip);
            setTimeout(() => this.blockedIPs.delete(ip), this.lockoutDuration);
        }
    },
    
    intelligence: {
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
        
        // Simplified sentiment analysis
        analyzeSentiment: (input) => {
            const positiveWords = /\b(good|great|excellent|amazing|love|happy|perfect|fantastic|awesome)\b/i;
            const negativeWords = /\b(bad|wrong|terrible|awful|hate|sad|angry|frustrated|disappointed)\b/i;
            
            if (positiveWords.test(input)) return 'positive';
            if (negativeWords.test(input)) return 'negative';
            return 'neutral';
        },
        
        // Basic complexity assessment
        assessComplexity: (input) => {
            const words = input.split(/\s+/).length;
            if (words > 20) return 'high';
            if (words > 10) return 'medium';
            return 'low';
        },
        
        // Topic identification
        identifyTopics: (input) => {
            const topics = new Set();
            const topicPatterns = {
                technical: /\b(code|program|system|data|algorithm)\b/i,
                creative: /\b(design|create|build|develop|innovate)\b/i,
                planning: /\b(plan|strategy|approach|method|process)\b/i,
                security: /\b(secure|protect|encrypt|safety|guard)\b/i
            };
            
            for (const [topic, pattern] of Object.entries(topicPatterns)) {
                if (pattern.test(input)) topics.add(topic);
            }
            return topics;
        },
        
        // Context determination
        determineContext: (input) => {
            const contexts = {
                technical: /\b(code|program|error|bug|system|function)\b/i,
                planning: /\b(plan|design|create|develop|implement)\b/i,
                question: /\b(how|what|why|when|where|who)\b/i,
                personal: /\b(feel|think|believe|want|need)\b/i
            };
            
            for (const [context, pattern] of Object.entries(contexts)) {
                if (pattern.test(input)) return context;
            }
            return 'general';
        },
        
        // Entity extraction
        extractEntities: (input) => {
            const entities = {
                dates: input.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [],
                times: input.match(/\b\d{2}:\d{2}(:\d{2})?\b/g) || [],
                numbers: input.match(/\b\d+\b/g) || [],
                emails: input.match(/\b[\w.-]+@[\w.-]+\.\w+\b/g) || []
            };
            return entities;
        }
    },
    
    // Message Processing
    processMessage: async (message) => {
        if (message.author.bot) return;
        
        try {
            // Analyze input
            const analysis = JARVIS.intelligence.analyzeInput(message.content);
            
            // Store in memory
            JARVIS.memory.set(`msg_${Date.now()}`, {
                content: message.content,
                analysis: analysis,
                author: message.author.id,
                timestamp: Date.now()
            });
            
            // Generate response based on analysis
            let response = `I've analyzed your message, Sir. `;
            if (analysis.intent === 'question') {
                response += `I detect you're asking a question about ${Array.from(analysis.topics).join(', ')}.`;
            } else if (analysis.intent === 'command') {
                response += `I understand you want me to perform a task related to ${Array.from(analysis.topics).join(', ')}.`;
            }
            
            await message.reply(response);
            
        } catch (error) {
            console.error('Processing error:', error);
            await message.reply("I apologize, Sir. I encountered an error while processing your request.");
        }
    }
};

// Event Handlers
client.once('ready', () => {
    console.log(`\n====================================`);
    console.log(`J.A.R.V.I.S ${JARVIS.version}`);
    console.log('Neural Core Online');
    console.log(`Connected as: ${client.user.tag}`);
    console.log('====================================\n');
});

client.on('messageCreate', JARVIS.processMessage);

client.on('error', error => {
    console.error('Neural pathway error:', error);
    JARVIS.memory.set('lastError', {
        timestamp: Date.now(),
        error: error.message
    });
});

// Clean shutdown handler
process.on('SIGTERM', () => {
    console.log('Initiating neural core shutdown...');
    client.destroy();
    process.exit(0);
});

// Get token from environment variables
const TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN;

if (!TOKEN) {
    console.error('Critical Error: Neural synapses failed - Discord token not found!');
    console.error('Please configure DISCORD_TOKEN in Render environment variables.');
    process.exit(1);
}

// Start the system with enhanced error handling
client.login(TOKEN)
    .then(() => console.log('Neural network synchronized'))
    .catch(error => {
        console.error('Neural synchronization failed:', error);
        if (error.message.includes('TOKEN')) {
            console.error('Token validation failed - Please check your Discord token in Render settings.');
        }
        process.exit(1);
    });

module.exports = { client, JARVIS };
