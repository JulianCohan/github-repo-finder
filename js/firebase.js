// Initialize Firebase
const firebaseConfig = {
  // You'll need to replace these with your actual Firebase project values
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

// Database collections
const SEARCHES_COLLECTION = 'saved_searches';
const RESULTS_COLLECTION = 'search_results';

// Save a search to Firebase
async function saveSearch(userId, searchData) {
  try {
    const searchRef = await db.collection(SEARCHES_COLLECTION).add({
      userId: userId,
      query: searchData.query,
      language: searchData.language || "Any",
      minStars: searchData.minStars,
      contextLines: searchData.contextLines,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log("Search saved with ID: ", searchRef.id);
    return searchRef.id;
  } catch (error) {
    console.error("Error saving search: ", error);
    throw error;
  }
}

// Get user's saved searches
async function getSavedSearches(userId) {
  try {
    const snapshot = await db.collection(SEARCHES_COLLECTION)
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting saved searches: ", error);
    throw error;
  }
}

// Delete a saved search
async function deleteSavedSearch(searchId) {
  try {
    await db.collection(SEARCHES_COLLECTION).doc(searchId).delete();
    console.log("Search successfully deleted");
    return true;
  } catch (error) {
    console.error("Error deleting search: ", error);
    throw error;
  }
}

// Save search results
async function saveSearchResults(searchId, results) {
  try {
    // Store only essential data to reduce database size
    const trimmedResults = results.map(result => ({
      repo_name: result.repo_name,
      file_path: result.file_path,
      file_url: result.file_url,
      stars: result.stars,
      last_updated: result.last_updated,
      language: result.language,
      match_score: result.match_score
    }));
    
    await db.collection(RESULTS_COLLECTION).doc(searchId).set({
      results: trimmedResults,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log("Results saved for search ID: ", searchId);
    return true;
  } catch (error) {
    console.error("Error saving results: ", error);
    throw error;
  }
}

// Get saved search results
async function getSearchResults(searchId) {
  try {
    const doc = await db.collection(RESULTS_COLLECTION).doc(searchId).get();
    
    if (doc.exists) {
      return doc.data().results;
    } else {
      console.log("No results found for this search ID");
      return [];
    }
  } catch (error) {
    console.error("Error getting search results: ", error);
    throw error;
  }
}