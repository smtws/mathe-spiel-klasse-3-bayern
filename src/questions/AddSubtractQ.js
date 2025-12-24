export class AddSubtractQ {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
    this.ranges = this.getRanges();
  }

  getRanges() {
    // 3. Klasse Bayern: Zahlenraum bis 1000
    // 4. Klasse (hard): Zahlenraum bis 10.000
    switch (this.difficulty) {
      case 'easy':
        return { min: 1, max: 100, maxResult: 200 };
      case 'normal':
        return { min: 10, max: 500, maxResult: 1000 };
      case 'hard':
        // Nur für 4. Klasse Bonus-Level (Ranger-Station)
        return { min: 100, max: 5000, maxResult: 10000 };
      default:
        return { min: 10, max: 500, maxResult: 1000 };
    }
  }

  generate() {
    // Zufällig Addition oder Subtraktion
    const isAddition = Math.random() > 0.5;

    if (isAddition) {
      return this.generateAddition();
    } else {
      return this.generateSubtraction();
    }
  }

  generateAddition() {
    const { min, max, maxResult } = this.ranges;

    let a, b, result;
    do {
      a = this.randomInt(min, max);
      b = this.randomInt(min, max);
      result = a + b;
    } while (result > maxResult);

    const contexts = this.getAdditionContexts(a, b);
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongAnswers(result, a, b, '+');
    const options = this.shuffleArray([result, ...wrongAnswers]);

    return {
      id: `add_${a}_${b}`,
      type: 'addition',
      question: `${a} + ${b} = ?`,
      contextQuestion: context.question,
      correctAnswer: result,
      options: options,
      hint: this.getAdditionHint(a, b),
      difficulty: this.difficulty,
      visualData: {
        first: a,
        second: b,
        icon: context.icon
      }
    };
  }

  generateSubtraction() {
    const { min, max } = this.ranges;

    // Größere Zahl zuerst, damit kein negatives Ergebnis
    let a = this.randomInt(min * 2, max);
    let b = this.randomInt(min, a - 1);
    const result = a - b;

    const contexts = this.getSubtractionContexts(a, b);
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongAnswers(result, a, b, '-');
    const options = this.shuffleArray([result, ...wrongAnswers]);

    return {
      id: `sub_${a}_${b}`,
      type: 'subtraction',
      question: `${a} - ${b} = ?`,
      contextQuestion: context.question,
      correctAnswer: result,
      options: options,
      hint: this.getSubtractionHint(a, b),
      difficulty: this.difficulty,
      visualData: {
        start: a,
        remove: b,
        icon: context.icon
      }
    };
  }

  getAdditionContexts(a, b) {
    return [
      {
        question: `Du hast ${a} Goldmünzen gefunden und dann noch ${b} dazu. Wie viele hast du jetzt?`,
        icon: 'coin'
      },
      {
        question: `Im Rucksack sind ${a} Nüsse. Du sammelst noch ${b}. Wie viele sind es dann?`,
        icon: 'nut'
      },
      {
        question: `${a} Schmetterlinge flattern. ${b} kommen dazu. Wie viele sind es jetzt?`,
        icon: 'butterfly'
      },
      {
        question: `Der Dschungelfluss ist ${a} Meter lang. Ein Nebenfluss fügt ${b} Meter hinzu. Wie lang ist der Gesamtweg?`,
        icon: 'river'
      }
    ];
  }

  getSubtractionContexts(a, b) {
    return [
      {
        question: `Du hattest ${a} Goldmünzen, hast aber ${b} für Ausrüstung ausgegeben. Wie viele bleiben?`,
        icon: 'coin'
      },
      {
        question: `Von ${a} Bananen hat der Affe ${b} gegessen. Wie viele sind noch da?`,
        icon: 'banana'
      },
      {
        question: `Der Tempel war ${a} Schritte entfernt. Du bist ${b} Schritte gegangen. Wie weit noch?`,
        icon: 'temple'
      },
      {
        question: `Es waren ${a} Papageien im Baum. ${b} sind weggeflogen. Wie viele sitzen noch da?`,
        icon: 'parrot'
      }
    ];
  }

  getAdditionHint(a, b) {
    // Runde auf Zehner
    const aRound = Math.round(a / 10) * 10;
    const bRound = Math.round(b / 10) * 10;

    if (b < 10) {
      return `Tipp: Zähle einfach ${b} weiter ab ${a}`;
    } else if (a % 10 === 0 || b % 10 === 0) {
      return `Tipp: Eine Zahl ist ein Zehner - das macht es leichter!`;
    } else {
      return `Tipp: Runde erst auf ${aRound} + ${bRound} ≈ ${aRound + bRound}`;
    }
  }

  getSubtractionHint(a, b) {
    if (b < 10) {
      return `Tipp: Zähle ${b} zurück von ${a}`;
    } else if (b % 10 === 0) {
      return `Tipp: Du ziehst einen Zehner ab - das ist einfach!`;
    } else {
      return `Tipp: Ziehe erst die Zehner ab, dann die Einer`;
    }
  }

  generateWrongAnswers(correct, a, b, operation) {
    const wrong = new Set();

    // Typische Fehler:
    // 1. Um 1, 10, 100 daneben
    wrong.add(correct + 1);
    wrong.add(correct - 1);
    wrong.add(correct + 10);
    wrong.add(correct - 10);

    // 2. Stellenwert-Fehler
    if (correct >= 100) {
      wrong.add(correct + 100);
      wrong.add(correct - 100);
    }

    // 3. Verwechslung Addition/Subtraktion
    if (operation === '+') {
      wrong.add(Math.abs(a - b));
    } else {
      wrong.add(a + b);
    }

    // 4. Ziffern-Übertrag vergessen
    wrong.add(correct + 10);
    wrong.add(correct - 10);

    // Filtere
    wrong.delete(correct);
    const filtered = [...wrong].filter(n => n > 0 && n !== correct);

    return this.shuffleArray(filtered).slice(0, 3);
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
