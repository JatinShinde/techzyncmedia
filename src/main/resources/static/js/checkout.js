/**
 * Techzyncmedia Razorpay Checkout Helper
 * Uses Razorpay Test Key: rzp_test_TUUjDqJU6AN1xi
 */

const RAZORPAY_TEST_KEY = "rzp_test_TUUjDqJU6AN1xi";

const PACKAGES = {
  starter: {
    id: "starter",
    name: "Starter Package",
    price: 9999,
    gst: 1799.82,
    total: 11798.82,
    description: "Essential Web App & Security Audit"
  },
  business: {
    id: "business",
    name: "Business Package",
    price: 24999,
    gst: 4499.82,
    total: 29498.82,
    description: "Custom Web & Java Spring Boot API Suite"
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Package",
    price: 49999,
    gst: 8999.82,
    total: 58998.82,
    description: "Full Platform Engineering & Retainer Support"
  }
};

function launchRazorpayCheckout(packageKey, customerInfo = {}) {
  const pkg = PACKAGES[packageKey] || PACKAGES.business;
  
  if (typeof Razorpay === "undefined") {
    alert("Razorpay SDK is loading. Please check your internet connection.");
    return;
  }

  const options = {
    key: RAZORPAY_TEST_KEY,
    amount: Math.round(pkg.total * 100), // amount in paise
    currency: "INR",
    name: "Techzyncmedia",
    description: pkg.name + " - " + pkg.description,
    image: "/images/logo.png",
    handler: function (response) {
      // Record purchase in localStorage for client portal
      const newPurchase = {
        orderId: "TZ-" + Math.floor(100000 + Math.random() * 900000),
        packageName: pkg.name,
        transactionId: response.razorpay_payment_id || ("pay_test_" + Math.random().toString(36).substring(2, 10)),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: "₹" + pkg.total.toLocaleString('en-IN'),
        status: "SUCCESS",
        clientName: customerInfo.name || "Valued Client",
        clientEmail: customerInfo.email || localStorage.getItem("techzync_client_email") || "client@techzyncmedia.com"
      };

      let existingPurchases = JSON.parse(localStorage.getItem("techzync_purchases") || "[]");
      existingPurchases.unshift(newPurchase);
      localStorage.setItem("techzync_purchases", JSON.stringify(existingPurchases));
      
      // Auto set logged in user session
      localStorage.setItem("techzync_client_logged_in", "true");
      localStorage.setItem("techzync_client_email", newPurchase.clientEmail);
      localStorage.setItem("techzync_client_name", newPurchase.clientName);

      // Redirect to dashboard with success banner
      window.location.href = "/dashboard.html?payment=success&tx=" + newPurchase.transactionId;
    },
    prefill: {
      name: customerInfo.name || "",
      email: customerInfo.email || localStorage.getItem("techzync_client_email") || "",
      contact: customerInfo.phone || ""
    },
    notes: {
      package_id: pkg.id,
      company: customerInfo.company || "Techzyncmedia Client"
    },
    theme: {
      color: "#2563eb"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
