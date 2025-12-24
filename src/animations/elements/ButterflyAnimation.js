export class ButterflyAnimation {
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

    const butterflyCount = Math.min(counts.total || counts.groups * counts.itemsPerGroup || 8, 12);
    const pos = position || 'both';

    // Panel-Bereich meiden
    const panelHalfWidth = 330;
    const leftAreaX = width / 2 - panelHalfWidth - 80;
    const rightAreaX = width / 2 + panelHalfWidth + 80;
    const centerY = height / 2;

    console.log(`Erstelle ${butterflyCount} Schmetterlinge (Position: ${pos})`);

    for (let i = 0; i < butterflyCount; i++) {
      let x, y;

      if (pos === 'left') {
        x = leftAreaX + Phaser.Math.Between(-60, 60);
        y = centerY + Phaser.Math.Between(-120, 120);
      } else if (pos === 'right') {
        x = rightAreaX + Phaser.Math.Between(-60, 60);
        y = centerY + Phaser.Math.Between(-120, 120);
      } else {
        const isLeft = i % 2 === 0;
        x = isLeft ? leftAreaX + Phaser.Math.Between(-50, 70) : rightAreaX + Phaser.Math.Between(-70, 50);
        y = centerY + Phaser.Math.Between(-100, 100);
      }

      const butterfly = this.createButterfly(x, y, i);
      this.elements.push(butterfly);
    }

    // Blumen seitlich
    this.createFlowers(pos);
  }

  createButterfly(x, y, index) {
    const container = this.scene.add.container(x, y);
    container.setDepth(2);

    // Schmetterling (zufällige Farbe) - größer
    const colors = ['anim_butterfly_blue', 'anim_butterfly_orange'];
    const butterfly = this.scene.add.image(0, 0, colors[index % colors.length]);
    butterfly.setScale(1.3);
    container.add(butterfly);

    container.butterfly = butterfly;
    container.butterflyIndex = index;
    container.originalX = x;
    container.originalY = y;

    return container;
  }

  createFlowers(pos) {
    const { width, height } = this.scene.scale;
    const panelHalfWidth = 330;
    const leftX = width / 2 - panelHalfWidth - 100;
    const rightX = width / 2 + panelHalfWidth + 100;

    // Blumen seitlich verteilen
    const flowerPositions = [];
    if (pos === 'left' || pos === 'both') {
      for (let i = 0; i < 3; i++) {
        flowerPositions.push({ x: leftX + Phaser.Math.Between(-40, 40), y: height / 2 + 80 + i * 30 });
      }
    }
    if (pos === 'right' || pos === 'both') {
      for (let i = 0; i < 3; i++) {
        flowerPositions.push({ x: rightX + Phaser.Math.Between(-40, 40), y: height / 2 + 80 + i * 30 });
      }
    }

    flowerPositions.forEach(fp => {
      const flower = this.scene.add.image(fp.x, fp.y, 'anim_flower');
      flower.setScale(0.8);
      flower.setDepth(1);
      this.elements.push(flower);
    });
  }

  startIdle() {
    this.elements.forEach((element, index) => {
      if (!element.butterfly) return; // Skip flowers

      // Flügel-Flattern (Scale X)
      this.tweens.push(
        this.scene.tweens.add({
          targets: element.butterfly,
          scaleX: { from: 0.8, to: 0.3 },
          duration: 150,
          yoyo: true,
          repeat: -1
        })
      );

      // Flugbewegung (Kreise/Wellen)
      this.animateFlight(element, index);
    });
  }

  animateFlight(container, index) {
    const { width, height } = this.scene.scale;

    // Zufälliger Flugpfad
    const flightDuration = 3000 + index * 500;

    const moveToRandom = () => {
      if (!container || !container.active) return;

      const targetX = container.originalX + Phaser.Math.Between(-80, 80);
      const targetY = container.originalY + Phaser.Math.Between(-60, 60);

      // Sicherstellen, dass im sichtbaren Bereich
      const clampedX = Phaser.Math.Clamp(targetX, width / 2 - 200, width / 2 + 200);
      const clampedY = Phaser.Math.Clamp(targetY, height / 2 - 120, height / 2 + 100);

      this.tweens.push(
        this.scene.tweens.add({
          targets: container,
          x: clampedX,
          y: clampedY,
          duration: flightDuration,
          ease: 'Sine.easeInOut',
          onComplete: () => moveToRandom()
        })
      );
    };

    // Verzögerter Start
    this.scene.time.delayedCall(index * 200, moveToRandom);

    // Leichte Rotation während des Flugs
    this.tweens.push(
      this.scene.tweens.add({
        targets: container,
        angle: { from: -10, to: 10 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    );
  }

  celebrate() {
    const { width, height } = this.scene.scale;

    this.elements.forEach((element, index) => {
      if (!element.butterfly) return;

      // Alle fliegen nach oben
      this.scene.tweens.add({
        targets: element,
        y: element.y - 80,
        duration: 500,
        delay: index * 50,
        yoyo: true,
        ease: 'Quad.easeOut'
      });

      // Schnelleres Flattern
      this.scene.tweens.add({
        targets: element.butterfly,
        scaleY: 1.2,
        duration: 100,
        delay: index * 50,
        yoyo: true,
        repeat: 3
      });
    });

    // Spiral-Effekt (alle sammeln sich in der Mitte)
    this.scene.time.delayedCall(600, () => {
      this.elements.forEach((element, index) => {
        if (!element.butterfly) return;

        this.scene.tweens.add({
          targets: element,
          x: width / 2,
          y: height / 2 - 30,
          duration: 400,
          delay: index * 30,
          ease: 'Quad.easeIn',
          onComplete: () => {
            // Wieder verteilen
            this.scene.tweens.add({
              targets: element,
              x: element.originalX,
              y: element.originalY,
              duration: 600,
              ease: 'Quad.easeOut'
            });
          }
        });
      });
    });
  }

  react(type) {
    if (type === 'wrong') {
      // Schmetterlinge fliegen weg
      this.elements.forEach((element, index) => {
        if (!element.butterfly) return;

        this.scene.tweens.add({
          targets: element,
          x: element.x + Phaser.Math.Between(-50, 50),
          y: element.y - 30,
          alpha: 0.5,
          duration: 400,
          delay: index * 30,
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
