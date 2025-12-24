import Phaser from 'phaser';
import { TEXT_STYLES, COLORS, GAME_CONSTANTS } from '../config.js';
import { QuestionManager } from '../managers/QuestionManager.js';
import { SaveManager } from '../managers/SaveManager.js';
import { NarrationManager } from '../managers/NarrationManager.js';
import { BackgroundAnimationManager } from '../animations/BackgroundAnimationManager.js';
import { ExplanationGenerator } from '../utils/ExplanationGenerator.js';
import { ExplanationDisplay } from '../ui/ExplanationDisplay.js';
import { CelebrationManager } from '../managers/CelebrationManager.js';

export class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' });
  }

  init(data) {
    this.chapter = data.chapter || 1;
    this.levelNum = data.level || 1;
    this.levelConfig = data.config || this.getDefaultConfig();
  }

  getDefaultConfig() {
    return {
      questionTypes: ['multiplication', 'addition'],
      questionCount: GAME_CONSTANTS.QUESTIONS_PER_LEVEL,
      difficulty: 'normal',
      title: 'Dschungel-Level'
    };
  }

  create() {
    const { width, height } = this.scale;

    // Kamera einblenden
    this.cameras.main.fadeIn(300, 0, 0, 0);

    this.saveManager = new SaveManager();
    this.saveData = this.saveManager.load();

    // Spielzustand
    this.currentQuestion = 0;
    this.totalQuestions = this.levelConfig.questionCount;
    this.correctAnswers = 0;
    this.score = 0;
    this.startTime = Date.now();
    this.currentStreak = 0;
    this.isAnswering = false;

    // Vorgeladene Frage für flüssigere Übergänge
    this.preloadedQuestion = null;
    this.preloadedQuestionIndex = -1;

    // Hintergrund
    this.createBackground();

    // Hintergrund-Animationen
    this.animationManager = new BackgroundAnimationManager(this);
    this.animationManager.init();

    // Narration (TTS Vorlesefunktion)
    this.narrationManager = new NarrationManager();

    // Erklärungen (visuell + Audio)
    this.explanationGenerator = new ExplanationGenerator();
    this.explanationDisplay = new ExplanationDisplay(this);

    // Feier-Effekte für Levelende
    this.celebrationManager = new CelebrationManager(this, this.narrationManager);

    // QuestionManager (mit bereits beantworteten Fragen)
    const answeredQuestionIds = this.saveManager.getAnsweredQuestionIds();
    this.questionManager = new QuestionManager(
      this.levelConfig.questionTypes,
      this.levelConfig.difficulty,
      this.levelConfig.questionCount,
      answeredQuestionIds
    );

    // UI erstellen
    this.createUI();

    // Charakter anzeigen
    this.createCharacter();

    // Erste Frage zeigen
    this.showNextQuestion();
  }

  createBackground() {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();
    graphics.setDepth(0);

    // Dschungel-Hintergrund (Gradient-Effekt)
    graphics.fillStyle(0x1a3d2a, 1);
    graphics.fillRect(0, 0, width, height);

    // Leichter Nebel/Licht von oben
    graphics.fillStyle(0x2d5a3d, 0.3);
    graphics.fillRect(0, 0, width, height / 3);

    // Boden
    graphics.fillStyle(0x3d2817, 1);
    graphics.fillRect(0, height - 80, width, 80);

    // Gras
    graphics.fillStyle(COLORS.LEAF_GREEN, 0.8);
    for (let i = 0; i < width; i += 30) {
      graphics.fillTriangle(i, height - 80, i + 15, height - 100, i + 30, height - 80);
    }

    // Dschungel-Dekoration am Rand
    this.createJungleDecoration();
  }

  createJungleDecoration() {
    const { width, height } = this.scale;

    // Blätter links
    for (let i = 0; i < 4; i++) {
      const leaf = this.add.ellipse(
        Phaser.Math.Between(20, 80),
        Phaser.Math.Between(100, height - 150),
        Phaser.Math.Between(30, 50),
        Phaser.Math.Between(15, 25),
        0x228b22,
        0.6
      );
      leaf.setDepth(0);
      leaf.setAngle(Phaser.Math.Between(-30, 30));
    }

    // Blätter rechts
    for (let i = 0; i < 4; i++) {
      const leaf = this.add.ellipse(
        Phaser.Math.Between(width - 80, width - 20),
        Phaser.Math.Between(100, height - 150),
        Phaser.Math.Between(30, 50),
        Phaser.Math.Between(15, 25),
        0x228b22,
        0.6
      );
      leaf.setDepth(0);
      leaf.setAngle(Phaser.Math.Between(-30, 30));
    }
  }

  createUI() {
    const { width, height } = this.scale;

    // Level-Titel
    this.add.text(width / 2, 30, `Kapitel ${this.chapter} - Level ${this.levelNum}`, {
      ...TEXT_STYLES.SUBTITLE,
      fontSize: '24px'
    }).setOrigin(0.5);

    // Fortschrittsanzeige
    this.progressText = this.add.text(width / 2, 70, `Frage 1 von ${this.totalQuestions}`, TEXT_STYLES.BODY)
      .setOrigin(0.5);

    // Fortschrittsbalken
    this.createProgressBar();

    // Punkte-Anzeige
    this.scoreText = this.add.text(width - 30, 30, '0', TEXT_STYLES.SCORE)
      .setOrigin(1, 0);
    this.add.image(width - 80, 42, 'coin').setScale(0.8);

    // Streak-Anzeige
    this.streakContainer = this.add.container(30, 30);
    this.streakText = this.add.text(0, 0, '', {
      ...TEXT_STYLES.SCORE,
      color: '#ff6347'
    });
    this.streakContainer.add(this.streakText);
    this.streakContainer.setVisible(false);

    // Zurück-Button
    this.createBackButton();

    // Vollbild-Toggle
    this.createFullscreenToggle();
  }

  createFullscreenToggle() {
    const { width } = this.scale;

    const fsText = this.add.text(width - 20, 20, '⛶', {
      fontSize: '28px',
      color: '#90EE90'
    })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => fsText.setColor('#ffffff'))
      .on('pointerout', () => fsText.setColor('#90EE90'))
      .on('pointerdown', () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      });
  }

  createProgressBar() {
    const { width } = this.scale;
    const barWidth = 600;
    const barHeight = 20;
    const x = (width - barWidth) / 2;
    const y = 100;

    // Hintergrund
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(0x333333, 1);
    bgGraphics.fillRoundedRect(x, y, barWidth, barHeight, 10);

    // Fortschrittsbalken
    this.progressBar = this.add.graphics();
    this.updateProgressBar();
  }

  updateProgressBar() {
    const { width } = this.scale;
    const barWidth = 600;
    const barHeight = 20;
    const x = (width - barWidth) / 2;
    const y = 100;

    const progress = this.currentQuestion / this.totalQuestions;

    this.progressBar.clear();
    this.progressBar.fillStyle(COLORS.CORRECT_GREEN, 1);
    this.progressBar.fillRoundedRect(x + 2, y + 2, (barWidth - 4) * progress, barHeight - 4, 8);
  }

  createCharacter() {
    const { width, height } = this.scale;
    const charKey = `player_${this.saveData.player.character || 'maya'}`;

    this.character = this.add.image(150, height - 160, charKey)
      .setScale(1.5)
      .setDepth(6);

    // Idle-Animation
    this.tweens.add({
      targets: this.character,
      y: this.character.y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createBackButton() {
    const backBtn = this.add.text(30, this.scale.height - 40, '← Zurück', {
      ...TEXT_STYLES.BODY,
      fontSize: '20px',
      color: '#90EE90'
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => backBtn.setColor('#ffffff'))
      .on('pointerout', () => backBtn.setColor('#90EE90'))
      .on('pointerdown', () => {
        // Audio stoppen beim Verlassen
        if (this.narrationManager) {
          this.narrationManager.stop();
        }
        this.scene.start('WorldMapScene');
      });
  }

  showNextQuestion() {
    if (this.currentQuestion >= this.totalQuestions) {
      this.finishLevel();
      return;
    }

    // Vorgeladene Frage verwenden falls vorhanden, sonst neu laden
    let question;
    if (this.preloadedQuestion && this.preloadedQuestionIndex === this.currentQuestion) {
      question = this.preloadedQuestion;
      this.preloadedQuestion = null;
    } else {
      question = this.questionManager.getQuestion(this.currentQuestion);
    }

    this.currentQuestionData = question;
    this.displayQuestion(question);

    // Nächste Frage im Hintergrund vorladen
    this.preloadNextQuestion();
  }

  preloadNextQuestion() {
    const nextIndex = this.currentQuestion + 1;
    if (nextIndex < this.totalQuestions) {
      // Asynchron vorladen (nächsten Frame nutzen)
      this.time.delayedCall(50, () => {
        this.preloadedQuestion = this.questionManager.getQuestion(nextIndex);
        this.preloadedQuestionIndex = nextIndex;
      });
    }
  }

  displayQuestion(question) {
    const { width, height } = this.scale;

    // === AUDIO STOPPEN bei neuer Frage ===
    if (this.narrationManager) {
      this.narrationManager.stop();
    }

    // === CONSOLE LOG: Frage anzeigen ===
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📝 FRAGE ${this.currentQuestion + 1}/${this.totalQuestions}`);
    console.log(`   Typ: ${question.type}`);
    console.log(`   Aufgabe: ${question.question}`);
    console.log(`   Kontext: ${question.contextQuestion}`);
    console.log(`   Optionen: [${question.options.join(', ')}]`);
    console.log(`   Richtige Antwort: ${question.correctAnswer}`);
    if (question.visualData) {
      console.log(`   VisualData:`, question.visualData);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Alte Frage-Elemente entfernen
    if (this.questionContainer) {
      this.questionContainer.destroy();
    }
    if (this.answerButtons) {
      this.answerButtons.forEach(btn => btn.destroy());
    }
    this.answerButtons = [];

    // Hintergrund-Animation erstellen
    this.animationManager.createAnimation(question);

    // Zentraler Container für alles
    this.questionContainer = this.add.container(width / 2, height / 2);
    this.questionContainer.setDepth(3);

    // Frage-Panel - semi-transparent für Animation dahinter
    const panel = this.add.image(0, 0, 'panel').setScale(1.1, 1.3).setAlpha(0.85);

    // Kontext-Frage (Sachaufgabe) - weiter oben
    const contextText = this.add.text(0, -180, question.contextQuestion, {
      ...TEXT_STYLES.BODY,
      fontSize: '18px',
      wordWrap: { width: 450 },
      align: 'center'
    }).setOrigin(0.5);

    // Mathematische Frage
    const questionText = this.add.text(0, -100, question.question, {
      ...TEXT_STYLES.QUESTION,
      fontSize: '32px'
    }).setOrigin(0.5);

    this.questionContainer.add([panel, contextText, questionText]);

    // Antwort-Buttons INNERHALB des Containers erstellen
    this.createAnswerButtons(question.options, question.correctAnswer);

    // Fortschritt aktualisieren
    this.progressText.setText(`Frage ${this.currentQuestion + 1} von ${this.totalQuestions}`);
    this.updateProgressBar();

    this.isAnswering = true;

    // Frage vorlesen
    if (this.narrationManager && question.contextQuestion) {
      this.narrationManager.speak(question.contextQuestion);
    }
  }

  createAnswerButtons(options, correctAnswer) {
    const { width, height } = this.scale;

    // Kompaktes 2x2 Grid innerhalb des Panels (touch-friendly)
    const horizontalGap = 145;
    const verticalGap = 75;
    const startY = 15;  // Relativ zur Mitte des Screens

    // Positionen relativ zum Bildschirm-Zentrum
    const positions = [
      { x: width / 2 - horizontalGap, y: height / 2 + startY },
      { x: width / 2 + horizontalGap, y: height / 2 + startY },
      { x: width / 2 - horizontalGap, y: height / 2 + startY + verticalGap },
      { x: width / 2 + horizontalGap, y: height / 2 + startY + verticalGap }
    ];

    options.forEach((option, index) => {
      const pos = positions[index];
      const container = this.add.container(pos.x, pos.y);
      container.setDepth(5); // Über Panel und Animationen

      const bg = this.add.image(0, 0, 'answer_button')
        .setScale(0.75)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(0, 0, option.toString(), {
        ...TEXT_STYLES.BUTTON,
        fontSize: '22px'
      }).setOrigin(0.5);

      container.add([bg, text]);

      // Einflug-Animation
      container.setAlpha(0);
      container.setScale(0.5);
      this.tweens.add({
        targets: container,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        delay: index * 100,
        ease: 'Back.easeOut'
      });

      // Hover-Effekte
      bg.on('pointerover', () => {
        if (!this.isAnswering) return;
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100
        });
      });

      bg.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100
        });
      });

      bg.on('pointerdown', () => {
        if (!this.isAnswering) return;
        this.handleAnswer(option, correctAnswer, container, bg);
      });

      // Speichere Referenz
      container.answerValue = option;
      container.bgImage = bg;
      this.answerButtons.push(container);
    });
  }

  handleAnswer(selectedAnswer, correctAnswer, container, bgImage) {
    this.isAnswering = false;

    // Stoppe laufende Narration (z.B. Kontextfrage) bevor Erklärung kommt
    if (this.narrationManager) {
      this.narrationManager.stop();
    }

    const isCorrect = selectedAnswer === correctAnswer;

    // Deaktiviere alle Buttons
    this.answerButtons.forEach(btn => {
      btn.bgImage.disableInteractive();
    });

    if (isCorrect) {
      this.handleCorrectAnswer(container, bgImage, selectedAnswer);
    } else {
      this.handleWrongAnswer(container, bgImage, correctAnswer, selectedAnswer);
    }
  }

  handleCorrectAnswer(container, bgImage, selectedAnswer) {
    this.correctAnswers++;
    this.score += GAME_CONSTANTS.POINTS_PER_CORRECT;
    this.currentStreak++;

    // Bonus für Streak
    if (this.currentStreak >= GAME_CONSTANTS.BONUS_STREAK_THRESHOLD) {
      this.score += GAME_CONSTANTS.POINTS_PER_CORRECT * GAME_CONSTANTS.BONUS_STREAK_MULTIPLIER;
      this.showStreakBonus();
    }

    // UI aktualisieren
    this.scoreText.setText(this.score.toString());
    this.updateStreakDisplay();

    // Visuelles Feedback
    bgImage.setTexture('answer_correct');

    // Partikel-Effekt
    this.createCorrectParticles(container.x, container.y);

    // Charakter-Animation
    this.celebrateCharacter();

    // Hintergrund-Animation Reaktion
    this.animationManager.onCorrectAnswer();

    // Sound (wenn implementiert)
    // this.sound.play('correct');

    // Erklärung anzeigen und vorlesen, dann nächste Frage
    const explanation = this.explanationGenerator.generate(
      this.currentQuestionData,
      selectedAnswer,
      true
    );

    // === CONSOLE LOG: Richtige Antwort ===
    console.log('');
    console.log('✅ RICHTIG!');
    console.log(`   Gewählte Antwort: ${selectedAnswer}`);
    console.log(`   Erklärung: ${explanation}`);
    console.log(`   Punkte: +${GAME_CONSTANTS.POINTS_PER_CORRECT} (Gesamt: ${this.score})`);
    console.log(`   Streak: ${this.currentStreak}`);
    console.log('');

    // Erklärung vorlesen
    if (this.narrationManager) {
      this.narrationManager.speak(explanation);
    }

    // Erklärung anzeigen - bei Klick auf Weiter sofort zur nächsten Frage
    this.explanationDisplay.show(explanation, true, () => {
      // Narration sofort stoppen bei Weiter-Klick
      if (this.narrationManager) {
        this.narrationManager.stop();
      }
      // Sofort zur nächsten Frage
      this.currentQuestion++;
      this.showNextQuestion();
    });
  }

  handleWrongAnswer(container, bgImage, correctAnswer, selectedAnswer) {
    this.currentStreak = 0;
    this.updateStreakDisplay();

    // Visuelles Feedback
    bgImage.setTexture('answer_wrong');

    // Zeige richtige Antwort
    this.answerButtons.forEach(btn => {
      if (btn.answerValue === correctAnswer) {
        btn.bgImage.setTexture('answer_correct');
        this.tweens.add({
          targets: btn,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          yoyo: true,
          repeat: 2
        });
      }
    });

    // Charakter-Reaktion
    this.thinkingCharacter();

    // Hintergrund-Animation Reaktion
    this.animationManager.onWrongAnswer();

    // Erklärung anzeigen und vorlesen, dann nächste Frage
    const explanation = this.explanationGenerator.generate(
      this.currentQuestionData,
      selectedAnswer,
      false
    );

    // === CONSOLE LOG: Falsche Antwort ===
    console.log('');
    console.log('❌ FALSCH!');
    console.log(`   Gewählte Antwort: ${selectedAnswer}`);
    console.log(`   Richtige Antwort: ${correctAnswer}`);
    console.log(`   Erklärung: ${explanation}`);
    console.log(`   Streak zurückgesetzt auf: 0`);
    console.log('');

    // Erklärung vorlesen
    if (this.narrationManager) {
      this.narrationManager.speak(explanation);
    }

    // Erklärung anzeigen - bei Klick auf Weiter sofort zur nächsten Frage
    this.explanationDisplay.show(explanation, false, () => {
      // Narration sofort stoppen bei Weiter-Klick
      if (this.narrationManager) {
        this.narrationManager.stop();
      }
      // Sofort zur nächsten Frage
      this.currentQuestion++;
      this.showNextQuestion();
    });
  }

  createCorrectParticles(x, y) {
    // Einfache Partikel-Animation mit Grafiken
    for (let i = 0; i < 10; i++) {
      const particle = this.add.star(x, y, 5, 5, 10, COLORS.GOLD)
        .setAlpha(1);

      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-100, 100),
        y: y + Phaser.Math.Between(-100, -50),
        alpha: 0,
        scale: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  celebrateCharacter() {
    // Stop idle animation temporarily
    this.tweens.killTweensOf(this.character);

    // Jump animation
    this.tweens.add({
      targets: this.character,
      y: this.character.y - 40,
      duration: 200,
      yoyo: true,
      ease: 'Power2',
      onComplete: () => {
        // Resume idle
        this.tweens.add({
          targets: this.character,
          y: this.character.y - 5,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
  }

  thinkingCharacter() {
    // Kopf-Kratzen Animation (vereinfacht)
    this.tweens.add({
      targets: this.character,
      angle: -5,
      duration: 200,
      yoyo: true,
      repeat: 2
    });
  }

  updateStreakDisplay() {
    if (this.currentStreak >= 2) {
      this.streakContainer.setVisible(true);
      this.streakText.setText(`🔥 ${this.currentStreak}x Streak!`);

      this.tweens.add({
        targets: this.streakContainer,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true
      });
    } else {
      this.streakContainer.setVisible(false);
    }
  }

  showStreakBonus() {
    const { width, height } = this.scale;

    const bonusText = this.add.text(width / 2, height / 2, '🌟 STREAK BONUS! 🌟', {
      ...TEXT_STYLES.TITLE,
      fontSize: '36px'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: bonusText,
      alpha: 1,
      y: bonusText.y - 50,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: bonusText,
          alpha: 0,
          y: bonusText.y - 50,
          duration: 500,
          delay: 500,
          onComplete: () => bonusText.destroy()
        });
      }
    });
  }

  showHint(hintText) {
    const { width, height } = this.scale;

    const hintContainer = this.add.container(width / 2, height - 150);

    const bg = this.add.rectangle(0, 0, 500, 60, 0x333333, 0.9)
      .setStrokeStyle(2, COLORS.GOLD);

    const text = this.add.text(0, 0, hintText, {
      ...TEXT_STYLES.BODY,
      fontSize: '18px',
      color: '#ffd700'
    }).setOrigin(0.5);

    hintContainer.add([bg, text]);
    hintContainer.setAlpha(0);

    this.tweens.add({
      targets: hintContainer,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: hintContainer,
            alpha: 0,
            duration: 300,
            onComplete: () => hintContainer.destroy()
          });
        });
      }
    });
  }

  finishLevel() {
    // Audio stoppen beim Level-Ende
    if (this.narrationManager) {
      this.narrationManager.stop();
    }

    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - this.startTime) / 1000);

    // Sterne berechnen
    const percentage = this.correctAnswers / this.totalQuestions;
    let stars = 0;
    if (percentage >= GAME_CONSTANTS.STARS_THRESHOLD.THREE) stars = 3;
    else if (percentage >= GAME_CONSTANTS.STARS_THRESHOLD.TWO) stars = 2;
    else if (percentage >= GAME_CONSTANTS.STARS_THRESHOLD.ONE) stars = 1;

    // Münzen basierend auf Performance
    const coins = this.score + (stars * 5);

    // Fortschritt speichern
    this.saveManager.completeLevel(this.chapter, this.levelNum, {
      stars: stars,
      time: timeSpent,
      totalQuestions: this.totalQuestions,
      correctAnswers: this.correctAnswers
    });

    this.saveManager.addCoins(coins);
    this.saveManager.addStars(stars);
    this.saveManager.updateStreak(this.questionManager.getStats().maxStreak);

    // Richtig beantwortete Fragen speichern
    const correctlyAnsweredIds = this.questionManager.getCorrectlyAnsweredIds();
    if (correctlyAnsweredIds.length > 0) {
      this.saveManager.addAnsweredQuestions(correctlyAnsweredIds);
    }

    // Achievement prüfen
    if (this.questionManager.getStats().maxStreak >= 5) {
      this.saveManager.unlockAchievement('schnellrechner');
    }

    // Ergebnis-Modal anzeigen
    this.showResultModal({
      stars,
      score: this.score,
      coins,
      correct: this.correctAnswers,
      total: this.totalQuestions,
      time: timeSpent
    });
  }

  showResultModal(result) {
    const { width, height } = this.scale;

    // Frage-Elemente ausblenden
    if (this.questionContainer) {
      this.questionContainer.setVisible(false);
    }

    // Container für alle Result-Elemente mit hohem depth
    const resultContainer = this.add.container(0, 0);
    resultContainer.setDepth(200);

    // Overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    resultContainer.add(overlay);

    // === FEIER-EFFEKTE STARTEN ===
    if (this.celebrationManager) {
      this.celebrationManager.celebrate(result.stars, result.correct, result.total);
    }

    // Panel
    const panel = this.add.image(width / 2, height / 2, 'panel').setScale(1.2);
    resultContainer.add(panel);

    // Titel basierend auf Ergebnis
    const titleText = result.stars === 3 ? 'Fantastisch!' :
                      result.stars === 2 ? 'Super gemacht!' :
                      result.stars === 1 ? 'Gut gemacht!' : 'Weiter üben!';

    const title = this.add.text(width / 2, height / 2 - 150, titleText, TEXT_STYLES.TITLE)
      .setOrigin(0.5);
    resultContainer.add(title);

    // Sterne anzeigen
    const starY = height / 2 - 80;
    for (let i = 0; i < 3; i++) {
      const starKey = i < result.stars ? 'star_filled' : 'star_empty';
      const star = this.add.image(width / 2 - 60 + (i * 60), starY, starKey)
        .setScale(0);
      resultContainer.add(star);

      this.tweens.add({
        targets: star,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 300,
        delay: i * 200,
        ease: 'Back.easeOut'
      });
    }

    // Statistiken
    const statsY = height / 2;
    const stat1 = this.add.text(width / 2, statsY, `Richtig: ${result.correct} / ${result.total}`, TEXT_STYLES.BODY)
      .setOrigin(0.5);
    resultContainer.add(stat1);

    const stat2 = this.add.text(width / 2, statsY + 35, `Punkte: ${result.score}`, TEXT_STYLES.BODY)
      .setOrigin(0.5);
    resultContainer.add(stat2);

    const stat3 = this.add.text(width / 2, statsY + 70, `Zeit: ${result.time} Sekunden`, TEXT_STYLES.BODY)
      .setOrigin(0.5);
    resultContainer.add(stat3);

    // Münzen-Animation
    const coinIcon = this.add.image(width / 2 - 30, statsY + 110, 'coin');
    const coinText = this.add.text(width / 2 + 10, statsY + 110, `+${result.coins}`, TEXT_STYLES.SCORE).setOrigin(0, 0.5);
    resultContainer.add([coinIcon, coinText]);

    // Buttons
    const buttonY = height / 2 + 170;

    // Weiter zur Weltkarte
    const weiterBtn = this.createResultButton(width / 2 - 120, buttonY, 'Weiter', () => {
      this.scene.start('WorldMapScene');
    });
    resultContainer.add(weiterBtn);

    // Nochmal spielen (wenn nicht alle Sterne)
    if (result.stars < 3) {
      const nochmalBtn = this.createResultButton(width / 2 + 120, buttonY, 'Nochmal', () => {
        this.scene.restart();
      });
      resultContainer.add(nochmalBtn);
    }
  }

  createResultButton(x, y, text, callback) {
    const container = this.add.container(x, y);

    const bg = this.add.image(0, 0, 'button_gold')
      .setScale(0.8)
      .setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(0, 0, text, {
      ...TEXT_STYLES.BUTTON,
      fontSize: '22px'
    }).setOrigin(0.5);

    container.add([bg, buttonText]);

    bg.on('pointerover', () => container.setScale(1.05));
    bg.on('pointerout', () => container.setScale(1));
    bg.on('pointerdown', callback);

    return container;
  }
}
