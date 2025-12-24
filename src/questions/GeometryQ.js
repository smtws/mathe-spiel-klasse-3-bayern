export class GeometryQ {
  constructor(difficulty = 'normal') {
    this.difficulty = difficulty;
  }

  generate() {
    // Verschiedene Geometrie-Fragetypen
    const types = [
      'shape_corners',      // Ecken zählen
      'shape_edges',        // Kanten zählen
      'shape_name',         // Form erkennen
      'symmetry',           // Achsensymmetrie
      'right_angles',       // Rechte Winkel zählen
      'pattern_continue',   // Muster fortsetzen
      'area_count',         // Fläche zählen (Kästchen)
      'body_3d',            // 3D-Körper erkennen
      'body_faces',         // Flächen von 3D-Körpern
      'body_edges_3d'       // Kanten von 3D-Körpern
    ];

    const typeIndex = Math.floor(Math.random() * types.length);
    const type = types[typeIndex];

    switch (type) {
      case 'shape_corners':
        return this.generateShapeCornersQuestion();
      case 'shape_edges':
        return this.generateShapeEdgesQuestion();
      case 'shape_name':
        return this.generateShapeNameQuestion();
      case 'symmetry':
        return this.generateSymmetryQuestion();
      case 'right_angles':
        return this.generateRightAnglesQuestion();
      case 'pattern_continue':
        return this.generatePatternQuestion();
      case 'area_count':
        return this.generateAreaQuestion();
      case 'body_3d':
        return this.generateBody3DQuestion();
      case 'body_faces':
        return this.generateBodyFacesQuestion();
      case 'body_edges_3d':
        return this.generateBodyEdges3DQuestion();
      default:
        return this.generateShapeCornersQuestion();
    }
  }

  // Formen-Datenbank mit grammatischen Artikeln und Kompositaformen
  getShapes() {
    return {
      dreieck: { name: 'Dreieck', article: 'ein', compound: 'dreieck', corners: 3, edges: 3, rightAngles: 0 },
      quadrat: { name: 'Quadrat', article: 'ein', compound: 'quadrat', corners: 4, edges: 4, rightAngles: 4 },
      rechteck: { name: 'Rechteck', article: 'ein', compound: 'rechteck', corners: 4, edges: 4, rightAngles: 4 },
      fuenfeck: { name: 'Fünfeck', article: 'ein', compound: 'fünfeck', corners: 5, edges: 5, rightAngles: 0 },
      sechseck: { name: 'Sechseck', article: 'ein', compound: 'sechseck', corners: 6, edges: 6, rightAngles: 0 },
      siebeneck: { name: 'Siebeneck', article: 'ein', compound: 'siebeneck', corners: 7, edges: 7, rightAngles: 0 },
      achteck: { name: 'Achteck', article: 'ein', compound: 'achteck', corners: 8, edges: 8, rightAngles: 0 },
      kreis: { name: 'Kreis', article: 'ein', compound: 'kreis', corners: 0, edges: 0, rightAngles: 0 },
      raute: { name: 'Raute', article: 'eine', compound: 'rauten', corners: 4, edges: 4, rightAngles: 0 },
      trapez: { name: 'Trapez', article: 'ein', compound: 'trapez', corners: 4, edges: 4, rightAngles: 0 },
      parallelogramm: { name: 'Parallelogramm', article: 'ein', compound: 'parallelogramm', corners: 4, edges: 4, rightAngles: 0 }
    };
  }

  // Ecken zählen
  generateShapeCornersQuestion() {
    const shapes = this.getShapes();
    const shapeKeys = Object.keys(shapes).filter(k => shapes[k].corners > 0);
    const shapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const shape = shapes[shapeKey];

    const contexts = [
      {
        question: `Der alte Tempel hat ${shape.article} ${shape.name} als Grundriss. Wie viele Ecken hat ${shape.article} ${shape.name}?`,
        icon: 'temple'
      },
      {
        question: `Du findest einen ${shape.compound}förmigen Stein. Wie viele Ecken hat er?`,
        icon: 'stone'
      },
      {
        question: `Die Schatzkarte zeigt ${shape.article} ${shape.name}. Wie viele Ecken musst du abgehen?`,
        icon: 'map'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const correctAnswer = shape.corners;
    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 0, 8);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `geo_corners_${shapeKey}`,
      type: 'geometry',
      subtype: 'shape_corners',
      question: `Wie viele Ecken hat ${shape.article} ${shape.name}?`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: Zähle die Punkte, wo sich zwei Seiten treffen.`,
      difficulty: this.difficulty,
      visualData: {
        shape: shapeKey,
        property: 'corners',
        icon: context.icon
      }
    };
  }

  // Kanten zählen
  generateShapeEdgesQuestion() {
    const shapes = this.getShapes();
    const shapeKeys = Object.keys(shapes).filter(k => shapes[k].edges > 0);
    const shapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const shape = shapes[shapeKey];

    const contexts = [
      {
        question: `Ein ${shape.compound}förmiges Fenster im Tempel. Wie viele Seiten (Kanten) hat es?`,
        icon: 'window'
      },
      {
        question: `Du musst ${shape.article} ${shape.name} aus Lianen bauen. Wie viele Lianen brauchst du für die Seiten?`,
        icon: 'liana'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const correctAnswer = shape.edges;
    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 1, 8);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `geo_edges_${shapeKey}`,
      type: 'geometry',
      subtype: 'shape_edges',
      question: `Wie viele Seiten hat ${shape.article} ${shape.name}?`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: Zähle die geraden Linien, die die Form begrenzen.`,
      difficulty: this.difficulty,
      visualData: {
        shape: shapeKey,
        property: 'edges',
        icon: context.icon
      }
    };
  }

  // Form erkennen
  generateShapeNameQuestion() {
    const shapeDescriptions = [
      { answer: 'Quadrat', description: 'vier gleich lange Seiten und vier rechte Winkel' },
      { answer: 'Rechteck', description: 'vier Seiten, gegenüberliegende Seiten gleich lang, vier rechte Winkel' },
      { answer: 'Dreieck', description: 'drei Ecken und drei Seiten' },
      { answer: 'Kreis', description: 'keine Ecken und ist überall gleich rund' },
      { answer: 'Sechseck', description: 'sechs Ecken und sechs Seiten' }
    ];

    const selected = shapeDescriptions[Math.floor(Math.random() * shapeDescriptions.length)];

    const contexts = [
      {
        question: `Der Papagei beschreibt einen Stein: "Er hat ${selected.description}." Welche Form ist das?`,
        icon: 'parrot'
      },
      {
        question: `Das Rätsel lautet: "Ich habe ${selected.description}." Was bin ich?`,
        icon: 'riddle'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const allShapes = ['Dreieck', 'Quadrat', 'Rechteck', 'Kreis', 'Sechseck', 'Fünfeck'];
    const wrongAnswers = allShapes.filter(s => s !== selected.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = this.shuffleArray([selected.answer, ...wrongAnswers]);

    return {
      id: `geo_name_${selected.answer}`,
      type: 'geometry',
      subtype: 'shape_name',
      question: `Welche Form hat ${selected.description}?`,
      contextQuestion: context.question,
      correctAnswer: selected.answer,
      options: options,
      hint: `Tipp: Überlege, wie viele Ecken die Form hat.`,
      difficulty: this.difficulty,
      visualData: {
        description: selected.description,
        icon: context.icon
      }
    };
  }

  // Symmetrie
  generateSymmetryQuestion() {
    const symmetryShapes = [
      { name: 'Quadrat', article: 'ein', axes: 4 },
      { name: 'Rechteck', article: 'ein', axes: 2 },
      { name: 'gleichseitiges Dreieck', article: 'ein', axes: 3 },
      { name: 'Kreis', article: 'ein', axes: 'unendlich viele' },
      { name: 'Herz', article: 'ein', axes: 1 }
    ];

    const selected = symmetryShapes[Math.floor(Math.random() * symmetryShapes.length)];
    const isNumeric = typeof selected.axes === 'number';

    const contexts = [
      {
        question: `Der magische Spiegelteich zeigt ${selected.article} ${selected.name}. Wie viele Spiegelachsen hat es?`,
        icon: 'mirror'
      },
      {
        question: `Wie oft kannst du ${selected.article} ${selected.name} falten, sodass beide Hälften genau übereinander liegen?`,
        icon: 'fold'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    if (isNumeric) {
      const correctAnswer = selected.axes;
      const wrongAnswers = this.generateWrongNumbers(correctAnswer, 0, 6);
      const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

      return {
        id: `geo_symmetry_${selected.name}`,
        type: 'geometry',
        subtype: 'symmetry',
        question: `Wie viele Symmetrieachsen hat ${selected.article} ${selected.name}?`,
        contextQuestion: context.question,
        correctAnswer: correctAnswer,
        options: options,
        hint: `Tipp: Stell dir vor, du faltest die Form in der Mitte. Bei wie vielen Faltungen passen die Hälften genau aufeinander?`,
        difficulty: this.difficulty,
        visualData: {
          shape: selected.name,
          icon: context.icon
        }
      };
    } else {
      // Für Kreis - spezielle Frage
      const options = ['0', '1', '4', 'unendlich viele'];
      return {
        id: `geo_symmetry_kreis`,
        type: 'geometry',
        subtype: 'symmetry',
        question: `Wie viele Symmetrieachsen hat ein Kreis?`,
        contextQuestion: context.question,
        correctAnswer: 'unendlich viele',
        options: this.shuffleArray(options),
        hint: `Tipp: Ein Kreis ist in jeder Richtung gleich. Du kannst ihn überall in der Mitte falten!`,
        difficulty: this.difficulty,
        visualData: {
          shape: 'kreis',
          icon: context.icon
        }
      };
    }
  }

  // Rechte Winkel zählen
  generateRightAnglesQuestion() {
    const angledShapes = [
      { name: 'Quadrat', article: 'ein', rightAngles: 4 },
      { name: 'Rechteck', article: 'ein', rightAngles: 4 },
      { name: 'gleichseitiges Dreieck', article: 'ein', rightAngles: 0 },
      { name: 'rechtwinkliges Dreieck', article: 'ein', rightAngles: 1 },
      { name: 'Raute', article: 'eine', rightAngles: 0 },
      { name: 'Parallelogramm', article: 'ein', rightAngles: 0 }
    ];

    const selected = angledShapes[Math.floor(Math.random() * angledShapes.length)];

    // Genitiv-Form: "eines Quadrats" vs "einer Raute"
    const genArticle = selected.article === 'eine' ? 'einer' : 'eines';
    const datArticle = selected.article === 'eine' ? 'einer' : 'einem';

    const contexts = [
      {
        question: `Die Fallentür im Tempel hat die Form ${genArticle} ${selected.name}${selected.article === 'ein' ? 's' : ''}. Wie viele rechte Winkel hat sie?`,
        icon: 'door'
      },
      {
        question: `Du musst an ${datArticle} ${selected.name} vorbei. Wie viele Ecken sind rechte Winkel (90°)?`,
        icon: 'corner'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const correctAnswer = selected.rightAngles;
    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 0, 5);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `geo_rightangles_${selected.name}`,
      type: 'geometry',
      subtype: 'right_angles',
      question: `Wie viele rechte Winkel hat ${selected.article} ${selected.name}?`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: Ein rechter Winkel ist wie die Ecke eines Blattes Papier (90°).`,
      difficulty: this.difficulty,
      visualData: {
        shape: selected.name,
        property: 'rightAngles',
        icon: context.icon
      }
    };
  }

  // Muster fortsetzen
  generatePatternQuestion() {
    const patterns = [
      { sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], next: '🔵', name: 'rot-blau' },
      { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], next: '🌙', name: 'Stern-Mond' },
      { sequence: ['△', '○', '□', '△', '○'], next: '□', name: 'Dreieck-Kreis-Quadrat' },
      { sequence: ['🟢', '🟢', '🟡', '🟢', '🟢'], next: '🟡', name: 'grün-gelb' },
      { sequence: ['▲', '▼', '▲', '▼', '▲'], next: '▼', name: 'auf-ab' },
      { sequence: ['🔵', '🔵', '🔴', '🔵', '🔵'], next: '🔴', name: 'blau-rot' },
      { sequence: ['◆', '◇', '◆', '◇', '◆'], next: '◇', name: 'voll-leer' },
      { sequence: ['🟠', '🟡', '🟢', '🟠', '🟡'], next: '🟢', name: 'orange-gelb-grün' },
      { sequence: ['□', '□', '■', '□', '□'], next: '■', name: 'leer-voll-Quadrat' },
      { sequence: ['🌸', '🌺', '🌸', '🌺', '🌸'], next: '🌺', name: 'Blumen' },
      { sequence: ['➡️', '⬆️', '⬅️', '⬇️', '➡️'], next: '⬆️', name: 'Richtungen' },
      { sequence: ['🔶', '🔷', '🔶', '🔷', '🔶'], next: '🔷', name: 'orange-blau-Raute' },
      { sequence: ['●', '○', '●', '○', '●'], next: '○', name: 'Kreise' },
      { sequence: ['🟣', '🟣', '🟣', '⚪', '🟣'], next: '🟣', name: 'lila-weiß' }
    ];

    const selected = patterns[Math.floor(Math.random() * patterns.length)];

    const sequenceStr = selected.sequence.join(' ');

    const contexts = [
      {
        question: `Das Mosaik im Tempel zeigt: ${sequenceStr} ... Welches Symbol kommt als nächstes?`,
        icon: 'mosaic'
      },
      {
        question: `Die Papagei-Federn bilden ein Muster: ${sequenceStr} ... Was folgt?`,
        icon: 'feather'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    // Falsche Antworten aus anderen Symbolen
    const allSymbols = ['🔴', '🔵', '⭐', '🌙', '△', '○', '□', '🟢', '🟡', '▲', '▼'];
    const wrongAnswers = allSymbols
      .filter(s => s !== selected.next && !selected.sequence.includes(s) || s !== selected.next)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = this.shuffleArray([selected.next, ...wrongAnswers.slice(0, 3)]);

    return {
      id: `geo_pattern_${selected.name}`,
      type: 'geometry',
      subtype: 'pattern',
      question: `${sequenceStr} ... ?`,
      contextQuestion: context.question,
      correctAnswer: selected.next,
      options: options,
      hint: `Tipp: Schau dir das Muster genau an. Welche Symbole wiederholen sich?`,
      difficulty: this.difficulty,
      visualData: {
        pattern: selected.sequence,
        icon: context.icon
      }
    };
  }

  // Fläche zählen (Kästchen)
  generateAreaQuestion() {
    // Einfache Flächen als Kästchenzahl - viel mehr Varianten
    const areas = [
      { width: 2, height: 2, area: 4 },
      { width: 2, height: 3, area: 6 },
      { width: 2, height: 4, area: 8 },
      { width: 2, height: 5, area: 10 },
      { width: 2, height: 6, area: 12 },
      { width: 3, height: 3, area: 9 },
      { width: 3, height: 4, area: 12 },
      { width: 3, height: 5, area: 15 },
      { width: 3, height: 6, area: 18 },
      { width: 4, height: 2, area: 8 },
      { width: 4, height: 4, area: 16 },
      { width: 4, height: 5, area: 20 },
      { width: 5, height: 2, area: 10 },
      { width: 5, height: 3, area: 15 },
      { width: 5, height: 5, area: 25 },
      { width: 6, height: 2, area: 12 },
      { width: 6, height: 3, area: 18 },
      { width: 6, height: 4, area: 24 },
      { width: 7, height: 2, area: 14 },
      { width: 7, height: 3, area: 21 },
      { width: 8, height: 2, area: 16 },
      { width: 8, height: 3, area: 24 },
      { width: 9, height: 2, area: 18 },
      { width: 10, height: 2, area: 20 }
    ];

    const selected = areas[Math.floor(Math.random() * areas.length)];

    const contexts = [
      {
        question: `Der Tempelraum ist ${selected.width} Felder breit und ${selected.height} Felder lang. Wie viele Bodenplatten sind es insgesamt?`,
        icon: 'floor'
      },
      {
        question: `Dein Lager hat ${selected.width} × ${selected.height} Schlafplätze. Wie viele Schlafplätze sind das?`,
        icon: 'camp'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const correctAnswer = selected.area;
    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 4, 20);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `geo_area_${selected.width}x${selected.height}`,
      type: 'geometry',
      subtype: 'area',
      question: `${selected.width} × ${selected.height} = ?`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: Multipliziere Länge mal Breite, oder zähle alle Kästchen.`,
      difficulty: this.difficulty,
      visualData: {
        width: selected.width,
        height: selected.height,
        icon: context.icon
      }
    };
  }

  // 3D-Körper Datenbank
  getBodies3D() {
    return {
      wuerfel: { name: 'Würfel', article: 'ein', faces: 6, edges: 12, corners: 8, description: 'alle Seiten sind gleich große Quadrate' },
      quader: { name: 'Quader', article: 'ein', faces: 6, edges: 12, corners: 8, description: 'hat rechteckige Seiten, wie eine Schachtel' },
      kugel: { name: 'Kugel', article: 'eine', faces: 1, edges: 0, corners: 0, description: 'ist überall rund, wie ein Ball' },
      zylinder: { name: 'Zylinder', article: 'ein', faces: 3, edges: 2, corners: 0, description: 'hat zwei Kreise und eine runde Mantelfläche, wie eine Dose' },
      kegel: { name: 'Kegel', article: 'ein', faces: 2, edges: 1, corners: 1, description: 'hat einen Kreis unten und eine Spitze oben, wie eine Eistüte' },
      pyramide: { name: 'Pyramide', article: 'eine', faces: 5, edges: 8, corners: 5, description: 'hat ein Quadrat unten und läuft oben spitz zu' }
    };
  }

  // 3D-Körper erkennen
  generateBody3DQuestion() {
    const bodies = this.getBodies3D();
    const bodyKeys = Object.keys(bodies);
    const bodyKey = bodyKeys[Math.floor(Math.random() * bodyKeys.length)];
    const body = bodies[bodyKey];

    const contexts = [
      {
        question: `Im Tempel steht ein geheimnisvoller Körper. Er ${body.description}. Welcher Körper ist das?`,
        icon: 'temple'
      },
      {
        question: `Der Forscher beschreibt: "Dieser Körper ${body.description}." Was ist es?`,
        icon: 'explorer'
      },
      {
        question: `Das Rätsel lautet: "Ich bin ein Körper und ${body.description}." Was bin ich?`,
        icon: 'riddle'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const allBodies = bodyKeys.map(k => bodies[k].name);
    const wrongAnswers = allBodies.filter(n => n !== body.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = this.shuffleArray([body.name, ...wrongAnswers]);

    return {
      id: `geo_body3d_${bodyKey}`,
      type: 'geometry',
      subtype: 'body_3d',
      question: `Welcher Körper ${body.description}?`,
      contextQuestion: context.question,
      correctAnswer: body.name,
      options: options,
      hint: `Tipp: Überlege, welche Form die Grundfläche hat.`,
      difficulty: this.difficulty,
      visualData: {
        body: bodyKey,
        icon: context.icon
      }
    };
  }

  // Flächen von 3D-Körpern zählen
  generateBodyFacesQuestion() {
    const bodies = this.getBodies3D();
    // Nur Körper mit zählbaren Flächen
    const countableBodies = ['wuerfel', 'quader', 'pyramide'];
    const bodyKey = countableBodies[Math.floor(Math.random() * countableBodies.length)];
    const body = bodies[bodyKey];

    const contexts = [
      {
        question: `${body.article.charAt(0).toUpperCase() + body.article.slice(1)} ${body.name} liegt im Tempel. Wie viele Flächen hat er?`,
        icon: 'temple'
      },
      {
        question: `Du findest ${body.article} ${body.name}. Aus wie vielen flachen Seiten besteht er?`,
        icon: 'find'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const correctAnswer = body.faces;
    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 1, 10);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `geo_faces_${bodyKey}`,
      type: 'geometry',
      subtype: 'body_faces',
      question: `Wie viele Flächen hat ${body.article} ${body.name}?`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: Zähle alle flachen Seiten des Körpers.`,
      difficulty: this.difficulty,
      visualData: {
        body: bodyKey,
        property: 'faces',
        icon: context.icon
      }
    };
  }

  // Kanten von 3D-Körpern zählen
  generateBodyEdges3DQuestion() {
    const bodies = this.getBodies3D();
    // Nur Körper mit zählbaren Kanten
    const countableBodies = ['wuerfel', 'quader', 'pyramide'];
    const bodyKey = countableBodies[Math.floor(Math.random() * countableBodies.length)];
    const body = bodies[bodyKey];

    const contexts = [
      {
        question: `${body.article.charAt(0).toUpperCase() + body.article.slice(1)} ${body.name} muss mit Goldleisten verziert werden. Wie viele Kanten hat er?`,
        icon: 'gold'
      },
      {
        question: `Entlang der Kanten ${body.article === 'eine' ? 'einer' : 'eines'} ${body.name}${body.article === 'ein' ? 's' : ''} laufen Ameisen. Wie viele Kanten gibt es?`,
        icon: 'ant'
      }
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    const correctAnswer = body.edges;
    const wrongAnswers = this.generateWrongNumbers(correctAnswer, 4, 16);
    const options = this.shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
      id: `geo_edges3d_${bodyKey}`,
      type: 'geometry',
      subtype: 'body_edges_3d',
      question: `Wie viele Kanten hat ${body.article} ${body.name}?`,
      contextQuestion: context.question,
      correctAnswer: correctAnswer,
      options: options,
      hint: `Tipp: Kanten sind die Linien, wo zwei Flächen aufeinandertreffen.`,
      difficulty: this.difficulty,
      visualData: {
        body: bodyKey,
        property: 'edges',
        icon: context.icon
      }
    };
  }

  // Hilfsmethoden
  generateWrongNumbers(correct, min, max) {
    const wrong = new Set();

    // Nahe Zahlen
    wrong.add(correct + 1);
    wrong.add(correct - 1);
    wrong.add(correct + 2);
    wrong.add(correct - 2);

    // Zufällige Zahlen
    while (wrong.size < 6) {
      wrong.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    wrong.delete(correct);
    const filtered = [...wrong].filter(n => n >= min && n <= max && n !== correct);
    return this.shuffleArray(filtered).slice(0, 3);
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
