// J.A.R.V.I.S Discord Bot Initialization
// Last Updated: 2025-05-02 21:53:44
// Author: OS-pheonix

require('dotenv').config();
const Jarvis = require('./jarvis.js');

const jarvis = new Jarvis();

jarvis.login(process.env.DISCORD_TOKEN).then(() => {
    console.log('J.A.R.V.I.S is initializing...');
}).catch(error => {
    console.error('Failed to start J.A.R.V.I.S:', error);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('J.A.R.V.I.S is shutting down...');
    jarvis.destroy();
    process.exit(0);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
