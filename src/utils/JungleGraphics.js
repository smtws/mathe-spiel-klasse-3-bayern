import Phaser from 'phaser';
import { COLORS, CUPHEAD_OUTLINE } from '../config.js';

/**
 * Gemeinsame Dschungel-Grafik-Utilities für MenuScene und WorldMapScene
 */
export class JungleGraphics {
  /**
   * Zeichnet eine Palme
   */
  static drawPalmTree(g, x, groundY, scale = 1) {
    const trunkHeight = 100 * scale;
    const trunkWidth = 14 * scale;

    // Stamm
    g.fillStyle(0x8B4513, 1);
    g.beginPath();
    g.moveTo(x - trunkWidth / 2, groundY);
    g.lineTo(x - trunkWidth / 3, groundY - trunkHeight * 0.5);
    g.lineTo(x - trunkWidth / 4, groundY - trunkHeight);
    g.lineTo(x + trunkWidth / 4, groundY - trunkHeight);
    g.lineTo(x + trunkWidth / 3, groundY - trunkHeight * 0.5);
    g.lineTo(x + trunkWidth / 2, groundY);
    g.closePath();
    g.fillPath();

    // Stamm-Ringe
    g.lineStyle(2, 0x5D4037, 0.5);
    for (let i = 1; i < 6; i++) {
      const ringY = groundY - (trunkHeight * i / 6);
      g.beginPath();
      g.moveTo(x - trunkWidth / 2 + 2, ringY);
      g.lineTo(x + trunkWidth / 2 - 2, ringY);
      g.strokePath();
    }

    // Palmwedel (mit Linien statt Bezier)
    const topY = groundY - trunkHeight;
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
      const frondLength = (50 + Math.random() * 25) * scale;

      // Wedel als gebogene Linie mit mehreren Segmenten
      g.lineStyle(5 * scale, 0x228B22, 1);
      g.beginPath();
      g.moveTo(x, topY);
      for (let seg = 1; seg <= 4; seg++) {
        const t = seg / 4;
        const curve = Math.sin(t * Math.PI) * 15 * scale;
        const segX = x + Math.cos(angle) * frondLength * t;
        const segY = topY + Math.sin(angle) * frondLength * t * 0.5 - curve;
        g.lineTo(segX, segY);
      }
      g.strokePath();

      // Hellere Linie darüber
      g.lineStyle(2 * scale, 0x32CD32, 0.8);
      g.beginPath();
      g.moveTo(x, topY - 2);
      for (let seg = 1; seg <= 4; seg++) {
        const t = seg / 4;
        const curve = Math.sin(t * Math.PI) * 18 * scale;
        const segX = x + Math.cos(angle) * frondLength * t;
        const segY = topY + Math.sin(angle) * frondLength * t * 0.5 - curve - 2;
        g.lineTo(segX, segY);
      }
      g.strokePath();
    }

    // Kokosnüsse
    g.fillStyle(0x8B4513, 1);
    g.fillCircle(x - 6 * scale, topY + 6 * scale, 6 * scale);
    g.fillCircle(x + 6 * scale, topY + 4 * scale, 6 * scale);
  }

  /**
   * Zeichnet einen Dschungelbaum
   */
  static drawJungleTree(g, x, groundY, scale = 1) {
    const trunkHeight = 70 * scale;
    const trunkWidth = 18 * scale;

    // Stamm
    g.fillStyle(0x5D4037, 1);
    g.fillRect(x - trunkWidth / 2, groundY - trunkHeight, trunkWidth, trunkHeight);

    // Wurzeln
    g.fillStyle(0x4E342E, 1);
    g.fillTriangle(x - trunkWidth, groundY, x - trunkWidth / 2, groundY - 18 * scale, x - trunkWidth / 2, groundY);
    g.fillTriangle(x + trunkWidth, groundY, x + trunkWidth / 2, groundY - 18 * scale, x + trunkWidth / 2, groundY);

    // Blätterkrone
    const crownY = groundY - trunkHeight;
    const layers = [
      { size: 55 * scale, color: 0x1B5E20 },
      { size: 42 * scale, color: 0x2E7D32 },
      { size: 30 * scale, color: 0x388E3C }
    ];

    layers.forEach((layer, i) => {
      g.fillStyle(layer.color, 1);
      g.fillEllipse(x, crownY - i * 10 * scale, layer.size, layer.size * 0.65);
      g.fillEllipse(x - layer.size * 0.45, crownY - i * 6 * scale, layer.size * 0.55, layer.size * 0.45);
      g.fillEllipse(x + layer.size * 0.45, crownY - i * 6 * scale, layer.size * 0.55, layer.size * 0.45);
    });
  }

  /**
   * Zeichnet Büsche
   */
  static drawBushes(g, width, height, count = 15, excludeRiverY = null) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(200, height - 180);
      const size = Phaser.Math.Between(25, 45);

      // Überspringen wenn im Flussbereich
      if (excludeRiverY !== null && y > excludeRiverY - 50 && y < excludeRiverY + 70) {
        continue;
      }

      g.fillStyle(0x2e7d32, 0.7);
      g.fillEllipse(x, y, size * 1.2, size * 0.6);
      g.fillEllipse(x - size * 0.3, y - size * 0.15, size * 0.7, size * 0.4);
      g.fillStyle(0x4caf50, 0.4);
      g.fillEllipse(x, y - size * 0.15, size * 0.5, size * 0.25);
    }
  }

  /**
   * Zeichnet Lianen
   */
  static drawVines(g, vines) {
    vines.forEach(vine => {
      g.lineStyle(4, 0x2E7D32, 0.9);
      g.beginPath();
      g.moveTo(vine.x, 0);
      for (let i = 1; i <= 5; i++) {
        g.lineTo(vine.x + Math.sin(i * 1.5) * 18, (vine.length / 5) * i);
      }
      g.strokePath();

      // Blätter
      g.fillStyle(0x4CAF50, 0.9);
      for (let i = 1; i < 5; i++) {
        const leafY = (vine.length / 5) * i;
        const leafX = vine.x + Math.sin(i * 1.5) * 18;
        g.fillEllipse(leafX + 12, leafY, 14, 7);
        g.fillEllipse(leafX - 10, leafY + 12, 11, 6);
      }
    });
  }

  /**
   * Zeichnet einen Holzrahmen
   */
  static drawWoodenBorder(g, width, height) {
    const OUTLINE = CUPHEAD_OUTLINE || 3;

    // Holzrahmen
    g.fillStyle(0x5D4037, 1);
    g.fillRect(0, 0, width, 10);
    g.fillRect(0, height - 10, width, 10);
    g.fillRect(0, 0, 10, height);
    g.fillRect(width - 10, 0, 10, height);

    g.fillStyle(0x795548, 0.6);
    g.fillRect(2, 2, width - 4, 6);
    g.fillRect(2, height - 8, width - 4, 6);
    g.fillRect(2, 2, 6, height - 4);
    g.fillRect(width - 8, 2, 6, height - 4);

    // Goldene Ecken
    const corners = [[12, 12], [width - 12, 12], [12, height - 12], [width - 12, height - 12]];
    corners.forEach(([cx, cy]) => {
      g.fillStyle(0x8B4513, 1);
      g.fillCircle(cx, cy, 14);
      g.fillStyle(0xFFD700, 1);
      g.fillCircle(cx, cy, 9);
      g.fillStyle(0xFFFFFF, 0.3);
      g.fillCircle(cx - 2, cy - 2, 3);
    });
  }

  /**
   * Zeichnet Dschungel-Hügel im Hintergrund
   */
  static drawHills(g, width) {
    // Hügel-Reihe hinten
    g.fillStyle(0x1B5E20, 0.6);
    for (let i = 0; i < 6; i++) {
      const x = i * (width / 5) + Phaser.Math.Between(-30, 30);
      const size = 100 + Phaser.Math.Between(0, 50);
      g.fillEllipse(x, 180, size, size * 0.6);
    }
  }

  /**
   * Zeichnet den Dschungelboden (Basis)
   */
  static drawJungleGround(g, width, height) {
    // Basis Dschungelgrün
    g.fillStyle(0x2d5a3d, 1);
    g.fillRect(0, 0, width, height);

    // Hellerer Bereich oben (Licht durch Blätterdach)
    g.fillStyle(0x87CEEB, 0.2);
    g.fillRect(0, 0, width, 80);

    // Erdiger Boden unten
    g.fillStyle(0x5d4037, 1);
    g.fillRect(0, height - 120, width, 120);
    g.fillStyle(0x795548, 0.6);
    g.fillRect(0, height - 120, width, 30);

    // Gras am Bodenrand
    g.fillStyle(0x2E7D32, 1);
    for (let x = 0; x < width; x += 25) {
      g.fillTriangle(x, height - 120, x + 12, height - 145, x + 25, height - 120);
    }
  }

  /**
   * Hilfsfunktion: Berechne Punkt auf kubischer Bezier-Kurve
   */
  static bezierPoint(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
  }

  /**
   * Zeichnet Bezier-Kurve als Segmente
   */
  static drawBezierSegments(g, startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, segments = 8) {
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = this.bezierPoint(t, startX, cp1x, cp2x, endX);
      const y = this.bezierPoint(t, startY, cp1y, cp2y, endY);
      g.lineTo(x, y);
    }
  }
}
