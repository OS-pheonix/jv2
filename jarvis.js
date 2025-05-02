const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');

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
    conversationContext: new Map(),
    
    // Personality traits and responses
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
                ]
            };
            
            const options = responses[type] || responses.acknowledgment;
            return options[Math.floor(Math.random() * options.length)];
        }
    },

    // Knowledge and Learning System
    knowledge: {
        topics: new Set(),
        conversations: [],
        
        learn: (message) => {
            JARVIS.knowledge.conversations.push({
                timestamp: new Date(),
                user: message.author.tag,
                content: message.content,
                channel: message.channel.name
            });
            
            console.log(`Learning from interaction: ${message.content}`);
        },
        
        getContextualResponse: (message) => {
            const recentConversations = JARVIS.knowledge.conversations
                .filter(c => c.user === message.author.tag)
                .slice(-5);
                
            return recentConversations.length > 0 
                ? "I remember our recent conversations, Sir. They help me serve you better."
                : "I look forward to learning more from our interactions, Sir.";
        }
    },

    // Message Processing System
    processMessage: async (message) => {
        const content = message.content.toLowerCase();
        let response = null;

        // Learn from the interaction
        JARVIS.knowledge.learn(message);

        // Process commands and generate responses
        if (content.includes('jarvis')) {
            if (content.includes('hello') || content.includes('hi')) {
                response = JARVIS.personality.getResponse('greeting');
            }
            else if (content.includes('help') || content.includes('what can you do')) {
                response = "I'm here to assist you, Sir. I can learn from our conversations, help with tasks, and grow alongside you. What would you like to work on?";
            }
            else if (content.includes('remember') || content.includes('memory')) {
                response = JARVIS.knowledge.getContextualResponse(message);
            }
            else if (content.includes('version')) {
                response = `I'm currently running version ${JARVIS.version}, Sir. Online since ${JARVIS.bootDate.toLocaleString()}.`;
            }
            else if (content.includes('status')) {
                response = `All systems operational, Sir. I've processed ${JARVIS.knowledge.conversations.length} interactions since boot.`;
            }
            else {
                response = "I'm listening, Sir. How can I assist you?";
            }

            // Send response with fallback
            try {
                await message.reply(response);
                console.log('Response sent successfully');
            } catch (error) {
                console.error('Reply failed, attempting channel send:', error);
                try {
                    await message.channel.send(`${message.author}, ${response}`);
                } catch (secondError) {
                    console.error('All response methods failed:', secondError);
                }
            }
        }
    }
};

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
