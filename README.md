# Restaurant Zum Netzroller – Website

Statische Website für das **Restaurant Zum Netzroller** (Italienisches Restaurant & Pizzeria), Josef-Seib-Straße 7, 68647 Biblis.

- **Live:** https://julianito03.github.io/zum-netzroller/
- **Inhalte bearbeiten (CMS):** https://julianito03.github.io/zum-netzroller/admin/ — siehe [CMS-SETUP.md](CMS-SETUP.md)

## Aufbau
- Handgebaute statische HTML-Seiten, gemeinsames `assets/styles.css` (Inter + Fraunces).
- `assets/site.js` blendet Header/Footer ein und steuert Interaktionen.
- `assets/content.js` rendert CMS-Inhalte aus `content/*.json` (mit statischem Fallback).
- **Sveltia CMS** unter `/admin/` (Speisekarte, Bewertungen, Bilder, Texte).
- Bilder: echte Fotos (`*-real.jpg`, Logo) + KI-generierte Food-/Ambiente-Aufnahmen.

## Farben (Markenwelt)
- Primär: Bordeaux `#6e3c48` (aus dem Logo)
- Sekundär: Gold `#c79a4b`
- Tertiär: Salbeigrün `#7d8a5f` · Hintergrund: warmes Elfenbein `#faf6f1`

## Vor dem Launch
- Echte E-Mail-Adresse setzen (`assets/site.js` → `INQUIRY_EMAIL`, Impressum, Datenschutz, Footer).
- Impressum vervollständigen (Inhaber/in, Rechtsform, USt-IdNr.).
- Öffnungszeiten in `kontakt.html` prüfen (aktuell Beispielzeiten).
- Speisekarte/Preise mit der echten Karte abgleichen (über das CMS).
