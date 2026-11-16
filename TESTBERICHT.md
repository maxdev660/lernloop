# lernloop. V6 – QA-Bericht

## Tatsächlich ausgeführte Prüfungen

- 19 Node-Testfälle bestanden (einschließlich einer Serie von 36.000 zufällig erzeugten Aufgabenvarianten: 12.000 Einzelhandel, 12.000 Mathematik, 12.000 Sprachaufgaben).
- 5 neue Login-/Gastmodus-Tests bestanden: alte lokale Gastdaten, getrennte Kontospeicherung, Abgrenzung zweier Konten, leerer Lernstand, kein Fake-Login ohne Auth-Konfiguration.
- 28 isolierte Chromium-Browser-Prüfungen bestanden (16 bestehende Lernabläufe + 12 neue Konto-/Gastabläufe auf Desktop und Mobil), ohne JavaScript-Fehler: beide Startoptionen, Kontoseite, korrekte noch-nicht-konfiguriert-Meldung, Gaststart mit realer Frage, Zurücknavigieren, Dark Mode und kein horizontaler Überlauf auf der Kontoseite.
- `npm run build` erfolgreich.

## Nicht getestet

- Tatsächlicher Magic-Link-E-Mailversand: kein Supabase-Projekt oder SMTP-Zugang verbunden.
- Echte Supabase-API/RLS im Internet; die SQL-Regeln und HTTP-Anbindung wurden vorbereitet, aber nicht mit einem produktiven Backend durchgespielt.
- Gleichzeitige Bearbeitung auf mehreren Geräten, Langzeit-Kontodaten-Konflikte.
- Veröffentlichte App-Stores, echte Android-/Windows-Installationen, Mikrofon auf realen Geräten.

**Wichtig:** Die vorhandene Aufgabenvarianten-Suite bestätigt bestimmte Struktur- und Plausibilitätseigenschaften, nicht die vollständige fachliche Richtigkeit jeder beliebigen generierten Frage.
