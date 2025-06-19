document.addEventListener('DOMContentLoaded', () => {
  // Seleccionar elementos del DOM
  const toggleMode = document.getElementById('toggleMode');
  const mobileToggleMode = document.getElementById('mobileToggleMode');
  const body = document.body;

  // Función para alternar el modo claro/oscuro
  function toggleTheme() {
    body.classList.toggle('light-mode');
    
    // Actualizar el icono según el modo
    const isLightMode = body.classList.contains('light-mode');
    const iconElements = [
      toggleMode?.querySelector('.material-icons'),
      mobileToggleMode?.querySelector('.material-icons')
    ];

    iconElements.forEach(icon => {
      if (icon) {
        icon.textContent = isLightMode ? 'dark_mode' : 'light_mode';
      }
    });

    // Guardar la preferencia en localStorage
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  }

  // Aplicar el modo guardado al cargar la página
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === ' light') {
    body.classList.add('light-mode');
    // Actualizar iconos al cargar
    [toggleMode, mobileToggleMode].forEach(element => {
      const icon = element?.querySelector('.material-icons');
      if (icon) {
        icon.textContent = 'dark_mode';
      }
    });
  }

  // Añadir eventos de clic para los botones de cambio de modo
  if (toggleMode) {
    toggleMode.addEventListener('click', toggleTheme);
  }

  if (mobileToggleMode) {
    mobileToggleMode.addEventListener('click', toggleTheme);
  }
});