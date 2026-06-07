// ==========================================
// 🚀 TELEGRAM WEB APP INITIALIZATION
// ==========================================
console.log('🚀 Script.js chargé - Début de l\'exécution');
let tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();

  if (tg.enableClosingConfirmation) {
    tg.enableClosingConfirmation();
  }

  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#1a1a2e');
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
  document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#aaaaaa');

  console.log('✅ Telegram WebApp initialisé');
}

// ==========================================
// ⭐ SYSTÈME D'AVIS CLIENTS
// ==========================================
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// Rendre les fonctions accessibles globalement immédiatement
window.openGeneralReviewModal = function() {
  const modal = document.getElementById('general-review-modal');
  if (modal) {
    modal.classList.add('active');
    
    // Reset form
    document.getElementById('general-review-form').reset();
    document.querySelectorAll('#general-star-rating-input .star').forEach(star => {
      star.classList.remove('filled');
    });
    generalCurrentRating = 0;
  }
};

window.closeGeneralReviewModal = function() {
  const modal = document.getElementById('general-review-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.setGeneralRating = function(rating) {
  generalCurrentRating = rating;
  document.querySelectorAll('#general-star-rating-input .star').forEach((star, index) => {
    if (index < rating) {
      star.classList.add('filled');
    } else {
      star.classList.remove('filled');
    }
  });
};

console.log('✅ Fonctions d\'avis globales définies');

function addReview(productId, rating, text) {
  const review = {
    id: Date.now(),
    productId: productId,
    rating: rating,
    text: text,
    author: 'Client',
    date: new Date().toISOString(),
    likes: 0
  };
  
  reviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  
  return review;
}

function getProductReviews(productId) {
  return reviews.filter(r => r.productId === productId);
}

function getProductRating(productId) {
  const productReviews = getProductReviews(productId);
  if (productReviews.length === 0) return { average: 0, count: 0 };
  
  const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
  const average = (sum / productReviews.length).toFixed(1);
  
  return { average, count: productReviews.length };
}

function likeReview(reviewId) {
  const review = reviews.find(r => r.id === reviewId);
  if (review) {
    review.likes++;
    localStorage.setItem('reviews', JSON.stringify(reviews));
    updateReviewLikes(reviewId);
  }
}

function updateReviewLikes(reviewId) {
  const likeBtn = document.querySelector(`[data-review-id="${reviewId}"].review-action`);
  if (likeBtn) {
    likeBtn.classList.add('liked');
    likeBtn.innerHTML = `❤️ ${reviews.find(r => r.id === reviewId)?.likes || 0}`;
  }
}

function renderStars(rating, interactive = false, productId = null) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    const className = i <= rating ? 'star filled' : 'star';
    const onClick = interactive ? `onclick="setRating(${i})"` : '';
    stars += `<span class="${className}" ${onClick}>⭐</span>`;
  }
  return stars;
}

function renderReviews(productId) {
  const productReviews = getProductReviews(productId);
  const container = document.getElementById('reviews-container');
  
  if (!container) return;
  
  if (productReviews.length === 0) {
    container.innerHTML = '<p style="color: var(--tg-theme-hint-color); text-align: center; padding: 20px;">Aucun avis pour ce produit. Soyez le premier à laisser un avis !</p>';
    return;
  }
  
  container.innerHTML = productReviews.map(review => {
    const date = new Date(review.date).toLocaleDateString('fr-FR');
    return `
    <div class="review-item">
      <div class="review-header">
        <div class="review-author">
          <div class="review-avatar">${review.author.charAt(0)}</div>
          <span>${review.author}</span>
        </div>
        <span class="review-date">${date}</span>
      </div>
      <div class="review-rating">
        ${renderStars(review.rating)}
      </div>
      <p class="review-text">${review.text}</p>
      <div class="review-actions">
        <button class="review-action" data-review-id="${review.id}" onclick="likeReview(${review.id})">
          ❤️ ${review.likes}
        </button>
      </div>
    </div>
  `;
  }).join('');
}

function openReviewModal(productId) {
  const modal = document.getElementById('review-modal');
  const productIdInput = document.getElementById('review-product-id');
  
  if (modal && productIdInput) {
    productIdInput.value = productId;
    modal.classList.add('active');
    
    // Reset form
    document.getElementById('review-form').reset();
    document.querySelectorAll('#star-rating-input .star').forEach(star => {
      star.classList.remove('filled');
    });
    currentRating = 0;
  }
}

function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

let currentRating = 0;
let generalCurrentRating = 0;

function setRating(rating) {
  currentRating = rating;
  document.querySelectorAll('#star-rating-input .star').forEach((star, index) => {
    if (index < rating) {
      star.classList.add('filled');
    } else {
      star.classList.remove('filled');
    }
  });
}

function setGeneralRating(rating) {
  generalCurrentRating = rating;
  document.querySelectorAll('#general-star-rating-input .star').forEach((star, index) => {
    if (index < rating) {
      star.classList.add('filled');
    } else {
      star.classList.remove('filled');
    }
  });
}

// Rendre la fonction accessible globalement
window.setGeneralRating = setGeneralRating;
console.log('✅ setGeneralRating attachée à window');

function openGeneralReviewModal() {
  const modal = document.getElementById('general-review-modal');
  if (modal) {
    modal.classList.add('active');
    
    // Reset form
    document.getElementById('general-review-form').reset();
    document.querySelectorAll('#general-star-rating-input .star').forEach(star => {
      star.classList.remove('filled');
    });
    generalCurrentRating = 0;
  }
}

// Rendre la fonction accessible globalement
window.openGeneralReviewModal = openGeneralReviewModal;
console.log('✅ openGeneralReviewModal attachée à window');

function closeGeneralReviewModal() {
  const modal = document.getElementById('general-review-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Rendre la fonction accessible globalement
window.closeGeneralReviewModal = closeGeneralReviewModal;

function setupGeneralReviewForm() {
  const form = document.getElementById('general-review-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = document.getElementById('general-review-text').value.trim();
    
    if (generalCurrentRating === 0) {
      showCustomAlert('⚠️ Note requise', 'Veuillez sélectionner une note de 1 à 5 étoiles.', 'warning');
      return;
    }
    
    if (!text) {
      showCustomAlert('⚠️ Avis requis', 'Veuillez écrire votre avis.', 'warning');
      return;
    }
    
    // Ajouter un avis général (productId = 0 pour avis général)
    const review = {
      id: Date.now(),
      productId: 0, // 0 = avis général
      rating: generalCurrentRating,
      text: text,
      author: 'Client',
      date: new Date().toISOString(),
      likes: 0,
      isGeneral: true
    };
    
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    closeGeneralReviewModal();
    showCustomAlert('✅ Avis publié', 'Merci pour votre avis !', 'success');
    
    // Rafraîchir tous les avis
    displayAllReviews();
  });
  
  // Setup star rating input
  document.querySelectorAll('#general-star-rating-input .star').forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      setGeneralRating(rating);
    });
  });
}

function setupReviewForm() {
  const form = document.getElementById('review-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('review-product-id').value);
    const text = document.getElementById('review-text').value.trim();
    
    if (currentRating === 0) {
      showCustomAlert('⚠️ Note requise', 'Veuillez sélectionner une note de 1 à 5 étoiles.', 'warning');
      return;
    }
    
    if (!text) {
      showCustomAlert('⚠️ Avis requis', 'Veuillez écrire votre avis.', 'warning');
      return;
    }
    
    addReview(productId, currentRating, text);
    closeReviewModal();
    showCustomAlert('✅ Avis publié', 'Merci pour votre avis !', 'success');
    
    // Rafraîchir les avis si le modal produit est ouvert
    renderReviews(productId);
    updateProductRatingDisplay(productId);
    
    // Rafraîchir tous les avis
    displayAllReviews();
  });
  
  // Setup star rating input
  document.querySelectorAll('#star-rating-input .star').forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      setRating(rating);
    });
  });
}

function updateProductRatingDisplay(productId) {
  const rating = getProductRating(productId);
  const ratingDisplay = document.getElementById(`product-rating-${productId}`);
  
  if (ratingDisplay && rating.count > 0) {
    ratingDisplay.innerHTML = `
      <div class="card-rating-stars">${renderStars(Math.round(rating.average))}</div>
      <span class="card-rating-value">${rating.average}</span>
      <span class="card-rating-count">(${rating.count})</span>
    `;
  }
}

function displayAllReviews() {
  const container = document.getElementById('all-reviews-container');
  const emptyState = document.getElementById('all-reviews-empty');
  
  if (!container) return;
  
  if (reviews.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    
    // Trier par date (plus récent en premier)
    const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedReviews.map(review => {
      const product = customProducts.find(p => p.id === review.productId);
      const productName = product ? product.name : (review.isGeneral ? 'Avis général' : 'Produit inconnu');
      const date = new Date(review.date).toLocaleDateString('fr-FR');
      
      return `
      <div class="review-item fade-in">
        <div class="review-header">
          <div class="review-author">
            <div class="review-avatar">${review.author.charAt(0)}</div>
            <span>${review.author}</span>
          </div>
          <span class="review-date">${date}</span>
        </div>
        <div class="review-rating">
          ${renderStars(review.rating)}
        </div>
        <p class="review-text">${review.text}</p>
        <div style="margin-top: 8px; padding: 8px 12px; background: rgba(255, 59, 48, 0.1); border-radius: 8px;">
          <span style="font-size: 0.8rem; color: var(--tg-theme-hint-color);">${review.isGeneral ? 'Type: ' : 'Produit: '}</span>
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--tg-theme-text-color);">${productName}</span>
        </div>
        <div class="review-actions">
          <button class="review-action" data-review-id="${review.id}" onclick="likeReview(${review.id})">
            ❤️ ${review.likes}
          </button>
        </div>
      </div>
    `;
    }).join('');
  }
  
  // Mettre à jour les statistiques
  updateReviewStats();
}

function updateReviewStats() {
  const totalCount = document.getElementById('total-reviews-count');
  const averageRating = document.getElementById('average-rating');
  const fiveStarCount = document.getElementById('five-star-count');
  
  if (totalCount) totalCount.textContent = reviews.length;
  
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / reviews.length).toFixed(1);
    if (averageRating) averageRating.textContent = avg;
    
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    if (fiveStarCount) fiveStarCount.textContent = fiveStars;
  } else {
    if (averageRating) averageRating.textContent = '0';
    if (fiveStarCount) fiveStarCount.textContent = '0';
  }
}

// ==========================================
// 📦 PRODUITS - UNIQUMENT PERSONNALISÉS
// ==========================================
const products = [];  // Plus de produits par défaut, uniquement les produits personnalisés

// ==========================================
// ❤️ SYSTÈME DE FAVORIS
// ==========================================
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(productId) {
  const index = favorites.indexOf(productId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(productId);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesCount();
  updateLikeButtons();
  displayFavorites();
  
  // Haptic feedback
  if (tg?.HapticFeedback) {
    try {
      tg.HapticFeedback.impactOccurred('light');
    } catch (e) {}
  }
}

function isFavorite(productId) {
  return favorites.includes(productId);
}

function updateFavoritesCount() {
  const countBadge = document.getElementById('favorites-count');
  if (countBadge) {
    countBadge.textContent = favorites.length;
    if (favorites.length > 0) {
      countBadge.classList.remove('hidden');
    } else {
      countBadge.classList.add('hidden');
    }
  }
}

function updateLikeButtons() {
  document.querySelectorAll('.like-button').forEach(btn => {
    const productId = parseInt(btn.dataset.productId);
    if (isFavorite(productId)) {
      btn.classList.add('liked');
    } else {
      btn.classList.remove('liked');
    }
  });
}

function displayFavorites() {
  const container = document.getElementById('favorites-container');
  const emptyState = document.getElementById('favorites-empty');
  
  if (!container) return;
  
  const favoriteProducts = customProducts.filter(p => favorites.includes(p.id));
  
  if (favoriteProducts.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    
    container.innerHTML = favoriteProducts.map(p => {
      const imageUrl = p.image.startsWith('data:') ? p.image : p.image;
      const mediaElement = p.mediaType === 'video' ? 
        `<video src="${imageUrl}" autoplay muted loop playsinline style="width: 100%; height: 180px; object-fit: cover; border-radius: 16px;"></video>` :
        `<img src="${imageUrl}" alt="${p.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 16px;" onerror="this.src='bg.jpg'" loading="lazy">`;
      
      return `
      <div class="card fade-in" onclick="showProduct(${p.id})">
        <button class="like-button liked" onclick="event.stopPropagation(); toggleFavorite(${p.id})" data-product-id="${p.id}"></button>
        ${mediaElement}
        <h2>${p.name}</h2>
        <div class="card-info">
          <span class="card-price">${p.price}</span>
          <span class="card-puffs">${p.puffs}</span>
        </div>
      </div>
    `;
    }).join('');
    
    // Démarrer les vidéos
    container.querySelectorAll('video').forEach(video => {
      video.play().catch(() => {});
    });
  }
}

// ==========================================
// � BARRE DE RECHERCHE
// ==========================================
function setupSearch() {
  const searchBar = document.getElementById('search-bar');
  const searchClear = document.getElementById('search-clear');
  
  if (!searchBar) return;
  
  searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    filterProducts(query);
  });
  
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchBar.value = '';
      filterProducts('');
      searchBar.focus();
    });
  }
}

function filterProducts(query) {
  const cards = document.querySelectorAll('.card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
    const price = card.querySelector('.card-price')?.textContent.toLowerCase() || '';
    const puffs = card.querySelector('.card-puffs')?.textContent.toLowerCase() || '';
    
    const matches = title.includes(query) || price.includes(query) || puffs.includes(query);
    
    if (matches || query === '') {
      card.classList.remove('hidden');
      card.classList.add('fade-in');
      visibleCount++;
    } else {
      card.classList.add('hidden');
      card.classList.remove('fade-in');
    }
  });
  
  // Afficher message "aucun résultat" si nécessaire
  showNoResults(visibleCount === 0 && query !== '');
}

function showNoResults(show) {
  let noResults = document.querySelector('.no-results');
  const container = document.getElementById('products-container');
  
  if (show) {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <div class="no-results-icon">🔍</div>
        <h3>Aucun résultat</h3>
        <p>Aucun produit ne correspond à votre recherche</p>
      `;
      container.appendChild(noResults);
    }
    noResults.style.display = 'block';
  } else {
    if (noResults) {
      noResults.style.display = 'none';
    }
  }
}

// ==========================================
// � AFFICHER LES PRODUITS - UNIQUMENT PERSONNALISÉS
// ==========================================
function displayProducts(filter = 'all') {
  const container = document.getElementById('products-container');

  // Uniquement les produits personnalisés
  const allProducts = [...customProducts];

  const filtered = filter === 'all' 
    ? allProducts 
    : allProducts.filter(p => {
        if (filter === 'douce') {
          return p.category === 'douce' || p.name.toLowerCase().includes('douce');
        }
        if (filter === 'dur') {
          return p.category === 'dur' || p.name.toLowerCase().includes('dur');
        }
        if (filter === 'custom') {
          return p.custom;
        }
        return true;
      });

  if (filtered.length === 0) {
    if (filter === 'all') {
      container.innerHTML = '<div class="loading">Aucun produit. Ajoutez-en depuis le panel admin !</div>';
    } else {
      container.innerHTML = '<div class="loading">Aucun produit dans cette catégorie.</div>';
    }
    return;
  }

  container.innerHTML = filtered.map(p => {
    const imageUrl = p.image.startsWith('data:') ? p.image : p.image;
    const mediaElement = p.mediaType === 'video' ? 
      `<video src="${imageUrl}" autoplay muted loop playsinline style="width: 100%; height: 200px; object-fit: cover;" data-lazy="true"></video>` :
      `<img src="${imageUrl}" alt="${p.name}" onerror="this.src='bg.jpg'" loading="lazy">`;
    
    // Badge de catégorie pour les produits personnalisés
    const categoryBadge = p.custom ? 
      (p.category === 'douce' ? '<div class="category-badge douce">###</div>' :
       p.category === 'dur' ? '<div class="category-badge dur">###</div>' :
       '<div class="category-badge custom">###</div>') : '';
    
    const isLiked = isFavorite(p.id) ? 'liked' : '';
    const rating = getProductRating(p.id);
    
    console.log(`Carte générée - ID: ${p.id}, Nom: ${p.name}`);
    
    return `
    <div class="card fade-in" onclick="showProduct(${p.id})">
      <button class="like-button ${isLiked}" onclick="event.stopPropagation(); toggleFavorite(${p.id})" data-product-id="${p.id}"></button>
      ${mediaElement}
      ${categoryBadge}
      <h2>${p.name}</h2>
      <div class="card-info">
        <span class="card-price">${p.price}</span>
        <span class="card-puffs">${p.puffs}</span>
      </div>
      ${rating.count > 0 ? `<div class="card-rating" id="product-rating-${p.id}">
        <div class="card-rating-stars">${renderStars(Math.round(rating.average))}</div>
        <span class="card-rating-value">${rating.average}</span>
        <span class="card-rating-count">(${rating.count})</span>
      </div>` : ''}
      ${p.custom ? '<div class="custom-badge">###</div>' : ''}
    </div>
  `;
  }).join('');
  
  // Optimisation : Démarrer les vidéos uniquement quand elles sont visibles
  setTimeout(() => {
    const videos = container.querySelectorAll('video[data-lazy="true"]');
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.play().catch(() => {});
          video.removeAttribute('data-lazy');
          videoObserver.unobserve(video);
        }
      });
    }, { threshold: 0.1 });
    
    videos.forEach(video => videoObserver.observe(video));
  }, 100);
  
  // Mettre à jour les boutons like
  updateLikeButtons();
}

// ==========================================
// 🎯 AFFICHER DÉTAILS PRODUIT (MODAL) - PRODUITS PERSONNALISÉS
// ==========================================
function showProduct(id) {
  console.log(`Clique sur la carte - ID demandé: ${id}`);
  console.log(`Produits disponibles:`, customProducts.map(p => ({id: p.id, name: p.name})));
  
  if (tg?.HapticFeedback) {
    try {
      tg.HapticFeedback.impactOccurred('medium');
    } catch (e) {}
  }

  // Chercher uniquement dans les produits personnalisés
  const product = customProducts.find(p => p.id === id);
  console.log(`Produit trouvé:`, product);
  if (!product) {
    console.error(`Produit avec ID ${id} non trouvé!`);
    return;
  }

  const imageUrl = product.image.startsWith('data:') ? product.image : product.image;
  const mediaElement = product.mediaType === 'video' ? 
    `<video src="${imageUrl}" autoplay muted loop controls preload="metadata" style="width: 100%; max-height: 300px; border-radius: 12px;"></video>` :
    `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 12px;" onerror="this.src='bg.jpg'" loading="lazy">`;

  const categoryText = product.category === 'douce' ? '💎 Douce' : 
                        product.category === 'dur' ? '👑 Dur' : '🆕 Personnalisée';

  const rating = getProductRating(id);

  const html = `
    ${mediaElement}
    <h2>${product.name}</h2>
    ${rating.count > 0 ? `<div class="rating-display">
      <div class="rating-stars">${renderStars(Math.round(rating.average))}</div>
      <span class="rating-number">${rating.average}</span>
      <span class="rating-count">(${rating.count} avis)</span>
    </div>` : ''}
    <div class="product-price-big">${product.price}</div>

    <div class="product-info-item">
      <strong>📦 Catégorie :</strong> ${categoryText}
    </div>
    <div class="product-info-item">
      <strong>📊 Quantité :</strong> ${product.puffs}
    </div>
    ${product.description ? `<div class="product-info-item"><strong>📝 Description :</strong><br>${product.description}</div>` : ''}
    <div class="product-info-item">
      <strong>🆕 Produit personnalisé</strong>
    </div>

    <div class="reviews-section">
      <div class="reviews-header">
        <h3>⭐ Avis clients</h3>
        <button class="add-review-btn" onclick="openReviewModal(${id})">✨ Écrire un avis</button>
      </div>
      <div id="reviews-container"></div>
    </div>

    <p style="margin-top: 25px; text-align: center; font-size: 1.1rem; color: #aaa;">
      💬 Contacte-moi sur <strong style="color: #667eea;">Snap : lebsecours5962</strong>
    </p>
  `;

  document.getElementById('modal-product-details').innerHTML = html;
  document.getElementById('product-modal').classList.add('active');
  
  // Render reviews
  renderReviews(id);
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('product-modal');
  if (e.target === modal) closeProductModal();
});

// ==========================================
// 🎵 GESTION MUSIQUE - DÉMARRAGE AUTO + CONTRÔLE
// ==========================================
let audioStarted = false;
let audioPlaying = false;

// Démarrer l'audio au premier clic sur la page
function startAudioOnFirstInteraction() {
  if (!audioStarted) {
    const audio = document.getElementById('intro-audio');
    if (audio) {
      audio.muted = false;
      audio.play().then(() => {
        console.log('🎵 Musique démarrée automatiquement !');
        audioStarted = true;
        audioPlaying = true;
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) soundBtn.textContent = '🔊';
      }).catch(err => {
        console.log('⏸️ Audio bloqué par le navigateur:', err);
      });
    }
  }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Démarrer audio au premier clic/touch sur la page
  document.body.addEventListener('click', startAudioOnFirstInteraction, { once: true });
  document.body.addEventListener('touchstart', startAudioOnFirstInteraction, { once: true });
  
  // Initialiser le bouton de contrôle
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêcher le déclenchement du premier clic
      
      const audio = document.getElementById('intro-audio');
      if (!audio) return;
      
      if (audioPlaying) {
        audio.pause();
        soundBtn.textContent = '🔇';
        audioPlaying = false;
        console.log('🔇 Musique mise en pause');
      } else {
        if (!audioStarted) {
          // Premier démarrage manuel si auto n'a pas marché
          audio.muted = false;
          audio.play().then(() => {
            audioStarted = true;
            audioPlaying = true;
          }).catch(() => {});
        } else {
          // Reactivation
          audio.play().catch(() => {});
          audioPlaying = true;
        }
        soundBtn.textContent = '🔊';
        console.log('🔊 Musique réactivée');
      }
    });
  }
});

// ==========================================
// � GESTION CLIC 3 FOIS SUR LOGO
// ==========================================
let logoClickCount = 0;
let logoClickTimer = null;

function setupLogoClickHandler() {
  const logo = document.getElementById('admin-logo-trigger');
  if (!logo) {
    console.log('❌ Logo non trouvé');
    return;
  }
  
  console.log('✅ Logo trouvé, setup du clic handler');
  
  logo.addEventListener('click', function() {
    console.log('🖱️ Logo cliqué, compteur:', logoClickCount + 1);
    
    // Annuler le timer précédent
    if (logoClickTimer) {
      clearTimeout(logoClickTimer);
    }
    
    logoClickCount++;
    
    // Réinitialiser après 2 secondes
    logoClickTimer = setTimeout(() => {
      console.log('⏰ Timer reset, compteur:', logoClickCount);
      logoClickCount = 0;
    }, 2000);
    
    // Si 3 clics, afficher le panel admin
    if (logoClickCount === 3) {
      console.log('🎯 3 clics détectés, affichage panel admin');
      logoClickCount = 0;
      showAdminPanel();
      
      // Feedback haptique si disponible
      if (tg?.HapticFeedback) {
        try {
          tg.HapticFeedback.notificationOccurred('success');
        } catch (e) {}
      }
    }
  });
}

function showAdminPanel() {
  const adminPanel = document.getElementById('tab-admin');
  if (adminPanel) {
    console.log('✅ Panel admin trouvé, affichage en cours');
    adminPanel.style.display = 'block';
    showAdminLogin();
  } else {
    console.log('❌ Panel admin non trouvé');
  }
}

function showAdminDashboard() {
  // Masquer tous les onglets
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Masquer la navigation
  document.querySelector('.bottom-nav').style.display = 'none';
  
  // Afficher uniquement le panel admin
  const adminPanel = document.getElementById('tab-admin');
  if (adminPanel) {
    adminPanel.style.display = 'block';
    adminPanel.classList.add('active');
    
    // Ajouter un bouton pour quitter l'admin
    if (!document.getElementById('exit-admin-btn')) {
      const exitBtn = document.createElement('button');
      exitBtn.id = 'exit-admin-btn';
      exitBtn.innerHTML = '🏠 Retour à la Mini App';
      exitBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
      `;
      exitBtn.onclick = exitAdminMode;
      document.body.appendChild(exitBtn);
    }
  }
  
  // Charger les produits admin
  loadAdminProducts();
  updateAdminStats();
  displayAdminReviews();
}

function exitAdminMode() {
  // Supprimer le bouton exit
  const exitBtn = document.getElementById('exit-admin-btn');
  if (exitBtn) exitBtn.remove();
  
  // Réafficher la navigation
  document.querySelector('.bottom-nav').style.display = 'flex';
  
  // Masquer le panel admin
  const adminPanel = document.getElementById('tab-admin');
  if (adminPanel) {
    adminPanel.style.display = 'none';
    adminPanel.classList.remove('active');
  }
  
  // Afficher l'onglet menu
  const menuTab = document.getElementById('tab-menu');
  if (menuTab) {
    menuTab.style.display = 'block';
    menuTab.classList.add('active');
  }
  
  // Réinitialiser l'authentification
  isAdminAuthenticated = false;
  
  showCustomAlert('🏠', 'Retour à la Mini App', 'info');
}

// ==========================================
// �🎛️ FILTRES CATÉGORIES
// ==========================================
function setupFilters() {
  const buttons = document.querySelectorAll('.cat');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('light'); } catch (e) {}
      }

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      displayProducts(cat);
    });
  });
}

// ==========================================
// 🧭 NAVIGATION TABS - CORRIGÉE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item[data-tab]');

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('light'); } catch (e) {}
      }

      navItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.remove('active');
        t.style.display = 'none';
        t.scrollTop = 0;
      });

      const target = document.getElementById(`tab-${tab}`);
      if (target) {
        target.classList.add('active');
        target.style.display = 'block';
      }
    });
  });
});

// ==========================================
// 🎬 SPLASH SCREEN AVEC BELLE ANIMATION
// ==========================================
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Durée totale : 3.5 secondes
  setTimeout(() => {
    // Ajouter la classe pour l'animation de disparition
    splash.classList.add('fade-out');

    // Supprimer complètement après l'animation
    setTimeout(() => {
      splash.remove();
      console.log('✨ Splash screen terminé !');
    }, 1000); // 1 seconde pour l'animation de fade-out

  }, 2500); // 2.5 secondes d'affichage
});

// ==========================================
// 🎨 CARTES D'ALERTES PERSONNALISÉES
// ==========================================
function showCustomAlert(title, message, type = 'info') {
  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.className = 'custom-alert-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;

  // Créer la carte d'alerte
  const alertCard = document.createElement('div');
  alertCard.className = 'custom-alert-card';
  alertCard.style.cssText = `
    background: var(--card-bg);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    max-width: 400px;
    width: 100%;
    padding: 30px 20px;
    text-align: center;
    animation: slideUp 0.4s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;

  // Définir les couleurs selon le type
  const colors = {
    success: { bg: 'linear-gradient(135deg, #4CAF50, #45a049)', icon: '✅' },
    warning: { bg: 'linear-gradient(135deg, #ff9800, #f57c00)', icon: '⚠️' },
    info: { bg: 'linear-gradient(135deg, #2196F3, #1976D2)', icon: 'ℹ️' },
    error: { bg: 'linear-gradient(135deg, #f44336, #d32f2f)', icon: '❌' }
  };

  const color = colors[type] || colors.info;

  alertCard.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 15px;">${color.icon}</div>
    <h2 style="color: var(--tg-theme-text-color); margin-bottom: 10px;">${title}</h2>
    <p style="color: var(--tg-theme-hint-color); margin-bottom: 25px; line-height: 1.4;">${message}</p>
    <button class="admin-btn" style="background: ${color.bg}; width: 100%;" onclick="this.closest('.custom-alert-overlay').remove()">
      OK
    </button>
  `;

  overlay.appendChild(alertCard);
  document.body.appendChild(overlay);

  // Fermer automatiquement après 3 secondes pour les messages de succès
  if (type === 'success') {
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 3000);
  }

  // Fermer au clic sur l'overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

function showCustomConfirm(title, message, onConfirm) {
  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.className = 'custom-confirm-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  `;

  // Créer la carte de confirmation
  const confirmCard = document.createElement('div');
  confirmCard.className = 'custom-confirm-card';
  confirmCard.style.cssText = `
    background: var(--card-bg);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    max-width: 400px;
    width: 100%;
    padding: 30px 20px;
    text-align: center;
    animation: slideUp 0.4s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;

  confirmCard.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 15px;">🗑️</div>
    <h2 style="color: var(--tg-theme-text-color); margin-bottom: 10px;">${title}</h2>
    <p style="color: var(--tg-theme-hint-color); margin-bottom: 25px; line-height: 1.4;">${message}</p>
    <div style="display: flex; gap: 15px;">
      <button class="admin-btn cancel-btn" style="flex: 1;" onclick="this.closest('.custom-confirm-overlay').remove()">
        Annuler
      </button>
      <button class="admin-btn" style="flex: 1; background: linear-gradient(135deg, #f44336, #d32f2f);" onclick="confirmAction()">
        Confirmer
      </button>
    </div>
  `;

  overlay.appendChild(confirmCard);
  document.body.appendChild(overlay);

  // Fonction de confirmation
  window.confirmAction = function() {
    overlay.remove();
    onConfirm();
  };

  // Fermer au clic sur l'overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// ==========================================
// 📦 FONCTIONS PRODUITS PERSONNALISÉS - API RAILWAY
// ==========================================
let customProducts = [];
let isAdminAuthenticated = false;
async function loadCustomProducts() {
  try {
    console.log('🔄 Chargement des produits depuis le serveur...');
    const response = await fetch('/api/products');
    const data = await response.json();
    
    if (data.success) {
      customProducts = data.products;
      console.log('✅ Produits chargés depuis le serveur:', customProducts.length);
      console.log('📦 Détails produits:', customProducts);
    } else {
      console.error('❌ Erreur chargement produits:', data.error);
      customProducts = [];
    }
  } catch (error) {
    console.error('❌ Erreur API:', error);
    customProducts = [];
  }
}

// Sauvegarder un produit sur le serveur
async function saveProductToServer(product) {
  try {
    console.log('💾 Envoi du produit au serveur:', product);
    
    // Si le média est en base64, l'uploader d'abord
    if (product.image && product.image.startsWith('data:')) {
      console.log('📤 Upload du média en cours...');
      
      // Convertir base64 en blob et uploader
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: createFormDataFromBase64(product.image, product.mediaType)
      });
      
      const uploadResult = await response.json();
      if (uploadResult.success) {
        // Remplacer l'image base64 par l'URL du fichier uploadé
        product.image = uploadResult.url;
        console.log('✅ Média uploadé:', uploadResult.url);
      } else {
        console.error('❌ Erreur upload média:', uploadResult.error);
      }
    }
    
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    
    const data = await response.json();
    console.log('📨 Réponse du serveur:', data);
    
    if (data.success) {
      console.log('✅ Produit sauvegardé avec succès:', data.product);
      return true;
    } else {
      console.error('❌ Erreur sauvegarde:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur API sauvegarde:', error);
    return false;
  }
}

// Créer FormData à partir de base64
function createFormDataFromBase64(base64Data, mediaType) {
  // Extraire les données base64
  const header = base64Data.split(',')[0];
  const data = base64Data.split(',')[1];
  
  // Convertir en blob
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  
  const mimeType = mediaType === 'video' ? 'video/mp4' : 'image/jpeg';
  const blob = new Blob([byteArray], { type: mimeType });
  
  // Créer FormData
  const formData = new FormData();
  const ext = mediaType === 'video' ? 'mp4' : 'jpg';
  const filename = `product_${Date.now()}.${ext}`;
  formData.append('file', blob, filename);
  
  return formData;
}

// Supprimer un produit via l'API
async function deleteProductFromServer(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Produit supprimé du serveur');
      return true;
    } else {
      console.error('❌ Erreur suppression:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur API:', error);
    return false;
  }
}

// Prévisualiser le média du nouveau produit
function previewProductMedia(event) {
  console.log('🖼️ Média sélectionné:', event.target.files[0]?.name);
  const file = event.target.files[0];
  const preview = document.getElementById('media-preview');
  
  if (file) {
    console.log('📁 Fichier détecté, taille:', file.size, 'type:', file.type);
    
    // Vérifier la taille du fichier (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      preview.innerHTML = '<p style="color: #ff4444;">❌ Fichier trop volumineux (max 50MB)</p>';
      currentProductMedia = null;
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      console.log('✅ Fichier lu en base64, longueur:', e.target.result.length);
      const fileType = file.type.split('/')[0]; // 'image' ou 'video'
      
      if (fileType === 'image') {
        preview.innerHTML = `
          <div style="position: relative; display: inline-block;">
            <img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
              📸 Photo
            </div>
          </div>
        `;
      } else if (fileType === 'video') {
        preview.innerHTML = `
          <div style="position: relative; display: inline-block;">
            <video src="${e.target.result}" autoplay muted loop playsinline style="max-width: 200px; max-height: 200px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"></video>
            <div style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
              🎥 Vidéo (autoplay)
            </div>
          </div>
        `;
      } else {
        preview.innerHTML = '<p style="color: #ff4444;">❌ Format non supporté</p>';
        currentProductMedia = null;
        return;
      }
      
      // Sauvegarder les données du média
      currentProductMedia = {
        data: e.target.result,
        type: fileType,
        name: file.name,
        size: file.size
      };
      
      console.log('💾 Média sauvegardé dans currentProductMedia:', currentProductMedia?.name);
    };
    
    reader.onerror = function() {
      console.log('❌ Erreur lecture fichier');
      preview.innerHTML = '<p style="color: #ff4444;">❌ Erreur de lecture du fichier</p>';
      currentProductMedia = null;
    };
    
    reader.readAsDataURL(file);
  } else {
    console.log('📁 Aucun fichier sélectionné');
    preview.innerHTML = '';
    currentProductMedia = null;
  }
}

// Ajouter un nouveau produit
async function addNewProduct() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  
  const name = document.getElementById('new-product-name').value.trim();
  const category = document.getElementById('new-product-category').value;
  const price = document.getElementById('new-product-price').value.trim();
  const puffs = document.getElementById('new-product-puffs').value.trim();
  const desc = document.getElementById('new-product-desc').value.trim();
  
  if (!name || !price || !category) {
    showCustomAlert('⚠️ Champs requis', 'Veuillez remplir le nom, la catégorie et le prix du produit.', 'warning');
    return;
  }
  
  const newProduct = {
    name: name,
    category: category,
    price: price,
    puffs: puffs || 'Non spécifié',
    description: desc || '',
    image: currentProductMedia ? currentProductMedia.data : 'bg.jpg',
    mediaType: currentProductMedia ? currentProductMedia.type : 'image'
  };
  
  console.log('🆕 Création produit avec média:', currentProductMedia?.name || 'bg.jpg');
  console.log('📸 Image URL length:', newProduct.image.length);
  console.log('🎥 MediaType:', newProduct.mediaType);
  
  // Sauvegarder sur le serveur
  const success = await saveProductToServer(newProduct);
  
  if (success) {
    // Recharger les produits depuis le serveur
    await loadCustomProducts();
    
    // Réinitialiser le formulaire
    document.getElementById('new-product-name').value = '';
    document.getElementById('new-product-category').value = '';
    document.getElementById('new-product-price').value = '';
    document.getElementById('new-product-puffs').value = '';
    document.getElementById('new-product-desc').value = '';
    document.getElementById('new-product-media').value = '';
    document.getElementById('media-preview').innerHTML = '';
    currentProductMedia = null;
    
    showCustomAlert('✅ Succès', 'Produit ajouté avec succès dans la catégorie ' + category + ' !', 'success');
    refreshProducts();
  } else {
    showCustomAlert('❌ Erreur', 'Impossible de sauvegarder le produit. Réessayez.', 'error');
  }
}

// Supprimer un produit personnalisé
async function deleteCustomProduct(id) {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  
  showCustomConfirm('🗑️ Supprimer le produit', 'Êtes-vous sûr de vouloir supprimer ce produit ?', async () => {
    const success = await deleteProductFromServer(id);
    
    if (success) {
      // Recharger les produits depuis le serveur
      await loadCustomProducts();
      refreshProducts();
      showCustomAlert('✅ Succès', 'Produit supprimé avec succès !', 'success');
    } else {
      showCustomAlert('❌ Erreur', 'Impossible de supprimer le produit. Réessayez.', 'error');
    }
  });
}


// ==========================================
// 🔐 FONCTIONS CONNEXION ADMIN PERSONNALISÉE
// ==========================================
function showAdminLogin() {
  // Afficher la carte de connexion personnalisée
  const loginModal = document.getElementById('admin-login-modal');
  if (loginModal) {
    loginModal.style.display = 'flex';
    // Focus sur le champ de code
    setTimeout(() => {
      const codeInput = document.getElementById('admin-code-input');
      if (codeInput) {
        codeInput.focus();
        codeInput.value = '';
      }
    }, 100);
  }
}

function submitAdminCode() {
  const codeInput = document.getElementById('admin-code-input');
  const code = codeInput ? codeInput.value.trim() : '';
  
  if (code === 'leb59') {
    isAdminAuthenticated = true;
    hideAdminLogin();
    showCustomAlert('✅ Authentification réussie', 'Bienvenue dans le panel admin !', 'success');
    
    // Afficher le dashboard admin dédié
    showAdminDashboard();
    
    // Afficher le contenu admin
    const accessDenied = document.getElementById('admin-access-denied');
    const adminContent = document.getElementById('admin-content');
    if (accessDenied) accessDenied.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';
    
    loadAdminProducts();
    updateAdminStats();
    displayAdminReviews();
    
    // Activer l'onglet admin après authentification
    const adminTab = document.querySelector('[data-tab="admin"]');
    if (adminTab) {
      adminTab.click();
    }
  } else {
    // Code incorrect - animation d'erreur
    if (codeInput) {
      codeInput.style.animation = 'shake 0.5s';
      setTimeout(() => {
        codeInput.style.animation = '';
        codeInput.focus();
      }, 500);
    }
  }
}

function cancelAdminLogin() {
  hideAdminLogin();
  // Rediriger vers le menu principal
  const menuTab = document.querySelector('[data-tab="menu"]');
  if (menuTab) {
    menuTab.click();
  }
}

function hideAdminLogin() {
  const loginModal = document.getElementById('admin-login-modal');
  if (loginModal) {
    loginModal.style.display = 'none';
  }
}

// Animation shake pour erreur
const shakeStyle = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;

// Ajouter le style shake dynamiquement
if (!document.getElementById('shake-style')) {
  const style = document.createElement('style');
  style.id = 'shake-style';
  style.textContent = shakeStyle;
  document.head.appendChild(style);
}

// Gérer la touche Entrée dans le champ de code
document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('admin-code-input');
  if (codeInput) {
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        submitAdminCode();
      }
    });
  }
});



// Mettre à jour les statistiques admin
function updateAdminStats() {
  const totalProducts = document.getElementById('total-products');
  if (totalProducts) {
    const allProducts = [...products, ...customProducts];
    totalProducts.textContent = allProducts.length;
  }
}

function loadAdminProducts() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  
  const container = document.getElementById('admin-products-list');
  if (!container) return;
  
  const allProducts = [...products, ...customProducts];
  
  container.innerHTML = allProducts.map(p => `
    <div class="admin-product-card">
      ${p.mediaType === 'video' ? 
        `<video src="${p.image}" muted loop playsinline style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></video>` :
        `<img src="${p.image}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">`
      }
      <div class="admin-product-info">
        <h3>${p.name} ${p.custom ? '🆕' : ''}</h3>
        <p>${p.puffs} • ${p.price}€</p>
      </div>
      <div class="admin-product-actions">
        ${p.custom ? `<button class="admin-btn-small delete" onclick="deleteCustomProduct(${p.id})">🗑️</button>` : ''}
      </div>
    </div>
  `).join('');
  
  // Démarrer les vidéos
  container.querySelectorAll('video').forEach(video => {
    video.play().catch(() => {});
  });
}

function addProduct() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  showCustomAlert('ℹ️ Information', 'Utilisez le formulaire "Ajouter un nouveau produit" ci-dessus !', 'info');
}

function editProduct(id) {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  showCustomAlert('ℹ️ Information', 'Fonctionnalité d\'édition en développement !', 'info');
}

function deleteProduct(id) {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  showCustomConfirm('🗑️ Supprimer le produit', 'Êtes-vous sûr de vouloir supprimer ce produit par défaut ?', () => {
    showCustomAlert('ℹ️ Information', 'Fonctionnalité en développement !', 'info');
  });
}

function refreshProducts() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  loadAdminProducts();
  showCustomAlert('🔄 Actualisation', 'Liste des produits mise à jour !', 'info');
}

function deleteReview(reviewId) {
  showCustomConfirm('🗑️ Supprimer l\'avis', 'Êtes-vous sûr de vouloir supprimer cet avis ?', () => {
    reviews = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    displayAdminReviews();
    displayAllReviews();
    showCustomAlert('✅ Avis supprimé', 'L\'avis a été supprimé avec succès !', 'success');
  });
}

// Rendre la fonction accessible globalement
window.deleteReview = deleteReview;
console.log('✅ deleteReview attachée à window');

function displayAdminReviews() {
  const container = document.getElementById('admin-reviews-list');
  if (!container) return;
  
  // Recharger les avis depuis localStorage pour s'assurer d'avoir les données à jour
  reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  
  console.log('📋 Affichage des avis admin:', reviews.length, 'avis trouvés');
  
  if (reviews.length === 0) {
    container.innerHTML = '<p style="color: var(--tg-theme-hint-color); text-align: center; padding: 20px;">Aucun avis à gérer.</p>';
    return;
  }
  
  // Trier par date (plus récent en premier)
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = sortedReviews.map(review => {
    const product = customProducts.find(p => p.id === review.productId);
    const productName = product ? product.name : (review.isGeneral ? 'Avis général' : 'Produit inconnu');
    const date = new Date(review.date).toLocaleDateString('fr-FR');
    
    return `
    <div class="admin-review-card">
      <div class="admin-review-header">
        <div class="admin-review-author">
          <span>${review.author}</span>
          <span class="admin-review-date">${date}</span>
        </div>
        <div class="admin-review-rating">
          ${renderStars(review.rating)}
        </div>
      </div>
      <p class="admin-review-text">${review.text}</p>
      <div class="admin-review-product">
        <span style="font-size: 0.8rem; color: var(--tg-theme-hint-color);">${review.isGeneral ? 'Type: ' : 'Produit: '}</span>
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--tg-theme-text-color);">${productName}</span>
      </div>
      <div class="admin-review-actions">
        <button class="admin-btn-small delete" onclick="deleteReview(${review.id})">🗑️ Supprimer</button>
      </div>
    </div>
  `;
  }).join('');
}

// Rendre la fonction accessible globalement
window.displayAdminReviews = displayAdminReviews;
console.log('✅ displayAdminReviews attachée à window');

function saveConfig() {
  if (!isAdminAuthenticated) {
    showAdminLogin();
    return;
  }
  const snapUsername = document.getElementById('snap-username').value;
  const defaultPrice = document.getElementById('default-price').value;
  
  // Sauvegarder dans localStorage
  localStorage.setItem('snap_username', snapUsername);
  localStorage.setItem('default_price', defaultPrice);
  localStorage.setItem('admin_code', 'leb59');
  
  showCustomAlert('✅ Configuration sauvegardée', 'Vos paramètres ont été enregistrés avec succès !', 'success');
}

// ==========================================
// 📞 FONCTIONS CONTACT
// ==========================================
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      product: formData.get('product'),
      message: formData.get('message')
    };
    
    // Simuler l'envoi
    console.log('Message reçu :', data);
    showCustomAlert('✅ Message envoyé', 'Votre message a été envoyé avec succès ! Je vous répondrai rapidement sur Snapchat.', 'success');
    form.reset();
  });
}

// ==========================================
// 🚀 INITIALISATION - API RAILWAY
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  // Pas de splash screen - démarrage direct
  
  displayProducts();
  setupFilters();
  setupContactForm();
  setupLogoClickHandler(); // Initialiser le clic 3 fois sur le logo
  setupSearch(); // Initialiser la barre de recherche
  updateFavoritesCount(); // Initialiser le compteur de favoris
  setupReviewForm(); // Initialiser le formulaire d'avis produit
  setupGeneralReviewForm(); // Initialiser le formulaire d'avis général
  
  // Attacher l'événement au bouton laisser un avis
  const leaveReviewBtn = document.getElementById('leave-review-btn');
  if (leaveReviewBtn) {
    leaveReviewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('🎯 Bouton cliqué !');
      openGeneralReviewModal();
    });
    console.log('✅ Bouton laisser un avis initialisé');
  } else {
    console.log('❌ Bouton laisser un avis non trouvé');
  }
  
  // Initialiser le champ média pour l'upload
  const mediaInput = document.getElementById('new-product-media');
  if (mediaInput) {
    mediaInput.addEventListener('change', previewProductMedia);
    console.log('✅ Champ média initialisé');
  } else {
    console.log('❌ Champ média non trouvé');
  }
  
  // Charger les produits personnalisés depuis le serveur
  await loadCustomProducts();
  
  // Afficher les favoris au chargement
  displayFavorites();
  
  // Afficher tous les avis au chargement
  displayAllReviews();
  
  console.log('✅ App initialisée - Produits chargés depuis le serveur Railway !');
});
