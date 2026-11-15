lernloop. – Prüfungstrainer Einzelhandel, 3. Lehrjahr
==================================================

CLOUDFLARE PAGES: DIREKT HOCHLADEN
---------------------------------
1. Cloudflare-Dashboard öffnen: https://dash.cloudflare.com/
2. Workers & Pages -> Neue Anwendung / Pages -> Direct Upload / Drag-and-drop auswählen.
   Die genauen Menünamen können sich ändern.
3. ZIP-Datei "lernloop-cloudflare-pages.zip" hochladen und ein Projekt benennen.
4. "Deploy site" / "Bereitstellen" wählen. Cloudflare stellt eine *.pages.dev-Adresse bereit.

WICHTIG: Die index.html liegt DIREKT im Wurzelverzeichnis der ZIP-Datei.
Kein Build, keine NPM-Abhängigkeiten, kein Backend, kein API-Schlüssel nötig.
Alternativ lässt sich der entpackte Ordner hochladen.

FUNKTIONEN
----------
- Responsives Design für Smartphones und Computer, Hell-/Dunkelmodus
- 119 redaktionell formulierte Grundfragen und 57 Zufallsvorlagen
- Immer neue Varianten: Preise, Mengen, Kontexte, Artikel und Geschäftsnamen
- 7 Aufgabenformen: Single-Choice, Multiple-Choice, Richtig/Falsch, Lücke,
  Rechnen, Reihenfolge und offene Fallfragen
- 5-Fragen-Training, 12-Fragen-Mix, 20-Fragen-Prüfungs-Check, Endlosmodus
- Sofortige Rückmeldung (außer im Prüfungs-Check): eigene und richtige Antwort,
  Erklärung, Rechenweg und Merksatz
- Selbstbewertung bei offenen Fachgesprächsaufgaben
- Fehlertraining, späteres Wiederauftauchen im Lern-Mix/Endlosmodus
- Persönliche Notizen, Merklisten und TXT-Export
- Lokale Speicherung im Browser; kein Konto und kein externer Dienst
- Offline-Nutzung nach dem ersten Besuch via Service Worker (wenn der Browser
  dies unterstützt und die Seite unter HTTPS bereitgestellt wird)

DATENSCHUTZ / GRENZEN
--------------------
Fortschritt und Notizen bleiben im lokalen Browser-Speicher dieses Geräts.
Zwischen verschiedenen Geräten synchronisiert die Seite NICHT. Wird der
Browser-Speicher gelöscht, gehen diese Daten verloren. Notizen können als TXT
exportiert werden. In privaten Browserfenstern ist die dauerhafte Speicherung
nicht sicher.

Der Generator setzt geprüfte Vorlagen mit veränderlichen Werten und Situationen
zusammen. Er verwendet keine frei formulierende KI und erfordert deshalb keine
Internetverbindung. Trotz umfangreicher automatisierter Prüfungen kann keine
vollständige Fehlerfreiheit oder Prüfungsgleichheit garantiert werden.

Eigenständige Übungsaufgaben – kein offizielles IHK-Angebot und keine Original-
Prüfungsaufgaben. Für die tatsächliche Abschlussprüfung im Einzelhandel
(Verordnung 2017) sind insbesondere Geschäftsprozesse im Einzelhandel und
Fachgespräch in der Wahlqualifikation relevant.

Quellen zum Prüfungsrahmen:
https://www.ihk-aka.de/pruefungen/ap/berufe/detail/b6172
https://www.gesetze-im-internet.de/verkehkflausbv/__29.html

TESTS
-----
Das beiliegende TESTBERICHT.txt nennt Testumfang und Ergebnisse. Die vollständigen
Testskripte liegen im separat erhältlichen "lernloop-qa-tests.zip", damit die
Cloudflare-Upload-Datei nur die notwendigen Website-Dateien enthält.
