// Load environment variables first
require('dotenv').config();

// Import JARVIS system
const { JARVIS, client } = require('./jarvis');

// Start the application
const startServer = async () => {
    try {
        await JARVIS.initialize();
    } catch (error) {
        console.error('Failed to start JARVIS:', error);
        process.exit(1);
    }
};

// Start JARVIS
startServer();

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled error:', error);
    if (error.message.includes('token')) {
        console.error('Token-related error detected. Please check your Discord token configuration.');
    }
});

module.exports = { client, JARVIS };
