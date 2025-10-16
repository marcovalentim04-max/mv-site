// Script para limpar cache de todos os navegadores
(function() {
  'use strict';
  
  // 1. Limpar Service Workers (se existirem)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
  
  // 2. Limpar todos os caches da Cache API
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        caches.delete(cacheName);
      });
    });
  }
  
  // 3. Limpar localStorage
  try {
    localStorage.clear();
  } catch(e) {
    console.log('localStorage não disponível');
  }
  
  // 4. Limpar sessionStorage
  try {
    sessionStorage.clear();
  } catch(e) {
    console.log('sessionStorage não disponível');
  }
  
  // 5. Forçar reload sem cache se for primeira visita após deploy
  const version = '1.0.0'; // Atualize este número a cada deploy
  const lastVersion = sessionStorage.getItem('app-version');
  
  if (lastVersion !== version) {
    sessionStorage.setItem('app-version', version);
    if (lastVersion !== null) {
      // Força reload sem cache
      window.location.reload(true);
    }
  }
})();
