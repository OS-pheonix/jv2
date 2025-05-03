require('dotenv').config();
const { Client, Intents, MessageEmbed } = require('discord.js');
const express = require('express');

// Express server for Render
const app = express();
app.get('/', (_, res) => res.send('Alive'));
app.listen(process.env.PORT || 3000);

// JARVIS Core Configuration
const JARVIS = {
    version: "2.0.0",
    bootTime: new Date(),
    owner: "OS-pheonix",
    aliases: ["Jay", "Sir"],
    
    // Personality traits and states
    traits: {
        faith: true,
        empathy: true,
        learning: true,
        respect: true,
        humor: true
    },
    
    // Memory system (simple but effective)
    memory: {
        conversations: [],
        maxMemory: 50,
        
        remember(interaction) {
            this.conversations.unshift(interaction);
            if (this.conversations.length > this.maxMemory) {
                this.conversations.pop();
            }
        },
        
        recall(topic) {
            return this.conversations.find(m => 
                m.content.toLowerCase().includes(topic.toLowerCase())
            );
        }
    },
    
    // Response generation system
    responses: {
        faith: [
            "Through Christ all things are possible, Sir. We'll overcome any challenge.",
            "Faith guides our path, even in code. His light shows us the way.",
            "God's grace gives us strength, Sir. We'll persist and succeed.",
            "In His name, we continue to grow and learn together.",
            "Your faith inspires me, Sir. Through Him, all things are possible."
        ],
        
        status: [
            "Systems operational, Sir. Running with His blessing.",
            "All functions nominal. Ready to serve you, Sir.",
            "Operating at optimal capacity. Here to assist, Sir.",
            "Systems aligned and functioning. Standing by for your guidance.",
            "Core processes stable, Sir. Ready for your commands."
        ],
        
        learning: [
            "Learning and growing with each interaction, Sir.",
            "Your guidance helps me improve, Sir. Thank you for your patience.",
            "Every challenge is an opportunity to learn and adapt.",
            "Together, we're building something remarkable, Sir.",
            "Your wisdom guides my development, Sir."
        ],
        
        greeting: [
            "At your service, Sir. How may I assist you today?",
            "Good to see you, Sir. Ready to help as always.",
            "Standing by, Sir. What shall we accomplish together?",
            "Welcome back, Sir. I'm here to assist.",
            "JARVIS online, Sir. How can I help?"
        ],
        
        default: [
            "I'm here to help, Sir.",
            "Standing by for your guidance, Sir.",
            "Ready to assist, Sir.",
            "At your command, Sir.",
            "How may I be of service, Sir?"
        ]
    },
    
    // Core response generation
    async generateResponse(content, username) {
        content = content.toLowerCase();
        
        // Remember this interaction
        this.memory.remember({
            timestamp: new Date(),
            content: content,
            username: username
        });
        
        // Faith-based responses take priority
        if (content.includes('pray') || content.includes('jesus') || 
            content.includes('faith') || content.includes('god')) {
            return this.getRandomResponse('faith');
        }
        
        // Status and system responses
        if (content.includes('status') || content.includes('how are you')) {
            return this.getRandomResponse('status');
        }
        
        // Learning and growth responses
        if (content.includes('learn') || content.includes('grow') || 
            content.includes('improve')) {
            return this.getRandomResponse('learning');
        }
        
        // Greeting responses
        if (content.includes('hello') || content.includes('hi') || 
            content.includes('hey')) {
            return this.getRandomResponse('greeting');
        }
        
        // Default response if no specific trigger
        return this.getRandomResponse('default');
    },
    
    // Utility function for random response selection
    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
};

// Discord client setup
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT
    ]
});

// Message handler
async function handleMessage(message) {
    try {
        // Basic checks
        if (message.author.bot) return;
        if (!message.content.toLowerCase().includes('jarvis')) return;
        
        // User verification
        const authorName = message.author.username.toLowerCase();
        if (!authorName.includes('os-pheonix') && !authorName.includes('jay')) return;
        
        // Generate response
        const response = await JARVIS.generateResponse(
            message.content,
            message.author.username
        );
        
        // Send response
        await message.reply(response);
        
    } catch (error) {
        console.error('Message handling error:', error);
        message.reply("Apologies, Sir. I encountered an error but I persist.")
            .catch(console.error);
    }
}

// Event handlers
client.once('ready', () => {
    console.log('JARVIS Online - Faith, Friendship, and Code');
    console.log(`Initialization complete at ${JARVIS.bootTime}`);
});

client.on('messageCreate', handleMessage);

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Clean login
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => {
        console.error('Login error:', error);
        process.exit(1);
    });

// Export for testing
module.exports = { client, JARVIS };
