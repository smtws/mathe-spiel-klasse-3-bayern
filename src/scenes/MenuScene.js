import Phaser from 'phaser';
import { TEXT_STYLES, COLORS, CUPHEAD_OUTLINE } from '../config.js';
import { SaveManager } from '../managers/SaveManager.js';
import { JungleGraphics } from '../utils/JungleGraphics.js';

/**
 * CUPHEAD STYLE MENU SCENE
 * 1930er Cartoon-Ästhetik mit Vintage-Farben und dicken Outlines
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {
    // Cleanup: Entferne alle übrig gebliebenen Input-Elemente
    const oldInput = document.getElementById('player-name-input');
    if (oldInput) {
      oldInput.remove();
    }
  }

  create() {
    const { width, height } = this.scale;
    console.log('MenuScene: create() gestartet');

    try {
      this.saveManager = new SaveManager();
      console.log('MenuScene: SaveManager erstellt');
      this.profiles = this.saveManager.loadAllProfiles();
      console.log('MenuScene: Profile geladen:', this.profiles);
    } catch (e) {
      console.error('MenuScene: Fehler beim Laden:', e);
      this.profiles = [];
    }

    // Dschungel-Hintergrund
    this.cameras.main.setBackgroundColor(0x1a3d2a);
    this.createJungleBackground();

    // Titel
    const title = this.add.text(width / 2, 100, 'Dschungel-Mathe-Expedition', TEXT_STYLES.TITLE)
      .setOrigin(0.5);

    // Titel-Animation
    this.tweens.add({
      targets: title,
      y: title.y + 8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Untertitel
    this.add.text(width / 2, 160, 'Mathematik-Abenteuer für Entdecker', TEXT_STYLES.SUBTITLE)
      .setOrigin(0.5);

    // Buttons
    const buttonY = height / 2 + 20;
    const buttonSpacing = 90;

    // Neues Abenteuer Button (immer sichtbar)
    this.createButton(width / 2, buttonY, 'Neues Abenteuer', () => {
      this.showCharacterSelection();
    });

    // Weiter spielen Button (nur wenn Profile existieren)
    if (this.profiles.length > 0) {
      this.createButton(width / 2, buttonY + buttonSpacing, 'Weiter spielen', () => {
        this.showProfileSelection();
      });
    }

    // Einstellungen Button
    this.createButton(width / 2, buttonY + buttonSpacing * (this.profiles.length > 0 ? 2 : 1), 'Einstellungen', () => {
      this.showSettings();
    });

    // Credits (Cuphead Style)
    this.add.text(width / 2, height - 35, 'Für Mathe-Entdecker der 3. Klasse', {
      ...TEXT_STYLES.BODY,
      fontSize: '20px',
      color: '#f5f0e1'
    }).setOrigin(0.5);

    // Vollbild-Toggle
    this.createFullscreenToggle();
  }

  createFullscreenToggle() {
    const { width } = this.scale;

    // Cuphead-style button (mit Outline)
    const fsBtn = this.add.container(width - 35, 35);

    const fsBg = this.add.circle(0, 0, 22, COLORS.BROWN_MED);
    const fsOutline = this.add.circle(0, 0, 22);
    fsOutline.setStrokeStyle(CUPHEAD_OUTLINE, COLORS.BLACK);

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

  createJungleBackground() {
    const { width, height } = this.scale;
    const g = this.add.graphics();

    // Gemeinsame Utility-Funktionen nutzen
    JungleGraphics.drawJungleGround(g, width, height);
    JungleGraphics.drawHills(g, width);
    JungleGraphics.drawBushes(g, width, height, 15);

    // Palmen
    JungleGraphics.drawPalmTree(g, 80, height - 120, 1);
    JungleGraphics.drawPalmTree(g, width - 100, height - 120, 1.1);
    JungleGraphics.drawPalmTree(g, 200, 220, 0.6);
    JungleGraphics.drawPalmTree(g, width - 180, 200, 0.5);

    // Dschungel-Bäume
    JungleGraphics.drawJungleTree(g, width / 4, 180, 0.7);
    JungleGraphics.drawJungleTree(g, width * 3 / 4, 190, 0.6);

    // Lianen oben
    JungleGraphics.drawVines(g, [
      { x: 25, length: 180 },
      { x: 60, length: 140 },
      { x: width - 25, length: 200 },
      { x: width - 55, length: 160 },
    ]);

    // Holzrahmen
    JungleGraphics.drawWoodenBorder(g, width, height);

    // Vignette
    this.createVignetteEffect();
  }

  createVignetteEffect() {
    const { width, height } = this.scale;
    const vignette = this.add.graphics();

    for (let i = 0; i < 4; i++) {
      const alpha = 0.02 + i * 0.015;
      vignette.fillStyle(0x000000, alpha);
      vignette.fillRect(0, 0, 25 - i * 5, height);
      vignette.fillRect(width - 25 + i * 5, 0, 25 - i * 5, height);
      vignette.fillRect(0, 0, width, 25 - i * 5);
      vignette.fillRect(0, height - 25 + i * 5, width, 25 - i * 5);
    }
  }

  createButton(x, y, text, callback) {
    const container = this.add.container(x, y);
    const bg = this.add.image(0, 0, 'button_gold').setInteractive({ useHandCursor: true });
    const buttonText = this.add.text(0, 0, text, TEXT_STYLES.BUTTON).setOrigin(0.5);

    container.add([bg, buttonText]);

    bg.on('pointerover', () => {
      this.tweens.add({ targets: container, scaleX: 1.05, scaleY: 1.05, duration: 100 });
    });

    bg.on('pointerout', () => {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 });
    });

    bg.on('pointerdown', () => {
      bg.disableInteractive();
      container.setScale(0.95);
      this.time.delayedCall(100, callback);
    });

    return container;
  }

  showProfileSelection() {
    const { width, height } = this.scale;

    // Overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
      .setInteractive();

    // Panel
    const panel = this.add.image(width / 2, height / 2, 'panel').setScale(1.2, 1.4);

    // Titel
    const title = this.add.text(width / 2, height / 2 - 200, 'Spieler auswählen', {
      ...TEXT_STYLES.SUBTITLE,
      fontSize: '28px'
    }).setOrigin(0.5);

    const allElements = [overlay, panel, title];

    // Funktion zum Schließen des Dialogs
    const closeDialog = () => {
      allElements.forEach(el => {
        if (el && el.destroy) el.destroy();
      });
      closeBtn.destroy();
      // Alle Menü-Buttons wieder aktivieren
      this.reEnableMenuButtons();
    };

    // Profile anzeigen (max 4)
    const displayProfiles = this.profiles.slice(0, 4);
    const startY = height / 2 - 100;
    const spacing = 70;

    displayProfiles.forEach((profile, index) => {
      const y = startY + index * spacing;
      const profileBtn = this.createProfileButton(width / 2, y, profile, () => {
        // Profil auswählen und starten
        this.saveManager.selectProfile(profile.id);
        // Alle Elemente zerstören
        allElements.forEach(el => {
          if (el && el.destroy) el.destroy();
        });
        if (closeBtn && closeBtn.destroy) closeBtn.destroy();
        this.scene.start('WorldMapScene');
      });
      allElements.push(profileBtn);
    });

    // Schließen Button
    const closeBtn = this.add.text(width / 2, height / 2 + 180, '← Zurück', {
      ...TEXT_STYLES.BODY,
      fontSize: '20px',
      color: '#ff6347'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => closeBtn.setColor('#ffffff'))
      .on('pointerout', () => closeBtn.setColor('#ff6347'))
      .on('pointerdown', closeDialog);
  }

  // Alle Menü-Buttons wieder interaktiv machen
  reEnableMenuButtons() {
    this.children.list.forEach(child => {
      if (child.type === 'Container') {
        child.list?.forEach(item => {
          if (item.input && item.type === 'Image') {
            item.setInteractive({ useHandCursor: true });
          }
        });
      }
    });
  }

  createProfileButton(x, y, profile, callback) {
    const container = this.add.container(x, y);
    container.profileButton = true;
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    // Cuphead-Style Hintergrund
    const bg = this.add.rectangle(0, 0, 400, 58, COLORS.BROWN_LIGHT, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK)
      .setInteractive({ useHandCursor: true });

    // Innerer Rahmen
    const innerBorder = this.add.rectangle(0, 0, 388, 46, 0, 0)
      .setStrokeStyle(2, COLORS.BROWN_DARK);

    // Charakter-Icon
    const charKey = `player_${profile.player.character || 'maya'}`;
    const charIcon = this.add.image(-160, 0, charKey).setScale(0.5);

    // Name
    const nameText = this.add.text(-100, -10, profile.player.name || 'Unbekannt', {
      ...TEXT_STYLES.BODY,
      fontSize: '20px'
    }).setOrigin(0, 0.5);

    // Fortschritt (mit Cuphead-Style Icons)
    const stars = profile.inventory?.stars || 0;
    const coins = profile.inventory?.coins || 0;
    const starIcon = this.add.image(-100, 14, 'star_filled').setScale(0.4);
    const starText = this.add.text(-80, 14, stars.toString(), TEXT_STYLES.SCORE).setOrigin(0, 0.5).setFontSize(16);
    const coinIcon = this.add.image(-40, 14, 'coin').setScale(0.5);
    const coinText = this.add.text(-20, 14, coins.toString(), TEXT_STYLES.SCORE).setOrigin(0, 0.5).setFontSize(16);

    // Löschen-Button (Cuphead Style)
    const deleteBg = this.add.circle(170, 0, 18, COLORS.WRONG_RED);
    deleteBg.setStrokeStyle(OUTLINE, COLORS.BLACK);
    const deleteX = this.add.text(170, 0, '✕', {
      fontSize: '18px',
      color: '#f5f0e1',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    deleteBg.setInteractive({ useHandCursor: true })
      .on('pointerover', () => deleteBg.setFillStyle(COLORS.RED))
      .on('pointerout', () => deleteBg.setFillStyle(COLORS.WRONG_RED))
      .on('pointerdown', (pointer, localX, localY, event) => {
        event.stopPropagation();
        this.confirmDeleteProfile(profile, container);
      });

    container.add([bg, innerBorder, charIcon, nameText, starIcon, starText, coinIcon, coinText, deleteBg, deleteX]);

    bg.on('pointerover', () => {
      bg.setFillStyle(COLORS.GOLD);
      this.tweens.add({ targets: container, scaleX: 1.02, scaleY: 1.02, duration: 100 });
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(COLORS.BROWN_LIGHT);
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 });
    });
    bg.on('pointerdown', callback);

    return container;
  }

  confirmDeleteProfile(profile, buttonContainer) {
    const { width, height } = this.scale;
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    const confirmOverlay = this.add.rectangle(width / 2, height / 2, width, height, COLORS.BLACK, 0.6)
      .setInteractive();

    // Cuphead-Style Panel
    const confirmPanel = this.add.rectangle(width / 2, height / 2, 360, 160, COLORS.CREAM, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK);
    const innerBorder = this.add.rectangle(width / 2, height / 2, 348, 148, 0, 0)
      .setStrokeStyle(2, COLORS.BROWN_MED);

    const confirmText = this.add.text(width / 2, height / 2 - 35,
      `"${profile.player.name}" löschen?`, {
      ...TEXT_STYLES.BODY,
      fontSize: '20px',
      color: '#1a1a1a'
    }).setOrigin(0.5);

    // Ja Button (Cuphead Style)
    const yesBg = this.add.rectangle(width / 2 - 70, height / 2 + 35, 100, 45, COLORS.WRONG_RED, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK)
      .setInteractive({ useHandCursor: true });
    const yesText = this.add.text(width / 2 - 70, height / 2 + 35, 'Ja', {
      ...TEXT_STYLES.BUTTON,
      fontSize: '22px'
    }).setOrigin(0.5);

    yesBg.on('pointerover', () => yesBg.setFillStyle(COLORS.RED));
    yesBg.on('pointerout', () => yesBg.setFillStyle(COLORS.WRONG_RED));
    yesBg.on('pointerdown', () => {
      this.saveManager.deleteProfile(profile.id);
      this.profiles = this.saveManager.loadAllProfiles();
      buttonContainer.destroy();
      [confirmOverlay, confirmPanel, innerBorder, confirmText, yesBg, yesText, noBg, noText].forEach(el => el.destroy());
    });

    // Nein Button (Cuphead Style)
    const noBg = this.add.rectangle(width / 2 + 70, height / 2 + 35, 100, 45, COLORS.CORRECT_GREEN, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK)
      .setInteractive({ useHandCursor: true });
    const noText = this.add.text(width / 2 + 70, height / 2 + 35, 'Nein', {
      ...TEXT_STYLES.BUTTON,
      fontSize: '22px'
    }).setOrigin(0.5);

    noBg.on('pointerover', () => noBg.setFillStyle(COLORS.GREEN_MED));
    noBg.on('pointerout', () => noBg.setFillStyle(COLORS.CORRECT_GREEN));
    noBg.on('pointerdown', () => {
      [confirmOverlay, confirmPanel, innerBorder, confirmText, yesBg, yesText, noBg, noText].forEach(el => el.destroy());
    });
  }

  showCharacterSelection() {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setInteractive();

    const panel = this.add.image(width / 2, height / 2, 'panel');

    const title = this.add.text(width / 2, height / 2 - 150, 'Wähle deinen Entdecker!', {
      ...TEXT_STYLES.SUBTITLE,
      fontSize: '28px'
    }).setOrigin(0.5);

    const allElements = [overlay, panel, title];

    const charSpacing = 150;

    const maya = this.createCharacterOption(
      width / 2 - charSpacing, height / 2,
      'player_maya', 'Maya',
      () => this.selectCharacter('maya', [...allElements, maya, leo, closeBtn])
    );
    allElements.push(maya);

    const leo = this.createCharacterOption(
      width / 2 + charSpacing, height / 2,
      'player_leo', 'Leo',
      () => this.selectCharacter('leo', [...allElements, maya, leo, closeBtn])
    );
    allElements.push(leo);

    // Zurück Button
    const closeBtn = this.add.text(width / 2, height / 2 + 120, '← Zurück', {
      ...TEXT_STYLES.BODY,
      fontSize: '20px',
      color: '#ff6347'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => closeBtn.setColor('#ffffff'))
      .on('pointerout', () => closeBtn.setColor('#ff6347'))
      .on('pointerdown', () => {
        allElements.forEach(el => el.destroy());
        closeBtn.destroy();
        this.reEnableMenuButtons();
      });
  }

  createCharacterOption(x, y, imageKey, name, callback) {
    const container = this.add.container(x, y);

    const char = this.add.image(0, -20, imageKey)
      .setScale(1.2)
      .setInteractive({ useHandCursor: true });

    const nameText = this.add.text(0, 60, name, TEXT_STYLES.BODY).setOrigin(0.5);

    container.add([char, nameText]);

    char.on('pointerover', () => {
      this.tweens.add({ targets: char, scaleX: 1.4, scaleY: 1.4, duration: 200 });
    });

    char.on('pointerout', () => {
      this.tweens.add({ targets: char, scaleX: 1.2, scaleY: 1.2, duration: 200 });
    });

    char.on('pointerdown', callback);

    return container;
  }

  selectCharacter(character, elementsToDestroy) {
    // Temporär speichern
    this.selectedCharacter = character;

    this.cameras.main.flash(500, 255, 215, 0);

    this.time.delayedCall(300, () => {
      elementsToDestroy.forEach(el => el.destroy());
      this.showNameInput();
    });
  }

  showNameInput() {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, COLORS.BLACK, 0.7);
    const panel = this.add.image(width / 2, height / 2, 'panel');

    const title = this.add.text(width / 2, height / 2 - 120, 'Wie heißt du, Entdecker?', {
      ...TEXT_STYLES.SUBTITLE,
      fontSize: '28px'
    }).setOrigin(0.5);

    // HTML Input (Cuphead Style)
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = 'Dein Name';
    inputElement.maxLength = 20;
    inputElement.id = 'player-name-input';

    const canvas = this.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();

    // Cuphead-Style Input (Vintage Look)
    inputElement.style.cssText = `
      position: fixed;
      left: ${canvasRect.left + canvasRect.width / 2}px;
      top: ${canvasRect.top + canvasRect.height / 2 - 20}px;
      transform: translate(-50%, -50%);
      width: 260px;
      padding: 16px;
      font-size: 26px;
      font-family: 'Arial Black', Arial, sans-serif;
      text-align: center;
      border: 4px solid #1a1a1a;
      border-radius: 8px;
      background: #f2e8cf;
      color: #1a1a1a;
      outline: none;
      z-index: 1000;
      box-shadow: 4px 4px 0px #1a1a1a;
    `;

    document.body.appendChild(inputElement);
    inputElement.focus();

    const allElements = [overlay, panel, title];

    const closeDialog = () => {
      if (inputElement.parentNode) {
        inputElement.remove();
      }
      allElements.forEach(el => el.destroy());
      startButton.destroy();
      closeBtn.destroy();
      this.reEnableMenuButtons();
    };

    const startGame = () => {
      const playerName = inputElement.value.trim() || 'Entdecker';

      if (inputElement.parentNode) {
        inputElement.remove();
      }

      // Neues Profil erstellen
      const profile = this.saveManager.createNewProfile(playerName, this.selectedCharacter);
      console.log('Neues Profil erstellt:', profile);

      allElements.forEach(el => el.destroy());
      startButton.destroy();
      closeBtn.destroy();

      this.scene.start('WorldMapScene');
    };

    const startButton = this.add.container(width / 2, height / 2 + 80);
    const btnBg = this.add.image(0, 0, 'button_gold').setInteractive({ useHandCursor: true });
    const btnText = this.add.text(0, 0, 'Los geht\'s!', TEXT_STYLES.BUTTON).setOrigin(0.5);
    startButton.add([btnBg, btnText]);

    btnBg.on('pointerover', () => startButton.setScale(1.05));
    btnBg.on('pointerout', () => startButton.setScale(1));
    btnBg.on('pointerdown', () => {
      btnBg.disableInteractive();
      startGame();
    });

    inputElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        startGame();
      }
    });

    // Zurück Button
    const closeBtn = this.add.text(width / 2, height / 2 + 140, '← Zurück', {
      ...TEXT_STYLES.BODY,
      fontSize: '20px',
      color: '#ff6347'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => closeBtn.setColor('#ffffff'))
      .on('pointerout', () => closeBtn.setColor('#ff6347'))
      .on('pointerdown', closeDialog);
  }

  showSettings() {
    const { width, height } = this.scale;
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, COLORS.BLACK, 0.7)
      .setInteractive();

    const panel = this.add.image(width / 2, height / 2, 'panel');

    const title = this.add.text(width / 2, height / 2 - 150, 'Einstellungen', TEXT_STYLES.SUBTITLE)
      .setOrigin(0.5);

    const elements = [overlay, panel, title];

    // Hinweise Toggle (Cuphead Style)
    const hintsLabel = this.add.text(width / 2 - 100, height / 2 - 50, 'Hinweise:', TEXT_STYLES.BODY).setOrigin(0, 0.5);
    elements.push(hintsLabel);

    const hintsBg = this.add.rectangle(width / 2 + 100, height / 2 - 50, 80, 40, COLORS.CORRECT_GREEN, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK)
      .setInteractive({ useHandCursor: true });
    elements.push(hintsBg);

    const hintsText = this.add.text(width / 2 + 100, height / 2 - 50, 'An', {
      ...TEXT_STYLES.BUTTON,
      fontSize: '20px'
    }).setOrigin(0.5);
    elements.push(hintsText);

    let hintsEnabled = true;
    hintsBg.on('pointerdown', () => {
      hintsEnabled = !hintsEnabled;
      hintsText.setText(hintsEnabled ? 'An' : 'Aus');
      hintsBg.setFillStyle(hintsEnabled ? COLORS.CORRECT_GREEN : COLORS.BROWN_MED);
    });

    // Narration Toggle
    const narrationLabel = this.add.text(width / 2 - 100, height / 2, 'Vorlesen:', TEXT_STYLES.BODY).setOrigin(0, 0.5);
    elements.push(narrationLabel);

    const narrationBg = this.add.rectangle(width / 2 + 100, height / 2, 80, 40, COLORS.CORRECT_GREEN, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK)
      .setInteractive({ useHandCursor: true });
    elements.push(narrationBg);

    const narrationText = this.add.text(width / 2 + 100, height / 2, 'An', {
      ...TEXT_STYLES.BUTTON,
      fontSize: '20px'
    }).setOrigin(0.5);
    elements.push(narrationText);

    let narrationEnabled = true;
    narrationBg.on('pointerdown', () => {
      narrationEnabled = !narrationEnabled;
      narrationText.setText(narrationEnabled ? 'An' : 'Aus');
      narrationBg.setFillStyle(narrationEnabled ? COLORS.CORRECT_GREEN : COLORS.BROWN_MED);
    });

    // Alle Profile löschen (Cuphead Style Button)
    const resetBg = this.add.rectangle(width / 2, height / 2 + 70, 220, 45, COLORS.WRONG_RED, 1)
      .setStrokeStyle(OUTLINE, COLORS.BLACK)
      .setInteractive({ useHandCursor: true });
    elements.push(resetBg);

    const resetText = this.add.text(width / 2, height / 2 + 70, 'Alle Daten löschen', {
      ...TEXT_STYLES.BUTTON,
      fontSize: '18px'
    }).setOrigin(0.5);
    elements.push(resetText);

    resetBg.on('pointerover', () => resetBg.setFillStyle(COLORS.RED));
    resetBg.on('pointerout', () => resetBg.setFillStyle(COLORS.WRONG_RED));
    resetBg.on('pointerdown', () => {
      localStorage.clear();
      this.scene.restart();
    });

    // Schließen Button
    const closeBtn = this.add.text(width / 2, height / 2 + 140, '← Zurück', {
      ...TEXT_STYLES.BODY,
      fontSize: '20px',
      color: '#ff6347'
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => closeBtn.setColor('#ffffff'))
      .on('pointerout', () => closeBtn.setColor('#ff6347'))
      .on('pointerdown', () => {
        elements.forEach(el => el.destroy());
        closeBtn.destroy();
        this.reEnableMenuButtons();
      });
  }
}
