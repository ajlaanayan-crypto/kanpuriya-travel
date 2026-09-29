import { auth, isMock } from "./firebase-config.js";
import { dbService } from "./db.js";

// Global Variables
let currentUser = null;
let allDestinations = [];

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize common UI components
  setupAuthListeners();
  setupDrawerListeners();
  setupQuickBookFlow();
  setupFallbackLightDismiss();
  setupHinglishGuide();

  // Load page-specific logic
  const path = window.location.pathname;
  if (path.endsWith("index.html") || path === "/" || path.endsWith("stitch_kanpuriya_travel_witty_adventures/")) {
    await initHomePage();
  } else if (path.endsWith("deals.html")) {
    await initDealsPage();
  } else if (path.endsWith("destinations.html")) {
    await initDestinationsPage();
  } else if (path.endsWith("dashboard.html")) {
    await initDashboardPage();
  }

  // Pre-load destination options for the admin review dropdown
  await loadReviewDestDropdown();
});

// ==========================================
// 1. AUTHENTICATION SERVICE FLOWS
// ==========================================
function setupAuthListeners() {
  const authModal = document.getElementById("auth-modal");
  const authForm = document.getElementById("auth-form");
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  const errorMsg = document.getElementById("auth-error-msg");
  const primaryActionBtn = document.getElementById("auth-primary-action-btn");
  const toggleModeBtn = document.getElementById("auth-toggle-mode-btn");
  const closeAuthModalBtn = document.getElementById("close-auth-modal");
  
  let isLoginMode = true;

  // Listen to Firebase Auth state changes
  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    updateHeaderAuthWidget();

    // Re-initialize dashboard if on that page
    if (window.location.pathname.endsWith("dashboard.html")) {
      await initDashboardPage();
    }
  });

  // Modal Actions
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      if (isLoginMode) {
        document.getElementById("auth-modal-title").textContent = "Swagat Giri (Sign In)";
        primaryActionBtn.textContent = "Dakhila Le (Login)";
        toggleModeBtn.textContent = "Naya Khata Kholen? (Register Account)";
      } else {
        document.getElementById("auth-modal-title").textContent = "Naya Safar Account (Register)";
        primaryActionBtn.textContent = "Khaata Chalu Karo (Sign Up)";
        toggleModeBtn.textContent = "Pehle se account hai? (Sign In)";
      }
      errorMsg.classList.add("hidden");
    });
  }

  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        errorMsg.classList.add("hidden");
        if (isLoginMode) {
          await auth.signInWithEmailAndPassword(email, password);
        } else {
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          // Set initial profile updates if supported
          if (auth.updateProfile) {
            await auth.updateProfile(userCredential.user, {
              displayName: email.split("@")[0]
            });
          }
        }
        authModal.close();
        authForm.reset();
      } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove("hidden");
      }
    });
  }

  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener("click", () => authModal.close());
  }
}

function updateHeaderAuthWidget() {
  const widget = document.getElementById("auth-widget");
  if (!widget) return;

  if (currentUser) {
    widget.innerHTML = `
      <div class="flex items-center gap-3">
        <a href="dashboard.html" class="flex items-center gap-2 group">
          <img class="w-10 h-10 rounded-full object-cover border-2 border-secondary group-hover:scale-105 transition-transform" 
               src="${currentUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiJ6qE2_80SV6OrZe3bdGECl7nv05UDY1orCFQQ4ElHrF12jHNBuMYXCgEZKhKKMDjBh0xGA58ArihpAu4jI3ySy3nCp-3qsY2hMpbBlxpgwCp6hN6RCgyK4lcc528COziqkl6bvJDsxUUx-jWv2U2xeHTvyLjl6EZuceD09hfkvZXISeWY12ueRJ2VZv9jJejrdaVOHDmatuAb61C55Lt72ztdbdrCCIu5SE1NwYBGHgRPwXvgEkGHucAMIaWQQMa-Mby2r40qU5M'}" 
               alt="Avatar">
          <span class="hidden md:inline font-label-md text-primary font-bold group-hover:text-secondary transition-colors">
            ${currentUser.displayName || 'Maharaja'}
          </span>
        </a>
        <button id="auth-logout-btn" class="text-caption font-label-md text-on-surface-variant hover:text-error transition-colors px-2 py-1">
          Nikal (Logout)
        </button>
      </div>
    `;
    
    document.getElementById("auth-logout-btn").addEventListener("click", async () => {
      await auth.signOut();
      window.location.reload();
    });
  } else {
    widget.innerHTML = `
      <button id="auth-signin-btn" class="border border-primary text-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary hover:text-white transition-colors">
        Swagat Giri (Login)
      </button>
    `;
    document.getElementById("auth-signin-btn").addEventListener("click", () => {
      document.getElementById("auth-modal").showModal();
    });
  }
}

// ==========================================
// 2. ADMIN CONTROL PANEL & DRAWER FLOWS
// ==========================================
function setupDrawerListeners() {
  const fab = document.getElementById("admin-panel-fab");
  const drawer = document.getElementById("admin-drawer");
  const overlay = document.getElementById("admin-drawer-overlay");
  const closeBtn = document.getElementById("close-admin-drawer");

  if (!fab || !drawer) return;

  fab.addEventListener("click", () => {
    drawer.classList.add("open");
    overlay.classList.add("open");
  });

  const closeDrawer = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  };

  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Tab switching
  const tabBtns = drawer.querySelectorAll(".tab-btn");
  const tabContents = drawer.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      tabBtns.forEach(b => {
        b.classList.remove("bg-white", "text-primary", "shadow-sm");
        b.classList.add("text-on-surface-variant");
      });
      btn.classList.add("bg-white", "text-primary", "shadow-sm");
      btn.classList.remove("text-on-surface-variant");

      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      });
    });
  });

  // Handle Form Submissions
  setupFormSubmissions(closeDrawer);
}

function setupFormSubmissions(closeDrawer) {
  // 1. Add Itinerary
  const formItinerary = document.getElementById("form-add-itinerary");
  if (formItinerary) {
    formItinerary.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(formItinerary);
      const data = {
        title: formData.get("title"),
        state: formData.get("state"),
        price: Number(formData.get("price")),
        originalPrice: Number(formData.get("originalPrice")),
        duration: formData.get("duration"),
        category: formData.get("category"),
        vibe: formData.get("vibe"),
        feedback: formData.get("feedback"),
        imageUrl: formData.get("imageUrl") || "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Ka9YYcl1cUUSaAo3efFltwAa2UkL7O06SQKYz-oRPfJaNinQCJ3HeKcxFHfomi-_320J0HQ9AV1OZyqnii7xAm15BUyQcwnpmznrDpzGbUiod7yLsOGbTkey9s6NRk7bazGzb-Zx7msla1D4TxnWJCFbgH21iVMvv8y1_wKb7uk3cwhu3ccHRGdHCJs2a82nt3vVZ1UI9QOhFUFH7jwBYC_fkFXG6Xhj6ppApO0pEq1vcJJ2L8XUCC2yM-D4U_lj2jGWxqXb1sh8"
      };

      await dbService.addDestination(data);
      alert("Wah bhai! Naya destination set kar diya. (Destination Added)");
      formItinerary.reset();
      closeDrawer();
      window.location.reload();
    });
  }

  // 2. Add Deal
  const formDeal = document.getElementById("form-add-deal");
  if (formDeal) {
    formDeal.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(formDeal);
      const data = {
        title: formData.get("title"),
        price: Number(formData.get("price")),
        originalPrice: Number(formData.get("originalPrice")),
        category: formData.get("category"),
        badge: formData.get("badge") || "Hot Deal",
        description: formData.get("description"),
        fact: formData.get("fact"),
        imageUrl: formData.get("imageUrl") || "https://lh3.googleusercontent.com/aida-public/AB6AXuD0EmSM6yrFn3FzTbVpTg4WBbGJQgM5ZdiHRiBYCUSm4VP4Z8ARG3sPUoIj6hGeuMaAOPmk7NVipjT2UsmEN1S-HIZKIoz-PwJQWBQe9P5Fw3BYLK0qwNE8bOb3p7qSBTV7W6A5IBL6q_UIVUYlDR3ADnFq0dCgC2y2EAMrdMeoRwTRcQeA8b9lzR-gTr51OEZO8T8EECxG7KbJqR2BEtW0Xsf7lfVUrrh04hCxI882EfXHg0NEbDaxUHElm94gYBt3WgFX0dKbAfK6"
      };

      await dbService.addDeal(data);
      alert("Paisa vasool deal updated successfully!");
      formDeal.reset();
      closeDrawer();
      window.location.reload();
    });
  }

  // 3. Add Story / Testimonial
  const formStory = document.getElementById("form-add-story");
  if (formStory) {
    formStory.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(formStory);
      const data = {
        name: formData.get("name"),
        quote: formData.get("quote"),
        stars: Number(formData.get("stars"))
      };

      await dbService.addTestimonial(data);
      alert("Client story added to marquee successfully!");
      formStory.reset();
      closeDrawer();
      window.location.reload();
    });
  }

  // 4. Add Review
  const formReview = document.getElementById("form-add-review");
  if (formReview) {
    formReview.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(formReview);
      const destId = formData.get("destId");
      const review = {
        name: formData.get("name"),
        rating: Number(formData.get("rating")),
        comment: formData.get("comment"),
        createdAt: new Date().toISOString()
      };

      // Get current dest and update reviews array
      const dests = await dbService.getDestinations();
      const targetDest = dests.find(d => d.id === destId);
      
      if (targetDest) {
        if (!targetDest.reviews) targetDest.reviews = [];
        targetDest.reviews.push(review);
        
        // Update document
        if (isMock) {
          const store = localDB.getStore();
          const idx = store.destinations.findIndex(d => d.id === destId);
          if (idx > -1) store.destinations[idx] = targetDest;
          localDB.saveStore(store);
        } else {
          const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
          await updateDoc(doc(db, "destinations", destId), { reviews: targetDest.reviews });
        }
        alert("Shukriya! Review publish ho gaya. (Review Posted)");
        formReview.reset();
        closeDrawer();
        window.location.reload();
      }
    });
  }
}

async function loadReviewDestDropdown() {
  const dropdown = document.getElementById("review-dest-select");
  if (!dropdown) return;

  const dests = await dbService.getDestinations();
  dropdown.innerHTML = dests.map(d => `<option value="${d.id}">${d.title}</option>`).join("");
}

// ==========================================
// 3. HOME PAGE RENDERS (index.html)
// ==========================================
async function initHomePage() {
  // Load Bento grid destinations
  const bentoGrid = document.getElementById("destinations-bento-grid");
  if (!bentoGrid) return;

  const dests = await dbService.getDestinations();
  
  if (dests.length === 0) {
    bentoGrid.innerHTML = `<div class="col-span-12 text-center py-10 font-body-lg text-on-surface-variant">Koi destination nahi mila. (No destinations found)</div>`;
    return;
  }

  // Varanasi large card, Munnar, Jaipur standard cards
  let bentoHTML = "";
  
  // Large Featured Card (take first one)
  const featured = dests[0];
  bentoHTML += `
    <div onclick="window.location.href='destinations.html'" class="col-span-12 md:col-span-7 group cursor-pointer overflow-hidden rounded-xl relative h-[500px] border border-primary/5">
      <div class="absolute inset-0 transition-transform duration-700 group-hover:scale-110 bg-cover bg-center" style="background-image: url('${featured.imageUrl}')"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-stack-md text-white">
        ${featured.badge ? `<span class="bg-secondary text-on-secondary px-3 py-1 rounded font-label-md text-label-md uppercase mb-2 inline-block">${featured.badge}</span>` : ""}
        <h3 class="font-headline-md text-headline-md mb-1">${featured.title}</h3>
        <p class="font-body-md text-body-md text-surface-variant opacity-90">${featured.vibe}</p>
        <div class="mt-4 flex items-center gap-4">
          <span class="text-secondary-fixed font-bold text-2xl">₹${featured.price.toLocaleString()}/-</span>
          <span class="text-surface-variant line-through opacity-60">₹${featured.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;

  // Secondary Card (second item)
  if (dests[1]) {
    const card2 = dests[1];
    bentoHTML += `
      <div onclick="window.location.href='destinations.html'" class="col-span-12 md:col-span-5 group cursor-pointer overflow-hidden rounded-xl relative h-[500px] border border-primary/5">
        <div class="absolute inset-0 transition-transform duration-700 group-hover:scale-110 bg-cover bg-center" style="background-image: url('${card2.imageUrl}')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-stack-md text-white w-full">
          ${card2.badge ? `<span class="bg-secondary text-on-secondary px-3 py-1 rounded font-label-md text-label-md uppercase mb-2 inline-block">${card2.badge}</span>` : ""}
          <h3 class="font-headline-md text-headline-md mb-1">${card2.title}</h3>
          <p class="font-body-md text-body-md text-surface-variant opacity-90">${card2.vibe}</p>
          <div class="mt-4">
            <span class="text-secondary-fixed font-bold text-xl">₹${card2.price.toLocaleString()}/-</span>
          </div>
        </div>
      </div>
    `;
  }

  // Row 2: Jaipur card (third item) and Custom Jugaad Banner
  if (dests[2]) {
    const card3 = dests[2];
    bentoHTML += `
      <div onclick="window.location.href='destinations.html'" class="col-span-12 md:col-span-4 group cursor-pointer overflow-hidden rounded-xl relative h-[350px] border border-primary/5">
        <div class="absolute inset-0 transition-transform duration-700 group-hover:scale-110 bg-cover bg-center" style="background-image: url('${card3.imageUrl}')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-stack-md text-white">
          <h4 class="font-headline-md text-headline-md">${card3.title}</h4>
          <p class="text-caption text-surface-variant mb-1">(${card3.duration})</p>
          <div class="text-secondary-fixed font-bold">₹${card3.price.toLocaleString()} Only</div>
        </div>
      </div>
    `;
  }

  // Dynamic Custom Itinerary Box
  bentoHTML += `
    <div class="col-span-12 md:col-span-8 bg-primary-container rounded-xl flex items-center justify-between p-stack-md text-on-primary-container relative overflow-hidden">
      <div class="z-10 max-w-md">
        <h4 class="font-headline-md text-headline-md text-white mb-2 italic">The 'Custom Itinerary' Jugaad</h4>
        <p class="font-body-md text-body-md text-primary-fixed mb-4">Don't like our packages? Humse baat karo, hum tumhare liye exclusive plan banayenge. Budget tumhara, plan humara.</p>
        <button onclick="alert('Dada is dialing back to configure your customized trip... Wait for a message!')" class="bg-secondary-fixed text-on-secondary-fixed px-6 py-3 rounded-xl font-label-md text-label-md hover:scale-95 transition-transform">
          Dada se baat karvao
        </button>
      </div>
      <div class="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
        <span class="material-symbols-outlined text-[200px]" style="font-variation-settings: 'FILL' 1;">luggage</span>
      </div>
    </div>
  `;

  bentoGrid.innerHTML = bentoHTML;

  // Load Testimonials
  const marquee = document.getElementById("testimonials-marquee");
  const testimonials = await dbService.getTestimonials();
  
  const buildCards = (list) => {
    return list.map(t => `
      <div class="min-w-[380px] bg-white p-stack-md rounded-xl shadow-sm border border-outline-variant/10 flex-shrink-0">
        <div class="flex text-secondary mb-2">
          ${Array(t.stars).fill(0).map(() => `<span class="material-symbols-outlined fill text-sm">star</span>`).join("")}
        </div>
        <p class="font-body-md text-body-md italic mb-4 whitespace-normal text-on-surface">"${t.quote}"</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full ${t.avatarColor || 'bg-secondary-container'} flex items-center justify-center font-bold text-primary">
            ${t.name.charAt(0)}
          </div>
          <span class="font-label-md text-label-md">${t.name}</span>
        </div>
      </div>
    `).join("");
  };

  // Duplicate list to loop smoothly in CSS marquee
  marquee.innerHTML = buildCards(testimonials) + buildCards(testimonials);

  // Search Button functionality in hero
  const searchBtn = document.getElementById("hero-search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const queryVal = document.getElementById("hero-search-dest").value;
      const budgetVal = document.getElementById("hero-search-budget").value;
      
      // Store queries in session
      sessionStorage.setItem("search_query", queryVal);
      sessionStorage.setItem("search_budget", budgetVal);
      
      window.location.href = "deals.html";
    });
  }
}

// ==========================================
// 4. DEALS PAGE RENDERS (deals.html)
// ==========================================
async function initDealsPage() {
  const dealsGrid = document.getElementById("deals-grid");
  if (!dealsGrid) return;

  const deals = await dbService.getDeals();
  allDestinations = await dbService.getDestinations();

  // Load Search & Budget variables from Session if navigated from home
  const startSearchQuery = sessionStorage.getItem("search_query") || "";
  const startSearchBudget = sessionStorage.getItem("search_budget") || "";

  if (startSearchQuery || startSearchBudget) {
    document.getElementById("deal-search-input").value = startSearchQuery;
    sessionStorage.removeItem("search_query");
    sessionStorage.removeItem("search_budget");
  }

  const renderDeals = (filterCategory = "all", searchQuery = "", budgetLimit = Infinity) => {
    let filtered = deals;

    if (filterCategory !== "all") {
      filtered = filtered.filter(d => d.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (budgetLimit && budgetLimit !== Infinity) {
      filtered = filtered.filter(d => d.price <= budgetLimit);
    }

    if (filtered.length === 0) {
      dealsGrid.innerHTML = `
        <div class="col-span-12 text-center py-20 font-body-lg text-on-surface-variant">
          Paisa kam ho toh adjustments karlo, par deal nahi mili! Dhoondo kuch aur.
        </div>
      `;
      return;
    }

    dealsGrid.innerHTML = filtered.map(d => `
      <div class="group relative bg-white border border-outline-variant/20 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full">
        <div class="h-64 relative overflow-hidden">
          <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="${d.imageUrl}" alt="${d.title}"/>
          <div class="absolute top-4 left-4 flex gap-2">
            ${d.badge ? `<span class="bg-secondary text-on-secondary px-3 py-1 rounded font-label-md">${d.badge}</span>` : ""}
            ${d.tag ? `<span class="bg-primary text-on-primary px-3 py-1 rounded font-label-md">${d.tag}</span>` : ""}
          </div>
        </div>
        <div class="p-stack-md flex flex-col flex-grow justify-between">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-headline-md text-primary">${d.title}</h3>
              <div class="text-right">
                ${d.originalPrice ? `<span class="block text-caption text-outline line-through">₹${d.originalPrice.toLocaleString()}</span>` : ""}
                <span class="text-headline-md text-secondary font-bold">₹${d.price.toLocaleString()}</span>
              </div>
            </div>
            <p class="font-body-md text-on-surface-variant mb-stack-md">${d.description}</p>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-stack-md py-2 border-y border-outline-variant/10">
              <span class="material-symbols-outlined text-secondary text-sm">info</span>
              <span class="text-caption font-caption text-on-secondary-fixed-variant">${d.fact}</span>
            </div>
            <button onclick="window.bookTrip('${d.title}', ${d.price})" class="w-full py-3 bg-primary text-on-primary rounded font-label-md hover:bg-primary-container transition-colors">
              Abhi Book Karo (Book Now)
            </button>
          </div>
        </div>
      </div>
    `).join("");
  };

  // Setup live filters
  const filterBtns = document.querySelectorAll("#deal-filters-container button");
  let currentFilter = "all";
  
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-primary", "text-white");
        b.classList.add("border-outline", "text-on-surface-variant");
      });
      btn.classList.add("bg-primary", "text-white");
      btn.classList.remove("border-outline", "text-on-surface-variant");

      currentFilter = btn.getAttribute("data-filter");
      const searchVal = document.getElementById("deal-search-input").value;
      renderDeals(currentFilter, searchVal);
    });
  });

  const searchInput = document.getElementById("deal-search-input");
  searchInput.addEventListener("input", (e) => {
    renderDeals(currentFilter, e.target.value, startSearchBudget ? Number(startSearchBudget) : Infinity);
  });

  // Render initial
  renderDeals("all", startSearchQuery, startSearchBudget ? Number(startSearchBudget) : Infinity);
}

// ==========================================
// 5. DESTINATIONS PAGE RENDERS (destinations.html)
// ==========================================
async function initDestinationsPage() {
  const destGrid = document.getElementById("destinations-grid");
  if (!destGrid) return;

  const dests = await dbService.getDestinations();

  const renderDestinations = (categoryFilter = "all") => {
    let filtered = dests;
    if (categoryFilter !== "all") {
      filtered = dests.filter(d => d.category === categoryFilter);
    }

    if (filtered.length === 0) {
      destGrid.innerHTML = `<div class="col-span-3 text-center py-10 font-body-lg text-on-surface-variant">Kuch nahi mila, categories change karo!</div>`;
      return;
    }

    destGrid.innerHTML = filtered.map(d => `
      <div class="relative rounded-xl overflow-hidden shadow-sm group border border-outline-variant/20 bg-white">
        <div class="aspect-[4/5] w-full relative overflow-hidden">
          <img class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" src="${d.imageUrl}" alt="${d.title}"/>
          <div class="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent"></div>
          <div class="absolute top-4 right-4 bg-secondary text-on-secondary px-3 py-1 font-label-md text-label-md rounded">₹${d.price.toLocaleString()}/-</div>
          ${d.badge ? `<div class="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-md text-caption uppercase">${d.badge}</div>` : ""}
        </div>
        <div class="absolute bottom-0 left-0 p-6 text-white w-full">
          <h3 class="font-headline-md text-headline-md mb-1">${d.title}</h3>
          <p class="font-caption text-caption opacity-90 mb-3 uppercase tracking-tighter">${d.state} • ${d.duration}</p>
          <div class="flex justify-between items-center">
            <p class="font-body-md text-sm italic pr-4">"${d.feedback}"</p>
            <button onclick="window.viewDestDetail('${d.id}')" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 hover:bg-secondary hover:text-white transition-colors">
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    `).join("");
  };

  // Setup category button clicks
  const catBtns = document.querySelectorAll("#dest-category-filters button");
  catBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      catBtns.forEach(b => {
        b.classList.remove("bg-primary", "text-on-primary");
        b.classList.add("border-outline", "text-on-surface-variant");
      });
      btn.classList.add("bg-primary", "text-on-primary");
      btn.classList.remove("border-outline", "text-on-surface-variant");

      const selectedCat = btn.getAttribute("data-filter");
      renderDestinations(selectedCat);
    });
  });

  renderDestinations("all");
}

// Global functions for card click binds
window.viewDestDetail = async function (destId) {
  const modal = document.getElementById("dest-detail-modal");
  const content = document.getElementById("dest-detail-content");
  
  const dests = await dbService.getDestinations();
  const dest = dests.find(d => d.id === destId);

  if (!dest) return;

  const reviewsHTML = (dest.reviews || []).map(r => `
    <div class="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
      <div class="flex justify-between items-center mb-1">
        <span class="font-label-md text-primary text-sm font-bold">${r.name}</span>
        <span class="text-secondary">${"★".repeat(r.rating)}</span>
      </div>
      <p class="text-body-md text-sm text-on-surface-variant font-normal">"${r.comment}"</p>
    </div>
  `).join("") || `<p class="text-caption text-on-surface-variant italic">Abhi tak koi review nahi mila. Dada add karega!</p>`;

  content.innerHTML = `
    <div class="flex justify-between items-start">
      <div>
        <h2 id="detail-modal-title" class="font-headline-md text-primary font-bold text-2xl">${dest.title}</h2>
        <p class="font-caption text-caption text-secondary uppercase">${dest.state} • ${dest.duration}</p>
      </div>
      <button onclick="document.getElementById('dest-detail-modal').close()" class="p-1 hover:bg-surface-container rounded-full text-on-surface-variant flex items-center">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <img class="w-full h-48 object-cover rounded-lg border border-outline-variant/20 shadow-sm" src="${dest.imageUrl}" alt="${dest.title}"/>

    <div class="space-y-2">
      <h4 class="font-label-md text-primary font-bold">The Luxury Vibe Check</h4>
      <p class="text-body-md text-on-surface-variant leading-relaxed text-sm">${dest.vibe}</p>
    </div>

    <div class="flex justify-between items-center py-2 border-y border-outline-variant/20">
      <div>
        <span class="text-caption text-outline block">Package Cost</span>
        <span class="text-xl font-bold text-primary font-serif-editorial">₹${dest.price.toLocaleString()}</span>
      </div>
      <div class="flex gap-2">
        <button onclick="window.saveToWishlist('${dest.title}')" class="px-4 py-2 border border-secondary text-secondary rounded-lg font-label-md text-sm hover:bg-secondary-container transition-all flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">favorite</span> Wishlist
        </button>
        <button onclick="document.getElementById('dest-detail-modal').close(); window.bookTrip('${dest.title}', ${dest.price});" class="px-6 py-2 bg-primary text-white rounded-lg font-label-md text-sm hover:opacity-90 transition-opacity">
          Chalo Chalte Hain
        </button>
      </div>
    </div>

    <!-- Reviews Grid -->
    <div class="space-y-3 pt-2">
      <h4 class="font-label-md text-primary font-bold">Traveller Kaands & Reviews</h4>
      <div class="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        ${reviewsHTML}
      </div>
    </div>
  `;

  modal.showModal();
};

window.saveToWishlist = async function (destTitle) {
  if (!currentUser) {
    alert("Arre pehle login toh karlo bhabhi! (Login required)");
    document.getElementById("auth-modal").showModal();
    return;
  }

  const uData = await dbService.getUserData(currentUser.uid);
  if (!uData.wishlist) uData.wishlist = [];

  if (uData.wishlist.includes(destTitle)) {
    alert("Yeh sapna pehle se saved hai! (Already in Wishlist)");
    return;
  }

  uData.wishlist.push(destTitle);
  await dbService.updateUserData(currentUser.uid, uData);
  alert(`"${destTitle}" has been added to Saved Sapne!`);
  
  if (window.location.pathname.endsWith("dashboard.html")) {
    window.location.reload();
  }
};

// ==========================================
// 6. DASHBOARD PAGE RENDERS (dashboard.html)
// ==========================================
async function initDashboardPage() {
  const unauthView = document.getElementById("unauth-view");
  const authView = document.getElementById("auth-view");

  if (!unauthView || !authView) return;

  if (!currentUser) {
    unauthView.classList.remove("hidden");
    authView.classList.add("hidden");
    return;
  }

  unauthView.classList.add("hidden");
  authView.classList.remove("hidden");

  // Load User details
  const profile = await dbService.getUserData(currentUser.uid);

  // Update profile DOM
  document.getElementById("user-greeting-label").textContent = `Swagat Hai, ${profile.displayName || currentUser.displayName || 'Maharaja'}`;
  document.getElementById("user-wallet-balance").textContent = `₹${(profile.kharchaPaani || 0).toLocaleString()}`;
  document.getElementById("dashboard-user-name").textContent = profile.displayName || currentUser.displayName || 'Maharaja';
  
  // Stats
  document.getElementById("stat-trips-done").textContent = profile.tripsDone || 0;
  document.getElementById("stat-kms-travelled").textContent = (profile.kmsTravelled || 0).toLocaleString() + "k";

  // Set Profile Avatar
  const avatar = document.getElementById("dashboard-user-avatar");
  avatar.src = currentUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiJ6qE2_80SV6OrZe3bdGECl7nv05UDY1orCFQQ4ElHrF12jHNBuMYXCgEZKhKKMDjBh0xGA58ArihpAu4jI3ySy3nCp-3qsY2hMpbBlxpgwCp6hN6RCgyK4lcc528COziqkl6bvJDsxUUx-jWv2U2xeHTvyLjl6EZuceD09hfkvZXISeWY12ueRJ2VZv9jJejrdaVOHDmatuAb61C55Lt72ztdbdrCCIu5SE1NwYBGHgRPwXvgEkGHucAMIaWQQMa-Mby2r40qU5M';

  // Loyalty wallet claim listener
  const walletBtn = document.getElementById("add-wallet-bonus-btn");
  if (walletBtn) {
    // Remove old listeners to prevent duplication
    const newBtn = walletBtn.cloneNode(true);
    walletBtn.parentNode.replaceChild(newBtn, walletBtn);
    newBtn.addEventListener("click", async () => {
      const profileData = await dbService.getUserData(currentUser.uid);
      profileData.kharchaPaani = (profileData.kharchaPaani || 0) + 1500;
      await dbService.updateUserData(currentUser.uid, profileData);
      alert("Aloo Chat bonus claimed! ₹1,500 credited to Kharcha Paani wallet.");
      window.location.reload();
    });
  }

  // Load Upcoming Trip Card
  const upcomingCard = document.getElementById("dashboard-upcoming-trip-card");
  const upcomingList = profile.upcomingTrips || [];
  
  if (upcomingList.length > 0) {
    const trip = upcomingList[0];
    upcomingCard.innerHTML = `
      <div class="absolute inset-0 z-0">
        <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Ka9YYcl1cUUSaAo3efFltwAa2UkL7O06SQKYz-oRPfJaNinQCJ3HeKcxFHfomi-_320J0HQ9AV1OZyqnii7xAm15BUyQcwnpmznrDpzGbUiod7yLsOGbTkey9s6NRk7bazGzb-Zx7msla1D4TxnWJCFbgH21iVMvv8y1_wKb7uk3cwhu3ccHRGdHCJs2a82nt3vVZ1UI9QOhFUFH7jwBYC_fkFXG6Xhj6ppApO0pEq1vcJJ2L8XUCC2yM-D4U_lj2jGWxqXb1sh8" alt="Retreat"/>
        <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
      </div>
      <div class="absolute top-6 left-6 flex gap-2">
        <span class="bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-md text-caption uppercase">Upcoming</span>
        <span class="bg-surface/20 backdrop-blur-md text-white px-3 py-1 rounded-full font-label-md text-caption uppercase border border-white/20">Active</span>
      </div>
      <div class="absolute bottom-0 left-0 p-8 w-full">
        <h2 class="font-headline-lg text-headline-lg text-white mb-2">${trip.title}</h2>
        <p class="font-body-lg text-white/80 mb-6 max-w-lg">${trip.vibe}</p>
        <div class="flex flex-wrap gap-8 items-center border-t border-white/20 pt-6">
          <div class="flex items-center gap-2 text-white">
            <span class="material-symbols-outlined text-secondary-fixed">calendar_month</span>
            <span class="font-label-md">${trip.date}</span>
          </div>
          <div class="flex items-center gap-2 text-white">
            <span class="material-symbols-outlined text-secondary-fixed">group</span>
            <span class="font-label-md">${trip.people} People</span>
          </div>
          <button onclick="alert('All boarding tickets and guides are saved. Chalo niklo!')" class="ml-auto bg-white text-primary px-8 py-3 rounded-lg font-label-md hover:bg-secondary-fixed transition-colors">
            View Itinerary
          </button>
        </div>
      </div>
    `;
  } else {
    upcomingCard.innerHTML = `
      <div class="p-8 flex flex-col justify-center items-center text-center h-full bg-surface-container-low border-2 border-dashed border-outline-variant/50 rounded-xl">
        <span class="material-symbols-outlined text-[64px] text-outline mb-4">luggage</span>
        <h3 class="font-headline-md text-primary mb-2">Abhi tak koi trip schedule nahi ki?</h3>
        <p class="text-on-surface-variant max-w-md mb-6">Maharaja style offers active. Book dynamically right now and explore the beautiful spots of India.</p>
        <button onclick="window.location.href='deals.html'" class="bg-primary text-white px-6 py-3 rounded-lg font-label-md hover:scale-95 transition-transform">
          Deals Catalog Dekho
        </button>
      </div>
    `;
  }

  // Load Saved Wishlist (Wishlist Grid)
  const wishlistGrid = document.getElementById("wishlist-grid");
  const wishlistTitles = profile.wishlist || [];
  const allDests = await dbService.getDestinations();

  if (wishlistTitles.length > 0) {
    wishlistGrid.innerHTML = wishlistTitles.map((title, i) => {
      // Find matching destination object to display photo
      const matchingDest = allDests.find(d => d.title.toLowerCase().includes(title.toLowerCase()));
      const defaultImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuAxfCCwj-q4c5-yEgpLu6eUka0-yVwJ55sWzreKyHd25rVwERJye2P2YZnS32iaa1FpHfCfiBwF4s8RxaYDUifWJ8KIRuZXpLL_LICEysyANJhmlS1bPa7vM5PSA4O4GL6J2guFSJPwDbgC06AOvi2_VyG6Z0CGqGGSWzwB5E46GahjkCaGmhXhPJos_B6NXkH4D6poy8KTcfY4qgIA9MeHiG15LzTEXNgb0F4CJzpNjuRKEI7YAFEJBlXl7RAyV99TtViCX2XHV8oA";
      const img = matchingDest ? matchingDest.imageUrl : defaultImg;
      const price = matchingDest ? `₹${matchingDest.price.toLocaleString()}` : "Best Deal";

      return `
        <div class="group relative">
          <div class="relative h-64 rounded-xl overflow-hidden mb-4">
            <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="${img}" alt="${title}"/>
            <button onclick="window.removeFromWishlist('${title}')" class="absolute top-4 right-4 bg-white/80 hover:bg-error hover:text-white rounded-full p-2 text-error border border-outline-variant/30 transition-colors" title="Remove">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">delete</span>
            </button>
            <div class="absolute bottom-4 left-4 bg-secondary-fixed text-on-secondary-fixed text-caption px-2 py-1 rounded font-bold">
              ${price}
            </div>
          </div>
          <h4 class="font-headline-md text-primary">${title}</h4>
        </div>
      `;
    }).join("") + `
      <div onclick="window.location.href='destinations.html'" class="h-64 rounded-xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-outline transition-colors hover:border-secondary hover:text-secondary group cursor-pointer">
        <span class="material-symbols-outlined text-[48px] mb-2 group-hover:scale-110 transition-transform">add_location_alt</span>
        <p class="font-label-md">Add New Sapna</p>
      </div>
    `;
  } else {
    wishlistGrid.innerHTML = `
      <div onclick="window.location.href='destinations.html'" class="col-span-4 h-48 rounded-xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-outline transition-colors hover:border-secondary hover:text-secondary group cursor-pointer">
        <span class="material-symbols-outlined text-[48px] mb-2 group-hover:scale-110 transition-transform">add_location_alt</span>
        <p class="font-label-md">Save dynamic spots in your wishlist</p>
      </div>
    `;
  }

  // Load Completed Trips History (History of Kaands)
  const timeline = document.getElementById("completed-trips-timeline");
  const pastTrips = profile.completedTrips || [];

  if (pastTrips.length > 0) {
    timeline.innerHTML = pastTrips.map(trip => `
      <div class="flex items-center gap-6 p-4 bg-white rounded-lg border border-outline-variant/10 hover:shadow-sm transition-shadow">
        <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0">
          <img class="w-full h-full object-cover" src="${trip.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuApAUbaeedQc5YZE2UqOm4mQBcwKhQmO0XW0vxgX_Zlh1ZzNPUngNjugkKsLmeSISL7c0Ha7_wGMrdo17ZHbywCXKsCPf7V7khXbh2woE3D1jWxy9CwbhSzmNOK1xNu3j4n0aG4jjqflP_pOG5DriAQVipZa4DOEK2PKbAVM8GG57a6WOIhyUW7SWLbj43GcwU3TMKUhPYDhtHCrvSPKs_xgvA-ZI_H4mFtjZ_ooXcseO3iVo5M0L02LfNlz9H0R-df4it2fYmXJGPT'}" alt="${trip.title}"/>
        </div>
        <div class="flex-1">
          <h5 class="font-label-md text-primary font-bold text-lg">${trip.title}</h5>
          <p class="text-caption text-on-surface-variant font-medium">${trip.date} • ${trip.people} People • ${trip.detail}</p>
        </div>
        <div class="hidden md:block px-4 py-2 border border-outline-variant/20 rounded font-label-md text-caption uppercase">Completed</div>
        <button onclick="alert('Bills and certificates compiled!')" class="p-2 hover:text-secondary transition-colors" title="Download tickets">
          <span class="material-symbols-outlined">download</span>
        </button>
      </div>
    `).join("");
  } else {
    timeline.innerHTML = `<p class="text-caption text-on-surface-variant italic">Abhi tak koi trip complete nahi ki. Chalo bag pack karo!</p>`;
  }
}

window.removeFromWishlist = async function (destTitle) {
  if (!currentUser) return;
  const uData = await dbService.getUserData(currentUser.uid);
  if (!uData.wishlist) return;

  uData.wishlist = uData.wishlist.filter(t => t !== destTitle);
  await dbService.updateUserData(currentUser.uid, uData);
  alert(`"${destTitle}" removed from Saved Sapne.`);
  window.location.reload();
};

// ==========================================
// 7. BOOKING SYSTEM & QUICK BOOK FLOW
// ==========================================
function setupQuickBookFlow() {
  const quickBookBtns = document.querySelectorAll("#quick-book-btn");
  quickBookBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      window.bookTrip();
    });
  });
}

window.bookTrip = async function (preSelectedTitle = "", preSelectedPrice = 0) {
  if (!currentUser) {
    alert("Arre pehle register toh karlo bhabhi! (Login required)");
    document.getElementById("auth-modal").showModal();
    return;
  }

  const dests = await dbService.getDestinations();
  let optionsHTML = dests.map(d => `<option value="${d.title}" ${d.title === preSelectedTitle ? 'selected' : ''}>${d.title} (₹${d.price.toLocaleString()})</option>`).join("");

  const modal = document.createElement("dialog");
  modal.setAttribute("closedby", "any");
  modal.className = "p-6";
  
  modal.innerHTML = `
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="font-headline-md text-primary font-bold">Chalo Bag Pack Karo!</h3>
        <button id="close-quickbook" class="p-1 hover:bg-surface-container rounded-full text-on-surface-variant flex items-center">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form id="quickbook-form" class="space-y-4">
        <div>
          <label class="block text-caption font-label-md mb-1">Select Destination</label>
          <select id="quickbook-dest" class="form-input-luxury">
            ${optionsHTML}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-caption font-label-md mb-1">Travellers Count</label>
            <input id="quickbook-people" type="number" required min="1" max="10" value="2" class="form-input-luxury">
          </div>
          <div>
            <label class="block text-caption font-label-md mb-1">Depart Date</label>
            <input id="quickbook-date" type="date" required class="form-input-luxury" value="${new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]}">
          </div>
        </div>
        <div class="bg-secondary-container/20 p-4 rounded-lg border border-secondary/10 space-y-2">
          <h4 class="font-label-md text-secondary font-bold text-sm">Desi Jugaad Discounts</h4>
          <p class="text-caption text-on-secondary-container">Booking earns you flat <span class="font-bold">₹1,500</span> Kharcha Paani cashback points!</p>
        </div>

        <button type="submit" class="w-full py-3 bg-primary text-white font-label-md rounded-lg hover:opacity-90 transition-opacity">
          Confirm Maharaja Ticket
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  modal.showModal();

  // Close operations
  const closeBtn = modal.querySelector("#close-quickbook");
  closeBtn.addEventListener("click", () => {
    modal.close();
    modal.remove();
  });

  // Handle outside click close fallback
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    modal.addEventListener('click', (e) => {
      if (e.target !== modal) return;
      const rect = modal.getBoundingClientRect();
      const clickInside = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!clickInside) {
        modal.close();
        modal.remove();
      }
    });
  }

  // Handle Form Submit
  const form = modal.querySelector("#quickbook-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const destName = modal.querySelector("#quickbook-dest").value;
    const people = Number(modal.querySelector("#quickbook-people").value);
    const rawDate = modal.querySelector("#quickbook-date").value;
    
    const formattedDate = new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + " - Live";
    const selectedDest = dests.find(d => d.title === destName);
    
    // Add to completed/upcoming list
    const newTrip = {
      title: destName,
      date: formattedDate,
      people: people,
      vibe: selectedDest ? selectedDest.vibe : "Fully booked, packing details sent via post.",
      status: "upcoming",
      imageUrl: selectedDest ? selectedDest.imageUrl : ""
    };

    await dbService.addTripToHistory(currentUser.uid, newTrip);
    
    alert(`Mubarak ho! Trip booked to "${destName}". Check dashboard for details!`);
    modal.close();
    modal.remove();
    
    window.location.href = "dashboard.html";
  });
};

// ==========================================
// 8. ACCESSIBILITY & FALLBACK SYSTEM
// ==========================================
function setupFallbackLightDismiss() {
  // Apply backdrop light-dismiss fallback for all modals
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const dialogs = document.querySelectorAll('dialog');
    dialogs.forEach(dialog => {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      });
    });
  }
}

function setupHinglishGuide() {
  const guideTrigger = document.getElementById("hinglish-guide-trigger");
  if (!guideTrigger) return;

  guideTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    
    const modal = document.createElement("dialog");
    modal.setAttribute("closedby", "any");
    modal.className = "p-6 !max-w-md";
    
    modal.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b pb-2">
          <h3 class="font-headline-md text-primary font-bold">Hinglish Travel Dictionary</h3>
          <button id="close-guide" class="p-1 hover:bg-surface-container rounded-full text-on-surface-variant flex items-center">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="space-y-3 custom-scrollbar max-h-80 overflow-y-auto pr-1">
          <div class="p-2 border-b">
            <p class="font-bold text-secondary text-sm">1. Jugaad</p>
            <p class="text-xs text-on-surface-variant">An innovative, low-cost fix or solution. In travel: finding VIP experiences on a student budget.</p>
          </div>
          <div class="p-2 border-b">
            <p class="font-bold text-secondary text-sm">2. Kharcha Paani</p>
            <p class="text-xs text-on-surface-variant">Daily allowance or points. Our loyalty cashbacks that make your next hotel practically free.</p>
          </div>
          <div class="p-2 border-b">
            <p class="font-bold text-secondary text-sm">3. Kaand</p>
            <p class="text-xs text-on-surface-variant">An exciting, slightly chaotic adventure or plan. Used affectionately for your past trips.</p>
          </div>
          <div class="p-2 border-b">
            <p class="font-bold text-secondary text-sm">4. Sasti Masti</p>
            <p class="text-xs text-on-surface-variant">High fun, extremely low cost. Ideal for college bunks and weekend getaways.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.showModal();

    modal.querySelector("#close-guide").addEventListener("click", () => {
      modal.close();
      modal.remove();
    });

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      modal.addEventListener('click', (ev) => {
        if (ev.target !== modal) return;
        const rect = modal.getBoundingClientRect();
        if (ev.clientY < rect.top || ev.clientY > rect.bottom || ev.clientX < rect.left || ev.clientX > rect.right) {
          modal.close();
          modal.remove();
        }
      });
    }
  });
}
