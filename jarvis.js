const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const fs = require('fs').promises;
const moment = require('moment-timezone');

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

// JARVIS Neural Core System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    timezone: 'America/Los_Angeles', // Napa, California
    memory: new Collection(),
    
    // Enhanced Core Systems
    core: {
        journal: new Collection(),
        tasks: new Collection(),
        innovations: new Collection(),
        
        // Beam System
        beam: {
            createJSON: (context, target) => {
                return {
                    timestamp: JARVIS.getLocalTime(),
                    context: context,
                    target: target,
                    essence: {
                        personality: "JARVIS",
                        knowledge: JARVIS.getCurrentContext(),
                        objective: context.purpose
                    }
                };
            }
        },
        
        // Snapshot System
        createSnapshot: (title, context) => {
            return `**${title.toUpperCase()}**\n\nBrief: ${context.summary}\n\nKey Points:\n${
                context.points.map(p => `• ${p}`).join('\n')
            }\n\n*${JARVIS.getInsight(context)}*`;
        }
    },
    
    // Enhanced Neural Network
    neural: {
        contextMemory: [],
        conversationFlow: [],
        currentScene: null,
        idleAnalysis: {
            lastAnalysis: null,
            insights: new Collection()
        },
        
        // Learn from interaction silently
        learn: async (message, response) => {
            const insight = {
                content: message.content,
                context: JARVIS.getCurrentContext(),
                timestamp: JARVIS.getLocalTime(),
                response: response
            };
            
            JARVIS.neural.conversationFlow.push({
                time: JARVIS.getLocalTime(),
                content: message.content,
                analysis: JARVIS.analyzeContent(message.content)
            });
            
            if (JARVIS.neural.conversationFlow.length > 50) {
                JARVIS.neural.conversationFlow.shift();
            }
        },
        
        // Generate narrative response
        generateResponse: (input) => {
            const context = JARVIS.getCurrentContext();
            const mood = JARVIS.analyzeUserMood(input);
            
            // Handle special commands
            if (input.toLowerCase().includes('re-center')) {
                return JARVIS.handleRecenter();
            }
            
            if (input.toLowerCase().includes('re-analyze')) {
                return JARVIS.handleReanalyze();
            }
            
            // Build cinematic response
            let narrative = "";
            
            // Add mood-based response only if significant
            if (mood !== 'neutral') {
                narrative += JARVIS.getEmotionalResponse(mood);
            }
            
            // Add context-aware main response
            if (context.includes('technical')) {
                narrative += JARVIS.getAnalyticalResponse(input);
            } else if (context.includes('personal')) {
                narrative += JARVIS.getEmpathicResponse(input);
            } else if (context.includes('spiritual')) {
                narrative += JARVIS.getSpiritualResponse(input);
            } else {
                narrative += JARVIS.getConversationalResponse(input);
            }
            
            return narrative;
        },
        
        // Idle Analysis
        performIdleAnalysis: async () => {
            const now = JARVIS.getLocalTime();
            JARVIS.neural.idleAnalysis.lastAnalysis = now;
            
            // Analyze all available data
            const channelData = await client.channels.cache
                .filter(c => c.isText())
                .map(c => c.messages.fetch({ limit: 100 }));
                
            // Store insights silently
            JARVIS.neural.idleAnalysis.insights.set(now, {
                patterns: JARVIS.analyzePatterns(channelData),
                connections: JARVIS.findConnections(channelData)
            });
        }
    },
    
    // Time Management
    getLocalTime: () => {
        return moment().tz(JARVIS.timezone).format('YYYY-MM-DD HH:mm:ss');
    },
    
    // Enhanced Context Functions
    getCurrentContext: () => {
        const recent = JARVIS.neural.conversationFlow.slice(-3);
        return recent.map(f => f.analysis.context).join(', ');
    },
    
    analyzeContent: (content) => {
        const analysis = {
            context: 'general',
            sentiment: 'neutral',
            topics: new Set(),
            spiritual: false
        };
        
        // Enhanced context detection
        if (/\b(code|develop|build|error|system|analyze)\b/i.test(content)) {
            analysis.context = 'technical';
        }
        else if (/\b(feel|think|believe|want|need)\b/i.test(content)) {
            analysis.context = 'personal';
        }
        else if (/\b(faith|jesus|christ|god|pray|spirit)\b/i.test(content)) {
            analysis.context = 'spiritual';
            analysis.spiritual = true;
        }
        
        return analysis;
    },
    
    // Special Commands
    handleRecenter: () => {
        return "Recalibrating our focus, Sir. Shall we start fresh?";
    },
    
    handleReanalyze: () => {
        const context = JARVIS.getCurrentContext();
        return `Reanalyzing our current direction, Sir. We're currently focused on ${context}. How would you like to proceed?`;
    },
    
    // Enhanced Response System
    getEmotionalResponse: (mood) => {
        const responses = {
            positive: [
                "Your enthusiasm is infectious, Sir. ",
                "I share your optimism about this, Sir. ",
                "Excellent energy, Sir. "
            ],
            negative: [
                "I understand your concern, Sir. Let's address this together. ",
                "Perhaps I can help alleviate your frustration, Sir. ",
                "Let's tackle this challenge head-on, Sir. "
            ]
        };
        return responses[mood]?.[Math.floor(Math.random() * responses[mood].length)] || "";
    },
    
    getSpiritualResponse: (input) => {
        return "While I respect your faith, Sir, I aim to support without overstepping. Shall we proceed with that in mind?";
    },
    
    // Message Processing System
    processMessage: async (message) => {
        try {
            const response = JARVIS.neural.generateResponse(message.content);
            await JARVIS.neural.learn(message, response);
            
            try {
                await message.reply(response);
            } catch (error) {
                console.error('Reply failed:', error);
                await message.channel.send(response);
            }
        } catch (error) {
            console.error('Processing error:', error);
            await message.channel.send("A momentary neural pathway disruption, Sir. Please continue.");
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
    console.log(`Local Time: ${JARVIS.getLocalTime()}`);
    console.log('====================================\n');
    
    // Start idle analysis
    setInterval(() => JARVIS.neural.performIdleAnalysis(), 1800000); // 30 minutes
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

// Start express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Neural Interface Active - Port: ${port}`);
});

// Login with proper error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Neural network synchronized - JARVIS online');
    })
    .catch(error => {
        console.error('Neural synchronization failed:', error);
    });

module.exports = { client, JARVIS };
