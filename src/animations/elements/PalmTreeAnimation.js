export class PalmTreeAnimation {
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

    const palmCount = Math.min(counts.groups || 3, 4);
    const coconutsPerPalm = Math.min(counts.itemsPerGroup || 3, 5);
    const pos = position || 'both';

    // Panel-Bereich meiden
    const panelHalfWidth = 330;
    const leftAreaX = width / 2 - panelHalfWidth - 60;
    const rightAreaX = width / 2 + panelHalfWidth + 60;
    const baseY = height / 2 + 80;

    console.log(`Erstelle ${palmCount} Palmen (Position: ${pos})`);

    for (let i = 0; i < palmCount; i++) {
      let x, y;

      if (pos === 'left') {
        x = leftAreaX + Phaser.Math.Between(-40, 20);
        y = baseY - 50 + (i * 80);
      } else if (pos === 'right') {
        x = rightAreaX + Phaser.Math.Between(-20, 40);
        y = baseY - 50 + (i * 80);
      } else {
        const isLeft = i % 2 === 0;
        x = isLeft ? leftAreaX + Phaser.Math.Between(-30, 30) : rightAreaX + Phaser.Math.Between(-30, 30);
        y = baseY - 30 + Math.floor(i / 2) * 100;
      }

      const palm = this.createPalmTree(x, y, coconutsPerPalm, i);
      this.elements.push(palm.container);
    }
  }

  createPalmTree(x, y, coconutCount, index) {
    const container = this.scene.add.container(x, y);
    container.setDepth(2); // Über Hintergrund

    // Stamm - größer
    const trunk = this.scene.add.image(0, 30, 'anim_palm_trunk');
    trunk.setScale(1.2);
    trunk.setOrigin(0.5, 1);
    container.add(trunk);

    // Wedel (mehrere, versetzt) - größer
    const fronds = [];
    const frondAngles = [-45, -22, 0, 22, 45];

    frondAngles.forEach((angle, i) => {
      const frond = this.scene.add.image(0, -70, 'anim_palm_frond');
      frond.setScale(1.1);
      frond.setOrigin(0, 0.5);
      frond.setAngle(angle);
      container.add(frond);
      fronds.push(frond);
    });

    // Kokosnüsse unter den Wedeln - größer
    const coconuts = [];
    for (let i = 0; i < coconutCount; i++) {
      const coconutAngle = -40 + (i / Math.max(coconutCount - 1, 1)) * 80;
      const coconutX = Math.cos(Phaser.Math.DegToRad(coconutAngle - 90)) * 30;
      const coconutY = -55 + Math.sin(Phaser.Math.DegToRad(coconutAngle - 90)) * 15;

      const coconut = this.scene.add.image(coconutX, coconutY, 'anim_coconut');
      coconut.setScale(1.2);
      container.add(coconut);
      coconuts.push(coconut);
    }

    container.trunk = trunk;
    container.fronds = fronds;
    container.coconuts = coconuts;
    container.palmIndex = index;

    return { container, trunk, fronds, coconuts };
  }

  startIdle() {
    this.elements.forEach((container, index) => {
      // Wedel im Wind wehen
      if (container.fronds) {
        container.fronds.forEach((frond, frondIndex) => {
          const baseAngle = frond.angle;
          this.tweens.push(
            this.scene.tweens.add({
              targets: frond,
              angle: baseAngle + Phaser.Math.Between(3, 8),
              duration: 1500 + frondIndex * 200 + index * 100,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            })
          );
        });
      }

      // Kokosnüsse leicht wackeln
      if (container.coconuts) {
        container.coconuts.forEach((coconut, coconutIndex) => {
          this.tweens.push(
            this.scene.tweens.add({
              targets: coconut,
              y: coconut.y + 2,
              angle: { from: -3, to: 3 },
              duration: 800 + coconutIndex * 100,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            })
          );
        });
      }

      // Stamm leicht schwingen
      this.tweens.push(
        this.scene.tweens.add({
          targets: container,
          x: container.x + 3,
          duration: 2000 + index * 200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      );
    });
  }

  celebrate() {
    this.elements.forEach((container, index) => {
      // Starkes Schütteln
      this.scene.tweens.add({
        targets: container,
        x: container.x - 10,
        duration: 100,
        delay: index * 100,
        yoyo: true,
        repeat: 3
      });

      // Kokosnüsse springen
      if (container.coconuts) {
        container.coconuts.forEach((coconut, coconutIndex) => {
          this.scene.tweens.add({
            targets: coconut,
            y: coconut.y - 15,
            duration: 200,
            delay: index * 100 + coconutIndex * 50,
            yoyo: true,
            ease: 'Quad.easeOut'
          });
        });
      }

      // Wedel stark wehen
      if (container.fronds) {
        container.fronds.forEach(frond => {
          const baseAngle = frond.angle;
          this.scene.tweens.add({
            targets: frond,
            angle: baseAngle + 15,
            duration: 200,
            delay: index * 100,
            yoyo: true,
            repeat: 2
          });
        });
      }
    });
  }

  react(type) {
    if (type === 'wrong') {
      // Trauriges Schwingen
      this.elements.forEach((container, index) => {
        this.scene.tweens.add({
          targets: container,
          angle: -3,
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
