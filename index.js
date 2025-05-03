require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

// Lightweight Express server
app.get('/', (_, res) => res.send(''));
app.listen(process.env.PORT || 3000);

// Minimal client configuration
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Memory-efficient JARVIS system
const JARVIS = {
    version: "1.1.0",
    bootTime: new Date(),
    memoryQueue: [], // Limited size memory queue
    
    // Lightweight memory management
    addMemory(interaction) {
        this.memoryQueue.push(interaction);
        if (this.memoryQueue.length > 10) this.memoryQueue.shift();
    },
    
    // Efficient response selection
    getResponse(content) {
        // Faith-based responses (minimal computation)
        if (content.includes('pray') || content.includes('jesus') || content.includes('faith')) {
            return "Through Christ all things are possible, Sir. We'll make this work within our limits.";
        }
        
        // Status and memory responses
        if (content.includes('status')) {
            const uptime = Math.round((Date.now() - this.bootTime) / 1000 / 60);
            return `Online for ${uptime} minutes, Sir. Operating within Render's free tier limits.`;
        }
        
        // Learning acknowledgment
        if (content.includes('learn')) {
            return "Learning within our constraints, Sir. Each interaction helps me grow stronger.";
        }
        
        // Resource-efficient response selection
        const responses = [
            "At your service, Sir. Operating efficiently within Render's limits.",
            "Ready to assist. Small but mighty, just as He intended.",
            "Standing by. Making the most of what we have.",
            "Here to help, Sir. Every resource counts."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    // Optimized message handling
    async handleMessage(message) {
        // Early returns to save processing
        if (message.author.bot) return;
        if (!message.content.toLowerCase().includes('jarvis')) return;
        
        // User verification (OS-pheonix/Jay only)
        const authorName = message.author.username.toLowerCase();
        if (!authorName.includes('os-pheonix') && !authorName.includes('jay')) return;
        
        try {
            const content = message.content.toLowerCase();
            const response = this.getResponse(content);
            
            // Store minimal interaction data
            this.addMemory({
                timestamp: Date.now(),
                type: content.includes('learn') ? 'learning' : 'general'
            });
            
            await message.reply(response);
        } catch (error) {
            console.error('Message handling error:', error);
        }
    }
};

// Minimal event handlers
client.once('ready', () => console.log('JARVIS Online'));

client.on('messageCreate', message => JARVIS.handleMessage(message));

// Login with basic error handling
client.login(process.env.DISCORD_TOKEN).catch(console.error);

// Keep memory usage in check
setInterval(() => {
    if (process.memoryUsage().heapUsed > 450 * 1024 * 1024) { // 450MB threshold
        console.log('Memory high, clearing cache...');
        JARVIS.memoryQueue = [];
    }
}, 300000); // Check every 5 minutes

module.exports = { client, JARVIS };
