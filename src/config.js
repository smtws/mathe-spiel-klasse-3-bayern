import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { PreloaderScene } from './scenes/PreloaderScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { LevelScene } from './scenes/LevelScene.js';
import { BossScene } from './scenes/BossScene.js';

export const gameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#1a472a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 180
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  input: {
    activePointers: 3,
    touch: {
      capture: true
    }
  },
  dom: {
    createContainer: true
  },
  scene: [
    BootScene,
    PreloaderScene,
    MenuScene,
    WorldMapScene,
    LevelScene,
    BossScene
  ]
};

// Helper to detect mobile/tablet
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 1024);
};

// Responsive scale factor based on screen size
export const getScaleFactor = (width, height) => {
  const baseWidth = 1280;
  const baseHeight = 720;
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;
  return Math.min(scaleX, scaleY, 1);
};

// Spielkonstanten
export const GAME_CONSTANTS = {
  POINTS_PER_CORRECT: 10,
  BONUS_STREAK_THRESHOLD: 5,
  BONUS_STREAK_MULTIPLIER: 2,
  QUESTIONS_PER_LEVEL: 8,
  BOSS_QUESTIONS: 10,
  BOSS_TIME_LIMIT: 90, // Sekunden
  STARS_THRESHOLD: {
    THREE: 0.9,  // 90% korrekt
    TWO: 0.7,    // 70% korrekt
    ONE: 0.5     // 50% korrekt
  }
};

// CUPHEAD STYLE Farbpalette (1930er Vintage Look)
export const COLORS = {
  // Basis-Farben
  BLACK: 0x1a1a1a,
  WHITE: 0xf5f0e1,
  CREAM: 0xf2e8cf,
  SEPIA: 0xd4b896,

  // Haut-Töne
  SKIN_LIGHT: 0xf5d5b8,
  SKIN_DARK: 0xd4a574,

  // Braun-Töne (Holz)
  BROWN_LIGHT: 0xc4956a,
  BROWN_MED: 0x8b5a2b,
  BROWN_DARK: 0x5c3a1e,
  WOOD_BROWN: 0x8b4513,

  // Grün-Töne (Dschungel)
  GREEN_LIGHT: 0x7cb342,
  GREEN_MED: 0x558b2f,
  GREEN_DARK: 0x33691e,
  JUNGLE_DARK: 0x2d4a1e,
  JUNGLE_LIGHT: 0x4a6b2a,
  LEAF_GREEN: 0x558b2f,
  OLIVE: 0x827717,

  // Akzent-Farben
  RED: 0xc62828,
  ORANGE: 0xe65100,
  YELLOW: 0xf9a825,
  GOLD: 0xd4a017,
  BLUE: 0x1565c0,
  BLUE_LIGHT: 0x42a5f5,
  SKY_BLUE: 0x6ab0e9,
  PINK: 0xd81b60,
  PURPLE: 0x6a1b9a,

  // UI-Feedback
  CORRECT_GREEN: 0x2e7d32,
  WRONG_RED: 0xb71c1c,

  // Text
  TEXT_WHITE: 0xf5f0e1,
  TEXT_DARK: 0x1a1a1a
};

// Cuphead-Style Outline-Stärke
export const CUPHEAD_OUTLINE = 3;

// CUPHEAD STYLE Text-Styles (1930er Cartoon Look)
export const TEXT_STYLES = {
  TITLE: {
    fontFamily: 'Arial Black, Impact, Arial, sans-serif',
    fontSize: '52px',
    color: '#d4a017',  // Vintage Gold
    stroke: '#1a1a1a',
    strokeThickness: 6,
    shadow: {
      offsetX: 4,
      offsetY: 4,
      color: '#1a1a1a',
      blur: 0,
      fill: true
    }
  },
  SUBTITLE: {
    fontFamily: 'Arial Black, Impact, Arial, sans-serif',
    fontSize: '32px',
    color: '#f2e8cf',  // Cream
    stroke: '#1a1a1a',
    strokeThickness: 4
  },
  BODY: {
    fontFamily: 'Arial Black, Arial, sans-serif',
    fontSize: '24px',
    color: '#f5f0e1',
    stroke: '#1a1a1a',
    strokeThickness: 2
  },
  QUESTION: {
    fontFamily: 'Arial Black, Impact, Arial, sans-serif',
    fontSize: '36px',
    color: '#f5f0e1',
    stroke: '#1a1a1a',
    strokeThickness: 4
  },
  BUTTON: {
    fontFamily: 'Arial Black, Impact, Arial, sans-serif',
    fontSize: '28px',
    color: '#f5f0e1',
    stroke: '#1a1a1a',
    strokeThickness: 3
  },
  SCORE: {
    fontFamily: 'Arial Black, Arial, sans-serif',
    fontSize: '24px',
    color: '#d4a017',
    stroke: '#1a1a1a',
    strokeThickness: 2
  }
};
