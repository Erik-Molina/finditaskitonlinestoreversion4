import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAUzXZfOm7laa_ubkP_mYz5YMhYFfy5zOc",
  authDomain: "dataestorage.firebaseapp.com",
  databaseURL: "https://dataestorage-default-rtdb.firebaseio.com",
  projectId: "dataestorage",
  storageBucket: "dataestorage.firebasestorage.app",
  messagingSenderId: "1062428871648",
  appId: "1:1062428871648:web:338409b616e2cfba29b985",
  measurementId: "G-W47EH5YSFS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Seleccionar elementos del DOM
const productsContainer = document.getElementById('productsContainer');
const categoriesContainer = document.getElementById('categoriesContainer');
const rubroInputs = document.querySelectorAll('input[name="rubro"]');

// Obtener la ruta base dinámicamente (incluyendo /onlinestore)
const basePath = window.location.pathname.replace(/\/[^/]+\.html$/, '');

// Función para sanitizar el nombre del producto para la URL
function sanitizeProductName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();
}

// Función para renderizar productos con labels por categoría
function renderProducts(products) {
  console.log('Rendering products:', products.length, 'items');
  productsContainer.innerHTML = ''; // Limpiar contenedor

  if (!products || products.length === 0) {
    productsContainer.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
    .map(checkbox => checkbox.value);

  const groupedProducts = {};
  products.forEach(producto => {
    const category = producto.clase || 'Sin categoría';
    if (!groupedProducts[category]) {
      groupedProducts[category] = [];
    }
    groupedProducts[category].push(producto);
  });

  Object.keys(groupedProducts).forEach((category, index) => {
    if (selectedCategories.length === 0 || selectedCategories.includes(category)) {
      const label = document.createElement('div');
      label.className = 'category-label-row';
      label.innerHTML = `<span class="category-label">${category}</span>`;
      productsContainer.appendChild(label);

      groupedProducts[category].forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const briefDetail = producto.detalles.length > 50 ? producto.detalles.substring(0, 50) + '...' : producto.detalles || 'Sin detalles';

        card.innerHTML = `
          <div class="product-badge ${producto.disponible ? 'available' : 'sold-out'}">
            ${producto.disponible ? 'Disponible' : 'Agotado'}
          </div>
          <div class="product-image-container">
            <img src="${producto.imagenes_url[0]}" alt="${producto.nombre}" class="product-img" />
            <div class="overlay"></div>
            <button class="view-button" title="Ver producto" data-images='${JSON.stringify(producto.imagenes_url)}' data-product='${JSON.stringify(producto)}'>
              <span class="material-icons">visibility</span> Ver detalles
            </button>
          </div>
          <div class="product-info">
            <h3 class="product-name">${producto.nombre}</h3>
            <p class="product-price">${producto.precio}</p>
            <p class="product-brief">${briefDetail}</p>
            <p class="product-manufacturer"><strong>Fabricante:</strong> ${producto.fabricante}</p>
          </div>
        `;

        productsContainer.appendChild(card);
      });
    }
  });

  // Añadir event listeners para los botones de "Ver"
  document.querySelectorAll('.view-button').forEach(button => {
    button.addEventListener('click', () => {
      const images = JSON.parse(button.dataset.images);
      const product = JSON.parse(button.dataset.product);
      openProductImagesModal(images, product);
    });
  });
}

// Función para obtener categorías únicas según el rubro
function getCategoriesByRubro(data, rubro) {
  console.log('Getting categories for rubro:', rubro);
  const categories = new Set();
  Object.values(data).forEach(producto => {
    if (producto.rubro === rubro && producto.clase) {
      categories.add(producto.clase);
    }
  });
  return Array.from(categories).sort();
}

// Función para renderizar checkboxes de categorías
function renderCategories(categories) {
  console.log('Rendering categories:', categories);
  categoriesContainer.innerHTML = '';

  if (categories.length === 0) {
    const noCategories = document.createElement('p');
    noCategories.textContent = 'No hay categorías disponibles';
    noCategories.style.color = '#ccc';
    noCategories.style.fontSize = '14px';
    categoriesContainer.appendChild(noCategories);
    return;
  }

  categories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'filter-item';
    label.innerHTML = `
      <input type="checkbox" name="category" value="${category}">
      <span>${category}</span>
    `;
    categoriesContainer.appendChild(label);
  });
}

// Función para filtrar productos según rubro y categorías seleccionadas
function filterProducts(data, rubro, selectedCategories) {
  console.log('Filtering products - Rubro:', rubro, 'Categories:', selectedCategories);
  const products = Object.values(data);
  if (!rubro) return products;
  if (selectedCategories.length === 0) return products.filter(producto => producto.rubro === rubro);
  return products.filter(producto => producto.rubro === rubro && selectedCategories.includes(producto.clase));
}

// Función para abrir el modal de imágenes con carrusel y detalles
function openProductImagesModal(images, product) {
  console.log('Opening images modal with images:', images, 'product:', product);
  let modal = document.getElementById('productImagesModal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'productImagesModal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  const stock = product.stock || 0;
  let quantity = 1;
  let currentIndex = 0;

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${product.nombre}</h2>
        <button class="close-modal" id="closeProductImagesModal">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="parent">
          <div class="div1">
            <div class="carousel-container">
              <button class="carousel-prev" id="carouselPrev">
                <span class="material-icons">chevron_left</span>
              </button>
              <div class="carousel-image">
                <img src="${images[currentIndex]}" alt="${product.nombre}" class="modal-product-img" />
              </div>
              <button class="carousel-next" id="carouselNext">
                <span class="material-icons">chevron_right</span>
              </button>
            </div>
          </div>
          <div class="div2">
            <h3 class="product-name">${product.nombre}</h3>
            <p class="product-price">${product.precio}</p>
            <div class="product-details">
              <p><strong>Código:</strong> ${product.id}</p>
              <p>${product.detalles}</p>
            </div>
          </div>
          <div class="div3">
            <div class="product-actions">
              <div class="quantity-control">
                <button class="btn-decrement">-</button>
                <input type="number" class="quantity-input" value="${quantity}" min="1" max="${stock}">
                <button class="btn-increment">+</button>
              </div>
              <button class="btn-add-cart">Añadir al carrito</button>
              <button class="btn-buy-now">Comprar ahora</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const prevButton = document.getElementById('carouselPrev');
  const nextButton = document.getElementById('carouselNext');
  const imageElement = modal.querySelector('.modal-product-img');
  const quantityInput = modal.querySelector('.quantity-input');
  const decrementBtn = modal.querySelector('.btn-decrement');
  const incrementBtn = modal.querySelector('.btn-increment');

  function updateCarousel() {
    imageElement.src = images[currentIndex];
    imageElement.alt = `${product.nombre} - Imagen ${currentIndex + 1}`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === images.length - 1;
  }

  function updateQuantity(newValue) {
    quantity = parseInt(newValue) || 1;
    if (quantity < 1) quantity = 1;
    if (quantity > stock) quantity = stock;
    quantityInput.value = quantity;
    quantityInput.setAttribute('max', stock);
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  quantityInput.addEventListener('input', (e) => {
    updateQuantity(e.target.value);
  });

  decrementBtn.addEventListener('click', () => {
    updateQuantity(quantity - 1);
  });

  incrementBtn.addEventListener('click', () => {
    updateQuantity(quantity + 1);
  });

  document.getElementById('closeProductImagesModal').addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });
}

// Función para inicializar el modal desde la URL
function initializeModalFromUrl() {
  // No necesitamos esta función ya que no usaremos links
}

// Lógica principal
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Firebase listener');
  const productosRef = ref(db, '/');

  onValue(productosRef, (snapshot) => {
    console.log('Firebase snapshot received');
    const data = snapshot.val() || {};
    console.log('Data received:', data);

    const allProducts = Object.values(data);
    renderProducts(allProducts);

    rubroInputs.forEach(input => {
      input.addEventListener('change', () => {
        const currentRubro = input.value;
        const categories = getCategoriesByRubro(data, currentRubro);
        renderCategories(categories);
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
        categoryCheckboxes.forEach(checkbox => (checkbox.checked = false));
        const products = filterProducts(data, currentRubro, []);
        renderProducts(products);
      });
    });

    categoriesContainer.addEventListener('change', (event) => {
      if (event.target.name === 'category') {
        const currentRubro = document.querySelector('input[name="rubro"]:checked')?.value;
        if (!currentRubro) {
          console.warn('No rubro selected, skipping category filter');
          return;
        }
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(checkbox => checkbox.value);
        const filteredProducts = filterProducts(data, currentRubro, selectedCategories);
        renderProducts(filteredProducts);
      }
    });
  }, { onlyOnce: false });

  // Eliminamos la inicialización desde URL y el popstate
});
