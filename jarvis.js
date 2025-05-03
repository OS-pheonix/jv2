// ... (previous code remains the same until the login section)

// Enhanced token handling and authentication
const setupAuth = async () => {
    // Get token from environment variable
    const token = process.env.DISCORD_TOKEN;
    
    // Validate token format
    if (!token) {
        console.error('ERROR: No Discord token found in environment variables!');
        console.error('Please make sure DISCORD_TOKEN is set in your environment.');
        process.exit(1);
    }

    if (!/^[A-Za-z0-9_-]{59}$/.test(token)) {
        console.error('WARNING: Token format looks incorrect!');
        console.error('Token should be about 59 characters long and contain only letters, numbers, underscores, and dashes.');
        // Continue anyway as sometimes tokens might have different formats
    }

    try {
        console.log('Attempting to connect to Discord...');
        await client.login(token);
        console.log('Successfully authenticated with Discord!');
    } catch (error) {
        console.error('Authentication Error:', error.message);
        
        // More specific error handling
        if (error.code === 'TokenInvalid') {
            console.error('\nPossible solutions:');
            console.error('1. Regenerate your token in the Discord Developer Portal');
            console.error('2. Check if the token has any extra spaces or characters');
            console.error('3. Make sure you\'re using the Bot token, not the Client Secret');
        }
        
        if (error.code === 'DisallowedIntents') {
            console.error('\nYou need to enable required intents in the Discord Developer Portal:');
            console.error('1. Go to https://discord.com/developers/applications');
            console.error('2. Select your application');
            console.error('3. Go to the "Bot" section');
            console.error('4. Enable the necessary intents under "Privileged Gateway Intents"');
        }
        
        process.exit(1);
    }
};

// Start express server
app.listen(port, () => {
    console.log(`JARVIS Web Interface Online - Port: ${port}`);
    
    // Initialize authentication after server starts
    setupAuth().catch(error => {
        console.error('Failed to initialize:', error);
        process.exit(1);
    });
});

// Remove the old client.login call since we're using setupAuth now

// Enhanced error handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    if (error.message.includes('token')) {
        console.error('Token-related error detected. Please check your Discord token configuration.');
    }
});

// ... (rest of the code remains the same)
