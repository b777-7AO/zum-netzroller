# Zum Netzroller – Website-CMS (Inhalte bearbeiten)

Mit dem CMS können **Speisekarte, Bewertungen, Bilder und Texte** bearbeitet
werden – ohne Programmieren. Gespeicherte Änderungen landen automatisch auf
GitHub und die Website aktualisiert sich von selbst.

**Bearbeiten unter:** https://julianito03.github.io/zum-netzroller/admin/

Diese Variante braucht **keinen Cloudflare-Worker und keine OAuth-App** – nur
einen kostenlosen GitHub-Zugang pro Person.

---

## Einmal pro Person: Zugang einrichten (ca. 5 Min)

### 1. Kostenloses GitHub-Konto (falls noch nicht vorhanden)
https://github.com/signup – E-Mail + Passwort, 2 Minuten.
> Den GitHub-Benutzernamen an den Administrator geben, damit er als Bearbeiter
> (Collaborator) freigeschaltet wird.

### 2. Zugangs-Token erstellen (einmalig)
1. Eingeloggt auf GitHub diese Seite öffnen:
   **https://github.com/settings/tokens?type=beta**
2. Ausfüllen:
   - **Token name:** `Zum Netzroller CMS`
   - **Expiration:** z. B. 1 Jahr
   - **Repository access:** „Only select repositories" → **`julianito03/zum-netzroller`**
   - **Permissions → Repository permissions → Contents:** auf **Read and write** stellen
3. **Generate token** → Token **kopieren** (beginnt mit `github_pat_…`, wird nur einmal angezeigt).

### 3. Im CMS anmelden
1. https://julianito03.github.io/zum-netzroller/admin/ öffnen
2. **„Sign In Using Access Token"** klicken
3. Token einfügen → fertig.

---

## Bearbeiter freischalten (Administrator, einmalig pro Person)
Repo öffnen → **Settings** → **Collaborators** → **Add people** →
GitHub-Benutzernamen eingeben → die Person bestätigt die Einladung per E-Mail.

---

## Was kann bearbeitet werden?
| Bereich im CMS | bearbeitet | erscheint auf |
|---|---|---|
| **🍝 Speisekarte** | Kategorien, Gerichte, Preise | Seite „Speisekarte" + Startseiten-Vorschau |
| **⭐ Bewertungen** | Gäste-Stimmen | Startseite |
| **Bilder** | alle Hauptfotos | überall auf der Website |
| **Seitentexte** | Überschriften & Texte | Startseite |

---

## Hinweise
- Die Website funktioniert auch **ohne** CMS normal weiter; lädt eine Inhaltsdatei
  einmal nicht, zeigt die Seite automatisch den zuletzt eingebauten Stand.
- Schnell testen ohne Token: im `/admin/` **„Work with Local Repository"** wählen.
- Bearbeitbare Inhalte liegen in `content/` (`menu.json`, `reviews.json`,
  `texts.json`, `images.json`).

## Vor dem Launch noch erledigen
- **Echte E-Mail-Adresse** eintragen (aktuell Platzhalter `info@restaurant-zum-netzroller.de`)
  in `assets/site.js` (`INQUIRY_EMAIL`) sowie in Impressum, Datenschutz und Footer.
- **Impressum** vervollständigen: Inhaber/in, Rechtsform, USt-IdNr. (`[bitte ergänzen]`).
- **Öffnungszeiten** prüfen/anpassen (`kontakt.html`) – aktuell als Beispiel hinterlegt.
