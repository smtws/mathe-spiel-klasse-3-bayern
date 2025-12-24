#!/bin/bash
# Installiert .desktop-Datei für Dschungel-Mathe-Expedition

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESKTOP_FILE="$HOME/.local/share/applications/mathgame.desktop"

# Prüfe ob Icon existiert
ICON_PATH="$SCRIPT_DIR/mathgame-icon.png"
if [ ! -f "$ICON_PATH" ]; then
    ICON_PATH="$SCRIPT_DIR/mathgame-icon.svg"
fi

# Erstelle .desktop-Datei
mkdir -p "$HOME/.local/share/applications"

cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=Dschungel-Mathe-Expedition
Comment=Mathe-Lernspiel für 3. Klasse Bayern
Exec=$SCRIPT_DIR/start-mathgame.sh
Icon=$ICON_PATH
Terminal=false
Type=Application
Categories=Education;Game;Math;
Keywords=Mathe;Rechnen;Grundschule;Einmaleins;
StartupWMClass=mathgame
EOF

chmod +x "$DESKTOP_FILE"

echo "Desktop-Verknüpfung installiert: $DESKTOP_FILE"
echo "Das Spiel erscheint jetzt im Anwendungsmenü."
