// Homepage JavaScript

// Category icons mapping
const CATEGORY_ICONS = {
    'Restaurant': '🍽️',
    'Cafe': '☕',
    'Doctor': '👨‍⚕️',
    'Clinic': '🏥',
    'Hospital': '🏥',
    'Salon': '💇',
    'Spa': '💆',
    'Gym': '💪',
    'Hotel': '🏨',
    'Shop': '🏪',
    'Service': '🔧',
    'Education': '📚',
    'Real Estate': '🏠',
    'Automotive': '🚗',
    'Technology': '💻',
    'Other': '📋'
};

// Initialize homepage
async function initHomepage() {
    try {
        // Populate dropdowns
        populateCategoryDropdown();
        populateCityDropdown();
        
        // Load data
        await Promise.all([
            loadFeaturedProfiles(),
            loadCategories(),
            loadRecentBusinesses(),
            loadPopularServices(),
            loadStats()
        ]);
    } catch (error) {
        console.error('Error initializing homepage:', error);
    }
}

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('hero-category');
    if (!categorySelect) return;
    
    CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Populate city dropdown
function populateCityDropdown() {
    const citySelect = document.getElementById('hero-city');
    if (!citySelect) return;
    
    CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase();
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Load featured profiles
async function loadFeaturedProfiles() {
    const container = document.getElementById('featured-profiles');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
        
        // Query featured businesses
        const { data: businesses, error } = await supabaseClient
            .from('businesses')
            .select(`
                *,
                categories(name, slug),
                users(full_name)
            `)
            .eq('is_featured', true)
            .eq('is_published', true)
            .gte('featured_until', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(6);
        
        if (error) throw error;
        
        if (!businesses || businesses.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <p>No featured profiles yet. Be the first to feature your business!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = businesses.map(business => createProfileCard(business, true)).join('');
    } catch (error) {
        console.error('Error loading featured profiles:', error);
        container.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><p>Failed to load featured profiles</p></div>';
    }
}

// Load categories
async function loadCategories() {
    const container = document.getElementById('categories-grid');
    if (!container) return;
    
    try {
        // Get categories with business counts
        const { data: categories, error } = await supabaseClient
            .from('categories')
            .select('*')
            .order('name');
        
        if (error) throw error;
        
        // Get business counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const { count } = await supabaseClient
                    .from('businesses')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', category.id)
                    .eq('is_published', true);
                
                return { ...category, count: count || 0 };
            })
        );
        
        container.innerHTML = categoriesWithCounts
            .map(category => createCategoryCard(category))
            .join('');
    } catch (error) {
        console.error('Error loading categories:', error);
        container.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><p>Failed to load categories</p></div>';
    }
}

// Load recent businesses
async function loadRecentBusinesses() {
    const container = document.getElementById('recent-businesses');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
        
        const { data: businesses, error } = await supabaseClient
            .from('businesses')
            .select(`
                *,
                categories(name, slug),
                users(full_name)
            `)
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(6);
        
        if (error) throw error;
        
        if (!businesses || businesses.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <p>No businesses registered yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = businesses.map(business => createProfileCard(business)).join('');
    } catch (error) {
        console.error('Error loading recent businesses:', error);
        container.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><p>Failed to load recent businesses</p></div>';
    }
}

// Load popular services (tags)
async function loadPopularServices() {
    const container = document.getElementById('popular-services');
    if (!container) return;
    
    try {
        // Get tags with business counts
        const { data: tags, error } = await supabaseClient
            .from('tags')
            .select('*')
            .limit(20);
        
        if (error) throw error;
        
        if (!tags || tags.length === 0) {
            container.innerHTML = '<p class="text-secondary">No popular services yet</p>';
            return;
        }
        
        // Get counts for each tag
        const tagsWithCounts = await Promise.all(
            tags.map(async (tag) => {
                const { count } = await supabaseClient
                    .from('business_tags')
                    .select('*', { count: 'exact', head: true })
                    .eq('tag_id', tag.id);
                
                return { ...tag, count: count || 0 };
            })
        );
        
        // Sort by count and take top 15
        const popularTags = tagsWithCounts
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);
        
        container.innerHTML = popularTags
            .map(tag => `
                <a href="/pages/search.html?tag=${encodeURIComponent(tag.slug)}" class="tag-item">
                    ${tag.name} (${tag.count})
                </a>
            `)
            .join('');
    } catch (error) {
        console.error('Error loading popular services:', error);
        container.innerHTML = '<p class="text-secondary">Failed to load popular services</p>';
    }
}

// Load statistics
async function loadStats() {
    try {
        // Get total businesses count
        const { count: businessCount } = await supabaseClient
            .from('businesses')
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true);
        
        // Update stats
        const businessElement = document.getElementById('total-businesses');
        if (businessElement) {
            animateCounter(businessElement, businessCount || 0);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Create profile card HTML
function createProfileCard(business, isFeatured = false) {
    const categoryName = business.categories?.name || 'Other';
    const bannerUrl = business.banner_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop';
    const logoUrl = business.logo_url || 'https://via.placeholder.com/60';
    
    return `
        <a href="/pages/profile.html?id=${business.id}" class="profile-card ${isFeatured ? 'card-featured' : ''}">
            ${isFeatured ? '<div class="featured-badge">Featured</div>' : ''}
            <img src="${bannerUrl}" alt="${sanitizeHTML(business.name)}" class="profile-banner">
            <div class="profile-header">
                <img src="${logoUrl}" alt="${sanitizeHTML(business.name)}" class="profile-logo">
                <div class="profile-info">
                    <h3 class="profile-name">${sanitizeHTML(business.name)}</h3>
                    <p class="profile-category">${categoryName}</p>
                </div>
            </div>
            <div class="profile-body">
                <p class="profile-description">${sanitizeHTML(business.description || 'No description available')}</p>
                <div class="profile-meta">
                    ${business.price_range ? `
                        <span class="meta-item">
                            💰 ${sanitizeHTML(business.price_range)}
                        </span>
                    ` : ''}
                    ${business.city ? `
                        <span class="meta-item">
                            📍 ${sanitizeHTML(business.city)}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="profile-footer">
                <div class="profile-rating">
                    ⭐ ${(Math.random() * 2 + 3).toFixed(1)}
                </div>
                <span class="profile-location">${sanitizeHTML(business.city || 'Nepal')}</span>
            </div>
        </a>
    `;
}

// Create category card HTML
function createCategoryCard(category) {
    const icon = CATEGORY_ICONS[category.name] || '📋';
    
    return `
        <a href="/pages/search.html?category=${encodeURIComponent(category.slug)}" class="category-card">
            <span class="category-icon">${icon}</span>
            <h3 class="category-name">${sanitizeHTML(category.name)}</h3>
            <p class="category-count">${category.count} listings</p>
        </a>
    `;
}

// Animate counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Handle hero search
function handleHeroSearch(event) {
    event.preventDefault();
    
    const query = document.getElementById('hero-search-input').value;
    const category = document.getElementById('hero-category').value;
    const city = document.getElementById('hero-city').value;
    
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    
    window.location.href = `/pages/search.html?${params.toString()}`;
}

// Add search icon to hero button
document.addEventListener('DOMContentLoaded', () => {
    const heroSearchBtn = document.querySelector('.hero-search-btn');
    if (heroSearchBtn && !heroSearchBtn.querySelector('svg')) {
        heroSearchBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            Search
        `;
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomepage);
} else {
    initHomepage();
}