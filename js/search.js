// Search Page JavaScript

let currentFilters = {
    query: '',
    category: '',
    city: '',
    price: '',
    tag: ''
};

// Initialize search page
async function initSearch() {
    // Populate dropdowns
    populateFilters();
    
    // Get URL parameters
    const params = getQueryParams();
    
    // Set filters from URL
    if (params.q) {
        currentFilters.query = params.q;
        document.getElementById('search-query').value = params.q;
    }
    if (params.category) {
        currentFilters.category = params.category;
        document.getElementById('filter-category').value = params.category;
    }
    if (params.city) {
        currentFilters.city = params.city;
        document.getElementById('filter-city').value = params.city;
    }
    if (params.price) {
        currentFilters.price = params.price;
        document.getElementById('filter-price').value = params.price;
    }
    if (params.tag) {
        currentFilters.tag = params.tag;
    }
    
    // Perform search
    await performSearch();
}

// Populate filter dropdowns
function populateFilters() {
    const categorySelect = document.getElementById('filter-category');
    CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    const citySelect = document.getElementById('filter-city');
    CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Perform search
async function performSearch() {
    const container = document.getElementById('results-container');
    const resultsTitle = document.getElementById('results-title');
    const resultsCount = document.getElementById('results-count');
    
    try {
        container.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
        
        // Update filters
        currentFilters.query = document.getElementById('search-query').value;
        currentFilters.category = document.getElementById('filter-category').value;
        currentFilters.city = document.getElementById('filter-city').value;
        currentFilters.price = document.getElementById('filter-price').value;
        
        // Build query
        let query = supabaseClient
            .from('businesses')
            .select(`
                *,
                categories(name, slug),
                users(full_name)
            `)
            .eq('is_published', true);
        
        // Apply filters
        if (currentFilters.query) {
            query = query.or(`name.ilike.%${currentFilters.query}%,description.ilike.%${currentFilters.query}%`);
        }
        
        if (currentFilters.city) {
            query = query.eq('city', currentFilters.city);
        }
        
        if (currentFilters.price) {
            query = query.eq('price_range', currentFilters.price);
        }
        
        if (currentFilters.category) {
            const { data: category } = await supabaseClient
                .from('categories')
                .select('id')
                .eq('slug', currentFilters.category)
                .single();
            
            if (category) {
                query = query.eq('category_id', category.id);
            }
        }
        
        // Order by featured first, then by created date
        query = query.order('is_featured', { ascending: false })
                     .order('created_at', { ascending: false });
        
        const { data: businesses, error } = await query;
        
        if (error) throw error;
        
        // Update results title
        let titleText = 'Search Results';
        if (currentFilters.query) {
            titleText = `Results for "${currentFilters.query}"`;
        } else if (currentFilters.category) {
            titleText = `${currentFilters.category.charAt(0).toUpperCase() + currentFilters.category.slice(1)} Businesses`;
        } else if (currentFilters.city) {
            titleText = `Businesses in ${currentFilters.city}`;
        }
        resultsTitle.textContent = titleText;
        
        // Update results count
        resultsCount.textContent = `${businesses.length} result${businesses.length !== 1 ? 's' : ''} found`;
        
        // Display results
        if (businesses.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <h3>No results found</h3>
                    <p>Try adjusting your search filters</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = businesses.map(business => createProfileCard(business)).join('');
        
    } catch (error) {
        console.error('Search error:', error);
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <p>Failed to load search results</p>
            </div>
        `;
    }
}

// Create profile card (reuse from homepage)
function createProfileCard(business) {
    const categoryName = business.categories?.name || 'Other';
    const bannerUrl = business.banner_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop';
    const logoUrl = business.logo_url || 'https://via.placeholder.com/60';
    const isFeatured = business.is_featured;
    
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

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}