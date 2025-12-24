export class ChestAnimation {
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

    // Bei Division: Münzen auf Truhen verteilen
    const total = counts.total || 12;
    const groups = Math.min(counts.groups || 3, 4);
    const perGroup = counts.perGroup || Math.floor(total / groups);
    const pos = position || 'both';

    // Panel-Bereich meiden
    const panelHalfWidth = 330;
    const leftAreaX = width / 2 - panelHalfWidth - 100;
    const rightAreaX = width / 2 + panelHalfWidth + 100;
    const chestY = height / 2 + 60;

    // Truhen erstellen - seitlich positioniert
    for (let g = 0; g < groups; g++) {
      let chestX;
      if (pos === 'left') {
        chestX = leftAreaX + (g * 70) + Phaser.Math.Between(-20, 20);
      } else if (pos === 'right') {
        chestX = rightAreaX + (g * 70) - groups * 35 + Phaser.Math.Between(-20, 20);
      } else {
        // Beide Seiten
        const isLeft = g % 2 === 0;
        chestX = isLeft ? leftAreaX + Math.floor(g / 2) * 60 : rightAreaX - Math.floor(g / 2) * 60;
      }

      const chestContainer = this.scene.add.container(chestX, chestY + (g % 2) * 40);
      chestContainer.setDepth(2);

      // Truhe (geschlossen initial) - größer
      const chest = this.scene.add.image(0, 0, 'anim_chest_closed');
      chest.setScale(1.4);
      chestContainer.add(chest);

      chestContainer.chest = chest;
      chestContainer.chestIndex = g;
      chestContainer.coins = [];

      this.elements.push(chestContainer);
    }

    // Münzen oben (zum Verteilen) - auch seitlich
    const coinAreaX = pos === 'right' ? rightAreaX : leftAreaX;
    const coinsContainer = this.scene.add.container(coinAreaX, height / 2 - 80);
    coinsContainer.setDepth(2);

    for (let i = 0; i < total; i++) {
      const coinX = (i % 4 - 1.5) * 25;
      const coinY = Math.floor(i / 4) * 25;

      const coin = this.scene.add.image(coinX, coinY, 'coin');
      coin.setScale(0.6);
      coin.coinIndex = i;
      coin.targetChest = i % groups;
      coinsContainer.add(coin);
    }

    coinsContainer.isCoinsContainer = true;
    this.elements.push(coinsContainer);
  }

  startIdle() {
    // Truhen leicht wackeln
    this.elements.forEach((element, index) => {
      if (element.chest) {
        this.tweens.push(
          this.scene.tweens.add({
            targets: element,
            y: element.y - 3,
            duration: 800 + index * 100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          })
        );
      }
    });

    // Münzen glitzern
    this.elements.forEach(element => {
      if (element.isCoinsContainer) {
        element.each(coin => {
          if (coin.coinIndex !== undefined) {
            this.tweens.push(
              this.scene.tweens.add({
                targets: coin,
                scale: { from: 0.6, to: 0.7 },
                duration: 400 + (coin.coinIndex % 5) * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
              })
            );
          }
        });
      }
    });

    // Nach kurzer Zeit: Münzen verteilen Animation
    this.scene.time.delayedCall(1000, () => this.distributeCoins());
  }

  distributeCoins() {
    const chests = this.elements.filter(e => e.chest);
    const coinsContainer = this.elements.find(e => e.isCoinsContainer);

    if (!coinsContainer) return;

    let coinIndex = 0;

    coinsContainer.each(coin => {
      if (coin.coinIndex === undefined) return;

      const targetChest = chests[coin.targetChest];
      if (!targetChest) return;

      // Position der Truhe (global)
      const targetX = targetChest.x - coinsContainer.x;
      const targetY = targetChest.y - coinsContainer.y - 20;

      // Münze zur Truhe fliegen lassen
      this.scene.tweens.add({
        targets: coin,
        x: targetX + Phaser.Math.Between(-15, 15),
        y: targetY + Phaser.Math.Between(-10, 10),
        duration: 600,
        delay: coinIndex * 100,
        ease: 'Quad.easeIn',
        onStart: () => {
          // Truhe öffnen
          if (targetChest.chest && !targetChest.opened) {
            targetChest.opened = true;
            targetChest.chest.setTexture('anim_chest_open');
            this.scene.tweens.add({
              targets: targetChest,
              scaleY: 1.1,
              duration: 100,
              yoyo: true
            });
          }
        }
      });

      coinIndex++;
    });
  }

  celebrate() {
    // Alle Truhen hüpfen
    this.elements.forEach((element, index) => {
      if (element.chest) {
        this.scene.tweens.add({
          targets: element,
          y: element.y - 30,
          duration: 300,
          delay: index * 100,
          yoyo: true,
          ease: 'Quad.easeOut'
        });

        // Truhe öffnet sich weit
        this.scene.tweens.add({
          targets: element,
          scaleY: 1.2,
          duration: 200,
          delay: index * 100,
          yoyo: true
        });
      }
    });

    // Münzen-Fontäne aus den Truhen
    this.createCoinFountain();
  }

  createCoinFountain() {
    const chests = this.elements.filter(e => e.chest);

    chests.forEach((chest, chestIndex) => {
      for (let i = 0; i < 5; i++) {
        const coin = this.scene.add.image(chest.x, chest.y - 20, 'coin');
        coin.setScale(0.5);
        coin.setDepth(3);

        this.scene.tweens.add({
          targets: coin,
          x: chest.x + Phaser.Math.Between(-40, 40),
          y: chest.y - 80 - Phaser.Math.Between(0, 30),
          alpha: 0,
          angle: 360,
          duration: 600,
          delay: chestIndex * 100 + i * 50,
          ease: 'Quad.easeOut',
          onComplete: () => coin.destroy()
        });
      }
    });
  }

  react(type) {
    if (type === 'wrong') {
      // Truhen schließen sich
      this.elements.forEach((element, index) => {
        if (element.chest) {
          element.chest.setTexture('anim_chest_closed');

          this.scene.tweens.add({
            targets: element,
            scaleY: 0.9,
            duration: 200,
            delay: index * 50,
            yoyo: true
          });
        }
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
