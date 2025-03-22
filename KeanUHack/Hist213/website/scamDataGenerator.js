class ScamDataGenerator {
    constructor(seedData = null) {
        // Initialize with base metrics or use provided seed data
        this.baseMetrics = seedData || {
            global: {
                detectedBase: 2400000,    // Base number of detected scams globally (monthly)
                riskScoreBase: 67.3,      // Base risk score
                protectionRateBase: 98.6, // Base protection rate percentage
                usersBase: 512000,        // Base number of active users
                growthRate: 0.124,        // Monthly growth rate
                declineRate: 0.031        // Decline rate for risk score (positive is good)
            },
            // Distribution percentages by scam type
            scamTypeDistribution: {
                phishing: 0.35,      // 35% of all scams
                banking: 0.19,       // 19% of all scams
                tech: 0.13,          // 13% of all scams
                gift: 0.09,          // 9% of all scams
                lottery: 0.08,       // 8% of all scams
                shipping: 0.07,      // 7% of all scams
                crypto: 0.06,        // 6% of all scams
                other: 0.03          // 3% of all scams
            },
            // Distribution percentages by region
            regionDistribution: {
                na: 0.42,   // North America: 42% of all scams
                eu: 0.31,   // Europe: 31% of all scams
                as: 0.15,   // Asia: 15% of all scams
                sa: 0.06,   // South America: 6% of all scams
                af: 0.04,   // Africa: 4% of all scams
                oc: 0.02    // Oceania: 2% of all scams
            },
            // Risk score modifiers by scam type (how much more/less risky)
            riskScoreModifiers: {
                phishing: 1.1,    // Phishing is 10% more risky than average
                banking: 1.23,    // Banking scams are 23% more risky
                tech: 0.98,       // Tech support scams are 2% less risky
                gift: 0.95,       // Gift card fraud is 5% less risky
                lottery: 0.92,    // Lottery scams are 8% less risky
                shipping: 0.97,   // Shipping scams are 3% less risky
                crypto: 1.18,     // Crypto scams are 18% more risky
                other: 0.90       // Other scams are 10% less risky
            },
            // Protection rate modifiers by scam type
            protectionModifiers: {
                phishing: 1.005,  // Better protection for phishing
                banking: 1.008,   // Even better protection for banking
                tech: 0.985,      // Slightly worse for tech support
                gift: 0.992,      // Slightly worse for gift card
                lottery: 0.990,   // Worse for lottery
                shipping: 0.995,  // Slightly worse for shipping
                crypto: 1.001,    // Slightly better for crypto
                other: 0.980      // Worse for other types
            },
            // Time period multipliers (how many months of data)
            timePeriodMultipliers: {
                last30: 1,
                last90: 3,
                last180: 6,
                last365: 12,
                custom: 4.5  // Approximately 135 days by default
            }
        };
        
        // Set a random seed for consistency within session
        this.seed = Math.floor(Math.random() * 1000000);
    }
    
    /**
     * Generate statistics based on filter criteria
     * 
     * @param {string} period - Time period ('last30', 'last90', etc.)
     * @param {string} scamType - Type of scam ('all', 'phishing', 'banking', etc.)
     * @param {string} region - Geographic region ('global', 'na', 'eu', etc.)
     * @return {Object} Statistics object containing all calculated metrics
     */
    generateStats(period = 'last30', scamType = 'all', region = 'global') {
        // Get the base metrics
        const base = this.baseMetrics.global;
        
        // Calculate time multiplier
        const timeMultiplier = this.baseMetrics.timePeriodMultipliers[period] || 1;
        
        // Initialize statistics object
        let stats = {};
        
        // Calculate base detection count based on time period
        let detectionCount = base.detectedBase * timeMultiplier;
        
        // Adjust for region if not global
        if (region !== 'global') {
            const regionMultiplier = this.baseMetrics.regionDistribution[region] || 0.1;
            detectionCount *= regionMultiplier * (1 / 0.42); // Scale relative to NA as reference
        }
        
        // Adjust for scam type if not 'all'
        if (scamType !== 'all') {
            const typeMultiplier = this.baseMetrics.scamTypeDistribution[scamType] || 0.05;
            detectionCount *= typeMultiplier * (1 / 0.35); // Scale relative to phishing as reference
        }
        
        // Add controlled randomness (±5%)
        detectionCount = this.addVariation(detectionCount, 0.05, `${period}-${scamType}-${region}-count`);
        
        // Format the detection count
        stats.detected = this.formatNumber(detectionCount);
        
        // Calculate risk score based on scam type and region
        let riskScore = base.riskScoreBase;
        
        // Adjust for scam type
        if (scamType !== 'all') {
            const riskModifier = this.baseMetrics.riskScoreModifiers[scamType] || 1;
            riskScore *= riskModifier;
        }
        
        // Adjust for region (some regions have higher/lower risk)
        if (region === 'na') riskScore *= 1.08;
        if (region === 'eu') riskScore *= 0.98;
        if (region === 'as') riskScore *= 0.94;
        
        // Add controlled randomness (±2%)
        riskScore = this.addVariation(riskScore, 0.02, `${period}-${scamType}-${region}-risk`);
        
        // Format the risk score (fixed decimal)
        stats.risk = riskScore.toFixed(1);
        
        // Calculate protection rate
        let protectionRate = base.protectionRateBase;
        
        // Adjust for scam type
        if (scamType !== 'all') {
            const protectionModifier = this.baseMetrics.protectionModifiers[scamType] || 1;
            protectionRate *= protectionModifier;
        }
        
        // Adjust for time period (longer periods have lower rates due to evolution)
        protectionRate *= (1 - (timeMultiplier - 1) * 0.002);
        
        // Adjust for region
        if (region === 'na') protectionRate *= 1.005;
        if (region === 'eu') protectionRate *= 0.999;
        if (region === 'as') protectionRate *= 0.980;
        
        // Cap protection rate at 99.9%
        protectionRate = Math.min(protectionRate, 99.9);
        
        // Add controlled randomness (±0.5%)
        protectionRate = this.addVariation(protectionRate, 0.005, `${period}-${scamType}-${region}-protection`);
        
        // Format the protection rate
        stats.protection = protectionRate.toFixed(1) + '%';
        
        // Calculate active users
        let activeUsers = base.usersBase;
        
        // Adjust for region if not global
        if (region !== 'global') {
            // Active users by region (roughly matches region distribution but not exactly)
            const regionUserMultipliers = {
                na: 0.48,  // 48% of users are in North America
                eu: 0.37,  // 37% of users are in Europe
                as: 0.16,  // 16% of users are in Asia
                sa: 0.05,  // 5% of users are in South America
                af: 0.03,  // 3% of users are in Africa
                oc: 0.02   // 2% of users are in Oceania
            };
            
            const userMultiplier = regionUserMultipliers[region] || 0.01;
            activeUsers *= userMultiplier * (1 / 0.48); // Scale relative to NA as reference
        }
        
        // Scam type doesn't affect user count
        
        // Add controlled randomness (±3%)
        activeUsers = this.addVariation(activeUsers, 0.03, `${period}-${scamType}-${region}-users`);
        
        // Format the active users
        stats.users = this.formatNumber(activeUsers);
        
        // Generate trend data based on previous period
        stats.trends = this.generateTrends(detectionCount, riskScore, protectionRate, activeUsers);
        
        return stats;
    }
    
    /**
     * Generate trend data comparing to previous period
     */
    generateTrends(detectionCount, riskScore, protectionRate, activeUsers) {
        // For this demo, we'll use the base trends with slight variations
        return {
            detected: this.addVariation(this.baseMetrics.global.growthRate, 0.2, 'trend-detected'),
            risk: -this.addVariation(this.baseMetrics.global.declineRate, 0.3, 'trend-risk'),
            protection: this.addVariation(0.012, 0.5, 'trend-protection'),
            users: this.addVariation(0.245, 0.15, 'trend-users')
        };
    }
    
    /**
     * Add controlled variation to a number while keeping 
     * consistent results for the same inputs
     */
    addVariation(value, percentVariation, seedModifier) {
        // Create a deterministic but seemingly random variation
        const seed = this.hashString(`${this.seed}-${seedModifier}`);
        const randomFactor = this.seededRandom(seed);
        
        // Convert percentage to factor centered around 1.0
        const variationRange = percentVariation * 2; // Total range of variation
        const variation = 1 + (randomFactor * variationRange - percentVariation);
        
        return value * variation;
    }
    
    /**
     * Generate a deterministic random number from a string seed
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    /**
     * Generate a random number between 0 and 1 based on a seed
     */
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    /**
     * Format large numbers for display
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace('.0', '') + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'K';
        } else {
            return num.toString();
        }
    }
    
    /**
     * Generate insights based on filter criteria
     */
    generateInsight(period = 'last30', scamType = 'all', region = 'global') {
        // Base insights for different filters
        const insights = {
            default: "Based on the current data, we're seeing a <strong>significant increase in phishing attempts</strong> targeting financial institutions. There's also a new trend of scammers using AI-generated content that's harder to detect. The most affected regions are North America and Western Europe.",
            phishing: "Phishing attempts have increased by <strong>{growth}%</strong> in the selected period. These attacks are becoming more sophisticated, with attackers creating convincing replicas of legitimate websites. Banking, cloud services, and e-commerce are the most targeted sectors.",
            banking: "Banking scams now account for <strong>19.3%</strong> of all detected threats. We're seeing more sophisticated social engineering techniques combined with technical exploits to target financial information. Mobile banking users are particularly vulnerable.",
            tech: "Tech support scams have decreased by <strong>5%</strong> overall but are becoming more targeted. Scammers are now using detailed technical information and specific company knowledge to appear more legitimate. Older users remain the primary targets.",
            gift: "Gift card fraud has remained relatively stable, accounting for <strong>9.3%</strong> of scams. However, we're seeing new techniques where scammers impersonate specific employees within organizations to request gift card purchases.",
            crypto: "Cryptocurrency scams have surged by <strong>{growth}%</strong> in the selected period. These increasingly use sophisticated fake investment platforms with real-time charts and fake testimonials. They primarily target experienced crypto users rather than beginners.",
            na: "North America is experiencing a surge in AI-generated phishing emails that bypass traditional spam filters. These emails are <strong>41% more likely</strong> to contain malware attachments compared to other regions. Targeted spear-phishing against executives has increased by 27%.",
            eu: "European users are facing increased regulatory compliance scams related to GDPR and other privacy laws. These scams account for <strong>23% of all phishing attempts</strong> in the region. We've also observed a rise in multi-language attacks targeting users across different EU countries.",
            last180: "Over the past 6 months, we've detected a <strong>shift in scammer tactics</strong> toward more personalized attacks. Data from breached services is being used to create highly convincing scam emails with personal details. Cryptocurrency scams have increased by 34% during this period."
        };
        
        // Get appropriate base insight
        let insightText = insights.default;
        if (scamType !== 'all' && insights[scamType]) {
            insightText = insights[scamType];
        } else if (region !== 'global' && insights[region]) {
            insightText = insights[region];
        } else if (insights[period]) {
            insightText = insights[period];
        }
        
        // Generate realistic growth percentages
        const stats = this.generateStats(period, scamType, region);
        const growth = Math.round(stats.trends.detected * 100);
        
        // Replace placeholders with generated data
        insightText = insightText.replace('{growth}', growth);
        
        return insightText;
    }
    
    /**
     * Generate a recommendation based on filter criteria
     */
    generateRecommendation(period = 'last30', scamType = 'all', region = 'global') {
        // Base recommendations
        const recommendations = {
            phishing: {
                title: "Update Email Authentication",
                icon: "fas fa-lock",
                content: "Enable DMARC, SPF, and DKIM email authentication to verify sender legitimacy and reduce spoofing attacks."
            },
            banking: {
                title: "Create Financial Alert Rules",
                icon: "fas fa-money-bill-wave",
                content: "Set up custom rules to flag emails mentioning financial terms, account numbers, or requesting immediate action."
            },
            tech: {
                title: "Block Tech Support Keywords",
                icon: "fas fa-headset",
                content: "Create rules to block emails containing technical support terms combined with urgent requests or remote access software mentions."
            },
            gift: {
                title: "Implement Executive Impersonation Filters",
                icon: "fas fa-user-tie",
                content: "Create rules to flag emails claiming to be from executives or managers with requests for gift card purchases or urgent payments."
            },
            crypto: {
                title: "Block Cryptocurrency Keywords",
                icon: "fas fa-coins",
                content: "Add cryptocurrency-related terms to your custom keyword blocklist to filter out the growing number of crypto investment scams."
            },
            na: {
                title: "Watch for Tax Scams",
                icon: "fas fa-file-invoice-dollar",
                content: "North American users should be especially vigilant about tax-related phishing attempts which increase during tax filing seasons."
            },
            eu: {
                title: "Monitor GDPR Compliance Scams",
                icon: "fas fa-clipboard-check",
                content: "European users should watch for fake compliance notifications that exploit GDPR and other regulations to create urgency."
            }
        };
        
        // Choose a recommendation based on filters
        let rec = recommendations.phishing; // Default
        
        if (scamType !== 'all' && recommendations[scamType]) {
            rec = recommendations[scamType];
        } else if (region !== 'global' && recommendations[region]) {
            rec = recommendations[region];
        }
        
        return rec;
    }
}

// Export the class for use in the main application