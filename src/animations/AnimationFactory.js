import { MonkeyAnimation } from './elements/MonkeyAnimation.js';
import { PalmTreeAnimation } from './elements/PalmTreeAnimation.js';
import { ParrotAnimation } from './elements/ParrotAnimation.js';
import { CrocodileAnimation } from './elements/CrocodileAnimation.js';
import { CoinAnimation } from './elements/CoinAnimation.js';
import { ButterflyAnimation } from './elements/ButterflyAnimation.js';
import { ChestAnimation } from './elements/ChestAnimation.js';

// Mapping von Icons zu Animations-Klassen
const ANIMATION_MAP = {
  'banana': MonkeyAnimation,
  'monkey': MonkeyAnimation,
  'coconut': PalmTreeAnimation,
  'palm': PalmTreeAnimation,
  'feather': ParrotAnimation,
  'parrot': ParrotAnimation,
  'tooth': CrocodileAnimation,
  'crocodile': CrocodileAnimation,
  'coin': CoinAnimation,
  'gold': CoinAnimation,
  'butterfly': ButterflyAnimation,
  'chest': ChestAnimation,
  'treasure': ChestAnimation,
  'nut': MonkeyAnimation, // Affen mit Nüssen
  'backpack': MonkeyAnimation
};

// Keywords im contextQuestion für Icon-Erkennung
const CONTEXT_KEYWORDS = {
  'Affe': 'monkey',
  'Affen': 'monkey',
  'Banane': 'banana',
  'Bananen': 'banana',
  'Palme': 'palm',
  'Palmen': 'palm',
  'Kokosnuss': 'coconut',
  'Kokosnüsse': 'coconut',
  'Papagei': 'parrot',
  'Papageien': 'parrot',
  'Feder': 'feather',
  'Federn': 'feather',
  'Krokodil': 'crocodile',
  'Zahn': 'tooth',
  'Zähne': 'tooth',
  'Goldmünze': 'coin',
  'Goldmünzen': 'coin',
  'Münze': 'coin',
  'Münzen': 'coin',
  'Schmetterling': 'butterfly',
  'Schmetterlinge': 'butterfly',
  'Schatztruhe': 'chest',
  'Truhe': 'chest',
  'Truhen': 'chest',
  'Nuss': 'nut',
  'Nüsse': 'nut',
  'Rucksack': 'backpack',
  'Baum': 'palm',
  'Bäume': 'palm'
};

export class AnimationFactory {
  constructor(scene) {
    this.scene = scene;
  }

  // Erstellt passende Animation basierend auf Fragen-Daten
  create(questionData) {
    const config = this.parseQuestionData(questionData);

    if (!config.AnimationClass) {
      console.log('Keine passende Animation gefunden für:', config.icon);
      return this.createDefaultAnimation(config);
    }

    try {
      const animation = new config.AnimationClass(this.scene, config);
      return animation;
    } catch (e) {
      console.warn('Fehler beim Erstellen der Animation:', e);
      return this.createDefaultAnimation(config);
    }
  }

  // Extrahiert Konfigurations-Daten aus der Frage
  parseQuestionData(questionData) {
    const { type, visualData, contextQuestion, correctAnswer } = questionData;

    // Icon aus visualData oder aus contextQuestion extrahieren
    let icon = visualData?.icon || this.extractIconFromContext(contextQuestion);

    // Mengen extrahieren
    const counts = this.extractCounts(questionData);

    // Animations-Klasse finden
    const AnimationClass = ANIMATION_MAP[icon] || null;

    // Zufällige Positionierung: 'left', 'right', oder 'both'
    const positionOptions = ['left', 'right', 'both'];
    const position = positionOptions[Math.floor(Math.random() * positionOptions.length)];

    return {
      icon,
      type, // multiplication, addition, subtraction, division
      counts,
      correctAnswer,
      contextQuestion,
      AnimationClass,
      visualData,
      position // NEU: wo die Animation erscheint
    };
  }

  // Extrahiert Icon-Typ aus dem Kontext-Text
  extractIconFromContext(contextQuestion) {
    if (!contextQuestion) return 'coin'; // Fallback

    for (const [keyword, icon] of Object.entries(CONTEXT_KEYWORDS)) {
      if (contextQuestion.includes(keyword)) {
        return icon;
      }
    }

    return 'coin'; // Standard-Fallback
  }

  // Extrahiert die Mengen-Zahlen aus der Frage
  extractCounts(questionData) {
    const { type, visualData, correctAnswer } = questionData;

    switch (type) {
      case 'multiplication':
        return {
          groups: visualData?.rows || 3,
          itemsPerGroup: visualData?.cols || 4,
          total: correctAnswer
        };

      case 'division':
        return {
          total: visualData?.total || correctAnswer * (visualData?.groups || 3),
          groups: visualData?.groups || 3,
          perGroup: visualData?.perGroup || correctAnswer
        };

      case 'addition':
        return {
          first: visualData?.a || Math.floor(correctAnswer / 2),
          second: visualData?.b || Math.ceil(correctAnswer / 2),
          total: correctAnswer
        };

      case 'subtraction':
        return {
          start: visualData?.a || correctAnswer + 10,
          remove: visualData?.b || 10,
          result: correctAnswer
        };

      default:
        return { total: correctAnswer };
    }
  }

  // Fallback-Animation (einfache Münzen)
  createDefaultAnimation(config) {
    // Einfache Standard-Animation mit Münzen
    return new CoinAnimation(this.scene, {
      ...config,
      icon: 'coin',
      type: config.type || 'addition'
    });
  }
}
