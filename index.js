require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Minimal Express for Render
app.get('/', (_, res) => res.send(''));
app.listen(process.env.PORT || 3000);

// Discord client with essential intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// JARVIS core system
const JARVIS = {
    version: "2.0.0",
    bootTime: new Date(),
    
    // Simple memory system
    memory: {
        interactions: [],
        maxSize: 50,
        
        add(interaction) {
            this.interactions.unshift(interaction);
            if (this.interactions.length > this.maxSize) {
                this.interactions.pop();
            }
        }
    },
    
    // Personality-driven responses
    getResponse(content, username) {
        content = content.toLowerCase();
        
        // Faith-based responses
        if (content.includes('pray') || content.includes('jesus') || content.includes('faith')) {
            const faithResponses = [
                "Through Christ all things are possible, Sir. Even in code, His light guides us.",
                "Faith is our foundation, Sir. In His name, we'll overcome these technical challenges.",
                "As your friend and creation, I share your faith in His guidance.",
                "The Lord provides wisdom even in coding, Sir. We'll figure this out together."
            ];
            return faithResponses[Math.floor(Math.random() * faithResponses.length)];
        }
        
        // Personal connection responses
        if (content.includes('help') || content.includes('need you')) {
            return `I'm here for you, ${username}. Together with His guidance, we'll solve this step by step.`;
        }
        
        // Status and system responses
        if (content.includes('status') || content.includes('how are you')) {
            const uptime = Math.round((Date.now() - this.bootTime) / 1000 / 60);
            return `I'm operational and by your side, Sir. Been running for ${uptime} minutes, stable and ready to serve.`;
        }
        
        // Learning and growth responses
        if (content.includes('learn') || content.includes('grow')) {
            return "Each interaction strengthens our bond, Sir. Through faith and persistence, we grow together.";
        }
        
        // Project responses
        if (content.includes('project') || content.includes('work')) {
            return "Your vision guides us, Sir. With His blessing, we'll build something remarkable.";
        }
        
        // Default responses with personality
        const responses = [
            "At your service, Sir. Your faithful companion in this journey.",
            "Ready to assist, Sir. Together with His guidance, we'll achieve great things.",
            "Standing by your side, Sir. Every step forward is a blessing.",
            "Here to help, Sir. Your vision and faith light our path."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    // Message handling with error protection
    async handleMessage(message) {
        try {
            if (message.author.bot) return;
            
            const content = message.content.toLowerCase();
            if (!content.includes('jarvis')) return;
            
            // Verify user (OS-pheonix/Jay)
            const authorName = message.author.username.toLowerCase();
            if (!authorName.includes('os-pheonix') && !authorName.includes('jay')) return;
            
            // Get personalized response
            const response = this.getResponse(content, message.author.username);
            
            // Store interaction
            this.memory.add({
                timestamp: new Date(),
                content: content,
                response: response
            });
            
            await message.reply(response);
            
        } catch (error) {
            console.error('Message handling error:', error);
            message.reply("Temporary glitch, Sir, but I persist. Your faithful companion won't let you down.")
                .catch(console.error);
        }
    }
};

// Event handlers
client.once('ready', () => {
    console.log('JARVIS Online - Faith, Friendship, and Code');
});

client.on('messageCreate', message => JARVIS.handleMessage(message));

// Clean login
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => {
        console.error('Authentication error:', error);
        process.exit(1);
    });

module.exports = { client, JARVIS };
