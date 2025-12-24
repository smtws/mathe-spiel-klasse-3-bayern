export class ParrotAnimation {
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

    const parrotCount = Math.min(counts.groups || 3, 5);
    const feathersPerParrot = Math.min(counts.itemsPerGroup || 3, 4);
    const pos = position || 'both';

    // Panel-Bereich meiden
    const panelHalfWidth = 330;
    const leftAreaX = width / 2 - panelHalfWidth - 70;
    const rightAreaX = width / 2 + panelHalfWidth + 70;
    const centerY = height / 2;

    console.log(`Erstelle ${parrotCount} Papageien (Position: ${pos})`);

    for (let i = 0; i < parrotCount; i++) {
      let x, y;

      if (pos === 'left') {
        x = leftAreaX + Phaser.Math.Between(-30, 30);
        y = centerY - 80 + (i * 60) + Phaser.Math.Between(-15, 15);
      } else if (pos === 'right') {
        x = rightAreaX + Phaser.Math.Between(-30, 30);
        y = centerY - 80 + (i * 60) + Phaser.Math.Between(-15, 15);
      } else {
        const isLeft = i % 2 === 0;
        x = isLeft ? leftAreaX + Phaser.Math.Between(-20, 40) : rightAreaX + Phaser.Math.Between(-40, 20);
        y = centerY - 60 + Math.floor(i / 2) * 80 + Phaser.Math.Between(-10, 10);
      }

      const parrot = this.createParrotWithFeathers(x, y, feathersPerParrot, i);
      this.elements.push(parrot.container);
    }
  }

  createParrotWithFeathers(x, y, featherCount, index) {
    const container = this.scene.add.container(x, y);
    container.setDepth(2);

    // Papagei (zufällige Farbe) - größer
    const colors = ['anim_parrot_red', 'anim_parrot_blue', 'anim_parrot_green'];
    const parrot = this.scene.add.image(0, 0, colors[index % colors.length]);
    parrot.setScale(1.5);
    container.add(parrot);

    // Federn um den Papagei
    const feathers = [];
    for (let i = 0; i < featherCount; i++) {
      const featherX = 25 + i * 8;
      const featherY = 15 + i * 3;

      // Einfache Feder als Ellipse
      const feather = this.scene.add.ellipse(featherX, featherY, 6, 15, 0xFFD700);
      feather.setAngle(20 + i * 10);
      container.add(feather);
      feathers.push(feather);
    }

    container.parrot = parrot;
    container.feathers = feathers;
    container.parrotIndex = index;

    return { container, parrot, feathers };
  }

  startIdle() {
    this.elements.forEach((container, index) => {
      // Kopf-Wippen
      this.tweens.push(
        this.scene.tweens.add({
          targets: container,
          y: container.y - 4,
          duration: 500 + index * 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      );

      // Gelegentliches Flügel-Flattern
      this.scene.time.addEvent({
        delay: 2000 + index * 500,
        callback: () => this.flutterWings(container),
        loop: true
      });

      // Federn wehen
      if (container.feathers) {
        container.feathers.forEach((feather, i) => {
          const baseAngle = feather.angle;
          this.tweens.push(
            this.scene.tweens.add({
              targets: feather,
              angle: baseAngle + 10,
              duration: 600 + i * 100,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            })
          );
        });
      }
    });
  }

  flutterWings(container) {
    if (!container || !container.parrot) return;

    this.scene.tweens.add({
      targets: container.parrot,
      scaleX: 1.1,
      duration: 100,
      yoyo: true,
      repeat: 2
    });
  }

  celebrate() {
    this.elements.forEach((container, index) => {
      // Hoch fliegen
      this.scene.tweens.add({
        targets: container,
        y: container.y - 50,
        duration: 300,
        delay: index * 80,
        yoyo: true,
        ease: 'Quad.easeOut'
      });

      // Schnelles Flattern
      this.scene.tweens.add({
        targets: container.parrot,
        scaleX: 1.2,
        duration: 50,
        delay: index * 80,
        yoyo: true,
        repeat: 5
      });

      // Federn aufstellen
      if (container.feathers) {
        container.feathers.forEach((feather, i) => {
          this.scene.tweens.add({
            targets: feather,
            angle: feather.angle + 30,
            scale: 1.3,
            duration: 200,
            delay: index * 80 + i * 30,
            yoyo: true
          });
        });
      }
    });
  }

  react(type) {
    if (type === 'wrong') {
      this.elements.forEach((container, index) => {
        // Kopf schütteln
        this.scene.tweens.add({
          targets: container,
          angle: -5,
          duration: 150,
          delay: index * 50,
          yoyo: true,
          repeat: 2
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
