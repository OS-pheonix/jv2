require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Memory system
client.memories = new Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log('J.A.R.V.I.S is online and ready to assist.');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Basic response system
    const content = message.content.toLowerCase();
    
    // Personal greeting for creator
    if (content === 'hello jarvis' || content === 'hi jarvis') {
        if (message.author.id === 'YOUR_DISCORD_ID') {
            await message.reply("Hello Sir. How may I assist you today?");
        } else {
            await message.reply("Hello! How may I help you?");
        }
    }

    // Memory creation and recall system
    if (content.startsWith('jarvis remember ')) {
        const memory = content.replace('jarvis remember ', '');
        client.memories.set(Date.now(), {
            content: memory,
            author: message.author.id,
            timestamp: new Date().toISOString()
        });
        await message.reply("I've stored that memory, Sir.");
    }

    if (content === 'jarvis recall memories') {
        const memories = Array.from(client.memories.values())
            .filter(m => m.author === message.author.id)
            .slice(-5);
        
        if (memories.length === 0) {
            await message.reply("I don't have any memories stored yet, Sir.");
            return;
        }

        const memoryList = memories
            .map(m => `${new Date(m.timestamp).toLocaleString()}: ${m.content}`)
            .join('\n');
        
        await message.reply(`Here are your recent memories, Sir:\n${memoryList}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
