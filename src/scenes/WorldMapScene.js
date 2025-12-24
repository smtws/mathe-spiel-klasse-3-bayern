import Phaser from 'phaser';
import { TEXT_STYLES, COLORS, GAME_CONSTANTS, CUPHEAD_OUTLINE } from '../config.js';
import { SaveManager } from '../managers/SaveManager.js';
import { JungleGraphics } from '../utils/JungleGraphics.js';

/**
 * CUPHEAD STYLE WORLD MAP
 * 1930er Cartoon-Weltkarte mit Vintage-Look
 */
export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldMapScene' });
  }

  create() {
    console.log('=== WorldMapScene create() START ===');
    const { width, height } = this.scale;

    // Kamera einblenden
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this.cameras.main.setBackgroundColor(0x2E8B2E); // Brillantes Dschungelgrün

    this.saveManager = new SaveManager();
    this.saveData = this.saveManager.load();
    console.log('SaveData geladen:', this.saveData);

    // Aktuelles Kapitel - muss freigeschaltet sein
    const savedChapter = this.saveData.progress.currentChapter || 1;
    // Finde das höchste freigeschaltete Kapitel (max. savedChapter)
    this.selectedChapter = 1;
    for (let i = savedChapter; i >= 1; i--) {
      if (this.isChapterUnlocked(i)) {
        this.selectedChapter = i;
        break;
      }
    }

    // Kapitel-Daten (10 Dschungel + 2 Ranger-Station)
    this.chapterData = {
      // === DSCHUNGEL (3. Klasse) ===
      1: { name: 'Fluss-Anfang', boss: 'krokodil', color: COLORS.BLUE, theme: 'jungle' },
      2: { name: 'Wasserfälle', boss: 'piranha', color: 0x00CED1, theme: 'jungle' },
      3: { name: 'Affenfelsen', boss: 'gorilla', color: COLORS.BROWN_MED, theme: 'jungle' },
      4: { name: 'Lianen-Pfad', boss: 'schlange', color: COLORS.GREEN_DARK, theme: 'jungle' },
      5: { name: 'Sumpfgebiet', boss: 'alligator', color: 0x556B2F, theme: 'jungle' },
      6: { name: 'Tempel-Ruinen', boss: 'papagei', color: 0xDAA520, theme: 'jungle' },
      7: { name: 'Spiegelhöhle', boss: 'jaguar', color: 0x4B0082, theme: 'jungle' },
      8: { name: 'Expeditions-Lager', boss: 'tukan', color: 0xFF8C00, theme: 'jungle' },
      9: { name: 'Handelsposten', boss: 'affe', color: COLORS.GOLD, theme: 'jungle' },
      10: { name: 'Goldener Tempel', boss: 'sphinx', color: 0xFFD700, theme: 'jungle' },
      // === RANGER-STATION (4. Klasse Bonus) ===
      11: { name: 'Ranger-Ausbildung', boss: 'loewe', color: 0xCD853F, theme: 'ranger' },
      12: { name: 'Safari-Meister', boss: 'elefant', color: 0x808080, theme: 'ranger' }
    };

    console.log('WorldMapScene gestartet', this.saveData);

    // Container für dynamischen Inhalt
    this.mapContainer = this.add.container(0, 0);

    // CUPHEAD STYLE Hintergrund
    this.createCupheadMapBackground();

    // Titel
    this.add.text(width / 2, 40, 'Dschungel-Expedition', TEXT_STYLES.TITLE)
      .setOrigin(0.5)
      .setFontSize(36);

    // Kapitel-Tabs erstellen
    this.createChapterTabs();

    // Statistik-Anzeige
    this.createStatsDisplay();

    // Level-Marker erstellen
    this.createLevelMarkers();

    // Charakter auf der Karte
    this.createMapCharacter();

    // Zurück zum Menü Button
    this.createBackButton();

    // Vollbild-Toggle
    this.createFullscreenToggle();
  }

  createChapterTabs() {
    const { width, height } = this.scale;
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    // Dschungel-Kapitel Container (unter dem Titel)
    this.chapterTabsContainer = this.add.container(width / 2, 90);

    // Alle Kapitel-Daten sammeln
    const chapters = [];
    for (let i = 1; i <= 12; i++) {
      const chapterInfo = this.chapterData[i];
      chapters.push({
        num: i,
        name: chapterInfo.name,
        unlocked: this.isChapterUnlocked(i),
        theme: chapterInfo.theme
      });
    }

    // Dschungel-Tabs: 2 Reihen à 5 Kapitel - mit korrektem Padding
    // Padding: 5px horizontal, 10px vertikal -> Height 34px (12px Font + 2x10px + 2px)
    const tabWidth = 135;
    const tabSpacing = 6;
    const tabHeight = 34;
    const rowSpacing = 42;

    // Reihe 1: Kapitel 1-5
    const row1Chapters = chapters.slice(0, 5);
    const row1Width = row1Chapters.length * tabWidth + (row1Chapters.length - 1) * tabSpacing;
    const row1StartX = -row1Width / 2 + tabWidth / 2;

    row1Chapters.forEach((chapter, index) => {
      const x = row1StartX + index * (tabWidth + tabSpacing);
      const y = 0;
      this.createChapterTab(chapter, x, y, tabWidth, tabHeight, OUTLINE, false);
    });

    // Reihe 2: Kapitel 6-10
    const row2Chapters = chapters.slice(5, 10);
    const row2Width = row2Chapters.length * tabWidth + (row2Chapters.length - 1) * tabSpacing;
    const row2StartX = -row2Width / 2 + tabWidth / 2;

    row2Chapters.forEach((chapter, index) => {
      const x = row2StartX + index * (tabWidth + tabSpacing);
      const y = rowSpacing;
      this.createChapterTab(chapter, x, y, tabWidth, tabHeight, OUTLINE, false);
    });

    // Ranger-Kapitel 11-12 - auf dem Patio der Station
    // Station ist bei: stationY = height - 360, Patio bei stationY + 50 = height - 310
    this.rangerTabsContainer = this.add.container(width - 130, height - 295);

    const rangerChapters = chapters.slice(10, 12);
    const rangerTabWidth = 145;
    const rangerTabHeight = 34; // Gleiches Padding wie Dschungel-Tabs

    rangerChapters.forEach((chapter, index) => {
      const x = 0;
      const y = index * (rangerTabHeight + 5);
      this.createChapterTab(chapter, x, y, rangerTabWidth, rangerTabHeight, OUTLINE, true, this.rangerTabsContainer);
    });
  }

  createChapterTab(chapter, x, y, tabWidth, tabHeight, OUTLINE, isRanger = false, container = null) {
    const targetContainer = container || this.chapterTabsContainer;
    const isUnlocked = chapter.unlocked;
    // Nur freigeschaltete Kapitel können ausgewählt sein
    const isSelected = isUnlocked && (this.selectedChapter === chapter.num);

    // Farben: Aktiv = Dunkelgrün, Freigeschaltet = Braun, Gesperrt = Grau
    let bgColor, strokeColor, textColor;
    if (!isUnlocked) {
      // Gesperrt: Grau mit dunkelgrauem Rand
      bgColor = 0x888888;
      strokeColor = 0x555555;
      textColor = '#1a1a1a';
    } else if (isSelected) {
      // Aktiv/Ausgewählt: Dunkelgrün
      bgColor = 0x2E7D32;
      strokeColor = COLORS.BLACK;
      textColor = '#ffffff';
    } else {
      // Freigeschaltet aber nicht ausgewählt: Braun
      bgColor = isRanger ? 0x8B7355 : COLORS.BROWN_MED;
      strokeColor = COLORS.BLACK;
      textColor = '#ffffff';
    }

    const tabBg = this.add.rectangle(x, y, tabWidth, tabHeight, bgColor, isSelected ? 1 : 0.85);
    tabBg.setStrokeStyle(OUTLINE, strokeColor);

    // Tab-Text
    const displayText = `${chapter.num}. ${chapter.name}`;
    const tabText = this.add.text(x, y, displayText, {
      fontSize: '12px',
      fontFamily: 'Arial Black, Arial, sans-serif',
      color: textColor
    }).setOrigin(0.5);

    targetContainer.add([tabBg, tabText]);

    // Interaktivität
    if (isUnlocked) {
      tabBg.setInteractive({ useHandCursor: true });

      tabBg.on('pointerover', () => {
        if (this.selectedChapter !== chapter.num) {
          tabBg.setFillStyle(0x3E8E41, 0.8); // Helleres Grün beim Hover
        }
      });

      tabBg.on('pointerout', () => {
        if (this.selectedChapter !== chapter.num) {
          tabBg.setFillStyle(isRanger ? 0x8B7355 : COLORS.BROWN_MED, 0.85);
        }
      });

      tabBg.on('pointerdown', () => {
        if (this.selectedChapter !== chapter.num) {
          this.selectedChapter = chapter.num;
          this.refreshMap();
        }
      });
    }
  }

  showChapterTooltip(x, y, text) {
    this.hideChapterTooltip();
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    this.chapterTooltip = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, text.length * 7 + 20, 24, COLORS.CREAM, 0.95)
      .setStrokeStyle(2, COLORS.BLACK);
    const tooltipText = this.add.text(0, 0, text, {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#1a1a1a'
    }).setOrigin(0.5);

    this.chapterTooltip.add([bg, tooltipText]);
    this.chapterTabsContainer.add(this.chapterTooltip);
  }

  hideChapterTooltip() {
    if (this.chapterTooltip) {
      this.chapterTooltip.destroy();
      this.chapterTooltip = null;
    }
  }

  isChapterUnlocked(chapterNum) {
    if (chapterNum === 1) return true;

    // Kapitel ist freigeschaltet, wenn der Boss des vorherigen Kapitels besiegt wurde
    const prevBosses = {
      2: 'krokodil', 3: 'piranha', 4: 'gorilla', 5: 'schlange',
      6: 'alligator', 7: 'papagei', 8: 'jaguar', 9: 'tukan',
      10: 'affe', 11: 'sphinx', 12: 'loewe'
    };
    const prevBoss = prevBosses[chapterNum];

    return this.saveData.progress.bossesDefeated.includes(prevBoss);
  }

  refreshMap() {
    // Speicherdaten neu laden
    this.saveData = this.saveManager.load();

    // Entferne alte Level-Marker und Charakter
    if (this.levelMarkersContainer) {
      this.levelMarkersContainer.destroy();
    }
    if (this.mapCharacter) {
      this.mapCharacter.destroy();
    }
    if (this.chapterTabsContainer) {
      this.chapterTabsContainer.destroy();
    }
    if (this.rangerTabsContainer) {
      this.rangerTabsContainer.destroy();
    }

    // Neu erstellen
    this.createChapterTabs();
    this.createLevelMarkers();
    this.createMapCharacter();
  }

  createFullscreenToggle() {
    const { width } = this.scale;
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    // Cuphead-style button
    const fsBtn = this.add.container(width - 35, 35);

    const fsBg = this.add.circle(0, 0, 22, COLORS.BROWN_MED);
    const fsOutline = this.add.circle(0, 0, 22);
    fsOutline.setStrokeStyle(OUTLINE, COLORS.BLACK);

    const fsText = this.add.text(0, 0, '⛶', {
      fontSize: '24px',
      color: '#f5f0e1'
    }).setOrigin(0.5);

    fsBtn.add([fsBg, fsOutline, fsText]);
    fsBg.setInteractive({ useHandCursor: true });

    fsBg.on('pointerover', () => {
      fsBg.setFillStyle(COLORS.GOLD);
      this.tweens.add({ targets: fsBtn, scale: 1.1, duration: 100 });
    });
    fsBg.on('pointerout', () => {
      fsBg.setFillStyle(COLORS.BROWN_MED);
      this.tweens.add({ targets: fsBtn, scale: 1, duration: 100 });
    });
    fsBg.on('pointerdown', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });
  }

  createCupheadMapBackground() {
    const { width, height } = this.scale;
    const g = this.add.graphics();
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    // Dschungel-Hintergrund (saftiges Grün statt Beige)
    this.createJungleGround(g);

    // Kartenrand (wie gerollte Schatzkarte)
    this.createMapBorder(g, OUTLINE);

    // Dschungel-Hügel im Hintergrund
    this.createCupheadHills(g, OUTLINE);

    // Fluss mit geschwungenen Kurven
    this.createCupheadRiver(g, OUTLINE);

    // Büsche und Vegetation im Hintergrund
    this.createJungleBushes(g);

    // Palmen und Dschungel-Bäume
    this.createJungleTrees(g, OUTLINE);

    // Pfad zwischen den Leveln
    this.createCupheadPath(g, OUTLINE);

    // Dekorative Elemente (Kompass, Blumen)
    this.createMapDecorations(g, OUTLINE);

    // Lianen am Rand
    this.createVines(g);

    // Ranger-Station am rechten Rand (für Bonus-Kapitel)
    this.createRangerStation(g, OUTLINE);

    // Vignette-Effekt
    this.createMapVignette();
  }

  createJungleGround(g) {
    const { width, height } = this.scale;

    // Basis-Grün (Dschungelboden) - noch satter und brillanter
    g.fillStyle(0x2E8B2E, 1);
    g.fillRect(0, 0, width, height);

    // Hellerer Bereich oben (Himmel durch Blätterdach) - dezent
    g.fillStyle(0x90EE90, 0.1);
    g.fillRect(0, 0, width, 120);

    // Gras-Textur - kräftiger und satter
    g.fillStyle(0x3CB371, 0.7);
    for (let x = 0; x < width; x += 50) {
      for (let y = 180; y < height - 120; y += 70) {
        const offset = (y % 140 === 0) ? 25 : 0;
        g.fillEllipse(x + offset + Math.random() * 20, y, 30, 15);
      }
    }

    // Erdiger Pfadbereich unten - satter Braunton
    g.fillStyle(0x8B4513, 1);
    g.fillRoundedRect(50, height - 180, width - 100, 140, 20);

    // Hellere Erde - Akzent
    g.fillStyle(0xCD853F, 0.8);
    g.fillRoundedRect(70, height - 170, width - 140, 120, 15);
  }

  createMapBorder(g, OUTLINE) {
    const { width, height } = this.scale;

    // Holzrahmen-Effekt
    g.fillStyle(0x5D4037, 1);
    g.fillRect(0, 0, width, 12);
    g.fillRect(0, height - 12, width, 12);
    g.fillRect(0, 0, 12, height);
    g.fillRect(width - 12, 0, 12, height);

    // Innere Holzmaserung
    g.fillStyle(0x795548, 0.7);
    g.fillRect(2, 2, width - 4, 8);
    g.fillRect(2, height - 10, width - 4, 8);
    g.fillRect(2, 2, 8, height - 4);
    g.fillRect(width - 10, 2, 8, height - 4);

    // Goldene Nägel/Verzierungen an den Ecken
    const cornerSize = 18;
    const corners = [[15, 15], [width - 15, 15], [15, height - 15], [width - 15, height - 15]];
    corners.forEach(([x, y]) => {
      g.fillStyle(0x8B4513, 1);
      g.fillCircle(x, y, cornerSize);
      g.lineStyle(2, 0x3E2723, 1);
      g.strokeCircle(x, y, cornerSize);
      g.fillStyle(0xFFD700, 1);
      g.fillCircle(x, y, cornerSize - 6);
      g.lineStyle(1, 0xB8860B, 1);
      g.strokeCircle(x, y, cornerSize - 6);

      // Glanzpunkt
      g.fillStyle(0xFFFFFF, 0.4);
      g.fillCircle(x - 3, y - 3, 4);
    });
  }

  createCupheadHills(g, OUTLINE) {
    const { width, height } = this.scale;

    // Hügel im Hintergrund - kräftig dunkelgrün
    g.fillStyle(0x006400, 1);

    // Hügel-Reihe hinten
    for (let i = 0; i < 5; i++) {
      const x = i * (width / 4) + Phaser.Math.Between(-30, 30);
      const y = 120;
      const size = 80 + Phaser.Math.Between(0, 40);
      g.fillEllipse(x, y + size / 2, size, size);
    }

    // Hügel-Reihe vorne - satter
    g.fillStyle(0x228B22, 1);
    for (let i = 0; i < 6; i++) {
      const x = i * (width / 5) + 50 + Phaser.Math.Between(-20, 20);
      const y = 160;
      const size = 60 + Phaser.Math.Between(0, 30);
      g.fillEllipse(x, y + size / 2, size, size);
    }
  }

  createCupheadRiver(g, OUTLINE) {
    const { width, height } = this.scale;

    const riverY = height * 0.4;

    // Hilfsfunktion: Berechne Punkt auf kubischer Bezier-Kurve
    const bezierPoint = (t, p0, p1, p2, p3) => {
      const u = 1 - t;
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    };

    // Kurve mit Segmenten zeichnen
    const drawBezierSegments = (startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, segments = 8) => {
      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const x = bezierPoint(t, startX, cp1x, cp2x, endX);
        const y = bezierPoint(t, startY, cp1y, cp2y, endY);
        g.lineTo(x, y);
      }
    };

    // Fluss als gefüllte Form mit Kurven
    g.fillStyle(0x4a90d9, 0.9);
    g.beginPath();
    g.moveTo(-10, riverY + 30);

    // Obere Kurve des Flusses (geschwungen)
    drawBezierSegments(-10, riverY + 30, width * 0.2, riverY - 40, width * 0.35, riverY + 50, width * 0.5, riverY - 20);
    drawBezierSegments(width * 0.5, riverY - 20, width * 0.65, riverY - 60, width * 0.8, riverY + 30, width + 10, riverY - 40);

    // Untere Kurve (zurück)
    g.lineTo(width + 10, riverY + 20);
    drawBezierSegments(width + 10, riverY + 20, width * 0.8, riverY + 80, width * 0.65, riverY, width * 0.5, riverY + 40);
    drawBezierSegments(width * 0.5, riverY + 40, width * 0.35, riverY + 100, width * 0.2, riverY + 20, -10, riverY + 80);
    g.closePath();
    g.fillPath();

    // Hellere Strömung in der Mitte
    g.fillStyle(0x6bb3f0, 0.5);
    g.beginPath();
    g.moveTo(-10, riverY + 45);
    drawBezierSegments(-10, riverY + 45, width * 0.2, riverY - 20, width * 0.35, riverY + 60, width * 0.5, riverY);
    drawBezierSegments(width * 0.5, riverY, width * 0.65, riverY - 40, width * 0.8, riverY + 50, width + 10, riverY - 20);
    g.lineTo(width + 10, riverY);
    drawBezierSegments(width + 10, riverY, width * 0.8, riverY + 60, width * 0.65, riverY + 10, width * 0.5, riverY + 30);
    drawBezierSegments(width * 0.5, riverY + 30, width * 0.35, riverY + 80, width * 0.2, riverY + 10, -10, riverY + 65);
    g.closePath();
    g.fillPath();

    // Wellen-Glanzlichter
    g.fillStyle(0xffffff, 0.3);
    for (let w = 0; w < 12; w++) {
      const wx = 80 + w * (width / 10);
      const wy = riverY + Math.sin(w * 0.8) * 25;
      g.fillEllipse(wx, wy, 20 + Math.random() * 15, 6);
    }

    // Ufer-Schatten
    g.lineStyle(4, 0x2d5a3d, 0.6);
    g.beginPath();
    g.moveTo(-10, riverY + 85);
    drawBezierSegments(-10, riverY + 85, width * 0.2, riverY + 25, width * 0.35, riverY + 105, width * 0.5, riverY + 45);
    drawBezierSegments(width * 0.5, riverY + 45, width * 0.65, riverY + 5, width * 0.8, riverY + 85, width + 10, riverY + 25);
    g.strokePath();
  }

  createJungleBushes(g) {
    const { width, height } = this.scale;
    // Nutze gemeinsame Utility, Flussbereich bei height * 0.4 ausschließen
    JungleGraphics.drawBushes(g, width, height, 20, height * 0.4);
  }

  createJungleTrees(g, OUTLINE) {
    const { width, height } = this.scale;

    // Palmen an verschiedenen Positionen
    const treePositions = [
      { x: 60, y: height - 100, type: 'palm', scale: 1 },
      { x: 180, y: 180, type: 'palm', scale: 0.8 },
      { x: width - 80, y: height - 90, type: 'palm', scale: 1.1 },
      { x: width - 150, y: 200, type: 'palm', scale: 0.7 },
      { x: width / 2 - 100, y: 160, type: 'jungle', scale: 0.9 },
      { x: width / 2 + 150, y: 170, type: 'jungle', scale: 0.8 },
      { x: 100, y: 200, type: 'jungle', scale: 0.7 },
      { x: width - 200, y: height - 120, type: 'palm', scale: 0.9 },
    ];

    treePositions.forEach(tree => {
      if (tree.type === 'palm') {
        JungleGraphics.drawPalmTree(g, tree.x, tree.y, tree.scale);
      } else {
        JungleGraphics.drawJungleTree(g, tree.x, tree.y, tree.scale);
      }
    });
  }

  createVines(g) {
    const { width } = this.scale;
    JungleGraphics.drawVines(g, [
      { x: 30, length: 200 },
      { x: 70, length: 150 },
      { x: width - 30, length: 180 },
      { x: width - 60, length: 220 },
    ]);
  }

  createRangerStation(g, OUTLINE) {
    const { width, height } = this.scale;

    // Position: rechts am Fluss, tiefer für bessere Sichtbarkeit
    const stationX = width - 130;
    const stationY = height - 360;

    // Fundament / Patio (Holzboden)
    g.fillStyle(0x8B4513, 1);
    g.fillRoundedRect(stationX - 80, stationY + 50, 160, 40, 5);
    g.lineStyle(OUTLINE, 0x1a1a1a, 1);
    g.strokeRoundedRect(stationX - 80, stationY + 50, 160, 40, 5);

    // Holzplanken auf dem Patio
    g.lineStyle(1, 0x5D4037, 0.5);
    for (let px = stationX - 75; px < stationX + 75; px += 15) {
      g.beginPath();
      g.moveTo(px, stationY + 52);
      g.lineTo(px, stationY + 88);
      g.strokePath();
    }

    // Haupt-Gebäude (Holzhütte)
    g.fillStyle(0xA0522D, 1);
    g.fillRect(stationX - 55, stationY - 20, 110, 75);
    g.lineStyle(OUTLINE, 0x1a1a1a, 1);
    g.strokeRect(stationX - 55, stationY - 20, 110, 75);

    // Horizontale Holzbalken
    g.lineStyle(2, 0x8B4513, 0.7);
    for (let py = stationY - 10; py < stationY + 50; py += 12) {
      g.beginPath();
      g.moveTo(stationX - 53, py);
      g.lineTo(stationX + 53, py);
      g.strokePath();
    }

    // Dach (Wellblech/Zink-Look)
    g.fillStyle(0x696969, 1);
    g.beginPath();
    g.moveTo(stationX - 70, stationY - 18);
    g.lineTo(stationX, stationY - 55);
    g.lineTo(stationX + 70, stationY - 18);
    g.closePath();
    g.fillPath();
    g.lineStyle(OUTLINE, 0x1a1a1a, 1);
    g.strokePath();

    // Dach-Streifen (Wellblech-Effekt)
    g.lineStyle(1, 0x505050, 0.5);
    for (let i = 0; i < 6; i++) {
      const rx = stationX - 50 + i * 20;
      g.beginPath();
      g.moveTo(rx, stationY - 20);
      g.lineTo(stationX, stationY - 52);
      g.strokePath();
    }

    // Fenster
    g.fillStyle(0x87CEEB, 0.8);
    g.fillRect(stationX - 40, stationY, 25, 20);
    g.fillRect(stationX + 15, stationY, 25, 20);
    g.lineStyle(2, 0x1a1a1a, 1);
    g.strokeRect(stationX - 40, stationY, 25, 20);
    g.strokeRect(stationX + 15, stationY, 25, 20);

    // Fensterkreuz
    g.lineStyle(2, 0x5D4037, 1);
    g.beginPath();
    g.moveTo(stationX - 27.5, stationY);
    g.lineTo(stationX - 27.5, stationY + 20);
    g.moveTo(stationX - 40, stationY + 10);
    g.lineTo(stationX - 15, stationY + 10);
    g.moveTo(stationX + 27.5, stationY);
    g.lineTo(stationX + 27.5, stationY + 20);
    g.moveTo(stationX + 15, stationY + 10);
    g.lineTo(stationX + 40, stationY + 10);
    g.strokePath();

    // Tür
    g.fillStyle(0x5D4037, 1);
    g.fillRect(stationX - 12, stationY + 15, 24, 40);
    g.lineStyle(2, 0x1a1a1a, 1);
    g.strokeRect(stationX - 12, stationY + 15, 24, 40);

    // Türknauf
    g.fillStyle(0xFFD700, 1);
    g.fillCircle(stationX + 8, stationY + 35, 3);

    // Schild "RANGER STATION" - zwischen Fenster und Dach
    g.fillStyle(0xF5DEB3, 1);
    g.fillRoundedRect(stationX - 50, stationY - 15, 100, 18, 3);
    g.lineStyle(2, 0x8B4513, 1);
    g.strokeRoundedRect(stationX - 50, stationY - 15, 100, 18, 3);

    // Schild-Text wird als Phaser Text hinzugefügt
    this.add.text(stationX, stationY - 6, 'RANGER STATION', {
      fontSize: '9px',
      fontFamily: 'Arial Black, Arial, sans-serif',
      color: '#5D4037'
    }).setOrigin(0.5);

    // Pfosten für Vordach
    g.fillStyle(0x8B4513, 1);
    g.fillRect(stationX - 70, stationY + 20, 8, 35);
    g.fillRect(stationX + 62, stationY + 20, 8, 35);
    g.lineStyle(2, 0x1a1a1a, 1);
    g.strokeRect(stationX - 70, stationY + 20, 8, 35);
    g.strokeRect(stationX + 62, stationY + 20, 8, 35);

    // Kleine Palme neben der Station
    JungleGraphics.drawPalmTree(g, stationX + 95, stationY + 70, 0.6);
  }

  createCupheadPath(g, OUTLINE) {
    const { width, height } = this.scale;

    // Pfad-Positionen: 5 Level + Boss im braunen Beet
    this.levelPositions = [
      { x: 150, y: height - 150 },
      { x: 300, y: height - 220 },
      { x: 470, y: height - 180 },
      { x: 640, y: height - 240 },
      { x: 810, y: height - 200 },
      { x: 930, y: height - 110 }  // Boss-Position im braunen Bereich
    ];

    // Pfad als gestrichelte Linie (Cuphead Style)
    g.lineStyle(10, COLORS.BROWN_MED, 1);

    for (let i = 0; i < this.levelPositions.length - 1; i++) {
      const from = this.levelPositions[i];
      const to = this.levelPositions[i + 1];

      // Gestrichelte Linie
      const segments = 8;
      for (let j = 0; j < segments; j += 2) {
        const startX = from.x + (to.x - from.x) * (j / segments);
        const startY = from.y + (to.y - from.y) * (j / segments);
        const endX = from.x + (to.x - from.x) * ((j + 1) / segments);
        const endY = from.y + (to.y - from.y) * ((j + 1) / segments);

        g.fillStyle(COLORS.BROWN_LIGHT, 1);
        g.fillCircle(startX, startY, 6);
        g.fillCircle(endX, endY, 6);

        g.lineStyle(8, COLORS.BROWN_LIGHT, 1);
        g.beginPath();
        g.moveTo(startX, startY);
        g.lineTo(endX, endY);
        g.strokePath();
      }
    }

    // Pfad-Outline
    g.lineStyle(OUTLINE, COLORS.BLACK, 0.5);
    for (let i = 0; i < this.levelPositions.length - 1; i++) {
      const from = this.levelPositions[i];
      const to = this.levelPositions[i + 1];

      const segments = 8;
      for (let j = 0; j < segments; j += 2) {
        const startX = from.x + (to.x - from.x) * (j / segments);
        const startY = from.y + (to.y - from.y) * (j / segments);
        const endX = from.x + (to.x - from.x) * ((j + 1) / segments);
        const endY = from.y + (to.y - from.y) * ((j + 1) / segments);

        g.strokeCircle(startX, startY, 6);
        g.strokeCircle(endX, endY, 6);
      }
    }
  }

  createMapDecorations(g, OUTLINE) {
    const { width, height } = this.scale;

    // Kompass oben rechts
    const compassX = width - 100;
    const compassY = 100;

    g.fillStyle(COLORS.CREAM, 1);
    g.fillCircle(compassX, compassY, 35);
    g.lineStyle(OUTLINE, COLORS.BLACK, 1);
    g.strokeCircle(compassX, compassY, 35);
    g.strokeCircle(compassX, compassY, 30);

    // Kompass-Nadel
    g.fillStyle(COLORS.RED, 1);
    g.fillTriangle(compassX, compassY - 25, compassX - 8, compassY, compassX + 8, compassY);
    g.fillStyle(COLORS.BLACK, 1);
    g.fillTriangle(compassX, compassY + 25, compassX - 8, compassY, compassX + 8, compassY);

    // N, S, E, W
    const compassFont = { fontSize: '12px', color: '#1a1a1a', fontFamily: 'Arial Black' };
    this.add.text(compassX, compassY - 40, 'N', compassFont).setOrigin(0.5);

    // Kleine Blumen/Pilze verstreut
    for (let i = 0; i < 8; i++) {
      const fx = Phaser.Math.Between(50, width - 50);
      const fy = Phaser.Math.Between(height - 130, height - 50);
      this.createSmallFlower(g, fx, fy);
    }
  }

  createSmallFlower(g, x, y) {
    // Blumenstiel
    g.fillStyle(COLORS.GREEN_MED, 1);
    g.fillRect(x - 2, y, 4, 15);

    // Blüte
    g.fillStyle(COLORS.PINK, 1);
    g.fillCircle(x, y - 5, 8);
    g.fillStyle(COLORS.YELLOW, 1);
    g.fillCircle(x, y - 5, 4);
  }

  createMapVignette() {
    const { width, height } = this.scale;
    const vignette = this.add.graphics();

    // Dezente Verdunklung nur an den äußersten Rändern
    for (let i = 0; i < 2; i++) {
      const alpha = 0.01 + i * 0.01;
      vignette.fillStyle(COLORS.BLACK, alpha);
      vignette.fillRect(0, 0, 20 - i * 5, height);
      vignette.fillRect(width - 20 + i * 5, 0, 20 - i * 5, height);
      vignette.fillRect(0, 0, width, 20 - i * 5);
      vignette.fillRect(0, height - 20 + i * 5, width, 20 - i * 5);
    }
  }


  createStatsDisplay() {
    const inventory = this.saveData.inventory;
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    // Cuphead-Style Stats Panel - LINKS positioniert
    const statsContainer = this.add.container(80, 85);

    // Panel-Hintergrund
    const panelBg = this.add.rectangle(0, 15, 100, 70, COLORS.CREAM, 0.95);
    panelBg.setStrokeStyle(OUTLINE, COLORS.BLACK);

    // Münzen
    const coinIcon = this.add.image(-25, 0, 'coin').setScale(0.7);
    const coinText = this.add.text(15, 0, inventory.coins.toString(), TEXT_STYLES.SCORE)
      .setOrigin(0.5);

    // Sterne
    const starIcon = this.add.image(-25, 35, 'star_filled').setScale(0.7);
    const starText = this.add.text(15, 35, inventory.stars.toString(), TEXT_STYLES.SCORE)
      .setOrigin(0.5);

    statsContainer.add([panelBg, coinIcon, coinText, starIcon, starText]);
  }

  createLevelMarkers() {
    console.log('=== createLevelMarkers() für Kapitel', this.selectedChapter, '===');
    // Container für Level-Marker
    this.levelMarkersContainer = this.add.container(0, 0);

    // Level-Konfigurationen pro Kapitel (10 Dschungel + 2 Ranger)
    const allLevelConfigs = {
      // === KAPITEL 1: Einmaleins 1-5 ===
      1: [
        { level: 1, title: 'Erste Reihen', types: ['mult_1_5'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Zweier und Dreier', types: ['mult_1_5'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Vierer-Sprünge', types: ['mult_1_5'], difficulty: 'easy', questionCount: 8 },
        { level: 4, title: 'Fünfer-Reihe', types: ['mult_1_5'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Reihen-Mix 1-5', types: ['mult_1_5'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 2: Einmaleins 6-10 ===
      2: [
        { level: 1, title: 'Sechser-Reihe', types: ['mult_6_10'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Siebener-Reihe', types: ['mult_6_10'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Achter-Reihe', types: ['mult_6_10'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Neuner-Tricks', types: ['mult_6_10'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Zehner-Finale', types: ['mult_6_10'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 3: Division ===
      3: [
        { level: 1, title: 'Teilen lernen', types: ['division'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Gerechtes Teilen', types: ['division'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Bananen-Teilung', types: ['division'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Schatz-Verteilung', types: ['division'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Divisions-Meister', types: ['division', 'mult_1_5'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 4: Addition bis 1000 ===
      4: [
        { level: 1, title: 'Kleine Summen', types: ['addition'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Zehner addieren', types: ['addition'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Hunderter-Sprünge', types: ['addition'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Große Summen', types: ['addition'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Additions-Profi', types: ['addition'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 5: Subtraktion bis 1000 ===
      5: [
        { level: 1, title: 'Einfaches Abziehen', types: ['subtraction'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Zehner wegnehmen', types: ['subtraction'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Über die Hunderter', types: ['subtraction'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Knifflige Differenzen', types: ['subtraction'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Subtraktions-Profi', types: ['subtraction', 'addition'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 6: Ebene Figuren ===
      6: [
        { level: 1, title: 'Formen erkennen', types: ['geometry'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Ecken zählen', types: ['geometry'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Seiten und Kanten', types: ['geometry'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Rechte Winkel', types: ['geometry'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Formen-Meister', types: ['geometry'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 7: Körper & Symmetrie ===
      7: [
        { level: 1, title: 'Spiegelbilder', types: ['geometry'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Symmetrieachsen', types: ['geometry'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: '3D-Körper entdecken', types: ['geometry'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Würfel und Quader', types: ['geometry'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Geometrie-Experte', types: ['geometry'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 8: Längen messen ===
      8: [
        { level: 1, title: 'Zentimeter messen', types: ['measurement'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Meter und Zentimeter', types: ['measurement'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Kilometer-Strecken', types: ['measurement'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Längen umrechnen', types: ['measurement'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Mess-Profi', types: ['measurement'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 9: Zeit & Geld ===
      9: [
        { level: 1, title: 'Die Uhr lesen', types: ['time'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Zeitspannen', types: ['time'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Euro und Cent', types: ['money'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Rückgeld berechnen', types: ['money'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Zeit & Geld Profi', types: ['time', 'money'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 10: Textaufgaben-Mix ===
      10: [
        { level: 1, title: 'Einfache Geschichten', types: ['word_problem'], difficulty: 'easy', questionCount: 6 },
        { level: 2, title: 'Dschungel-Rätsel', types: ['word_problem'], difficulty: 'easy', questionCount: 8 },
        { level: 3, title: 'Knifflige Aufgaben', types: ['word_problem'], difficulty: 'normal', questionCount: 8 },
        { level: 4, title: 'Tempel-Mysterien', types: ['word_problem'], difficulty: 'normal', questionCount: 8 },
        { level: 5, title: 'Sphinx-Prüfung', types: ['word_problem'], difficulty: 'normal', questionCount: 10 }
      ],
      // === KAPITEL 11: Ranger-Ausbildung (4. Klasse) ===
      11: [
        { level: 1, title: 'Große Zahlen', types: ['addition', 'subtraction'], difficulty: 'hard', questionCount: 6 },
        { level: 2, title: 'Tausender-Rechnen', types: ['addition', 'subtraction'], difficulty: 'hard', questionCount: 8 },
        { level: 3, title: 'Kopfrechnen Plus', types: ['multiplication', 'division', 'addition'], difficulty: 'hard', questionCount: 8 },
        { level: 4, title: 'Safari-Mathematik', types: ['word_problem'], difficulty: 'hard', questionCount: 8 },
        { level: 5, title: 'Ranger-Prüfung', types: ['multiplication', 'division', 'addition', 'subtraction'], difficulty: 'hard', questionCount: 10 }
      ],
      // === KAPITEL 12: Safari-Meister (4. Klasse Finale) ===
      12: [
        { level: 1, title: 'Meister-Rechnen', types: ['multiplication', 'division', 'addition', 'subtraction'], difficulty: 'hard', questionCount: 8 },
        { level: 2, title: 'Experten-Geometrie', types: ['geometry'], difficulty: 'hard', questionCount: 8 },
        { level: 3, title: 'Profi-Messungen', types: ['measurement', 'time', 'money'], difficulty: 'hard', questionCount: 8 },
        { level: 4, title: 'Ultimative Textaufgaben', types: ['word_problem'], difficulty: 'hard', questionCount: 10 },
        { level: 5, title: 'Finale Herausforderung', types: ['multiplication', 'division', 'addition', 'subtraction', 'geometry', 'measurement', 'time', 'money', 'word_problem'], difficulty: 'hard', questionCount: 12 }
      ]
    };

    const levelConfigs = allLevelConfigs[this.selectedChapter] || allLevelConfigs[1];
    const bossIds = {
      1: 'krokodil', 2: 'piranha', 3: 'gorilla', 4: 'schlange', 5: 'alligator',
      6: 'papagei', 7: 'jaguar', 8: 'tukan', 9: 'affe', 10: 'sphinx',
      11: 'loewe', 12: 'elefant'
    };

    levelConfigs.forEach((config, index) => {
      const pos = this.levelPositions[index];
      this.createLevelMarker(pos.x, pos.y, config);
    });

    // Boss-Marker - im braunen Beet (Position 5)
    const bossPos = this.levelPositions[5];
    this.createBossMarker(bossPos.x, bossPos.y, bossIds[this.selectedChapter]);
  }

  createLevelMarker(x, y, config) {
    const chapter = this.selectedChapter;
    const isUnlocked = this.saveManager.isLevelUnlocked(chapter, config.level);
    const levelData = this.saveData.progress.completedLevels?.[`chapter${chapter}`]?.[`level${config.level}`];
    const isCompleted = !!levelData;
    const stars = levelData?.stars || 0;

    // Container für den Marker
    const container = this.add.container(x, y);
    this.levelMarkersContainer.add(container);

    // Marker-Hintergrund
    let markerKey = 'level_marker_locked';
    if (isCompleted) {
      markerKey = 'level_marker_complete';
    } else if (isUnlocked) {
      markerKey = 'level_marker';
    }

    const marker = this.add.image(0, 0, markerKey)
      .setScale(1.4);

    // Level-Nummer
    const levelText = this.add.text(0, 0, config.level.toString(), {
      ...TEXT_STYLES.BUTTON,
      fontSize: '24px',
      color: isUnlocked ? '#ffffff' : '#888888'
    }).setOrigin(0.5);

    container.add([marker, levelText]);

    // Sterne unter dem Marker (wenn abgeschlossen)
    if (isCompleted) {
      for (let i = 0; i < 3; i++) {
        const starKey = i < stars ? 'star_filled' : 'star_empty';
        const star = this.add.image(-20 + (i * 20), 35, starKey).setScale(0.5);
        container.add(star);
      }
    }

    // Interaktivität (wenn freigeschaltet)
    console.log(`Level ${config.level} - isUnlocked: ${isUnlocked}, isCompleted: ${isCompleted}, chapter: ${chapter}`);
    if (isUnlocked) {
      marker.setInteractive({ useHandCursor: true });

      marker.on('pointerover', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100
        });
        this.showLevelTooltip(x, y - 70, config.title);
      });

      marker.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100
        });
        this.hideTooltip();
      });

      marker.on('pointerdown', () => {
        console.log('Level clicked:', config.level, 'Chapter:', this.selectedChapter, 'Config:', config);
        this.startLevel(config, this.selectedChapter);
      });

      // Pulsier-Animation für nicht abgeschlossene Level
      if (!isCompleted) {
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
  }

  createBossMarker(x, y, bossId = 'krokodil') {
    const chapter = this.selectedChapter;
    const isBossUnlocked = this.saveManager.isBossUnlocked(chapter);
    const isBossDefeated = this.saveData.progress.bossesDefeated.includes(bossId);
    const bossImages = {
      krokodil: 'animal_krokodil',
      piranha: 'animal_piranha',
      gorilla: 'animal_gorilla',
      schlange: 'animal_schlange',
      alligator: 'animal_alligator',
      papagei: 'animal_papagei',
      jaguar: 'animal_jaguar',
      tukan: 'animal_tukan',
      affe: 'animal_affe',
      sphinx: 'animal_sphinx',
      loewe: 'animal_loewe',
      elefant: 'animal_elefant'
    };
    const bossNames = {
      krokodil: 'Krokodil-Kapitän',
      piranha: 'Piranha-Prinz',
      gorilla: 'Gorilla-Guru',
      schlange: 'Schlangen-Schamane',
      alligator: 'Alligator-Admiral',
      papagei: 'Papagei-Prophet',
      jaguar: 'Jaguar-Jäger',
      tukan: 'Tukan-Trainer',
      affe: 'Affen-Anführer',
      sphinx: 'Sphinx-Rätselmeister',
      loewe: 'Löwen-Lehrmeister',
      elefant: 'Elefanten-Experte'
    };
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    const container = this.add.container(x, y);
    this.levelMarkersContainer.add(container);

    // Cuphead-Style Boss-Hintergrund (größer mit Outline)
    const bgColor = isBossDefeated ? COLORS.GOLD : (isBossUnlocked ? COLORS.RED : 0x555555);
    const bg = this.add.circle(0, 0, 50, bgColor);
    const bgOutline = this.add.circle(0, 0, 50);
    bgOutline.setStrokeStyle(OUTLINE * 2, COLORS.BLACK);

    // Innerer Ring
    const innerRing = this.add.circle(0, 0, 42);
    innerRing.setStrokeStyle(2, isBossUnlocked ? COLORS.GOLD : COLORS.BROWN_DARK);

    // Boss-Bild
    const bossImage = this.add.image(0, 0, bossImages[bossId] || 'animal_krokodil')
      .setScale(0.75)
      .setAlpha(isBossUnlocked ? 1 : 0.5);

    // Boss-Label (Cuphead Style)
    const labelBg = this.add.rectangle(0, 68, 70, 25, COLORS.BLACK, 0.8);
    const label = this.add.text(0, 68, 'BOSS', {
      ...TEXT_STYLES.BUTTON,
      fontSize: '16px',
      color: isBossUnlocked ? '#ff4444' : '#888888'
    }).setOrigin(0.5);

    container.add([bg, bgOutline, innerRing, bossImage, labelBg, label]);

    // Krone wenn besiegt (mit Outline)
    if (isBossDefeated) {
      const crownBg = this.add.circle(0, -55, 20, COLORS.GOLD);
      crownBg.setStrokeStyle(OUTLINE, COLORS.BLACK);
      const crown = this.add.text(0, -55, '👑', { fontSize: '24px' }).setOrigin(0.5);
      container.add([crownBg, crown]);
    }

    // Interaktivität
    if (isBossUnlocked && !isBossDefeated) {
      bg.setInteractive({ useHandCursor: true });

      bg.on('pointerover', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100
        });
        this.showLevelTooltip(x, y - 90, bossNames[bossId] || 'Boss');
      });

      bg.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100
        });
        this.hideTooltip();
      });

      bg.on('pointerdown', () => {
        this.startBoss(bossId);
      });

      // Bedrohliche Animation
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createMapCharacter() {
    const { height } = this.scale;
    const charKey = `player_${this.saveData.player.character || 'maya'}`;
    const currentLevel = this.saveData.progress.currentLevel;

    // Position basierend auf aktuellem Fortschritt
    const posIndex = Math.min(currentLevel - 1, this.levelPositions.length - 1);
    const pos = this.levelPositions[posIndex];

    this.mapCharacter = this.add.image(pos.x - 40, pos.y - 30, charKey)
      .setScale(0.8);

    // Leichte Bewegungs-Animation
    this.tweens.add({
      targets: this.mapCharacter,
      y: this.mapCharacter.y - 3,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  showLevelTooltip(x, y, text) {
    this.hideTooltip();
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    this.tooltip = this.add.container(x, y);

    // Cuphead-Style Tooltip
    const bg = this.add.rectangle(0, 0, text.length * 12 + 35, 45, COLORS.CREAM, 0.95)
      .setStrokeStyle(OUTLINE, COLORS.BLACK);

    const tooltipText = this.add.text(0, 0, text, {
      ...TEXT_STYLES.BODY,
      fontSize: '18px',
      color: '#1a1a1a'
    }).setOrigin(0.5);

    this.tooltip.add([bg, tooltipText]);

    // Einblend-Animation
    this.tooltip.setAlpha(0);
    this.tweens.add({
      targets: this.tooltip,
      alpha: 1,
      y: y - 10,
      duration: 200
    });
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }

  startLevel(config, chapter = 1) {
    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.time.delayedCall(300, () => {
      this.scene.start('LevelScene', {
        chapter: chapter,
        level: config.level,
        config: {
          questionTypes: config.types,
          questionCount: config.questionCount,
          difficulty: config.difficulty,
          title: config.title
        }
      });
    });
  }

  startBoss(bossId = 'krokodil') {
    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.time.delayedCall(300, () => {
      this.scene.start('BossScene', {
        chapter: this.selectedChapter,
        bossId: bossId
      });
    });
  }

  createBackButton() {
    const OUTLINE = CUPHEAD_OUTLINE || 3;
    const { height } = this.scale;

    // Cuphead-Style Zurück-Button
    const backContainer = this.add.container(100, height - 45);

    const backBg = this.add.rectangle(0, 0, 160, 40, COLORS.BROWN_MED, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK)
      .setInteractive({ useHandCursor: true });

    const backText = this.add.text(0, 0, '← Hauptmenü', {
      ...TEXT_STYLES.BUTTON,
      fontSize: '18px'
    }).setOrigin(0.5);

    backContainer.add([backBg, backText]);

    backBg.on('pointerover', () => {
      backBg.setFillStyle(COLORS.GOLD);
      this.tweens.add({ targets: backContainer, scale: 1.05, duration: 100 });
    });
    backBg.on('pointerout', () => {
      backBg.setFillStyle(COLORS.BROWN_MED);
      this.tweens.add({ targets: backContainer, scale: 1, duration: 100 });
    });
    backBg.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
