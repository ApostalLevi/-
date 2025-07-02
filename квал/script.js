document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const categorySelect = document.getElementById('category');
    const searchInput = document.getElementById('search');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const sortRatingBtn = document.getElementById('sort-rating');
    const sortDirection = document.getElementById('sort-direction');
    const totalCountSpan = document.getElementById('total-count');
    const avgRatingSpan = document.getElementById('avg-rating');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    
    const images = [
        {"id": 1, "title": "Закат на море", "category": "Природа", "rating": 4.5, "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"},
        {"id": 2, "title": "Современный мост", "category": "Города", "rating": 4.2, "url": "https://images.unsplash.com/photo-1496564203457-11bb12075d90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"},
        {"id": 3, "title": "Горный пейзаж", "category": "Природа", "rating": 4.8, "url": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"},
        {"id": 4, "title": "Океанские волны", "category": "Природа", "rating": 4.3, "url": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"},
        {"id": 5, "title": "Лесная тропа", "category": "Природа", "rating": 4.1, "url": "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"},
        {"id": 6, "title": "Небоскребы", "category": "Города", "rating": 4.6, "url": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"},
        {"id": 7, "title": "Городской парк", "category": "Города", "rating": 4.9, "url": "https://plus.unsplash.com/premium_photo-1697778135834-7104fdb80e7e?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"id": 8, "title": "Водопад", "category": "Природа", "rating": 3.9, "url": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"}
    ];
    
    let filteredImages = [...images];
    let categories = [];
    let sortAscending = false;
    
    init();
    
    function init() {
        extractCategories();
        updateCategorySelect();
        renderGallery();
        updateStats();
        setupEventListeners();
    }
    
    function extractCategories() {
        const uniqueCategories = new Set();
        images.forEach(image => {
            if (image.category && image.category.trim() !== '') {
                uniqueCategories.add(image.category);
            }
        });
        categories = Array.from(uniqueCategories).sort();
    }
    
    function updateCategorySelect() {
        categorySelect.innerHTML = '<option value="">Все категории</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
    
    function setupEventListeners() {
        applyFiltersBtn.addEventListener('click', applyFilters);
        sortRatingBtn.addEventListener('click', toggleSort);
        closeModal.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        searchInput.addEventListener('input', function() {
            if (this.value.length === 0 || this.value.length > 2) {
                applyFilters();
            }
        });
    }
    
    function applyFilters() {
        const categoryFilter = categorySelect.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        filteredImages = images.filter(image => {
            const matchesCategory = !categoryFilter || image.category === categoryFilter;
            const matchesSearch = !searchTerm || 
                image.title.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        sortImages();
        renderGallery();
        updateStats();
    }
    
    function toggleSort() {
        sortAscending = !sortAscending;
        sortDirection.textContent = sortAscending ? '↑' : '↓';
        sortImages();
        renderGallery();
    }
    
    function sortImages() {
        filteredImages.sort((a, b) => {
            return sortAscending ? a.rating - b.rating : b.rating - a.rating;
        });
    }
    
    function renderGallery() {
        gallery.innerHTML = '';
        
        if (filteredImages.length === 0) {
            gallery.innerHTML = '<div class="no-results">Изображения не найдены. Попробуйте изменить параметры фильтрации.</div>';
            return;
        }
        
        filteredImages.forEach(image => {
            const card = createImageCard(image);
            gallery.appendChild(card);
        });
    }
    
    function createImageCard(image) {
        const card = document.createElement('div');
        card.className = 'image-card';
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        
        const info = document.createElement('div');
        info.className = 'image-info';
        
        const title = document.createElement('div');
        title.className = 'image-title';
        title.textContent = image.title;
        
        const rating = document.createElement('div');
        rating.className = 'image-rating';
        rating.textContent = formatRating(image.rating);
        
        info.appendChild(title);
        info.appendChild(rating);
        card.appendChild(img);
        card.appendChild(info);
        
        card.addEventListener('click', () => showModal(image));
        return card;
    }
    
    function formatRating(rating) {
        return '★' + rating.toFixed(1);
    }
    
    function showModal(image) {
        document.getElementById('modal-title').textContent = image.title;
        document.getElementById('modal-image').src = image.url;
        document.getElementById('modal-image').alt = image.title;
        document.getElementById('modal-category').textContent = image.category;
        document.getElementById('modal-rating').textContent = formatRating(image.rating);
        document.getElementById('modal-url').href = image.url;
        document.getElementById('modal-url').textContent = image.url;
        modal.style.display = 'block';
    }
    
    function updateStats() {
        totalCountSpan.textContent = filteredImages.length;
        
        if (filteredImages.length > 0) {
            const totalRating = filteredImages.reduce((sum, image) => sum + image.rating, 0);
            const averageRating = totalRating / filteredImages.length;
            avgRatingSpan.textContent = averageRating.toFixed(1);
        } else {
            avgRatingSpan.textContent = '0';
        }
    }
});