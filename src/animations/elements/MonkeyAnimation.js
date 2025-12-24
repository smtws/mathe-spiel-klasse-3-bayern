export class MonkeyAnimation {
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

    // Anzahl der Affen und Items
    const monkeyCount = Math.min(counts.groups || 3, 5);
    const itemsPerMonkey = Math.min(counts.itemsPerGroup || 3, 4);

    // Position basierend auf config.position: 'left', 'right', 'both'
    const pos = position || 'both';

    // Panel ist ca. 660x520 in der Mitte - Animationen sollen seitlich davon sein
    const panelHalfWidth = 330;
    const leftAreaX = width / 2 - panelHalfWidth - 80; // Links vom Panel
    const rightAreaX = width / 2 + panelHalfWidth + 80; // Rechts vom Panel
    const centerY = height / 2 + 40;

    console.log(`Erstelle ${monkeyCount} Affen (Position: ${pos})`);

    for (let i = 0; i < monkeyCount; i++) {
      let x, y;

      if (pos === 'left') {
        // Alle links, vertikal verteilt
        x = leftAreaX + Phaser.Math.Between(-30, 30);
        y = centerY - 100 + (i / Math.max(monkeyCount - 1, 1)) * 200;
      } else if (pos === 'right') {
        // Alle rechts, vertikal verteilt
        x = rightAreaX + Phaser.Math.Between(-30, 30);
        y = centerY - 100 + (i / Math.max(monkeyCount - 1, 1)) * 200;
      } else {
        // Beide Seiten - abwechselnd links/rechts
        const isLeft = i % 2 === 0;
        x = isLeft ? leftAreaX + Phaser.Math.Between(-20, 40) : rightAreaX + Phaser.Math.Between(-40, 20);
        y = centerY - 80 + Math.floor(i / 2) * 100 + Phaser.Math.Between(-20, 20);
      }

      const monkey = this.createMonkeyWithItems(x, y, itemsPerMonkey, i);
      this.elements.push(monkey.container);
    }
  }

  createMonkeyWithItems(x, y, itemCount, index) {
    const container = this.scene.add.container(x, y);
    container.setDepth(2); // Über Hintergrund, aber unter Panel

    // Affen-Sprite - größer für bessere Sichtbarkeit
    const monkey = this.scene.add.image(0, 0, 'anim_monkey');
    monkey.setScale(1.4);
    container.add(monkey);

    // Items (Bananen) um den Affen herum - größer
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      const itemAngle = -Math.PI / 3 + (i / Math.max(itemCount - 1, 1)) * (Math.PI / 1.5);
      const itemRadius = 50;
      const itemX = Math.cos(itemAngle) * itemRadius;
      const itemY = Math.sin(itemAngle) * itemRadius - 15;

      const item = this.scene.add.image(itemX, itemY, 'anim_banana');
      item.setScale(0.9);
      container.add(item);
      items.push(item);
    }

    // Speichere für Animationen
    container.monkey = monkey;
    container.items = items;
    container.monkeyIndex = index;

    return { container, monkey, items };
  }

  startIdle() {
    this.elements.forEach((container, index) => {
      // Atem-Animation (Körper auf/ab)
      this.tweens.push(
        this.scene.tweens.add({
          targets: container,
          y: container.y - 3,
          duration: 800 + index * 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      );

      // Gelegentliches Kopfkratzen
      this.scene.time.delayedCall(2000 + index * 1500, () => {
        this.scratchHead(container);
      });

      // Bananen-Schwingen
      if (container.items) {
        container.items.forEach((item, itemIndex) => {
          this.tweens.push(
            this.scene.tweens.add({
              targets: item,
              angle: { from: -5, to: 5 },
              duration: 600 + itemIndex * 50,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            })
          );
        });
      }
    });
  }

  scratchHead(container) {
    if (!container || !container.monkey) return;

    // Kleine Rotation als "Kratzen"
    this.scene.tweens.add({
      targets: container,
      angle: { from: 0, to: 5 },
      duration: 150,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        // Nächstes Kratzen planen
        this.scene.time.delayedCall(Phaser.Math.Between(3000, 6000), () => {
          this.scratchHead(container);
        });
      }
    });
  }

  celebrate() {
    this.elements.forEach((container, index) => {
      // Sprung-Animation
      this.scene.tweens.add({
        targets: container,
        y: container.y - 40,
        duration: 200,
        delay: index * 50,
        yoyo: true,
        ease: 'Quad.easeOut'
      });

      // Arme hoch (Scale-Effekt)
      this.scene.tweens.add({
        targets: container,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        delay: index * 50,
        yoyo: true
      });

      // Items werfen
      if (container.items) {
        container.items.forEach((item, itemIndex) => {
          this.scene.tweens.add({
            targets: item,
            y: item.y - 20,
            angle: 360,
            duration: 400,
            delay: index * 50 + itemIndex * 30,
            yoyo: true,
            ease: 'Quad.easeOut'
          });
        });
      }
    });
  }

  react(type) {
    if (type === 'wrong') {
      // Traurige Reaktion - Kopf schütteln
      this.elements.forEach((container, index) => {
        this.scene.tweens.add({
          targets: container,
          x: container.x - 5,
          duration: 100,
          delay: index * 30,
          yoyo: true,
          repeat: 2
        });
      });
    }
  }

  destroy() {
    // Alle Tweens stoppen
    this.tweens.forEach(tween => {
      if (tween && tween.stop) tween.stop();
    });
    this.tweens = [];

    // Alle Elemente zerstören
    this.elements.forEach(element => {
      if (element && element.destroy) element.destroy();
    });
    this.elements = [];
  }
}
