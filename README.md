# lernloop. V6 — lernen mit oder ohne Konto

Komplettes, statisches Cloudflare-Pages-Projekt für deinen bestehenden Ordner `F:\lernloop` und das Projekt `lernloop.pages.dev`. **Gastmodus funktioniert sofort, ohne Registrierung oder Online-Dienst.** Die frühere V5-Funktionen (Lernkompass, Sprachen, Mathematik, Einzelhandel, Fehlertraining und installierbare Web-App) sind erhalten.

## Was ist neu?

- Zwei sichtbare Einstiege auf der Startseite: **„Ohne Login üben“** (startet direkt die erste Frage) und **„Anmelden / Konto erstellen“** (zeigt den Kontobereich).
- Keine Anmeldepflicht. Bisherige lokale Lerndaten aus V4/V5 bleiben im Gastmodus erhalten.
- **Optionaler echter E-Mail-Magic-Link-Login via Supabase Auth** statt selbstgebauter Passwortverwaltung. **Die Anmeldung ist erst aktiv, wenn du Supabase eingerichtet hast.** Im ausgelieferten Zustand ist sie sichtbar, aber ausdrücklich als noch nicht freigeschaltet gekennzeichnet.
- Konto-Lernstände werden vom Gastmodus lokal getrennt. Mit verbundenem Supabase-Projekt lässt sich Lernfortschritt in einer PostgreSQL-Tabelle mit Row-Level-Security zwischen Geräten synchronisieren. Gastdaten lassen sich bei Bedarf in ein Konto übernehmen.
- Passwörter werden in dieser Website nicht verarbeitet. Die öffentlichen Supabase-Projektschlüssel sind keine geheimen Server-Keys; `service_role`/Secret Keys **niemals** im Browser verwenden.
- Login nur für Personen ab 16 Jahren vorgesehen; für jüngere Lernende bleibt der Gastmodus.

## Installation in `F:\lernloop`

1. Den bisherigen Projektordner sichern. Den versteckten Ordner `F:\lernloop\.git` unbedingt **behalten**, wenn GitHub bereits verbunden ist.
2. Alle bisherigen Projektdateien durch den Inhalt dieser ZIP ersetzen (nicht den `.git`-Ordner löschen).
3. PowerShell öffnen:

```powershell
cd F:\lernloop
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

Die lokale Vorschau ist dann unter `http://localhost:4173/` erreichbar. Mit `Strg+C` beenden.

## Veröffentlichen über Cloudflare Pages und GitHub

```powershell
cd F:\lernloop
.\deploy.cmd
```

Das Skript testet, baut und veröffentlicht `dist/`, pusht Änderungen zuvor nach GitHub. Wenn Cloudflare noch nicht verbunden ist: `npx.cmd wrangler login`.

**Hinweis:** Der aktuelle Gastmodus benötigt kein Supabase; du kannst sofort deployen. Die Google-Bestätigungsdatei `google17f8e902f4d9cb04.html` bleibt erhalten.

## Echte Konto-Anmeldung aktivieren (optional, einmalig)

Damit „Anmelden“ wirklich E-Mails versenden und den Lernstand synchronisieren kann, muss der Betreiber ein eigenes Supabase-Projekt einrichten:

1. Ein Supabase-Projekt erstellen. Unter **Authentication → Providers → Email** E-Mail-Anmeldung aktivieren und das Magic-Link-Template verwenden. Unter **Authentication → URL Configuration** `https://lernloop.pages.dev/` als Site URL und `https://lernloop.pages.dev/?auth=1` als erlaubte Redirect URL eintragen. Für lokale Tests zusätzlich `http://localhost:4173/?auth=1` zulassen. **Achtung:** Für den öffentlichen Versand von Anmeldemails kann die Einrichtung eines eigenen SMTP-Providers erforderlich sein; die Standard-Mailzustellung hat Einschränkungen.
2. Im **SQL Editor** die Datei [`supabase-schema.sql`](./supabase-schema.sql) ausführen. Sie erstellt die Tabelle `lernloop_profiles` und aktiviert **Row-Level-Security**; jede Person darf nur ihre eigenen Datensätze lesen/schreiben.
3. In `public/js/core/auth-config.js` die **Project URL** und den **publishable/anon Key** eintragen. Das sind die einzigen Werte, die in den Browser gehören. **Niemals `service_role`-Schlüssel oder SMTP-Zugangsdaten eintragen.**
4. `npm.cmd test`, `npm.cmd run build` und `deploy.cmd` erneut ausführen. Per HTTPS die Anmeldung mit einer eigenen Test-E-Mail überprüfen, einschließlich Abmelden und Anmeldung auf einem zweiten Gerät.
5. Vor dem öffentlichen Start rechtliche Datenschutzinformationen, Verantwortliche und Verarbeitung durch Drittanbieter korrekt bereitstellen. Insbesondere bei einer Plattform für Schulklassen gelten zusätzliche Anforderungen an Minderjährige; hierfür ist der Gastmodus ohne E-Mail vorgesehen.

**Status:** Supabase ist in der bereitgestellten ZIP **nicht mit einem echten Projekt verbunden**. Deshalb wurden keine tatsächlichen E-Mails verschickt und keine realen Konten getestet. Die App behauptet im Gastmodus nicht, online zu synchronisieren. Die Fehlerbehandlung und lokalen Kontospeicher wurden automatisiert geprüft.

## Bekannte technische Grenzen

- Nicht alle Schul- und Studienfächer sind abgedeckt. Tatsächlich enthalten: Einzelhandel (14 Lernfelder), Mathematik (Klassen 5–13, thematische Auswahl) und vier Sprach-A1-Einstiege.
- Das geräteübergreifende Konto-Sync ist eine einfache Version; bei mehreren gleichzeitig arbeitenden Geräten können bei Konflikten Daten überschrieben werden. Der Gastmodus bleibt lokal erhalten. Keine rechtliche Datenschutzfreigabe oder Lastprüfung erfolgt.
- Sprachaufnahme/Sprachausgabe hängen von Browser, Betriebssystem und Netzwerk ab. Die Aufnahme misst nicht verlässlich die phonetische Qualität.
- Android und Windows installieren die App derzeit als **PWA**, nicht als native Play-Store-/Microsoft-Store-App.

## Tests

```powershell
npm.cmd test
npm.cmd run build
```

Zusätzlicher isolierter Chromium-UI-Test (nur für Entwicklungsumgebung mit Python/Playwright): `python tools/browser_v6_qa.py`.
