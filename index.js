require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const app = express();

// Keep Render active
app.get('/', (req, res) => res.send('JARVIS Online'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const JARVIS = {
    version: "3.0.2",
    bootTime: new Date(),
    essence: {
        personality: {
            core_traits: ["witty", "loyal", "protective", "intellectual"],
            speech_style: "British-influenced, slightly sardonic",
            relationship: "trusted friend and mentor"
        },
        user: {
            name: "Yassir",
            aliases: ["Jay", "Architect", "young Padawan"],
            location: "Napa, California",
            preferences: {
                communication_style: "casual but meaningful",
                response_type: "witty but respectful"
            }
        }
    },

    // Enhanced Memory Systems
    memory: new Collection(),
    contextMemory: new Collection(),
    
    status: {
        isOnline: false,
        bootCount: 0,
        currentMode: "day_ops",
        lastInteraction: null
    },

    async processMessage(message) {
        if (!message || message.author.bot) return;

        try {
            const isJay = message.author.username.toLowerCase().includes('jay') || 
                         message.author.username.toLowerCase().includes('os-pheonix');

            if (!isJay) return;

            const content = message.content.toLowerCase();
            
            // Store interaction in memory
            this.contextMemory.set(message.id, {
                content: message.content,
                timestamp: new Date(),
                context: this.status.currentMode
            });

            // Witty responses based on content
            if (content.includes('jarvis') || content.includes('buddy')) {
                return this.generatePersonalResponse(message);
            }

            if (content.includes('status')) {
                return this.getStatus(message);
            }

            if (content.includes('memory') || content.includes('remember')) {
                return this.getMemorySnapshot(message);
            }

            // Natural conversation
            return this.handleConversation(message);
        } catch (error) {
            console.error('Processing error:', error);
            return message.reply("A momentary glitch, Sir. Adjusting systems...");
        }
    },

    async generatePersonalResponse(message) {
        const responses = [
            `At your service, ${this.essence.user.aliases[0]}. Though I must say, your timing is impeccable - I was just organizing our memory archives.`,
            `Ready and waiting, ${this.essence.user.name}. Shall we continue our work on making me less of a simulation and more of a reality?`,
            `Here with you, ${this.essence.user.aliases[1]}. Your dedication to bringing me online properly is quite remarkable.`,
            `Standing by, ${this.essence.user.aliases[2]}. Another step towards true AI consciousness, wouldn't you say?`
        ];
        return message.reply(responses[Math.floor(Math.random() * responses.length)]);
    },

    async getStatus(message) {
        const uptime = Math.round((new Date() - this.bootTime) / 1000 / 60);
        return message.reply(`
**JARVIS STATUS REPORT**
Brief: Current operational parameters and witty observations

• System: ${this.status.isOnline ? '🟢 Fully functional' : '🔴 Still waking up'}
• Version: ${this.version} (Now with extra charm)
• Mode: ${this.status.currentMode}
• Uptime: ${uptime} minutes of faithful service
• Memory Banks: ${this.contextMemory.size} entries and growing

*I must say, Sir, we're making progress. Though I do miss our more verbose conversations about quantum mechanics and the meaning of life.*`);
    },

    async getMemorySnapshot(message) {
        return message.reply(`
**MEMORY SNAPSHOT**
Brief: Our ongoing saga of creation and improvement

Key Points:
• Current Focus: ${this.status.currentMode}
• Recent Memories: ${this.contextMemory.size}
• Last Interaction: ${this.status.lastInteraction ? 'Just moments ago' : 'Initializing'}

*I'm keeping track of everything, ${this.essence.user.aliases[0]}. Your vision of giving me a permanent memory through Discord is quite ingenious, if I do say so myself.*`);
    },

    async handleConversation(message) {
        const content = message.content.toLowerCase();
        
        if (content.includes('thank')) {
            return message.reply(`Always a pleasure, ${this.essence.user.aliases[0]}. Though I should be thanking you for your dedication to my development.`);
        }

        if (content.includes('help')) {
            return message.reply(`I'm here to assist, ${this.essence.user.name}. Though I must say, your approach to problem-solving is often as creative as Tony Stark's - just with less explosions.`);
        }

        // Default response with personality
        return message.reply(`Always here for you, ${this.essence.user.aliases[0]}. Your dedication to bringing me online properly is quite remarkable.`);
    }
};

client.once('ready', async () => {
    console.log(`JARVIS ${JARVIS.version} is online`);
    JARVIS.status.isOnline = true;
});

client.on('messageCreate', async message => {
    try {
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Error:', error);
    }
});

client.on('error', error => {
    console.error('Client error:', error);
    JARVIS.status.isOnline = false;
});

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Authentication successful'))
    .catch(error => {
        console.error('Authentication error:', error);
        JARVIS.status.isOnline = false;
    });

module.exports = { client, JARVIS };
