export class MeasurementQ {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
  }

  generate() {
    // Verschiedene Messungs-Fragetypen
    const types = [
      'weight',        // kg und g
      'volume',        // Liter und ml
      'length',        // km, m, cm
      'time',          // Zeitspannen
      'money'          // Euro und Cent
    ];

    const typeIndex = Math.floor(Math.random() * types.length);
    const type = types[typeIndex];

    switch (type) {
      case 'weight':
        return this.generateWeightQuestion();
      case 'volume':
        return this.generateVolumeQuestion();
      case 'length':
        return this.generateLengthQuestion();
      case 'time':
        return this.generateTimeQuestion();
      case 'money':
        return this.generateMoneyQuestion();
      default:
        return this.generateWeightQuestion();
    }
  }

  // Gewicht: kg und g
  generateWeightQuestion() {
    const questionTypes = [
      this.generateKgToG.bind(this),
      this.generateGToKg.bind(this),
      this.generateWeightAddition.bind(this)
    ];
    return questionTypes[Math.floor(Math.random() * questionTypes.length)]();
  }

  generateKgToG() {
    const kg = this.randomInt(1, 20);
    const correctAnswer = kg * 1000;

    const contexts = [
      {
        question: `Dein Expeditions-Rucksack wiegt ${kg} kg. Wie viel Gramm sind das?`,
        icon: 'backpack'
      },
      {
        question: `Der Jaguar wiegt ${kg} kg. Wie viele Gramm sind das?`,
        icon: 'jaguar'
      },
      {
        question: `Die Ausrüstung wiegt ${kg} kg. Wie viele Gramm musst du tragen?`,
        icon: 'equipment'
      },
      {
        question: `Ein Baumstamm wiegt ${kg} kg. Wie viel Gramm ist das?`,
        icon: 'tree'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 100, 10000);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_kg_g_${kg}`,
      type: 'measurement',
      subtype: 'weight_kg_to_g',
      question: `${kg} kg = ? g`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1 kg = 1000 g`,
      difficulty: this.difficulty,
      visualData: {
        value: kg,
        unit: 'kg',
        targetUnit: 'g',
        icon: context.icon
      }
    };
  }

  generateGToKg() {
    const kg = this.randomInt(1, 20);
    const g = kg * 1000;
    const correctAnswer = kg;

    const contexts = [
      {
        question: `Die Kokosnüsse wiegen zusammen ${g} g. Wie viel kg ist das?`,
        icon: 'coconut'
      },
      {
        question: `Dein Proviant wiegt ${g} g. Wie viele kg sind das?`,
        icon: 'food'
      },
      {
        question: `Die gesammelten Früchte wiegen ${g} g. Wie viele kg sind das?`,
        icon: 'fruit'
      },
      {
        question: `Das Zelt wiegt ${g} g. Wie viele kg musst du schleppen?`,
        icon: 'tent'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 1, 15);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_g_kg_${g}`,
      type: 'measurement',
      subtype: 'weight_g_to_kg',
      question: `${g} g = ? kg`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1000 g = 1 kg`,
      difficulty: this.difficulty,
      visualData: {
        value: g,
        unit: 'g',
        targetUnit: 'kg',
        icon: context.icon
      }
    };
  }

  generateWeightAddition() {
    const kg = this.randomInt(1, 15);
    const g = this.randomInt(1, 9) * 100;
    const totalG = kg * 1000 + g;

    const contexts = [
      {
        question: `Du hast ${kg} kg Bananen und ${g} g Nüsse. Wie viel Gramm ist das zusammen?`,
        icon: 'banana'
      },
      {
        question: `Der Rucksack wiegt ${kg} kg, die Wasserflasche ${g} g. Wie viel Gramm trägst du?`,
        icon: 'backpack'
      },
      {
        question: `${kg} kg Äpfel und ${g} g Beeren. Wie viel Gramm insgesamt?`,
        icon: 'fruit'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(totalG, 1000, 10000);
    const options = this.shuffleArray([totalG, ...wrongAnswers]);

    return {
      id: `meas_weight_add_${kg}_${g}`,
      type: 'measurement',
      subtype: 'weight_addition',
      question: `${kg} kg + ${g} g = ? g`,
      contextQuestion: context.question,
      correctAnswer: totalG,
      options: options,
      hint: `Tipp: Rechne erst kg in g um, dann addiere.`,
      difficulty: this.difficulty,
      visualData: {
        kg: kg,
        g: g,
        icon: context.icon
      }
    };
  }

  // Volumen: Liter und ml
  generateVolumeQuestion() {
    const questionTypes = [
      this.generateLToMl.bind(this),
      this.generateMlToL.bind(this)
    ];
    return questionTypes[Math.floor(Math.random() * questionTypes.length)]();
  }

  generateLToMl() {
    const l = this.randomInt(1, 15);
    const correctAnswer = l * 1000;

    const contexts = [
      {
        question: `Deine Wasserflasche fasst ${l} Liter. Wie viele Milliliter sind das?`,
        icon: 'water'
      },
      {
        question: `Der Fluss führt ${l} Liter Wasser pro Sekunde. Wie viel ml ist das?`,
        icon: 'river'
      },
      {
        question: `Der Wasserkanister enthält ${l} Liter. Wie viele ml sind das?`,
        icon: 'canister'
      },
      {
        question: `Im Teich sind ${l} Liter Wasser. Wie viele Milliliter?`,
        icon: 'pond'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 100, 10000);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_l_ml_${l}`,
      type: 'measurement',
      subtype: 'volume_l_to_ml',
      question: `${l} l = ? ml`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1 Liter = 1000 ml`,
      difficulty: this.difficulty,
      visualData: {
        value: l,
        unit: 'l',
        targetUnit: 'ml',
        icon: context.icon
      }
    };
  }

  generateMlToL() {
    const l = this.randomInt(1, 15);
    const ml = l * 1000;
    const correctAnswer = l;

    const contexts = [
      {
        question: `Im Wasserbecken sind ${ml} ml. Wie viele Liter sind das?`,
        icon: 'water'
      },
      {
        question: `Die Regentonne enthält ${ml} ml. Wie viele Liter sind das?`,
        icon: 'barrel'
      },
      {
        question: `${ml} ml Saft wurden gepresst. Wie viele Liter sind das?`,
        icon: 'juice'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 1, 15);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_ml_l_${ml}`,
      type: 'measurement',
      subtype: 'volume_ml_to_l',
      question: `${ml} ml = ? l`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1000 ml = 1 Liter`,
      difficulty: this.difficulty,
      visualData: {
        value: ml,
        unit: 'ml',
        targetUnit: 'l',
        icon: context.icon
      }
    };
  }

  // Länge: km, m, cm
  generateLengthQuestion() {
    const questionTypes = [
      this.generateKmToM.bind(this),
      this.generateMToCm.bind(this),
      this.generateCmToM.bind(this)
    ];
    return questionTypes[Math.floor(Math.random() * questionTypes.length)]();
  }

  generateKmToM() {
    const km = this.randomInt(1, 20);
    const correctAnswer = km * 1000;

    const contexts = [
      {
        question: `Der Bergpfad ist ${km} km lang. Wie viele Meter sind das?`,
        icon: 'mountain'
      },
      {
        question: `Bis zum Tempel sind es ${km} km. Wie viel Meter musst du laufen?`,
        icon: 'temple'
      },
      {
        question: `Die Expedition führt ${km} km durch den Dschungel. Wie viele Meter?`,
        icon: 'jungle'
      },
      {
        question: `Der Fluss ist ${km} km lang. Wie viele Meter sind das?`,
        icon: 'river'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 100, 10000);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_km_m_${km}`,
      type: 'measurement',
      subtype: 'length_km_to_m',
      question: `${km} km = ? m`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1 km = 1000 m`,
      difficulty: this.difficulty,
      visualData: {
        value: km,
        unit: 'km',
        targetUnit: 'm',
        icon: context.icon
      }
    };
  }

  generateMToCm() {
    const m = this.randomInt(1, 20);
    const correctAnswer = m * 100;

    const contexts = [
      {
        question: `Die Liane ist ${m} m lang. Wie viele Zentimeter sind das?`,
        icon: 'liana'
      },
      {
        question: `Das Krokodil ist ${m} m lang. Wie viel cm ist das?`,
        icon: 'crocodile'
      },
      {
        question: `Der Baumstamm ist ${m} m lang. Wie viele cm sind das?`,
        icon: 'tree'
      },
      {
        question: `Die Schlange ist ${m} m lang. Wie viele Zentimeter?`,
        icon: 'snake'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 10, 1000);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_m_cm_${m}`,
      type: 'measurement',
      subtype: 'length_m_to_cm',
      question: `${m} m = ? cm`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1 m = 100 cm`,
      difficulty: this.difficulty,
      visualData: {
        value: m,
        unit: 'm',
        targetUnit: 'cm',
        icon: context.icon
      }
    };
  }

  generateCmToM() {
    const m = this.randomInt(1, 20);
    const cm = m * 100;
    const correctAnswer = m;

    const contexts = [
      {
        question: `Der Baumstamm ist ${cm} cm lang. Wie viele Meter sind das?`,
        icon: 'tree'
      },
      {
        question: `Das Seil ist ${cm} cm lang. Wie viele Meter sind das?`,
        icon: 'rope'
      },
      {
        question: `Die Brücke ist ${cm} cm lang. Wie viele Meter?`,
        icon: 'bridge'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 1, 15);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_cm_m_${cm}`,
      type: 'measurement',
      subtype: 'length_cm_to_m',
      question: `${cm} cm = ? m`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 100 cm = 1 m`,
      difficulty: this.difficulty,
      visualData: {
        value: cm,
        unit: 'cm',
        targetUnit: 'm',
        icon: context.icon
      }
    };
  }

  // Zeit
  generateTimeQuestion() {
    const questionTypes = [
      this.generateHourToMin.bind(this),
      this.generateTimeSpan.bind(this)
    ];
    return questionTypes[Math.floor(Math.random() * questionTypes.length)]();
  }

  generateHourToMin() {
    const h = this.randomInt(1, 12);
    const correctAnswer = h * 60;

    const contexts = [
      {
        question: `Die Wanderung dauert ${h} Stunden. Wie viele Minuten sind das?`,
        icon: 'clock'
      },
      {
        question: `Der Sonnenaufgang ist in ${h} Stunden. Wie viele Minuten musst du warten?`,
        icon: 'sun'
      },
      {
        question: `Die Bootsfahrt dauert ${h} Stunden. Wie viele Minuten?`,
        icon: 'boat'
      },
      {
        question: `Das Lagerfeuer brennt ${h} Stunden. Wie viele Minuten sind das?`,
        icon: 'fire'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 30, 400);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_h_min_${h}`,
      type: 'measurement',
      subtype: 'time_h_to_min',
      question: `${h} Stunden = ? Minuten`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1 Stunde = 60 Minuten`,
      difficulty: this.difficulty,
      visualData: {
        value: h,
        unit: 'h',
        targetUnit: 'min',
        icon: context.icon
      }
    };
  }

  generateTimeSpan() {
    const startH = this.randomInt(6, 16);
    const duration = this.randomInt(1, 8);
    const endH = startH + duration;

    const contexts = [
      {
        question: `Die Expedition startet um ${startH}:00 Uhr und endet um ${endH}:00 Uhr. Wie lange dauert sie?`,
        icon: 'clock'
      },
      {
        question: `Von ${startH}:00 Uhr bis ${endH}:00 Uhr wandern wir. Wie viele Stunden?`,
        icon: 'hiking'
      },
      {
        question: `Das Museum öffnet um ${startH}:00 und schließt um ${endH}:00. Wie lange ist es offen?`,
        icon: 'museum'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(duration, 1, 8);
    const options = this.shuffleArray([duration, ...wrongAnswers]);

    return {
      id: `meas_timespan_${startH}_${endH}`,
      type: 'measurement',
      subtype: 'time_span',
      question: `Von ${startH}:00 bis ${endH}:00 = ? Stunden`,
      contextQuestion: context.question,
      correctAnswer: duration,
      options: options,
      hint: `Tipp: Ziehe die Startzeit von der Endzeit ab.`,
      difficulty: this.difficulty,
      visualData: {
        start: startH,
        end: endH,
        icon: context.icon
      }
    };
  }

  // Geld: Euro und Cent
  generateMoneyQuestion() {
    const questionTypes = [
      this.generateEuroToCent.bind(this),
      this.generateMoneyAddition.bind(this)
    ];
    return questionTypes[Math.floor(Math.random() * questionTypes.length)]();
  }

  generateEuroToCent() {
    const euro = this.randomInt(1, 20);
    const correctAnswer = euro * 100;

    const contexts = [
      {
        question: `Du hast ${euro} Euro gefunden. Wie viele Cent sind das?`,
        icon: 'coin'
      },
      {
        question: `Die Schatztruhe enthält ${euro} Goldmünzen (je 1 Euro). Wie viel Cent ist das?`,
        icon: 'chest'
      },
      {
        question: `Das Souvenir kostet ${euro} Euro. Wie viele Cent sind das?`,
        icon: 'shop'
      },
      {
        question: `Du sparst ${euro} Euro. Wie viele Cent hast du gespart?`,
        icon: 'piggy'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 10, 1000);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `meas_euro_cent_${euro}`,
      type: 'measurement',
      subtype: 'money_euro_to_cent',
      question: `${euro} Euro = ? Cent`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1 Euro = 100 Cent`,
      difficulty: this.difficulty,
      visualData: {
        value: euro,
        unit: 'Euro',
        targetUnit: 'Cent',
        icon: context.icon
      }
    };
  }

  generateMoneyAddition() {
    const euro = this.randomInt(1, 15);
    const cent = this.randomInt(1, 9) * 10;
    const totalCent = euro * 100 + cent;

    const contexts = [
      {
        question: `Du hast ${euro} Euro und ${cent} Cent. Wie viel Cent hast du insgesamt?`,
        icon: 'coin'
      },
      {
        question: `Im Geldbeutel sind ${euro} Euro und ${cent} Cent. Wie viele Cent insgesamt?`,
        icon: 'wallet'
      },
      {
        question: `Das Eis kostet ${euro} Euro und ${cent} Cent. Wie viele Cent brauchst du?`,
        icon: 'icecream'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const wrongAnswers = this.generateWrongNumbers(totalCent, 100, 800);
    const options = this.shuffleArray([totalCent, ...wrongAnswers]);

    return {
      id: `meas_money_add_${euro}_${cent}`,
      type: 'measurement',
      subtype: 'money_addition',
      question: `${euro} Euro + ${cent} Cent = ? Cent`,
      contextQuestion: context.question,
      correctAnswer: totalCent,
      options: options,
      hint: `Tipp: Rechne erst Euro in Cent um, dann addiere.`,
      difficulty: this.difficulty,
      visualData: {
        euro: euro,
        cent: cent,
        icon: context.icon
      }
    };
  }

  // Hilfsmethoden
  generateWrongNumbers(correct, min, max) {
    const wrong = new Set();

    // Typische Fehler
    wrong.add(correct + 10);
    wrong.add(correct - 10);
    wrong.add(correct + 100);
    wrong.add(correct - 100);
    wrong.add(correct * 10);
    wrong.add(Math.floor(correct / 10));

    // Zufällige Zahlen
    while (wrong.size < 8) {
      wrong.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    wrong.delete(correct);
    const filtered = [...wrong].filter(n => n >= min && n <= max && n !== correct && n > 0);
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
