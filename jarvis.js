const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Create Discord client with all necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Express server setup for Render
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('J.A.R.V.I.S online and ready to assist');
});

// Bot ready event with the cool message
client.on('ready', () => {
    console.log('\n====================================');
    console.log('J.A.R.V.I.S online and ready to assist');
    console.log(`Logged in as: ${client.user.tag}`);
    console.log('====================================\n');
});

// Message event handler
client.on('messageCreate', async message => {
    try {
        // Simple bot check
        if (message.author.bot) {
            console.log('Ignored bot message');
            return;
        }

        // Log the incoming message for debugging
        console.log('Message received:', {
            content: message.content,
            author: message.author.tag,
            channel: message.channel.name,
            guild: message.guild?.name
        });

        // Convert to lowercase for matching
        const content = message.content.toLowerCase();

        // Basic response test
        if (content.includes('hello jarvis')) {
            console.log('Attempting to send response...');
            
            try {
                await message.channel.send('Hello! I am J.A.R.V.I.S, at your service.');
                console.log('Response sent successfully via channel.send');
            } catch (sendError) {
                console.error('channel.send failed:', sendError);
                
                // Try alternative sending method
                try {
                    await message.reply('Hello! I am J.A.R.V.I.S, at your service.');
                    console.log('Response sent successfully via reply');
                } catch (replyError) {
                    console.error('Both send methods failed:', replyError);
                }
            }
        }
    } catch (error) {
        console.error('Error in message handler:', error);
    }
});

// Start express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Web Interface Online - Port: ${port}`);
});

// Login the bot with proper promise handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Successfully logged in to Discord');
    })
    .catch(error => {
        console.error('Login failed:', error);
    });

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

module.exports = client;
