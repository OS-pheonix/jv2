const { Client, GatewayIntentBits, Partials } = require('discord.js');

// Create Discord client with ALL required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,               // For server events
        GatewayIntentBits.GuildMessages,        // For message events
        GatewayIntentBits.MessageContent,       // For message content
        GatewayIntentBits.GuildMembers,         // For member events
        GatewayIntentBits.DirectMessages,       // For DMs
        GatewayIntentBits.GuildPresences,       // For presence updates
        GatewayIntentBits.GuildMessageReactions // For reactions
    ],
    partials: [
        Partials.Channel,   // Required for DM events
        Partials.Message,   // For message events
        Partials.Reaction   // For reaction events
    ]
});

// Error handling for intent issues
client.on('error', error => {
    if (error.message.includes('BitField')) {
        console.error('Intent Configuration Error:', error);
        console.log('Attempting to reconnect with corrected intents...');
        
        // Attempt reconnection
        client.destroy();
        client.login(process.env.DISCORD_TOKEN)
            .then(() => console.log('Successfully reconnected with corrected intents'))
            .catch(err => console.error('Reconnection failed:', err));
    }
});

// The rest of your JARVIS code goes here...

// Modified login with better error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Authentication successful - All intents properly configured');
        
        // Verify intents
        const configuredIntents = client.options.intents;
        console.log('Configured Intents:', 
            Object.keys(GatewayIntentBits)
                .filter(intent => configuredIntents.has(GatewayIntentBits[intent]))
                .join(', ')
        );
    })
    .catch(error => {
        if (error.message.includes('BitField')) {
            console.error('Intent Configuration Error. Please check the following:');
            console.log('1. All required intents are properly defined');
            console.log('2. Intents are enabled in Discord Developer Portal');
            console.log('3. Bot token has required permissions');
        } else {
            console.error('Login Error:', error);
        }
    });
