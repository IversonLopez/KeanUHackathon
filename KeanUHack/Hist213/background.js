// Background script for Email Scam Protector

// Initialize settings when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
      enabled: true,
      userEmail: '',
      scanLevel: 'medium', // low, medium, high
      autoUnsubscribe: false,
      scamKeywords: [
        'urgent action required',
        'verify your account',
        'suspicious activity',
        'your account has been locked',
        'bank account',
        'credit card details',
        'password reset',
        'lottery winner',
        'unexpected prize',
        'million dollars',
        'exclusive offer',
        'limited time',
        'click here',
        'act now',
        'cryptocurrency investment'
      ],
      phishingPatterns: [
        'mismatched urls',
        'unofficial domain',
        'request for personal information',
        'poor grammar and spelling',
        'threatening language',
        'suspicious attachments'
      ],
      detectedEmails: [],
      blockedSenders: []
    });
  });
  
  // Listen for messages from the content script or popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'scanEmail') {
      scanEmail(message.emailContent, message.sender, message.subject)
        .then(result => sendResponse(result));
      return true; // Required for async response
    }
    else if (message.action === 'unsubscribe') {
      handleUnsubscribe(message.sender, message.unsubscribeLink)
        .then(result => sendResponse(result));
      return true;
    }
    else if (message.action === 'updateSettings') {
      updateSettings(message.settings)
        .then(result => sendResponse(result));
      return true;
    }
    else if (message.action === 'getSettings') {
      getSettings().then(settings => sendResponse(settings));
      return true;
    }
    else if (message.action === 'getStats') {
      getStats().then(stats => sendResponse(stats));
      return true;
    }
  });
  
  // AI-powered email scanning function
  async function scanEmail(emailContent, sender, subject) {
    try {
      // Get settings and keywords
      const settings = await getSettings();
      
      if (!settings.enabled) {
        return { isScam: false, score: 0, matches: [] };
      }
      
      // Simple keyword-based detection (in a real app, we'd use more sophisticated ML)
      const matches = [];
      let score = 0;
      
      // Check sender domain against common legitimate domains
      const senderDomain = sender.split('@')[1].toLowerCase();
      const suspiciousDomain = !commonLegitimateDomainsCheck(senderDomain);
      
      if (suspiciousDomain) {
        matches.push('Suspicious sender domain');
        score += 15;
      }
      
      // Check for scam keywords in subject
      settings.scamKeywords.forEach(keyword => {
        if (subject.toLowerCase().includes(keyword.toLowerCase())) {
          matches.push(`Subject contains "${keyword}"`);
          score += 10;
        }
      });
      
      // Check for scam keywords in content
      settings.scamKeywords.forEach(keyword => {
        if (emailContent.toLowerCase().includes(keyword.toLowerCase())) {
          matches.push(`Content contains "${keyword}"`);
          score += 5;
        }
      });
      
      // Check for phishing patterns
      settings.phishingPatterns.forEach(pattern => {
        // This is simplified - in a real app we'd use more sophisticated pattern matching
        if (emailContent.toLowerCase().includes(pattern.toLowerCase())) {
          matches.push(`Phishing pattern detected: "${pattern}"`);
          score += 15;
        }
      });
      
      // Check for urgent language
      if (/urgent|immediately|alert|warning|limited time/i.test(emailContent)) {
        matches.push('Urgent or threatening language');
        score += 10;
      }
      
      // Check for excessive use of capital letters
      const capitalRatio = calculateCapitalRatio(emailContent);
      if (capitalRatio > 0.3) { // If more than 30% are capital letters
        matches.push('Excessive use of capital letters');
        score += 5;
      }
      
      // Check for suspicious links
      const hasHiddenOrSuspiciousLinks = checkForSuspiciousLinks(emailContent);
      if (hasHiddenOrSuspiciousLinks) {
        matches.push('Contains suspicious or masked links');
        score += 20;
      }
      
      // Determine threshold based on scan level
      let threshold;
      switch (settings.scanLevel) {
        case 'low':
          threshold = 40;
          break;
        case 'medium':
          threshold = 25;
          break;
        case 'high':
          threshold = 15;
          break;
        default:
          threshold = 25;
      }
      
      // Store detection if it's a scam
      const isScam = score >= threshold;
      
      if (isScam) {
        // Add to detected emails list
        const detectedEmails = settings.detectedEmails || [];
        detectedEmails.push({
          sender,
          subject,
          score,
          matches,
          timestamp: new Date().toISOString()
        });
        
        // Limit to last 100 detected emails
        if (detectedEmails.length > 100) {
          detectedEmails.shift();
        }
        
        await chrome.storage.sync.set({ detectedEmails });
      }
      
      return {
        isScam,
        score,
        threshold,
        matches
      };
    } catch (error) {
      console.error('Error scanning email:', error);
      return { isScam: false, score: 0, matches: [], error: error.message };
    }
  }
  
  // Helper function to check for suspicious links
  function checkForSuspiciousLinks(content) {
    // Look for links where display text doesn't match the actual URL
    const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[1];
      const displayText = match[2].replace(/<[^>]*>/g, ''); // Remove any nested HTML
      
      // If display text is a URL but different from the actual URL
      if (displayText.includes('http') && !url.includes(displayText)) {
        return true;
      }
      
      // Check for suspicious TLDs or domains
      if (/\.(xyz|tk|ml|ga|cf|gq|top)$/i.test(url)) {
        return true;
      }
    }
    
    // Check for IP address URLs instead of domain names
    const ipUrlRegex = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i;
    if (ipUrlRegex.test(content)) {
      return true;
    }
    
    return false;
  }
  
  // Helper function to calculate the ratio of capital letters
  function calculateCapitalRatio(text) {
    const letters = text.replace(/[^a-zA-Z]/g, '');
    if (letters.length === 0) return 0;
    
    const capitals = letters.replace(/[^A-Z]/g, '');
    return capitals.length / letters.length;
  }
  
  // Function to check against common legitimate domains
  function commonLegitimateDomainsCheck(domain) {
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com',
      'icloud.com', 'protonmail.com', 'mail.com', 'zoho.com',
      // Add common business and educational domains
      'microsoft.com', 'apple.com', 'amazon.com', 'google.com',
      'facebook.com', 'twitter.com', 'linkedin.com', 'edu', 'gov'
    ];
    
    // Check if the domain or its suffix (for .edu, .gov) is in the list
    return commonDomains.some(commonDomain => 
      domain === commonDomain || domain.endsWith('.' + commonDomain));
  }
  
  // Handle unsubscribe request
  async function handleUnsubscribe(sender, unsubscribeLink) {
    try {
      // In a real extension, we would handle the unsubscribe process
      // This would involve either:
      // 1. Opening the unsubscribe link in a new tab
      // 2. Sending an unsubscribe email request
      // 3. Using API calls to email providers if available
      
      // For now, we'll just track that we've unsubscribed
      const settings = await getSettings();
      const blockedSenders = settings.blockedSenders || [];
      
      // Add sender to blocked list if not already there
      if (!blockedSenders.includes(sender)) {
        blockedSenders.push(sender);
        await chrome.storage.sync.set({ blockedSenders });
      }
      
      return {
        success: true,
        message: `Unsubscribed from ${sender}`,
        unsubscribeLink
      };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Update user settings
  async function updateSettings(newSettings) {
    try {
      const currentSettings = await getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      await chrome.storage.sync.set(updatedSettings);
      return { success: true };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get current settings
  async function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (settings) => {
        resolve(settings);
      });
    });
  }
  
  // Get statistics about detected scams
  async function getStats() {
    const settings = await getSettings();
    const detectedEmails = settings.detectedEmails || [];
    
    // Calculate statistics
    const totalDetected = detectedEmails.length;
    
    // Count detections in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDetections = detectedEmails.filter(email => 
      new Date(email.timestamp) > thirtyDaysAgo
    ).length;
    
    // Top senders of suspicious emails
    const senderCounts = {};
    detectedEmails.forEach(email => {
      senderCounts[email.sender] = (senderCounts[email.sender] || 0) + 1;
    });
    
    const topSenders = Object.entries(senderCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([sender, count]) => ({ sender, count }));
    
    // Most common patterns detected
    const patternCounts = {};
    detectedEmails.forEach(email => {
      email.matches.forEach(match => {
        patternCounts[match] = (patternCounts[match] || 0) + 1;
      });
    });
    
    const topPatterns = Object.entries(patternCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([pattern, count]) => ({ pattern, count }));
    
    return {
      totalDetected,
      recentDetections,
      topSenders,
      topPatterns,
      blockedSenders: settings.blockedSenders || []
    };
  }