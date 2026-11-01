# Briefing für das Gremium „Hat eeziframes eine Zukunft?“ (29.10.2026)

## Die Frage des Inhabers (wörtlich sinngemäß)
„Ich habe jetzt alles aufgestellt, verliere aber die Hoffnung in dieses Geschäftsmodell. Gibt es grundsätzlich Hoffnung, dass das ein profitables Business wird? Führt die Seite, so wie sie aufgemacht ist, dazu, dass ich Kunden bekomme? Was ist die Lösung, auch im Hinblick auf Conversion Rate und Werbung auf Instagram?“

## Das Geschäft (Stand im Repo /home/user/fenstero, Branch main)
- **Produkt:** eeziframes, ein Fenster-Konfigurator im Browser. Hauseigentümer fotografieren und messen ihre Fenster geführt selbst (drei Breiten, drei Höhen, kleinstes Maß zählt), wählen Material, Farbe (RAL), Glas, Öffnungsart, Sonnenschutz usw. in drei Detailtiefen mit 3-D-Modell (WebGL) und KI-Auswertung der Fotos (Einbausituation, Rollladenkasten, Anschlag). Ergebnis: ein Aufmaßblatt-PDF mit Zeichnung, Bestellmaß, Wünschen, Notizen und einer Klärungsliste für den Fensterbauer. Es ist ein Erstaufmaß fürs Angebot; das Feinaufmaß vor der Bestellung macht der Betrieb.
- **B2B, Hauptgeschäft seit 22.10.2026 (Pakete für Fensteranbieter):** Jeder Fensterbauer/Fensterhändler bekommt eine eigene Konfigurator-Instanz unter eigener Domain; Kunden planen dort, jede Anfrage kommt als PDF per E-Mail (Signature zusätzlich Dashboard mit Einladungslinks und Status). Preise netto (pakete.js, Stand jetzt):
  - EEZI Essential: 39 €/Monat, 99 € Einrichtung (eeziframes-Design, „Powered by“)
  - EEZI Essential Plus: 69 €/Monat, 150 € Einrichtung (Logo, Farben, Fotos, dezenter Hinweis)
  - EEZI Signature: 99 €/Monat, 239 € Einrichtung (volles White-Label, Dashboard)
  - KI-Kontingent je Paket (1.000/1.500/2.000 Auswertungen im Monat), jede weitere 0,08 €; eine Auswertung kostet den Inhaber etwa 0,044 €.
  - Einrichtung wird vorab bezahlt (Stripe), Abo startet beim Livegang, monatlich kündbar. Der Inhaber richtet jede Instanz persönlich ein (Domain kaufen, Gestaltung).
  - Geplant: „Anfragen aus Ihrer Nähe“: Hauseigentümer, die in der freien eeziframes-App planen, können ihre Anfrage an einen Betrieb in der Nähe schicken, mit Gebühr je weitergeleiteter Anfrage (Preis offen).
- **B2C (bleibt):** Hauseigentümer messen kostenlos in der App auf eeziframes.com; das Aufmaßblatt als PDF kostet 7,99 € (Einführungspreis bis 17.11.2026, danach 12,99 €), über den Link eines Fensterbauers kostenlos.
- **Website:** Startseite, Verkaufsseite /fuer-fensterbauer/ (Landingpage mit Paketen, Ablauf, Anfrageformular, „Selbst ausprobieren“ mit Beispiel), 23 Ratgeber für Hauseigentümer und 10 Wissensseiten für Fensterbauer (seit heute alle im Muster „Antwort zuerst“, für Google und KI-Assistenten gebaut; Indexierung freigegeben). Rechtstexte inkl. Paketbedingungen mit AV-Vertrag sind freigegeben.
- **Fixkosten etwa:** Cloudflare Workers Paid ~5 $, Resend Pro ~20 $, Supabase Pro ~25 $ im Monat; je Kunde eine Domain (~10–25 €/Jahr). Der Inhaber arbeitet allein, Entwicklung bisher mit Claude.
- **Marketing bisher:** Instagram-Profil mit Story-Highlights für Fensterbauer (20 Stories, Maskottchen Bär/Waschbär, Werkstatt-Szenen), Bio „Wir verkaufen keine Fenster, sondern …“ (Zeitersparnis, klare Kommunikation). Keine bezahlte Werbung bekannt.
- **Unbekannt (nicht erfinden, als Annahme kennzeichnen):** Zahl der Besucher, der Anfragen und der zahlenden Kunden. Der Inhaber klingt so, als hätte er noch keinen oder kaum zahlende Paketkunden. Budget und verfügbare Zeit des Inhabers unbekannt.

## Markt und Wettbewerb (aus Recherchen im Repo, 29.10.2026)
- Clean Invoice bietet Fensterbauern ein **kostenloses** Konfigurator-Widget (mit Pflicht-Link, ohne Preise); Anfragen können dort an „so viele Firmen Sie möchten“ gehen; Fotomessung „±1–2 cm“ (Anbieterangabe).
- Hersteller-Konfiguratoren (Schüco, Veka, Drutex u. a.) und Baumarkt-Konfiguratoren mit Preis (Bauhaus, Hornbach) sind verbreitet; Agenturen bauen eigene Konfiguratoren ab etwa 2.000 € bis über 100.000 €.
- Lead-Portale (Aroundhome u. a.) verkaufen Anfragen an bis zu drei Betriebe.
- Bitkom 2025: Handwerkersuche über Empfehlung 83 %, Websites 26 %, Portale 20 %; für 40 % ist ein Betrieb ohne Website keine Option. 2025 nutzten 4 % der Handwerksbetriebe KI, 68 % verschicken Angebote digital. Ausbaugewerbe: Auftragsreichweite rund 10 Wochen (ZDH Q2/2026), Fachkräftemangel stark.

Die Detailseiten: web/fuer-fensterbauer/index.html (Verkaufsseite), web/fuer-fensterbauer/*/ (Wissen), web/ratgeber/*/, docs/profis/ (frühere Gremien), marketing/highlights/ (Instagram).
