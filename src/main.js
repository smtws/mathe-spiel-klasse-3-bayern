import Phaser from 'phaser';
import { gameConfig } from './config.js';

// Warte auf DOM-Ready
window.addEventListener('load', () => {
  // Verstecke den Ladebildschirm sobald Phaser startet
  const loadingScreen = document.getElementById('loading-screen');

  // Erstelle das Spiel
  const game = new Phaser.Game(gameConfig);

  // Verstecke Ladebildschirm nach kurzer Verzögerung
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }, 500);

  // ESC-Taste zum Verlassen des Vollbildmodus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  });

  // Handle resize/orientation changes on mobile
  const handleResize = () => {
    // Small delay to let mobile browser finish resizing
    setTimeout(() => {
      if (game && game.scale) {
        game.scale.refresh();
      }
    }, 100);
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // Prevent pull-to-refresh on mobile
  document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('#game-container')) {
      e.preventDefault();
    }
  }, { passive: false });

  // Globale Referenz für Debugging (nur in Entwicklung)
  if (import.meta.env.DEV) {
    window.game = game;
  }
});
