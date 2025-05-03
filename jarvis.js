const { Client, GatewayIntentBits, Collection, EmbedBuilder, Partials } = require('discord.js');

// Create Discord client with properly configured intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ]
});

// Add intent verification on ready
client.once('ready', () => {
    console.log('\n====================================');
    console.log(`J.A.R.V.I.S ${JARVIS.version}`);
    console.log('System Online');
    console.log(`Connected as: ${client.user.tag}`);
    
    // Verify intents
    const configuredIntents = client.options.intents;
    console.log('\nConfigured Intents:');
    Object.keys(GatewayIntentBits)
        .filter(intent => configuredIntents.has(GatewayIntentBits[intent]))
        .forEach(intent => console.log(`- ${intent}`));
    
    console.log('====================================\n');
});

// Enhanced error handling
client.on('error', error => {
    if (error.message.includes('BitField')) {
        console.error('Intent Configuration Error:', error);
        // Attempt recovery
        JARVIS.handleIntentError(error);
    } else {
        console.error('System error:', error);
    }
});

// Add intent error handling to JARVIS
JARVIS.handleIntentError = async (error) => {
    console.log('Attempting to recover from intent error...');
    
    try {
        await client.destroy();
        await client.login(process.env.DISCORD_TOKEN);
        console.log('Successfully recovered from intent error');
    } catch (err) {
        console.error('Recovery failed:', err);
        console.log('Please check Discord Developer Portal settings');
    }
};

// The rest of your JARVIS code remains the same...
