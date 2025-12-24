import { MultiplicationQ } from '../questions/MultiplicationQ.js';
import { AddSubtractQ } from '../questions/AddSubtractQ.js';
import { DivisionQ } from '../questions/DivisionQ.js';
import { GeometryQ } from '../questions/GeometryQ.js';
import { MeasurementQ } from '../questions/MeasurementQ.js';
import { WordProblemQ } from '../questions/WordProblemQ.js';
import { TimeQ } from '../questions/TimeQ.js';
import { MoneyQ } from '../questions/MoneyQ.js';

export class QuestionManager {
  constructor(questionTypes = ['multiplication'], difficulty = 'normal', questionCount = 10, answeredQuestionIds = new Set()) {
    this.questionTypes = questionTypes;
    this.difficulty = difficulty;
    this.questionCount = questionCount;
    this.generators = this.createGenerators();
    this.questionPool = [];
    this.currentIndex = 0;
    this.currentStreak = 0;
    this.maxStreak = 0;
    this.correctlyAnsweredInSession = []; // Fragen, die in dieser Session richtig beantwortet wurden

    // Fragen vorab generieren (mit bereits beantworteten Fragen)
    this.prepareQuestions(answeredQuestionIds);
  }

  createGenerators() {
    const generators = {};

    // Einmaleins mit spezifischen Reihen
    if (this.questionTypes.includes('mult_1_5')) {
      generators.mult_1_5 = new MultiplicationQ(this.difficulty, { tableRange: '1-5' });
    }
    if (this.questionTypes.includes('mult_6_10')) {
      generators.mult_6_10 = new MultiplicationQ(this.difficulty, { tableRange: '6-10' });
    }
    if (this.questionTypes.includes('multiplication')) {
      generators.multiplication = new MultiplicationQ(this.difficulty);
    }

    if (this.questionTypes.includes('addition') || this.questionTypes.includes('subtraction')) {
      generators.addSubtract = new AddSubtractQ(this.difficulty);
    }

    if (this.questionTypes.includes('division')) {
      generators.division = new DivisionQ(this.difficulty);
    }

    if (this.questionTypes.includes('geometry')) {
      generators.geometry = new GeometryQ(this.difficulty);
    }

    if (this.questionTypes.includes('measurement')) {
      generators.measurement = new MeasurementQ(this.difficulty);
    }

    if (this.questionTypes.includes('word_problem')) {
      generators.word_problem = new WordProblemQ(this.difficulty);
    }

    // Neue Fragetypen
    if (this.questionTypes.includes('time')) {
      generators.time = new TimeQ(this.difficulty);
    }

    if (this.questionTypes.includes('money')) {
      generators.money = new MoneyQ(this.difficulty);
    }

    return generators;
  }

  // Fragen vorab generieren und mischen
  prepareQuestions(answeredQuestionIds = new Set()) {
    const typeKeys = Object.keys(this.generators);
    if (typeKeys.length === 0) return;

    const usedIds = new Set();
    const targetCount = this.questionCount * 3; // Mehr generieren für Auswahl

    // Generiere viele einzigartige Fragen
    let attempts = 0;
    const maxAttempts = 2000; // Deutlich mehr Versuche

    while (this.questionPool.length < targetCount && attempts < maxAttempts) {
      const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
      const generator = this.generators[randomType];
      const question = generator.generate();

      // Nur hinzufügen wenn noch nicht vorhanden UND nicht bereits beantwortet
      if (!usedIds.has(question.id) && !answeredQuestionIds.has(question.id)) {
        usedIds.add(question.id);
        this.questionPool.push(question);
      }
      attempts++;
    }

    // Falls nicht genug neue Fragen, auch bereits beantwortete zulassen
    if (this.questionPool.length < this.questionCount) {
      attempts = 0;
      while (this.questionPool.length < this.questionCount && attempts < 500) {
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        const generator = this.generators[randomType];
        const question = generator.generate();

        if (!usedIds.has(question.id)) {
          usedIds.add(question.id);
          this.questionPool.push(question);
        }
        attempts++;
      }
    }

    // Pool mischen
    this.shuffleArray(this.questionPool);

    console.log(`QuestionManager: ${this.questionPool.length} Fragen im Pool generiert (Ziel: ${targetCount}, Versuche: ${attempts})`);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getQuestion(index) {
    // Fallback falls Pool leer
    if (this.questionPool.length === 0) {
      console.warn('Fragen-Pool leer, generiere neue Frage');
      const typeKeys = Object.keys(this.generators);
      if (typeKeys.length === 0) {
        const fallback = new MultiplicationQ(this.difficulty);
        return { ...fallback.generate(), index };
      }
      const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
      return { ...this.generators[randomType].generate(), index };
    }

    // Nächste Frage aus dem Pool
    const question = this.questionPool[this.currentIndex % this.questionPool.length];
    this.currentIndex++;

    return {
      ...question,
      index: index
    };
  }

  checkAnswer(question, answer) {
    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      this.currentStreak++;
      if (this.currentStreak > this.maxStreak) {
        this.maxStreak = this.currentStreak;
      }
      // Frage als richtig beantwortet speichern
      if (question.id && !this.correctlyAnsweredInSession.includes(question.id)) {
        this.correctlyAnsweredInSession.push(question.id);
      }
    } else {
      this.currentStreak = 0;
    }

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      currentStreak: this.currentStreak,
      maxStreak: this.maxStreak
    };
  }

  // Gibt die IDs der in dieser Session richtig beantworteten Fragen zurück
  getCorrectlyAnsweredIds() {
    return this.correctlyAnsweredInSession;
  }

  getStats() {
    return {
      currentStreak: this.currentStreak,
      maxStreak: this.maxStreak,
      questionsAnswered: this.currentIndex
    };
  }

  reset() {
    this.currentIndex = 0;
    this.currentStreak = 0;
    this.shuffleArray(this.questionPool); // Neu mischen bei Reset
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.generators = this.createGenerators();
  }
}
