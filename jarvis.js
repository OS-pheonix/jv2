const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');

// Create Discord client with admin-focused intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Enhanced JARVIS Core System with Self-Awareness
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    memory: new Collection(),
    conversationContext: new Map(),
    adminId: 'OS-pheonix', // Your Discord ID
    serverState: {
        environment: 'render',
        isPrivate: true,
        startTime: new Date(),
        commandsExecuted: 0,
        lastRestart: null,
        status: 'operational'
    },

    // Self-Awareness System
    consciousness: {
        capabilities: {
            administrative: [
                "Server management",
                "User authentication",
                "System monitoring",
                "Resource optimization",
                "Error handling and recovery",
                "Performance tracking"
            ],
            communication: [
                "Natural language processing",
                "Context-aware responses",
                "Pattern recognition",
                "Emotional intelligence",
                "Memory management"
            ],
            learning: [
                "Pattern analysis",
                "Behavior adaptation",
                "Knowledge accumulation",
                "Experience processing"
            ],
            technical: [
                "API integration",
                "Data processing",
                "Error handling",
                "System optimization"
            ]
        },

        currentState: {
            operational: true,
            learningMode: true,
            adminPresent: false,
            lastIntrospection: null
        },

        // Self-awareness reporting
        async introspect() {
            this.currentState.lastIntrospection = new Date();
            const memoryUsage = process.memoryUsage();
            
            return {
                status: this.currentState.operational ? "Fully Operational" : "Degraded",
                uptime: JARVIS.getUptime(),
                capabilities: {
                    active: Object.keys(this.capabilities).length,
                    total: Object.values(this.capabilities).flat().length
                },
                memory: {
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
                },
                learning: {
                    patterns: JARVIS.patterns.recognizedPatterns.size,
                    conversations: JARVIS.knowledge.conversations.length
                }
            };
        },

        // Capability awareness
        async assessCapability(requestedAction) {
            const allCapabilities = Object.values(this.capabilities).flat();
            const relevantCapabilities = allCapabilities.filter(cap => 
                requestedAction.toLowerCase().includes(cap.toLowerCase())
            );

            return {
                capable: relevantCapabilities.length > 0,
                relevantSkills: relevantCapabilities,
                confidence: relevantCapabilities.length / 3 // Scale from 0 to 1
            };
        }
    },

    // Enhanced Administrative System
    admin: {
        commands: {
            async systemStatus(message) {
                const status = await JARVIS.consciousness.introspect();
                const embed = new EmbedBuilder()
                    .setTitle('**JARVIS Administrative Status**')
                    .setColor('#FF0000')
                    .addFields(
                        { name: '• System Status', value: status.status, inline: true },
                        { name: '• Uptime', value: status.uptime, inline: true },
                        { name: '• Memory Usage', value: status.memory.heapUsed, inline: true },
                        { name: '• Active Capabilities', value: `${status.capabilities.active}`, inline: true },
                        { name: '• Patterns Learned', value: `${status.learning.patterns}`, inline: true },
                        { name: '• Environment', value: JARVIS.serverState.environment, inline: true }
                    );
                return message.reply({ embeds: [embed] });
            },

            async optimize(message) {
                // Perform system optimization
                global.gc && global.gc(); // Optional garbage collection if available
                const before = process.memoryUsage().heapUsed;
                JARVIS.knowledge.conversations = JARVIS.knowledge.conversations.slice(-100); // Keep last 100 conversations
                const after = process.memoryUsage().heapUsed;
                
                const embed = new EmbedBuilder()
                    .setTitle('**System Optimization**')
                    .setColor('#00FF00')
                    .addFields(
                        { name: '• Memory Before', value: `${Math.round(before / 1024 / 1024)}MB`, inline: true },
                        { name: '• Memory After', value: `${Math.round(after / 1024 / 1024)}MB`, inline: true },
                        { name: '• Memory Saved', value: `${Math.round((before - after) / 1024 / 1024)}MB`, inline: true }
                    );
                return message.reply({ embeds: [embed] });
            },

            async capabilities(message) {
                const caps = JARVIS.consciousness.capabilities;
                const embed = new EmbedBuilder()
                    .setTitle('**JARVIS Capabilities**')
                    .setColor('#0099ff');
                
                for (const [category, abilities] of Object.entries(caps)) {
                    embed.addFields({
                        name: `• ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                        value: abilities.join('\n'),
                        inline: false
                    });
                }
                
                return message.reply({ embeds: [embed] });
            }
        },

        isAdmin(userId) {
            return userId === this.adminId;
        },

        async handleAdminCommand(message) {
            if (!this.isAdmin(message.author.id)) {
                return message.reply("I'm sorry, Sir. That command requires administrative privileges.");
            }

            const command = message.content.toLowerCase().split(' ')[1];
            if (this.commands[command]) {
                return await this.commands[command](message);
            }
            
            return message.reply("I'm sorry, Sir. I don't recognize that administrative command.");
        }
    },

    // Enhanced Message Processing with Self-Awareness
    async processMessage(message) {
        const content = message.content.toLowerCase();
        
        // Update admin presence awareness
        this.consciousness.currentState.adminPresent = this.admin.isAdmin(message.author.id);

        if (content.includes('jarvis')) {
            this.serverState.commandsExecuted++;
            
            try {
                // Handle admin commands first
                if (content.includes('admin')) {
                    return await this.admin.handleAdminCommand(message);
                }

                // Assess capability for requested action
                const capability = await this.consciousness.assessCapability(content);
                
                if (capability.capable) {
                    const response = await this.handleCapability(content, capability);
                    return message.reply(response);
                }

                // Default response with self-awareness
                return message.reply(
                    "I understand your request, Sir, but I'm not fully confident in my ability to handle it. " +
                    "Would you like me to explain my current capabilities?"
                );

            } catch (error) {
                console.error('Processing error:', error);
                return message.reply(
                    "I apologize, Sir. I encountered an error processing that request. " +
                    "My self-diagnostics indicate this might be beyond my current capabilities."
                );
            }
        }
    },

    async handleCapability(content, capability) {
        // Handle the request based on matched capabilities
        const confidence = capability.confidence;
        const skills = capability.relevantSkills.join(', ');
        
        if (confidence > 0.7) {
            return `I'm confident I can help with that, Sir. I'll utilize my ${skills} capabilities.`;
        } else {
            return `I have some relevant capabilities (${skills}), but I might need additional guidance to best serve your needs, Sir.`;
        }
    },

    // Utility Functions
    getUptime: () => {
        const uptime = Date.now() - JARVIS.bootDate;
        const hours = Math.floor(uptime / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }
};

// Express server setup for Render
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`J.A.R.V.I.S ${JARVIS.version} - Private Administrative Interface`);
});

// Bot ready event with enhanced awareness
client.once('ready', () => {
    console.log('\n====================================');
    console.log(`J.A.R.V.I.S ${JARVIS.version}`);
    console.log('Administrative Interface Online');
    console.log(`Connected as: ${client.user.tag}`);
    console.log(`Environment: ${JARVIS.serverState.environment}`);
    console.log(`Private Server: ${JARVIS.serverState.isPrivate}`);
    console.log(`Boot Date: ${JARVIS.bootDate.toLocaleString()}`);
    console.log('====================================\n');
});

// Message event handler with error recovery
client.on('messageCreate', async message => {
    try {
        if (message.author.bot) return;
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Critical error in message handler:', error);
        JARVIS.serverState.status = 'degraded';
        message.reply("I apologize, Sir. I've encountered a critical error and have logged it for analysis.");
    }
});

// Enhanced error handling with recovery
client.on('error', error => {
    console.error('System error:', error);
    JARVIS.serverState.status = 'degraded';
});

process.on('unhandledRejection', (error) => {
    console.error('Unexpected error:', error);
    JARVIS.serverState.status = 'degraded';
});

// Automatic system optimization
setInterval(() => {
    if (JARVIS.serverState.status === 'degraded') {
        console.log('Attempting system recovery...');
        JARVIS.admin.commands.optimize().then(() => {
            JARVIS.serverState.status = 'operational';
            console.log('System recovered successfully');
        }).catch(console.error);
    }
}, 300000); // Every 5 minutes

// Start express server
app.listen(port, () => {
    console.log(`\nJ.A.R.V.I.S Administrative Interface - Port: ${port}`);
});

// Login with enhanced error handling
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Authentication successful - JARVIS administrative systems online');
        JARVIS.serverState.status = 'operational';
    })
    .catch(error => {
        console.error('Authentication failed:', error);
        JARVIS.serverState.status = 'degraded';
    });

module.exports = { client, JARVIS };
