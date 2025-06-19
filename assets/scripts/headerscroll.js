let lastScrollTop = 0;
const header = document.querySelector('.main-header');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  const isMobile = window.innerWidth <= 1024;
  const isMenuOpen = mobileNav.classList.contains('open');

  if (isMobile) {
    if (!isMenuOpen) {
      if (currentScroll > lastScrollTop) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    } else {
      // Si el menú está abierto, no muevas el header
      header.style.transform = 'translateY(0)';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  } else {
    // Reset para escritorio
    header.style.transform = 'translateY(0)';
  }
});
