/**
 * Techzyncmedia Custom Interactive Chatbot System
 * Self-contained JS module connected to Spring Boot API (/api/public/leads)
 */

(function () {
  'use strict';

  // Inject chatbot CSS dynamically if not present
  if (!document.getElementById('tz-chatbot-css')) {
    const cssLink = document.createElement('link');
    cssLink.id = 'tz-chatbot-css';
    cssLink.rel = 'stylesheet';
    cssLink.href = '/css/chatbot.css';
    document.head.appendChild(cssLink);
  }

  // Predefined Services & Descriptions
  const SERVICES = {
    'web': {
      label: '🌐 Website Development',
      serviceName: 'Website Development',
      desc: 'We build high-performance Spring Boot & React web applications, custom corporate portals, and e-commerce platforms tailored to your business.'
    },
    'mobile': {
      label: '📱 Mobile App Development',
      serviceName: 'Mobile App Development',
      desc: 'Native iOS & Android mobile app development with modern UI, offline support, and scalable API backend integrations.'
    },
    'games': {
      label: '🎮 Games Development',
      serviceName: 'Games Development',
      desc: 'Engaging 2D/3D cross-platform game development, gamified business apps, and interactive interactive experiences.'
    },
    'software': {
      label: '⚙️ ERP & Software Solutions',
      serviceName: 'ERP & Custom Software',
      desc: 'Central management solutions, billing systems, sales & attendance management, and custom enterprise software.'
    },
    'marketing': {
      label: '📈 Digital Marketing & SEO',
      serviceName: 'Digital Marketing & SEO',
      desc: 'Data-driven SEO campaigns, lead generation strategies, social media management, and brand awareness programs.'
    },
    'design': {
      label: '🎨 UI/UX & Graphics Design',
      serviceName: 'UI/UX & Graphics Design',
      desc: 'Custom UI/UX design prototypes, brand identities, logos, banner graphics, and user experience engineering.'
    }
  };

  // State Management
  let chatHistory = JSON.parse(sessionStorage.getItem('tz_chat_history') || '[]');
  let leadState = JSON.parse(sessionStorage.getItem('tz_lead_state') || JSON.stringify({
    step: 'IDLE', // IDLE, AWAITING_NAME, AWAITING_CONTACT, AWAITING_NOTES
    leadData: {
      fullName: '',
      email: '',
      phone: '',
      serviceNeeded: '',
      notes: ''
    }
  }));

  // Build Chatbot HTML Markup
  function initWidget() {
    if (document.getElementById('tzChatWindow')) return;

    const widgetWrapper = document.createElement('div');
    widgetWrapper.id = 'tzChatWidgetContainer';
    widgetWrapper.innerHTML = `
      <!-- Trigger Button -->
      <button class="tz-chat-trigger" id="tzChatTrigger" aria-label="Open Chat Support">
        <span class="tz-unread-badge" id="tzUnreadBadge"></span>
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>

      <!-- Chat Window -->
      <div class="tz-chat-window" id="tzChatWindow">
        <!-- Header -->
        <div class="tz-chat-header">
          <div class="tz-chat-header-info">
            <div class="tz-bot-avatar">TZ</div>
            <div>
              <h4 class="tz-chat-title">Techzync Assistant</h4>
              <div class="tz-chat-status">
                <span class="tz-status-dot"></span> Online | Instant Response
              </div>
            </div>
          </div>
          <button class="tz-chat-close-btn" id="tzChatClose" aria-label="Close Chat">&times;</button>
        </div>

        <!-- Body / Message Feed -->
        <div class="tz-chat-body" id="tzChatBody"></div>

        <!-- Footer / Input Form -->
        <div class="tz-chat-footer">
          <form class="tz-input-form" id="tzInputForm">
            <input type="text" class="tz-chat-input" id="tzChatInput" placeholder="Type your message..." autocomplete="off">
            <button type="submit" class="tz-send-btn" aria-label="Send Message">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>
          <div class="tz-powered-by">Powered by <span>Techzyncmedia AI</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(widgetWrapper);

    // Event Listeners
    const triggerBtn = document.getElementById('tzChatTrigger');
    const closeBtn = document.getElementById('tzChatClose');
    const chatWindow = document.getElementById('tzChatWindow');
    const inputForm = document.getElementById('tzInputForm');

    triggerBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    inputForm.addEventListener('submit', handleUserSubmit);

    // Render initial chat or history
    if (chatHistory.length === 0) {
      sendBotGreeting();
    } else {
      renderChatHistory();
    }
  }

  function toggleChat() {
    const chatWindow = document.getElementById('tzChatWindow');
    const unreadBadge = document.getElementById('tzUnreadBadge');
    const isActive = chatWindow.classList.toggle('tz-active');
    
    if (isActive && unreadBadge) {
      unreadBadge.style.display = 'none';
      scrollToBottom();
    }
  }

  function sendBotGreeting() {
    const greetingMsg = "👋 Hello! Welcome to **Techzyncmedia** IT Solutions & Software Engineering. How can we help scale your business today?";
    const optionsHtml = `
      <div class="tz-options-container">
        ${Object.keys(SERVICES).map(key => `
          <button class="tz-option-pill" data-service-key="${key}">
            ${SERVICES[key].label}
          </button>
        `).join('')}
        <button class="tz-option-pill" data-action="quote">💼 Request a Custom Quote</button>
      </div>
    `;

    addBotMessage(greetingMsg, optionsHtml);
  }

  function addBotMessage(text, optionsHtml = '') {
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      const messageObj = { sender: 'bot', text, optionsHtml, time: getCurrentTime() };
      chatHistory.push(messageObj);
      saveState();
      appendMessageToDOM(messageObj);
    }, 400);
  }

  ariaUserMessage;
  function addUserMessage(text) {
    const messageObj = { sender: 'user', text, time: getCurrentTime() };
    chatHistory.push(messageObj);
    saveState();
    appendMessageToDOM(messageObj);
  }

  function appendMessageToDOM(msgObj) {
    const chatBody = document.getElementById('tzChatBody');
    if (!chatBody) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `tz-message tz-${msgObj.sender}`;
    
    let formattedText = msgObj.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    msgDiv.innerHTML = `
      <div class="tz-msg-bubble">
        ${formattedText}
        ${msgObj.optionsHtml || ''}
      </div>
      <div class="tz-msg-time">${msgObj.time}</div>
    `;

    // Attach click handlers to option pills
    const pills = msgDiv.querySelectorAll('.tz-option-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const serviceKey = e.currentTarget.getAttribute('data-service-key');
        const action = e.currentTarget.getAttribute('data-action');

        if (serviceKey && SERVICES[serviceKey]) {
          handleServiceSelect(serviceKey);
        } else if (action === 'quote') {
          startLeadCapture('Custom Software & IT Inquiry');
        }
      });
    });

    chatBody.appendChild(msgDiv);
    scrollToBottom();
  }

  function handleServiceSelect(key) {
    const service = SERVICES[key];
    addUserMessage(service.label);
    
    leadState.leadData.serviceNeeded = service.serviceName;
    saveState();

    const responseText = `${service.desc}\n\nWould you like a free consultation or custom quote for **${service.serviceName}**?`;
    const optionsHtml = `
      <div class="tz-options-container">
        <button class="tz-option-pill" data-action="start_lead">🚀 Yes, Get a Free Quote</button>
        <button class="tz-option-pill" data-action="reset">❓ Ask Something Else</button>
      </div>
    `;

    setTimeout(() => {
      addBotMessage(responseText, optionsHtml);
    }, 300);
  }

  function startLeadCapture(serviceName) {
    leadState.leadData.serviceNeeded = serviceName || 'General IT Inquiry';
    leadState.step = 'AWAITING_NAME';
    saveState();

    addBotMessage(`Awesome! To get started on your **${leadState.leadData.serviceNeeded}** proposal, please enter your **Full Name**:`);
  }

  function handleUserSubmit(e) {
    e.preventDefault();
    const inputElem = document.getElementById('tzChatInput');
    const text = inputElem.value.trim();
    if (!text) return;

    inputElem.value = '';
    addUserMessage(text);

    // Process state machine
    if (leadState.step === 'AWAITING_NAME') {
      leadState.leadData.fullName = text;
      leadState.step = 'AWAITING_CONTACT';
      saveState();

      setTimeout(() => {
        addBotMessage(`Nice to meet you, **${text}**! Please enter your **Email Address** (or phone number) so our agency team can send you the quote details:`);
      }, 400);
    } 
    else if (leadState.step === 'AWAITING_CONTACT') {
      if (text.includes('@')) {
        leadState.leadData.email = text;
      } else {
        leadState.leadData.phone = text;
        leadState.leadData.email = `lead_${Date.now()}@techzyncmedia.com`; // Fallback format for backend validation
      }
      leadState.step = 'AWAITING_NOTES';
      saveState();

      setTimeout(() => {
        addBotMessage(`Got it! Briefly describe your project or key requirements (or type **"skip"**):`);
      }, 400);
    }
    else if (leadState.step === 'AWAITING_NOTES') {
      if (text.toLowerCase() !== 'skip') {
        leadState.leadData.notes = text;
      }
      leadState.step = 'COMPLETED';
      saveState();

      submitLeadToBackend();
    }
    else {
      // General question / conversation fallback
      setTimeout(() => {
        if (text.toLowerCase().includes('quote') || text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
          startLeadCapture('Custom Requirement');
        } else {
          addBotMessage(`Thank you for your message! Our team offers full-stack development, mobile apps, and IT solutions.\n\nWould you like us to contact you with custom package details?`, `
            <div class="tz-options-container">
              <button class="tz-option-pill" data-action="quote">📞 Yes, Contact Me</button>
              <button class="tz-option-pill" data-action="reset">🔄 Show Main Menu</button>
            </div>
          `);
        }
      }, 500);
    }
  }

  function submitLeadToBackend() {
    showTypingIndicator();
    
    const payload = {
      fullName: leadState.leadData.fullName || 'Valued Visitor',
      email: leadState.leadData.email || `contact_${Date.now()}@techzyncmedia.com`,
      phone: leadState.leadData.phone || '',
      serviceNeeded: leadState.leadData.serviceNeeded || 'General IT Solution',
      budgetRange: 'Standard',
      notes: leadState.leadData.notes || 'Inquired via Website Live Chatbot'
    };

    fetch('/api/public/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      removeTypingIndicator();
      const successText = `🎉 Thank you, **${payload.fullName}**! Your inquiry for **${payload.serviceNeeded}** has been registered successfully.\n\nOur Techzync engineering team will contact you at **${payload.email || payload.phone}** within 24 hours.`;
      
      const optionsHtml = `
        <div class="tz-options-container">
          <button class="tz-option-pill" data-action="reset">🔄 Main Menu</button>
        </div>
      `;

      addBotMessage(successText, optionsHtml);

      // Reset lead state for next interaction
      leadState.step = 'IDLE';
      leadState.leadData = { fullName: '', email: '', phone: '', serviceNeeded: '', notes: '' };
      saveState();
    })
    .catch(err => {
      removeTypingIndicator();
      console.error('Lead submission error:', err);
      addBotMessage(`Thank you **${payload.fullName}**! Your request has been recorded. Our team will get in touch with you shortly.`);
      leadState.step = 'IDLE';
      saveState();
    });
  }

  // Action Button Delegate Handler
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('tz-option-pill')) {
      const action = e.target.getAttribute('data-action');
      if (action === 'start_lead') {
        startLeadCapture(leadState.leadData.serviceNeeded || 'General IT Solutions');
      } else if (action === 'reset') {
        leadState.step = 'IDLE';
        saveState();
        sendBotGreeting();
      }
    }
  });

  function showTypingIndicator() {
    removeTypingIndicator();
    const chatBody = document.getElementById('tzChatBody');
    if (!chatBody) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'tzTypingIndicator';
    typingDiv.className = 'tz-message tz-bot';
    typingDiv.innerHTML = `
      <div class="tz-typing">
        <div class="tz-typing-dot"></div>
        <div class="tz-typing-dot"></div>
        <div class="tz-typing-dot"></div>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('tzTypingIndicator');
    if (indicator) indicator.remove();
  }

  function renderChatHistory() {
    const chatBody = document.getElementById('tzChatBody');
    if (!chatBody) return;
    chatBody.innerHTML = '';
    chatHistory.forEach(msg => appendMessageToDOM(msg));
  }

  function scrollToBottom() {
    const chatBody = document.getElementById('tzChatBody');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  function saveState() {
    sessionStorage.setItem('tz_chat_history', JSON.stringify(chatHistory));
    sessionStorage.setItem('tz_lead_state', JSON.stringify(leadState));
  }

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
