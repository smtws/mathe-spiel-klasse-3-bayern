import Phaser from 'phaser';
import { TEXT_STYLES, COLORS } from '../config.js';
import { SaveManager } from '../managers/SaveManager.js';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  create() {
    const { width, height } = this.scale;

    console.log('PreloaderScene: create() gestartet');

    // Hintergrund
    this.cameras.main.setBackgroundColor(COLORS.JUNGLE_DARK);

    // Titel
    this.add.text(width / 2, height / 3, 'Dschungel-Mathe-Expedition', TEXT_STYLES.TITLE)
      .setOrigin(0.5);

    // Untertitel
    this.add.text(width / 2, height / 3 + 60, 'Das Mathe-Abenteuer beginnt!', TEXT_STYLES.SUBTITLE)
      .setOrigin(0.5);

    // Lade-Animation
    const loadingText = this.add.text(width / 2, height / 2 + 50, 'Bereite Expedition vor...', {
      ...TEXT_STYLES.BODY,
      color: '#90EE90'
    }).setOrigin(0.5);

    // Fortschrittsbalken
    const barWidth = 400;
    const barHeight = 30;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 + 100;

    // Hintergrund des Fortschrittsbalkens
    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x333333, 1);
    progressBg.fillRoundedRect(barX, barY, barWidth, barHeight, 10);

    // Fortschrittsbalken (animiert)
    const progressBar = this.add.graphics();
    let progress = 0;
    let transitionStarted = false;

    // SaveManager initialisieren
    console.log('PreloaderScene: SaveManager initialisieren...');
    this.saveManager = new SaveManager();
    console.log('PreloaderScene: SaveManager erstellt');
    const saveData = this.saveManager.load();
    console.log('PreloaderScene: Spielstand geladen', saveData);

    // Simuliere Ladefortschritt
    this.time.addEvent({
      delay: 30,
      repeat: 33,
      callback: () => {
        progress += 0.03;
        progressBar.clear();
        progressBar.fillStyle(COLORS.CORRECT_GREEN, 1);
        progressBar.fillRoundedRect(barX + 2, barY + 2, (barWidth - 4) * Math.min(progress, 1), barHeight - 4, 8);

        if (progress >= 1 && !transitionStarted) {
          transitionStarted = true;
          loadingText.setText('Bereit!');
          console.log('PreloaderScene: Ladevorgang abgeschlossen, wechsle zu MenuScene...');

          // Zur Menu-Szene wechseln
          this.time.delayedCall(500, () => {
            console.log('PreloaderScene: Starte MenuScene jetzt');
            this.scene.start('MenuScene', { saveData });
          });
        }
      }
    });

    // Dekorative Elemente (Blätter an den Ecken)
    this.createLeafDecoration(50, 50, -0.3);
    this.createLeafDecoration(width - 50, 50, 0.3);
    this.createLeafDecoration(50, height - 50, -0.3);
    this.createLeafDecoration(width - 50, height - 50, 0.3);
  }

  createLeafDecoration(x, y, rotation) {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.LEAF_GREEN, 0.6);

    // Einfaches Blatt
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + 40, y - 20);
    graphics.lineTo(x + 60, y);
    graphics.lineTo(x + 40, y + 20);
    graphics.closePath();
    graphics.fillPath();

    graphics.setRotation(rotation);
  }
}
