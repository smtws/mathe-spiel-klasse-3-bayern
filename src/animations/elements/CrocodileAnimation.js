export class CrocodileAnimation {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.elements = [];
    this.tweens = [];

    this.create();
  }

  create() {
    const { width, height } = this.scene.scale;
    const { counts, position } = this.config;

    const crocodileCount = Math.min(counts.groups || 2, 3);
    const teethPerCroc = Math.min(counts.itemsPerGroup || 6, 8);
    const pos = position || 'both';

    // Panel-Bereich meiden
    const panelHalfWidth = 330;
    const leftAreaX = width / 2 - panelHalfWidth - 100;
    const rightAreaX = width / 2 + panelHalfWidth + 100;
    const baseY = height / 2 + 60;

    console.log(`Erstelle ${crocodileCount} Krokodile (Position: ${pos})`);

    for (let i = 0; i < crocodileCount; i++) {
      let x, y;

      if (pos === 'left') {
        x = leftAreaX + Phaser.Math.Between(-30, 30);
        y = baseY - 40 + (i * 70);
      } else if (pos === 'right') {
        x = rightAreaX + Phaser.Math.Between(-30, 30);
        y = baseY - 40 + (i * 70);
      } else {
        const isLeft = i % 2 === 0;
        x = isLeft ? leftAreaX + Phaser.Math.Between(-20, 30) : rightAreaX + Phaser.Math.Between(-30, 20);
        y = baseY - 20 + Math.floor(i / 2) * 80;
      }

      const croc = this.createCrocodileWithTeeth(x, y, teethPerCroc, i);
      this.elements.push(croc.container);
    }

    // Wasser-Effekt
    this.createWaterEffect(baseY + 40);
  }

  createCrocodileWithTeeth(x, y, teethCount, index) {
    const container = this.scene.add.container(x, y);
    container.setDepth(2);

    // Krokodil - größer
    const croc = this.scene.add.image(0, 0, 'anim_crocodile');
    croc.setScale(1.4);
    container.add(croc);

    // Zähne im offenen Maul
    const teeth = [];
    for (let i = 0; i < teethCount; i++) {
      const toothX = -35 + i * 6;
      const toothY = i % 2 === 0 ? -8 : 10;

      const tooth = this.scene.add.image(toothX, toothY, 'anim_tooth');
      tooth.setScale(0.5);
      tooth.setAngle(i % 2 === 0 ? 180 : 0);
      container.add(tooth);
      teeth.push(tooth);
    }

    container.croc = croc;
    container.teeth = teeth;
    container.crocIndex = index;

    return { container, croc, teeth };
  }

  createWaterEffect(y) {
    const { width } = this.scene.scale;

    // Wasser-Wellen (einfache blaue Rechtecke)
    for (let i = 0; i < 5; i++) {
      const wave = this.scene.add.ellipse(
        width / 2 - 200 + i * 100,
        y,
        80, 15,
        0x4a90d9, 0.3
      );
      wave.setDepth(0);
      this.elements.push(wave);

      // Wellen-Animation
      this.tweens.push(
        this.scene.tweens.add({
          targets: wave,
          x: wave.x + 20,
          scaleX: 1.2,
          duration: 1500 + i * 200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      );
    }
  }

  startIdle() {
    this.elements.forEach((container, index) => {
      if (!container.croc) return; // Skip water elements

      // Im Wasser schwimmen (auf/ab)
      this.tweens.push(
        this.scene.tweens.add({
          targets: container,
          y: container.y - 5,
          duration: 1200 + index * 200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      );

      // Schwanz wedeln (leichte Rotation)
      this.tweens.push(
        this.scene.tweens.add({
          targets: container,
          angle: { from: -2, to: 2 },
          duration: 800 + index * 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      );

      // Gelegentliches Maul öffnen/schließen
      this.scene.time.addEvent({
        delay: 3000 + index * 1000,
        callback: () => this.snapJaws(container),
        loop: true
      });
    });
  }

  snapJaws(container) {
    if (!container || !container.teeth) return;

    // Zähne bewegen (Maul auf/zu)
    container.teeth.forEach((tooth, i) => {
      const targetY = i % 2 === 0 ? -12 : 14;
      this.scene.tweens.add({
        targets: tooth,
        y: targetY,
        duration: 150,
        yoyo: true,
        delay: i * 20
      });
    });
  }

  celebrate() {
    this.elements.forEach((container, index) => {
      if (!container.croc) return;

      // Aus dem Wasser springen
      this.scene.tweens.add({
        targets: container,
        y: container.y - 40,
        duration: 300,
        delay: index * 100,
        yoyo: true,
        ease: 'Quad.easeOut'
      });

      // Maul weit öffnen
      if (container.teeth) {
        container.teeth.forEach((tooth, i) => {
          const targetY = i % 2 === 0 ? -15 : 18;
          this.scene.tweens.add({
            targets: tooth,
            y: targetY,
            duration: 200,
            delay: index * 100,
            yoyo: true,
            hold: 300
          });
        });
      }
    });
  }

  react(type) {
    if (type === 'wrong') {
      this.elements.forEach((container, index) => {
        if (!container.croc) return;

        // Abtauchen
        this.scene.tweens.add({
          targets: container,
          y: container.y + 20,
          alpha: 0.5,
          duration: 300,
          delay: index * 50,
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
