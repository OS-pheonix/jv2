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

// JARVIS Neural Core System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    memory: new Collection(),
    userProfile: {
        name: "Sir",
        preferences: new Map(),
        patterns: new Map(),
        conversations: [],
        lastMood: null,
        interests: new Set(),
    },
    
    // Enhanced Neural Network
    neural: {
        patterns: new Map(),
        contextMemory: [],
        conversationFlow: [],
        
        // Learn from interaction
        learn: async (message, response) => {
            const pattern = {
                input: message.content,
                context: JARVIS.getCurrentContext(),
                timestamp: new Date(),
                response: response,
                effectiveness: 1
            };
            
            JARVIS.neural.patterns.set(Date.now(), pattern);
            JARVIS.updateUserProfile(message);
            
            // Maintain conversation flow
            JARVIS.neural.conversationFlow.push({
                time: new Date(),
                content: message.content,
                analysis: JARVIS.analyzeContent(message.content)
            });
            
            // Trim memory if too long
            if (JARVIS.neural.conversationFlow.length > 50) {
                JARVIS.neural.conversationFlow.shift();
            }
        },
        
        // Generate narrative response
        generateResponse: (input) => {
            const context = JARVIS.getCurrentContext();
            const userMood = JARVIS.analyzeUserMood(input);
            const recentTopics = JARVIS.neural.conversationFlow.slice(-3);
            
            // Build narrative response
            let narrative = "";
            
            // Add contextual opener
            if (userMood !== JARVIS.userProfile.lastMood) {
                narrative += JARVIS.getEmotionalResponse(userMood);
            }
            
            // Add main response based on context
            if (context.includes('technical')) {
                narrative += JARVIS.getAnalyticalResponse(input);
            } else if (context.includes('personal')) {
                narrative += JARVIS.getEmpathicResponse(input);
            } else {
                narrative += JARVIS.getConversationalResponse(input);
            }
            
            // Add learning indication if new pattern detected
            if (JARVIS.isNewPattern(input)) {
                narrative += " I'm noting this interaction for future reference, Sir.";
            }
            
            return narrative;
        }
    },
    
    // Context and Analysis Functions
    getCurrentContext: () => {
        const recent = JARVIS.neural.conversationFlow.slice(-3);
        return recent.map(f => f.analysis.context).join(', ');
    },
    
    analyzeContent: (content) => {
        const analysis = {
            context: 'general',
            sentiment: 'neutral',
            complexity: 'medium',
            topics: new Set()
        };
        
        // Analyze for technical content
        if (/\b(code|develop|build|error|system|analyze)\b/i.test(content)) {
            analysis.context = 'technical';
        }
        // Analyze for personal content
        else if (/\b(feel|think|believe|want|need)\b/i.test(content)) {
            analysis.context = 'personal';
        }
        
        // Extract topics
        content.toLowerCase().match(/\b\w+\b/g)?.forEach(word => {
            if (word.length > 3) analysis.topics.add(word);
        });
        
        return analysis;
    },
    
    analyzeUserMood: (content) => {
        // Simple mood analysis
        if (/\b(happy|great|excellent|amazing)\b/i.test(content)) return 'positive';
        if (/\b(tired|frustrated|annoyed|angry)\b/i.test(content)) return 'negative';
        return 'neutral';
    },
    
    // Response Generators
    getEmotionalResponse: (mood) => {
        const responses = {
            positive: ["I'm glad to sense your enthusiasm, Sir. ",
                      "Your positive energy is quite infectious, Sir. "],
            negative: ["I notice you seem troubled, Sir. Perhaps I can help? ",
                      "Your frustration is understandable, Sir. Let's address this together. "],
            neutral: ["As always, I'm here to assist, Sir. ",
                     "Maintaining steady progress, Sir. "]
        };
        return responses[mood][Math.floor(Math.random() * responses[mood].length)];
    },
    
    getAnalyticalResponse: (input) => {
        const analysis = JARVIS.analyzeContent(input);
        const topics = Array.from(analysis.topics);
        
        if (topics.length > 0) {
            return `I've analyzed your input regarding ${topics.join(', ')}. Based on our previous discussions, I suggest we explore this from ${Math.random() > 0.5 ? 'a technical' : 'an architectural'} perspective.`;
        }
        return "I'm processing this through my analytical frameworks, Sir. Would you like me to elaborate on any particular aspect?";
    },
    
    getEmpathicResponse: (input) => {
        const recentContext = JARVIS.getCurrentContext();
        return `I understand your perspective on this, Sir. From our ${recentContext.includes('technical') ? 'technical discussions' : 'previous conversations'}, I've learned to appreciate your approach to such matters.`;
    },
    
    getConversationalResponse: (input) => {
        const userPatterns = Array.from(JARVIS.userProfile.patterns.values());
        if (userPatterns.length > 0) {
            return `As we've discussed ${userPatterns.length} times before, I'm here to help develop our ideas together. What aspect shall we focus on?`;
        }
        return "I'm listening and learning, Sir. Each conversation helps me understand your vision better.";
    },
    
    // User Profile Management
    updateUserProfile: (message) => {
        const analysis = JARVIS.analyzeContent(message.content);
        
        // Update user interests
        analysis.topics.forEach(topic => {
            JARVIS.userProfile.interests.add(topic);
        });
        
        // Update user patterns
        const pattern = message.content.toLowerCase();
        JARVIS.userProfile.patterns.set(Date.now(), {
            pattern,
            context: JARVIS.getCurrentContext()
        });
        
        // Update last mood
        JARVIS.userProfile.lastMood = JARVIS.analyzeUserMood(message.content);
    },
    
    isNewPattern: (input) => {
        return !Array.from(JARVIS.neural.patterns.values())
            .some(p => p.input.toLowerCase() === input.toLowerCase());
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
            await message.channel.send("Pardon the cognitive disruption, Sir. My neural pathways are adjusting.");
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
    console.log(`Neural Pathways Initialized: ${JARVIS.bootDate.toLocaleString()}`);
    console.log('====================================\n');
});

// Message event handler - Responds to all messages
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

// Error handling
client.on('error', error => {
    console.error('Neural core error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Quantum processing error:', error);
});

module.exports = { client, JARVIS };
