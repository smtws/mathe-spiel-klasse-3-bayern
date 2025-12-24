export class CoinAnimation {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.elements = [];
    this.tweens = [];

    this.create();
  }

  create() {
    const { width, height } = this.scene.scale;
    const { counts, type, position } = this.config;
    this.position = position || 'both';

    switch (type) {
      case 'multiplication':
        this.createMultiplicationLayout(counts);
        break;
      case 'addition':
        this.createAdditionLayout(counts);
        break;
      case 'subtraction':
        this.createSubtractionLayout(counts);
        break;
      case 'division':
        this.createDivisionLayout(counts);
        break;
      default:
        this.createDefaultLayout(counts);
    }
  }

  // Helper für off-center Positionen
  getOffsetX(isLeft) {
    const { width } = this.scene.scale;
    const panelHalfWidth = 330;
    if (this.position === 'left' || (this.position === 'both' && isLeft)) {
      return width / 2 - panelHalfWidth - 120;
    } else {
      return width / 2 + panelHalfWidth + 120;
    }
  }

  createMultiplicationLayout(counts) {
    const { width, height } = this.scene.scale;
    const rows = Math.min(counts.groups || 3, 5);
    const cols = Math.min(counts.itemsPerGroup || 4, 6);

    // Off-center basierend auf position
    const baseX = this.getOffsetX(this.position !== 'right');
    const startX = baseX - (cols - 1) * 20;
    const startY = height / 2 - (rows - 1) * 18;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * 40;
        const y = startY + r * 36;
        const coin = this.createCoin(x, y, r * cols + c);
        this.elements.push(coin);
      }
    }
  }

  createAdditionLayout(counts) {
    const { width, height } = this.scene.scale;
    const first = Math.min(counts.first || 5, 10);
    const second = Math.min(counts.second || 3, 10);

    // Erste Gruppe (links)
    for (let i = 0; i < first; i++) {
      const x = width / 2 - 120 + (i % 5) * 30;
      const y = height / 2 - 30 + Math.floor(i / 5) * 35;
      const coin = this.createCoin(x, y, i);
      coin.group = 'first';
      this.elements.push(coin);
    }

    // Zweite Gruppe (rechts) - fliegt später rein
    for (let i = 0; i < second; i++) {
      const x = width / 2 + 80 + (i % 5) * 30;
      const y = height / 2 - 30 + Math.floor(i / 5) * 35;
      const coin = this.createCoin(x, y, first + i);
      coin.group = 'second';
      coin.setAlpha(0.5);
      this.elements.push(coin);
    }

    // Plus-Zeichen in der Mitte
    const plus = this.scene.add.text(width / 2, height / 2, '+', {
      fontSize: '48px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    plus.setDepth(1);
    this.elements.push(plus);
  }

  createSubtractionLayout(counts) {
    const { width, height } = this.scene.scale;
    const start = Math.min(counts.start || 10, 15);
    const remove = Math.min(counts.remove || 3, 10);

    // Alle Münzen initial
    for (let i = 0; i < start; i++) {
      const x = width / 2 - 100 + (i % 6) * 35;
      const y = height / 2 - 30 + Math.floor(i / 6) * 40;
      const coin = this.createCoin(x, y, i);
      coin.willRemove = i >= (start - remove);
      if (coin.willRemove) {
        coin.setTint(0xff9999); // Rötlich markieren
      }
      this.elements.push(coin);
    }
  }

  createDivisionLayout(counts) {
    const { width, height } = this.scene.scale;
    const total = Math.min(counts.total || 12, 20);
    const groups = Math.min(counts.groups || 3, 4);
    const perGroup = Math.floor(total / groups);

    // Schatztruhen für die Gruppen
    const chestSpacing = 150;
    const chestStartX = width / 2 - ((groups - 1) * chestSpacing) / 2;

    for (let g = 0; g < groups; g++) {
      const chestX = chestStartX + g * chestSpacing;
      const chestY = height / 2 + 60;

      // Truhe
      const chest = this.scene.add.image(chestX, chestY, 'anim_chest_open');
      chest.setScale(0.8);
      chest.setDepth(1);
      this.elements.push(chest);

      // Münzen über der Truhe
      for (let c = 0; c < perGroup; c++) {
        const coinX = chestX - 20 + (c % 3) * 20;
        const coinY = chestY - 50 - Math.floor(c / 3) * 25;
        const coin = this.createCoin(coinX, coinY, g * perGroup + c);
        coin.targetChest = g;
        this.elements.push(coin);
      }
    }
  }

  createDefaultLayout(counts) {
    const { width, height } = this.scene.scale;
    const total = Math.min(counts.total || 10, 15);

    for (let i = 0; i < total; i++) {
      const angle = (i / total) * Math.PI * 2;
      const radius = 80;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius - 20;
      const coin = this.createCoin(x, y, i);
      this.elements.push(coin);
    }
  }

  createCoin(x, y, index) {
    const coin = this.scene.add.image(x, y, 'coin');
    coin.setScale(1.0);
    coin.setDepth(2);
    coin.coinIndex = index;
    return coin;
  }

  startIdle() {
    this.elements.forEach((element, index) => {
      // Nur Münzen animieren (nicht Text oder Truhen)
      if (!element.coinIndex && element.coinIndex !== 0) return;

      // Leichtes Glitzern (Scale-Puls)
      this.tweens.push(
        this.scene.tweens.add({
          targets: element,
          scaleX: 0.8,
          scaleY: 0.8,
          duration: 400 + (index % 5) * 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: index * 50
        })
      );

      // Leichte Rotation
      this.tweens.push(
        this.scene.tweens.add({
          targets: element,
          angle: { from: -5, to: 5 },
          duration: 600 + (index % 3) * 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      );
    });

    // Bei Addition: zweite Gruppe einfliegen lassen
    if (this.config.type === 'addition') {
      this.animateAddition();
    }

    // Bei Subtraktion: Münzen wegfliegen lassen
    if (this.config.type === 'subtraction') {
      this.scene.time.delayedCall(1500, () => this.animateSubtraction());
    }
  }

  animateAddition() {
    this.elements.forEach((element, index) => {
      if (element.group === 'second') {
        this.scene.tweens.add({
          targets: element,
          alpha: 1,
          x: element.x - 40,
          duration: 800,
          delay: 500 + index * 50,
          ease: 'Back.easeOut'
        });
      }
    });
  }

  animateSubtraction() {
    this.elements.forEach((element) => {
      if (element.willRemove) {
        this.scene.tweens.add({
          targets: element,
          y: element.y - 100,
          alpha: 0,
          angle: 180,
          duration: 600,
          ease: 'Quad.easeIn'
        });
      }
    });
  }

  celebrate() {
    this.elements.forEach((element, index) => {
      if (!element.coinIndex && element.coinIndex !== 0) return;

      // Münzen hüpfen
      this.scene.tweens.add({
        targets: element,
        y: element.y - 30,
        duration: 200,
        delay: index * 30,
        yoyo: true,
        ease: 'Quad.easeOut'
      });

      // Funkeln
      this.scene.tweens.add({
        targets: element,
        scale: 1,
        duration: 150,
        delay: index * 30,
        yoyo: true
      });
    });

    // Sparkle-Effekt
    this.createSparkles();
  }

  createSparkles() {
    const { width, height } = this.scene.scale;

    for (let i = 0; i < 10; i++) {
      const sparkle = this.scene.add.star(
        width / 2 + Phaser.Math.Between(-100, 100),
        height / 2 + Phaser.Math.Between(-50, 50),
        5, 2, 5, 0xffd700
      );
      sparkle.setDepth(2);
      sparkle.setAlpha(0);

      this.scene.tweens.add({
        targets: sparkle,
        alpha: 1,
        scale: { from: 0, to: 1.5 },
        duration: 300,
        delay: i * 50,
        yoyo: true,
        onComplete: () => sparkle.destroy()
      });
    }
  }

  react(type) {
    if (type === 'wrong') {
      this.elements.forEach((element, index) => {
        if (!element.coinIndex && element.coinIndex !== 0) return;

        this.scene.tweens.add({
          targets: element,
          tint: 0x888888,
          duration: 200,
          delay: index * 20,
          yoyo: true
        });
      });
    }
  }

  destroy() {
    this.tweens.forEach(tween => {
      if (tween && tween.stop) tween.stop();
    });
    this.tweens = [];

    this.elements.forEach(element => {
      if (element && element.destroy) element.destroy();
    });
    this.elements = [];
  }
}
