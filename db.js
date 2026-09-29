import { db, isMock, localDB } from "./firebase-config.js";

// Default Seed Data
const defaultDeals = [
  {
    id: "deal_kerala",
    title: "Kerala Backwaters",
    price: 24999,
    originalPrice: 85000,
    badge: "Sasti Masti",
    tag: "Hot Deal",
    description: "Luxury houseboat, coconut water, aur public ke saamne chaud. 5 nights of sheer peace.",
    fact: "Kanpuriya Fact: Itne mein toh sirf ek sherwani aati hai.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXO8Cg4VKG6ZXDE0dLK_YvKZU1xnA_PKWVPALy_BhJoSNqkGTR8VNHw9qH3oru4Gyu02rsUOfCddrlQb5gEnx0GVKrNejbLH9JYgiRxmc6frl5iduY7vnuJYeS3zxtoEyOK-c2Huj9VQFtI_dg2ZA0uh1O4DHQ9eUb8tUYh_BwH3swULv73OFwTewSIkUVK4FdZcE_6vDlSu6rhlZZD16XPXVwldBEqN9sKEEJyppClOYiHamjmLMC8vHxr53fPcWEmRfICywk-diP",
    category: "Sasti Masti"
  },
  {
    id: "deal_gulmarg",
    title: "Gulmarg ki Shaan",
    price: 99999,
    originalPrice: 240000,
    badge: "Ameeri Wali Feeling",
    tag: "",
    description: "Ski resorts and Kahwa. Feels like Yash Chopra movie, costs like a Bhojpuri one.",
    fact: "Bonus: Direct connection from your dreams.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwWjAV4Afwlap9YtfywUS7A19w7XE9jtAqk0hD_aSq3V34-2vnr9Y_IDwGeHs1cKSakHiz-6ojNeIJWUXYObnePynuc4exX-fK_gFmyXSP1UhMyGaVGWgtBjMDnIWzyyOxDnxst7ChYltPG4el0RgAzkv-9Abz5JVCezLJZ5xQseDwIquFJOjbNvu1KwcQGXwP4I8g-TlCjLehzB_dwKSgz_SopLMNUh1_kha26R7N6s4LfaP_a9n33nblyfEr1EHvfJk5zlNP8r-P",
    category: "Ameeri Wali Feeling"
  },
  {
    id: "deal_agra",
    title: "Agra Taj Special",
    price: 19999,
    originalPrice: 65000,
    badge: "Sasti Masti",
    tag: "",
    description: "Taj Mahal selfie and petha party. Luxury at mohalla rates. Habibi, come to Agra!",
    fact: "Tip: Save more money for marble shopping there.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq0padn2OCh2pwHPyhcSbFAg6GIW_ZvYg-9S246PkztVv9MF0XE38gVSWv0Ra0erm5BBqgTh7mtZT9Fw97NgXfCQBvIo45sk5kFvDPEmR8trb-myY33_hmAeNiUDLHWdLF-bW63kV59Tc7CGputWgPam0puptIRW1Ruw912M2cF8TB7uoDuNzbRv2VRvTyMCQF2GdE4v2w-bTxj1JIV4biqSkGhUBWrfZp_rlyyHwbXGp9U2U90RQ3DTfVelImO3iuGH_shskbVhLS",
    category: "Sasti Masti"
  },
  {
    id: "deal_rajasthan_safari",
    title: "Royal Rajasthan Safari",
    price: 12499,
    originalPrice: 45000,
    badge: "Ameeri Wali Feeling",
    tag: "",
    description: "Tent stay that’s better than your house. Camel ride and dal-baati-churma included.",
    fact: "Kanpuriya Fact: Tent is so luxury, you'll forget your flat.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuChypV-xFB5PVXNI95fqNjJhCHR_x0B8o29f8WTlDGICgGNVvDTU2SVubgQk-rFU1iiPhQEl6LtpwzDdFqo0fJ5wJo65fmf6Sqv80D43CXlqeZf_UjXkkuNzj-4kHoI9PPm0ZtmpxJna0uNv6YaMWkHa_UIyvtxjZWOKuSedpsTC3G_vUctcyaveNUOSaj5F8dCm1X7VJ_7JS03sEk27AtkMeVGUQ1zVOB81Bp1fLw6OSbnyK2Jh1tkj_pTfCq4VEufQ7SFCoa2BfGB",
    category: "Ameeri Wali Feeling"
  },
  {
    id: "deal_munnar",
    title: "Munnar Tea Trails",
    price: 15000,
    originalPrice: 55000,
    badge: "Sasti Masti",
    tag: "Best Seller",
    description: "Greenery everywhere where you can see tea leaves, and leaves can see your cheap deal.",
    fact: "Tip: No interest, only 100% interest in fun.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0EmSM6yrFn3FzTbVpTg4WBbGJQgM5ZdiHRiBYCUSm4VP4Z8ARG3sPUoIj6hGeuMaAOPmk7NVipjT2UsmEN1S-HIZKIoz-PwJQWBQe9P5Fw3BYLK0qwNE8bOb3p7qSBTV7W6A5IBL6q_UIVUYlDR3ADnFq0dCgC2y2EAMrdMeoRwTRcQeA8b9lzR-gTr51OEZO8T8EECxG7KbJqR2BEtW0Xsf7lfVUrrh04hCxI882EfXHg0NEbDaxUHElm94gYBt3WgFX0dKbAfK6",
    category: "Sasti Masti"
  }
];

const defaultDestinations = [
  {
    id: "dest_varanasi",
    title: "Varanasi Vibes",
    state: "Uttar Pradesh",
    price: 14999,
    originalPrice: 25000,
    badge: "Best Seller",
    duration: "4 Nights",
    category: "Spiritual",
    vibe: "Ganges Aarti is cool, but have you seen our VIP boat access? Maharaja treatment.",
    feedback: "Vibe check? Pure soul. Crowds? Maharaja handling.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdCtcNIng0xPI0MHvCdxr5zzNev7Yx_L4Tk-4zwBDdrsWtYpr8h2mdycpJ7CICt06M92CnNwfDvgx34DnfsWkWpy0y5bxmASbFJakcGuNHUzJTr6KmpOWdO4Jq1xfe8yJOL66PVkRiXbQ98Vb6rWq3Tuyo716C87x-lUVKC-zcvya4Ex7g4GJDa2HJeByKYftirtqBYkBBtvh9GVwqE86yiTMf0pTr0b2WW4Y9b6X_GATfUGWHLvkovfEUMmFlGjlCsPSvHNKZnI_J"
  },
  {
    id: "dest_kerala",
    title: "Kerala Backwaters",
    state: "God's Own Country",
    price: 22500,
    originalPrice: 40000,
    badge: "",
    duration: "6 Nights",
    category: "Backwaters",
    vibe: "Houseboat floating on emerald backwaters. Complete serenity, VIP hospitality.",
    feedback: "Houseboat mein sukoon, baaki sab moh-maaya hai.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCz5z_M6DaIfr9IBajpvt7zrf5NNRS9jw9why32bjYjYXBaJmZClom6vz_jmnFQkivFjVwOeiFuH1LmutamJrfuEj4iGngidimKDEDuHjC4RLJ3t1wl3y7o5xZlKORUXzLFFf6JY2OJJuGDSffp-QuqUh5C846_3vKD3CGcGBQ3zsWWI7uKkJ_Wn3AlUcfPhaUL9XmPqRaixCqkSGkCHB_BLSp_RkmAEKGnKFze-3sw2kvYsKRzfKRQI9qiMtNZNy0HXaKEIppGyGg"
  },
  {
    id: "dest_rajasthan",
    title: "Rajasthan Heritage",
    state: "Udaipur & Jaipur",
    price: 31999,
    originalPrice: 50000,
    badge: "Trending",
    duration: "5 Nights",
    category: "Royal Heritage",
    vibe: "Intricate jaali work, grand facades, and majestic fort visits at golden hour.",
    feedback: "Kyunki tumhara ghar palace se kam thodi hai?",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoEHP3WINEOEm782Z9pJzNVnLosYJY2EsWH520BWX8jDYXvJdt-MAseYODazIT9JYKixNpfI6-gYZVGCnr_8lbVQwMwZlaiDUJ_20daxLeNNnAKzQ2zRNaAFDnrq0hjsiHe93H3QkLkQs3rzkPi62ToNr9hztvKqFR-LnL7vRUE6nFDbzzkUyhtFIClQIeLM93lnCxI1DHlWL1K2cQBnkkoy1zE9-aISMkmAacus2NSixs3RSobdC-b8cEjahtqucFFnoWZy4TKDZW"
  },
  {
    id: "dest_munnar",
    title: "Munnar: Chill like a Don",
    state: "Kerala Hills",
    price: 12500,
    originalPrice: 20000,
    badge: "Best Seller",
    duration: "3 Nights",
    category: "Backwaters",
    vibe: "Foggy mountains, hot tea, and zero office calls. Pure sukkoon.",
    feedback: "Foggy view, hot coffee, perfect local vibes.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmYVhga45rqGAqPsGffOyMms5qdw5rcSphVIexaIlHjAnRfHzemVWSZWCywMt1siQ3q29Blk7d7tGNb6Nu-Cgvu1TVYtqx1ER_DX7S0KMoDYWNyoCp6-_QPOuWf9eLPyi8bkjfDD44Aycqg5PYLKeGjCZOoAxMSgvSQ9Ki9H7NrAu6irULDKg-_zUtBoCqrVYBMrTqohAUT5PWKrasL9oKVVFHx87vRCHabRCapfz57gSogpQ06bWcm4zoaZ5pWtk86O0_sYXBvSSO"
  }
];

const defaultTestimonials = [
  {
    id: "testi_1",
    name: "Pappu From Kanpur",
    quote: "Bhai, Varanasi gaye thhey. Itna sasta ki laga koi kidney toh nahi nikal lega? But nahi, service ek dum Maharaja thhi!",
    stars: 5,
    avatarColor: "bg-secondary-container"
  },
  {
    id: "testi_2",
    name: "Anjali Bhabhi",
    quote: "Hrishikesh vibes at Civil Lines price. Seriously, wife khush, pocket khush. Aur kya chahiye?",
    stars: 5,
    avatarColor: "bg-primary-fixed"
  },
  {
    id: "testi_3",
    name: "Bunty Soni",
    quote: "Rajasthan trip was lit. Inke guide ne itne ache photos kheeche ki Tinder match 10x badh gaye.",
    stars: 5,
    avatarColor: "bg-secondary-fixed"
  }
];

// Helper to seed local storage on mock mode
function seedMockDB() {
  const store = localDB.getStore();
  let modified = false;

  if (!store.deals || store.deals.length === 0) {
    store.deals = defaultDeals;
    modified = true;
  }
  if (!store.destinations || store.destinations.length === 0) {
    store.destinations = defaultDestinations;
    modified = true;
  }
  if (!store.testimonials || store.testimonials.length === 0) {
    store.testimonials = defaultTestimonials;
    modified = true;
  }
  
  if (modified) {
    localDB.saveStore(store);
  }
}

// Dynamically seed firebase if running real Firebase
async function seedFirebaseDB() {
  if (isMock) {
    seedMockDB();
    return;
  }

  try {
    const { collection, getDocs, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    // Seed Deals
    const dealsSnapshot = await getDocs(collection(db, "deals"));
    if (dealsSnapshot.empty) {
      for (const deal of defaultDeals) {
        await setDoc(doc(db, "deals", deal.id), deal);
      }
      console.log("Seeded default deals to Firestore.");
    }

    // Seed Destinations
    const destSnapshot = await getDocs(collection(db, "destinations"));
    if (destSnapshot.empty) {
      for (const dest of defaultDestinations) {
        await setDoc(doc(db, "destinations", dest.id), dest);
      }
      console.log("Seeded default destinations to Firestore.");
    }

    // Seed Testimonials
    const testiSnapshot = await getDocs(collection(db, "testimonials"));
    if (testiSnapshot.empty) {
      for (const testi of defaultTestimonials) {
        await setDoc(doc(db, "testimonials", testi.id), testi);
      }
      console.log("Seeded default testimonials to Firestore.");
    }
  } catch (error) {
    console.error("Firestore seeding failed, running on mock fallbacks.", error);
    seedMockDB();
  }
}

// Call seeding on startup
seedFirebaseDB();

// Database Service Interface
export const dbService = {
  // --- DEALS ---
  async getDeals() {
    if (isMock) {
      return localDB.getStore().deals || [];
    }
    try {
      const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      const snap = await getDocs(collection(db, "deals"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(e);
      return localDB.getStore().deals || [];
    }
  },

  async addDeal(deal) {
    const newId = "deal_" + Math.random().toString(36).substr(2, 9);
    const data = { id: newId, ...deal };

    if (isMock) {
      const store = localDB.getStore();
      store.deals.push(data);
      localDB.saveStore(store);
      return data;
    }
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      await setDoc(doc(db, "deals", newId), data);
      return data;
    } catch (e) {
      console.error(e);
      // fallback save
      const store = localDB.getStore();
      store.deals.push(data);
      localDB.saveStore(store);
      return data;
    }
  },

  // --- DESTINATIONS ---
  async getDestinations() {
    if (isMock) {
      return localDB.getStore().destinations || [];
    }
    try {
      const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      const snap = await getDocs(collection(db, "destinations"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(e);
      return localDB.getStore().destinations || [];
    }
  },

  async addDestination(dest) {
    const newId = "dest_" + Math.random().toString(36).substr(2, 9);
    const data = { id: newId, ...dest };

    if (isMock) {
      const store = localDB.getStore();
      store.destinations.push(data);
      localDB.saveStore(store);
      return data;
    }
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      await setDoc(doc(db, "destinations", newId), data);
      return data;
    } catch (e) {
      console.error(e);
      const store = localDB.getStore();
      store.destinations.push(data);
      localDB.saveStore(store);
      return data;
    }
  },

  // --- TESTIMONIALS / STORIES ---
  async getTestimonials() {
    if (isMock) {
      return localDB.getStore().testimonials || [];
    }
    try {
      const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      const snap = await getDocs(collection(db, "testimonials"));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(e);
      return localDB.getStore().testimonials || [];
    }
  },

  async addTestimonial(testi) {
    const newId = "testi_" + Math.random().toString(36).substr(2, 9);
    const colors = ["bg-secondary-container", "bg-primary-fixed", "bg-secondary-fixed"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];
    const data = { id: newId, avatarColor, ...testi };

    if (isMock) {
      const store = localDB.getStore();
      store.testimonials.push(data);
      localDB.saveStore(store);
      return data;
    }
    try {
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      await setDoc(doc(db, "testimonials", newId), data);
      return data;
    } catch (e) {
      console.error(e);
      const store = localDB.getStore();
      store.testimonials.push(data);
      localDB.saveStore(store);
      return data;
    }
  },

  // --- USER DATA (Loyalty, Wishlist, Trips) ---
  async getUserData(userId) {
    if (isMock) {
      const store = localDB.getStore();
      // Find matching mock user
      let matchedUser = Object.values(store.users).find(u => u.uid === userId);
      if (!matchedUser) {
        matchedUser = {
          uid: userId,
          displayName: "Maharaja User",
          kharchaPaani: 24500,
          tripsDone: 12,
          kmsTravelled: 42000,
          wishlist: ["Goa Susegad", "Leh, Ladakh", "Manali"],
          upcomingTrips: [
            {
              id: "trip_1",
              title: "Rishikesh Yoga Retreat",
              date: "Oct 12 - Oct 18",
              vibe: "Full Shanti with a side of adventure. Itinerary ready, packing baki hai.",
              people: 2,
              status: "upcoming"
            }
          ],
          completedTrips: [
            {
              id: "trip_completed_1",
              title: "Kerala Backwaters",
              date: "Sept 2023",
              people: 3,
              detail: "Memories Unlimited",
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuApAUbaeedQc5YZE2UqOm4mQBcwKhQmO0XW0vxgX_Zlh1ZzNPUngNjugkKsLmeSISL7c0Ha7_wGMrdo17ZHbywCXKsCPf7V7khXbh2woE3D1jWxy9CwbhSzmNOK1xNu3j4n0aG4jjqflP_pOG5DriAQVipZa4DOEK2PKbAVM8GG57a6WOIhyUW7SWLbj43GcwU3TMKUhPYDhtHCrvSPKs_xgvA-ZI_H4mFtjZ_ooXcseO3iVo5M0L02LfNlz9H0R-df4it2fYmXJGPT"
            },
            {
              id: "trip_completed_2",
              title: "Jaipur Heritage Trip",
              date: "June 2023",
              people: 2,
              detail: "Maharaja Experience",
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCig978IS10DR8ZF5GFq9nPTklFsURdGit9uD1WjCdvQGWG5hcQ-LEDd9per9p2ylqT7vrfqij1tf4eUWPqK4zQFmZculaSZKUhFmwqMaPhZT4D-a0dd6Ud6IRxS2bk_ZtQxq34EvkBXfzaG5-7lpi3E-ZjuVO9tmM2QrzvmIa4VNvwwrMHOV5Z28-8fSB2Oj9QoXwov9q76H_xx0-_GfWL8BtMlrLdlHznEtelJ7t7LqzbCLaR2kCkpP3xZ33pUhvSPAtp3CFuOjGK"
            }
          ]
        };
      }
      return matchedUser;
    }
    
    try {
      const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      const docRef = doc(db, "users", userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data();
      } else {
        // Create standard user profile in Firestore
        const defaultProfile = {
          uid: userId,
          displayName: "Maharaja User",
          kharchaPaani: 24500,
          tripsDone: 12,
          kmsTravelled: 42000,
          wishlist: ["Goa Susegad", "Leh, Ladakh", "Manali"],
          upcomingTrips: [
            {
              id: "trip_1",
              title: "Rishikesh Yoga Retreat",
              date: "Oct 12 - Oct 18",
              vibe: "Full Shanti with a side of adventure. Itinerary ready, packing baki hai.",
              people: 2,
              status: "upcoming"
            }
          ],
          completedTrips: [
            {
              id: "trip_completed_1",
              title: "Kerala Backwaters",
              date: "Sept 2023",
              people: 3,
              detail: "Memories Unlimited",
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuApAUbaeedQc5YZE2UqOm4mQBcwKhQmO0XW0vxgX_Zlh1ZzNPUngNjugkKsLmeSISL7c0Ha7_wGMrdo17ZHbywCXKsCPf7V7khXbh2woE3D1jWxy9CwbhSzmNOK1xNu3j4n0aG4jjqflP_pOG5DriAQVipZa4DOEK2PKbAVM8GG57a6WOIhyUW7SWLbj43GcwU3TMKUhPYDhtHCrvSPKs_xgvA-ZI_H4mFtjZ_ooXcseO3iVo5M0L02LfNlz9H0R-df4it2fYmXJGPT"
            },
            {
              id: "trip_completed_2",
              title: "Jaipur Heritage Trip",
              date: "June 2023",
              people: 2,
              detail: "Maharaja Experience",
              imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCig978IS10DR8ZF5GFq9nPTklFsURdGit9uD1WjCdvQGWG5hcQ-LEDd9per9p2ylqT7vrfqij1tf4eUWPqK4zQFmZculaSZKUhFmwqMaPhZT4D-a0dd6Ud6IRxS2bk_ZtQxq34EvkBXfzaG5-7lpi3E-ZjuVO9tmM2QrzvmIa4VNvwwrMHOV5Z28-8fSB2Oj9QoXwov9q76H_xx0-_GfWL8BtMlrLdlHznEtelJ7t7LqzbCLaR2kCkpP3xZ33pUhvSPAtp3CFuOjGK"
            }
          ]
        };
        const { setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        await setDoc(docRef, defaultProfile);
        return defaultProfile;
      }
    } catch (e) {
      console.error(e);
      return localDB.getStore().users[userId] || {};
    }
  },

  async updateUserData(userId, data) {
    if (isMock) {
      const store = localDB.getStore();
      const userKey = Object.keys(store.users).find(k => store.users[k].uid === userId);
      if (userKey) {
        store.users[userKey] = { ...store.users[userKey], ...data };
      } else {
        // Fallback for mock custom users
        store.users[userId] = { uid: userId, ...data };
      }
      localDB.saveStore(store);
      return;
    }
    try {
      const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
      await updateDoc(doc(db, "users", userId), data);
    } catch (e) {
      console.error(e);
    }
  },

  async addTripToHistory(userId, trip) {
    const data = await this.getUserData(userId);
    const list = trip.status === "upcoming" ? "upcomingTrips" : "completedTrips";
    
    if (!data[list]) data[list] = [];
    
    const newTrip = {
      id: "trip_" + Math.random().toString(36).substr(2, 9),
      ...trip
    };
    data[list].push(newTrip);
    
    // Loyalty increase for booking!
    if (trip.status !== "upcoming") {
      data.kharchaPaani = (data.kharchaPaani || 0) + 1500;
      data.tripsDone = (data.tripsDone || 0) + 1;
      data.kmsTravelled = (data.kmsTravelled || 0) + 1200;
    }

    await this.updateUserData(userId, data);
    return newTrip;
  }
};
