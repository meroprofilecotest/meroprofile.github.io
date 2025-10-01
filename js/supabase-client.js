// Supabase Client Initialization and Helper Functions

let supabaseClient = null;
let currentUser = null;

// Initialize Supabase client
function initSupabase() {
    if (!window.supabase) {
        console.error('Supabase library not loaded');
        return;
    }
    
    supabaseClient = window.supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
    );
    
    // Check for existing session
    checkAuthState();
    
    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        updateUIForAuthState();
        
        if (event === 'SIGNED_IN') {
            console.log('User signed in:', currentUser);
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
        }
    });
}

// Check current auth state
async function checkAuthState() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        currentUser = session?.user || null;
        updateUIForAuthState();
    } catch (error) {
        console.error('Error checking auth state:', error);
    }
}

// Update UI based on auth state
function updateUIForAuthState() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
            const userEmail = document.getElementById('user-email');
            if (userEmail) userEmail.textContent = currentUser.email;
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Sign Up
async function signUp(email, password, fullName) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });
        
        if (error) throw error;
        
        // Create user profile
        if (data.user) {
            await supabaseClient.from('users').insert({
                id: data.user.id,
                email: email,
                full_name: fullName
            });
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

// Sign In
async function signIn(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

// Sign Out
async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        window.location.href = '/';
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

// Sign In with Google
async function signInWithGoogle() {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Google sign in error:', error);
        return { success: false, error: error.message };
    }
}

// Sign In with Facebook
async function signInWithFacebook() {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Facebook sign in error:', error);
        return { success: false, error: error.message };
    }
}

// Reset Password
async function resetPassword(email) {
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
    }
}

// Update Password
async function updatePassword(newPassword) {
    try {
        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Update password error:', error);
        return { success: false, error: error.message };
    }
}

// Upload Image to Storage
async function uploadImage(file, path) {
    try {
        // Validate file type
        if (!STORAGE_CONFIG.allowedTypes.includes(file.type)) {
            throw new Error('Invalid file type. Only images are allowed.');
        }
        
        // Validate file size
        if (file.size > STORAGE_CONFIG.maxFileSize) {
            throw new Error('File size exceeds 5MB limit.');
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = path ? `${path}/${fileName}` : fileName;
        
        const { data, error } = await supabaseClient.storage
            .from(STORAGE_CONFIG.bucketName)
            .upload(filePath, file);
        
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
            .from(STORAGE_CONFIG.bucketName)
            .getPublicUrl(filePath);
        
        return { success: true, url: publicUrl, path: filePath };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
    }
}

// Delete Image from Storage
async function deleteImage(path) {
    try {
        const { error } = await supabaseClient.storage
            .from(STORAGE_CONFIG.bucketName)
            .remove([path]);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
    }
}

// Get Current User
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}