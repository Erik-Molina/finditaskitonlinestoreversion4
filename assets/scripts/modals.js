document.addEventListener('DOMContentLoaded', () => {
  console.log('moda.js cargado');

  const modals = {
    cart: document.getElementById('cartModal'),
    offers: document.getElementById('offersModal'),
    sell: document.getElementById('sellModal')
  };

  const openButtons = {
    cart: document.getElementById('openCartModal'),
    offers: document.getElementById('openOffersModal'),
    sell: document.getElementById('openSellModal'),
    cartMobile: document.getElementById('openCartModalMobile'),
    offersMobile: document.getElementById('openOffersModalMobile'),
    sellMobile: document.getElementById('openSellModalMobile')
  };

  const closeButtons = {
    cart: document.getElementById('closeCartModal'),
    offers: document.getElementById('closeOffersModal'),
    sell: document.getElementById('closeSellModal')
  };

  const mobileNav = document.getElementById('mobileNav');
  const filtersContainer = document.getElementById('filtersContainer');

  // Verificar que los elementos existen
  console.log('Modales:', modals);
  console.log('Botones de apertura:', openButtons);
  console.log('Botones de cierre:', closeButtons);
  console.log('mobileNav:', mobileNav);
  console.log('filtersContainer:', filtersContainer);

  function closeAllModals() {
    Object.values(modals).forEach(modal => {
      if (modal) {
        modal.classList.remove('open');
        console.log(`Cerrando modal: ${modal.id}`);
      }
    });
    if (mobileNav) mobileNav.classList.remove('open');
    if (filtersContainer) filtersContainer.classList.remove('open');
    document.body.style.overflow = 'auto';
    console.log('Todos los modales cerrados, overflow restaurado');
  }

  function openModal(modalId) {
    closeAllModals();
    const modal = modals[modalId];
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      console.log(`Abriendo modal: ${modalId}`);
    } else {
      console.error(`Modal no encontrado: ${modalId}`);
    }
  }

  // Botones de apertura (escritorio)
  if (openButtons.cart) {
    openButtons.cart.addEventListener('click', () => {
      console.log('Clic en Carrito (escritorio)');
      openModal('cart');
    });
  } else {
    console.error('Botón openCartModal no encontrado');
  }

  if (openButtons.offers) {
    openButtons.offers.addEventListener('click', () => {
      console.log('Clic en Ofertas (escritorio)');
      openModal('offers');
    });
  } else {
    console.error('Botón openOffersModal no encontrado');
  }

  if (openButtons.sell) {
    openButtons.sell.addEventListener('click', () => {
      console.log('Clic en Vender (escritorio)');
      openModal('sell');
    });
  } else {
    console.error('Botón openSellModal no encontrado');
  }

  // Botones de apertura (móvil)
  if (openButtons.cartMobile) {
    openButtons.cartMobile.addEventListener('click', () => {
      console.log('Clic en Carrito (móvil)');
      openModal('cart');
    });
  } else {
    console.error('Botón openCartModalMobile no encontrado');
  }

  if (openButtons.offersMobile) {
    openButtons.offersMobile.addEventListener('click', () => {
      console.log('Clic en Ofertas (móvil)');
      openModal('offers');
    });
  } else {
    console.error('Botón openOffersModalMobile no encontrado');
  }

  if (openButtons.sellMobile) {
    openButtons.sellMobile.addEventListener('click', () => {
      console.log('Clic en Vender (móvil)');
      openModal('sell');
    });
  } else {
    console.error('Botón openSellModalMobile no encontrado');
  }

  // Botones de cierre
  if (closeButtons.cart) {
    closeButtons.cart.addEventListener('click', () => {
      console.log('Clic en cerrar Carrito');
      closeAllModals();
    });
  } else {
    console.error('Botón closeCartModal no encontrado');
  }

  if (closeButtons.offers) {
    closeButtons.offers.addEventListener('click', () => {
      console.log('Clic en cerrar Ofertas');
      closeAllModals();
    });
  } else {
    console.error('Botón closeOffersModal no encontrado');
  }

  if (closeButtons.sell) {
    closeButtons.sell.addEventListener('click', () => {
      console.log('Clic en cerrar Vender');
      closeAllModals();
    });
  } else {
    console.error('Botón closeSellModal no encontrado');
  }

  // Clic fuera para cerrar
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') && e.target.classList.contains('open')) {
      console.log('Clic fuera del modal');
      closeAllModals();
    }
  });
});