// ... (previous code until line 59 remains the same)

        // Smart Input Analysis
        analyzeInput: (input) => {
            const analysis = {
                intent: JARVIS.intelligence.detectIntent(input),
                entities: JARVIS.intelligence.extractEntities(input),
                sentiment: JARVIS.intelligence.analyzeSentiment(input),
                complexity: JARVIS.intelligence.assessComplexity(input),
                topics: JARVIS.intelligence.identifyTopics(input),
                context: JARVIS.intelligence.determineContext(input)
            };
            
            return analysis;
        },

        // Add missing functions
        analyzeSentiment: (input) => {
            const positiveWords = /\b(good|great|excellent|amazing|love|happy|perfect|fantastic|awesome)\b/i;
            const negativeWords = /\b(bad|wrong|terrible|awful|hate|sad|angry|frustrated|disappointed)\b/i;
            
            if (positiveWords.test(input)) return 'positive';
            if (negativeWords.test(input)) return 'negative';
            return 'neutral';
        },

        assessComplexity: (input) => {
            const words = input.split(/\s+/).length;
            const technicalTerms = /\b(algorithm|function|system|process|analysis|implementation|development|architecture)\b/gi;
            const matches = input.match(technicalTerms) || [];
            
            if (words > 20 || matches.length > 2) return 'high';
            if (words > 10 || matches.length > 0) return 'medium';
            return 'low';
        },

        identifyTopics: (input) => {
            const topics = new Set();
            const topicPatterns = {
                technical: /\b(code|program|system|data|algorithm)\b/i,
                creative: /\b(design|create|build|develop|innovate)\b/i,
                planning: /\b(plan|strategy|approach|method|process)\b/i,
                beam: /\b(beam|transfer|connect|link)\b/i
            };

            for (const [topic, pattern] of Object.entries(topicPatterns)) {
                if (pattern.test(input)) topics.add(topic);
            }

            return topics;
        },

        determineContext: (input) => {
            const contexts = {
                technical: /\b(code|program|error|bug|system|function)\b/i,
                planning: /\b(plan|design|create|develop|implement)\b/i,
                question: /\b(how|what|why|when|where|who)\b/i,
                beam: /\b(beam|transfer|connection)\b/i,
                personal: /\b(feel|think|believe|want|need)\b/i,
                spiritual: /\b(faith|jesus|christ|god|pray|spirit)\b/i
            };

            for (const [context, pattern] of Object.entries(contexts)) {
                if (pattern.test(input)) return context;
            }

            return 'general';
        },

        // ... (rest of the intelligence functions remain the same)

// ... (rest of the code remains the same)
