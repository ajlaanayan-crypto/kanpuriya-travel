// Firebase Configuration & LocalStorage Fallback Engine
// You can replace these placeholder values with your real Firebase Web App configuration.
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "kanpuriya-travel-witty.firebaseapp.com",
  projectId: "kanpuriya-travel-witty",
  storageBucket: "kanpuriya-travel-witty.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Check if we are running in real Firebase or Mock Mode
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "PLACEHOLDER_API_KEY";

let app, auth, db;
let isMock = false;

// Mock Store for LocalStorage DB Fallback
class LocalDB {
  constructor() {
    this.storageKey = "kanpuriya_travel_local_db";
    this.initStore();
  }

  initStore() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        users: {},
        trips: [],
        deals: [],
        testimonials: [],
        wishlist: {}
      }));
    }
  }

  getStore() {
    this.initStore();
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveStore(store) {
    localStorage.setItem(this.storageKey, JSON.stringify(store));
  }
}

const localDB = new LocalDB();

// Mock Auth implementation
class MockAuth {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("kanpuriya_travel_current_user") || "null");
    this.listeners = [];
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Trigger immediately with current state
    setTimeout(() => callback(this.currentUser), 0);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async signInWithEmailAndPassword(email, password) {
    const store = localDB.getStore();
    const userKey = email.toLowerCase().replace(/\./g, "_");
    const user = store.users[userKey];
    
    if (!user || user.password !== password) {
      throw new Error("Oye! Email ya password galat hai. (Incorrect credentials)");
    }
    
    this.currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuCiJ6qE2_80SV6OrZe3bdGECl7nv05UDY1orCFQQ4ElHrF12jHNBuMYXCgEZKhKKMDjBh0xGA58ArihpAu4jI3ySy3nCp-3qsY2hMpbBlxpgwCp6hN6RCgyK4lcc528COziqkl6bvJDsxUUx-jWv2U2xeHTvyLjl6EZuceD09hfkvZXISeWY12ueRJ2VZv9jJejrdaVOHDmatuAb61C55Lt72ztdbdrCCIu5SE1NwYBGHgRPwXvgEkGHucAMIaWQQMa-Mby2r40qU5M"
    };
    
    localStorage.setItem("kanpuriya_travel_current_user", JSON.stringify(this.currentUser));
    this.listeners.forEach(l => l(this.currentUser));
    return { user: this.currentUser };
  }

  async createUserWithEmailAndPassword(email, password) {
    const store = localDB.getStore();
    const userKey = email.toLowerCase().replace(/\./g, "_");
    
    if (store.users[userKey]) {
      throw new Error("Bhai, yeh email pehle se registered hai! (Email already exists)");
    }

    const uid = "user_" + Math.random().toString(36).substr(2, 9);
    const newUser = {
      uid,
      email,
      password, // In a real app we hash it, in mock we store simple
      displayName: email.split("@")[0],
      photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiJ6qE2_80SV6OrZe3bdGECl7nv05UDY1orCFQQ4ElHrF12jHNBuMYXCgEZKhKKMDjBh0xGA58ArihpAu4jI3ySy3nCp-3qsY2hMpbBlxpgwCp6hN6RCgyK4lcc528COziqkl6bvJDsxUUx-jWv2U2xeHTvyLjl6EZuceD09hfkvZXISeWY12ueRJ2VZv9jJejrdaVOHDmatuAb61C55Lt72ztdbdrCCIu5SE1NwYBGHgRPwXvgEkGHucAMIaWQQMa-Mby2r40qU5M",
      kharchaPaani: 15000 // Welcome bonus of 15k!
    };

    store.users[userKey] = newUser;
    localDB.saveStore(store);

    this.currentUser = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL
    };

    localStorage.setItem("kanpuriya_travel_current_user", JSON.stringify(this.currentUser));
    this.listeners.forEach(l => l(this.currentUser));
    return { user: this.currentUser };
  }

  async updateProfile(user, updates) {
    if (updates.displayName) {
      this.currentUser.displayName = updates.displayName;
    }
    if (updates.photoURL) {
      this.currentUser.photoURL = updates.photoURL;
    }
    localStorage.setItem("kanpuriya_travel_current_user", JSON.stringify(this.currentUser));
    
    // Update in store as well
    const store = localDB.getStore();
    for (let email in store.users) {
      if (store.users[email].uid === this.currentUser.uid) {
        store.users[email].displayName = this.currentUser.displayName;
        store.users[email].photoURL = this.currentUser.photoURL;
      }
    }
    localDB.saveStore(store);

    this.listeners.forEach(l => l(this.currentUser));
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem("kanpuriya_travel_current_user");
    this.listeners.forEach(l => l(null));
  }
}

// Mock Firestore Database implementation
class MockFirestore {
  async collection(path) {
    return { path };
  }

  async getDocs(colRef) {
    const store = localDB.getStore();
    const data = store[colRef.path] || [];
    return {
      forEach: (callback) => {
        data.forEach(item => {
          callback({
            id: item.id,
            data: () => item
          });
        });
      },
      docs: data.map(item => ({
        id: item.id,
        data: () => item
      }))
    };
  }

  async addDoc(colRef, data) {
    const store = localDB.getStore();
    if (!store[colRef.path]) store[colRef.path] = [];
    
    const docId = colRef.path + "_" + Math.random().toString(36).substr(2, 9);
    const newDoc = { id: docId, ...data, createdAt: new Date().toISOString() };
    
    store[colRef.path].push(newDoc);
    localDB.saveStore(store);
    return { id: docId };
  }

  async setDoc(docRef, data, options = {}) {
    const store = localDB.getStore();
    const [colPath, docId] = docRef.path.split("/");
    
    if (!store[colPath]) store[colPath] = [];
    
    const index = store[colPath].findIndex(item => item.id === docId);
    if (index > -1) {
      if (options.merge) {
        store[colPath][index] = { ...store[colPath][index], ...data };
      } else {
        store[colPath][index] = { id: docId, ...data };
      }
    } else {
      store[colPath].push({ id: docId, ...data });
    }
    
    localDB.saveStore(store);
  }

  async getDoc(docRef) {
    const store = localDB.getStore();
    const [colPath, docId] = docRef.path.split("/");
    const list = store[colPath] || [];
    
    // For nested document paths like users/user_id
    if (colPath === "users") {
      const user = Object.values(store.users).find(u => u.uid === docId);
      return {
        exists: () => !!user,
        data: () => user
      };
    }

    const item = list.find(x => x.id === docId);
    return {
      exists: () => !!item,
      data: () => item
    };
  }

  doc(colOrDb, pathOrId, ...extra) {
    let fullPath = "";
    if (typeof colOrDb === "string") {
      fullPath = colOrDb + "/" + pathOrId;
    } else {
      fullPath = colOrDb.path + "/" + pathOrId;
    }
    return { path: fullPath };
  }
}

// Initializing real Firebase or Mock fallback
if (isConfigured) {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully. Running on production DB.");
  } catch (error) {
    console.error("Firebase SDK load failed. Falling back to Mock Database Mode.", error);
    isMock = true;
    auth = new MockAuth();
    db = new MockFirestore();
  }
} else {
  console.log("No Firebase API key configured. Running in Mock Database Mode (LocalStorage).");
  isMock = true;
  auth = new MockAuth();
  db = new MockFirestore();
}

export {
  app,
  auth,
  db,
  isMock,
  localDB
};
