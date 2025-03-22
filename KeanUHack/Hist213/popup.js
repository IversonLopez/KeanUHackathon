// Popup script for Email Scam Protector

// Initialize the popup
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadStats();
    setupEventListeners();
  });
  
  // Load user settings
  function loadSettings() {
    chrome.runtime.sendMessage({ action: 'getSettings' }, function(settings) {
      if (!settings) return;
      
      // Update toggle switch
      document.getElementById('protection-toggle').checked = settings.enabled;
      
      // Update email field
      if (settings.userEmail) {
        document.getElementById('user-email').value = settings.userEmail;
      }
      
      // Update scan level
      document.getElementById('scan-level-select').value = settings.scanLevel || 'medium';
      document.getElementById('scan-level').textContent = 
        (settings.scanLevel || 'medium').charAt(0).toUpperCase() + 
        (settings.scanLevel || 'medium').slice(1);
      
      // Update auto unsubscribe
      document.getElementById('auto-unsubscribe').checked = settings.autoUnsubscribe;
    });
  }
  
  // Load statistics
  function loadStats() {
    chrome.runtime.sendMessage({ action: 'getStats' }, function(stats) {
      if (!stats) return;
      
      // Update stat counters
      document.getElementById('total-detected').textContent = stats.totalDetected;
      document.getElementById('recent-detected').textContent = stats.recentDetections;
      document.getElementById('blocked-count').textContent = stats.blockedSenders.length;
      
      // Load recent scams
      chrome.storage.sync.get(['detectedEmails'], function(result) {
        const detectedEmails = result.detectedEmails || [];
        
        // Get recent scams container
        const recentContainer = document.getElementById('recent-scams-container');
        const allContainer = document.getElementById('all-scams-container');
        
        if (detectedEmails.length === 0) {
          recentContainer.innerHTML = '<div class="no-data">No scams detected yet</div>';
          allContainer.innerHTML = '<div class="no-data">No scams detected yet</div>';
          return;
        }
        
        // Clear containers
        recentContainer.innerHTML = '';
        allContainer.innerHTML = '';
        
        // Sort by timestamp, newest first
        const sortedEmails = [...detectedEmails].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        // Display recent scams (last 5)
        const recentEmails = sortedEmails.slice(0, 5);
        recentEmails.forEach(function(email) {
          const item = createScamListItem(email);
          recentContainer.appendChild(item);
        });
        
        // Display all scams
        sortedEmails.forEach(function(email) {
          const item = createScamListItem(email);
          allContainer.appendChild(item);
        });
      });
    });
  }
  
  // Create a scam list item
  function createScamListItem(email) {
    const item = document.createElement('div');
    item.className = 'recent-item';
    
    const timestamp = new Date(email.timestamp);
    const dateStr = timestamp.toLocaleDateString();
    
    item.innerHTML = `
      <div class="recent-sender">
        ${email.sender}
        <span class="score-badge">Score: ${email.score}</span>
      </div>
      <div class="recent-subject">${email.subject}</div>
      <div style="font-size: 11px; color: #7f8c8d; margin-top: 5px;">
        ${dateStr}
      </div>
    `;
    
    return item;
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const tabName = this.getAttribute('data-tab');
        document.getElementById(tabName + '-tab').classList.add('active');
      });
    });
    
    // Protection toggle
    document.getElementById('protection-toggle').addEventListener('change', function(e) {
      const enabled = e.target.checked;
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: { enabled }
      });
    });
    
    // Save settings button
    document.getElementById('save-settings').addEventListener('click', function() {
      const userEmail = document.getElementById('user-email').value;
      const scanLevel = document.getElementById('scan-level-select').value;
      const autoUnsubscribe = document.getElementById('auto-unsubscribe').checked;
      
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: {
          userEmail,
          scanLevel,
          autoUnsubscribe
        }
      }, function() {
        // Update the displayed scan level on the dashboard
        document.getElementById('scan-level').textContent = 
          scanLevel.charAt(0).toUpperCase() + scanLevel.slice(1);
        
        // Show a little saved notification
        const saveBtn = document.getElementById('save-settings');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Settings Saved!';
        saveBtn.style.backgroundColor = '#27ae60';
        
        setTimeout(function() {
          saveBtn.textContent = originalText;
          saveBtn.style.backgroundColor = '#2ecc71';
        }, 1500);
      });
    });
  }