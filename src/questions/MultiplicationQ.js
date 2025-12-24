export class MultiplicationQ {
  /**
   * @param {string} difficulty - 'easy', 'normal', 'hard'
   * @param {object} options - { tableRange: '1-5' | '6-10' | 'all' }
   */
  constructor(difficulty = 'normal', options = {}) {
    this.difficulty = difficulty;
    this.tableRange = options.tableRange || 'all';
    this.range = this.getRange();
  }

  getRange() {
    // Spezifische Reihen haben Vorrang
    if (this.tableRange === '1-5') {
      return { minA: 1, maxA: 5, minB: 1, maxB: 10 };
    } else if (this.tableRange === '6-10') {
      return { minA: 6, maxA: 10, minB: 1, maxB: 10 };
    }

    // Fallback auf difficulty-basierte Logik
    switch (this.difficulty) {
      case 'easy':
        return { minA: 1, maxA: 5, minB: 1, maxB: 5 };
      case 'normal':
        return { minA: 1, maxA: 10, minB: 1, maxB: 10 };
      case 'hard':
        return { minA: 1, maxA: 12, minB: 1, maxB: 12 };
      default:
        return { minA: 1, maxA: 10, minB: 1, maxB: 10 };
    }
  }

  generate() {
    const { minA, maxA, minB, maxB } = this.range;
    const a = this.randomInt(minA, maxA);
    const b = this.randomInt(minB, maxB);
    const correct = a * b;

    // Erstelle Kontext für das Dschungel-Setting
    const contexts = this.getContexts(a, b);
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    // Generiere plausible falsche Antworten
    const wrongAnswers = this.generateWrongAnswers(correct, a, b);

    // Mische alle Antworten
    const options = this.shuffleArray([correct, ...wrongAnswers]);

    return {
      id: `mult_${a}_${b}`,
      type: 'multiplication',
      question: `${a} × ${b} = ?`,
      contextQuestion: context.question,
      correctAnswer: correct,
      options: options,
      hint: this.getHint(a, b),
      visualData: {
        rows: a,
        cols: b,
        icon: context.icon
      },
      difficulty: this.difficulty
    };
  }

  getContexts(a, b) {
    return [
      {
        question: `${a} Affen haben je ${b} Bananen gesammelt. Wie viele Bananen sind das insgesamt?`,
        icon: 'banana'
      },
      {
        question: `Im Dschungel gibt es ${a} Bäume mit je ${b} Kokosnüssen. Wie viele Kokosnüsse sind das?`,
        icon: 'coconut'
      },
      {
        question: `${a} Papageien tragen je ${b} Federn am Schwanz. Wie viele Federn sind das zusammen?`,
        icon: 'feather'
      },
      {
        question: `Du sammelst ${a} Tage lang je ${b} Goldmünzen. Wie viele Münzen hast du dann?`,
        icon: 'coin'
      },
      {
        question: `${a} Krokodile haben je ${b} Zähne. Wie viele Zähne sind das insgesamt?`,
        icon: 'tooth'
      }
    ];
  }

  getHint(a, b) {
    if (a <= 5 && b <= 5) {
      return `Tipp: Zähle ${a} mal die Zahl ${b}`;
    } else if (a === 10 || b === 10) {
      return `Tipp: Bei mal 10 hängst du einfach eine 0 an!`;
    } else if (a === b) {
      return `Tipp: ${a} × ${a} ist eine Quadratzahl`;
    } else {
      return `Tipp: Du kannst ${a} × ${b} auch als ${b} × ${a} rechnen`;
    }
  }

  generateWrongAnswers(correct, a, b) {
    const wrong = new Set();

    // Typische Fehler:
    // 1. Um 1 daneben
    wrong.add(correct + 1);
    wrong.add(correct - 1);

    // 2. Nachbar-Ergebnis (falsches Einmaleins)
    if (b > 1) wrong.add(a * (b - 1));
    if (b < 10) wrong.add(a * (b + 1));
    if (a > 1) wrong.add((a - 1) * b);
    if (a < 10) wrong.add((a + 1) * b);

    // 3. Addition statt Multiplikation
    wrong.add(a + b);

    // 4. Ziffern vertauscht (bei zweistelligen Ergebnissen)
    if (correct >= 10 && correct < 100) {
      const swapped = parseInt(correct.toString().split('').reverse().join(''));
      if (swapped !== correct) wrong.add(swapped);
    }

    // Entferne die richtige Antwort und ungültige Werte
    wrong.delete(correct);
    const filtered = [...wrong].filter(n => n > 0 && n !== correct);

    // Wähle 3 falsche Antworten
    const shuffled = this.shuffleArray(filtered);
    return shuffled.slice(0, 3);
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
