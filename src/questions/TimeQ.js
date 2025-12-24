/**
 * TimeQ - Fragen zu Uhrzeiten und Zeitspannen
 * Bayerischer Lehrplan 3. Klasse: Zeiteinheiten (Sekunden, Minuten, Stunden, Tage)
 */
export class TimeQ {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
  }

  generate() {
    const questionTypes = [
      'read_clock',      // Uhrzeit ablesen
      'time_duration',   // Zeitspanne berechnen
      'time_addition',   // Zeit addieren
      'convert_units',   // Einheiten umrechnen
    ];

    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    switch (type) {
      case 'read_clock':
        return this.generateClockReading();
      case 'time_duration':
        return this.generateTimeDuration();
      case 'time_addition':
        return this.generateTimeAddition();
      case 'convert_units':
        return this.generateUnitConversion();
      default:
        return this.generateClockReading();
    }
  }

  generateClockReading() {
    // Generiere eine Uhrzeit
    const hour = this.randomInt(1, 12);
    const minuteOptions = this.difficulty === 'easy'
      ? [0, 15, 30, 45]
      : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const minute = minuteOptions[Math.floor(Math.random() * minuteOptions.length)];

    const timeString = this.formatTime(hour, minute);
    const contexts = this.getClockContexts(hour, minute);
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    // Generiere falsche Antworten
    const wrongAnswers = this.generateWrongTimeAnswers(hour, minute);
    const options = this.shuffleArray([timeString, ...wrongAnswers]);

    return {
      id: `time_clock_${hour}_${minute}`,
      type: 'time',
      subtype: 'read_clock',
      question: context.question,
      contextQuestion: context.question,
      correctAnswer: timeString,
      options: options,
      hint: this.getClockHint(hour, minute),
      difficulty: this.difficulty,
      visualData: {
        type: 'clock',
        hour: hour,
        minute: minute
      }
    };
  }

  generateTimeDuration() {
    // Einfache Zeitspannen für 3. Klasse
    const startHour = this.randomInt(8, 16);
    const startMinute = this.difficulty === 'easy' ? 0 : this.randomInt(0, 3) * 15;

    const durationMinutes = this.difficulty === 'easy'
      ? this.randomInt(1, 4) * 30  // 30, 60, 90, 120 Minuten
      : this.randomInt(1, 8) * 15; // 15, 30, 45, ... Minuten

    const endMinutes = startHour * 60 + startMinute + durationMinutes;
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMinute = endMinutes % 60;

    const startTime = this.formatTime(startHour, startMinute);
    const endTime = this.formatTime(endHour, endMinute);

    const durationString = this.formatDuration(durationMinutes);

    const contexts = [
      `Die Dschungel-Expedition startet um ${startTime} Uhr und endet um ${endTime} Uhr. Wie lange dauert sie?`,
      `Der Papagei singt von ${startTime} Uhr bis ${endTime} Uhr. Wie lange singt er?`,
      `Die Bootsfahrt beginnt um ${startTime} Uhr und endet um ${endTime} Uhr. Wie lange dauert die Fahrt?`,
      `Du wanderst von ${startTime} Uhr bis ${endTime} Uhr durch den Dschungel. Wie lange bist du unterwegs?`
    ];

    const question = contexts[Math.floor(Math.random() * contexts.length)];
    const wrongAnswers = this.generateWrongDurationAnswers(durationMinutes);
    const options = this.shuffleArray([durationString, ...wrongAnswers]);

    return {
      id: `time_duration_${startHour}_${startMinute}_${durationMinutes}`,
      type: 'time',
      subtype: 'duration',
      question: question,
      contextQuestion: question,
      correctAnswer: durationString,
      options: options,
      hint: `Tipp: Zähle die Stunden und Minuten von ${startTime} bis ${endTime}`,
      difficulty: this.difficulty,
      visualData: {
        type: 'duration',
        startHour, startMinute, endHour, endMinute
      }
    };
  }

  generateTimeAddition() {
    const startHour = this.randomInt(8, 14);
    const startMinute = this.difficulty === 'easy' ? 0 : this.randomInt(0, 2) * 15;

    const addMinutes = this.difficulty === 'easy'
      ? this.randomInt(1, 3) * 30
      : this.randomInt(1, 6) * 15;

    const resultMinutes = startHour * 60 + startMinute + addMinutes;
    const resultHour = Math.floor(resultMinutes / 60) % 24;
    const resultMinute = resultMinutes % 60;

    const startTime = this.formatTime(startHour, startMinute);
    const resultTime = this.formatTime(resultHour, resultMinute);
    const addString = this.formatDuration(addMinutes);

    const contexts = [
      `Es ist ${startTime} Uhr. In ${addString} beginnt die Schatzsuche. Wann beginnt sie?`,
      `Der Affe wacht um ${startTime} Uhr auf. Nach ${addString} frisst er Bananen. Um wie viel Uhr?`,
      `Jetzt ist es ${startTime} Uhr. Die Fähre fährt in ${addString}. Wann fährt sie ab?`
    ];

    const question = contexts[Math.floor(Math.random() * contexts.length)];
    const wrongAnswers = this.generateWrongTimeAnswers(resultHour, resultMinute);
    const options = this.shuffleArray([resultTime, ...wrongAnswers]);

    return {
      id: `time_add_${startHour}_${startMinute}_${addMinutes}`,
      type: 'time',
      subtype: 'addition',
      question: question,
      contextQuestion: question,
      correctAnswer: resultTime,
      options: options,
      hint: `Tipp: Addiere ${addString} zu ${startTime} Uhr`,
      difficulty: this.difficulty,
      visualData: {
        type: 'time_calc',
        startHour, startMinute, addMinutes
      }
    };
  }

  generateUnitConversion() {
    const conversions = [
      { from: 'Stunden', to: 'Minuten', factor: 60, maxValue: 3 },
      { from: 'Minuten', to: 'Sekunden', factor: 60, maxValue: 5 },
      { from: 'Tage', to: 'Stunden', factor: 24, maxValue: 3 },
    ];

    const conv = conversions[Math.floor(Math.random() * conversions.length)];
    const value = this.randomInt(1, conv.maxValue);
    const result = value * conv.factor;

    const contexts = [
      `Die Expedition dauert ${value} ${conv.from}. Wie viele ${conv.to} sind das?`,
      `Der Forscher beobachtet die Tiere ${value} ${conv.from} lang. Wie viele ${conv.to} sind das?`,
      `Die Reise durch den Dschungel dauert ${value} ${conv.from}. Rechne in ${conv.to} um.`
    ];

    const question = contexts[Math.floor(Math.random() * contexts.length)];
    const unit = conv.to;
    const correctAnswer = `${result} ${unit}`;

    const wrongAnswers = [
      `${result + conv.factor} ${unit}`,
      `${result - conv.factor} ${unit}`,
      `${value * 10} ${unit}`,
    ].filter(a => !a.startsWith('-') && !a.startsWith('0 '));

    const options = this.shuffleArray([correctAnswer, ...wrongAnswers.slice(0, 3)]);

    return {
      id: `time_convert_${conv.from}_${value}`,
      type: 'time',
      subtype: 'conversion',
      question: question,
      contextQuestion: question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: 1 ${conv.from.slice(0, -1)} = ${conv.factor} ${conv.to}`,
      difficulty: this.difficulty,
      visualData: {
        type: 'conversion',
        fromUnit: conv.from,
        toUnit: conv.to,
        value: value
      }
    };
  }

  getClockContexts(hour, minute) {
    const timeStr = this.formatTime(hour, minute);
    return [
      { question: `Die Expedition startet, wenn die Uhr ${timeStr} Uhr zeigt. Welche Uhrzeit ist das?` },
      { question: `Der Papagei ruft jeden Tag um diese Zeit. Wie spät ist es auf der Uhr?` },
      { question: `Schau auf die Uhr! Welche Uhrzeit zeigt sie an?` },
      { question: `Um diese Uhrzeit öffnet der Dschungel-Markt. Wie spät ist es?` }
    ];
  }

  formatTime(hour, minute) {
    const h = hour.toString();
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} Minuten`;
    } else if (minutes % 60 === 0) {
      const hours = minutes / 60;
      return hours === 1 ? '1 Stunde' : `${hours} Stunden`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const hourStr = hours === 1 ? '1 Stunde' : `${hours} Stunden`;
      return `${hourStr} und ${mins} Minuten`;
    }
  }

  getClockHint(hour, minute) {
    if (minute === 0) {
      return `Tipp: Der große Zeiger steht auf der 12, der kleine auf der ${hour}`;
    } else if (minute === 30) {
      return `Tipp: Der große Zeiger steht auf der 6 (halb), der kleine zwischen ${hour} und ${hour + 1}`;
    } else if (minute === 15) {
      return `Tipp: Der große Zeiger steht auf der 3 (viertel nach)`;
    } else if (minute === 45) {
      return `Tipp: Der große Zeiger steht auf der 9 (viertel vor)`;
    }
    return `Tipp: Zähle die Minuten-Striche ab der 12`;
  }

  generateWrongTimeAnswers(hour, minute) {
    const wrong = new Set();

    // Stunde verwechselt
    wrong.add(this.formatTime((hour % 12) + 1, minute));
    wrong.add(this.formatTime(hour === 1 ? 12 : hour - 1, minute));

    // Minuten verwechselt
    if (minute >= 15) wrong.add(this.formatTime(hour, minute - 15));
    if (minute <= 45) wrong.add(this.formatTime(hour, minute + 15));

    // Großer/kleiner Zeiger verwechselt
    if (minute <= 12) wrong.add(this.formatTime(minute === 0 ? 12 : minute, hour * 5 % 60));

    const filtered = [...wrong].filter(t => t !== this.formatTime(hour, minute));
    return this.shuffleArray(filtered).slice(0, 3);
  }

  generateWrongDurationAnswers(correctMinutes) {
    const wrong = new Set();

    wrong.add(this.formatDuration(correctMinutes + 30));
    wrong.add(this.formatDuration(correctMinutes - 30));
    wrong.add(this.formatDuration(correctMinutes + 60));
    if (correctMinutes > 60) wrong.add(this.formatDuration(correctMinutes - 60));

    const correctStr = this.formatDuration(correctMinutes);
    const filtered = [...wrong].filter(d => d !== correctStr && !d.includes('-'));
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
