// Content script for Email Scam Protector
// This script runs on supported email provider pages

// Configuration for different email providers
const EMAIL_PROVIDERS = {
    'mail.google.com': {
      name: 'Gmail',
      emailContainerSelector: '.adn.ads',
      emailBodySelector: '.a3s.aiL',
      emailHeaderSelector: '.ha h2',
      senderSelector: '.gD',
      subjectSelector: '.hP',
      unsubscribeLinkSelector: 'a[href*="unsubscribe"]'
    },
    'outlook.live.com': {
      name: 'Outlook',
      emailContainerSelector: '.ReadingPaneContent',
      emailBodySelector: '._2jWS-Hg3XFd7B7uXzwxHiQ',
      emailHeaderSelector: '._2LPeM1CJ2YifJzz1-AvN_H',
      senderSelector: '._1Ux_OQO3DFc0s-Bps5M0R2',
      subjectSelector: '._3iXT2IUu6Fp_cUBtV3mScr',
      unsubscribeLinkSelector: 'a[href*="unsubscribe"]'
    },
    'mail.yahoo.com': {
      name: 'Yahoo Mail',
      emailContainerSelector: '.message-view',
      emailBodySelector: '.message-body',
      emailHeaderSelector: '.message-header',
      senderSelector: '.sender',
      subjectSelector: '.subject',
      unsubscribeLinkSelector: 'a[href*="unsubscribe"]'
    }
  };
  
  // Get the current email provider configuration
  function getCurrentProvider() {
    const hostname = window.location.hostname;
    for (const domain in EMAIL_PROVIDERS) {
      if (hostname.includes(domain)) {
        return EMAIL_PROVIDERS[domain];
      }
    }
    return null;
  }
  
  // Initialize when the page loads
  let provider = getCurrentProvider();
  let scanInProgress = false;
  let scanTimer = null;
  
  // Set up a mutation observer to detect when emails are loaded or changed
  function initObserver() {
    if (!provider) return;
    
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    
    const callback = function(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // If we detect changes in the DOM, check if an email is open
          checkForOpenEmail();
        }
      }
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    
    // Also check immediately in case an email is already open
    checkForOpenEmail();
    
    // And check periodically
    setInterval(checkForOpenEmail, 3000);
  }
  
  // Check if an email is currently open for viewing
  function checkForOpenEmail() {
    if (!provider || scanInProgress) return;
    
    // Clear any previous scan timer
    if (scanTimer) {
      clearTimeout(scanTimer);
    }
    
    // Set a small delay to ensure the email content is fully loaded
    scanTimer = setTimeout(() => {
      const emailContainer = document.querySelector(provider.emailContainerSelector);
      if (emailContainer) {
        scanCurrentEmail();
      }
    }, 1000);
  }
  
  // Scan the currently open email
  async function scanCurrentEmail() {
    if (!provider || scanInProgress) return;
    
    try {
      scanInProgress = true;
      
      // Check if we already scanned this email (look for our warning badge)
      if (document.querySelector('.scam-protector-badge')) {
        scanInProgress = false;
        return;
      }
      
      // Get email content
      const emailBody = document.querySelector(provider.emailBodySelector);
      const senderElement = document.querySelector(provider.senderSelector);
      const subjectElement = document.querySelector(provider.subjectSelector);
      
      if (!emailBody || !senderElement || !subjectElement) {
        scanInProgress = false;
        return;
      }
      
      const emailContent = emailBody.innerHTML;
      const sender = senderElement.textContent.trim();
      const subject = subjectElement.textContent.trim();
      
      // Get unsubscribe link if present
      const unsubscribeLink = findUnsubscribeLink();
      
      // Send to background script for scanning
      chrome.runtime.sendMessage({
        action: 'scanEmail',
        emailContent,
        sender,
        subject
      }, (response) => {
        if (response.isScam) {
          // Add warning to the email
          addScamWarning(response, sender, unsubscribeLink);
        }
        scanInProgress = false;
      });
    } catch (error) {
      console.error('Error scanning email:', error);
      scanInProgress = false;
    }
  }
  
  // Find any unsubscribe link in the email
  function findUnsubscribeLink() {
    if (!provider) return null;
    
    // Find visible unsubscribe links in the email body
    const unsubscribeLinks = document.querySelectorAll(provider.unsubscribeLinkSelector);
    if (unsubscribeLinks.length > 0) {
      return unsubscribeLinks[0].href;
    }
    
    // Sometimes unsubscribe links are in different formats, try to find other common patterns
    const allLinks = document.querySelectorAll('a');
    for (const link of allLinks) {
      const href = link.href.toLowerCase();
      const text = link.textContent.toLowerCase();
      
      if (
        href.includes('unsubscribe') || 
        href.includes('opt-out') || 
        href.includes('opt_out') ||
        text.includes('unsubscribe') || 
        text.includes('opt-out') || 
        text.includes('opt out')
      ) {
        return link.href;
      }
    }
    
    return null;
  }
  
  // Add a warning banner to emails detected as potential scams
  function addScamWarning(scanResult, sender, unsubscribeLink) {
    if (!provider) return;
    
    const emailContainer = document.querySelector(provider.emailHeaderSelector) || 
                            document.querySelector(provider.emailContainerSelector);
    
    if (!emailContainer) return;
    
    // Create warning element
    const warningElement = document.createElement('div');
    warningElement.className = 'scam-protector-badge';
    warningElement.style.cssText = `
      background-color: #ff4c4c;
      color: white;
      padding: 10px 15px;
      margin: 10px 0;
      border-radius: 4px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      position: relative;
      z-index: 9999;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    // Create warning content
    let warningContent = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <strong>⚠️ Potential Scam Email Detected</strong>
          <p style="margin: 5px 0;">
            This email was flagged by Email Scam Protector with a risk score of 
            <strong>${scanResult.score}</strong>.
          </p>
        </div>
        <div>
    `;
    
    // Add unsubscribe button if link is available
    if (unsubscribeLink) {
      warningContent += `
        <button id="scam-unsubscribe-btn" style="
          background-color: white;
          color: #ff4c4c;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-left: 10px;
        ">Unsubscribe</button>
      `;
    }
    
    warningContent += `
        <button id="scam-details-btn" style="
          background-color: white;
          color: #333;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 10px;
        ">Show Details</button>
        </div>
      </div>
      
      <div id="scam-details" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3);">
        <p style="margin: 5px 0;"><strong>Detected issues:</strong></p>
        <ul style="margin: 5px 0; padding-left: 20px;">
          ${scanResult.matches.map(match => `<li>${match}</li>`).join('')}
        </ul>
      </div>
    `;
    
    warningElement.innerHTML = warningContent;
    
    // Insert at the top of the email
    emailContainer.insertAdjacentElement('afterbegin', warningElement);
    
    // Add event listeners for buttons
    setTimeout(() => {
      const detailsBtn = document.getElementById('scam-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
          const detailsEl = document.getElementById('scam-details');
          if (detailsEl) {
            detailsEl.style.display = detailsEl.style.display === 'none' ? 'block' : 'none';
            detailsBtn.textContent = detailsEl.style.display === 'none' ? 'Show Details' : 'Hide Details';
          }
        });
      }
      
      const unsubscribeBtn = document.getElementById('scam-unsubscribe-btn');
      if (unsubscribeBtn) {
        unsubscribeBtn.addEventListener('click', () => {
          chrome.runtime.sendMessage({
            action: 'unsubscribe',
            sender,
            unsubscribeLink
          }, (response) => {
            if (response.success) {
              unsubscribeBtn.textContent = 'Unsubscribed';
              unsubscribeBtn.disabled = true;
              unsubscribeBtn.style.opacity = '0.7';
            } else {
              unsubscribeBtn.textContent = 'Failed';
              setTimeout(() => {
                unsubscribeBtn.textContent = 'Unsubscribe';
              }, 2000);
            }
          });
        });
      }
    }, 0);
  }
  
  // Initialize the extension
  window.addEventListener('load', () => {
    provider = getCurrentProvider();
    if (provider) {
      console.log(`Email Scam Protector initialized for ${provider.name}`);
      
      // Add CSS for our UI elements
      const style = document.createElement('style');
      style.textContent = `
        .scam-protector-badge {
          animation: scamProtectorFadeIn 0.3s ease-in-out;
        }
        
        @keyframes scamProtectorFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .scam-protector-highlight {
          background-color: rgba(255, 76, 76, 0.1);
          border-left: 3px solid #ff4c4c;
          padding-left: 5px;
        }
      `;
      document.head.appendChild(style);
      
      // Set up observer to detect when emails are loaded
      initObserver();
    }
  });