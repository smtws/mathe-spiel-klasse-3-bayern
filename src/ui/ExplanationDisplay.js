import { TEXT_STYLES, COLORS, CUPHEAD_OUTLINE } from '../config.js';

export class ExplanationDisplay {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.isShowing = false;
  }

  show(text, isCorrect, onComplete) {
    if (this.container) {
      this.container.destroy();
    }

    const { width, height } = this.scene.scale;
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    // Full-Screen Overlay
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(100);
    this.container.setAlpha(0);

    // Dunkler Hintergrund (klickbar zum Schließen)
    const overlay = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setInteractive();

    // Erklärungstext formatieren
    const formattedText = this.formatMathTextWithBreaks(text);

    // Box-Größe - größer für mehr Platz
    const boxWidth = Math.min(750, width - 40);
    const boxHeight = Math.min(480, height - 60);
    const bgColor = isCorrect ? 0x2E7D32 : 0xC62828;
    const borderColor = isCorrect ? 0x4CAF50 : 0xEF5350;

    // Feste Bereiche definieren
    const boxTop = height / 2 - boxHeight / 2;
    const boxBottom = height / 2 + boxHeight / 2;
    const headerHeight = 70;  // Bereich für Icon + Titel
    const buttonHeight = 70;  // Bereich für Button
    const contentTop = boxTop + headerHeight + 20;
    const contentBottom = boxBottom - buttonHeight - 10;
    const contentHeight = contentBottom - contentTop;

    // Schatten
    const shadow = this.scene.add.rectangle(width / 2 + 6, height / 2 + 6, boxWidth, boxHeight, 0x000000, 0.5);
    shadow.setStrokeStyle(0);

    // Haupthintergrund
    const bg = this.scene.add.rectangle(width / 2, height / 2, boxWidth, boxHeight, bgColor, 0.98);
    bg.setStrokeStyle(OUTLINE + 1, borderColor);

    // Header: Icon + Titel nebeneinander
    const iconText = isCorrect ? '✓' : '✗';
    const headerText = isCorrect ? 'Richtig!' : 'Nicht ganz...';

    const icon = this.scene.add.text(width / 2 - 80, boxTop + 35, iconText, {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0.5);

    const header = this.scene.add.text(width / 2 + 10, boxTop + 35, headerText, {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontStyle: 'bold',
      resolution: 2
    }).setOrigin(0, 0.5);

    // Trennlinie unter Header
    const line = this.scene.add.rectangle(width / 2, boxTop + headerHeight, boxWidth - 40, 2, 0xFFFFFF, 0.3);

    // Erklärungstext - kleinere Schrift, oben ausgerichtet
    const explanation = this.scene.add.text(width / 2, contentTop + contentHeight / 2, formattedText, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      wordWrap: { width: boxWidth - 60 },
      align: 'left',
      lineSpacing: 6,
      resolution: 2
    }).setOrigin(0.5);

    // Falls Text zu hoch, verkleinern
    if (explanation.height > contentHeight) {
      explanation.setFontSize(16);
      explanation.setLineSpacing(4);
    }

    // Trennlinie über Button
    const lineBottom = this.scene.add.rectangle(width / 2, boxBottom - buttonHeight, boxWidth - 40, 2, 0xFFFFFF, 0.3);

    // === WEITER BUTTON ===
    const btnWidth = 150;
    const btnHeight = 45;
    const btnY = boxBottom - buttonHeight / 2 - 5;

    const btnBg = this.scene.add.rectangle(width / 2, btnY, btnWidth, btnHeight, 0xFFFFFF, 0.2);
    btnBg.setStrokeStyle(3, 0xFFFFFF);
    btnBg.setInteractive({ useHandCursor: true });

    const btnText = this.scene.add.text(width / 2, btnY, 'Weiter →', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial Black, Arial, sans-serif',
      resolution: 2
    }).setOrigin(0.5);

    // Button Hover-Effekte
    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0xFFFFFF, 0.4);
      this.scene.tweens.add({ targets: [btnBg, btnText], scaleX: 1.08, scaleY: 1.08, duration: 100 });
    });
    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0xFFFFFF, 0.2);
      this.scene.tweens.add({ targets: [btnBg, btnText], scaleX: 1, scaleY: 1, duration: 100 });
    });
    btnBg.on('pointerdown', () => {
      btnBg.disableInteractive();
      overlay.disableInteractive();
      this.hide(onComplete);
    });

    // Auch Overlay-Klick schließt
    overlay.on('pointerdown', () => {
      btnBg.disableInteractive();
      overlay.disableInteractive();
      this.hide(onComplete);
    });

    this.container.add([overlay, shadow, bg, icon, header, line, explanation, lineBottom, btnBg, btnText]);

    // Einblenden mit Scale-Effekt
    this.container.setAlpha(1);
    const scaleTargets = [bg, shadow, icon, header, line, explanation, lineBottom, btnBg, btnText];
    scaleTargets.forEach(t => t.setScale(0.8));

    this.scene.tweens.add({
      targets: scaleTargets,
      scaleX: 1,
      scaleY: 1,
      duration: 250,
      ease: 'Back.easeOut'
    });

    this.isShowing = true;
  }

  formatMathTextWithBreaks(text) {
    // Erst normale Formatierung
    let formatted = text
      .replace(/(\d+)\s*mal\s*(\d+)/g, '$1 × $2')
      .replace(/(\d+)\s*plus\s*(\d+)/g, '$1 + $2')
      .replace(/(\d+)\s*minus\s*(\d+)/g, '$1 − $2')
      .replace(/(\d+)\s*geteilt durch\s*(\d+)/g, '$1 ÷ $2')
      .replace(/ist gleich/g, '=');

    // Zeilenumbrüche für bessere Lesbarkeit
    formatted = formatted
      .replace(/\. Dann /g, '.\n\nDann ')
      .replace(/\. Also /g, '.\n\nAlso ')
      .replace(/\. Ergebnis:/g, '.\n\nErgebnis:')
      .replace(/Einer: /g, '\nEiner: ')
      .replace(/Zehner: /g, '\nZehner: ')
      .replace(/Hunderter: /g, '\nHunderter: ')
      .replace(/Zerlege in /g, '\nZerlege in ')
      .replace(/, schreibe/g, '\n   → schreibe')
      .replace(/, borge/g, '\n   → borge')
      .replace(/, nochmal/g, '\n   → nochmal');

    return formatted.trim();
  }

  hide(onComplete) {
    if (!this.container) {
      if (onComplete) onComplete();
      return;
    }

    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 150,
      ease: 'Power2',
      onComplete: () => {
        if (this.container) {
          this.container.destroy();
          this.container = null;
        }
        this.isShowing = false;
        if (onComplete) onComplete();
      }
    });
  }

  destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
  }
}
