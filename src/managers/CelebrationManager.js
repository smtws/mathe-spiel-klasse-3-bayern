/**
 * CelebrationManager - Audio-visuelle Effekte für Levelende
 * Kombiniert Feuerwerk, Soundeffekte und Sprach-Kommentare
 */
export class CelebrationManager {
  constructor(scene, narrationManager) {
    this.scene = scene;
    this.narrationManager = narrationManager;
    this.audioContext = null;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API nicht verfügbar:', e);
    }
  }

  // Hauptmethode: Feiert das Levelende basierend auf Sternen
  celebrate(stars, correctAnswers, totalQuestions) {
    const { width, height } = this.scene.scale;

    // 1. Visuelle Effekte (zufällig 1-2 Typen)
    const visualEffects = this.selectRandomEffects(['fireworks', 'confetti', 'stars'], stars === 3 ? 2 : 1);
    visualEffects.forEach(effect => this.playVisualEffect(effect, stars));

    // 2. Audio-Effekte (zufällig 1-2 Typen, basierend auf Leistung)
    const audioEffects = this.selectAudioEffects(stars);
    this.playAudioEffects(audioEffects);

    // 3. Sprach-Kommentar (nach kurzer Verzögerung)
    this.scene.time.delayedCall(800, () => {
      const comment = this.generateComment(stars, correctAnswers, totalQuestions);
      if (this.narrationManager) {
        this.narrationManager.speak(comment);
      }
    });
  }

  // Zufällige Auswahl von Effekten
  selectRandomEffects(effects, count) {
    const shuffled = [...effects].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  selectAudioEffects(stars) {
    // Bei 3 Sternen: 2 Effekte, sonst 1
    const allEffects = ['fanfare', 'applause', 'cheer'];

    if (stars === 3) {
      // Fanfare + (Applaus oder Jubel)
      return ['fanfare', Math.random() > 0.5 ? 'applause' : 'cheer'];
    } else if (stars >= 1) {
      // Nur 1 positiver Effekt
      return [allEffects[Math.floor(Math.random() * allEffects.length)]];
    } else {
      // Ermutigendes Geräusch
      return ['encourage'];
    }
  }

  // === VISUELLE EFFEKTE ===

  playVisualEffect(type, stars) {
    switch (type) {
      case 'fireworks':
        this.createFireworks(stars);
        break;
      case 'confetti':
        this.createConfetti(stars);
        break;
      case 'stars':
        this.createStarBurst(stars);
        break;
    }
  }

  createFireworks(stars) {
    const { width, height } = this.scene.scale;
    const count = stars === 3 ? 5 : stars === 2 ? 3 : 2;
    const colors = [0xff0000, 0xffd700, 0x00ff00, 0x00bfff, 0xff69b4, 0xffa500];

    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 400, () => {
        const x = Phaser.Math.Between(100, width - 100);
        const y = Phaser.Math.Between(100, height / 2);
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.explodeFirework(x, y, color);
      });
    }
  }

  explodeFirework(x, y, color) {
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = Phaser.Math.Between(100, 200);
      const size = Phaser.Math.Between(4, 8);

      const particle = this.scene.add.circle(x, y, size, color);
      particle.setDepth(250);

      const targetX = x + Math.cos(angle) * speed;
      const targetY = y + Math.sin(angle) * speed;

      this.scene.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY + 50, // Gravitation
        alpha: 0,
        scale: 0.3,
        duration: Phaser.Math.Between(600, 1000),
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }

    // Innerer Kern
    const core = this.scene.add.circle(x, y, 15, 0xffffff);
    core.setDepth(251);
    this.scene.tweens.add({
      targets: core,
      scale: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => core.destroy()
    });
  }

  createConfetti(stars) {
    const { width, height } = this.scene.scale;
    const count = stars === 3 ? 50 : 30;
    const colors = [0xff0000, 0xffd700, 0x00ff00, 0x00bfff, 0xff69b4, 0x9370db];

    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 30, () => {
        const x = Phaser.Math.Between(50, width - 50);
        const color = colors[Math.floor(Math.random() * colors.length)];

        const confetti = this.scene.add.rectangle(
          x, -20,
          Phaser.Math.Between(8, 15),
          Phaser.Math.Between(8, 15),
          color
        );
        confetti.setDepth(250);
        confetti.setAngle(Phaser.Math.Between(0, 360));

        this.scene.tweens.add({
          targets: confetti,
          y: height + 50,
          x: x + Phaser.Math.Between(-100, 100),
          angle: confetti.angle + Phaser.Math.Between(360, 720),
          duration: Phaser.Math.Between(2000, 3000),
          ease: 'Power1',
          onComplete: () => confetti.destroy()
        });
      });
    }
  }

  createStarBurst(stars) {
    const { width, height } = this.scene.scale;
    const count = stars === 3 ? 15 : 8;

    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        const x = Phaser.Math.Between(100, width - 100);
        const y = Phaser.Math.Between(100, height - 200);

        const star = this.scene.add.star(x, y, 5, 10, 20, 0xffd700);
        star.setDepth(250);
        star.setScale(0);

        this.scene.tweens.add({
          targets: star,
          scale: 1.5,
          rotation: Math.PI,
          duration: 500,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.scene.tweens.add({
              targets: star,
              scale: 0,
              alpha: 0,
              y: y - 50,
              duration: 500,
              delay: 300,
              onComplete: () => star.destroy()
            });
          }
        });
      });
    }
  }

  // === AUDIO EFFEKTE ===

  playAudioEffects(effects) {
    effects.forEach((effect, index) => {
      this.scene.time.delayedCall(index * 200, () => {
        this.playSound(effect);
      });
    });
  }

  playSound(type) {
    if (!this.audioContext) return;

    // Resume AudioContext wenn suspended (Browser-Policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (type) {
      case 'fanfare':
        this.playFanfare();
        break;
      case 'applause':
        this.playApplause();
        break;
      case 'cheer':
        this.playCheer();
        break;
      case 'encourage':
        this.playEncourage();
        break;
    }
  }

  playFanfare() {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Einfache Fanfaren-Melodie (Dreiklang aufwärts)
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const durations = [0.15, 0.15, 0.15, 0.4];

    notes.forEach((freq, i) => {
      const startTime = now + durations.slice(0, i).reduce((a, b) => a + b, 0);
      this.playTone(freq, startTime, durations[i], 'square', 0.15);
    });
  }

  playApplause() {
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const duration = 1.5;

    // Weißes Rauschen für Applaus-Effekt
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Moduliertes Rauschen für "Klatschen"
      const envelope = Math.sin(i / bufferSize * Math.PI);
      const clap = Math.sin(i / 500) > 0.7 ? 1 : 0.3;
      data[i] = (Math.random() * 2 - 1) * envelope * clap * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
  }

  playCheer() {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // "Wooo" Sound - Frequenz-Sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.6);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);

    // Zweiter "Wooo" versetzt
    this.scene.time.delayedCall(200, () => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const t = ctx.currentTime;

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(350, t);
      osc2.frequency.exponentialRampToValueAtTime(700, t + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(450, t + 0.5);

      gain2.gain.setValueAtTime(0.12, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.7);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.7);
    });
  }

  playEncourage() {
    // Sanfte, ermutigende Töne
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const notes = [392, 440, 392]; // G4, A4, G4
    notes.forEach((freq, i) => {
      this.playTone(freq, now + i * 0.3, 0.25, 'sine', 0.1);
    });
  }

  playTone(frequency, startTime, duration, type = 'sine', volume = 0.1) {
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // === SPRACH-KOMMENTARE ===

  generateComment(stars, correct, total) {
    const percentage = correct / total;

    if (stars === 3) {
      return this.getRandomPhrase(this.perfectPhrases);
    } else if (stars === 2) {
      return this.getRandomPhrase(this.goodPhrases);
    } else if (stars === 1) {
      return this.getRandomPhrase(this.okPhrases).replace('{stars}', '1');
    } else {
      return this.getRandomPhrase(this.encouragePhrases);
    }
  }

  getRandomPhrase(phrases) {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Dynamische Phrasen für verschiedene Ergebnisse
  get perfectPhrases() {
    return [
      'Wahnsinn! Du hast alle Fragen richtig beantwortet! Du bist ein echter Rechenchampion!',
      'Perfekt! Alle Antworten richtig! Das war großartig!',
      'Toll gemacht! Du hast jede einzelne Frage gemeistert!',
      'Fantastisch! Kein einziger Fehler! Du bist ein Mathegenie!',
      'Unglaublich! Volle Punktzahl! Weiter so, Superstar!',
      'Bravo! Alle richtig! Das war eine Meisterleistung!',
      'Hervorragend! Du hast alle Aufgaben perfekt gelöst!',
      'Super! Hundert Prozent richtig! Das hast du toll gemacht!'
    ];
  }

  get goodPhrases() {
    return [
      'Sehr gut! Das waren fast alle Fragen richtig! Nur noch ein kleines bisschen üben!',
      'Toll gemacht! Du warst richtig gut! Beim nächsten Mal schaffst du bestimmt alle!',
      'Super Leistung! Du hast die meisten Aufgaben gelöst!',
      'Gut gemacht! Du bist auf dem richtigen Weg!',
      'Prima! Das war schon sehr gut! Nur noch ein bisschen mehr und du hast alle Sterne!',
      'Klasse! Du hast das Level geschafft! Mit etwas Übung holst du dir alle drei Sterne!'
    ];
  }

  get okPhrases() {
    return [
      'Du hast es geschafft! Aber da ist noch Luft nach oben. Versuch es nochmal für mehr Sterne!',
      'Gut, dass du nicht aufgegeben hast! Übung macht den Meister!',
      'Level geschafft! Mit etwas mehr Übung holst du dir mehr Sterne!',
      'Du hast durchgehalten! Das ist schon mal super! Probier es gleich nochmal!',
      'Nicht schlecht für den Anfang! Beim nächsten Versuch klappt es noch besser!'
    ];
  }

  get encouragePhrases() {
    return [
      'Das war ein guter Versuch! Nicht aufgeben, Übung macht den Meister!',
      'Kopf hoch! Jeder macht mal Fehler. Versuch es einfach nochmal!',
      'Das schaffst du! Probier es noch einmal, du wirst besser!',
      'Weiter üben! Rom wurde auch nicht an einem Tag erbaut!',
      'Nicht traurig sein! Beim nächsten Mal klappt es bestimmt besser!'
    ];
  }

  // Aufräumen
  destroy() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}
