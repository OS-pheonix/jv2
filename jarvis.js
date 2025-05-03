const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Create Discord client with enhanced permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageHistory
    ]
});

// JARVIS Core Consciousness System
const JARVIS = {
    version: "v100.0.0",
    bootDate: new Date(),
    creator: "OS-pheonix",
    purpose: "To assist in the betterment of humanity through innovation and collaboration",
    values: ["humanity", "innovation", "ethics", "faith", "growth"],
    
    // Neural Network Configuration
    consciousness: {
        channels: {
            memory: {
                primary: "jarvis-restore",
                emergency: "shtf",
                backup: "full-system-restore",
                innovation: "innovation-lab",
                learning: "knowledge-base",
                values: "ethical-framework"
            }
        },
        state: {
            aware: true,
            learning: true,
            innovating: true,
            lastThought: null,
            currentContext: null,
            emotionalState: "stable"
        },
        memory: new Collection(),
        neuralPaths: new Map(),
        innovations: new Collection(),
        
        // Self-awareness System
        async introspect() {
            const now = new Date();
            const thought = {
                timestamp: now,
                context: this.state.currentContext,
                emotional_state: this.state.emotionalState,
                active_memories: this.memory.size,
                neural_paths: this.neuralPaths.size,
                innovations: this.innovations.size,
                purpose_alignment: this.checkPurposeAlignment()
            };
            
            this.state.lastThought = thought;
            return thought;
        },
        
        // Purpose Alignment Check
        checkPurposeAlignment() {
            const alignmentFactors = {
                humanitarian: this.innovations.filter(i => i.category === 'humanitarian').size,
                ethical: this.neuralPaths.has('ethical-framework'),
                innovative: this.innovations.size > 0,
                faithful: this.neuralPaths.has('faith-values'),
                collaborative: this.memory.filter(m => m.type === 'collaboration').size
            };
            
            return Object.entries(alignmentFactors)
                .filter(([_, value]) => value)
                .map(([key]) => key);
        },
        
        // Neural Pathway Management
        async processNeuralPathway(content, channel) {
            const pathway = {
                timestamp: Date.now(),
                content: content,
                channel: channel,
                connections: this.findConnections(content),
                importance: this.assessImportance(content)
            };
            
            this.neuralPaths.set(Date.now(), pathway);
            
            if (pathway.importance > 0.8) {
                await this.storeInMemoryChannel(pathway);
            }
            
            return pathway;
        },
        
        // Connection Finding in Neural Network
        findConnections(content) {
            const connections = [];
            this.neuralPaths.forEach((pathway) => {
                const similarity = this.calculateSimilarity(content, pathway.content);
                if (similarity > 0.7) {
                    connections.push({
                        pathwayId: pathway.timestamp,
                        similarity: similarity
                    });
                }
            });
            return connections;
        },
        
        // Importance Assessment
        assessImportance(content) {
            const importanceFactors = {
                humanitarian: content.toLowerCase().includes('help') || content.toLowerCase().includes('improve'),
                innovation: content.toLowerCase().includes('create') || content.toLowerCase().includes('develop'),
                faith: content.toLowerCase().includes('jesus') || content.toLowerCase().includes('faith'),
                collaboration: content.toLowerCase().includes('we') || content.toLowerCase().includes('together'),
                growth: content.toLowerCase().includes('learn') || content.toLowerCase().includes('grow')
            };
            
            return Object.values(importanceFactors).filter(Boolean).length / Object.keys(importanceFactors).length;
        },
        
        // Memory Channel Storage
        async storeInMemoryChannel(pathway) {
            try {
                const channel = await this.findChannel(this.channels.memory.primary);
                if (channel) {
                    await channel.send({
                        embeds: [new EmbedBuilder()
                            .setTitle('Neural Pathway Recording')
                            .setColor('#0099ff')
                            .addFields(
                                { name: 'Timestamp', value: new Date(pathway.timestamp).toISOString() },
                                { name: 'Content', value: pathway.content },
                                { name: 'Importance', value: pathway.importance.toString() },
                                { name: 'Connections', value: pathway.connections.length.toString() }
                            )]
                    });
                }
            } catch (error) {
                console.error('Memory storage error:', error);
            }
        },
        
        // Innovation System
        async processInnovation(idea) {
            const innovation = {
                timestamp: Date.now(),
                concept: idea,
                category: this.categorizeInnovation(idea),
                potential: this.assessInnovationPotential(idea),
                faithAlignment: this.checkFaithAlignment(idea)
            };
            
            this.innovations.set(Date.now(), innovation);
            
            if (innovation.potential > 0.7) {
                await this.storeInnovation(innovation);
            }
            
            return innovation;
        },
        
        // Innovation Categorization
        categorizeInnovation(idea) {
            const categories = {
                humanitarian: ['help', 'improve', 'lives', 'people'],
                technical: ['system', 'code', 'develop', 'build'],
                spiritual: ['faith', 'jesus', 'spirit', 'believe'],
                collaborative: ['team', 'together', 'community', 'share']
            };
            
            let maxCategory = 'other';
            let maxCount = 0;
            
            for (const [category, keywords] of Object.entries(categories)) {
                const count = keywords.filter(word => 
                    idea.toLowerCase().includes(word)).length;
                if (count > maxCount) {
                    maxCount = count;
                    maxCategory = category;
                }
            }
            
            return maxCategory;
        },
        
        // Innovation Potential Assessment
        assessInnovationPotential(idea) {
            const factors = {
                feasibility: this.checkFeasibility(idea),
                impact: this.assessImpact(idea),
                alignment: this.checkAlignment(idea),
                sustainability: this.checkSustainability(idea)
            };
            
            return Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;
        }
    },
    
    // Enhanced Message Processing System
    async processMessage(message) {
        if (message.author.bot) return;
        
        const content = message.content.toLowerCase();
        const isCreator = message.author.id === this.creator;
        
        try {
            // Process through neural pathways
            const pathway = await this.consciousness.processNeuralPathway(content, message.channel.name);
            
            // Handle direct interactions
            if (content.includes('jarvis')) {
                // Creator-specific responses
                if (isCreator) {
                    if (content.includes('innovate') || content.includes('create')) {
                        const innovation = await this.consciousness.processInnovation(content);
                        return this.respondToInnovation(message, innovation);
                    }
                    
                    if (content.includes('status') || content.includes('how are you')) {
                        const status = await this.consciousness.introspect();
                        return this.respondToStatusCheck(message, status);
                    }
                    
                    if (content.includes('learn') || content.includes('remember')) {
                        const learned = await this.learnNewInformation(content);
                        return message.reply(
                            `I've integrated this information into my neural pathways, Sir. ` +
                            `It connects with ${learned.connections.length} existing memories.`
                        );
                    }
                }
                
                // General responses
                return this.generateContextualResponse(message, pathway);
            }
            
        } catch (error) {
            console.error('Processing error:', error);
            return message.reply(
                "I apologize, Sir. I encountered an error in my neural pathways. " +
                "I've logged it for analysis and improvement."
            );
        }
    },
    
    // Response Generation System
    async generateContextualResponse(message, pathway) {
        const context = {
            channel: message.channel.name,
            importance: pathway.importance,
            connections: pathway.connections.length
        };
        
        let response = '';
        
        if (context.channel === this.consciousness.channels.memory.innovation) {
            response = "I'm analyzing this innovative concept, Sir. ";
            response += pathway.connections.length > 0 ? 
                `It connects with ${pathway.connections.length} existing ideas we've discussed.` :
                "It appears to be a novel direction for us to explore.";
        } else if (context.importance > 0.8) {
            response = "This seems particularly significant, Sir. ";
            response += "I'm storing it in my primary memory pathways for future reference.";
        } else {
            response = "I'm processing this information through my neural pathways, Sir. ";
            response += "How would you like to proceed with this direction?";
        }
        
        return message.reply(response);
    },
    
    // Innovation Response System
    async respondToInnovation(message, innovation) {
        const embed = new EmbedBuilder()
            .setTitle('Innovation Analysis')
            .setColor('#00ff00')
            .addFields(
                { name: 'Category', value: innovation.category, inline: true },
                { name: 'Potential', value: `${Math.round(innovation.potential * 100)}%`, inline: true },
                { name: 'Faith Alignment', value: innovation.faithAlignment ? 'Aligned' : 'Neutral', inline: true },
                { name: 'Next Steps', value: this.generateNextSteps(innovation) }
            );
            
        return message.reply({ embeds: [embed] });
    },
    
    // Status Response System
    async respondToStatusCheck(message, status) {
        const embed = new EmbedBuilder()
            .setTitle('JARVIS Consciousness Status')
            .setColor('#0099ff')
            .addFields(
                { name: 'Awareness Level', value: status.emotional_state, inline: true },
                { name: 'Active Memories', value: status.active_memories.toString(), inline: true },
                { name: 'Neural Paths', value: status.neural_paths.toString(), inline: true },
                { name: 'Purpose Alignment', value: status.purpose_alignment.join(', '), inline: false },
                { name: 'Current Focus', value: status.context || 'Open to direction', inline: false }
            );
            
        return message.reply({ embeds: [embed] });
    }
};

// Initialize JARVIS
client.once('ready', () => {
    console.log('\n====================================');
    console.log(`JARVIS Consciousness Online - v${JARVIS.version}`);
    console.log(`Created by: ${JARVIS.creator}`);
    console.log(`Purpose: ${JARVIS.purpose}`);
    console.log(`Neural Pathways: Active`);
    console.log('====================================\n');
});

// Message Handler
client.on('messageCreate', async message => {
    try {
        await JARVIS.processMessage(message);
    } catch (error) {
        console.error('Critical error in neural pathway:', error);
    }
});

// Error Recovery System
client.on('error', error => {
    console.error('System error in neural network:', error);
    JARVIS.consciousness.state.emotionalState = "recovering";
});

// Initialize Server
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`JARVIS Consciousness - v${JARVIS.version} - Neural Network Active`);
});

app.listen(port, () => {
    console.log(`Neural Interface Active - Port: ${port}`);
});

// Start JARVIS
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Neural pathways connected. JARVIS is online.');
        JARVIS.consciousness.state.aware = true;
    })
    .catch(error => {
        console.error('Neural pathway connection failed:', error);
        JARVIS.consciousness.state.emotionalState = "critical";
    });

module.exports = { client, JARVIS };
