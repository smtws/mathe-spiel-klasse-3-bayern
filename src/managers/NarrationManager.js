export class NarrationManager {
  constructor() {
    this.enabled = true;
    this.rate = 0.9; // Etwas langsamer für Kinder
    this.pitch = 1.0;
    this.volume = 1.0;
    this.voice = null;
    this.currentUtterance = null;
    this.queue = [];
    this.isSpeaking = false;

    // Deutsche Stimme suchen
    this.initVoice();
  }

  initVoice() {
    // Warten bis Stimmen geladen sind
    if (typeof speechSynthesis === 'undefined') {
      console.warn('Web Speech API nicht verfügbar');
      this.enabled = false;
      return;
    }

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const germanVoices = voices.filter(v => v.lang.startsWith('de'));

      if (germanVoices.length > 0) {
        // Beste deutsche Stimme finden - Präferenz für natürlichere Stimmen
        const preferred = germanVoices.find(v =>
          v.name.includes('Google') ||
          v.name.includes('Anna') ||
          v.name.includes('Hedda') ||
          v.name.includes('Katja') ||
          v.name.includes('Petra') ||
          v.name.includes('Stefan') ||
          v.name.includes('Hans')
        );
        this.voice = preferred || germanVoices[0];
      } else {
        // Fallback auf englische oder erste Stimme
        this.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }

      if (this.voice) {
        console.log('Narration: Stimme geladen:', this.voice.name, this.voice.lang);
      }
    };

    // Stimmen können asynchron geladen werden
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }

  // Text für bessere Aussprache aufbereiten
  prepareText(text) {
    return text
      // Mathematische Symbole
      .replace(/×/g, ' mal ')
      .replace(/\+/g, ' plus ')
      .replace(/−/g, ' minus ')
      .replace(/-/g, ' minus ')
      .replace(/÷/g, ' geteilt durch ')
      .replace(/=/g, ' ist gleich ')
      .replace(/→/g, ' ergibt ')
      // Ordinalzahl-Problem: "5." wird als "5ter" gelesen
      // Füge Leerzeichen zwischen Zahl und Punkt ein für Pause ohne Ordinalzahl
      .replace(/(\d)\.(\s|$)/g, '$1 .$2')
      .replace(/(\d)\.\s*,/g, '$1 ,')
      // Zeilenumbrüche als Pause
      .replace(/\n+/g, ' . ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Aktivieren/Deaktivieren
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  // Einstellungen anpassen
  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Text sprechen
  speak(text, onEnd = null, priority = false) {
    if (!this.enabled || !text) {
      if (onEnd) onEnd();
      return;
    }

    // Bei Priorität: Aktuelle Sprache unterbrechen
    if (priority && this.isSpeaking) {
      this.stop();
    }

    // Zur Warteschlange hinzufügen oder direkt sprechen
    if (this.isSpeaking && !priority) {
      this.queue.push({ text, onEnd });
      return;
    }

    this.speakText(text, onEnd);
  }

  speakText(text, onEnd) {
    if (typeof speechSynthesis === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    // Laufende Sprache stoppen
    speechSynthesis.cancel();

    // Text für Sprachausgabe aufbereiten
    const preparedText = this.prepareText(text);
    const utterance = new SpeechSynthesisUtterance(preparedText);
    utterance.lang = 'de-DE';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    if (this.voice) {
      utterance.voice = this.voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;

      if (onEnd) {
        onEnd();
      }

      // Nächste aus Warteschlange
      this.processQueue();
    };

    utterance.onerror = (event) => {
      console.warn('Narration Fehler:', event.error);
      this.isSpeaking = false;

      if (onEnd) {
        onEnd();
      }

      this.processQueue();
    };

    this.currentUtterance = utterance;
    speechSynthesis.speak(utterance);
  }

  processQueue() {
    if (this.queue.length > 0 && !this.isSpeaking) {
      const next = this.queue.shift();
      this.speakText(next.text, next.onEnd);
    }
  }

  // Sprache stoppen
  stop() {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.queue = [];
  }

  // Pause
  pause() {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.pause();
    }
  }

  // Fortsetzen
  resume() {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.resume();
    }
  }

  // Prüfen ob gerade gesprochen wird
  isBusy() {
    return this.isSpeaking;
  }

  // Warteschlange leeren
  clearQueue() {
    this.queue = [];
  }
}
