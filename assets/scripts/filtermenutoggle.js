document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar elementos del DOM
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeMenu = document.getElementById('closeMenu');
  const filterToggle = document.getElementById('filterToggle');
  const toggleFilters = document.getElementById('toggleFilters');
  const filtersContainer = document.getElementById('filtersContainer');
  const closeFilters = document.getElementById('closeFilters');

  // Función para alternar el menú móvil
  function toggleMobileMenu() {
    mobileNav.classList.toggle('open');
  }

  // Función para alternar el contenedor de filtros
  function toggleFiltersContainer() {
    filtersContainer.classList.toggle('open');
    // En PC, alternar también la clase 'collapsed' para manejar la visibilidad
    if (window.innerWidth > 768) {
      filtersContainer.classList.toggle('collapsed');
    }
  }

  // Evento para abrir/cerrar el menú móvil (solo en móviles, ≤ 1024px)
  if (menuToggle && mobileNav && closeMenu) {
    menuToggle.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        toggleMobileMenu();
      }
    });
    closeMenu.addEventListener('click', toggleMobileMenu);
  }

  // Evento para abrir/cerrar los filtros (móviles y PC)
  if (filterToggle && filtersContainer) {
    filterToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleFiltersContainer();
      }
    });
  }

  if (toggleFilters && filtersContainer) {
    toggleFilters.addEventListener('click', () => {
      if (window.innerWidth > 768) {
        toggleFiltersContainer();
      }
    });
  }

  if (closeFilters && filtersContainer) {
    closeFilters.addEventListener('click', toggleFiltersContainer);
  }

  // Ajustar estado inicial de los filtros en PC según el tamaño de la pantalla
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      // En PC, asegurar que los filtros estén visibles por defecto
      filtersContainer.classList.remove('open');
      if (!filtersContainer.classList.contains('collapsed')) {
        filtersContainer.classList.add('collapsed');
      }
    } else {
      // En móviles, asegurar que los filtros estén ocultos por defecto
      filtersContainer.classList.remove('collapsed');
      if (filtersContainer.classList.contains('open')) {
        filtersContainer.classList.remove('open');
      }
    }

    // Asegurar que el menú móvil esté oculto en PC
    if (window.innerWidth > 1024) {
      mobileNav.classList.remove('open');
    }
  });

  // Ejecutar ajuste inicial al cargar la página
  if (window.innerWidth > 768) {
    filtersContainer.classList.add('collapsed');
  }
});