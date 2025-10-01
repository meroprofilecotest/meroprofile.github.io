// Create Profile JavaScript

let galleryFiles = [];

// Initialize page
async function initCreateProfile() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        showAlert('Please login to create a profile', 'warning');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return;
    }
    
    // Populate dropdowns
    populateDropdowns();
}

// Populate category and city dropdowns
function populateDropdowns() {
    // Business category
    const businessCategory = document.getElementById('business-category');
    if (businessCategory) {
        CATEGORIES.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase();
            option.textContent = category;
            businessCategory.appendChild(option);
        });
    }
    
    // Business city
    const businessCity = document.getElementById('business-city');
    if (businessCity) {
        CITIES.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            businessCity.appendChild(option);
        });
    }
    
    // Professional city
    const professionalCity = document.getElementById('professional-city');
    if (professionalCity) {
        CITIES.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            professionalCity.appendChild(option);
        });
    }
}

// Select profile type
function selectProfileType(type) {
    document.getElementById('profile-type-selection').classList.add('hidden');
    
    if (type === 'business') {
        document.getElementById('business-form-container').classList.remove('hidden');
    } else if (type === 'professional') {
        document.getElementById('professional-form-container').classList.remove('hidden');
    }
}

// Back to selection
function backToSelection() {
    document.getElementById('profile-type-selection').classList.remove('hidden');
    document.getElementById('business-form-container').classList.add('hidden');
    document.getElementById('professional-form-container').classList.add('hidden');
    
    // Reset forms
    document.getElementById('business-form')?.reset();
    document.getElementById('professional-form')?.reset();
    galleryFiles = [];
}

// Preview banner
function previewBanner(input) {
    const preview = document.getElementById('banner-preview');
    if (input.files && input.files[0]) {
        if (!isValidImage(input.files[0])) {
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Banner Preview">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Preview logo
function previewLogo(input) {
    const preview = document.getElementById('logo-preview');
    if (input.files && input.files[0]) {
        if (!isValidImage(input.files[0])) {
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Logo Preview" style="max-width: 200px;">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Preview gallery
function previewGallery(input) {
    const preview = document.getElementById('gallery-preview');
    
    if (input.files && input.files.length > 0) {
        // Validate all files
        for (let file of input.files) {
            if (!isValidImage(file)) {
                input.value = '';
                return;
            }
        }
        
        // Limit to 10 images
        if (input.files.length > 10) {
            showAlert('Maximum 10 images allowed', 'warning');
            input.value = '';
            return;
        }
        
        galleryFiles = Array.from(input.files);
        preview.innerHTML = '';
        
        galleryFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'gallery-preview-item';
                div.innerHTML = `
                    <img src="${e.target.result}" alt="Gallery ${index + 1}">
                    <button type="button" class="remove-btn" onclick="removeGalleryImage(${index})">×</button>
                `;
                preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Remove gallery image
function removeGalleryImage(index) {
    galleryFiles.splice(index, 1);
    const input = document.getElementById('business-gallery');
    
    // Update file input
    const dt = new DataTransfer();
    galleryFiles.forEach(file => dt.items.add(file));
    input.files = dt.files;
    
    // Re-render preview
    previewGallery(input);
}

// Preview professional photo
function previewProfessionalPhoto(input) {
    const preview = document.getElementById('professional-photo-preview');
    if (input.files && input.files[0]) {
        if (!isValidImage(input.files[0])) {
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Photo Preview" style="max-width: 300px; border-radius: 50%;">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Add service
function addService() {
    const container = document.getElementById('services-container');
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    serviceItem.innerHTML = `
        <div class="form-row">
            <div class="form-group" style="flex: 2;">
                <input type="text" class="form-control" placeholder="Service Name" name="service-name[]">
            </div>
            <div class="form-group" style="flex: 1;">
                <input type="text" class="form-control" placeholder="Price" name="service-price[]">
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeService(this)">Remove</button>
        </div>
    `;
    container.appendChild(serviceItem);
}

// Remove service
function removeService(button) {
    button.closest('.service-item').remove();
}

// Get current location
async function getCurrentLocation() {
    try {
        showLoading();
        const location = await getUserLocation();
        
        document.getElementById('business-latitude').value = location.latitude.toFixed(6);
        document.getElementById('business-longitude').value = location.longitude.toFixed(6);
        
        hideLoading();
        showAlert('Location captured successfully!', 'success');
    } catch (error) {
        hideLoading();
        showAlert('Failed to get location. Please enter manually.', 'danger');
    }
}

// Handle business form submit
async function handleBusinessSubmit(event) {
    event.preventDefault();
    
    if (!isAuthenticated()) {
        showAlert('Please login to continue', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        const user = getCurrentUser();
        
        // Get form values
        const name = document.getElementById('business-name').value;
        const categorySlug = document.getElementById('business-category').value;
        const description = document.getElementById('business-description').value;
        const priceRange = document.getElementById('business-price-range').value;
        const address = document.getElementById('business-address').value;
        const city = document.getElementById('business-city').value;
        const latitude = document.getElementById('business-latitude').value;
        const longitude = document.getElementById('business-longitude').value;
        const phone = document.getElementById('business-phone').value;
        const email = document.getElementById('business-email').value;
        const website = document.getElementById('business-website').value;
        const facebook = document.getElementById('business-facebook').value;
        const instagram = document.getElementById('business-instagram').value;
        const whatsapp = document.getElementById('business-whatsapp').value;
        const tags = document.getElementById('business-tags').value;
        
        // Upload banner
        const bannerFile = document.getElementById('business-banner').files[0];
        if (!bannerFile) {
            hideLoading();
            showAlert('Please upload a banner image', 'warning');
            return;
        }
        const bannerResult = await uploadImage(bannerFile, 'banners');
        if (!bannerResult.success) {
            throw new Error('Failed to upload banner');
        }
        
        // Upload logo
        const logoFile = document.getElementById('business-logo').files[0];
        if (!logoFile) {
            hideLoading();
            showAlert('Please upload a logo', 'warning');
            return;
        }
        const logoResult = await uploadImage(logoFile, 'logos');
        if (!logoResult.success) {
            throw new Error('Failed to upload logo');
        }
        
        // Get category ID
        const { data: categories } = await supabaseClient
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();
        
        // Create business
        const slug = generateSlug(name);
        const { data: business, error: businessError } = await supabaseClient
            .from('businesses')
            .insert({
                user_id: user.id,
                name: sanitizeHTML(name),
                slug: slug,
                category_id: categories?.id,
                description: sanitizeHTML(description),
                banner_url: bannerResult.url,
                logo_url: logoResult.url,
                price_range: priceRange,
                address: sanitizeHTML(address),
                city: city,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                phone: phone,
                email: email,
                website: website,
                facebook: facebook,
                instagram: instagram,
                whatsapp: whatsapp
            })
            .select()
            .single();
        
        if (businessError) throw businessError;
        
        // Upload gallery images
        if (galleryFiles.length > 0) {
            for (let i = 0; i < galleryFiles.length; i++) {
                const result = await uploadImage(galleryFiles[i], 'gallery');
                if (result.success) {
                    await supabaseClient.from('images').insert({
                        business_id: business.id,
                        url: result.url,
                        display_order: i
                    });
                }
            }
        }
        
        // Add services
        const serviceNames = document.querySelectorAll('input[name="service-name[]"]');
        const servicePrices = document.querySelectorAll('input[name="service-price[]"]');
        
        for (let i = 0; i < serviceNames.length; i++) {
            if (serviceNames[i].value.trim()) {
                await supabaseClient.from('services').insert({
                    business_id: business.id,
                    name: sanitizeHTML(serviceNames[i].value),
                    price: servicePrices[i].value
                });
            }
        }
        
        // Add tags
        if (tags.trim()) {
            const tagList = tags.split(',').map(t => t.trim()).filter(t => t);
            for (const tagName of tagList) {
                const tagSlug = generateSlug(tagName);
                
                // Get or create tag
                let { data: tag } = await supabaseClient
                    .from('tags')
                    .select('id')
                    .eq('slug', tagSlug)
                    .single();
                
                if (!tag) {
                    const { data: newTag } = await supabaseClient
                        .from('tags')
                        .insert({ name: tagName, slug: tagSlug })
                        .select()
                        .single();
                    tag = newTag;
                }
                
                if (tag) {
                    await supabaseClient.from('business_tags').insert({
                        business_id: business.id,
                        tag_id: tag.id
                    });
                }
            }
        }
        
        hideLoading();
        showAlert('Business profile created successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = `/pages/profile.html?id=${business.id}`;
        }, 2000);
        
    } catch (error) {
        hideLoading();
        console.error('Error creating business:', error);
        showAlert(error.message || 'Failed to create business profile', 'danger');
    }
}

// Handle professional form submit
async function handleProfessionalSubmit(event) {
    event.preventDefault();
    
    if (!isAuthenticated()) {
        showAlert('Please login to continue', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        const user = getCurrentUser();
        
        // Get form values
        const name = document.getElementById('professional-name').value;
        const category = document.getElementById('professional-category').value;
        const specialization = document.getElementById('professional-specialization').value;
        const description = document.getElementById('professional-description').value;
        const qualification = document.getElementById('professional-qualification').value;
        const experience = document.getElementById('professional-experience').value;
        const clinicName = document.getElementById('professional-clinic-name').value;
        const address = document.getElementById('professional-address').value;
        const city = document.getElementById('professional-city').value;
        const fee = document.getElementById('professional-fee').value;
        const phone = document.getElementById('professional-phone').value;
        const email = document.getElementById('professional-email').value;
        
        // Upload photo
        const photoFile = document.getElementById('professional-photo').files[0];
        if (!photoFile) {
            hideLoading();
            showAlert('Please upload a photo', 'warning');
            return;
        }
        const photoResult = await uploadImage(photoFile, 'professionals');
        if (!photoResult.success) {
            throw new Error('Failed to upload photo');
        }
        
        // Get category ID
        const { data: categories } = await supabaseClient
            .from('categories')
            .select('id')
            .eq('slug', 'doctor')
            .single();
        
        // Create professional profile
        const slug = generateSlug(name);
        const { data: professional, error: professionalError } = await supabaseClient
            .from('professionals')
            .insert({
                user_id: user.id,
                name: sanitizeHTML(name),
                slug: slug,
                category_id: categories?.id,
                specialization: sanitizeHTML(specialization),
                description: sanitizeHTML(description),
                photo_url: photoResult.url,
                qualification: qualification,
                experience_years: experience ? parseInt(experience) : null,
                clinic_name: sanitizeHTML(clinicName),
                clinic_address: sanitizeHTML(address),
                city: city,
                consultation_fee: fee,
                phone: phone,
                email: email
            })
            .select()
            .single();
        
        if (professionalError) throw professionalError;
        
        hideLoading();
        showAlert('Professional profile created successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = `/pages/profile.html?type=professional&id=${professional.id}`;
        }, 2000);
        
    } catch (error) {
        hideLoading();
        console.error('Error creating professional profile:', error);
        showAlert(error.message || 'Failed to create professional profile', 'danger');
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCreateProfile);
} else {
    initCreateProfile();
}