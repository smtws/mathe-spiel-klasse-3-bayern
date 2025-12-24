export class ExplanationGenerator {
  constructor() {
    // Ermunternde Phrasen für richtige Antworten
    this.correctPhrases = [
      'Richtig!',
      'Super!',
      'Genau!',
      'Toll gemacht!',
      'Sehr gut!'
    ];

    // Sanfte Phrasen für falsche Antworten
    this.wrongPhrases = [
      'Das war leider nicht richtig.',
      'Knapp daneben.',
      'Nicht ganz.',
      'Leider falsch.'
    ];
  }

  // Zufällige Phrase auswählen
  getRandomPhrase(phrases) {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Hauptmethode: Erklärung generieren
  generate(question, userAnswer, isCorrect) {
    const { type, correctAnswer } = question;

    switch (type) {
      case 'multiplication':
        return this.generateMultiplicationExplanation(question, userAnswer, isCorrect);
      case 'addition':
        return this.generateAdditionExplanation(question, userAnswer, isCorrect);
      case 'subtraction':
        return this.generateSubtractionExplanation(question, userAnswer, isCorrect);
      case 'division':
        return this.generateDivisionExplanation(question, userAnswer, isCorrect);
      case 'geometry':
        return this.generateGeometryExplanation(question, userAnswer, isCorrect);
      case 'measurement':
        return this.generateMeasurementExplanation(question, userAnswer, isCorrect);
      case 'word_problem':
        return this.generateWordProblemExplanation(question, userAnswer, isCorrect);
      default:
        return this.generateDefaultExplanation(question, userAnswer, isCorrect);
    }
  }

  // Multiplikation: Mit passendem Rechenweg erklären
  generateMultiplicationExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer, visualData } = question;

    // Faktoren aus visualData extrahieren
    let a = visualData?.rows || visualData?.groups || 3;
    let b = visualData?.cols || visualData?.itemsPerGroup || 4;

    // Rechenweg generieren
    const steps = this.generateMultiplicationSteps(a, b, correctAnswer);

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} ${steps}`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} ${steps}`;
    }
  }

  // Schrittweisen Rechenweg für Multiplikation generieren
  generateMultiplicationSteps(a, b, result) {
    // Für sehr kleine Faktoren (beide ≤ 5): Wiederholte Addition
    if (a <= 5 && b <= 3) {
      const additionForm = Array(b).fill(a).join(' + ');
      return `${a} × ${b} = ${additionForm} = ${result}!`;
    }

    // × 10: Einfach eine 0 anhängen
    if (b === 10) {
      return `${a} × 10: Hänge eine 0 an ${a} an → ${result}!`;
    }
    if (a === 10) {
      return `10 × ${b}: Hänge eine 0 an ${b} an → ${result}!`;
    }

    // × 9: Nachbaraufgabe mit 10
    if (b === 9) {
      const mal10 = a * 10;
      return `${a} × 9: Rechne ${a} × 10 = ${mal10}, dann ${mal10} − ${a} = ${result}!`;
    }
    if (a === 9) {
      const mal10 = b * 10;
      return `9 × ${b}: Rechne 10 × ${b} = ${mal10}, dann ${mal10} − ${b} = ${result}!`;
    }

    // × 5: Die Hälfte von × 10
    if (b === 5 && a % 2 === 0) {
      const mal10 = a * 10;
      return `${a} × 5: Die Hälfte von ${a} × 10 = ${mal10} ÷ 2 = ${result}!`;
    }

    // × 4: Zweimal verdoppeln
    if (b === 4) {
      const doppelt = a * 2;
      return `${a} × 4: Verdopple ${a} × 2 = ${doppelt}, nochmal verdoppeln: ${doppelt} × 2 = ${result}!`;
    }
    if (a === 4) {
      const doppelt = b * 2;
      return `4 × ${b}: Verdopple ${b} × 2 = ${doppelt}, nochmal verdoppeln: ${doppelt} × 2 = ${result}!`;
    }

    // × 2: Einfach verdoppeln
    if (b === 2) {
      return `${a} × 2: Verdopple ${a} → ${a} + ${a} = ${result}!`;
    }
    if (a === 2) {
      return `2 × ${b}: Verdopple ${b} → ${b} + ${b} = ${result}!`;
    }

    // Größere Faktoren: Zerlegen (b > 10)
    if (b > 10) {
      const zehner = Math.floor(b / 10) * 10;
      const einer = b % 10;
      const teilA = a * zehner;
      const teilB = a * einer;
      if (einer === 0) {
        return `${a} × ${b}: Rechne ${a} × ${zehner} = ${result}!`;
      }
      return `${a} × ${b}: Zerlege in ${a} × ${zehner} = ${teilA} und ${a} × ${einer} = ${teilB}. Dann ${teilA} + ${teilB} = ${result}!`;
    }

    // Größere Faktoren: Zerlegen (a > 10)
    if (a > 10) {
      const zehner = Math.floor(a / 10) * 10;
      const einer = a % 10;
      const teilA = zehner * b;
      const teilB = einer * b;
      if (einer === 0) {
        return `${a} × ${b}: Rechne ${zehner} × ${b} = ${result}!`;
      }
      return `${a} × ${b}: Zerlege in ${zehner} × ${b} = ${teilA} und ${einer} × ${b} = ${teilB}. Dann ${teilA} + ${teilB} = ${result}!`;
    }

    // Fallback für mittlere Werte (6-8): Nachbaraufgabe oder einfache Aussage
    if (a <= 10 && b <= 10) {
      // Verwende eine einfachere Kernaufgabe
      if (b > a) {
        // Tausche für einfachere Darstellung
        return `${a} × ${b} = ${b} × ${a} = ${result}!`;
      }
    }

    // Einfacher Fallback
    return `${a} × ${b} = ${result}!`;
  }

  // Addition: Mit schrittweisem Rechenweg erklären
  generateAdditionExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer, visualData } = question;

    const first = visualData?.first || 0;
    const second = visualData?.second || 0;

    // Rechenweg generieren
    const steps = this.generateAdditionSteps(first, second, correctAnswer);

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} ${steps}`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} ${steps}`;
    }
  }

  // Schrittweisen Rechenweg für Addition generieren
  generateAdditionSteps(a, b, result) {
    // Für sehr kleine Zahlen: Einfaches Hochzählen
    if (b <= 5) {
      const countUp = [];
      for (let i = 1; i <= b; i++) {
        countUp.push(a + i);
      }
      return `${a} + ${b}: Zähle ${b} weiter: ${countUp.join(', ')}. Also ${a} + ${b} = ${result}!`;
    }

    // Für Zahlen mit Zehnerübergang
    const aEiner = a % 10;
    const bEiner = b % 10;

    // Prüfen, ob Zehnerübergang nötig ist
    if (aEiner + bEiner >= 10 && a < 100 && b < 100) {
      // Strategie: Erst zum nächsten Zehner auffüllen
      const bisZumZehner = 10 - aEiner;
      const naechsterZehner = a + bisZumZehner;
      const rest = b - bisZumZehner;

      if (bisZumZehner > 0 && bisZumZehner < b) {
        return `${a} + ${b}: Erst ${a} + ${bisZumZehner} = ${naechsterZehner}. Dann noch ${rest} dazu = ${result}!`;
      }
    }

    // Für größere Zahlen (≥100): Stellenweise rechnen
    if (a >= 100 || b >= 100) {
      return this.generateAdditionByPlace(a, b, result);
    }

    // Für mittlere Zahlen: Zehner und Einer getrennt
    if (b >= 10) {
      const bZehner = Math.floor(b / 10) * 10;
      const bEinerRest = b % 10;
      const mitZehner = a + bZehner;

      if (bEinerRest === 0) {
        return `${a} + ${b}: Addiere ${b} als Zehner dazu. ${a} + ${bZehner} = ${result}!`;
      } else {
        return `${a} + ${b}: Erst die Zehner: ${a} + ${bZehner} = ${mitZehner}. Dann die Einer: ${mitZehner} + ${bEinerRest} = ${result}!`;
      }
    }

    // Fallback: Einfache Erklärung
    return `${a} + ${b} = ${result}!`;
  }

  // Stellenweise Addition für große Zahlen
  generateAdditionByPlace(a, b, result) {
    const aH = Math.floor(a / 100);
    const aZ = Math.floor((a % 100) / 10);
    const aE = a % 10;

    const bH = Math.floor(b / 100);
    const bZ = Math.floor((b % 100) / 10);
    const bE = b % 10;

    const steps = [];

    // Schritt 1: Einer addieren
    const einerSumme = aE + bE;
    const einerUebertrag = Math.floor(einerSumme / 10);
    const einerErgebnis = einerSumme % 10;

    if (einerUebertrag > 0) {
      steps.push(`Einer: ${aE} + ${bE} = ${einerSumme}, schreibe ${einerErgebnis}, merke ${einerUebertrag}`);
    } else {
      steps.push(`Einer: ${aE} + ${bE} = ${einerErgebnis}`);
    }

    // Schritt 2: Zehner addieren
    const zehnerSumme = aZ + bZ + einerUebertrag;
    const zehnerUebertrag = Math.floor(zehnerSumme / 10);
    const zehnerErgebnis = zehnerSumme % 10;

    if (zehnerUebertrag > 0) {
      steps.push(`Zehner: ${aZ} + ${bZ}${einerUebertrag > 0 ? ' + ' + einerUebertrag : ''} = ${zehnerSumme}, schreibe ${zehnerErgebnis}, merke ${zehnerUebertrag}`);
    } else {
      steps.push(`Zehner: ${aZ} + ${bZ}${einerUebertrag > 0 ? ' + ' + einerUebertrag : ''} = ${zehnerErgebnis}`);
    }

    // Schritt 3: Hunderter addieren (falls vorhanden)
    if (aH > 0 || bH > 0 || zehnerUebertrag > 0) {
      const hunderterSumme = aH + bH + zehnerUebertrag;
      steps.push(`Hunderter: ${aH} + ${bH}${zehnerUebertrag > 0 ? ' + ' + zehnerUebertrag : ''} = ${hunderterSumme}`);
    }

    return `${a} + ${b}: ${steps.join('. ')}. Ergebnis: ${result}!`;
  }

  // Subtraktion: Mit schrittweisem Rechenweg erklären
  generateSubtractionExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer, visualData } = question;

    const start = visualData?.start || 0;
    const remove = visualData?.remove || 0;

    // Rechenweg generieren
    const steps = this.generateSubtractionSteps(start, remove, correctAnswer);

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} ${steps}`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} ${steps}`;
    }
  }

  // Schrittweisen Rechenweg für Subtraktion generieren
  generateSubtractionSteps(a, b, result) {
    // Für sehr kleine Zahlen: Einfaches Rückwärtszählen
    if (b <= 5) {
      const countDown = [];
      for (let i = 1; i <= b; i++) {
        countDown.push(a - i);
      }
      return `${a} − ${b}: Zähle ${b} zurück: ${countDown.join(', ')}. Also ${a} − ${b} = ${result}!`;
    }

    // Für Zahlen mit Zehnerunterschreitung
    const aEiner = a % 10;

    // Prüfen, ob Zehnerunterschreitung nötig ist
    if (aEiner < (b % 10) && b < a && a < 100 && b < 100) {
      // Strategie: Erst zum Zehner runter, dann den Rest
      const bisZumZehner = aEiner;
      const naechsterZehner = a - bisZumZehner;
      const rest = b - bisZumZehner;

      if (bisZumZehner > 0 && rest > 0) {
        return `${a} − ${b}: Erst ${a} − ${bisZumZehner} = ${naechsterZehner}. Dann noch ${rest} abziehen = ${result}!`;
      }
    }

    // Für größere Zahlen (≥100): Stellenweise rechnen
    if (a >= 100 || b >= 100) {
      return this.generateSubtractionByPlace(a, b, result);
    }

    // Für mittlere Zahlen: Zehner und Einer getrennt
    if (b >= 10) {
      const bZehner = Math.floor(b / 10) * 10;
      const bEinerRest = b % 10;
      const ohneZehner = a - bZehner;

      if (bEinerRest === 0) {
        return `${a} − ${b}: Ziehe ${b} als Zehner ab. ${a} − ${bZehner} = ${result}!`;
      } else {
        return `${a} − ${b}: Erst die Zehner: ${a} − ${bZehner} = ${ohneZehner}. Dann die Einer: ${ohneZehner} − ${bEinerRest} = ${result}!`;
      }
    }

    // Fallback: Einfache Erklärung
    return `${a} − ${b} = ${result}!`;
  }

  // Stellenweise Subtraktion für große Zahlen
  generateSubtractionByPlace(a, b, result) {
    const aH = Math.floor(a / 100);
    const aZ = Math.floor((a % 100) / 10);
    const aE = a % 10;

    const bH = Math.floor(b / 100);
    const bZ = Math.floor((b % 100) / 10);
    const bE = b % 10;

    const steps = [];

    // Arbeitskopien für Überträge
    let workAZ = aZ;
    let workAH = aH;

    // Schritt 1: Einer subtrahieren
    let einerErgebnis;
    let einerBorgen = false;

    if (aE >= bE) {
      einerErgebnis = aE - bE;
      steps.push(`Einer: ${aE} − ${bE} = ${einerErgebnis}`);
    } else {
      // Muss borgen
      einerBorgen = true;
      einerErgebnis = (aE + 10) - bE;
      workAZ = workAZ - 1;
      steps.push(`Einer: ${aE} − ${bE} geht nicht, borge 1 Zehner. ${aE + 10} − ${bE} = ${einerErgebnis}`);
    }

    // Schritt 2: Zehner subtrahieren
    let zehnerErgebnis;
    let zehnerBorgen = false;

    if (workAZ >= bZ) {
      zehnerErgebnis = workAZ - bZ;
      if (einerBorgen) {
        steps.push(`Zehner: ${aZ} − 1 (geborgt) = ${workAZ}, − ${bZ} = ${zehnerErgebnis}`);
      } else {
        steps.push(`Zehner: ${aZ} − ${bZ} = ${zehnerErgebnis}`);
      }
    } else {
      // Muss borgen
      zehnerBorgen = true;
      zehnerErgebnis = (workAZ + 10) - bZ;
      workAH = workAH - 1;
      if (einerBorgen) {
        steps.push(`Zehner: ${aZ} − 1 (geborgt) = ${workAZ}, − ${bZ} geht nicht, borge 1 Hunderter. ${workAZ + 10} − ${bZ} = ${zehnerErgebnis}`);
      } else {
        steps.push(`Zehner: ${aZ} − ${bZ} geht nicht, borge 1 Hunderter. ${workAZ + 10} − ${bZ} = ${zehnerErgebnis}`);
      }
    }

    // Schritt 3: Hunderter subtrahieren (falls vorhanden)
    if (aH > 0 || bH > 0) {
      const hunderterErgebnis = workAH - bH;
      if (zehnerBorgen) {
        steps.push(`Hunderter: ${aH} − 1 (geborgt) = ${workAH}, − ${bH} = ${hunderterErgebnis}`);
      } else {
        steps.push(`Hunderter: ${aH} − ${bH} = ${hunderterErgebnis}`);
      }
    }

    return `${a} − ${b}: ${steps.join('. ')}. Ergebnis: ${result}!`;
  }

  // Division: Als Umkehrung der Multiplikation erklären
  generateDivisionExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer, visualData } = question;

    const total = visualData?.total || 0;
    const groups = visualData?.groups || 1;

    // Probe: correctAnswer * groups = total
    const probeText = `weil ${correctAnswer} mal ${groups} gleich ${total} ist`;

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} ${total} geteilt durch ${groups} ist gleich ${correctAnswer}, ${probeText}!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} ${total} geteilt durch ${groups} ist nicht ${userAnswer}, sondern ${correctAnswer}, ${probeText}.`;
    }
  }

  // Geometrie: Je nach Untertyp erklären
  generateGeometryExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer, subtype, visualData } = question;

    // Je nach Geometrie-Untertyp verschiedene Erklärungen
    switch (subtype) {
      case 'shape_corners':
        return this.explainShapeCorners(correctAnswer, userAnswer, isCorrect, visualData);
      case 'shape_edges':
        return this.explainShapeEdges(correctAnswer, userAnswer, isCorrect, visualData);
      case 'shape_name':
        return this.explainShapeName(correctAnswer, userAnswer, isCorrect);
      case 'symmetry':
        return this.explainSymmetry(correctAnswer, userAnswer, isCorrect, visualData);
      case 'right_angles':
        return this.explainRightAngles(correctAnswer, userAnswer, isCorrect, visualData);
      case 'pattern':
        return this.explainPattern(correctAnswer, userAnswer, isCorrect);
      case 'area':
        return this.explainArea(correctAnswer, userAnswer, isCorrect, visualData);
      default:
        return this.generateDefaultExplanation(question, userAnswer, isCorrect);
    }
  }

  // Ecken-Erklärung
  explainShapeCorners(correctAnswer, userAnswer, isCorrect, visualData) {
    const shape = visualData?.shape || 'Form';
    const shapeNames = {
      dreieck: 'Dreieck', quadrat: 'Quadrat', rechteck: 'Rechteck',
      fuenfeck: 'Fünfeck', sechseck: 'Sechseck', raute: 'Raute', trapez: 'Trapez'
    };
    const shapeName = shapeNames[shape] || shape;

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} Ein ${shapeName} hat ${correctAnswer} Ecken!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} Ein ${shapeName} hat nicht ${userAnswer}, sondern ${correctAnswer} Ecken.`;
    }
  }

  // Kanten-Erklärung
  explainShapeEdges(correctAnswer, userAnswer, isCorrect, visualData) {
    const shape = visualData?.shape || 'Form';
    const shapeNames = {
      dreieck: 'Dreieck', quadrat: 'Quadrat', rechteck: 'Rechteck',
      fuenfeck: 'Fünfeck', sechseck: 'Sechseck', raute: 'Raute', trapez: 'Trapez'
    };
    const shapeName = shapeNames[shape] || shape;

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} Ein ${shapeName} hat ${correctAnswer} Seiten!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} Ein ${shapeName} hat nicht ${userAnswer}, sondern ${correctAnswer} Seiten.`;
    }
  }

  // Formenname-Erklärung
  explainShapeName(correctAnswer, userAnswer, isCorrect) {
    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} Das ist ein ${correctAnswer}!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} Das ist kein ${userAnswer}, sondern ein ${correctAnswer}.`;
    }
  }

  // Symmetrie-Erklärung
  explainSymmetry(correctAnswer, userAnswer, isCorrect, visualData) {
    const shape = visualData?.shape || 'Form';

    if (isCorrect) {
      if (correctAnswer === 'unendlich viele') {
        return `${this.getRandomPhrase(this.correctPhrases)} Ein Kreis hat unendlich viele Symmetrieachsen, weil er überall gleich ist!`;
      }
      return `${this.getRandomPhrase(this.correctPhrases)} Ein ${shape} hat ${correctAnswer} Symmetrieachsen!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} Ein ${shape} hat nicht ${userAnswer}, sondern ${correctAnswer} Symmetrieachsen.`;
    }
  }

  // Rechte Winkel-Erklärung
  explainRightAngles(correctAnswer, userAnswer, isCorrect, visualData) {
    const shape = visualData?.shape || 'Form';

    if (isCorrect) {
      if (correctAnswer === 0) {
        return `${this.getRandomPhrase(this.correctPhrases)} Ein ${shape} hat keinen rechten Winkel!`;
      }
      return `${this.getRandomPhrase(this.correctPhrases)} Ein ${shape} hat ${correctAnswer} rechte Winkel!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} Ein ${shape} hat nicht ${userAnswer}, sondern ${correctAnswer} rechte Winkel.`;
    }
  }

  // Muster-Erklärung
  explainPattern(correctAnswer, userAnswer, isCorrect) {
    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} Das Muster wird mit ${correctAnswer} fortgesetzt!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} Das nächste Symbol im Muster ist nicht ${userAnswer}, sondern ${correctAnswer}.`;
    }
  }

  // Flächen-Erklärung
  explainArea(correctAnswer, userAnswer, isCorrect, visualData) {
    const width = visualData?.width || 0;
    const height = visualData?.height || 0;

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} ${width} mal ${height} ist gleich ${correctAnswer} Felder!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} ${width} mal ${height} ist nicht ${userAnswer}, sondern ${correctAnswer} Felder.`;
    }
  }

  // Größen & Messen Erklärungen
  generateMeasurementExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer, subtype, visualData } = question;

    // Umrechnungsfaktoren
    const conversions = {
      'weight_kg_to_g': { factor: 1000, from: 'kg', to: 'g', text: '1 kg ist gleich 1000 g' },
      'weight_g_to_kg': { factor: 1000, from: 'g', to: 'kg', text: '1000 g ist gleich 1 kg' },
      'volume_l_to_ml': { factor: 1000, from: 'Liter', to: 'ml', text: '1 Liter ist gleich 1000 ml' },
      'volume_ml_to_l': { factor: 1000, from: 'ml', to: 'Liter', text: '1000 ml ist gleich 1 Liter' },
      'length_km_to_m': { factor: 1000, from: 'km', to: 'm', text: '1 km ist gleich 1000 m' },
      'length_m_to_cm': { factor: 100, from: 'm', to: 'cm', text: '1 m ist gleich 100 cm' },
      'length_cm_to_m': { factor: 100, from: 'cm', to: 'm', text: '100 cm ist gleich 1 m' },
      'time_h_to_min': { factor: 60, from: 'Stunde', to: 'Minuten', text: '1 Stunde ist gleich 60 Minuten' },
      'money_euro_to_cent': { factor: 100, from: 'Euro', to: 'Cent', text: '1 Euro ist gleich 100 Cent' }
    };

    const conv = conversions[subtype];

    if (conv) {
      if (isCorrect) {
        return `${this.getRandomPhrase(this.correctPhrases)} ${conv.text}, also ist die Antwort ${correctAnswer} ${conv.to}!`;
      } else {
        return `${this.getRandomPhrase(this.wrongPhrases)} ${conv.text}. Die richtige Antwort ist ${correctAnswer} ${conv.to}, nicht ${userAnswer}.`;
      }
    }

    // Spezielle Fälle
    if (subtype === 'weight_addition' || subtype === 'money_addition') {
      if (isCorrect) {
        return `${this.getRandomPhrase(this.correctPhrases)} Erst umrechnen, dann addieren ergibt ${correctAnswer}!`;
      } else {
        return `${this.getRandomPhrase(this.wrongPhrases)} Die richtige Summe ist ${correctAnswer}, nicht ${userAnswer}.`;
      }
    }

    if (subtype === 'time_span') {
      const start = visualData?.start || 0;
      const end = visualData?.end || 0;
      if (isCorrect) {
        return `${this.getRandomPhrase(this.correctPhrases)} Von ${start} Uhr bis ${end} Uhr sind ${correctAnswer} Stunden!`;
      } else {
        return `${this.getRandomPhrase(this.wrongPhrases)} ${end} minus ${start} ist gleich ${correctAnswer} Stunden, nicht ${userAnswer}.`;
      }
    }

    // Fallback
    return this.generateDefaultExplanation(question, userAnswer, isCorrect);
  }

  // Textaufgaben (Sachaufgaben) Erklärungen
  generateWordProblemExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer, hint, unit } = question;

    // Nutze den Hinweis als Erklärung
    const hintText = hint || '';

    if (isCorrect) {
      if (hintText) {
        return `${this.getRandomPhrase(this.correctPhrases)} ${hintText} ${correctAnswer} ${unit || ''}!`;
      }
      return `${this.getRandomPhrase(this.correctPhrases)} Die richtige Antwort ist ${correctAnswer} ${unit || ''}!`;
    } else {
      if (hintText) {
        return `${this.getRandomPhrase(this.wrongPhrases)} ${hintText} ${correctAnswer} ${unit || ''}, nicht ${userAnswer}.`;
      }
      return `${this.getRandomPhrase(this.wrongPhrases)} Die richtige Antwort ist ${correctAnswer} ${unit || ''}, nicht ${userAnswer}.`;
    }
  }

  // Fallback für unbekannte Typen
  generateDefaultExplanation(question, userAnswer, isCorrect) {
    const { correctAnswer } = question;

    if (isCorrect) {
      return `${this.getRandomPhrase(this.correctPhrases)} Die richtige Antwort ist ${correctAnswer}!`;
    } else {
      return `${this.getRandomPhrase(this.wrongPhrases)} Die richtige Antwort ist nicht ${userAnswer}, sondern ${correctAnswer}.`;
    }
  }

  // Kontextfrage für Vorlesefunktion aufbereiten
  prepareQuestionForSpeech(question) {
    let text = question.contextQuestion || question.question;

    // Mathematische Symbole durch Wörter ersetzen
    text = text.replace(/×/g, ' mal ');
    text = text.replace(/\+/g, ' plus ');
    text = text.replace(/-/g, ' minus ');
    text = text.replace(/÷/g, ' geteilt durch ');
    text = text.replace(/=/g, ' ist gleich ');

    // Doppelte Leerzeichen entfernen
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }
}
