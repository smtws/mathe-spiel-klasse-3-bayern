/**
 * MoneyQ - Fragen zu Geldbeträgen (Euro und Cent)
 * Bayerischer Lehrplan 3. Klasse: Rechnen mit Geld
 */
export class MoneyQ {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
  }

  generate() {
    const questionTypes = [
      'add_money',       // Geldbeträge addieren
      'subtract_money',  // Geldbeträge subtrahieren (Rückgeld)
      'convert_cents',   // Cent in Euro umrechnen
      'compare_prices',  // Preise vergleichen
      'pay_exact',       // Passend bezahlen
    ];

    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    switch (type) {
      case 'add_money':
        return this.generateAddMoney();
      case 'subtract_money':
        return this.generateSubtractMoney();
      case 'convert_cents':
        return this.generateConvertCents();
      case 'compare_prices':
        return this.generateComparePrices();
      case 'pay_exact':
        return this.generatePayExact();
      default:
        return this.generateAddMoney();
    }
  }

  generateAddMoney() {
    // Zwei Beträge addieren
    const price1 = this.generatePrice();
    const price2 = this.generatePrice();
    const total = price1 + price2;

    const price1Str = this.formatMoney(price1);
    const price2Str = this.formatMoney(price2);
    const totalStr = this.formatMoney(total);

    const items = this.getShopItems();
    const item1 = items[Math.floor(Math.random() * items.length)];
    const item2 = items[Math.floor(Math.random() * items.length)];

    const contexts = [
      `Du kaufst ${item1} für ${price1Str} und ${item2} für ${price2Str}. Wie viel bezahlst du insgesamt?`,
      `${item1} kostet ${price1Str}, ${item2} kostet ${price2Str}. Wie viel kosten beide zusammen?`,
      `Auf dem Dschungel-Markt kaufst du ${item1} (${price1Str}) und ${item2} (${price2Str}). Was ist der Gesamtpreis?`
    ];

    const question = contexts[Math.floor(Math.random() * contexts.length)];
    const wrongAnswers = this.generateWrongMoneyAnswers(total);
    const options = this.shuffleArray([totalStr, ...wrongAnswers]);

    return {
      id: `money_add_${price1}_${price2}`,
      type: 'money',
      subtype: 'addition',
      question: question,
      contextQuestion: question,
      correctAnswer: totalStr,
      options: options,
      hint: `Tipp: Addiere erst die Euro, dann die Cent`,
      difficulty: this.difficulty,
      visualData: {
        type: 'money_add',
        price1, price2
      }
    };
  }

  generateSubtractMoney() {
    // Rückgeld berechnen
    const price = this.generatePrice();
    const paidOptions = this.difficulty === 'easy'
      ? [500, 1000, 2000]  // 5€, 10€, 20€
      : [200, 500, 1000, 2000, 5000]; // 2€, 5€, 10€, 20€, 50€

    // Wähle einen Betrag, der größer als der Preis ist
    const validPaid = paidOptions.filter(p => p > price);
    if (validPaid.length === 0) {
      return this.generateAddMoney(); // Fallback
    }

    const paid = validPaid[Math.floor(Math.random() * validPaid.length)];
    const change = paid - price;

    const priceStr = this.formatMoney(price);
    const paidStr = this.formatMoney(paid);
    const changeStr = this.formatMoney(change);

    const items = this.getShopItems();
    const item = items[Math.floor(Math.random() * items.length)];

    const contexts = [
      `${item} kostet ${priceStr}. Du bezahlst mit ${paidStr}. Wie viel Rückgeld bekommst du?`,
      `Du kaufst ${item} für ${priceStr} und gibst ${paidStr}. Wie viel bekommst du zurück?`,
      `Der Händler verlangt ${priceStr} für ${item}. Du hast ${paidStr}. Wie viel Wechselgeld gibt es?`
    ];

    const question = contexts[Math.floor(Math.random() * contexts.length)];
    const wrongAnswers = this.generateWrongMoneyAnswers(change);
    const options = this.shuffleArray([changeStr, ...wrongAnswers]);

    return {
      id: `money_change_${price}_${paid}`,
      type: 'money',
      subtype: 'change',
      question: question,
      contextQuestion: question,
      correctAnswer: changeStr,
      options: options,
      hint: `Tipp: Ziehe ${priceStr} von ${paidStr} ab`,
      difficulty: this.difficulty,
      visualData: {
        type: 'money_change',
        price, paid
      }
    };
  }

  generateConvertCents() {
    // Cent in Euro umrechnen oder umgekehrt
    const euros = this.randomInt(1, 9);
    const cents = this.randomInt(0, 99);
    const totalCents = euros * 100 + cents;

    const direction = Math.random() > 0.5 ? 'to_cents' : 'to_euros';

    let question, correctAnswer, wrongAnswers;

    if (direction === 'to_cents') {
      const euroStr = this.formatMoney(totalCents);
      question = `Wie viel Cent sind ${euroStr}?`;
      correctAnswer = `${totalCents} Cent`;
      wrongAnswers = [
        `${totalCents + 100} Cent`,
        `${totalCents - 100} Cent`,
        `${euros * 10 + cents} Cent`
      ].filter(a => !a.startsWith('-'));
    } else {
      question = `Wie viel Euro sind ${totalCents} Cent?`;
      correctAnswer = this.formatMoney(totalCents);
      wrongAnswers = this.generateWrongMoneyAnswers(totalCents);
    }

    const options = this.shuffleArray([correctAnswer, ...wrongAnswers.slice(0, 3)]);

    return {
      id: `money_convert_${totalCents}`,
      type: 'money',
      subtype: 'conversion',
      question: question,
      contextQuestion: question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 100 Cent = 1 Euro`,
      difficulty: this.difficulty,
      visualData: {
        type: 'money_convert',
        cents: totalCents
      }
    };
  }

  generateComparePrices() {
    // Welcher Preis ist günstiger/teurer?
    const price1 = this.generatePrice();
    let price2 = this.generatePrice();
    while (price2 === price1) {
      price2 = this.generatePrice();
    }

    const price1Str = this.formatMoney(price1);
    const price2Str = this.formatMoney(price2);

    const items = this.getShopItems();
    const item1 = items[Math.floor(Math.random() * items.length)];
    let item2 = items[Math.floor(Math.random() * items.length)];
    while (item2 === item1) {
      item2 = items[Math.floor(Math.random() * items.length)];
    }

    const askCheaper = Math.random() > 0.5;
    const correctItem = askCheaper
      ? (price1 < price2 ? item1 : item2)
      : (price1 > price2 ? item1 : item2);

    const question = askCheaper
      ? `${item1} kostet ${price1Str}, ${item2} kostet ${price2Str}. Was ist günstiger?`
      : `${item1} kostet ${price1Str}, ${item2} kostet ${price2Str}. Was ist teurer?`;

    const options = this.shuffleArray([item1, item2, 'Beide gleich teuer']);

    return {
      id: `money_compare_${price1}_${price2}`,
      type: 'money',
      subtype: 'compare',
      question: question,
      contextQuestion: question,
      correctAnswer: correctItem,
      options: options,
      hint: `Tipp: Vergleiche erst die Euro, dann die Cent`,
      difficulty: this.difficulty,
      visualData: {
        type: 'money_compare',
        price1, price2, item1, item2
      }
    };
  }

  generatePayExact() {
    // Mit welchen Münzen/Scheinen kann man passend bezahlen?
    const price = this.difficulty === 'easy'
      ? this.randomInt(1, 5) * 100  // Glatte Euro-Beträge
      : this.generatePrice();

    const priceStr = this.formatMoney(price);

    // Generiere eine korrekte Kombination
    const correctCombo = this.generateCoinCombo(price);
    const correctAnswer = correctCombo.join(' + ');

    // Generiere falsche Kombinationen
    const wrongCombos = [
      this.generateCoinCombo(price + 100),
      this.generateCoinCombo(price - 50),
      this.generateCoinCombo(price + 50),
    ].map(c => c.join(' + '));

    const contexts = [
      `Du möchtest genau ${priceStr} bezahlen. Welche Münzen brauchst du?`,
      `Der Preis ist ${priceStr}. Wie kannst du passend bezahlen?`,
      `Bezahle ${priceStr} mit möglichst wenigen Münzen. Welche Kombination stimmt?`
    ];

    const question = contexts[Math.floor(Math.random() * contexts.length)];
    const options = this.shuffleArray([correctAnswer, ...wrongCombos.slice(0, 3)]);

    return {
      id: `money_pay_${price}`,
      type: 'money',
      subtype: 'pay_exact',
      question: question,
      contextQuestion: question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: Beginne mit den größten Münzen/Scheinen`,
      difficulty: this.difficulty,
      visualData: {
        type: 'money_pay',
        price
      }
    };
  }

  generatePrice() {
    if (this.difficulty === 'easy') {
      // Einfache Beträge: 1€ - 10€, nur 0 oder 50 Cent
      const euros = this.randomInt(1, 10);
      const cents = Math.random() > 0.5 ? 0 : 50;
      return euros * 100 + cents;
    } else {
      // Komplexere Beträge: 1€ - 20€, beliebige Cent (gerundet auf 5)
      const euros = this.randomInt(1, 20);
      const cents = this.randomInt(0, 19) * 5; // 0, 5, 10, ... 95
      return euros * 100 + cents;
    }
  }

  formatMoney(cents) {
    const euros = Math.floor(cents / 100);
    const centPart = cents % 100;

    if (centPart === 0) {
      return `${euros},00 Euro`;
    } else {
      return `${euros},${centPart.toString().padStart(2, '0')} Euro`;
    }
  }

  generateCoinCombo(cents) {
    const coins = [];
    let remaining = cents;

    const denominations = [
      { value: 2000, name: '20 Euro' },
      { value: 1000, name: '10 Euro' },
      { value: 500, name: '5 Euro' },
      { value: 200, name: '2 Euro' },
      { value: 100, name: '1 Euro' },
      { value: 50, name: '50 Cent' },
      { value: 20, name: '20 Cent' },
      { value: 10, name: '10 Cent' },
      { value: 5, name: '5 Cent' },
    ];

    for (const denom of denominations) {
      while (remaining >= denom.value) {
        coins.push(denom.name);
        remaining -= denom.value;
        if (coins.length >= 4) break; // Maximal 4 Münzen/Scheine anzeigen
      }
      if (remaining === 0 || coins.length >= 4) break;
    }

    return coins.length > 0 ? coins : ['1 Euro'];
  }

  getShopItems() {
    return [
      'eine Banane', 'eine Kokosnuss', 'ein Papageien-Futter',
      'eine Schatzkarte', 'ein Fernglas', 'eine Taschenlampe',
      'ein Kompass', 'eine Wasserflasche', 'ein Snack',
      'ein Notizbuch', 'ein Stift', 'eine Lupe'
    ];
  }

  generateWrongMoneyAnswers(correctCents) {
    const wrong = new Set();

    // Typische Fehler
    wrong.add(this.formatMoney(correctCents + 100));  // 1€ mehr
    wrong.add(this.formatMoney(correctCents - 100));  // 1€ weniger
    wrong.add(this.formatMoney(correctCents + 50));   // 50ct mehr
    wrong.add(this.formatMoney(correctCents - 50));   // 50ct weniger
    wrong.add(this.formatMoney(correctCents + 10));   // 10ct mehr

    const correctStr = this.formatMoney(correctCents);
    const filtered = [...wrong].filter(m => m !== correctStr && !m.includes('-'));
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
