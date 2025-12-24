export class DivisionQ {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
    this.maxDivisor = this.getMaxDivisor();
  }

  getMaxDivisor() {
    switch (this.difficulty) {
      case 'easy': return 5;
      case 'normal': return 10;
      case 'hard': return 12;
      default: return 10;
    }
  }

  generate() {
    // Wir generieren Division die aufgeht (kein Rest)
    const divisor = this.randomInt(2, this.maxDivisor);
    const result = this.randomInt(1, this.maxDivisor);
    const dividend = divisor * result; // So geht die Division immer auf

    const contexts = this.getContexts(dividend, divisor);
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongAnswers(result, dividend, divisor);
    const options = this.shuffleArray([result, ...wrongAnswers]);

    return {
      id: `div_${dividend}_${divisor}`,
      type: 'division',
      question: `${dividend} : ${divisor} = ?`,
      contextQuestion: context.question,
      correctAnswer: result,
      options: options,
      hint: this.getHint(dividend, divisor, result),
      visualData: {
        total: dividend,
        groups: divisor,
        perGroup: result,
        icon: context.icon
      },
      difficulty: this.difficulty
    };
  }

  getContexts(dividend, divisor) {
    return [
      {
        question: `${dividend} Goldmünzen sollen auf ${divisor} Schatztruhen verteilt werden. Wie viele kommen in jede Truhe?`,
        icon: 'coin'
      },
      {
        question: `${divisor} Affen wollen sich ${dividend} Bananen teilen. Wie viele bekommt jeder?`,
        icon: 'banana'
      },
      {
        question: `Der Expeditionsführer verteilt ${dividend} Vorräte an ${divisor} Träger. Wie viele bekommt jeder?`,
        icon: 'supplies'
      },
      {
        question: `${dividend} Schmetterlinge setzen sich gleichmäßig auf ${divisor} Blumen. Wie viele auf jede Blume?`,
        icon: 'butterfly'
      },
      {
        question: `Eine Seilbrücke ist ${dividend} Meter lang und hat ${divisor} Abschnitte. Wie lang ist jeder Abschnitt?`,
        icon: 'bridge'
      }
    ];
  }

  getHint(dividend, divisor, result) {
    // Umkehr-Einmaleins
    if (divisor <= 5) {
      return `Tipp: Überlege: ${divisor} mal was ergibt ${dividend}?`;
    } else if (divisor === 10) {
      return `Tipp: Durch 10 teilen - streiche die letzte 0!`;
    } else {
      return `Tipp: ${divisor} × ${result} = ${dividend} (Einmaleins rückwärts)`;
    }
  }

  generateWrongAnswers(correct, dividend, divisor) {
    const wrong = new Set();

    // Typische Fehler:
    // 1. Um 1 daneben
    wrong.add(correct + 1);
    wrong.add(correct - 1);

    // 2. Nachbar-Division
    if (divisor > 1) {
      wrong.add(Math.floor(dividend / (divisor - 1)));
      wrong.add(Math.floor(dividend / (divisor + 1)));
    }

    // 3. Dividend statt Ergebnis
    if (dividend !== correct) {
      wrong.add(divisor);
    }

    // 4. Subtraktion statt Division
    wrong.add(dividend - divisor);

    // 5. Multiplikation statt Division
    if (divisor * correct !== correct) {
      wrong.add(divisor * 2);
    }

    // Filtere ungültige Antworten
    wrong.delete(correct);
    const filtered = [...wrong].filter(n => n > 0 && n !== correct && n <= 100);

    // Wenn nicht genug falsche Antworten, füge zufällige hinzu
    while (filtered.length < 3) {
      const rand = this.randomInt(1, this.maxDivisor * 2);
      if (rand !== correct && !filtered.includes(rand)) {
        filtered.push(rand);
      }
    }

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
