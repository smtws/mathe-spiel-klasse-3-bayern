// Word Problem Questions (Sachaufgaben) for 3rd grade Bavaria
// Theme: Jungle expedition scenarios

export class WordProblemQ {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
  }

  generate() {
    const types = [
      'shopping',      // Einkaufs-Aufgaben
      'sharing',       // Verteilungs-Aufgaben
      'distance',      // Strecken-Aufgaben
      'time',          // Zeit-Aufgaben
      'collection',    // Sammel-Aufgaben
      'comparison'     // Vergleichs-Aufgaben
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    return this.generateByType(type);
  }

  generateByType(type) {
    switch (type) {
      case 'shopping':
        return this.generateShopping();
      case 'sharing':
        return this.generateSharing();
      case 'distance':
        return this.generateDistance();
      case 'time':
        return this.generateTime();
      case 'collection':
        return this.generateCollection();
      case 'comparison':
        return this.generateComparison();
      default:
        return this.generateShopping();
    }
  }

  generateOptions(correctAnswer) {
    const wrongAnswers = [];
    const offsets = [-3, -2, -1, 1, 2, 3, 5, 10];

    while (wrongAnswers.length < 3) {
      const offset = offsets[Math.floor(Math.random() * offsets.length)];
      const wrong = correctAnswer + offset;
      if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }

    const allOptions = [correctAnswer, ...wrongAnswers];
    return this.shuffleArray(allOptions);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  generateShopping() {
    const scenarios = [
      () => {
        const price = this.getNumber(2, 8);
        const count = this.getNumber(2, 5);
        const total = price * count;
        return {
          id: `wp_shop_mult_${price}_${count}`,
          question: `Der Expeditions-Shop verkauft Wasserflaschen für ${price} Euro das Stück. Tom kauft ${count} Flaschen. Wie viel muss er bezahlen?`,
          correctAnswer: total,
          hint: `${count} × ${price} =`,
          unit: 'Euro'
        };
      },
      () => {
        const price1 = this.getNumber(3, 7);
        const price2 = this.getNumber(2, 5);
        const total = price1 + price2;
        return {
          id: `wp_shop_add_${price1}_${price2}`,
          question: `Lisa kauft eine Taschenlampe für ${price1} Euro und Batterien für ${price2} Euro. Wie viel gibt sie insgesamt aus?`,
          correctAnswer: total,
          hint: `${price1} + ${price2} =`,
          unit: 'Euro'
        };
      },
      () => {
        const money = this.getNumber(15, 25);
        const price = this.getNumber(5, 12);
        const change = money - price;
        return {
          id: `wp_shop_sub_${money}_${price}`,
          question: `Max hat ${money} Euro. Er kauft einen Kompass für ${price} Euro. Wie viel Geld bekommt er zurück?`,
          correctAnswer: change,
          hint: `${money} - ${price} =`,
          unit: 'Euro'
        };
      },
      () => {
        const priceEach = this.getNumber(2, 6);
        const count = this.getNumber(3, 6);
        const total = priceEach * count;
        return {
          id: `wp_cafe_${priceEach}_${count}`,
          question: `Im Dschungel-Café kostet ein Saft ${priceEach} Euro. Die Expeditionsgruppe bestellt ${count} Säfte. Was kostet das zusammen?`,
          correctAnswer: total,
          hint: `${count} × ${priceEach} =`,
          unit: 'Euro'
        };
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]();
    const options = this.generateOptions(scenario.correctAnswer);
    return {
      ...scenario,
      contextQuestion: scenario.question,
      options: options,
      type: 'word_problem',
      subtype: 'shopping'
    };
  }

  generateSharing() {
    const scenarios = [
      () => {
        const total = this.getNumber(12, 36, 4);
        const groups = [2, 3, 4, 6][Math.floor(Math.random() * 4)];
        const each = total / groups;
        if (!Number.isInteger(each)) return null;
        return {
          id: `wp_share_banana_${total}_${groups}`,
          question: `${total} Bananen werden gleichmäßig auf ${groups} Affen verteilt. Wie viele bekommt jeder Affe?`,
          correctAnswer: each,
          hint: `${total} ÷ ${groups} =`,
          unit: 'Bananen'
        };
      },
      () => {
        const each = this.getNumber(3, 8);
        const people = this.getNumber(3, 6);
        const total = each * people;
        return {
          id: `wp_share_cards_${each}_${people}`,
          question: `Jedes Kind bekommt ${each} Sammelkarten. Es sind ${people} Kinder. Wie viele Karten werden verteilt?`,
          correctAnswer: total,
          hint: `${people} × ${each} =`,
          unit: 'Karten'
        };
      },
      () => {
        const total = this.getNumber(20, 50, 5);
        const groups = this.getNumber(2, 5);
        const each = total / groups;
        if (!Number.isInteger(each)) return null;
        return {
          id: `wp_share_gold_${total}_${groups}`,
          question: `Die Schatzsucher finden ${total} Goldmünzen. Sie teilen sie auf ${groups} Personen auf. Wie viele Münzen bekommt jeder?`,
          correctAnswer: each,
          hint: `${total} ÷ ${groups} =`,
          unit: 'Münzen'
        };
      }
    ];

    let scenario = null;
    let attempts = 0;
    while (!scenario && attempts < 10) {
      scenario = scenarios[Math.floor(Math.random() * scenarios.length)]();
      attempts++;
    }
    if (!scenario) scenario = scenarios[1](); // Fallback

    const options = this.generateOptions(scenario.correctAnswer);
    return {
      ...scenario,
      contextQuestion: scenario.question,
      options: options,
      type: 'word_problem',
      subtype: 'sharing'
    };
  }

  generateDistance() {
    const scenarios = [
      () => {
        const dist1 = this.getNumber(10, 50, 5);
        const dist2 = this.getNumber(10, 40, 5);
        const total = dist1 + dist2;
        return {
          id: `wp_dist_add_${dist1}_${dist2}`,
          question: `Die Expedition wandert vormittags ${dist1} Meter und nachmittags ${dist2} Meter. Wie weit sind sie insgesamt gewandert?`,
          correctAnswer: total,
          hint: `${dist1} + ${dist2} =`,
          unit: 'Meter'
        };
      },
      () => {
        const total = this.getNumber(50, 100, 10);
        const done = this.getNumber(20, total - 10, 5);
        const remaining = total - done;
        return {
          id: `wp_dist_sub_${total}_${done}`,
          question: `Der Pfad zum Tempel ist ${total} Meter lang. Die Gruppe hat schon ${done} Meter geschafft. Wie weit ist es noch?`,
          correctAnswer: remaining,
          hint: `${total} - ${done} =`,
          unit: 'Meter'
        };
      },
      () => {
        const perDay = this.getNumber(5, 15);
        const days = this.getNumber(3, 7);
        const total = perDay * days;
        return {
          id: `wp_dist_mult_${perDay}_${days}`,
          question: `Das Expeditionsteam läuft jeden Tag ${perDay} Kilometer. Wie weit kommen sie in ${days} Tagen?`,
          correctAnswer: total,
          hint: `${days} × ${perDay} =`,
          unit: 'Kilometer'
        };
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]();
    const options = this.generateOptions(scenario.correctAnswer);
    return {
      ...scenario,
      contextQuestion: scenario.question,
      options: options,
      type: 'word_problem',
      subtype: 'distance'
    };
  }

  generateTime() {
    const scenarios = [
      () => {
        const hours = this.getNumber(2, 5);
        const minutes = hours * 60;
        return {
          id: `wp_time_hmin_${hours}`,
          question: `Die Bootsfahrt dauert ${hours} Stunden. Wie viele Minuten sind das?`,
          correctAnswer: minutes,
          hint: `${hours} × 60 =`,
          unit: 'Minuten'
        };
      },
      () => {
        const start = this.getNumber(8, 11);
        const duration = this.getNumber(2, 4);
        const end = start + duration;
        return {
          id: `wp_time_end_${start}_${duration}`,
          question: `Die Expedition startet um ${start} Uhr und dauert ${duration} Stunden. Um wie viel Uhr sind sie fertig?`,
          correctAnswer: end,
          hint: `${start} + ${duration} =`,
          unit: 'Uhr'
        };
      },
      () => {
        const time1 = this.getNumber(15, 30, 5);
        const time2 = this.getNumber(15, 30, 5);
        const total = time1 + time2;
        return {
          id: `wp_time_add_${time1}_${time2}`,
          question: `Das Packen dauert ${time1} Minuten, das Frühstück ${time2} Minuten. Wie viel Zeit brauchen beide zusammen?`,
          correctAnswer: total,
          hint: `${time1} + ${time2} =`,
          unit: 'Minuten'
        };
      },
      () => {
        const total = this.getNumber(40, 60, 5);
        const done = this.getNumber(15, 30, 5);
        const remaining = total - done;
        return {
          id: `wp_time_sub_${total}_${done}`,
          question: `Die Wanderung soll ${total} Minuten dauern. Sie laufen schon ${done} Minuten. Wie lange noch?`,
          correctAnswer: remaining,
          hint: `${total} - ${done} =`,
          unit: 'Minuten'
        };
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]();
    const options = this.generateOptions(scenario.correctAnswer);
    return {
      ...scenario,
      contextQuestion: scenario.question,
      options: options,
      type: 'word_problem',
      subtype: 'time'
    };
  }

  generateCollection() {
    const scenarios = [
      () => {
        const start = this.getNumber(15, 30);
        const found = this.getNumber(5, 15);
        const total = start + found;
        return {
          id: `wp_coll_add_${start}_${found}`,
          question: `Mia hat ${start} Muscheln. Am Strand findet sie ${found} weitere. Wie viele hat sie jetzt?`,
          correctAnswer: total,
          hint: `${start} + ${found} =`,
          unit: 'Muscheln'
        };
      },
      () => {
        const start = this.getNumber(25, 40);
        const gave = this.getNumber(5, 15);
        const remaining = start - gave;
        return {
          id: `wp_coll_sub_${start}_${gave}`,
          question: `Tim hat ${start} Sammelsticker. Er schenkt seinem Freund ${gave} Sticker. Wie viele hat er noch?`,
          correctAnswer: remaining,
          hint: `${start} - ${gave} =`,
          unit: 'Sticker'
        };
      },
      () => {
        const perDay = this.getNumber(4, 8);
        const days = this.getNumber(3, 6);
        const total = perDay * days;
        return {
          id: `wp_coll_mult_${perDay}_${days}`,
          question: `Jeden Tag findet das Team ${perDay} besondere Steine. Wie viele haben sie nach ${days} Tagen?`,
          correctAnswer: total,
          hint: `${days} × ${perDay} =`,
          unit: 'Steine'
        };
      },
      () => {
        const red = this.getNumber(8, 15);
        const blue = this.getNumber(6, 12);
        const green = this.getNumber(4, 10);
        const total = red + blue + green;
        return {
          id: `wp_coll_3add_${red}_${blue}_${green}`,
          question: `Im Dschungel zählt Lisa ${red} rote, ${blue} blaue und ${green} grüne Schmetterlinge. Wie viele sind es insgesamt?`,
          correctAnswer: total,
          hint: `${red} + ${blue} + ${green} =`,
          unit: 'Schmetterlinge'
        };
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]();
    const options = this.generateOptions(scenario.correctAnswer);
    return {
      ...scenario,
      contextQuestion: scenario.question,
      options: options,
      type: 'word_problem',
      subtype: 'collection'
    };
  }

  generateComparison() {
    const scenarios = [
      () => {
        const num1 = this.getNumber(20, 50);
        const num2 = this.getNumber(10, 30);
        const diff = Math.abs(num1 - num2);
        const more = num1 > num2 ? 'Tim' : 'Lisa';
        const less = num1 > num2 ? 'Lisa' : 'Tim';
        return {
          id: `wp_comp_diff_${num1}_${num2}`,
          question: `Tim hat ${num1} Äpfel, Lisa hat ${num2} Äpfel. Wie viele Äpfel hat ${more} mehr als ${less}?`,
          correctAnswer: diff,
          hint: `${Math.max(num1, num2)} - ${Math.min(num1, num2)} =`,
          unit: 'Äpfel'
        };
      },
      () => {
        const small = this.getNumber(15, 30);
        const diff = this.getNumber(5, 15);
        const large = small + diff;
        return {
          id: `wp_comp_weight_${small}_${large}`,
          question: `Ein Rucksack wiegt ${small} kg, der andere ${large} kg. Wie viel schwerer ist der große Rucksack?`,
          correctAnswer: diff,
          hint: `${large} - ${small} =`,
          unit: 'kg'
        };
      },
      () => {
        const height1 = this.getNumber(10, 20);
        const times = this.getNumber(2, 4);
        const height2 = height1 * times;
        return {
          id: `wp_comp_times_${height1}_${times}`,
          question: `Ein Busch ist ${height1} Meter hoch. Der Baum daneben ist ${this.getTimesWord(times)} so hoch. Wie hoch ist der Baum?`,
          correctAnswer: height2,
          hint: `${times} × ${height1} =`,
          unit: 'Meter'
        };
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)]();
    const options = this.generateOptions(scenario.correctAnswer);
    return {
      ...scenario,
      contextQuestion: scenario.question,
      options: options,
      type: 'word_problem',
      subtype: 'comparison'
    };
  }

  getNumber(min, max, step = 1) {
    const range = Math.floor((max - min) / step) + 1;
    return min + Math.floor(Math.random() * range) * step;
  }

  // Hilfsmethode für Zahlwörter bei "-mal"
  getTimesWord(n) {
    const words = {
      2: 'zweimal',
      3: 'dreimal',
      4: 'viermal',
      5: 'fünfmal',
      6: 'sechsmal'
    };
    return words[n] || `${n}-mal`;
  }
}
