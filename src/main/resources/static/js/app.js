// Techzyncmedia Main Web Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initAuditForm();
  initQuickHeroForm();
  initContactForm();
  initCalculator();
  initFaqAccordion();
  initHeroSlider();
  checkSavedPackage();
  checkSelectedRequirements();
});

// Interactive Profcyma Multi-Slide Engine
function initHeroSlider() {
  const slideItems = document.querySelectorAll('.hero-slide-item');
  const slideImage = document.getElementById('heroSlideImage');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const dotsContainer = document.getElementById('heroDots');
  const counterElem = document.getElementById('heroSlideCounter');
  const heroSection = document.getElementById('heroSection');

  if (!slideItems.length) return;

  let currentIndex = 0;
  let autoTimer = null;

  // Build dots dynamically if container exists
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slideItems.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => showSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function showSlide(index) {
    if (index < 0) index = slideItems.length - 1;
    if (index >= slideItems.length) index = 0;
    currentIndex = index;

    // Toggle active slide & explicit display properties
    slideItems.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('active');
        item.style.display = 'block';
      } else {
        item.classList.remove('active');
        item.style.display = 'none';
      }
    });

    // Update image
    const activeSlide = slideItems[currentIndex];
    const imgSrc = activeSlide ? activeSlide.dataset.img : null;
    if (slideImage && imgSrc) {
      slideImage.style.opacity = '0';
      setTimeout(() => {
        slideImage.src = imgSrc;
        slideImage.style.opacity = '1';
      }, 180);
    }

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.hero-dot');
      dots.forEach((dot, i) => {
        if (i === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    // Update Step Counter (e.g. 01 / 05)
    if (counterElem) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(slideItems.length).padStart(2, '0');
      counterElem.textContent = `${currentFormatted} / ${totalFormatted}`;
    }
  }

  // Global helper for inline fallback
  window.switchHeroSlide = (dir) => {
    showSlide(currentIndex + dir);
  };

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

  // Auto-play timer (5 seconds)
  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5000);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  startAutoPlay();

  // Pause on hover
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        showSlide(currentIndex + 1); // Swipe left -> Next
      } else if (touchEndX - touchStartX > 40) {
        showSlide(currentIndex - 1); // Swipe right -> Prev
      }
    }, { passive: true });
  }

  showSlide(0);
}

// Quick Hero Proposal Form
function initQuickHeroForm() {
  const form = document.getElementById('heroQuickForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('heroName')?.value.trim();
    const phone = document.getElementById('heroPhone')?.value.trim();
    const serviceNeeded = document.getElementById('heroService')?.value || 'General Inquiry';

    if (!fullName || !phone) return;

    const payload = {
      fullName,
      email: `${fullName.toLowerCase().replace(/\s+/g, '')}@lead.techzync`,
      phone,
      serviceNeeded,
      notes: 'Submitted via Quick Hero Proposal Form'
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const response = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Thank you! Our engineering team will call/WhatsApp you shortly with a proposal.');
        form.reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });
}

// FAQ Accordion Handler
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.profcyma-faq-item, .faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.profcyma-faq-question, .faq-question');
    const answer = item.querySelector('.profcyma-faq-answer, .faq-answer');
    if (!question || !answer) return;

    // Ensure answer is hidden initially unless item has 'active' class
    if (!item.classList.contains('active')) {
      answer.style.display = 'none';
    } else {
      answer.style.display = 'block';
    }

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.profcyma-faq-answer, .faq-answer');
        if (ans) ans.style.display = 'none';
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        answer.style.display = 'block';
      }
    });
  });
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Free Website Audit Form Hookup
function initAuditForm() {
  const auditForm = document.getElementById('auditForm');
  if (!auditForm) return;

  const toast = document.getElementById('auditToast');
  const submitBtn = auditForm.querySelector('button[type="submit"]');

  auditForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('auditFullName')?.value.trim();
    const email = document.getElementById('auditEmail')?.value.trim();
    const websiteUrl = document.getElementById('auditWebsite')?.value.trim();
    const serviceNeeded = document.getElementById('auditService')?.value || 'Website Audit';
    const budgetRange = document.getElementById('auditBudget')?.value || '';
    const phone = document.getElementById('auditPhone')?.value.trim() || '';
    const notes = document.getElementById('auditNotes')?.value.trim() || '';

    if (!fullName || !email) {
      showToast(toast, 'Please fill in required fields (Full Name and Email).', 'error');
      return;
    }

    const payload = {
      fullName,
      email,
      websiteUrl,
      serviceNeeded,
      budgetRange,
      phone,
      notes
    };

    try {
      setButtonLoading(submitBtn, true, 'Submitting Audit Request...');

      const response = await fetch('/api/public/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(toast, data.message || 'Audit request submitted successfully!', 'success');
        auditForm.reset();
      } else {
        showToast(toast, data.message || 'Failed to submit request. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      showToast(toast, 'Network error. Please check your connection and try again.', 'error');
    } finally {
      setButtonLoading(submitBtn, false, 'Claim Free Website Audit');
    }
  });
}

// General Contact Form Hookup
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const toast = document.getElementById('contactToast');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim() || '';
    const company = document.getElementById('contactCompany')?.value.trim() || '';
    const subject = document.getElementById('contactSubject')?.value.trim() || 'General Inquiry';
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast(toast, 'Please fill in Name, Email, and Message fields.', 'error');
      return;
    }

    const payload = { name, email, phone, company, subject, message };

    try {
      setButtonLoading(submitBtn, true, 'Sending Message...');

      const response = await fetch('/api/public/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast(toast, data.message || 'Your message has been sent successfully!', 'success');
        contactForm.reset();
        localStorage.removeItem('techzync_selected_requirements');
        const previewBox = document.getElementById('selectedRequirementsPreview');
        if (previewBox) previewBox.remove();
      } else {
        showToast(toast, data.message || 'Failed to send message.', 'error');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      showToast(toast, 'Network error. Please try again.', 'error');
    } finally {
      setButtonLoading(submitBtn, false, 'Send Message');
    }
  });
}

// Interactive Project Package Requirement & Timeline Estimator
function initCalculator() {
  const calcContainer = document.getElementById('packageCalculator');
  if (!calcContainer) return;

  const checkboxes = calcContainer.querySelectorAll('.calc-checkbox');
  const totalPriceElem = document.getElementById('calcTotalPrice');
  const totalDaysElem = document.getElementById('calcTotalDays');

  function updateCalculator() {
    let days = 0;
    let selectedServices = [];

    checkboxes.forEach(cb => {
      const parentCard = cb.closest('.calc-item');
      const name = cb.dataset.name || '';

      if (cb.checked) {
        days += parseInt(cb.dataset.days || '0', 10);
        selectedServices.push(name);
        if (parentCard) parentCard.classList.add('selected');
      } else {
        if (parentCard) parentCard.classList.remove('selected');
      }
    });

    if (totalPriceElem) {
      totalPriceElem.textContent = 'Custom Proposal';
    }

    if (totalDaysElem) totalDaysElem.textContent = days > 0 ? `${days} Days` : 'Instant';

    window.selectedPackageServices = selectedServices;
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateCalculator);
    const parentCard = cb.closest('.calc-item');
    if (parentCard) {
      parentCard.addEventListener('click', (e) => {
        if (e.target !== cb) {
          cb.checked = !cb.checked;
          updateCalculator();
        }
      });
    }
  });

  // Wire up Request Custom Price Quote button
  const quoteBtn = document.getElementById('requestQuoteBtn');
  if (quoteBtn) {
    quoteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = [];
      checkboxes.forEach(cb => {
        if (cb.checked) {
          const parentCard = cb.closest('.calc-item');
          const titleElem = parentCard ? parentCard.querySelector('.calc-item-title') : null;
          const name = titleElem ? titleElem.textContent.trim() : (cb.dataset.name || 'Service Requirement');
          selected.push(name);
        }
      });

      if (selected.length === 0) {
        alert('Please select at least one requirement before requesting a custom price quote.');
        return;
      }

      localStorage.setItem('techzync_selected_requirements', JSON.stringify(selected));
      window.location.href = '/contact.html';
    });
  }

  updateCalculator();
}

function checkSelectedRequirements() {
  const savedReqs = localStorage.getItem('techzync_selected_requirements');
  if (!savedReqs) return;

  let selected = [];
  try {
    selected = JSON.parse(savedReqs);
  } catch (e) {
    return;
  }

  if (!Array.isArray(selected) || selected.length === 0) return;

  const contactSubject = document.getElementById('contactSubject');
  const contactMessage = document.getElementById('contactMessage');
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    let previewBox = document.getElementById('selectedRequirementsPreview');
    if (!previewBox) {
      previewBox = document.createElement('div');
      previewBox.id = 'selectedRequirementsPreview';
      previewBox.style.cssText = 'background:#f0f9ff; border:1px solid #bae6fd; border-radius:10px; padding:18px; margin-bottom:24px; color:#0369a1; box-shadow:0 4px 12px rgba(186,230,253,0.3);';
      
      const formHeader = contactForm.querySelector('h3');
      if (formHeader) {
        formHeader.insertAdjacentElement('afterend', previewBox);
      } else {
        contactForm.insertBefore(previewBox, contactForm.firstChild);
      }
    }

    const chips = selected.map(s => `<span style="display:inline-flex; align-items:center; gap:6px; background:#e0f2fe; color:#0369a1; padding:6px 12px; border-radius:20px; font-weight:600; font-size:0.85rem; border:1px solid #7dd3fc; margin:3px 4px 3px 0;">✓ ${escapeHtml(s)}</span>`).join('');
    
    previewBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #bae6fd; padding-bottom:8px;">
        <strong style="color:#0284c7; font-size:0.98rem; display:flex; align-items:center; gap:6px;">📋 Selected Project Requirements (${selected.length}):</strong>
        <button type="button" id="clearSelectedReqsBtn" style="background:none; border:none; color:#ef4444; font-size:0.82rem; font-weight:600; cursor:pointer; text-decoration:underline;">Clear Selection</button>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">${chips}</div>
    `;

    document.getElementById('clearSelectedReqsBtn')?.addEventListener('click', () => {
      localStorage.removeItem('techzync_selected_requirements');
      previewBox.remove();
      if (contactSubject && contactSubject.value.startsWith('Custom Quote Request')) contactSubject.value = '';
      if (contactMessage && contactMessage.value.includes('selected project requirements:')) contactMessage.value = '';
    });
  }

  // Auto pre-fill Subject & Message if empty or default
  if (contactSubject && (!contactSubject.value || contactSubject.value === 'Project Inquiry / Service Package')) {
    contactSubject.value = `Custom Quote Request (${selected.length} Requirements Selected)`;
  }

  if (contactMessage && !contactMessage.value) {
    const formattedServices = selected.map(s => `• ${s}`).join('\n');
    contactMessage.value = `Hello Techzyncmedia Team,\n\nI would like to request a custom price quote for my selected project requirements:\n${formattedServices}\n\nPlease review these requirements and provide a custom proposal and price quote.`;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function bookPackage() {
  const services = window.selectedPackageServices || ['Custom Web Development', 'Technical SEO'];
  const total = window.selectedPackageTotal || 2100;

  const pkgData = { services, total };
  localStorage.setItem('techzync_selected_package', JSON.stringify(pkgData));

  const auditSection = document.getElementById('audit-section');
  if (auditSection) {
    checkSavedPackage();
  } else {
    window.location.href = '/index.html#audit-section';
  }
}

function checkSavedPackage() {
  const savedData = localStorage.getItem('techzync_selected_package');
  if (!savedData) return;

  try {
    const pkg = JSON.parse(savedData);
    const services = pkg.services || [];
    const total = pkg.total || 0;

    const auditNotes = document.getElementById('auditNotes');
    const auditServiceSelect = document.getElementById('auditService');
    const auditBudgetSelect = document.getElementById('auditBudget');
    const toast = document.getElementById('auditToast');

    if (auditServiceSelect) {
      auditServiceSelect.value = 'Custom Package Selected';
    }

    if (auditBudgetSelect) {
      if (total >= 7000) auditBudgetSelect.value = '$7,000+';
      else if (total >= 3000) auditBudgetSelect.value = '$3,000 - $7,000';
      else auditBudgetSelect.value = '$1,000 - $3,000';
    }

    if (auditNotes && services.length > 0) {
      auditNotes.value = `Selected Package: ${services.join(', ')} (Est. Total: $${total.toLocaleString()})`;
    }

    if (toast) {
      showToast(toast, `Custom package selected ($${total.toLocaleString()})! Primary Goal & Budget Range auto-updated below.`, 'success');
    }

    const auditSection = document.getElementById('audit-section');
    if (auditSection) {
      setTimeout(() => {
        auditSection.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  } catch (e) {
    console.error('Error applying saved package:', e);
  } finally {
    localStorage.removeItem('techzync_selected_package');
  }
}

// Utility Functions
function showToast(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.className = `toast-msg ${type}`;
  element.style.display = 'block';
  setTimeout(() => {
    element.style.display = 'none';
  }, 6000);
}

function setButtonLoading(button, isLoading, text) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span> ${text}`;
  } else {
    button.disabled = false;
    button.innerHTML = text;
  }
}

// Mobile Hamburger Navigation Drawer Handler
function initMobileMenu() {
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelector('.nav-links');
  if (!navContainer || !navLinks) return;

  let toggleBtn = document.getElementById('mobileMenuBtn');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'mobileMenuBtn';
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
    toggleBtn.innerHTML = '<span></span><span></span><span></span>';

    const navActions = navContainer.querySelector('.nav-actions');
    if (navActions) {
      navContainer.insertBefore(toggleBtn, navActions);
    } else {
      navContainer.appendChild(toggleBtn);
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBtn.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');
  });

  document.addEventListener('click', (e) => {
    if (!navContainer.contains(e.target)) {
      toggleBtn.classList.remove('active');
      navLinks.classList.remove('mobile-active');
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navLinks.classList.remove('mobile-active');
    });
  });
}
