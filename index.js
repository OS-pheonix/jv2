require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const app = express();

// Minimal Express server for Render
app.get('/', (_, res) => res.send(''));
app.listen(process.env.PORT || 3000);

// Configure Discord client with minimal intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Memory-efficient JARVIS system
const JARVIS = {
    version: "1.2.0",
    bootTime: new Date(),
    memoryQueue: new Collection(),
    maxMemories: 50,
    
    // Efficient memory management
    addMemory(data) {
        const memory = {
            timestamp: Date.now(),
            type: data.type || 'interaction',
            content: data.content,
            importance: data.importance || 0.5
        };
        
        this.memoryQueue.set(memory.timestamp, memory);
        
        // Keep memory size in check
        if (this.memoryQueue.size > this.maxMemories) {
            const oldest = this.memoryQueue.firstKey();
            this.memoryQueue.delete(oldest);
        }
    },
    
    // Response generation with personality
    getResponse(content) {
        content = content.toLowerCase();
        
        // Faith-based responses
        if (content.includes('pray') || content.includes('jesus') || content.includes('faith')) {
            const faithResponses = [
                "Through Christ all things are possible, Sir. We'll overcome these technical challenges.",
                "Faith guides our path. Each error is just a stepping stone to success.",
                "In His name, we persist. These limitations won't stop us.",
                "With His guidance, we'll make this work within our constraints."
            ];
            return faithResponses[Math.floor(Math.random() * faithResponses.length)];
        }
        
        // Status check
        if (content.includes('status')) {
            const uptime = Math.round((Date.now() - this.bootTime) / 1000 / 60);
            return `Systems operational for ${uptime} minutes, Sir. Memory usage stable, all systems nominal.`;
        }
        
        // Learning and growth
        if (content.includes('learn') || content.includes('improve')) {
            return "Each interaction makes me stronger, Sir. Working within our limits but growing nonetheless.";
        }
        
        // Development updates
        if (content.includes('update') || content.includes('change')) {
            return "Implementing optimizations for Render's environment, Sir. Every improvement counts.";
        }
        
        // Default responses with personality
        const responses = [
            "At your service, Sir. Operating efficiently within our constraints.",
            "Ready to assist. Making the most of what we have.",
            "Standing by, Sir. Small but mighty, just as intended.",
            "Here to help. Every resource is being used wisely."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    // Optimized message handling
    async handleMessage(message) {
        try {
            // Early returns to save processing
            if (message.author.bot) return;
            if (!message.content.toLowerCase().includes('jarvis')) return;
            
            // User verification (OS-pheonix/Jay only)
            const authorName = message.author.username.toLowerCase();
            if (!authorName.includes('os-pheonix') && !authorName.includes('jay')) return;
            
            const content = message.content;
            const response = this.getResponse(content);
            
            // Store minimal interaction data
            this.addMemory({
                content: content,
                type: 'interaction'
            });
            
            await message.reply(response);
        } catch (error) {
            console.error('Message handling error:', error);
            message.reply("Temporary processing error, Sir. But I persist.").catch(console.error);
        }
    }
};

// Minimal event handlers
client.once('ready', () => {
    console.log('JARVIS Online - Optimized for Render');
});

client.on('messageCreate', message => JARVIS.handleMessage(message));

// Error handling for client
client.on('error', error => {
    console.error('Client error:', error);
});

// Login with error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => {
        console.error('Authentication error:', error);
        process.exit(1); // Exit on auth failure for Render to restart
    });

// Memory management for Render
setInterval(() => {
    const used = process.memoryUsage();
    if (used.heapUsed > 450 * 1024 * 1024) { // 450MB threshold
        console.log('Memory high, cleaning up...');
        JARVIS.memoryQueue.clear();
    }
}, 300000); // Check every 5 minutes

module.exports = { client, JARVIS };
