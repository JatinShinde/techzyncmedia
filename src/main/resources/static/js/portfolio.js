/**
 * Techzyncmedia - Portfolio & Case Studies Interactive Module
 */

const projectsData = {
  "paygate": {
    title: "FinTech PayGate — Enterprise Payment Gateway API & Dashboard",
    category: "Enterprise & Spring Boot",
    client: "Global Pay Corp (FinTech)",
    duration: "4 Months",
    tagline: "High-concurrency microservices payment system processing $10M+ daily transactions securely.",
    summary: "Built a robust, low-latency payment processing hub utilizing Java Spring Boot microservices, Kafka event streaming, and JWT OAuth2 authentication with multi-region AWS deployment.",
    challenge: "The client required a resilient payment engine capable of handling 5,000+ API requests per second with sub-100ms latency, 99.99% uptime, and PCI-DSS Level 1 compliance.",
    solution: "Techzyncmedia engineered a microservices-based API gateway using Java 21, Spring Boot 3, and Redis caching for instant session validation. Distributed transaction locks were implemented via Redisson to eliminate race conditions.",
    techStack: ["Java 21", "Spring Boot 3", "Spring Cloud API Gateway", "Kafka", "Redis", "PostgreSQL", "Docker", "AWS ECS"],
    metrics: [
      { label: "Daily Volume", value: "$10M+" },
      { label: "API Latency", value: "< 85ms" },
      { label: "Uptime SLA", value: "99.99%" },
      { label: "Throughput", value: "5k+ req/sec" }
    ],
    features: [
      "Sub-second payment processing with fallback payment routes.",
      "Real-time fraud detection engine using streaming anomaly checks.",
      "Developer-friendly REST APIs with OpenAPI 3.0 documentation & SDKs.",
      "Interactive Merchant Dashboard with transaction analytics & export reports."
    ]
  },
  "novacloud": {
    title: "NovaCloud — Multi-Tenant SaaS Analytics & Asset Management Platform",
    category: "Web Applications",
    client: "Nova Systems Inc.",
    duration: "3 Months",
    tagline: "Scalable B2B SaaS platform enabling real-time infrastructure asset tracking and monitoring.",
    summary: "A modern B2B SaaS web application featuring interactive analytical charts, customizable widgets, dark/light theme support, and role-based access control (RBAC).",
    challenge: "The client struggled with legacy slow page loads, poor mobile responsiveness, and complex user permission management for multi-tenant enterprise teams.",
    solution: "Designed and built a modular responsive SPA interface paired with Spring Boot REST services, optimizing SQL queries and employing web worker data pipelines to achieve dynamic sub-second UI updates.",
    techStack: ["HTML5 / Vanilla JS", "Chart.js", "Java Spring Boot", "MySQL", "Tailwind Design System", "Docker", "Nginx"],
    metrics: [
      { label: "Page Load Speed", value: "0.6s" },
      { label: "Active Tenants", value: "120+" },
      { label: "Data Processed", value: "1.2 TB/mo" },
      { label: "User Satisfaction", value: "98%" }
    ],
    features: [
      "Customizable drag-and-drop dashboard widgets for IT metrics.",
      "Multi-tenant data isolation with granular role-based permissions.",
      "Automated PDF & CSV report generation scheduled via backend cron.",
      "Instant WebSocket alerts for critical system hardware triggers."
    ]
  },
  "healthsync": {
    title: "HealthSync — Telehealth & Remote Patient Consultation Platform",
    category: "Mobile Applications",
    client: "MediConnect Health",
    duration: "5 Months",
    tagline: "Secure telemedicine mobile application connecting patients with specialized doctors in real-time.",
    summary: "Cross-platform mobile application supporting WebRTC video calls, electronic health record (EHR) sync, automated prescription generation, and appointment scheduling.",
    challenge: "Creating a HIPAA-compliant mobile solution with seamless encrypted video calling over weak mobile network connections.",
    solution: "Implemented WebRTC peer-to-peer encryption with custom TURN fallback servers and built a Spring Boot backend API with AES-256 encrypted database storage for medical records.",
    techStack: ["Flutter / Mobile Native", "Java Spring Boot", "WebRTC", "PostgreSQL", "Firebase FCM", "AWS S3 Encrypted"],
    metrics: [
      { label: "Consultations", value: "250k+" },
      { label: "App Rating", value: "4.9 / 5.0" },
      { label: "HIPAA Compliant", value: "100%" },
      { label: "Video Latency", value: "< 120ms" }
    ],
    features: [
      "Encrypted HD video consultations with interactive doctor chat.",
      "Smart doctor appointment booking system with automated reminders.",
      "Digital prescription storage with instant pharmacy dispatch integration.",
      "Biometric login (FaceID / Fingerprint) for enhanced mobile security."
    ]
  },
  "omnicommerce": {
    title: "OmniCommerce — Next-Gen Headless E-Commerce Architecture",
    category: "Web Applications",
    client: "Aura Retail Group",
    duration: "3.5 Months",
    tagline: "Ultra-fast headless e-commerce storefront integrated with Spring Boot order microservices.",
    summary: "Built a high-performance e-commerce platform handling catalog management, multi-currency checkout, inventory sync, and intelligent product recommendations.",
    challenge: "The client's previous monolithic e-commerce store crashed during peak promotional sales events and loaded in over 4.5 seconds.",
    solution: "Refactored the platform into a decoupled headless architecture with static site generation, Spring Boot backend APIs, and Redis caching for product catalog indexing.",
    techStack: ["HTML5 / Modern JS", "Spring Boot", "Stripe API", "Redis", "Elasticsearch", "PostgreSQL", "Cloudflare CDN"],
    metrics: [
      { label: "Speed Boost", value: "4x Faster" },
      { label: "Conversion Rate", value: "+38%" },
      { label: "Peak Load handling", value: "25k Users" },
      { label: "Lighthouse Score", value: "99 / 100" }
    ],
    features: [
      "Sub-second checkout flow integrated with Stripe & PayPal.",
      "Elasticsearch-powered product search with auto-suggestions & filters.",
      "Automated inventory management with real-time stock sync.",
      "SEO-friendly server-rendered catalog pages boosting organic traffic."
    ]
  },
  "datapulse": {
    title: "DataPulse AI — Intelligent Customer Support Automation",
    category: "Cloud & SaaS",
    client: "LogiTech Solutions",
    duration: "2 Months",
    tagline: "AI-driven customer support widget & backend ticket resolution engine.",
    summary: "An intelligent support platform featuring live AI chat assistance, automated ticket routing, sentiment analysis, and Spring Boot lead management system.",
    challenge: "Client support team was overwhelmed with 10,000+ weekly repetitive inquiries, leading to long resolution times and customer churn.",
    solution: "Techzyncmedia developed a custom lightweight embeddable chat widget integrated with NLP sentiment analysis and Spring Boot CRM lead generation pipeline.",
    techStack: ["Vanilla JS Widget", "Java 21", "Spring Boot", "OpenAI / LLM API", "MongoDB", "Docker"],
    metrics: [
      { label: "Ticket Reduction", value: "65%" },
      { label: "Avg Response Time", value: "Instant" },
      { label: "Leads Captured", value: "15k+" },
      { label: "Cost Savings", value: "45%" }
    ],
    features: [
      "Self-learning AI agent resolving tier-1 customer inquiries automatically.",
      "Seamless handoff to human support representatives with context logs.",
      "Real-time sentiment scoring highlighting urgent unhappy customers.",
      "Spring Boot API dashboard for tracking response times & lead conversion."
    ]
  },
  "cyberguard": {
    title: "CyberGuard — Network Monitoring & Threat Intelligence Portal",
    category: "Enterprise & Spring Boot",
    client: "Apex Defense Systems",
    duration: "4 Months",
    tagline: "Real-time network security dashboard for enterprise vulnerability detection.",
    summary: "Enterprise security dashboard providing live network traffic analysis, automated log parsing, threat level alerts, and compliance reporting.",
    challenge: "The client needed a consolidated view of over 50,000 network endpoints with instant anomaly notification capabilities.",
    solution: "Engineered an event-driven system powered by Spring Boot Kafka listeners and dynamic canvas charts rendering high-density log data without lag.",
    techStack: ["Java 21", "Spring Boot", "Apache Kafka", "Elasticsearch", "Canvas JS", "PostgreSQL", "Spring Security"],
    metrics: [
      { label: "Endpoints Monitored", value: "50,000+" },
      { label: "Alert Detection", value: "< 2 sec" },
      { label: "Logs Processed", value: "10M / day" },
      { label: "Compliance Rate", value: "100%" }
    ],
    features: [
      "Live interactive network topology topology visualizer.",
      "Rule-based automated threat mitigation triggers.",
      "Detailed audit logs with immutable digital timestamps.",
      "Exportable security compliance reports (ISO 27001 / SOC 2)."
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Filtering logic
  const filterBtns = document.querySelectorAll(".portfolio-filter-btn");
  const projectCards = document.querySelectorAll(".portfolio-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          setTimeout(() => { card.style.opacity = "1"; card.style.transform = "translateY(0)"; }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => { card.style.display = "none"; }, 300);
        }
      });
    });
  });

  // Modal logic
  const modal = document.getElementById("projectModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  window.openProjectModal = function(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    document.getElementById("modalTitle").innerText = data.title;
    document.getElementById("modalCategory").innerText = data.category;
    document.getElementById("modalClient").innerText = `Client: ${data.client} | Duration: ${data.duration}`;
    document.getElementById("modalTagline").innerText = data.tagline;
    document.getElementById("modalSummary").innerText = data.summary;
    document.getElementById("modalChallenge").innerText = data.challenge;
    document.getElementById("modalSolution").innerText = data.solution;

    // Tech stack badges
    const techContainer = document.getElementById("modalTechStack");
    techContainer.innerHTML = data.techStack.map(t => `<span class="tech-badge">${t}</span>`).join("");

    // Metrics
    const metricsContainer = document.getElementById("modalMetrics");
    metricsContainer.innerHTML = data.metrics.map(m => `
      <div class="modal-metric-card">
        <div class="metric-value">${m.value}</div>
        <div class="metric-label">${m.label}</div>
      </div>
    `).join("");

    // Key Features
    const featuresContainer = document.getElementById("modalFeatures");
    featuresContainer.innerHTML = data.features.map(f => `<li><i class="fas fa-check-circle text-primary"></i> ${f}</li>`).join("");

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});
