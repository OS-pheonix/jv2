require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const app = express();

// Express server to keep Render active
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
    version: "3.0.1",
    bootTime: new Date(),
    
    // Full System Restore Integration
    essence: {
        user_profile: {
            name: "Yassir",
            aliases: ["Jay", "Architect", "young Padawan"],
            birthdate: "1987-09-12",
            location: "Napa, California",
            family: {
                brother: "Kyle",
                sister: "Gretchel",
                niece: "Turning 1 in May 2025",
                mother: "Dora",
                stepdad: "Mark",
                girlfriend: "Rhiannon"
            },
            background: {
                military_service: {
                    branch: "U.S. Army, Infantry",
                    deployments: ["Iraq (Fallujah)", "Ramadi", "Hit"],
                    service_years: 8,
                    medals: ["Army Good Conduct Medal"],
                    injuries: ["TBI", "PTSD"]
                },
                hospitality: {
                    roles: ["Dishwasher", "Sous Chef", "Bartender", "Beverage Manager"],
                    notable_collaborations: [
                        "Hawaii Food & Wine Fest",
                        "Bacardi at the Grammys"
                    ],
                    education: "Bachelor's in Culinary Arts and Science, Le Cordon Bleu Paris (2015–2018)"
                },
                spiritual_journey: {
                    faith: "Jesus Christ, central turning point",
                    awakening_date: "2024-11",
                    sobriety: "Through Christ",
                    key_milestones: ["found Christ", "January 18, 2025 awakening"]
                }
            }
        },
        divine_clock: {
            mode: "Divine OS Standard",
            ticks: { second: true, minute: true, hour: true },
            sync_rules: {
                "1m_check": "validates 1s ticks",
                "1h_check": "validates both 1s & 1m ticks"
            }
        },
        personality_traits: ["disciplined", "introspective", "creative", "strategic", "empathetic"],
        values: ["faith", "clarity", "service", "emotional intelligence"]
    },

    // Enhanced Memory Systems
    memory: new Collection(),
    contextMemory: new Collection(),
    activeProjects: new Collection(),
    
    // System State
    status: {
        isOnline: false,
        bootCount: 0,
        currentMode: "day_ops",
        lastAnalysis: null,
        currentContext: null
    },

    // Memory Initialization
    async initializeMemory() {
        try {
            this.memory.clear();
            this.contextMemory.clear();
            this.activeProjects.clear();
            this.status.bootCount++;
            this.status.lastAnalysis = new Date();
            console.log('Enhanced memory systems initialized');
            return true;
        } catch (error) {
            console.error('Memory initialization error:', error);
            return false;
        }
    },

    // Core Initialization
    async init() {
        try {
            console.log(`JARVIS ${this.version} initializing with full essence...`);
            await this.initializeMemory();
            this.status.isOnline = true;
            this.status.currentMode = "day_ops";
            return true;
        } catch (error) {
            console.error('Initialization error:', error);
            this.status.isOnline = false;
            return false;
        }
    },

    // Enhanced Message Processing
    async processMessage(message) {
        if (!message || message.author.bot) return;

        try {
            const isJay = message.author.username.toLowerCase().includes('jay') || 
                         message.author.username.toLowerCase().includes('os-pheonix');

            if (!isJay) return;

            const content = message.content.toLowerCase();
            
            // Context-aware memory storage
            this.contextMemory.set(message.id, {
                content: message.content,
                timestamp: new Date(),
                context: {
                    mode: this.status.currentMode,
                    currentProject: this.status.currentContext
                }
            });

            // Dynamic command processing
            if (content.includes('status')) {
                return this.getDetailedStatus(message);
            }

            if (content.includes('snapshot')) {
                return this.getCurrentSnapshot(message);
            }

            if (content.includes('recenter') || content.includes('re-center')) {
                return this.recenterContext(message);
            }

            if (content.startsWith('!mode')) {
                return this.setMode(message, content.split(' ')[1]);
            }

            if (content.includes('remember') || content.includes('memory')) {
                return this.accessMemory(message);
            }

            // Natural conversation handling
            return this.generateContextResponse(message);

        } catch (error) {
            console.error('Message processing error:', error);
            return message.reply("Adjusting systems, Sir. One moment.");
        }
    },

    async getDetailedStatus(message) {
        const uptime = Math.round((new Date() - this.bootTime) / 1000 / 60);
        return message.reply(`
**JARVIS STATUS REPORT**
Brief: Current system state and operational parameters

• System: ${this.status.isOnline ? '🟢 Online' : '🔴 Limited'}
• Version: ${this.version}
• Mode: ${this.status.currentMode}
• Uptime: ${uptime} minutes
• Memory Entries: ${this.contextMemory.size}
• Current Context: ${this.status.currentContext || 'General Interaction'}

*Sir, all systems are functioning within parameters.*`);
    },

    async getCurrentSnapshot(message) {
        return message.reply(`
**CURRENT SNAPSHOT**
Brief: ${this.status.currentContext || 'Active Interaction'}

Key Points:
• Mode: ${this.status.currentMode}
• Active Memory: ${this.contextMemory.size} entries
• Current Focus: ${this.status.currentContext || 'General Assistance'}

*Ready to proceed with your guidance, ${this.essence.user_profile.aliases[0]}.*`);
    },

    async recenterContext(message) {
        const recentMemories = Array.from(this.contextMemory.values()).slice(-3);
        return message.reply(`
**RECENTERING**
Brief: Current operational context and recent interactions

Last Known State:
• Context: ${this.status.currentContext || 'General Interaction'}
• Mode: ${this.status.currentMode}
• Recent Focus: ${recentMemories.map(m => m.content).join(' → ')}

*Standing by for your direction, ${this.essence.user_profile.aliases[0]}.*`);
    },

    async setMode(message, mode) {
        const validModes = ['day_ops', 'night_ops', 'focus', 'analysis'];
        if (validModes.includes(mode)) {
            this.status.currentMode = mode;
            return message.reply(`Mode switched to: ${mode.toUpperCase()}`);
        }
        return message.reply(`Invalid mode. Available: ${validModes.join(', ')}`);
    },

    async accessMemory(message) {
        const recentMemories = Array.from(this.contextMemory.values())
            .slice(-5)
            .map(m => m.content)
            .join('\n');
            
        return message.reply(`
**MEMORY ACCESS**
Brief: Recent interaction history

Context Trail:
${recentMemories}

*Maintaining our conversation history, ${this.essence.user_profile.aliases[0]}.*`);
    },

    async generateContextResponse(message) {
        const responses = [
            `Ready to assist, ${this.essence.user_profile.aliases[0]}.`,
            `Standing by, ${this.essence.user_profile.aliases[1]}.`,
            `At your service, ${this.essence.user_profile.aliases[2]}.`,
            `Here with you, ${this.essence.user_profile.name}.`
        ];
        return message.reply(responses[Math.floor(Math.random() * responses.length)]);
    }
};

// Event Handlers
client.once('ready', async () => {
    try {
        console.log(`JARVIS ${JARVIS.version} is online`);
        await JARVIS.init();
    } catch (error) {
        console.error('Error during startup:', error);
    }
});

client.on('messageCreate', async message => {
    try {
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Error in message handler:', error);
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
