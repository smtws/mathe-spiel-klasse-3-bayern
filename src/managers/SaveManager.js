export class SaveManager {
  constructor() {
    this.STORAGE_KEY = 'junglemath_profiles';
    this.ACTIVE_PROFILE_KEY = 'junglemath_active_profile';
    this.OLD_STORAGE_KEY = 'junglemath_save'; // Alter Storage-Key für Migration
    this.VERSION = '1.1.0'; // Version erhöht für 12-Kapitel-Migration
    this.activeProfileId = null;

    // Migrationen durchführen
    this.migrateOldData();
    this.migrateToTwelveChapters();
  }

  // Migration von 5-Kapitel auf 12-Kapitel-Struktur
  migrateToTwelveChapters() {
    try {
      const profiles = this.loadAllProfiles();
      let migrated = false;

      for (const profile of profiles) {
        // Bereits migriert?
        if (profile.version === '1.1.0') continue;

        const defeated = profile.progress.bossesDefeated || [];

        // Alte 5-Kapitel-Struktur erkennen:
        // Hat papagei/jaguar aber NICHT gorilla/schlange/alligator
        const hasOldBosses = defeated.includes('papagei') || defeated.includes('jaguar');
        const hasNewBosses = defeated.includes('gorilla') || defeated.includes('schlange') || defeated.includes('alligator');

        if (hasOldBosses && !hasNewBosses) {
          console.log('Migriere 5-Kapitel-Fortschritt zu 12-Kapitel-Struktur...');

          // Alte Zuordnung (5 Kapitel):
          // Kap 1: krokodil, Kap 2: piranha, Kap 3: papagei, Kap 4: jaguar, Kap 5: sphinx
          //
          // Neue Zuordnung (12 Kapitel):
          // Kap 1: krokodil, Kap 2: piranha, Kap 3: gorilla, Kap 4: schlange, Kap 5: alligator
          // Kap 6: papagei, Kap 7: jaguar, Kap 8: tukan, Kap 9: affe, Kap 10: sphinx...
          //
          // Mapping: Alte Position → Neuer Boss für diese Position
          const bossMapping = {
            'papagei': 'gorilla',   // Alt Kap 3 → Neu Kap 3
            'jaguar': 'schlange',   // Alt Kap 4 → Neu Kap 4
            'sphinx': 'alligator'   // Alt Kap 5 → Neu Kap 5
          };

          const newDefeated = defeated.map(boss => bossMapping[boss] || boss);

          profile.progress.bossesDefeated = newDefeated;
          profile.version = '1.1.0';

          // Auch currentChapter begrenzen falls > 5
          if (profile.progress.currentChapter > 5) {
            profile.progress.currentChapter = 5;
          }

          console.log('Migration abgeschlossen. Alte Bosse:', defeated, '→ Neue Bosse:', newDefeated);
          migrated = true;
        } else if (!profile.version || profile.version === '1.0.0') {
          // Kein alter Fortschritt, nur Version aktualisieren
          profile.version = '1.1.0';
          migrated = true;
        }
      }

      if (migrated) {
        this.saveAllProfiles(profiles);
      }
    } catch (e) {
      console.warn('Fehler bei der 12-Kapitel-Migration:', e);
    }
  }

  // Migration von altem Speicherformat zu neuem Multi-Profil-Format
  migrateOldData() {
    try {
      const oldData = localStorage.getItem(this.OLD_STORAGE_KEY);
      if (oldData) {
        console.log('Alte Spieldaten gefunden, migriere...');
        const parsed = JSON.parse(oldData);

        // Wenn alte Daten existieren und Profil-Format haben
        if (parsed && parsed.player) {
          // Erstelle neues Profil aus alten Daten
          const newProfile = {
            id: this.generateId(),
            version: this.VERSION,
            player: parsed.player || { name: '', character: 'maya' },
            progress: parsed.progress || { currentChapter: 1, currentLevel: 1, completedLevels: {}, bossesDefeated: [], tutorialCompleted: false },
            inventory: parsed.inventory || { coins: 0, stars: 0, stickers: [], equipment: {}, templeFragments: 0 },
            achievements: parsed.achievements || [],
            statistics: parsed.statistics || { totalQuestionsAnswered: 0, correctAnswers: 0, totalPlayTime: 0, streakRecord: 0, bestStreak: 0 },
            settings: parsed.settings || { musicVolume: 0.7, sfxVolume: 1.0, difficulty: 'normal', showHints: true }
          };

          // Speichere als neues Profil
          const profiles = this.loadAllProfiles();
          profiles.push(newProfile);
          this.saveAllProfiles(profiles);
          this.setActiveProfileId(newProfile.id);

          // Alte Daten löschen
          localStorage.removeItem(this.OLD_STORAGE_KEY);
          console.log('Migration abgeschlossen für Profil:', newProfile.player.name);
        }
      }
    } catch (e) {
      console.warn('Fehler bei der Migration:', e);
    }
  }

  // Erstellt ein neues leeres Profil
  createDefaultProfile(name = '', character = 'maya') {
    return {
      id: this.generateId(),
      version: this.VERSION,
      player: {
        name: name,
        character: character,
        createdAt: new Date().toISOString()
      },
      progress: {
        currentChapter: 1,
        currentLevel: 1,
        completedLevels: {},
        bossesDefeated: [],
        tutorialCompleted: false
      },
      inventory: {
        coins: 0,
        stars: 0,
        stickers: [],
        equipment: {
          hat: 'explorer_hat',
          backpack: 'green_backpack'
        },
        templeFragments: 0
      },
      achievements: [],
      statistics: {
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        totalPlayTime: 0,
        streakRecord: 0,
        bestStreak: 0
      },
      answeredQuestions: [], // Liste der richtig beantworteten Fragen-IDs
      settings: {
        musicVolume: 0.7,
        sfxVolume: 1.0,
        difficulty: 'normal',
        showHints: true
      }
    };
  }

  generateId() {
    return 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Alle Profile laden
  loadAllProfiles() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      // Sicherstellen, dass wir ein Array haben
      if (!Array.isArray(parsed)) {
        console.warn('Ungültiges Profil-Format gefunden, setze zurück');
        return [];
      }
      return parsed;
    } catch (e) {
      console.warn('Fehler beim Laden der Profile', e);
      return [];
    }
  }

  // Alle Profile speichern
  saveAllProfiles(profiles) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
      return true;
    } catch (e) {
      console.error('Fehler beim Speichern der Profile', e);
      return false;
    }
  }

  // Aktives Profil-ID laden
  getActiveProfileId() {
    return localStorage.getItem(this.ACTIVE_PROFILE_KEY);
  }

  // Aktives Profil-ID speichern
  setActiveProfileId(profileId) {
    if (profileId) {
      localStorage.setItem(this.ACTIVE_PROFILE_KEY, profileId);
    } else {
      localStorage.removeItem(this.ACTIVE_PROFILE_KEY);
    }
    this.activeProfileId = profileId;
  }

  // Aktuelles aktives Profil laden
  load() {
    const profileId = this.getActiveProfileId();
    if (!profileId) {
      return this.createDefaultProfile();
    }

    const profiles = this.loadAllProfiles();
    const profile = profiles.find(p => p.id === profileId);

    if (!profile) {
      return this.createDefaultProfile();
    }

    return profile;
  }

  // Aktuelles Profil speichern
  save(data) {
    const profiles = this.loadAllProfiles();
    const index = profiles.findIndex(p => p.id === data.id);

    if (index >= 0) {
      profiles[index] = data;
    } else {
      profiles.push(data);
    }

    this.saveAllProfiles(profiles);
    this.setActiveProfileId(data.id);
    return true;
  }

  // Neues Profil erstellen und aktivieren
  createNewProfile(name, character) {
    const profile = this.createDefaultProfile(name, character);
    this.save(profile);
    return profile;
  }

  // Profil löschen
  deleteProfile(profileId) {
    const profiles = this.loadAllProfiles();
    const filtered = profiles.filter(p => p.id !== profileId);
    this.saveAllProfiles(filtered);

    // Wenn aktives Profil gelöscht wurde, deaktivieren
    if (this.getActiveProfileId() === profileId) {
      this.setActiveProfileId(null);
    }
  }

  // Profil aktivieren (auswählen)
  selectProfile(profileId) {
    this.setActiveProfileId(profileId);
    return this.load();
  }

  // Prüfen ob Profile existieren
  hasProfiles() {
    return this.loadAllProfiles().length > 0;
  }

  // Spieler-Name setzen
  setPlayerName(name) {
    const data = this.load();
    data.player.name = name;
    if (!data.player.createdAt) {
      data.player.createdAt = new Date().toISOString();
    }
    this.save(data);
    return data;
  }

  // Charakter wählen
  setCharacter(character) {
    const data = this.load();
    data.player.character = character;
    this.save(data);
    return data;
  }

  // Level abschließen
  completeLevel(chapter, level, result) {
    const data = this.load();
    const chapterKey = `chapter${chapter}`;
    const levelKey = `level${level}`;

    if (!data.progress.completedLevels[chapterKey]) {
      data.progress.completedLevels[chapterKey] = {};
    }

    const existing = data.progress.completedLevels[chapterKey][levelKey];

    data.progress.completedLevels[chapterKey][levelKey] = {
      stars: Math.max(existing?.stars || 0, result.stars),
      bestTime: Math.min(existing?.bestTime || Infinity, result.time),
      attempts: (existing?.attempts || 0) + 1,
      completedAt: new Date().toISOString()
    };

    // Aktualisiere aktuellen Fortschritt
    if (chapter === data.progress.currentChapter && level >= data.progress.currentLevel) {
      data.progress.currentLevel = level + 1;
    }

    // Statistiken aktualisieren
    data.statistics.totalQuestionsAnswered += result.totalQuestions;
    data.statistics.correctAnswers += result.correctAnswers;

    this.save(data);
    return data;
  }

  // Boss besiegen
  defeatBoss(bossId) {
    const data = this.load();
    if (!data.progress.bossesDefeated.includes(bossId)) {
      data.progress.bossesDefeated.push(bossId);

      // Sticker hinzufügen
      if (!data.inventory.stickers.includes(bossId)) {
        data.inventory.stickers.push(bossId);
      }

      // Tempel-Fragment hinzufügen
      data.inventory.templeFragments++;

      // Nächstes Kapitel freischalten
      data.progress.currentChapter++;
      data.progress.currentLevel = 1;
    }
    this.save(data);
    return data;
  }

  // Münzen hinzufügen
  addCoins(amount) {
    const data = this.load();
    data.inventory.coins += amount;
    this.save(data);
    return data.inventory.coins;
  }

  // Sterne hinzufügen
  addStars(amount) {
    const data = this.load();
    data.inventory.stars += amount;
    this.save(data);
    return data.inventory.stars;
  }

  // Streak aktualisieren
  updateStreak(currentStreak) {
    const data = this.load();
    if (currentStreak > data.statistics.bestStreak) {
      data.statistics.bestStreak = currentStreak;
    }
    this.save(data);
    return data;
  }

  // Achievement freischalten
  unlockAchievement(achievementId) {
    const data = this.load();
    const exists = data.achievements.find(a => a.id === achievementId);
    if (!exists) {
      data.achievements.push({
        id: achievementId,
        unlockedAt: new Date().toISOString()
      });
      this.save(data);
      return true;
    }
    return false;
  }

  // Einstellungen aktualisieren
  updateSettings(settings) {
    const data = this.load();
    data.settings = { ...data.settings, ...settings };
    this.save(data);
    return data.settings;
  }

  // Prüfen ob Level freigeschaltet ist
  isLevelUnlocked(chapter, level) {
    const data = this.load();

    // Erstes Level ist immer freigeschaltet
    if (chapter === 1 && level === 1) return true;

    const chapterKey = `chapter${chapter}`;

    if (level > 1) {
      const prevLevelKey = `level${level - 1}`;
      return !!data.progress.completedLevels[chapterKey]?.[prevLevelKey];
    }

    // Erstes Level eines Kapitels erfordert Boss des vorherigen Kapitels
    if (chapter > 1) {
      const prevBossId = this.getBossIdForChapter(chapter - 1);
      return data.progress.bossesDefeated.includes(prevBossId);
    }

    return false;
  }

  // Boss-ID für Kapitel (alle 12 Kapitel)
  getBossIdForChapter(chapter) {
    const bosses = {
      1: 'krokodil',
      2: 'piranha',
      3: 'gorilla',
      4: 'schlange',
      5: 'alligator',
      6: 'papagei',
      7: 'jaguar',
      8: 'tukan',
      9: 'affe',
      10: 'sphinx',
      11: 'loewe',
      12: 'elefant'
    };
    return bosses[chapter] || null;
  }

  // Prüfen ob Boss freigeschaltet ist
  isBossUnlocked(chapter) {
    const data = this.load();
    const chapterKey = `chapter${chapter}`;
    const levels = data.progress.completedLevels[chapterKey] || {};

    // Boss ist freigeschaltet wenn alle 5 Level des Kapitels abgeschlossen sind
    for (let i = 1; i <= 5; i++) {
      if (!levels[`level${i}`]) {
        return false;
      }
    }
    return true;
  }

  // Gesamte Sternzahl für ein Kapitel
  getChapterStars(chapter) {
    const data = this.load();
    const chapterKey = `chapter${chapter}`;
    const levels = data.progress.completedLevels[chapterKey] || {};

    return Object.values(levels).reduce((sum, level) => sum + (level.stars || 0), 0);
  }

  // Aktuelles Profil zurücksetzen
  resetCurrentProfile() {
    const data = this.load();
    const newProfile = this.createDefaultProfile(data.player.name, data.player.character);
    newProfile.id = data.id; // Gleiche ID behalten
    this.save(newProfile);
    return newProfile;
  }

  // Tutorial als abgeschlossen markieren
  completeTutorial() {
    const data = this.load();
    data.progress.tutorialCompleted = true;
    this.save(data);
    return data;
  }

  // Richtig beantwortete Frage speichern
  addAnsweredQuestion(questionId) {
    const data = this.load();

    // Initialisiere Array falls nicht vorhanden (für alte Profile)
    if (!data.answeredQuestions) {
      data.answeredQuestions = [];
    }

    // Nur hinzufügen wenn noch nicht vorhanden
    if (!data.answeredQuestions.includes(questionId)) {
      data.answeredQuestions.push(questionId);

      // Maximal 500 Fragen speichern (älteste entfernen)
      if (data.answeredQuestions.length > 500) {
        data.answeredQuestions = data.answeredQuestions.slice(-500);
      }

      this.save(data);
    }
    return data;
  }

  // Mehrere richtig beantwortete Fragen speichern
  addAnsweredQuestions(questionIds) {
    const data = this.load();

    if (!data.answeredQuestions) {
      data.answeredQuestions = [];
    }

    for (const id of questionIds) {
      if (!data.answeredQuestions.includes(id)) {
        data.answeredQuestions.push(id);
      }
    }

    // Maximal 500 Fragen speichern
    if (data.answeredQuestions.length > 500) {
      data.answeredQuestions = data.answeredQuestions.slice(-500);
    }

    this.save(data);
    return data;
  }

  // Set der beantworteten Fragen-IDs abrufen
  getAnsweredQuestionIds() {
    const data = this.load();
    return new Set(data.answeredQuestions || []);
  }

  // Beantwortete Fragen zurücksetzen (optional)
  clearAnsweredQuestions() {
    const data = this.load();
    data.answeredQuestions = [];
    this.save(data);
    return data;
  }
}
