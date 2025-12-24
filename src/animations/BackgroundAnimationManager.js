import { AnimationFactory } from './AnimationFactory.js';

export class BackgroundAnimationManager {
  constructor(scene) {
    this.scene = scene;
    this.container = null;
    this.currentAnimation = null;
    this.animationFactory = new AnimationFactory(scene);
    this.tweens = [];
    this.particles = [];
  }

  // Initialisiere den Animation-Container (muss nach Hintergrund, vor Panel aufgerufen werden)
  init() {
    const { width, height } = this.scene.scale;

    // Container für alle Animationen - wird hinter dem Panel platziert
    this.container = this.scene.add.container(width / 2, height / 2);
    this.container.setDepth(1); // Hinter Panel (depth 3)

    console.log('BackgroundAnimationManager initialisiert');
  }

  // Erstellt Animation basierend auf Fragen-Daten
  createAnimation(questionData) {
    // Vorherige Animation aufräumen
    this.clearAnimation();

    if (!this.container) {
      this.init();
    }

    console.log('Erstelle Animation für:', questionData.visualData?.icon || 'fallback');

    // Animation über Factory erstellen
    const animation = this.animationFactory.create(questionData);

    if (animation) {
      this.currentAnimation = animation;
      console.log('Animation erstellt mit', animation.elements?.length || 0, 'Elementen');

      // Entry-Animation abspielen
      this.playEntryAnimation();
    }
  }

  // Entry-Animation: Elemente gleiten rein
  playEntryAnimation() {
    if (!this.currentAnimation || !this.currentAnimation.elements) return;

    this.currentAnimation.elements.forEach((element, index) => {
      // Startposition (außerhalb links)
      const targetX = element.x;
      const targetY = element.y;
      element.setPosition(targetX - 200, targetY);
      element.setAlpha(0);

      // Einblenden mit Verzögerung
      this.scene.tweens.add({
        targets: element,
        x: targetX,
        alpha: 1,
        duration: 400,
        delay: index * 100,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Nach Entry: Idle-Animation starten
          if (index === 0) {
            this.startIdleAnimations();
          }
        }
      });
    });
  }

  // Idle-Animationen für alle Elemente
  startIdleAnimations() {
    if (!this.currentAnimation) return;

    // Animation-spezifische Idle-Animationen
    if (this.currentAnimation.startIdle) {
      this.currentAnimation.startIdle();
    }

    // Wind-Effekt hinzufügen
    this.addWindEffect();
  }

  // Wind-Effekt mit schwebenden Partikeln
  addWindEffect() {
    const { width, height } = this.scene.scale;

    // Schwebende Blätter erstellen
    for (let i = 0; i < 5; i++) {
      this.scene.time.delayedCall(i * 500, () => {
        this.createFloatingLeaf();
      });
    }

    // Kontinuierlich neue Blätter
    this.leafTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: () => this.createFloatingLeaf(),
      loop: true
    });
  }

  createFloatingLeaf() {
    if (!this.container) return;

    const { width, height } = this.scene.scale;
    const startX = -50;
    const startY = Phaser.Math.Between(100, height - 200);

    // Kleines grünes Blatt
    const leaf = this.scene.add.ellipse(startX, startY, 12, 6, 0x228b22, 0.7);
    leaf.setDepth(1);

    this.particles.push(leaf);

    // Blatt schwebt nach rechts mit Wellen-Bewegung
    this.scene.tweens.add({
      targets: leaf,
      x: width + 50,
      duration: 8000,
      ease: 'Linear',
      onComplete: () => {
        leaf.destroy();
        const index = this.particles.indexOf(leaf);
        if (index > -1) this.particles.splice(index, 1);
      }
    });

    // Vertikale Wellen-Bewegung
    this.scene.tweens.add({
      targets: leaf,
      y: startY + Phaser.Math.Between(-30, 30),
      duration: 1500,
      yoyo: true,
      repeat: 5,
      ease: 'Sine.easeInOut'
    });

    // Rotation
    this.scene.tweens.add({
      targets: leaf,
      angle: 360,
      duration: 4000,
      repeat: 2
    });
  }

  // Reaktion bei richtiger Antwort
  onCorrectAnswer() {
    if (this.currentAnimation && this.currentAnimation.celebrate) {
      this.currentAnimation.celebrate();
    }

    // Extra Funkeln-Effekt
    this.createSparkles();
  }

  // Reaktion bei falscher Antwort
  onWrongAnswer() {
    if (this.currentAnimation && this.currentAnimation.react) {
      this.currentAnimation.react('wrong');
    }
  }

  // Funkeln-Effekt
  createSparkles() {
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(-150, 150);
      const y = Phaser.Math.Between(-100, 100);

      const sparkle = this.scene.add.star(
        this.scene.scale.width / 2 + x,
        this.scene.scale.height / 2 + y,
        5, 3, 8, 0xffd700
      );
      sparkle.setDepth(2);
      sparkle.setAlpha(0);
      sparkle.setScale(0);

      this.scene.tweens.add({
        targets: sparkle,
        alpha: 1,
        scale: 1,
        duration: 200,
        delay: i * 50,
        yoyo: true,
        hold: 100,
        onComplete: () => sparkle.destroy()
      });
    }
  }

  // Animation aufräumen
  clearAnimation() {
    // Tweens stoppen
    this.tweens.forEach(tween => {
      if (tween && tween.stop) tween.stop();
    });
    this.tweens = [];

    // Timer stoppen
    if (this.leafTimer) {
      this.leafTimer.destroy();
      this.leafTimer = null;
    }

    // Partikel entfernen
    this.particles.forEach(p => {
      if (p && p.destroy) p.destroy();
    });
    this.particles = [];

    // Aktuelle Animation aufräumen
    if (this.currentAnimation) {
      if (this.currentAnimation.destroy) {
        this.currentAnimation.destroy();
      }
      this.currentAnimation = null;
    }

    // Container leeren (aber nicht zerstören)
    if (this.container) {
      this.container.removeAll(true);
    }
  }

  // Komplett aufräumen
  destroy() {
    this.clearAnimation();
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
  }
}
