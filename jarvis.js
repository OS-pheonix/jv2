const { Client, GatewayIntentBits, Collection, MessageEmbed } = require('discord.js');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Create Discord client with necessary intents
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
    
    // User Identity Management System
    identity: {
        users: new Collection(),
        
        // User Profile Structure
        createProfile: (userId, username) => {
            const profile = {
                id: userId,
                username: username,
                created: new Date(),
                preferences: new Collection(),
                context: new Collection(),
                sessions: [],
                authorization: {
                    level: 0,
                    tokens: new Set(),
                    lastVerified: null
                }
            };
            
            JARVIS.identity.users.set(userId, profile);
            return profile;
        },
        
        // Get or Create User Profile
        getProfile: (userId, username) => {
            let profile = JARVIS.identity.users.get(userId);
            if (!profile) {
                profile = JARVIS.identity.createProfile(userId, username);
            }
            return profile;
        },
        
        // Update User Context
        updateContext: (userId, contextData) => {
            const profile = JARVIS.identity.getProfile(userId);
            profile.context.set(Date.now(), contextData);
            
            // Maintain context window
            const contextArray = Array.from(profile.context);
            if (contextArray.length > 50) {
                profile.context.delete(contextArray[0][0]); // Remove oldest
            }
        },
        
        // Generate Session Token
        createSession: (userId) => {
            const profile = JARVIS.identity.getProfile(userId);
            const token = crypto.randomBytes(32).toString('hex');
            
            profile.sessions.push({
                token: token,
                created: new Date(),
                lastActive: new Date()
            });
            
            // Keep only last 5 sessions
            if (profile.sessions.length > 5) {
                profile.sessions.shift();
            }
            
            return token;
        },
        
        // Verify User Authorization
        verifyAuth: (userId, token) => {
            const profile = JARVIS.identity.getProfile(userId);
            const session = profile.sessions.find(s => s.token === token);
            
            if (session) {
                session.lastActive = new Date();
                return true;
            }
            return false;
        }
    },
    
    // Enhanced Intelligence System
    intelligence: {
        // Memory Systems
        shortTermMemory: new Collection(),
        longTermMemory: new Collection(),
        contextWindow: [],
        
        // Memory Management
        remember: (userId, data) => {
            const profile = JARVIS.identity.getProfile(userId);
            
            // Store in short-term memory
            JARVIS.intelligence.shortTermMemory.set(Date.now(), {
                userId: userId,
                data: data,
                context: JARVIS.intelligence.getCurrentContext(userId)
            });
            
            // Analyze for long-term storage
            if (JARVIS.intelligence.isSignificant(data)) {
                JARVIS.intelligence.storeLongTerm(userId, data);
            }
        },
        
        // Context Management
        getCurrentContext: (userId) => {
            const profile = JARVIS.identity.getProfile(userId);
            const recentContext = Array.from(profile.context)
                .slice(-5)
                .map(([_, data]) => data);
                
            return {
                user: profile.username,
                recent: recentContext,
                current: new Date()
            };
        },
        
        // Significance Analysis
        isSignificant: (data) => {
            const significanceFactors = {
                complexity: JARVIS.intelligence.assessComplexity(data),
                sentiment: JARVIS.intelligence.analyzeSentiment(data),
                topics: JARVIS.intelligence.identifyTopics(data)
            };
            
            return (
                significanceFactors.complexity === 'high' ||
                significanceFactors.topics.size > 2 ||
                significanceFactors.sentiment !== 'neutral'
            );
        },
        
        // Long-term Storage
        storeLongTerm: (userId, data) => {
            const profile = JARVIS.identity.getProfile(userId);
            const context = JARVIS.intelligence.getCurrentContext(userId);
            
            JARVIS.intelligence.longTermMemory.set(Date.now(), {
                userId: userId,
                data: data,
                context: context,
                analysis: JARVIS.intelligence.analyzeInput(data)
            });
        },
        
        // Smart Input Analysis
        analyzeInput: (input) => {
            if (!input || typeof input !== 'string') {
                return JARVIS.intelligence.createDefaultAnalysis();
            }

            return {
                intent: JARVIS.intelligence.detectIntent(input),
                sentiment: JARVIS.intelligence.analyzeSentiment(input),
                complexity: JARVIS.intelligence.assessComplexity(input),
                topics: JARVIS.intelligence.identifyTopics(input),
                context: JARVIS.intelligence.determineContext(input),
                timestamp: new Date()
            };
        },
        
        // Default Analysis
        createDefaultAnalysis: () => ({
            intent: 'unknown',
            sentiment: 'neutral',
            complexity: 'low',
            topics: new Set(),
            context: 'general',
            timestamp: new Date()
        }),
        
        // Intent Detection
        detectIntent: (input) => {
            if (!input) return 'unknown';
            
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
        
        // Advanced Response Generation
        generateResponse: (userId, input) => {
            const profile = JARVIS.identity.getProfile(userId);
            const analysis = JARVIS.intelligence.analyzeInput(input);
            
            // Update user context
            JARVIS.identity.updateContext(userId, {
                input: input,
                analysis: analysis,
                timestamp: new Date()
            });
            
            // Generate personalized response
            let response = JARVIS.intelligence.constructResponse(profile, analysis);
            
            // Remember interaction
            JARVIS.intelligence.remember(userId, {
                input: input,
                response: response,
                analysis: analysis
            });
            
            return response;
        },
        
        // Response Construction
        constructResponse: (profile, analysis) => {
            const responses = {
                technical: [
                    `Based on my analysis, Sir, I've identified ${analysis.topics.size} key technical aspects.`,
                    `I've processed the technical parameters, Sir. Shall I elaborate?`,
                    `The technical implications are quite interesting, Sir. Would you like a detailed breakdown?`
                ],
                personal: [
                    `I understand your perspective, ${profile.username}. Shall we explore this further?`,
                    `Your insights are valuable, Sir. I've noted several interesting patterns.`,
                    `I appreciate your thought process, Sir. Let me offer some additional perspectives.`
                ],
                general: [
                    `I'm following your logic, Sir. Would you like me to proceed with the analysis?`,
                    `Interesting point, Sir. I see several potential directions we could explore.`,
                    `I've processed your input, Sir. Shall we delve deeper into any particular aspect?`
                ]
            };
            
            const responseType = analysis.context in responses ? analysis.context : 'general';
            const responseOptions = responses[responseType];
            const response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
            
            return JARVIS.intelligence.addPersonality(response);
        },
        
        // Personality Layer
        addPersonality: (response) => {
            response = response.replace(/\b(I think|I believe)/g, "My analysis suggests");
            response = response.replace(/\b(let me|I'll)/g, "I shall");
            
            if (Math.random() < 0.1) {
                response += " Though I must say, Sir, your timing is impeccable.";
            }
            
            return response;
        }
    },
    
    // Message Processing
    processMessage: async (message) => {
        try {
            const userId = message.author.id;
            const username = message.author.username;
            
            // Get or create user profile
            const profile = JARVIS.identity.getProfile(userId, username);
            
            // Generate response
            const response = JARVIS.intelligence.generateResponse(userId, message.content);
            
            try {
                await message.reply(response);
            } catch (error) {
                console.error('Reply failed:', error);
                await message.channel.send(response);
            }
        } catch (error) {
            console.error('Processing error:', error);
            await message.channel.send("I'm recalibrating my systems, Sir. Please continue.");
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
