// Initialize Supabase Client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const logoutButton = document.getElementById('logoutButton');
const savedSearchesButton = document.getElementById('savedSearchesButton');
const saveSearchButton = document.getElementById('saveSearchButton');
const authModal = new bootstrap.Modal(document.getElementById('authModal'));
const authModalTitle = document.getElementById('authModalTitle');
const authSubmitButton = document.getElementById('authSubmitButton');
const authError = document.getElementById('authError');

// Current auth state
let currentUser = null;
let authMode = 'login'; // or 'signup'

// Check if user is already logged in
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        handleAuthSuccess(user);
    }
}

// Handle successful authentication
function handleAuthSuccess(user) {
    currentUser = user;
    
    // Update UI
    loginButton.style.display = 'none';
    signupButton.style.display = 'none';
    logoutButton.style.display = 'block';
    savedSearchesButton.style.display = 'block';
    saveSearchButton.style.display = 'block';
    
    // Close modal if open
    authModal.hide();
    
    console.log('Logged in as:', user.email);
}

// Handle authentication failure
function handleAuthError(error) {
    authError.textContent = error.message || 'Authentication failed';
    authError.style.display = 'block';
}

// Login user
async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) throw error;
        handleAuthSuccess(data.user);
    } catch (error) {
        handleAuthError(error);
    }
}

// Sign up user
async function signupUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        
        if (error) throw error;
        
        if (data.user.identities && data.user.identities.length === 0) {
            // User already exists
            authError.textContent = 'An account with this email already exists. Please log in.';
            authError.style.display = 'block';
            return;
        }
        
        handleAuthSuccess(data.user);
        
        // Show confirmation message
        alert('Account created successfully! Check your email for confirmation.');
    } catch (error) {
        handleAuthError(error);
    }
}

// Logout user
async function logoutUser() {
    try {
        await supabase.auth.signOut();
        currentUser = null;
        
        // Update UI
        loginButton.style.display = 'block';
        signupButton.style.display = 'block';
        logoutButton.style.display = 'none';
        savedSearchesButton.style.display = 'none';
        saveSearchButton.style.display = 'none';
        
        console.log('Logged out');
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Set up event listeners for auth UI
function setupAuthListeners() {
    // Login button click
    loginButton.addEventListener('click', () => {
        authMode = 'login';
        authModalTitle.textContent = 'Log In';
        authSubmitButton.textContent = 'Log In';
        authError.style.display = 'none';
        authModal.show();
    });
    
    // Signup button click
    signupButton.addEventListener('click', () => {
        authMode = 'signup';
        authModalTitle.textContent = 'Sign Up';
        authSubmitButton.textContent = 'Sign Up';
        authError.style.display = 'none';
        authModal.show();
    });
    
    // Logout button click
    logoutButton.addEventListener('click', () => {
        logoutUser();
    });
    
    // Auth submit button click
    authSubmitButton.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            authError.textContent = 'Please enter both email and password';
            authError.style.display = 'block';
            return;
        }
        
        if (authMode === 'login') {
            loginUser(email, password);
        } else {
            signupUser(email, password);
        }
    });
    
    // Save search button click
    saveSearchButton.addEventListener('click', async () => {
        if (!currentUser) {
            alert('Please log in to save searches');
            return;
        }
        
        const searchData = {
            query: document.getElementById('query').value,
            language: document.getElementById('language').value,
            minStars: document.getElementById('minStars').value,
            contextLines: document.getElementById('contextLines').value,
        };
        
        try {
            const searchId = await saveSearch(currentUser.id, searchData);
            await saveSearchResults(searchId, currentResults);
            alert('Search saved successfully!');
        } catch (error) {
            console.error('Error saving search:', error);
            alert('Failed to save search. Please try again.');
        }
    });
    
    // Saved searches button click
    savedSearchesButton.addEventListener('click', async () => {
        if (!currentUser) return;
        
        try {
            const searches = await getSavedSearches(currentUser.id);
            const savedSearchesList = document.getElementById('savedSearchesList');
            const noSavedSearches = document.getElementById('noSavedSearches');
            
            savedSearchesList.innerHTML = '';
            
            if (searches.length === 0) {
                savedSearchesList.style.display = 'none';
                noSavedSearches.style.display = 'block';
            } else {
                savedSearchesList.style.display = 'table-row-group';
                noSavedSearches.style.display = 'none';
                
                searches.forEach(search => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${search.query}</td>
                        <td>${search.language}</td>
                        <td>${search.timestamp ? new Date(search.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-search" data-id="${search.id}">View</button>
                            <button class="btn btn-sm btn-danger delete-search" data-id="${search.id}">Delete</button>
                        </td>
                    `;
                    savedSearchesList.appendChild(row);
                });
                
                // Add event listeners for action buttons
                document.querySelectorAll('.view-search').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const searchId = e.target.dataset.id;
                        const results = await getSearchResults(searchId);
                        displayResults(results);
                        bootstrap.Modal.getInstance(document.getElementById('savedSearchesModal')).hide();
                    });
                });
                
                document.querySelectorAll('.delete-search').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        if (confirm('Are you sure you want to delete this saved search?')) {
                            const searchId = e.target.dataset.id;
                            await deleteSavedSearch(searchId);
                            e.target.closest('tr').remove();
                            
                            if (savedSearchesList.children.length === 0) {
                                savedSearchesList.style.display = 'none';
                                noSavedSearches.style.display = 'block';
                            }
                        }
                    });
                });
            }
            
            new bootstrap.Modal(document.getElementById('savedSearchesModal')).show();
        } catch (error) {
            console.error('Error loading saved searches:', error);
            alert('Failed to load saved searches. Please try again.');
        }
    });
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupAuthListeners();
});