import Phaser from 'phaser';
import { TEXT_STYLES, COLORS, GAME_CONSTANTS } from '../config.js';
import { QuestionManager } from '../managers/QuestionManager.js';
import { SaveManager } from '../managers/SaveManager.js';
import { NarrationManager } from '../managers/NarrationManager.js';
import { CelebrationManager } from '../managers/CelebrationManager.js';

export class BossScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BossScene' });
  }

  init(data) {
    this.chapter = data.chapter || 1;
    this.bossId = data.bossId || 'krokodil';
    this.bossConfig = this.getBossConfig(this.bossId);
  }

  getBossConfig(bossId) {
    const configs = {
      krokodil: {
        name: 'Krokodil-Wächter',
        description: 'Der gefährliche Wächter der Fluss-Region!',
        questionTypes: ['multiplication', 'addition', 'division'],
        questionCount: GAME_CONSTANTS.BOSS_QUESTIONS,
        timeLimit: GAME_CONSTANTS.BOSS_TIME_LIMIT,
        lives: 3,
        difficulty: 'normal',
        color: 0x228B22,
        reward: {
          coins: 100,
          sticker: 'krokodil',
          achievement: 'tierfreund'
        }
      }
    };
    return configs[bossId] || configs.krokodil;
  }

  create() {
    const { width, height } = this.scale;

    // Kamera einblenden
    this.cameras.main.fadeIn(300, 0, 0, 0);

    this.saveManager = new SaveManager();
    this.saveData = this.saveManager.load();

    // Narration und Feier-Effekte
    this.narrationManager = new NarrationManager();
    this.celebrationManager = new CelebrationManager(this, this.narrationManager);

    // Spielzustand
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.lives = this.bossConfig.lives;
    this.timeRemaining = this.bossConfig.timeLimit;
    this.isAnswering = false;
    this.isGameOver = false;

    // Vorgeladene Frage für flüssigere Übergänge
    this.preloadedQuestion = null;
    this.preloadedQuestionIndex = -1;

    // Hintergrund
    this.createBossArena();

    // QuestionManager (mit bereits beantworteten Fragen)
    const answeredQuestionIds = this.saveManager.getAnsweredQuestionIds();
    this.questionManager = new QuestionManager(
      this.bossConfig.questionTypes,
      this.bossConfig.difficulty,
      this.bossConfig.questionCount,
      answeredQuestionIds
    );

    // UI erstellen
    this.createUI();

    // Boss anzeigen
    this.createBoss();

    // Spieler anzeigen
    this.createPlayer();

    // Intro zeigen, dann Kampf starten
    this.showBossIntro();
  }

  createBossArena() {
    const { width, height } = this.scale;
    const graphics = this.add.graphics();

    // Dramatischer Hintergrund
    graphics.fillStyle(0x1a3a1a, 1);
    graphics.fillRect(0, 0, width, height);

    // Wasser/Sumpf unten
    graphics.fillStyle(0x2d5a4a, 1);
    graphics.fillRect(0, height - 120, width, 120);

    // Wasserwellen
    graphics.fillStyle(0x4a90d9, 0.3);
    for (let i = 0; i < width; i += 60) {
      graphics.fillEllipse(i + 30, height - 60, 40, 15);
    }

    // Nebel/Atmosphäre
    for (let i = 0; i < 10; i++) {
      graphics.fillStyle(0xffffff, 0.05);
      graphics.fillEllipse(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(height / 2, height),
        Phaser.Math.Between(100, 300),
        Phaser.Math.Between(30, 60)
      );
    }
  }

  createUI() {
    const { width, height } = this.scale;

    // Boss-Name
    this.add.text(width / 2, 30, this.bossConfig.name, {
      ...TEXT_STYLES.TITLE,
      fontSize: '32px',
      color: '#ff6347'
    }).setOrigin(0.5);

    // Timer
    this.timerContainer = this.add.container(width / 2, 80);
    const timerBg = this.add.image(0, 0, 'timer_bg');
    this.timerText = this.add.text(0, 0, this.formatTime(this.timeRemaining), {
      ...TEXT_STYLES.SCORE,
      fontSize: '28px'
    }).setOrigin(0.5);
    this.timerContainer.add([timerBg, this.timerText]);

    // Leben (Herzen)
    this.livesContainer = this.add.container(width - 100, 30);
    this.heartImages = [];
    for (let i = 0; i < this.bossConfig.lives; i++) {
      const heart = this.add.image(i * 35, 0, 'heart').setScale(0.8);
      this.heartImages.push(heart);
      this.livesContainer.add(heart);
    }

    // Fortschrittsanzeige
    this.progressText = this.add.text(30, 30, `Frage 0/${this.bossConfig.questionCount}`, TEXT_STYLES.BODY);
  }

  createBoss() {
    const { width, height } = this.scale;

    this.boss = this.add.image(width - 200, height / 2 + 50, `animal_${this.bossId}`)
      .setScale(2);

    // Bedrohliche Idle-Animation
    this.tweens.add({
      targets: this.boss,
      scaleX: 2.1,
      scaleY: 1.9,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createPlayer() {
    const { width, height } = this.scale;
    const charKey = `player_${this.saveData.player.character || 'maya'}`;

    this.player = this.add.image(150, height / 2 + 100, charKey)
      .setScale(1.5);

    // Leichte Bewegung
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 5,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  showBossIntro() {
    const { width, height } = this.scale;

    // Verdunkeln
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // Boss-Einführung
    const introContainer = this.add.container(width / 2, height / 2);

    const introText = this.add.text(0, -50, this.bossConfig.description, {
      ...TEXT_STYLES.SUBTITLE,
      wordWrap: { width: 500 },
      align: 'center'
    }).setOrigin(0.5);

    const challengeText = this.add.text(0, 30, 'Besiege ihn mit deinem Mathe-Wissen!', {
      ...TEXT_STYLES.BODY,
      color: '#ffd700'
    }).setOrigin(0.5);

    const startText = this.add.text(0, 100, '[ Klicke um zu starten ]', {
      ...TEXT_STYLES.BODY,
      color: '#90EE90'
    }).setOrigin(0.5);

    introContainer.add([introText, challengeText, startText]);

    // Blinken des Start-Texts
    this.tweens.add({
      targets: startText,
      alpha: 0.5,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Klick zum Starten
    overlay.setInteractive();
    overlay.once('pointerdown', () => {
      overlay.destroy();
      introContainer.destroy();
      this.startBossFight();
    });
  }

  startBossFight() {
    // Timer starten
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      repeat: this.bossConfig.timeLimit - 1
    });

    // Erste Frage zeigen
    this.showNextQuestion();
  }

  updateTimer() {
    this.timeRemaining--;
    this.timerText.setText(this.formatTime(this.timeRemaining));

    // Warnung bei wenig Zeit
    if (this.timeRemaining <= 10) {
      this.timerText.setColor('#ff6347');
      this.tweens.add({
        targets: this.timerContainer,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        yoyo: true
      });
    }

    // Zeit abgelaufen
    if (this.timeRemaining <= 0) {
      this.gameOver(false);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  showNextQuestion() {
    if (this.isGameOver) return;

    if (this.currentQuestion >= this.bossConfig.questionCount) {
      this.victory();
      return;
    }

    // Vorgeladene Frage verwenden falls vorhanden
    let question;
    if (this.preloadedQuestion && this.preloadedQuestionIndex === this.currentQuestion) {
      question = this.preloadedQuestion;
      this.preloadedQuestion = null;
    } else {
      question = this.questionManager.getQuestion(this.currentQuestion);
    }

    this.currentQuestionData = question;
    this.displayQuestion(question);

    // Nächste Frage vorladen
    this.preloadNextQuestion();
  }

  preloadNextQuestion() {
    const nextIndex = this.currentQuestion + 1;
    if (nextIndex < this.bossConfig.questionCount) {
      this.time.delayedCall(50, () => {
        this.preloadedQuestion = this.questionManager.getQuestion(nextIndex);
        this.preloadedQuestionIndex = nextIndex;
      });
    }
  }

  displayQuestion(question) {
    const { width, height } = this.scale;

    // Alte Elemente entfernen
    if (this.questionContainer) {
      this.questionContainer.destroy();
    }

    this.questionContainer = this.add.container(width / 2, height / 2 - 80);

    // Frage-Panel
    const panel = this.add.image(0, 0, 'panel_small').setScale(0.9);

    // Frage
    const questionText = this.add.text(0, -30, question.question, {
      ...TEXT_STYLES.QUESTION,
      fontSize: '42px'
    }).setOrigin(0.5);

    // Animation
    questionText.setAlpha(0);
    this.tweens.add({
      targets: questionText,
      alpha: 1,
      duration: 200
    });

    this.questionContainer.add([panel, questionText]);

    // Antwort-Buttons
    this.createAnswerButtons(question.options, question.correctAnswer);

    // Fortschritt aktualisieren
    this.progressText.setText(`Frage ${this.currentQuestion + 1}/${this.bossConfig.questionCount}`);

    this.isAnswering = true;
  }

  createAnswerButtons(options, correctAnswer) {
    const { width, height } = this.scale;

    if (this.answerButtons) {
      this.answerButtons.forEach(btn => btn.destroy());
    }
    this.answerButtons = [];

    // 2x2 Grid Layout (touch-friendly)
    const horizontalGap = 130;
    const verticalGap = 65;
    const startY = height / 2 + 115;

    const positions = [
      { x: width / 2 - horizontalGap, y: startY },
      { x: width / 2 + horizontalGap, y: startY },
      { x: width / 2 - horizontalGap, y: startY + verticalGap },
      { x: width / 2 + horizontalGap, y: startY + verticalGap }
    ];

    options.forEach((option, index) => {
      const pos = positions[index];
      const container = this.add.container(pos.x, pos.y);

      const bg = this.add.image(0, 0, 'answer_button')
        .setScale(0.7)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(0, 0, option.toString(), {
        ...TEXT_STYLES.BUTTON,
        fontSize: '22px'
      }).setOrigin(0.5);

      container.add([bg, text]);

      // Animation
      container.setAlpha(0);
      container.setScale(0.5);
      this.tweens.add({
        targets: container,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        delay: index * 50,
        ease: 'Back.easeOut'
      });

      bg.on('pointerover', () => {
        if (!this.isAnswering) return;
        container.setScale(1.05);
      });

      bg.on('pointerout', () => {
        container.setScale(1);
      });

      bg.on('pointerdown', () => {
        if (!this.isAnswering) return;
        this.handleAnswer(option, correctAnswer, container, bg);
      });

      container.answerValue = option;
      container.bgImage = bg;
      this.answerButtons.push(container);
    });
  }

  handleAnswer(selectedAnswer, correctAnswer, container, bgImage) {
    this.isAnswering = false;

    this.answerButtons.forEach(btn => {
      btn.bgImage.disableInteractive();
    });

    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      this.handleCorrectAnswer(container, bgImage);
    } else {
      this.handleWrongAnswer(container, bgImage, correctAnswer);
    }
  }

  handleCorrectAnswer(container, bgImage) {
    this.correctAnswers++;

    bgImage.setTexture('answer_correct');

    // Boss-Reaktion (getroffen)
    this.bossHit();

    // Partikel
    this.createCorrectParticles(container.x, container.y);

    this.time.delayedCall(800, () => {
      this.currentQuestion++;
      this.showNextQuestion();
    });
  }

  handleWrongAnswer(container, bgImage, correctAnswer) {
    this.lives--;
    this.updateLives();

    bgImage.setTexture('answer_wrong');

    // Richtige Antwort zeigen
    this.answerButtons.forEach(btn => {
      if (btn.answerValue === correctAnswer) {
        btn.bgImage.setTexture('answer_correct');
      }
    });

    // Boss-Angriff
    this.bossAttack();

    // Spieler-Reaktion
    this.playerHit();

    if (this.lives <= 0) {
      this.time.delayedCall(1000, () => {
        this.gameOver(false);
      });
    } else {
      this.time.delayedCall(1500, () => {
        this.currentQuestion++;
        this.showNextQuestion();
      });
    }
  }

  bossHit() {
    // Boss wackelt/wird getroffen
    this.tweens.add({
      targets: this.boss,
      x: this.boss.x + 20,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.boss.clearTint();
      }
    });
  }

  bossAttack() {
    const { width } = this.scale;

    // Boss springt nach vorne
    this.tweens.add({
      targets: this.boss,
      x: width / 2,
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });

    // Schnapp-Animation Text
    const snapText = this.add.text(this.boss.x - 50, this.boss.y - 80, 'SCHNAPP!', {
      ...TEXT_STYLES.TITLE,
      fontSize: '28px',
      color: '#ff6347'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: snapText,
      y: snapText.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => snapText.destroy()
    });
  }

  playerHit() {
    // Spieler wird zurückgestoßen
    this.tweens.add({
      targets: this.player,
      x: this.player.x - 30,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.player.clearTint();
      }
    });
  }

  updateLives() {
    // Herzen aktualisieren
    for (let i = 0; i < this.heartImages.length; i++) {
      if (i >= this.lives) {
        this.heartImages[i].setAlpha(0.3);
      }
    }
  }

  createCorrectParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      const particle = this.add.star(x, y, 5, 5, 10, COLORS.GOLD);

      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-80, 80),
        y: y + Phaser.Math.Between(-80, -30),
        alpha: 0,
        scale: 0,
        duration: 600,
        onComplete: () => particle.destroy()
      });
    }
  }

  victory() {
    this.isGameOver = true;

    if (this.timerEvent) {
      this.timerEvent.destroy();
    }

    // Boss besiegt speichern
    this.saveManager.defeatBoss(this.bossId);
    this.saveManager.addCoins(this.bossConfig.reward.coins);
    this.saveManager.unlockAchievement(this.bossConfig.reward.achievement);

    // Richtig beantwortete Fragen speichern
    const correctlyAnsweredIds = this.questionManager.getCorrectlyAnsweredIds();
    if (correctlyAnsweredIds.length > 0) {
      this.saveManager.addAnsweredQuestions(correctlyAnsweredIds);
    }

    // Victory-Sequenz
    this.showVictorySequence();
  }

  showVictorySequence() {
    const { width, height } = this.scale;

    // Boss-Niederlage Animation
    this.tweens.add({
      targets: this.boss,
      scaleX: 0,
      scaleY: 0,
      rotation: 2,
      alpha: 0,
      duration: 1000,
      ease: 'Power2'
    });

    // Overlay
    this.time.delayedCall(500, () => {
      const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

      // === FEIER-EFFEKTE FÜR BOSS-SIEG (immer maximal!) ===
      if (this.celebrationManager) {
        this.celebrationManager.celebrate(3, this.correctAnswers, this.bossConfig.questionCount);
      }

      // Victory-Text
      const victoryText = this.add.text(width / 2, height / 2 - 100, 'SIEG!', {
        ...TEXT_STYLES.TITLE,
        fontSize: '72px',
        color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: victoryText,
        alpha: 1,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 500,
        yoyo: true,
        repeat: 1
      });

      // Boss besiegt Info
      const defeatText = this.add.text(width / 2, height / 2, `Du hast den ${this.bossConfig.name} besiegt!`, {
        ...TEXT_STYLES.SUBTITLE,
        fontSize: '24px'
      }).setOrigin(0.5);

      // Belohnungen
      const rewardText = this.add.text(width / 2, height / 2 + 50, `+${this.bossConfig.reward.coins} Münzen`, {
        ...TEXT_STYLES.SCORE,
        fontSize: '28px'
      }).setOrigin(0.5);

      // Sticker-Belohnung
      const stickerText = this.add.text(width / 2, height / 2 + 90, '🏆 Krokodil-Sticker erhalten!', {
        ...TEXT_STYLES.BODY,
        fontSize: '20px',
        color: '#90EE90'
      }).setOrigin(0.5);

      // Weiter-Button
      this.time.delayedCall(2000, () => {
        const continueBtn = this.createVictoryButton(width / 2, height / 2 + 160, 'Weiter', () => {
          this.scene.start('WorldMapScene');
        });
      });
    });
  }

  gameOver(byTime) {
    this.isGameOver = true;

    if (this.timerEvent) {
      this.timerEvent.destroy();
    }

    // Richtig beantwortete Fragen auch bei Niederlage speichern
    const correctlyAnsweredIds = this.questionManager.getCorrectlyAnsweredIds();
    if (correctlyAnsweredIds.length > 0) {
      this.saveManager.addAnsweredQuestions(correctlyAnsweredIds);
    }

    const { width, height } = this.scale;

    // Overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

    // Game Over Text
    const gameOverText = this.add.text(width / 2, height / 2 - 80,
      byTime ? 'Zeit abgelaufen!' : 'Keine Leben mehr!', {
      ...TEXT_STYLES.TITLE,
      fontSize: '42px',
      color: '#ff6347'
    }).setOrigin(0.5);

    // Ermutigung
    const encourageText = this.add.text(width / 2, height / 2, 'Übe noch ein bisschen und versuche es erneut!', {
      ...TEXT_STYLES.BODY,
      wordWrap: { width: 400 },
      align: 'center'
    }).setOrigin(0.5);

    // Statistik
    const statsText = this.add.text(width / 2, height / 2 + 50,
      `Geschafft: ${this.correctAnswers}/${this.currentQuestion} Fragen`, {
      ...TEXT_STYLES.BODY,
      fontSize: '20px'
    }).setOrigin(0.5);

    // Buttons
    this.createVictoryButton(width / 2 - 100, height / 2 + 120, 'Nochmal', () => {
      this.scene.restart();
    });

    this.createVictoryButton(width / 2 + 100, height / 2 + 120, 'Zurück', () => {
      this.scene.start('WorldMapScene');
    });
  }

  createVictoryButton(x, y, text, callback) {
    const container = this.add.container(x, y);

    const bg = this.add.image(0, 0, 'button_gold')
      .setScale(0.7)
      .setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(0, 0, text, {
      ...TEXT_STYLES.BUTTON,
      fontSize: '20px'
    }).setOrigin(0.5);

    container.add([bg, buttonText]);

    bg.on('pointerover', () => container.setScale(1.05));
    bg.on('pointerout', () => container.setScale(1));
    bg.on('pointerdown', callback);

    return container;
  }
}
