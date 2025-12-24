import Phaser from 'phaser';
import { COLORS } from '../config.js';

/**
 * CUPHEAD STYLE GRAFIKEN
 * 1930er Cartoon-Ästhetik mit:
 * - Dicke schwarze Outlines
 * - Rubber Hose Limbs
 * - Pie-Cut Eyes
 * - Vintage Farbpalette
 */

// Cuphead-Style Farbpalette (vintage, gedämpft)
const CUPHEAD_COLORS = {
  BLACK: 0x1a1a1a,
  WHITE: 0xf5f0e1,
  CREAM: 0xf2e8cf,
  SKIN_LIGHT: 0xf5d5b8,
  SKIN_DARK: 0xd4a574,
  BROWN_LIGHT: 0xc4956a,
  BROWN_MED: 0x8b5a2b,
  BROWN_DARK: 0x5c3a1e,
  GREEN_LIGHT: 0x7cb342,
  GREEN_MED: 0x558b2f,
  GREEN_DARK: 0x33691e,
  OLIVE: 0x827717,
  RED: 0xc62828,
  ORANGE: 0xe65100,
  YELLOW: 0xf9a825,
  GOLD: 0xd4a017,
  BLUE: 0x1565c0,
  BLUE_LIGHT: 0x42a5f5,
  PINK: 0xd81b60,
  PURPLE: 0x6a1b9a,
  CORRECT: 0x2e7d32,
  WRONG: 0xb71c1c
};

const OUTLINE = 3;

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    console.log('BootScene: Cuphead-Style Grafiken...');
    this.createCupheadGraphics();
  }

  create() {
    this.scene.start('PreloaderScene');
  }

  // === HELPER METHODEN ===

  drawPieCutEye(graphics, x, y, radius, lookDir = 0) {
    graphics.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    graphics.fillCircle(x, y, radius);
    graphics.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    graphics.strokeCircle(x, y, radius);
    graphics.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    graphics.fillCircle(x + lookDir * 2, y, radius * 0.6);
    graphics.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    graphics.fillCircle(x + lookDir * 2 - 2, y - 2, radius * 0.2);
  }

  drawGlove(graphics, x, y, size) {
    graphics.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    graphics.fillCircle(x, y, size);
    graphics.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    graphics.strokeCircle(x, y, size);
    graphics.lineStyle(1.5, CUPHEAD_COLORS.BLACK, 0.4);
    graphics.beginPath();
    graphics.moveTo(x - size * 0.4, y);
    graphics.lineTo(x + size * 0.2, y);
    graphics.strokePath();
  }

  createCupheadGraphics() {
    // UI
    this.createCupheadButton('button_green', 300, 80, CUPHEAD_COLORS.GREEN_MED);
    this.createCupheadButton('button_gold', 300, 80, CUPHEAD_COLORS.GOLD);
    this.createCupheadButton('button_wood', 300, 80, CUPHEAD_COLORS.BROWN_MED);
    this.createCupheadPanel('panel', 600, 400);
    this.createCupheadPanel('panel_small', 400, 300);
    this.createCupheadButton('answer_button', 250, 70, CUPHEAD_COLORS.BROWN_LIGHT);
    this.createCupheadButton('answer_correct', 250, 70, CUPHEAD_COLORS.CORRECT);
    this.createCupheadButton('answer_wrong', 250, 70, CUPHEAD_COLORS.WRONG);
    this.createCupheadStar('star_filled', CUPHEAD_COLORS.GOLD);
    this.createCupheadStar('star_empty', 0x555555);
    this.createCupheadCoin('coin');
    this.createCupheadHeart('heart');

    // Characters
    this.createCupheadCharacter('player_maya', CUPHEAD_COLORS.ORANGE, true);
    this.createCupheadCharacter('player_leo', CUPHEAD_COLORS.BLUE, false);

    // Bosses (12 Kapitel)
    this.createCupheadBoss('animal_krokodil', 'crocodile');  // Kapitel 1
    this.createCupheadBoss('animal_piranha', 'piranha');     // Kapitel 2
    this.createCupheadBoss('animal_gorilla', 'gorilla');     // Kapitel 3
    this.createCupheadBoss('animal_schlange', 'snake');      // Kapitel 4
    this.createCupheadBoss('animal_alligator', 'alligator'); // Kapitel 5
    this.createCupheadBoss('animal_papagei', 'parrot');      // Kapitel 6
    this.createCupheadBoss('animal_jaguar', 'jaguar');       // Kapitel 7
    this.createCupheadBoss('animal_tukan', 'toucan');        // Kapitel 8
    this.createCupheadBoss('animal_affe', 'monkey');         // Kapitel 9
    this.createCupheadBoss('animal_sphinx', 'sphinx');       // Kapitel 10
    this.createCupheadBoss('animal_loewe', 'lion');          // Kapitel 11 (Ranger)
    this.createCupheadBoss('animal_elefant', 'elephant');    // Kapitel 12 (Ranger)

    // Level markers
    this.createCupheadLevelMarker('level_marker', CUPHEAD_COLORS.GREEN_MED, false);
    this.createCupheadLevelMarker('level_marker_locked', 0x555555, true);
    this.createCupheadLevelMarker('level_marker_complete', CUPHEAD_COLORS.GOLD, false);

    // Progress
    this.createCupheadProgressBar('progress_bg', 400, 30, CUPHEAD_COLORS.BROWN_DARK);
    this.createCupheadProgressBar('progress_fill', 400, 30, CUPHEAD_COLORS.GREEN_MED);
    this.createCupheadProgressBar('timer_bg', 150, 50, CUPHEAD_COLORS.BROWN_DARK);

    // Animations
    this.createCupheadMonkey('anim_monkey');
    this.createCupheadBanana('anim_banana');
    this.createCupheadPalmTrunk('anim_palm_trunk');
    this.createCupheadPalmFrond('anim_palm_frond');
    this.createCupheadCoconut('anim_coconut');
    this.createCupheadParrot('anim_parrot_red', CUPHEAD_COLORS.RED);
    this.createCupheadParrot('anim_parrot_blue', CUPHEAD_COLORS.BLUE);
    this.createCupheadParrot('anim_parrot_green', CUPHEAD_COLORS.GREEN_MED);
    this.createCupheadCrocodile('anim_crocodile');
    this.createCupheadButterfly('anim_butterfly_blue', CUPHEAD_COLORS.BLUE_LIGHT);
    this.createCupheadButterfly('anim_butterfly_orange', CUPHEAD_COLORS.ORANGE);
    this.createCupheadChest('anim_chest_closed', false);
    this.createCupheadChest('anim_chest_open', true);
    this.createCupheadFlower('anim_flower');
    this.createCupheadTooth('anim_tooth');
  }

  // === UI ELEMENTE ===

  createCupheadButton(key, width, height, color) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const pad = 4;

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.5);
    g.fillRoundedRect(pad, pad, width, height, 12);

    // Hauptfläche
    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, width, height, 12);

    // Dicke Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeRoundedRect(0, 0, width, height, 12);

    // Highlight oben
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(8, 6, width - 16, height * 0.3, 6);

    // Innere Linie (vintage detail)
    g.lineStyle(2, CUPHEAD_COLORS.BLACK, 0.2);
    g.strokeRoundedRect(6, 6, width - 12, height - 12, 8);

    g.generateTexture(key, width + pad, height + pad);
    g.destroy();
  }

  createCupheadPanel(key, width, height) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const pad = 6;

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.6);
    g.fillRoundedRect(pad, pad, width, height, 20);

    // Hintergrund (vintage Papier)
    g.fillStyle(CUPHEAD_COLORS.CREAM, 1);
    g.fillRoundedRect(0, 0, width, height, 20);

    // Rahmen (Holz-Look)
    g.lineStyle(8, CUPHEAD_COLORS.BROWN_MED, 1);
    g.strokeRoundedRect(0, 0, width, height, 20);

    // Dicke schwarze Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeRoundedRect(0, 0, width, height, 20);
    g.strokeRoundedRect(6, 6, width - 12, height - 12, 14);

    // Eck-Verzierungen (Kreise wie in alten Cartoons)
    const cornerSize = 12;
    const corners = [[20, 20], [width - 20, 20], [20, height - 20], [width - 20, height - 20]];
    corners.forEach(([x, y]) => {
      g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
      g.fillCircle(x, y, cornerSize);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeCircle(x, y, cornerSize);
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillCircle(x, y, cornerSize - 4);
    });

    g.generateTexture(key, width + pad, height + pad);
    g.destroy();
  }

  createCupheadStar(key, color) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const size = 50;
    const cx = size / 2;
    const cy = size / 2;

    // Stern zeichnen
    const points = [];
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? 22 : 10;
      const angle = (i * Math.PI / 5) - Math.PI / 2;
      points.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
    }

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.4);
    g.beginPath();
    g.moveTo(points[0].x + 3, points[0].y + 3);
    points.forEach(p => g.lineTo(p.x + 3, p.y + 3));
    g.closePath();
    g.fillPath();

    // Hauptfarbe
    g.fillStyle(color, 1);
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    points.forEach(p => g.lineTo(p.x, p.y));
    g.closePath();
    g.fillPath();

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    points.forEach(p => g.lineTo(p.x, p.y));
    g.closePath();
    g.strokePath();

    // Highlight
    g.fillStyle(0xffffff, 0.4);
    g.fillCircle(cx - 5, cy - 5, 6);

    g.generateTexture(key, size, size);
    g.destroy();
  }

  createCupheadCoin(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const size = 40;
    const cx = size / 2;
    const cy = size / 2;

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.4);
    g.fillCircle(cx + 2, cy + 2, 16);

    // Münze Basis
    g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
    g.fillCircle(cx, cy, 16);

    // Innerer Ring
    g.lineStyle(3, CUPHEAD_COLORS.BROWN_MED, 1);
    g.strokeCircle(cx, cy, 12);

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeCircle(cx, cy, 16);

    // Dollar-Zeichen oder Gesicht
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillCircle(cx, cy, 4);

    // Highlight
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(cx - 5, cy - 5, 4);

    g.generateTexture(key, size, size);
    g.destroy();
  }

  createCupheadHeart(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const size = 45;

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.4);
    g.fillCircle(15, 17, 10);
    g.fillCircle(31, 17, 10);
    g.fillTriangle(5, 19, 41, 19, 23, 42);

    // Herz
    g.fillStyle(CUPHEAD_COLORS.RED, 1);
    g.fillCircle(13, 15, 10);
    g.fillCircle(29, 15, 10);
    g.fillTriangle(3, 17, 39, 17, 21, 40);

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeCircle(13, 15, 10);
    g.strokeCircle(29, 15, 10);
    g.beginPath();
    g.moveTo(3, 17);
    g.lineTo(21, 40);
    g.lineTo(39, 17);
    g.strokePath();

    // Highlight
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(10, 12, 4);

    g.generateTexture(key, size, size);
    g.destroy();
  }

  createCupheadProgressBar(key, width, height, color) {
    const g = this.make.graphics({ x: 0, y: 0 });

    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, width, height, height / 3);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeRoundedRect(0, 0, width, height, height / 3);

    g.generateTexture(key, width, height);
    g.destroy();
  }

  createCupheadLevelMarker(key, color, locked) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const size = 50;
    const cx = size / 2;
    const cy = size / 2;

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.4);
    g.fillCircle(cx + 2, cy + 2, 20);

    // Hauptkreis
    g.fillStyle(color, 1);
    g.fillCircle(cx, cy, 20);

    // Innerer Kreis
    g.fillStyle(locked ? 0x333333 : 0xffffff, 0.3);
    g.fillCircle(cx, cy, 14);

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeCircle(cx, cy, 20);
    g.strokeCircle(cx, cy, 14);

    // Schloss-Symbol wenn locked
    if (locked) {
      g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
      g.fillRect(cx - 5, cy - 2, 10, 8);
      g.strokeCircle(cx, cy - 5, 5);
    }

    g.generateTexture(key, size, size);
    g.destroy();
  }

  // === CHARAKTERE ===

  createCupheadCharacter(key, shirtColor, isFemale) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 80, h = 110;
    const cx = w / 2, cy = h / 2;

    // Beine (Rubber Hose Style)
    g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    g.fillEllipse(cx - 12, cy + 40, 8, 15);
    g.fillEllipse(cx + 12, cy + 40, 8, 15);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);

    // Schuhe
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillEllipse(cx - 14, cy + 50, 12, 6);
    g.fillEllipse(cx + 14, cy + 50, 12, 6);
    g.strokeEllipse(cx - 14, cy + 50, 12, 6);
    g.strokeEllipse(cx + 14, cy + 50, 12, 6);

    // Körper
    g.fillStyle(shirtColor, 1);
    g.fillEllipse(cx, cy + 15, 22, 25);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeEllipse(cx, cy + 15, 22, 25);

    // Knöpfe
    g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    for (let i = 0; i < 3; i++) {
      g.fillCircle(cx, cy + 5 + i * 10, 3);
      g.lineStyle(1, CUPHEAD_COLORS.BLACK, 1);
      g.strokeCircle(cx, cy + 5 + i * 10, 3);
    }

    // Arme (Rubber Hose)
    g.fillStyle(shirtColor, 1);
    g.fillEllipse(cx - 28, cy + 8, 8, 18);
    g.fillEllipse(cx + 28, cy + 8, 8, 18);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeEllipse(cx - 28, cy + 8, 8, 18);
    g.strokeEllipse(cx + 28, cy + 8, 8, 18);

    // Handschuhe
    this.drawGlove(g, cx - 30, cy + 24, 8);
    this.drawGlove(g, cx + 30, cy + 24, 8);

    // Kopf
    g.fillStyle(CUPHEAD_COLORS.SKIN_LIGHT, 1);
    g.fillCircle(cx, cy - 22, 22);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeCircle(cx, cy - 22, 22);

    // Haare/Hut
    if (isFemale) {
      // Haare
      g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
      g.fillEllipse(cx, cy - 38, 20, 8);
      g.fillEllipse(cx - 15, cy - 30, 8, 12);
      g.fillEllipse(cx + 15, cy - 30, 8, 12);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy - 38, 20, 8);
      // Schleife
      g.fillStyle(CUPHEAD_COLORS.PINK, 1);
      g.fillCircle(cx + 18, cy - 35, 6);
      g.fillCircle(cx + 26, cy - 35, 6);
      g.strokeCircle(cx + 18, cy - 35, 6);
      g.strokeCircle(cx + 26, cy - 35, 6);
    } else {
      // Hut
      g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
      g.fillRect(cx - 18, cy - 42, 36, 8);
      g.fillEllipse(cx, cy - 50, 14, 10);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeRect(cx - 18, cy - 42, 36, 8);
      g.strokeEllipse(cx, cy - 50, 14, 10);
    }

    // Augen (Pie-Cut Style)
    this.drawPieCutEye(g, cx - 8, cy - 24, 7, 0);
    this.drawPieCutEye(g, cx + 8, cy - 24, 7, 0);

    // Nase
    g.fillStyle(CUPHEAD_COLORS.SKIN_DARK, 1);
    g.fillEllipse(cx, cy - 16, 4, 3);

    // Mund (großes Lächeln)
    g.lineStyle(2, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.arc(cx, cy - 10, 8, 0.2, Math.PI - 0.2);
    g.strokePath();

    // Wangen (Röte)
    g.fillStyle(CUPHEAD_COLORS.PINK, 0.3);
    g.fillCircle(cx - 14, cy - 16, 5);
    g.fillCircle(cx + 14, cy - 16, 5);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadBoss(key, type) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const size = 120;
    const cx = size / 2, cy = size / 2;

    if (type === 'crocodile') {
      // Körper
      g.fillStyle(CUPHEAD_COLORS.GREEN_DARK, 1);
      g.fillEllipse(cx, cy + 10, 45, 35);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 10, 45, 35);

      // Kopf/Schnauze
      g.fillStyle(CUPHEAD_COLORS.GREEN_MED, 1);
      g.fillEllipse(cx - 25, cy, 30, 18);
      g.strokeEllipse(cx - 25, cy, 30, 18);

      // Zähne
      g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(cx - 50 + i * 10, cy - 5, cx - 45 + i * 10, cy + 5, cx - 40 + i * 10, cy - 5);
      }

      // Auge
      this.drawPieCutEye(g, cx - 10, cy - 15, 12, -1);

      // Schuppen
      g.fillStyle(CUPHEAD_COLORS.GREEN_DARK, 0.5);
      for (let i = 0; i < 4; i++) {
        g.fillTriangle(cx - 10 + i * 15, cy - 20, cx - 2 + i * 15, cy - 30, cx + 6 + i * 15, cy - 20);
      }

    } else if (type === 'parrot') {
      // Körper
      g.fillStyle(CUPHEAD_COLORS.RED, 1);
      g.fillEllipse(cx, cy + 15, 30, 35);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 15, 30, 35);

      // Flügel
      g.fillStyle(CUPHEAD_COLORS.BLUE, 1);
      g.fillEllipse(cx + 30, cy + 10, 20, 30);
      g.strokeEllipse(cx + 30, cy + 10, 20, 30);

      // Kopf
      g.fillStyle(CUPHEAD_COLORS.RED, 1);
      g.fillCircle(cx, cy - 20, 22);
      g.strokeCircle(cx, cy - 20, 22);

      // Schnabel
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillTriangle(cx - 35, cy - 20, cx - 10, cy - 25, cx - 10, cy - 10);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeTriangle(cx - 35, cy - 20, cx - 10, cy - 25, cx - 10, cy - 10);

      // Auge
      this.drawPieCutEye(g, cx + 5, cy - 22, 10, -1);

      // Federbusch
      g.fillStyle(CUPHEAD_COLORS.YELLOW, 1);
      g.fillEllipse(cx, cy - 40, 8, 15);
      g.fillEllipse(cx - 8, cy - 38, 6, 12);
      g.fillEllipse(cx + 8, cy - 38, 6, 12);

    } else if (type === 'jaguar') {
      // Körper
      g.fillStyle(CUPHEAD_COLORS.ORANGE, 1);
      g.fillEllipse(cx, cy + 10, 40, 30);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 10, 40, 30);

      // Kopf
      g.fillStyle(CUPHEAD_COLORS.ORANGE, 1);
      g.fillCircle(cx, cy - 18, 25);
      g.strokeCircle(cx, cy - 18, 25);

      // Ohren
      g.fillTriangle(cx - 22, cy - 35, cx - 15, cy - 50, cx - 8, cy - 35);
      g.fillTriangle(cx + 22, cy - 35, cx + 15, cy - 50, cx + 8, cy - 35);

      // Flecken
      g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
      g.fillCircle(cx - 15, cy + 5, 5);
      g.fillCircle(cx + 20, cy + 15, 6);
      g.fillCircle(cx + 5, cy + 20, 4);

      // Schnauze
      g.fillStyle(CUPHEAD_COLORS.CREAM, 1);
      g.fillEllipse(cx, cy - 8, 12, 10);
      g.strokeEllipse(cx, cy - 8, 12, 10);

      // Augen
      this.drawPieCutEye(g, cx - 10, cy - 22, 8, 0);
      this.drawPieCutEye(g, cx + 10, cy - 22, 8, 0);

      // Nase
      g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
      g.fillTriangle(cx - 4, cy - 8, cx + 4, cy - 8, cx, cy - 3);

    } else if (type === 'octopus') {
      // Krake (Octopus) für Kapitel 5
      // Kopf
      g.fillStyle(0x8e44ad, 1); // Lila
      g.fillEllipse(cx, cy - 10, 35, 30);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy - 10, 35, 30);

      // Tentakel (8 Stück)
      g.fillStyle(0x9b59b6, 1); // Helleres Lila
      const tentacleAngles = [-140, -110, -70, -40, 40, 70, 110, 140];
      tentacleAngles.forEach((angle, i) => {
        const rad = angle * Math.PI / 180;
        const startX = cx + Math.cos(rad) * 25;
        const startY = cy + 10 + Math.abs(Math.sin(rad)) * 10;
        const endX = cx + Math.cos(rad) * 50;
        const endY = cy + 30 + Math.sin(rad + Math.PI/4) * 15;

        g.lineStyle(8, 0x9b59b6, 1);
        g.beginPath();
        g.moveTo(startX, startY);
        g.lineTo(endX, endY);
        g.strokePath();

        g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
        g.beginPath();
        g.moveTo(startX, startY);
        g.lineTo(endX, endY);
        g.strokePath();

        // Saugnäpfe
        g.fillStyle(0xd4a8e8, 1);
        g.fillCircle(endX, endY, 4);
      });

      // Augen
      this.drawPieCutEye(g, cx - 12, cy - 15, 10, 0);
      this.drawPieCutEye(g, cx + 12, cy - 15, 10, 0);

      // Mund (freundlich)
      g.lineStyle(2, CUPHEAD_COLORS.BLACK, 1);
      g.beginPath();
      g.arc(cx, cy, 8, 0.2, Math.PI - 0.2);
      g.strokePath();

    } else if (type === 'piranha') {
      // Piranha - gefährlicher Fisch
      g.fillStyle(0x4169E1, 1); // Königsblau
      g.fillEllipse(cx, cy, 40, 25);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy, 40, 25);

      // Bauch
      g.fillStyle(0x87CEEB, 1);
      g.fillEllipse(cx, cy + 8, 30, 12);

      // Flossen
      g.fillStyle(0x4169E1, 1);
      g.fillTriangle(cx + 35, cy, cx + 50, cy - 15, cx + 50, cy + 15);
      g.fillTriangle(cx, cy - 20, cx + 10, cy - 35, cx + 20, cy - 20);
      g.fillTriangle(cx, cy + 20, cx + 10, cy + 30, cx + 15, cy + 20);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeTriangle(cx + 35, cy, cx + 50, cy - 15, cx + 50, cy + 15);

      // Böses Auge
      this.drawPieCutEye(g, cx - 15, cy - 5, 10, -1);

      // Großes Maul mit Zähnen
      g.fillStyle(CUPHEAD_COLORS.RED, 1);
      g.fillEllipse(cx - 30, cy + 2, 18, 14);
      g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(cx - 42 + i * 7, cy - 6, cx - 39 + i * 7, cy + 3, cx - 36 + i * 7, cy - 6);
        g.fillTriangle(cx - 42 + i * 7, cy + 10, cx - 39 + i * 7, cy + 2, cx - 36 + i * 7, cy + 10);
      }

    } else if (type === 'gorilla') {
      // Gorilla - großer freundlicher Affe
      g.fillStyle(0x2F2F2F, 1); // Dunkelgrau
      g.fillEllipse(cx, cy + 15, 40, 35);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 15, 40, 35);

      // Brust
      g.fillStyle(0x4a4a4a, 1);
      g.fillEllipse(cx, cy + 20, 25, 22);

      // Kopf
      g.fillStyle(0x2F2F2F, 1);
      g.fillCircle(cx, cy - 18, 28);
      g.strokeCircle(cx, cy - 18, 28);

      // Gesicht
      g.fillStyle(0x4a4a4a, 1);
      g.fillEllipse(cx, cy - 10, 20, 18);

      // Augenbrauen (wütend)
      g.fillStyle(0x2F2F2F, 1);
      g.fillRect(cx - 18, cy - 30, 12, 5);
      g.fillRect(cx + 6, cy - 30, 12, 5);

      // Augen
      this.drawPieCutEye(g, cx - 10, cy - 22, 7, 0);
      this.drawPieCutEye(g, cx + 10, cy - 22, 7, 0);

      // Nase
      g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
      g.fillEllipse(cx, cy - 8, 10, 6);

      // Mund
      g.lineStyle(2, CUPHEAD_COLORS.BLACK, 1);
      g.beginPath();
      g.arc(cx, cy, 8, 0.1, Math.PI - 0.1);
      g.strokePath();

    } else if (type === 'snake') {
      // Schlange - gewunden
      g.fillStyle(0x228B22, 1); // Waldgrün
      // Körperschlaufen
      g.fillEllipse(cx + 20, cy + 25, 18, 12);
      g.fillEllipse(cx - 15, cy + 15, 18, 12);
      g.fillEllipse(cx + 10, cy, 18, 12);
      g.fillEllipse(cx - 20, cy - 10, 18, 12);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx + 20, cy + 25, 18, 12);
      g.strokeEllipse(cx - 15, cy + 15, 18, 12);
      g.strokeEllipse(cx + 10, cy, 18, 12);

      // Kopf
      g.fillStyle(0x228B22, 1);
      g.fillEllipse(cx, cy - 25, 22, 18);
      g.strokeEllipse(cx, cy - 25, 22, 18);

      // Muster
      g.fillStyle(0x006400, 1);
      g.fillCircle(cx + 15, cy + 25, 5);
      g.fillCircle(cx - 10, cy + 15, 5);
      g.fillCircle(cx + 5, cy, 5);

      // Augen
      this.drawPieCutEye(g, cx - 8, cy - 28, 7, 0);
      this.drawPieCutEye(g, cx + 8, cy - 28, 7, 0);

      // Züngelnde Zunge
      g.fillStyle(CUPHEAD_COLORS.RED, 1);
      g.fillRect(cx - 1, cy - 10, 2, 12);
      g.fillTriangle(cx - 5, cy + 2, cx, cy - 10, cx + 5, cy + 2);

    } else if (type === 'alligator') {
      // Alligator - ähnlich Krokodil aber dunkler
      g.fillStyle(0x2F4F4F, 1); // Dunkelgrün-Grau
      g.fillEllipse(cx, cy + 10, 45, 32);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 10, 45, 32);

      // Schnauze (breiter als Krokodil)
      g.fillStyle(0x3D5C5C, 1);
      g.fillEllipse(cx - 30, cy, 28, 22);
      g.strokeEllipse(cx - 30, cy, 28, 22);

      // Zähne
      g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
      for (let i = 0; i < 4; i++) {
        g.fillTriangle(cx - 52 + i * 12, cy - 8, cx - 46 + i * 12, cy + 5, cx - 40 + i * 12, cy - 8);
      }

      // Auge mit Schuppenbraue
      g.fillStyle(0x2F4F4F, 1);
      g.fillRect(cx - 5, cy - 25, 20, 8);
      this.drawPieCutEye(g, cx, cy - 18, 10, -1);

      // Rückenschuppen
      g.fillStyle(0x1C3333, 1);
      for (let i = 0; i < 5; i++) {
        g.fillTriangle(cx - 5 + i * 12, cy - 18, cx + 1 + i * 12, cy - 30, cx + 7 + i * 12, cy - 18);
      }

    } else if (type === 'toucan') {
      // Tukan - bunter Vogel
      g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
      g.fillEllipse(cx, cy + 10, 28, 32);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 10, 28, 32);

      // Weißer Brustfleck
      g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
      g.fillEllipse(cx, cy + 18, 18, 20);

      // Kopf
      g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
      g.fillCircle(cx, cy - 18, 22);
      g.strokeCircle(cx, cy - 18, 22);

      // Riesiger bunter Schnabel
      g.fillStyle(CUPHEAD_COLORS.ORANGE, 1);
      g.fillEllipse(cx - 40, cy - 15, 35, 18);
      g.fillStyle(CUPHEAD_COLORS.YELLOW, 1);
      g.fillEllipse(cx - 35, cy - 20, 20, 8);
      g.fillStyle(CUPHEAD_COLORS.RED, 1);
      g.fillEllipse(cx - 55, cy - 15, 8, 5);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx - 40, cy - 15, 35, 18);

      // Auge mit weißem Ring
      g.fillStyle(CUPHEAD_COLORS.BLUE_LIGHT, 1);
      g.fillCircle(cx + 5, cy - 20, 12);
      this.drawPieCutEye(g, cx + 5, cy - 20, 8, 0);

    } else if (type === 'monkey') {
      // Affe als Boss
      g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
      g.fillEllipse(cx, cy + 10, 35, 30);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 10, 35, 30);

      // Bauch
      g.fillStyle(CUPHEAD_COLORS.BROWN_LIGHT, 1);
      g.fillEllipse(cx, cy + 15, 22, 20);

      // Kopf
      g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
      g.fillCircle(cx, cy - 18, 26);
      g.strokeCircle(cx, cy - 18, 26);

      // Ohren
      g.fillCircle(cx - 28, cy - 18, 14);
      g.fillCircle(cx + 28, cy - 18, 14);
      g.strokeCircle(cx - 28, cy - 18, 14);
      g.strokeCircle(cx + 28, cy - 18, 14);
      g.fillStyle(CUPHEAD_COLORS.SKIN_DARK, 1);
      g.fillCircle(cx - 28, cy - 18, 8);
      g.fillCircle(cx + 28, cy - 18, 8);

      // Gesicht
      g.fillStyle(CUPHEAD_COLORS.SKIN_LIGHT, 1);
      g.fillEllipse(cx, cy - 10, 18, 16);

      // Augen
      this.drawPieCutEye(g, cx - 10, cy - 22, 9, 0);
      this.drawPieCutEye(g, cx + 10, cy - 22, 9, 0);

      // Nase und Mund
      g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
      g.fillEllipse(cx, cy - 6, 8, 5);
      g.lineStyle(2, CUPHEAD_COLORS.BLACK, 1);
      g.beginPath();
      g.arc(cx, cy, 6, 0.2, Math.PI - 0.2);
      g.strokePath();

    } else if (type === 'lion') {
      // Löwe - König der Ranger-Station
      g.fillStyle(0xDAA520, 1); // Goldbraun
      g.fillEllipse(cx, cy + 15, 38, 30);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 15, 38, 30);

      // Mähne
      g.fillStyle(0xB8860B, 1);
      for (let a = 0; a < Math.PI * 2; a += 0.5) {
        const mx = cx + Math.cos(a) * 32;
        const my = cy - 15 + Math.sin(a) * 28;
        g.fillCircle(mx, my, 12);
      }

      // Kopf
      g.fillStyle(0xDAA520, 1);
      g.fillCircle(cx, cy - 15, 26);
      g.strokeCircle(cx, cy - 15, 26);

      // Ohren
      g.fillTriangle(cx - 22, cy - 35, cx - 15, cy - 50, cx - 8, cy - 35);
      g.fillTriangle(cx + 22, cy - 35, cx + 15, cy - 50, cx + 8, cy - 35);

      // Schnauze
      g.fillStyle(CUPHEAD_COLORS.CREAM, 1);
      g.fillEllipse(cx, cy - 5, 16, 12);

      // Augen
      this.drawPieCutEye(g, cx - 10, cy - 20, 8, 0);
      this.drawPieCutEye(g, cx + 10, cy - 20, 8, 0);

      // Nase
      g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
      g.fillTriangle(cx - 5, cy - 5, cx + 5, cy - 5, cx, cy);

      // Schnurrhaare
      g.lineStyle(1, CUPHEAD_COLORS.BLACK, 1);
      g.beginPath();
      g.moveTo(cx - 25, cy - 3);
      g.lineTo(cx - 12, cy - 5);
      g.strokePath();
      g.beginPath();
      g.moveTo(cx + 25, cy - 3);
      g.lineTo(cx + 12, cy - 5);
      g.strokePath();

    } else if (type === 'elephant') {
      // Elefant - Weiser Safari-Meister
      g.fillStyle(0x708090, 1); // Schiefergrau
      g.fillEllipse(cx, cy + 10, 45, 35);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 10, 45, 35);

      // Kopf
      g.fillStyle(0x708090, 1);
      g.fillCircle(cx, cy - 15, 30);
      g.strokeCircle(cx, cy - 15, 30);

      // Ohren (groß!)
      g.fillEllipse(cx - 42, cy - 10, 22, 30);
      g.fillEllipse(cx + 42, cy - 10, 22, 30);
      g.fillStyle(0xDDA0DD, 1); // Rosa Innen
      g.fillEllipse(cx - 42, cy - 10, 14, 20);
      g.fillEllipse(cx + 42, cy - 10, 14, 20);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx - 42, cy - 10, 22, 30);
      g.strokeEllipse(cx + 42, cy - 10, 22, 30);

      // Rüssel
      g.fillStyle(0x708090, 1);
      g.fillRoundedRect(cx - 10, cy - 5, 20, 50, 10);
      g.strokeRoundedRect(cx - 10, cy - 5, 20, 50, 10);
      // Rüssel-Ringe
      g.lineStyle(2, 0x5F6A6A, 1);
      for (let ry = cy + 5; ry < cy + 40; ry += 8) {
        g.beginPath();
        g.moveTo(cx - 8, ry);
        g.lineTo(cx + 8, ry);
        g.strokePath();
      }

      // Augen
      this.drawPieCutEye(g, cx - 15, cy - 22, 8, 0);
      this.drawPieCutEye(g, cx + 15, cy - 22, 8, 0);

      // Stoßzähne
      g.fillStyle(CUPHEAD_COLORS.CREAM, 1);
      g.fillEllipse(cx - 20, cy + 15, 6, 18);
      g.fillEllipse(cx + 20, cy + 15, 6, 18);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx - 20, cy + 15, 6, 18);
      g.strokeEllipse(cx + 20, cy + 15, 6, 18);

    } else { // sphinx (default)
      // Körper
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillEllipse(cx, cy + 15, 45, 30);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeEllipse(cx, cy + 15, 45, 30);

      // Kopf
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillCircle(cx, cy - 15, 28);
      g.strokeCircle(cx, cy - 15, 28);

      // Kopfschmuck
      g.fillStyle(CUPHEAD_COLORS.BLUE, 1);
      g.fillTriangle(cx - 30, cy - 15, cx, cy - 55, cx + 30, cy - 15);
      g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
      g.strokeTriangle(cx - 30, cy - 15, cx, cy - 55, cx + 30, cy - 15);

      // Streifen
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillRect(cx - 2, cy - 50, 4, 35);

      // Augen
      this.drawPieCutEye(g, cx - 10, cy - 18, 8, 0);
      this.drawPieCutEye(g, cx + 10, cy - 18, 8, 0);

      // Mysteriöses Lächeln
      g.lineStyle(2, CUPHEAD_COLORS.BLACK, 1);
      g.beginPath();
      g.arc(cx, cy, 10, 0.1, Math.PI - 0.1);
      g.strokePath();
    }

    g.generateTexture(key, size, size);
    g.destroy();
  }

  // === ANIMATIONS-OBJEKTE ===

  createCupheadMonkey(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 90, h = 110;
    const cx = w / 2, cy = h / 2;

    // Schwanz
    g.lineStyle(8, CUPHEAD_COLORS.BROWN_MED, 1);
    g.beginPath();
    g.arc(cx + 35, cy + 5, 20, Math.PI * 0.5, Math.PI * 1.3);
    g.strokePath();
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.arc(cx + 35, cy + 5, 20, Math.PI * 0.5, Math.PI * 1.3);
    g.strokePath();

    // Körper
    g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
    g.fillEllipse(cx, cy + 15, 25, 30);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeEllipse(cx, cy + 15, 25, 30);

    // Bauch
    g.fillStyle(CUPHEAD_COLORS.BROWN_LIGHT, 1);
    g.fillEllipse(cx, cy + 18, 16, 22);
    g.strokeEllipse(cx, cy + 18, 16, 22);

    // Beine
    g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
    g.fillEllipse(cx - 15, cy + 42, 10, 14);
    g.fillEllipse(cx + 15, cy + 42, 10, 14);
    g.strokeEllipse(cx - 15, cy + 42, 10, 14);
    g.strokeEllipse(cx + 15, cy + 42, 10, 14);

    // Füße
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillEllipse(cx - 17, cy + 52, 10, 5);
    g.fillEllipse(cx + 17, cy + 52, 10, 5);
    g.strokeEllipse(cx - 17, cy + 52, 10, 5);
    g.strokeEllipse(cx + 17, cy + 52, 10, 5);

    // Arme
    g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
    g.fillEllipse(cx - 28, cy + 5, 10, 20);
    g.fillEllipse(cx + 28, cy + 5, 10, 20);
    g.strokeEllipse(cx - 28, cy + 5, 10, 20);
    g.strokeEllipse(cx + 28, cy + 5, 10, 20);

    // Hände
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillCircle(cx - 30, cy + 22, 8);
    g.fillCircle(cx + 30, cy + 22, 8);
    g.strokeCircle(cx - 30, cy + 22, 8);
    g.strokeCircle(cx + 30, cy + 22, 8);

    // Kopf
    g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
    g.fillCircle(cx, cy - 20, 24);
    g.strokeCircle(cx, cy - 20, 24);

    // Ohren
    g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
    g.fillCircle(cx - 24, cy - 22, 12);
    g.fillCircle(cx + 24, cy - 22, 12);
    g.strokeCircle(cx - 24, cy - 22, 12);
    g.strokeCircle(cx + 24, cy - 22, 12);
    // Ohr-Innen
    g.fillStyle(CUPHEAD_COLORS.SKIN_DARK, 1);
    g.fillCircle(cx - 24, cy - 22, 7);
    g.fillCircle(cx + 24, cy - 22, 7);

    // Gesicht
    g.fillStyle(CUPHEAD_COLORS.SKIN_LIGHT, 1);
    g.fillEllipse(cx, cy - 14, 16, 14);
    g.strokeEllipse(cx, cy - 14, 16, 14);

    // Augen (Pie-Cut)
    this.drawPieCutEye(g, cx - 8, cy - 24, 8, 0);
    this.drawPieCutEye(g, cx + 8, cy - 24, 8, 0);

    // Schnauze/Mund
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillEllipse(cx, cy - 8, 6, 4);
    g.lineStyle(2, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.arc(cx, cy - 3, 5, 0.2, Math.PI - 0.2);
    g.strokePath();

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadBanana(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 50, h = 55;

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.3);
    g.fillEllipse(27, 30, 14, 24);

    // Hauptform
    g.fillStyle(CUPHEAD_COLORS.YELLOW, 1);
    g.fillEllipse(24, 28, 14, 24);
    g.fillEllipse(20, 32, 12, 20);

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeEllipse(22, 30, 13, 22);

    // Highlight
    g.fillStyle(0xffffff, 0.4);
    g.fillEllipse(18, 24, 4, 12);

    // Stiel
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillRect(26, 4, 6, 8);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeRect(26, 4, 6, 8);

    // Spitze
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillCircle(16, 50, 4);
    g.strokeCircle(16, 50, 4);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadPalmTrunk(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 55, h = 170;
    const cx = w / 2;

    // Stamm-Grundform
    g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
    g.beginPath();
    g.moveTo(cx - 14, h);
    g.lineTo(cx - 10, h * 0.6);
    g.lineTo(cx - 8, h * 0.3);
    g.lineTo(cx - 6, 15);
    g.lineTo(cx + 6, 15);
    g.lineTo(cx + 8, h * 0.3);
    g.lineTo(cx + 10, h * 0.6);
    g.lineTo(cx + 14, h);
    g.closePath();
    g.fillPath();

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.moveTo(cx - 14, h);
    g.lineTo(cx - 10, h * 0.6);
    g.lineTo(cx - 8, h * 0.3);
    g.lineTo(cx - 6, 15);
    g.lineTo(cx + 6, 15);
    g.lineTo(cx + 8, h * 0.3);
    g.lineTo(cx + 10, h * 0.6);
    g.lineTo(cx + 14, h);
    g.strokePath();

    // Ringe
    for (let y = 25; y < h - 15; y += 20) {
      const ringW = 8 + (y / h) * 6;
      g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
      g.fillRoundedRect(cx - ringW, y, ringW * 2, 10, 3);
      g.lineStyle(2, CUPHEAD_COLORS.BLACK, 0.5);
      g.strokeRoundedRect(cx - ringW, y, ringW * 2, 10, 3);
    }

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadPalmFrond(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 130, h = 55;
    const cy = h / 2;

    // Mittelrippe
    g.lineStyle(5, CUPHEAD_COLORS.GREEN_DARK, 1);
    g.beginPath();
    g.moveTo(5, cy);
    g.lineTo(w - 10, cy - 3);
    g.strokePath();

    // Blätter
    g.fillStyle(CUPHEAD_COLORS.GREEN_MED, 1);
    for (let i = 1; i < 14; i++) {
      const x = 8 + (i / 14) * (w - 25);
      g.fillTriangle(x, cy, x + 14, cy - 20, x + 8, cy - 2);
      g.fillTriangle(x, cy, x + 14, cy + 20, x + 8, cy + 2);
    }

    // Outlines
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.moveTo(5, cy);
    g.lineTo(w - 10, cy - 3);
    g.strokePath();

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadCoconut(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const size = 45;
    const cx = size / 2, cy = size / 2;

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.BLACK, 0.3);
    g.fillCircle(cx + 2, cy + 2, 18);

    // Kokosnuss
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillCircle(cx, cy, 18);

    // Textur-Linien
    g.lineStyle(2, CUPHEAD_COLORS.BROWN_MED, 0.5);
    for (let a = 0; a < Math.PI * 2; a += 0.5) {
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 16);
      g.strokePath();
    }

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeCircle(cx, cy, 18);

    // Drei "Augen"
    g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    g.fillEllipse(cx - 6, cy - 3, 4, 5);
    g.fillEllipse(cx + 6, cy - 3, 4, 5);
    g.fillEllipse(cx, cy + 6, 5, 4);

    // Highlight
    g.fillStyle(0xffffff, 0.3);
    g.fillCircle(cx - 6, cy - 10, 5);

    g.generateTexture(key, size, size);
    g.destroy();
  }

  createCupheadParrot(key, color) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 65, h = 90;
    const cx = w / 2;

    // Schwanzfedern
    g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
    g.fillTriangle(cx - 5, h - 35, cx - 10, h - 8, cx, h - 12);
    g.fillStyle(color, 0.8);
    g.fillTriangle(cx + 5, h - 35, cx + 10, h - 8, cx + 2, h - 10);
    g.fillStyle(CUPHEAD_COLORS.GREEN_MED, 1);
    g.fillTriangle(cx, h - 38, cx, h - 5, cx + 4, h - 10);

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);

    // Körper
    g.fillStyle(color, 1);
    g.fillEllipse(cx, 50, 20, 28);
    g.strokeEllipse(cx, 50, 20, 28);

    // Bauch
    g.fillStyle(0xffffff, 0.3);
    g.fillEllipse(cx, 52, 14, 20);

    // Flügel
    g.fillStyle(color, 1);
    g.fillEllipse(cx + 18, 52, 12, 22);
    g.strokeEllipse(cx + 18, 52, 12, 22);

    // Kopf
    g.fillStyle(color, 1);
    g.fillCircle(cx, 20, 16);
    g.strokeCircle(cx, 20, 16);

    // Augenring (weiß)
    g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    g.fillCircle(cx - 5, 18, 8);
    g.strokeCircle(cx - 5, 18, 8);

    // Auge
    g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    g.fillCircle(cx - 5, 18, 4);
    g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    g.fillCircle(cx - 7, 16, 2);

    // Schnabel
    g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    g.fillTriangle(cx - 18, 20, cx - 28, 24, cx - 14, 28);
    g.fillEllipse(cx - 20, 26, 6, 4);

    // Füße
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillRect(cx - 8, h - 35, 5, 10);
    g.fillRect(cx + 3, h - 35, 5, 10);
    g.strokeRect(cx - 8, h - 35, 5, 10);
    g.strokeRect(cx + 3, h - 35, 5, 10);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadCrocodile(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 150, h = 70;

    // Schwanz
    g.fillStyle(CUPHEAD_COLORS.GREEN_MED, 1);
    g.fillTriangle(105, 35, 145, 32, 105, 40);
    g.fillStyle(CUPHEAD_COLORS.GREEN_DARK, 1);
    for (let x = 110; x < 140; x += 12) {
      g.fillTriangle(x, 30, x + 6, 22, x + 12, 30);
    }

    // Körper
    g.fillStyle(CUPHEAD_COLORS.GREEN_MED, 1);
    g.fillEllipse(75, 38, 38, 20);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeEllipse(75, 38, 38, 20);

    // Beine
    g.fillStyle(CUPHEAD_COLORS.GREEN_LIGHT, 1);
    g.fillEllipse(95, 52, 10, 14);
    g.fillEllipse(55, 52, 10, 14);
    g.strokeEllipse(95, 52, 10, 14);
    g.strokeEllipse(55, 52, 10, 14);

    // Rücken-Schuppen
    g.fillStyle(CUPHEAD_COLORS.GREEN_DARK, 1);
    for (let x = 50; x < 100; x += 14) {
      g.fillTriangle(x, 22, x + 7, 10, x + 14, 22);
    }

    // Schnauze
    g.fillStyle(CUPHEAD_COLORS.GREEN_LIGHT, 1);
    g.beginPath();
    g.moveTo(55, 28);
    g.lineTo(8, 32);
    g.lineTo(8, 44);
    g.lineTo(55, 48);
    g.closePath();
    g.fillPath();
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokePath();

    // Kiefer-Linie
    g.lineStyle(2, CUPHEAD_COLORS.GREEN_DARK, 1);
    g.beginPath();
    g.moveTo(8, 38);
    g.lineTo(52, 38);
    g.strokePath();

    // Zähne
    g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    for (let x = 12; x < 50; x += 10) {
      g.fillTriangle(x, 32, x + 4, 37, x + 8, 32);
      g.fillTriangle(x, 44, x + 4, 39, x + 8, 44);
    }

    // Auge
    g.fillStyle(CUPHEAD_COLORS.GREEN_MED, 1);
    g.fillCircle(48, 24, 10);
    g.fillStyle(CUPHEAD_COLORS.YELLOW, 1);
    g.fillCircle(48, 24, 7);
    g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    g.fillEllipse(48, 24, 2, 6);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeCircle(48, 24, 10);

    // Nüstern
    g.fillStyle(CUPHEAD_COLORS.GREEN_DARK, 1);
    g.fillCircle(12, 34, 3);
    g.fillCircle(12, 42, 3);

    // Bauch
    g.fillStyle(CUPHEAD_COLORS.GREEN_LIGHT, 0.5);
    g.fillEllipse(75, 44, 30, 10);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadButterfly(key, color) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 65, h = 55;
    const cx = w / 2, cy = h / 2;

    // Obere Flügel
    g.fillStyle(color, 1);
    g.fillEllipse(cx - 16, cy - 8, 16, 14);
    g.fillEllipse(cx + 16, cy - 8, 16, 14);

    // Untere Flügel
    g.fillEllipse(cx - 12, cy + 12, 12, 12);
    g.fillEllipse(cx + 12, cy + 12, 12, 12);

    // Muster
    g.fillStyle(CUPHEAD_COLORS.WHITE, 0.6);
    g.fillCircle(cx - 16, cy - 8, 6);
    g.fillCircle(cx + 16, cy - 8, 6);
    g.fillCircle(cx - 12, cy + 12, 5);
    g.fillCircle(cx + 12, cy + 12, 5);

    // Outlines
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeEllipse(cx - 16, cy - 8, 16, 14);
    g.strokeEllipse(cx + 16, cy - 8, 16, 14);
    g.strokeEllipse(cx - 12, cy + 12, 12, 12);
    g.strokeEllipse(cx + 12, cy + 12, 12, 12);

    // Körper
    g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    g.fillEllipse(cx, cy, 5, 16);
    g.fillCircle(cx, cy - 14, 5);

    // Fühler
    g.lineStyle(2, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.moveTo(cx - 2, cy - 16);
    g.lineTo(cx - 10, cy - 24);
    g.strokePath();
    g.beginPath();
    g.moveTo(cx + 2, cy - 16);
    g.lineTo(cx + 10, cy - 24);
    g.strokePath();
    g.fillCircle(cx - 10, cy - 24, 3);
    g.fillCircle(cx + 10, cy - 24, 3);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadChest(key, isOpen) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 80, h = isOpen ? 80 : 65;
    const cx = w / 2;

    if (isOpen) {
      // Deckel (offen)
      g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
      g.fillRoundedRect(8, 5, 64, 25, { tl: 10, tr: 10, bl: 0, br: 0 });
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillRect(12, 10, 56, 5);
      g.fillRect(12, 20, 56, 5);

      // Truhen-Körper
      g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
      g.fillRoundedRect(8, 30, 64, 45, 6);

      // Innenraum
      g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
      g.fillRect(14, 34, 52, 22);

      // Gold
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      for (let i = 0; i < 5; i++) g.fillCircle(20 + i * 10, 48, 7);
      for (let i = 0; i < 4; i++) g.fillCircle(25 + i * 10, 40, 6);
      g.fillStyle(CUPHEAD_COLORS.YELLOW, 0.5);
      for (let i = 0; i < 5; i++) g.fillCircle(18 + i * 10, 46, 3);

      // Beschläge
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillRect(12, 58, 56, 6);
      g.fillRect(12, 70, 56, 4);

    } else {
      // Deckel (geschlossen)
      g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
      g.fillRoundedRect(8, 8, 64, 22, { tl: 12, tr: 12, bl: 0, br: 0 });
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillRect(12, 14, 56, 5);
      g.fillRect(12, 24, 56, 4);

      // Körper
      g.fillStyle(CUPHEAD_COLORS.BROWN_MED, 1);
      g.fillRoundedRect(8, 28, 64, 32, 6);
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillRect(12, 38, 56, 5);
      g.fillRect(12, 52, 56, 4);

      // Schloss
      g.fillStyle(CUPHEAD_COLORS.GOLD, 1);
      g.fillRoundedRect(cx - 10, 24, 20, 16, 4);
      g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
      g.fillRoundedRect(cx - 7, 27, 14, 10, 3);
      g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
      g.fillCircle(cx, 31, 3);
      g.fillRect(cx - 2, 31, 4, 5);
    }

    // Ecken
    g.fillStyle(CUPHEAD_COLORS.BROWN_DARK, 1);
    g.fillCircle(14, 34, 5);
    g.fillCircle(66, 34, 5);
    g.fillCircle(14, h - 8, 5);
    g.fillCircle(66, h - 8, 5);

    // Outlines
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeRoundedRect(8, isOpen ? 5 : 8, 64, isOpen ? 25 : 22, 10);
    g.strokeRoundedRect(8, isOpen ? 30 : 28, 64, isOpen ? 45 : 32, 6);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  createCupheadFlower(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const size = 40;
    const cx = size / 2, cy = size / 2;

    // Stiel
    g.fillStyle(CUPHEAD_COLORS.GREEN_MED, 1);
    g.fillRect(cx - 3, cy, 6, size / 2);
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeRect(cx - 3, cy, 6, size / 2);

    // Blütenblätter
    g.fillStyle(CUPHEAD_COLORS.PINK, 1);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const px = cx + Math.cos(angle) * 10;
      const py = cy - 6 + Math.sin(angle) * 10;
      g.fillCircle(px, py, 8);
    }

    // Blüten-Outlines
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const px = cx + Math.cos(angle) * 10;
      const py = cy - 6 + Math.sin(angle) * 10;
      g.strokeCircle(px, py, 8);
    }

    // Mitte
    g.fillStyle(CUPHEAD_COLORS.YELLOW, 1);
    g.fillCircle(cx, cy - 6, 7);
    g.strokeCircle(cx, cy - 6, 7);

    // Gesicht (Cuphead Style!)
    g.fillStyle(CUPHEAD_COLORS.BLACK, 1);
    g.fillCircle(cx - 3, cy - 8, 2);
    g.fillCircle(cx + 3, cy - 8, 2);
    g.lineStyle(1.5, CUPHEAD_COLORS.BLACK, 1);
    g.beginPath();
    g.arc(cx, cy - 4, 3, 0.2, Math.PI - 0.2);
    g.strokePath();

    g.generateTexture(key, size, size);
    g.destroy();
  }

  createCupheadTooth(key) {
    const g = this.make.graphics({ x: 0, y: 0 });
    const w = 12, h = 18;

    // Zahn
    g.fillStyle(CUPHEAD_COLORS.WHITE, 1);
    g.fillTriangle(w / 2, h, 1, 2, w - 1, 2);

    // Outline
    g.lineStyle(OUTLINE, CUPHEAD_COLORS.BLACK, 1);
    g.strokeTriangle(w / 2, h, 1, 2, w - 1, 2);

    // Schatten
    g.fillStyle(CUPHEAD_COLORS.CREAM, 1);
    g.fillTriangle(w / 2, h, w / 2, 3, w - 2, 3);

    g.generateTexture(key, w, h);
    g.destroy();
  }
}
