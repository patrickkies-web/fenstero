# Bauplan: Konfigurator-Instanzen in drei Paketen (endgültig)

Stand: Schnappschuss `wt` auf 1419522, 22.10.2026. Quellen: Karten server/app/pdf/katalog, Entwürfe schnell/tragfähig/bestellung/signature, zwei Kritiken, Ergänzung des Inhabers (geht vor).
Zeilenangaben beziehen sich auf den Schnappschuss. Gerüst ist „schnell“; aus „tragfähig“ kommen die Tabellen `instanzen`, `instanz_hosts`, `anfragen` (Skalierung, eine Stelle je Wahrheit); „bestellung“ und „signature“ sind nach der Ergänzung umgesetzt. Jeder Blocker und jeder wichtige Kritikpunkt ist in §5.2 gelöst oder begründet abgelehnt.

---

## 1. Zielbild

1. Jeder Fensteranbieter bekommt seinen eigenen Fenster-Konfigurator auf einer eigenen Domain (z. B. `brandt-fenster.app`). Die Domain liegt im Cloudflare-Konto des Inhabers und hängt am selben Worker wie eeziframes.com. Neue Kunden brauchen keinen Eingriff in Code oder Repo, alles je Kunde steht in der Datenbank und wird in der Zentrale gepflegt.
2. Hausbesitzer planen dort kostenlos und ohne Konto. Sie sehen nur die Marke des Betriebs (Essential mit deutlichem „Powered by EEZIframes“, Plus mit dezentem Fußhinweis, Signature ganz ohne eeziframes). Nach dem Senden sehen sie eine Bestätigung und können ihre Anfrage als PDF behalten.
3. Jede Anfrage geht als E-Mail mit dem fertigen Aufmaßblatt-PDF an den Betrieb: Klärungsliste, Zeichnung, Notizen, Wünsche, „Antworten“ geht direkt an den Hausbesitzer. Signature-Betriebe haben dazu unter `https://<ihre-domain>/betrieb/` ein Dashboard in ihrer Marke, mit Einladungslinks, Fortschritt und Status eingeladen / in Bearbeitung / eingereicht.
4. Auf eeziframes.com bestellt der Fensteranbieter ein Paket, zahlt die Einrichtungsgebühr vorab über Stripe und verfolgt in seinem Kundenkonto `/partner/` den Weg von „Bestellt“ bis „Live“. Dort schreibt er dem Inhaber Nachrichten, bittet um Rückruf, gibt die Vorschau frei und sieht Rechnungen und Abo. Das Monatsabo startet beim Live-Schalten, bei Zahlungsausfall oder Kündigung wird die Instanz pausiert und nach Frist gelöscht.
5. eeziframes.com bleibt für das Aufmaß der Hauseigentümer, wie es ist, und wird zur Verkaufsseite für die drei Pakete. Bestehende Betriebskonten und Kundenlinks laufen unverändert weiter, werden aber nicht mehr beworben.

---

## 2. Datenmodell und Migration

### 2.1 Eine Stelle je Wahrheit (löst Blocker K2.2)

| Was | Einzige Stelle | Wer schreibt |
|---|---|---|
| Paket einer Instanz | `instanzen.paket` | nur `paketWechseln()` (functions/api/bestellung.js), die zugleich den Stripe-Preis umstellt; der Tageslauf gleicht beides ab |
| Paket bei Bestellung (Preis- und Vertragsstand) | `bestellungen.paket_bestellt`, `bestellungen.preise` | Bestellformular, danach unveränderlich |
| Merkmale je Paket, Preise, Fristen je Paket | `web/assets/pakete.js` | Code (eine Datei) |
| Zustände der Instanz und der Bestellung, Übergänge, globale Fristen und Grenzen | `web/assets/instanzregeln.js` | Code (eine Datei) |
| Host → Instanz | `instanz_hosts` | Zentrale |
| Projekte und Anfragen jeder Instanz (Website-Anfragen und Signature-Einladungen) | `anfragen` (eine Zeile = ein Link-Objekt wie `betriebe.daten.links[]`) | Server über den Adapter (§2.5) |
| Profil der Startansicht (Gruß, Ansprechpartner, Telefon, Bestellmaß, Benachrichtigungen) | `betriebe.daten` der Instanz-Betriebszeile (wie heute, einladung.js:54-81) | Zentrale, Signature-Dashboard |
| Marke (Name, Farbe, Bilder, Titel, Startbilder) | `instanzen.marke` (veröffentlicht), `instanzen.entwurf` (in Arbeit) | Zentrale |
| Empfänger der Anfragen | `instanzen.eingang.mails[]` mit `bestaetigt` | Zentrale bzw. Kundenkonto, nur mit Bestätigung |
| Dashboard-Zugänge (Signature) | `instanzen.zugang[]` | Zentrale |
| Geschäftsbeziehung Fensteranbieter ↔ Inhaber | `partner`, `bestellungen`, `partner_nachrichten` | Kundenkonto, Zentrale, Stripe-Webhook |
| Altbestand | `betriebe` (unverändert), `daten.links` | wie heute |

### 2.2 SQL (an `supabase/schema.sql` anhängen; die Datei bleibt erneut ausführbar)

```sql
-- ===== Konfigurator-Instanzen und Pakete (docs/INSTANZEN.md, docs/BESTELLUNG.md) =====
-- Fensteranbieter als Kunden des Inhabers: Kundenkonto /partner/ auf eeziframes.com, getrennt von betriebe (Altbestand)
create table if not exists public.partner (
  id              uuid primary key default gen_random_uuid(),
  auth_user       uuid unique references auth.users(id) on delete set null,
  mail            text unique not null,                       -- Anmeldung, klein
  firma           text not null,
  name_norm       text,                                       -- Hinweis „mögliche Doppelbestellung“, kein Block
  plz             text,
  daten           jsonb not null default '{}'::jsonb,         -- Anschrift, USt-IdNr., Ansprechpartner, Erreichbarkeit, Impressumsangaben, Bundesland
  stripe_customer text unique,                                -- nie in betriebe; Stripe-Objekte tragen nie metadata.betrieb
  version         integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create sequence if not exists public.bestellung_nr;
create table if not exists public.bestellungen (
  id             uuid primary key default gen_random_uuid(),
  nr             text unique not null default ('B-' || to_char(now() at time zone 'Europe/Berlin', 'YYYY') || '-' || lpad(nextval('public.bestellung_nr')::text, 4, '0')),
  partner        uuid not null references public.partner(id) on delete restrict,
  paket_bestellt text not null check (paket_bestellt in ('essential','plus','signature')),
  status         text not null default 'offen' check (status in ('offen','bezahlt','einrichtung','domain','freigabe','live','pausiert','beendet','storniert')),
  abo_status     text not null default '' check (abo_status in ('','aktiv','zahlung_offen','gekuendigt','ausgesetzt','beendet')),
  preise         jsonb not null default '{}'::jsonb,          -- Stand bei Bestellung: { monat, einrichtung, mwst, name, stand }
  wunsch         jsonb not null default '{}'::jsonb,          -- Anzeigename, Domains, Eingang, Zugänge, Farben, Texte, Notizen
  dateien        jsonb not null default '[]'::jsonb,          -- [{ id, art: logo|foto|ap|druck, name, typ, bytes, zeit }]
  zahlung        jsonb not null default '{}'::jsonb,          -- { status: ''|kasse|laeuft|bezahlt|fehlgeschlagen|erstattet, session, pi, pm, betrag_cent, rechnung }
  abo            jsonb not null default '{}'::jsonb,          -- { id, preis, seit, bis, kulanz_bis, ende, grund, offeneRechnung, n }
  instanz        uuid,                                        -- gesetzt bei „Instanz anlegen“ (ohne Fremdschlüssel: Reihenfolge der Tabellen egal)
  vorschau       jsonb not null default '{}'::jsonb,          -- { version, bis, gesendet, freigabe: { version, zeit, netz }, aenderung }
  zustimmung     jsonb not null default '{}'::jsonb,          -- { stand, unternehmer, avv, zeit, netz }
  verlauf        jsonb not null default '[]'::jsonb,          -- höchstens 200 Einträge
  notiz          text not null default '',
  version        integer not null default 0,
  bezahlt_am     timestamptz, live_am timestamptz, pause_seit timestamptz, ende_am timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists bestellungen_partner_idx on public.bestellungen (partner, created_at desc);
create index if not exists bestellungen_status_idx  on public.bestellungen (status, updated_at);
create unique index if not exists bestellungen_session_uidx on public.bestellungen ((zahlung->>'session')) where zahlung ? 'session';
create unique index if not exists bestellungen_pi_uidx      on public.bestellungen ((zahlung->>'pi'))      where zahlung ? 'pi';
create index if not exists bestellungen_abo_idx on public.bestellungen ((abo->>'id'));

create table if not exists public.partner_nachrichten (
  id          uuid primary key default gen_random_uuid(),
  partner     uuid not null references public.partner(id) on delete cascade,
  bestellung  uuid references public.bestellungen(id) on delete set null,
  von         text not null check (von in ('partner','inhaber','system')),
  art         text not null default 'text' check (art in ('text','rueckruf','freigabe','aenderung','frage')),
  text        text not null default '',
  dateien     jsonb not null default '[]'::jsonb,
  rueckruf    jsonb,                                          -- { tag, fenster, tel, thema, erledigt?, notiz? }
  gelesen_at  timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists partner_nachrichten_idx on public.partner_nachrichten (partner, created_at desc);

-- Eine Instanz = ein Mandant mit Paket; dazu genau eine Betriebszeile (entwuerfe.betrieb, Profil der Startansicht, Dashboard)
create table if not exists public.instanzen (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null check (slug ~ '^[a-z0-9-]{3,40}$'),
  betrieb     uuid unique not null references public.betriebe(id) on delete restrict,
  partner     uuid references public.partner(id) on delete set null,
  bestellung  uuid references public.bestellungen(id) on delete set null,
  paket       text not null check (paket in ('essential','plus','signature')),
  status      text not null default 'einrichtung' check (status in ('einrichtung','aktiv','pausiert','beendet')),
  abweichung  jsonb not null default '{}'::jsonb,             -- einzelne Merkmale überschreiben (Kulanz), nur Schlüssel aus pakete.js
  marke       jsonb not null default '{}'::jsonb,             -- veröffentlicht: { name, titel, beschreibung, farbe, bilder:{logo,icon32,icon180,icon512,og,start:[],ap}, start:{kicker,ueberschrift,text} }
  entwurf     jsonb,                                          -- Gestaltung in Arbeit (Zentrale), gleiche Form
  eingang     jsonb not null default '{"mails":[]}'::jsonb,   -- { mails:[{ mail, bestaetigt: ISO|null, eingeladen: ISO }], absendername }
  zugang      jsonb not null default '[]'::jsonb,             -- Signature: [{ mail, uid, name, rolle, bestaetigt, zuletzt, aus }]
  recht       jsonb not null default '{}'::jsonb,             -- Impressum- und Datenschutzangaben, Bundesland, Stand
  indexierung boolean not null default false,
  demo        boolean not null default false,                 -- Demo-Instanz der Verkaufsseite: Anfragen an MAIL_KONTAKT, nach 1 Tag weg
  nr_jahr     integer, nr_zaehler integer not null default 0,
  version     integer not null default 1,                     -- Cache-Schlüssel, Bildpfade /marke/<version>/…
  pause_seit  timestamptz, pause_bis timestamptz, ende_am timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists instanzen_status_idx on public.instanzen (status);
create index if not exists instanzen_zugang_idx on public.instanzen using gin (zugang jsonb_path_ops);

create table if not exists public.instanz_hosts (
  host       text primary key check (host = lower(host) and host !~ '^www\.' and host !~ ':'),
  instanz    uuid not null references public.instanzen(id) on delete cascade,
  haupt      boolean not null default false,
  weg        text not null default 'zone' check (weg in ('zone','saas')),
  status     text not null default 'einrichtung' check (status in ('einrichtung','aktiv','umleiten')),
  registrar  jsonb not null default '{}'::jsonb,              -- { anbieter, ablauf, autoRenew, zone_id, domain_ids:{apex,www} }
  pruefung   jsonb not null default '{}'::jsonb,              -- { zeit, ok, api, dns, ping, fehler }
  created_at timestamptz not null default now()
);
create unique index if not exists instanz_hosts_haupt_idx on public.instanz_hosts (instanz) where haupt;
create index if not exists instanz_hosts_instanz_idx on public.instanz_hosts (instanz);

-- Projekte der Instanzen: daten = Link-Objekt wie betriebe.daten.links[] (modell.js bleibt unverändert nutzbar)
create table if not exists public.anfragen (
  code           text primary key check (code ~ '^[a-z0-9]{10}$'),
  instanz        uuid not null references public.instanzen(id) on delete cascade,
  betrieb        uuid not null references public.betriebe(id) on delete cascade,
  lid            text not null,
  art            text not null check (art in ('website','einladung','test','demo')),
  status         text not null default 'erstellt',
  nr             text,
  daten          jsonb not null default '{}'::jsonb,
  versand        jsonb not null default '{}'::jsonb,         -- { runde, status: offen|gesendet|zugestellt|bounce|beschwerde|fehler, versuche, naechster, id, bytes, ohneFotos }
  version        integer not null default 0,
  eingegangen_at timestamptz,
  loeschen_ab    timestamptz,                                 -- Essential/Plus: 30 Tage nach Zustellung; Test/Demo: 1 Tag
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create unique index if not exists anfragen_lid_uidx on public.anfragen (betrieb, lid);
create index if not exists anfragen_betrieb_idx on public.anfragen (betrieb, updated_at desc);
create index if not exists anfragen_versand_idx on public.anfragen ((versand->>'status')) where eingegangen_at is not null;
create index if not exists anfragen_mailid_idx  on public.anfragen ((versand->>'id'));
create index if not exists anfragen_loeschen_idx on public.anfragen (loeschen_ab) where loeschen_ab is not null;

-- Laufende Projektnummer je Instanz und Jahr, atomar: P-JJJJ-NNN (wie modell.js nextNr, aber ohne alle Links zu laden)
create or replace function public.instanz_nr(p_instanz uuid) returns text language plpgsql set search_path = '' as $$
declare j integer := extract(year from now() at time zone 'Europe/Berlin')::integer; n integer;
begin
  update public.instanzen set nr_zaehler = case when nr_jahr = j then nr_zaehler + 1 else 1 end, nr_jahr = j
   where id = p_instanz returning nr_zaehler into n;
  if n is null then raise exception 'instanz_fehlt'; end if;
  return 'P-' || j || '-' || lpad(n::text, 3, '0');
end $$;

-- Host → Instanz in einer Abfrage (ohne Gestaltungsentwurf und ohne Zugänge; die lädt nur das Dashboard)
create or replace function public.instanz_fuer_host(p_host text) returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'host', h.host, 'haupt', h.haupt, 'hostStatus', h.status,
    'haupthost', (select h2.host from public.instanz_hosts h2 where h2.instanz = i.id and h2.haupt limit 1),
    'instanz', to_jsonb(i) - 'entwurf' - 'zugang',
    'betrieb', jsonb_build_object('id', b.id, 'name', b.name, 'plz', b.plz,
       'einladung', b.daten->'einladung', 'ap', b.daten->'ap', 'tel', b.daten->'tel', 'mail', b.daten->'mail', 'du', b.daten->'du',
       'sperre', b.daten->'verwaltung'->'sperre'))
  from public.instanz_hosts h join public.instanzen i on i.id = h.instanz join public.betriebe b on b.id = i.betrieb
  where h.host = lower(p_host) $$;

-- Instanz mit Betriebszeile atomar anlegen; betriebe.mail ist unique not null (Zeile 15) → Platzhalter auf .invalid,
-- der nie Post bekommt (post.js lehnt .invalid ab; Mails an Instanzen gehen nur an instanzen.eingang)
create or replace function public.instanz_anlegen(p jsonb) returns uuid language plpgsql set search_path = '' as $$
declare b uuid; i uuid := gen_random_uuid();
begin
  insert into public.betriebe (mail, name, plz, daten)
    values ('i-' || replace(i::text, '-', '') || '@instanz.invalid', p->>'name', p->>'plz',
            coalesce(p->'betriebDaten', '{}'::jsonb) || jsonb_build_object('konto', 'instanz', 'instanz', jsonb_build_object('id', i)))
    returning id into b;
  insert into public.instanzen (id, slug, betrieb, partner, bestellung, paket, eingang, zugang, recht, entwurf, demo)
    values (i, p->>'slug', b, nullif(p->>'partner', '')::uuid, nullif(p->>'bestellung', '')::uuid, p->>'paket',
            coalesce(p->'eingang', '{"mails":[]}'::jsonb), coalesce(p->'zugang', '[]'::jsonb), coalesce(p->'recht', '{}'::jsonb),
            p->'entwurf', coalesce((p->>'demo')::boolean, false));
  return i;
end $$;

alter table public.partner            enable row level security;
alter table public.bestellungen       enable row level security;
alter table public.partner_nachrichten enable row level security;
alter table public.instanzen          enable row level security;
alter table public.instanz_hosts      enable row level security;
alter table public.anfragen           enable row level security;
revoke all on public.partner, public.bestellungen, public.partner_nachrichten, public.instanzen, public.instanz_hosts, public.anfragen from anon, authenticated;
revoke all on function public.instanz_nr(uuid), public.instanz_fuer_host(text), public.instanz_anlegen(jsonb) from public, anon, authenticated;
grant select, insert, update, delete on public.partner, public.bestellungen, public.partner_nachrichten, public.instanzen, public.instanz_hosts, public.anfragen to service_role;
grant usage, select on sequence public.bestellung_nr to service_role;
grant execute on function public.instanz_nr(uuid), public.instanz_fuer_host(text), public.instanz_anlegen(jsonb) to service_role;
drop trigger if exists partner_touch on public.partner;           create trigger partner_touch before update on public.partner for each row execute function public.eeziframes_touch();
drop trigger if exists bestellungen_touch on public.bestellungen; create trigger bestellungen_touch before update on public.bestellungen for each row execute function public.eeziframes_touch();
drop trigger if exists instanzen_touch on public.instanzen;       create trigger instanzen_touch before update on public.instanzen for each row execute function public.eeziframes_touch();
drop trigger if exists anfragen_touch on public.anfragen;         create trigger anfragen_touch before update on public.anfragen for each row execute function public.eeziframes_touch();
```

Hinweis: Der Block steht hinter `eeziframes_touch()` (schema.sql:180) bzw. die Trigger-Zeilen kommen ans Dateiende. Bestehende Tabellen und Daten werden nicht migriert.

### 2.3 Storage (private Buckets, legt der Server beim ersten Gebrauch an, Muster fotos.js:64-70)

| Bucket | Inhalt | Typen, Größe | Pfad |
|---|---|---|---|
| `fotos` (vorhanden) | Fotos der Anfragen, neu zusätzlich kleine Fassung `<id>k` (640 px, JPEG 0,7) | JPEG, 1 MB | `link/<code>/<id>.jpg`, `link/<code>/<id>k.jpg` |
| `marke` | veröffentlichte Bilder der Instanz | PNG, JPEG, WebP, 2 MB | `instanz/<id>/<version>/<name>` |
| `bestellungen` | Uploads aus dem Bestellformular | PNG, JPEG, WebP, SVG, PDF, 1 MB | `partner/<partner>/<bestellung>/<datei>.<endung>` |
| `blatt` | abgelegte Aufmaßblätter (nur Signature, `pdfAblage`) | PDF, 10 MB | `instanz/<id>/<code>-<runde>.pdf` |

`FOTO_ID` (fotos.js:34) wird `/^b[a-z0-9]{12,24}k?$/`. `ablage(k)` (fotos.js:43) bekommt einen Parameter `art` (fotos|marke|bestellungen|blatt).

### 2.4 Betriebszeile einer Instanz

- Angelegt nur über `instanz_anlegen` (atomar mit der Instanz): `mail` = Platzhalter `i-<id>@instanz.invalid`, `auth_user` = null, kein `stripe_customer`, `daten = { konto: 'instanz', instanz: { id }, einladung, ap, tel, since }`.
- Darin bleibt nur das Profil (einladung.js `einstellungen`, Ansprechpartner, Bestellmaß `abzug`, `prefs`, `notif`). Es gibt keine `links`, kein `book`.
- Keine Umstellung von Altbestandskonten (Entscheidung E24): Bestellt ein Bestandsbetrieb ein Paket, bekommt er eine neue Instanz; sein altes Konto läuft getrennt weiter.

### 2.5 Link-Objekt in `anfragen.daten` und Pseudo-Konto (modell.js unverändert nutzbar)

Neues Modul `functions/instanz/adapter.js` (Strang A):

```js
linkAufloesen(ctx, code) → { art: 'alt'|'anfrage'|'virtuell', row, l, anfrage?, entwurf? }
  // Hauptdomain (kein ctx.instanz): bisheriger Weg betriebNachCode (speicher.js:146); Zeilen mit daten.instanz → linkUnbekannt
  // Instanz-Host: Code muss /^[a-z0-9]{10}$/ sein; anfrageHolen(code) mit anfrage.instanz === ctx.instanz.id → 'anfrage';
  //   sonst entwurfHolen(code) mit meta.instanz.id === ctx.instanz.id → 'virtuell' { code, status:'arbeit', kunde:'', instanz:true, virtuell:true };
  //   sonst linkUnbekannt (konten.js:278ff. Verhalten)
linkAendern(ctx, aufl, fn)
  // 'alt': betriebAendern wie heute; 'anfrage': anfrageAendern(code, (z) => { a = pseudoKonto(betriebDaten, z.daten); r = fn(a, a.links[0]); z.daten = a.links[0]; z.status = z.daten.status; … })
  //   danach nur bei m.dashboard die gesammelten a.notif per betriebAendern an die Betriebszeile hängen (melden, konten.js:27)
pseudoKonto(daten, l) = { konto: 'instanz', links: l ? [l] : [], book: [], notif: [], abzug: daten.abzug, prefs: daten.prefs, since: daten.since }
```

`importCode`, `fortschritt`, `projektAendern`, `neuesProjekt`, `nbAnfragen` laufen auf dem Pseudo-Konto. Dessen `book` wird verworfen. Die Projektnummer kommt aus `instanz_nr()`, nicht aus `nextNr` (modell.js:1072 sähe nur einen Link).

### 2.6 Speicherfunktionen (functions/api/speicher.js, Supabase und Attrappe, Strang S0)

- Instanzen: `instanzFuerHost(host)` (RPC), `instanzHolen(id)`, `instanzVonBetrieb(betriebId)`, `instanzAnlegen(p)` (RPC), `instanzAendern(id, fn)` (mit `version`, 4 Versuche wie speicher.js:150-158), `instanzenAlle({ status })`, `instanzNr(id)` (RPC), `instanzLoeschen(id)`.
- Hosts: `hostsVon(instanz)`, `hostAnlegen(row)` (Fehler `host_vergeben` bei Konflikt), `hostAendern(host, patch)`, `hostLoeschen(host)`.
- Anfragen: `anfrageHolen(code)`, `anfrageNachLid(betrieb, lid)`, `anfrageAnlegen(row)` (409 bei Konflikt), `anfrageAendern(code, fn)` (version, 4 Versuche), `anfragenVonBetrieb(betrieb, { kopf, seit })` (kopf: ohne `daten.aufmass`, `daten.vorher`), `anfragenStand(betrieb)` → `{ stand, anzahl }`, `anfrageNachMailId(id)`, `anfragenFaellig(jetzt)` (versand offen und `naechster` erreicht), `anfragenZuLoeschen(jetzt)`, `anfrageLoeschen(code)`.
- Entwürfe: `entwurfAnlegen(code, betrieb, meta)` (nur einfügen, nie überschreiben), `entwuerfeVonBetrieb(betrieb)` (vorhanden, nur meta und Zeiten, speicher.js:88/231).
- Partner, Bestellungen, Nachrichten wie entwurf-bestellung §2.3 (`partnerHolen/NachAuth/NachMail/Anlegen/Aendern/Alle`, `bestellungHolen/VonPartner/Anlegen/Aendern/NachSession/NachPi/NachAbo/Liste`, `nachrichtAnlegen/nachrichtenVon/nachrichtenGelesen/rueckrufeOffen/nachrichtAendern`).
- `geschuetzteNutzer()` → Set aller `partner.auth_user` und `instanzen.zugang[].uid` (fürs Aufräumen, zentrale.js:714).
- `zaehlerLesen(tag, schluessel[])` für dauerhafte Tageszähler aus `statistik` (Budgets, §2b).
- Fehlt eine Tabelle, liefern lesende Funktionen `undefined` (Option `optional`), so wie heute.

### 2.7 Zustände der Instanz: was in welchem Status offen ist (`web/assets/instanzregeln.js`, löst K1.6)

| Status | Seite `/` | Impressum, Datenschutz | Endkunde schreibt (start, entwurf, foto, aufmass, fortschritt) | Link lesen | KI | Dashboard lesen | Dashboard schreiben | Einladen | Export |
|---|---|---|---|---|---|---|---|---|---|
| `einrichtung` ohne Vorschau | 503 „in Vorbereitung“, neutral | ja | nein | nein | nein | ja | nur Profil | nein | ja |
| `einrichtung` mit Vorschau-Cookie | ja, Band „Vorschau“ | ja | ja, als `art: 'test'` (Betreff „[Test]“, nicht gezählt, nach 1 Tag weg) | ja | ja | ja | nur Profil | nein | ja |
| `aktiv` | ja | ja | ja | ja | ja | ja | ja | ja | ja |
| `pausiert` | 503 mit Name und Kontakt des Betriebs, ohne Formular | ja | nein | nein (503) | nein | ja | nur `klaer`, `stage`, `memo`, `seen` | nein | ja |
| `beendet` | 410 neutral | ja | nein | nein | nein | nein | nein | nein | ja, bis zur Löschung |

`Instanzregeln.darf(status, bereich, { vorschau })` ist die einzige Abfrage; Server (A, E) und Zentrale (C) nutzen sie. Prüfung 23.4: In `pausiert` und `beendet` antwortet jede Schreibroute für Endkunden mit ≠ 2xx.

Fristen und Grenzen ebenfalls dort (Vorschläge gelten bis zur Antwort auf §5.3):

```js
FRISTEN = { kulanzTage: 14, pauseMaxTage: 60, loeschenNachEndeTage: 30, entwurfLeerStunden: 24, entwurfStillTage: 30,
  unzustellbarTage: 60, testTage: 1, vorschauTage: 30, fotosSignatureTage: 365, bestellEntwurfTage: 30,
  nachrichtenJahre: 3, belegeJahre: 8, freigabeErinnerung: [3, 7], frischMinuten: 15, sitzungTage: 14, domainWarnTage: 30 }
GRENZEN = { anfragenIpTag: 10, fotosJeFenster: 2, fotosZusatz: 4, kiJeCode: 60, fotoTagInstanz: 1500, otpFehlerMailTag: 10,
  dateienBestellung: 12, dateiBytes: 1000000, summeBestellung: 10000000, nachrichtenStunde: 20, eingangMails: 3,
  pdfBudget: 5000000, anhangMax: 7000000, startsTagInstanzHart: 5000 }
```

### 2.8 Bestellstatus und Abo-Zustand (ebenfalls `instanzregeln.js`)

Statusleiste beim Partner: **Bestellt** (`offen`) → **Bezahlt** → **In Einrichtung** → **Domain gesichert** → **Zur Freigabe** (Vorschau) → **Live**. Danach ersetzt eine Abo-Karte die Leiste: Aktiv · Zahlung offen (Kulanz bis …) · Gekündigt zum … · Pausiert · Beendet. Übergänge wie entwurf-bestellung §3.2, mit drei Änderungen:
- `offen → bezahlt` nur über `einrichtungUebernehmen` mit Bindung an die Bestellung (§3 Strang D, K1.8).
- `live → pausiert` auch durch `pauseMaxTage`-Ablauf; `pausiert` länger als 60 Tage → Server beendet das Abo (`paketAboBeenden`) → `beendet`, Löschung nach 30 Tagen (K1.5).
- Kulanz führt der Server (K2.1): erste fehlgeschlagene Abbuchung → `zahlung_offen`, `kulanz_bis = +14 Tage`; Tageslauf pausiert danach. Die Stripe-Kontoeinstellung „Abo kündigen“ bleibt; `customer.subscription.deleted` → Instanz pausiert, „Abo neu starten“ in der Zentrale.

---

## 2b. Merkmal × Paket (`web/assets/pakete.js`, die einzige Stelle)

`pakete.js` ist UMD wie modell.js: `window.Pakete` im Browser, `globalThis.Pakete` im Worker (Import in router.js wie modell.js, router.js:20-21). API: `PAKETE`, `MERKMALE` (Beschriftung für Verkaufsseite und Zentrale), `merkmale(paket, abweichung)` → eingefrorenes Objekt, `oeffentlich(m)` (Teilmenge für den Browser), `preisText(paket, art, mwst)`, `liste()`. Ein Merkmal in ein anderes Paket zu schieben heißt, eine Zelle zu ändern. Prüfung 23.10: Kein `paket ===` / `paket ==` außerhalb von pakete.js, `konto` wird nie aus einem Paket gesetzt.

| Merkmal | Bedeutung | Essential | Plus | Signature | Wird gelesen in |
|---|---|---|---|---|---|
| `preis.monat` / `preis.einrichtung` | netto zzgl. MwSt. (vorläufig) | 29 € / 99 € | 39 € / 199 € | 64 € / 279 € | functions/pakete-seite.js (Verkaufsseite), web/assets/partner.js (Formular), functions/api/stripe.js `paketPreis`, functions/api/bestellung.js (Preisstand) |
| `name` | Paketname | EEZI Essential | EEZI Essential Plus | EEZI Signature | dieselben Stellen, Mails |
| `domain`, `konfigurator`, `eingangMail` | eigene Domain, voller Konfigurator (KI, Klärungsliste, Zeichnung), jede Anfrage per Mail mit PDF | ja | ja | ja | pakete-seite.js (Vergleich); `eingangMail`: functions/api/eingang.js `eingangVerarbeiten` |
| `gestaltung` | `standard` (eeziframes-Design, Name als Text) / `eigen` | standard | eigen | eigen | functions/instanz/seiten.js `kopf()`, web/assets/zentrale.js (Editor), web/assets/partner.js (Formularschritt Gestaltung) |
| `logo` | Logo in Kopf, Startansicht, PDF, Mail | nein | ja | ja | functions/instanz/mandant.js `auftritt()`, functions/api/blatt-server.js, functions/api/eingang.js |
| `farbe` | Firmenfarbe als `--accent` (Kontrast ≥ 4,5:1 gegen #161616) | nein | ja | ja | functions/instanz/seiten.js `kopf()` |
| `fotos` | Unternehmensfotos in der Startansicht | 0 | 6 | 6 | web/assets/einladung.js `html()`, functions/instanz/verwalten.js `bildAblegen`, web/assets/partner.js |
| `startansicht` | eigener Titel, Kicker, Text, Begrüßung | nein | ja | ja | web/assets/einladung.js `html()`, functions/instanz/seiten.js (`<title>`, description) |
| `icons` | Favicon, Touch-Icon, OG-Bild, Manifest | `eezi` | `betrieb` | `betrieb` | functions/instanz/seiten.js `icons()` |
| `kennzeichnung` | Hinweis in der App | `deutlich` („Powered by EEZIframes“ mit Zeichen, verlinkt auf /fuer-fensterbauer/) | `dezent` (kleiner Text „Konfigurator von eeziframes“ im Fuß) | `keine` | web/assets/app.js `rechtLinks()`, web/assets/einladung.js `fuss()`, functions/instanz/seiten.js (`<title>`-Zusatz nur bei `deutlich`) |
| `pdfKennzeichnung` | im Aufmaßblatt | `deutlich` (Untertitel und Fuß) | `dezent` (nur Fuß) | `keine` (auch nicht als Autor) | functions/api/blatt-server.js → web/assets/blatt.js Option `kennzeichnung`; web/assets/app.js „Meine Anfrage als PDF“ |
| `mailKennzeichnung` | Rahmen der Mails an den Betrieb | `deutlich` (eeziframes-Rahmen) | `dezent` (Logo des Betriebs, Fußzeile „Konfigurator von eeziframes“) | `keine` | functions/api/eingang.js → functions/api/post.js `mailRahmen(…, { marke })` |
| `absender` | Absenderadresse | `instanz` (`MAIL_ABSENDER_INSTANZ`) | `instanz` | `neutral` (`MAIL_ABSENDER_NEUTRAL`, sonst `instanz`) | functions/api/eingang.js, functions/api/dashboard.js `mailCode` |
| `rechtNennung` | eeziframes in Datenschutz und KI-Dialog | `name` | `name` | `kategorie` („technischer Dienstleister“) | functions/instanz/recht.js, web/assets/gemeinsam.js (KI-Einwilligung) |
| `indexierung` | Suchmaschinen | nein (noindex, kein Disallow) | nur `/` | nur `/` | functions/instanz/seiten.js `robots()` und `X-Robots-Tag` |
| `kopieKunde` | „Meine Anfrage als PDF“ nach dem Senden | ja | ja | ja | web/assets/app.js (Bestätigung) |
| `fotoLinkTage` | Link auf Originalfotos in der Mail | 14 | 14 | 0 | functions/api/eingang.js, functions/api/instanz-api.js (Fotoseite) |
| `aufbewahrung` | Anfrage auf dem Server | `30` Tage nach Zustellung | `30` | `vertrag` (Fotos 365 Tage) | functions/api/eingang.js (`loeschen_ab`), `anfragenAufraeumen` |
| `pdfAblage` | PDF beim Eingang ablegen („Unterlagen jederzeit“) | nein | nein | ja | functions/api/eingang.js |
| `dashboard` | `/betrieb/` und Anmeldung | nein | nein | ja | functions/instanz/seiten.js, functions/api/dashboard.js `kontoVon` |
| `einladungslinks` | persönliche Links auf die eigene Domain | nein | nein | ja | functions/api/dashboard.js (Projekte anlegen) |
| `fortschritt` | laufende Planungen und Status sehen | nein | nein | ja | functions/api/dashboard.js `dashboardSicht` |
| `zugaenge` | Dashboard-Zugänge | 0 | 0 | 5 | functions/api/zentrale-instanzen.js, functions/api/dashboard.js |
| `kiMonat` | Alarmgrenze KI-Auswertungen je Monat (hart = 2×) | 600 | 1000 | 2000 | functions/api/ki.js |
| `anfragenTag` | Alarmgrenze Anfragen je Tag (hart = 4×) | 50 | 50 | 100 | functions/api/konten.js `POST /api/aufmass` (Instanz-Zweig) |

`Pakete.oeffentlich(m)` gibt an den Browser nur `gestaltung, logo, farbe, fotos, startansicht, kennzeichnung, rechtNennung, kopieKunde, dashboard`.
Paketschlüssel bleiben `essential | plus | signature` (Vorgabe des Inhabers). Verwechslung mit dem Altbestandstarif `plus` (modell.js:1047) ist ausgeschlossen, weil Pakete nur im Feld `paket` stehen und Instanzkonten den Tarif `konto: 'instanz'` haben (§3 Strang A).

---

## 3. Stränge für den Bau

### 3.0 Reihenfolge, Regeln, Verträge

**Ablauf heute Nacht** (je zwei Stränge gleichzeitig, jeder in eigenem Worktree auf eigenem Zweig; der Integrator führt nach jeder Welle zusammen):

| Schritt | Stränge | Warum diese Paarung |
|---|---|---|
| 0 | **S0 Fundament** (Integrator, allein) | legt Verträge, Schema, gemeinsame Dateien fest; danach gehört jede Datei genau einem Strang |
| Welle 1 | **A Server-Kern** ∥ **D Kundenkonto, Bestellung, Stripe** | berühren getrennte Dateien; C und E brauchen beide |
| Welle 2 | **B Konfigurator-App** ∥ **C Zentrale** | B braucht A (config.js, Start, Blatt-Variante), C braucht A und D |
| Welle 3 | **E Signature-Dashboard** ∥ **F Verkaufsseite, Recht, Doku** | E braucht A, B, C; F braucht D (Bestell-Einstieg) und alle Texte |
| Schluss | **I Integrator**: Abschnitt 30 (Ende zu Ende), Vollsuite 1–30, Bildschirmfotos | |

**Regeln für alle Stränge**
- Altbestand ist heilig: Die Abschnitte 1–22 von `scripts/pruefen.mjs` bleiben in jedem Strang grün. Jeder Instanz-Zweig im Server hängt an `ctx.instanz` bzw. `daten.instanz`, jeder Zweig in App und Portal an `KONFIG.instanz`.
- Dateibesitz wie in den Tabellen unten. Muss ein Strang eine fremde Datei ändern, liefert er die Änderung als Vorgabe an den Besitzer (steht hier schon drin) statt sie selbst zu machen.
- Jeder Strang schreibt seine Prüfungen in `scripts/pruefen-instanzen/<abschnitt>.mjs` (`export default async (h) => {}`); `scripts/pruefen.mjs` lädt sie über `teil(n)` (pruefen.mjs:57). Testserver mit `DATEN_ATTRAPPE=1 MAIL_ATTRAPPE=1 KI_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 INSTANZ_CACHE_MS=0` und Instanzen `essential.localhost`, `plus.localhost`, `signature.localhost`, `signature2.localhost` (Chromium löst `*.localhost` selbst auf; die API-Prüfungen nutzen `http.request` mit Kopfzeile `Host`).
- Doku: Jeder Strang legt seine Notizen in die PR-Beschreibung; F schreibt sie in die Doku.
- Commits mit den Attributionszeilen aus der Sitzung.

**Verträge zwischen den Strängen** (S0 legt sie in `docs/INSTANZEN.md` fest; Stubs mit genau diesen Namen existieren ab S0)

```js
// ctx.instanz (functions/instanz/mandant.js), gesetzt in worker.js, an api(request, env, ctx0, inst) übergeben
{ id, id8, slug, betrieb, host, haupthost, status, paket, m /* Pakete.merkmale */, version, name, du, plz,
  auftritt /* Einladung.auftritt mit freier Farbe */, marke, recht, eingang: { mails: [nur bestätigte] }, demo, indexierung,
  vorschau /* gültiges __Host-vorschau-Cookie */, kontakt: { tel, mail } }

// window.KONFIG auf Instanz-Hosts (/config.js, functions/instanz/seiten.js), per JSON.stringify mit < als <
{ marke: name, pilot: false, ki: '/api/ki', impressum: '/impressum/', datenschutz: '/datenschutz/',
  instanz: { id: id8, v: version, host, name, du, status, vorschau, m: Pakete.oeffentlich(m), auftritt,
             start: { kicker, ueberschrift, text, bilder: ['/marke/<v>/start-1.jpg'] }, farbe, akzent, kontakt: { tel, mail },
             logo: '/marke/<v>/logo.png' | '', grenzen: { fenster: 50 } } }

// HTTP (Instanz-Hosts)
POST /api/instanz/start → { ok, code, betrieb, du, auftritt }        // A
GET  /api/instanz/ping  → { ok, instanz: id8, version }              // A, für die Domain-Prüfung (C)
GET  /api/ki?aufgabe=…&code=<10>                                       // A (Code Pflicht auf Instanz-Hosts), B ruft so auf
POST /api/link/:code/foto/:id   id = b… oder b…k (kleine Fassung)     // A nimmt an, B lädt beide hoch
POST /api/aufmass → { ok, nr, betrieb, runde }                         // A
GET  /api/instanz/bestaetigen?t=  (Hauptdomain)                        // A: Empfänger- und Zugangsbestätigung

// Module
functions/instanz/verwalten.js (A): instanzAnlegen, instanzAendern, instanzStatus(ctx, id, status, grund), hostSetzen, hostEntfernen,
   hauptSetzen, markeVeroeffentlichen, bildAblegen, empfaengerEinladen(ctx, id, mail, art), vorschauToken(ctx, id, version),
   cacheLeeren(ctx, id), instanzDatenLoeschen(ctx, id)
functions/api/eingang.js (A): eingangVerarbeiten(k, sp, code, runde), versandNachholen(k, sp), eingangErneut(ctx, code),
   probeEingang(ctx, instanzId), anfragenAufraeumen(k, sp), textPdf(titel, abschnitte)
functions/api/bestellung.js (D): uebergang(ctx, id, nach, { wer, text }), einrichtungUebernehmen, paketEreignis, aboStarten(ctx, id),
   paketWechseln(ctx, id, paket, { differenz }), aboSteuern(ctx, id, aktion), bestellungenLauf(k, sp, zd, env), erstatten
functions/api/sitzung.js (S0): sitzungSetzen(ctx, bereich, { sub, mail }) → Set-Cookie; sitzungLesen(ctx, bereich, { frisch });
   tokenSignieren(k, zweck, daten, sekunden); tokenPruefen(k, zweck, token)
functions/api/bremse.js (S0): bremse(ctx, name, schluessel) → bool (Binding env.RL_*, sonst erlaubt(), umgebung.js:121);
   budget(ctx, schluessel, max, { alarm }) → { ok, stand } (dauerhafter Tageszähler über statistik)
web/assets/blatt.js (A): Blatt.pdf({ variante: 'betrieb'|'anfrage', kennzeichnung: 'deutlich'|'dezent'|'keine', marke: { name, logo, farbe, host } })
web/assets/pakete.js, web/assets/instanzregeln.js (S0)
```

---

### S0 Fundament (Integrator, allein, vor Welle 1)

**Ziel:** Alle gemeinsamen Grundlagen und Verträge stehen, damit die Stränge danach nur in eigenen Dateien arbeiten.

**Dateien**
- `supabase/schema.sql` (Block §2.2).
- `web/assets/pakete.js`, `web/assets/instanzregeln.js` (vollständig, §2b, §2.7, §2.8).
- `functions/api/speicher.js` (alle Funktionen §2.6, Supabase und Attrappe).
- `functions/api/sitzung.js` (neu): bereichsgebundene Sitzung nach dem Muster der Zentrale (zentrale.js:66-84): HMAC über `SITZUNG_GEHEIMNIS` mit `{ v, bereich: 'partner'|'betrieb', aud: host, sub, mail, iat, exp, n }`; Cookie `__Host-partner` bzw. `__Host-betrieb` (HttpOnly, Secure, SameSite=Strict, Path=/), lokal auf `*.localhost` ohne Präfix und ohne Secure, falls Chromium ablehnt. Schreibende Anfragen mit Cookie verlangen `Origin === url.origin`. `frisch`: `iat` jünger als 15 Minuten. Zweck-Token (`vorschau`, `empfaenger`, `fotos`) mit Zweck im MAC. Ohne `SITZUNG_GEHEIMNIS` (≥ 32 Zeichen) verweigert der Server Sitzungen und Token, außer mit `DATEN_ATTRAPPE=1` (fester Testwert).
- `functions/api/bremse.js` (neu, §3.0).
- `functions/api/post.js`: `senden(m)` nimmt zusätzlich `anhaenge: [{ filename, content (Base64) }]`, `von: { name, adresse }`, `idempotenz` (Kopfzeile `Idempotency-Key`), lehnt Empfänger auf `.invalid` ab (`{ ok: false, grund: 'invalid' }`), Attrappe merkt Name, Typ und Größe der Anhänge und `von`. `mailRahmen(titel, inhalt, kontakt, { marke })` mit `marke = null` (eezi wie heute), `{ name, logoCid, dezent: true }` oder `'neutral'`.
- `functions/api/fotos.js`: nur `ablage(k, art)` und `FOTO_ID` (§2.3).
- `functions/api/router.js`: Signatur `api(request, env, ctx0, inst)`, `ctx.instanz = inst || null`; neue Routenmodule in `ROUTEN` (router.js:32) aus den Stubs; `brauchtDaten` (router.js:70) auch für `/api/partner`, `/api/instanz`; Formular-Ausnahme (router.js:75) auch für `/api/partner/frage`; Cron-Weiche nach exakten Zeichenketten statt `cron !== CRON_ABRECHNUNG` (router.js:102, sonst liefe der Tageslauf alle 10 Minuten): `CRON_ABRECHNUNG`, `CRON_TAEGLICH = '17 4 * * *'`, `CRON_ZEHN = '*/10 * * * *'` mit Aufrufen `versandNachholen` (zehn), `anfragenAufraeumen`, `bestellungenLauf`, `instanzenPruefen`, `einladungenErinnern` (täglich).
- `functions/seo.js`: nur Haken: `seite()` ruft `paketeSeite(html, url)` aus `functions/pakete-seite.js` (Stub gibt html zurück); `llms()` hängt `paketeLlms()` an; `robots()` (seo.js:83) bekommt `Disallow: /partner/`; `/konfigurator-bedingungen/` in `SEITEN` (seo.js:18) und `istSeite` (seo.js:80).
- `wrangler.jsonc`: `not_found_handling` entfernt (wrangler.jsonc:16, K2.5); `run_worker_first` (wrangler.jsonc:19) zusätzlich `/config.js`, `/favicon.svg`, `/apple-touch-icon.png`, `/og.png`, `/manifest.webmanifest`, `/marke/*`, `/betrieb`, `/betrieb/*`, `/zentrale`, `/zentrale/*`, `/partner`, `/partner/*`, `/konfigurator-bedingungen`, `/konfigurator-bedingungen/*`, `/404.html`; Cron `*/10 * * * *` dazu; `ratelimits`: `RL_LINK` (60/60 s), `RL_START` (10/60 s), `RL_FOTO` (60/60 s), `RL_KI` (20/60 s), `RL_OTP` (5/60 s), `RL_FORM` (5/60 s). Kommentar: KV `INSTANZEN` und Queue `EINGANG` kommen erst mit dem Bindungs-Commit nach §4 Schritt 2; der Code läuft ohne sie. Regel als Kommentar: nie `routes` oder `custom_domain` hier (K2.18).
- `scripts/dev-server.mjs`: Adresse aus der Kopfzeile `Host` statt `localhost` (dev-server.mjs:97); jede Anfrage über `worker.default.fetch` (keine nachgebaute Weiche mehr, dev-server.mjs:98-114); `env.ASSETS` liefert bei fehlender Datei 404 ohne Fehlerseite (wie ohne `not_found_handling`); `scheduled` und eine Queue-Attrappe (ruft den Consumer direkt).
- `scripts/pruefen.mjs`: Lader für die Abschnitte 23–30 und Hilfsobjekt `h` (`ok`, `neueSeite`, `browser`, `base(host)`, `api(host, pfad, init)`, `zentrale()`, `post()`, `uhr(tage)` über `JETZT`); `scripts/pruefen-instanzen/23.mjs` … `30.mjs` als leere Module.
- Stubs mit festen Exportnamen: `functions/instanz/{mandant,seiten,adapter,verwalten,recht}.js`, `functions/api/{eingang,instanz-api,blatt-server,partner,bestellung,dashboard,zentrale-instanzen,zentrale-bestellungen,cloudflare}.js`, `functions/pakete-seite.js`. `functions/instanz/recht.js` liefert sofort ein funktionierendes Impressum aus Feldern und einen Datenschutz-Platzhalter (F ersetzt ihn).
- `docs/INSTANZEN.md` (neu): Verträge §3.0, Dateibesitz, Wellen.

**Prüfungen (Abschnitt 23, Teil 0):** `pakete.js` hat in allen Paketen alle Schlüssel, alle Preise > 0; `instanzregeln.js` hat jede Zelle der Matrix; Speicher-Attrappe: Anlegen/Lesen/Ändern mit Version für jede neue Tabelle, `instanz_nr` zählt je Instanz; `sitzung.js`: falscher Bereich, falscher Host, abgelaufen, fremder MAC → abgelehnt; `post.js`: `.invalid` abgelehnt, Anhang gemerkt.

**Abnahme:** Abschnitte 1–22 grün mit dem neuen dev-server; `NUR=23` grün; jede Stub-Datei importierbar; `docs/INSTANZEN.md` beschreibt jede Schnittstelle aus §3.0.

---

### A Server-Kern: Mandant, Paket-Merkmale, Auslieferung, Eingang mit PDF und Mail (Welle 1)

**Ziel:** Jeder fremde Host wird zur Instanz mit den Merkmalen ihres Pakets; die Instanz liefert App, Seiten und API nur nach Status-Matrix und Positivliste; jede Anfrage kommt als Mail mit PDF beim Betrieb an; Instanz-Anfragen geraten nie in die Abrechnung je Aufmaß.

**Dateien (nur A):** `worker.js`; `functions/instanz/mandant.js`, `seiten.js`, `adapter.js`, `verwalten.js`; `functions/api/eingang.js`, `instanz-api.js`, `blatt-server.js` (neu); `functions/api/konten.js` (nur `GET /api/link/:code`, `POST …/fortschritt`, `POST /api/aufmass`, `abrechnungslauf`); `functions/api/entwurf.js`; `functions/api/fotos.js` (Link-Route); `functions/api/ki.js`; `functions/api/benachrichtigung.js`; `functions/api/statistik.js`; `functions/api/umgebung.js`; `web/assets/modell.js` (nur Abrechnung und `aufmassText`); `web/assets/blatt.js`, `web/assets/blatt-schrift.js`; `scripts/pruefen-instanzen/23.mjs`, `24.mjs`.

**Umsetzung**
1. **Host-Weiche** (`worker.js:12-27`): `const host = hostVon(request)` (klein, ohne Port, ohne `www.`, IDN als Punycode). `istHaupt(host, env)` ohne Datenbank: eeziframes.com, www, Host aus `KANONISCH`, `*.workers.dev`, `localhost`, `127.*`, `[::1]`, `HAUPT_HOSTS`. Hauptdomain: bisheriger Ablauf unverändert, zusätzlich (a) fehlt eine Datei, liefert der Worker `/404.html` mit Status 404 (Ersatz für `not_found_handling`), (b) `/zentrale*`, `/partner*`, `/konfigurator-bedingungen*` und `/betrieb*` (404) bekommen über `sicher()` den vollen `SICHERHEIT`-Satz (seo.js:66), `X-Robots-Tag: noindex`, `cache-control: no-store` (K1.7), (c) Icons, `/config.js`, `/og.png` werden an `ASSETS` durchgereicht mit den Köpfen aus `_headers`. `worker.js` beachtet keine Kopfzeile, die den Host überschreibt (`X-Forwarded-Host`, `x-test-host`). Neu: `queue(batch, env, ctx)` ruft `eingangVerarbeiten`.
2. **Mandant** (`mandant.js`): `instanzVon(host, env)`: L1 Map im Isolate (Treffer 60 s, `INSTANZ_CACHE_MS`; unbekannte Hosts 300 s; höchstens 2000 Einträge); L2 `env.INSTANZEN` (KV, falls gebunden; Schlüssel `host:<host>`, schreibt `verwalten.cacheLeeren`); L3 `rpc/instanz_fuer_host`. Fällt Supabase aus, gilt der letzte bekannte Wert (L1/KV) weiter (K2.19). Ergebnis `ctx.instanz` (§3.0) mit `m = Pakete.merkmale(paket, abweichung)`, `auftritt = Einladung.auftritt(…)` mit freier Hex-Farbe. Alias-Host (nicht `haupt`) und `www.` → 301 auf den Haupthost.
3. **Auslieferung** (`seiten.js`), Routing auf Instanz-Hosts:

   | Anfrage | Antwort |
   |---|---|
   | unbekannter Host | 404 neutral (kein „eeziframes“, `noindex`, CSP) |
   | Status nach §2.7 | 503/410 neutral bzw. mit Kontakt |
   | `/`, `/index.html` | `/app/index.html` aus `ASSETS`, Kopf ersetzt: `<title>` (`marke.titel` oder „Fenster planen und anfragen · <Name>“, bei `kennzeichnung: deutlich` mit „ · Powered by EEZIframes“), description, `og:*`, `theme-color`, Icons, `<link rel="manifest">`; JSON-LD und `.vorab`-Werbetext (index.html:28-86) durch neutralen Text mit dem Namen ersetzt; bei `m.farbe` `<style>:root{--accent:…;--accent-soft:…}</style>`; ohne ETag/Last-Modified, `cache-control: no-cache` |
   | `/app`, `/app/` | 301 auf `/` (Hash bleibt im Browser) |
   | `/config.js` | erzeugt (§3.0), `max-age=60` |
   | `/favicon.svg`, `/apple-touch-icon.png`, `/og.png`, `/manifest.webmanifest` | bei `icons: 'betrieb'` aus `marke.bilder` (Initiale als escaptes SVG, wenn kein Bild), sonst die eeziframes-Dateien |
   | `/marke/<v>/<datei>` | Bild aus Bucket `marke`, `immutable`, über `caches.default` |
   | `/impressum/`, `/datenschutz/` | `functions/instanz/recht.js` |
   | `/robots.txt` | `indexierung` (Merkmal und Schalter an der Instanz): `User-agent: *`, `Disallow: /api/`, `Disallow: /betrieb/`, `Sitemap: https://<host>/sitemap.xml`; `/sitemap.xml` nur mit `/`. Ohne Indexierung: alle Seiten `X-Robots-Tag: noindex`, robots ohne Disallow (damit noindex gelesen wird, K2.9). Mit Indexierung trägt nur `/` kein noindex, Canonical auf `https://<haupthost>/` |
   | `/betrieb`, `/betrieb/` | nur bei `m.dashboard` (Hülle von E, Kopf wie `/` mit Titel „<Name> · Projekte“, `no-store`, `noindex`) |
   | `/assets/*`, `/fonts/*`, `/vendor/*`, `/bilder/*` | statisch |
   | alles andere (Ratgeber, `/fuer-fensterbauer`, `/agb`, `/widerruf`, `/cookies`, `/zentrale*`, `/partner*`, `/sitemap.xml` ohne Indexierung, `/llms.txt`, Zoho, zufällige Pfade) | 404 neutral in der Marke des Betriebs |

   API-Positivliste auf Instanz-Hosts: `GET /api/status` (`{ ok, daten, ki, post, instanz: true, zahlung: false, konten: false }`, ohne Preise, Einführung, Verkauf, Recht), `/api/ki`, `/api/instanz/*`, `/api/link/*` (GET/fortschritt/entwurf/foto), `/api/aufmass`, `/api/konto*` nur bei `m.dashboard` (E), sonst 404. Alle Texte im Kopf, im SVG und in `/config.js` laufen durch `esc()` bzw. `JSON.stringify`, jeder `.replace` mit Funktion als Ersatz (K1.11).
4. **Virtuelle Links und Adapter** (`adapter.js`, §2.5): `POST /api/instanz/start` (`instanz-api.js`): `bremse(RL_START)` je IP, Status-Matrix, harte Grenze `startsTagInstanzHart`; Code per `newCode()` (modell.js:1070), `entwurfAnlegen(code, betrieb, { instanz: { id, host, start } })`, bei Konflikt neuer Code; keine `anfragen`-Zeile. `linkFinden` (entwurf.js:67) und die Kopien in konten.js:280/291/302 und fotos.js:181 laufen über `linkAufloesen`. Virtuelle Links: `fortschritt` meldet nichts; `POST …/entwurf` gilt als `frei` (entwurf.js:196, keine Änderungszählung auf Instanzen).
5. **Fotos** (fotos.js:176ff., K1.3): Für virtuelle Codes nur IDs, die `fotoIds(entwurf.daten.windows)` nennt (inkl. `k`-Fassung), erst ab einem gespeicherten Fenster, höchstens `2 × Fenster + 4` Grund-IDs; `budget('inst:<id8>:foto', fotoTagInstanz, { alarm: 500 })`.
6. **KI** (ki.js:150ff., K1.2, K2.13): Auf Instanz-Hosts nur mit `code`, der zur Instanz gehört; Zähler je Code in `entwuerfe.meta.ki` (höchstens `min(kiJeCode, 2 × Fenster + 6)`); `budget('inst:<id8>:ki', m.kiMonat)` als Monatssumme: Alarm-Mail an `MAIL_KONTAKT` bei Erreichen, 429 erst bei 2×; globales Tagesbudget `budget('ki:tag', KI_TAG_MAX)` für alle Hosts einschließlich eeziframes.com mit Alarm bei 80 %. Die App macht ohne Auswertung weiter.
7. **Eingang** (`POST /api/aufmass`, konten.js:299ff., Instanz-Zweig): Virtueller Link → Name (≥ 2 Zeichen) und gültige Telefonnummer oder E-Mail Pflicht, sonst 400; `bremse` je IP (`anfragenIpTag`), Alarm/harte Grenze `m.anfragenTag`. Dann in **einem** Schreibvorgang: `nr = instanzNr()`, Link-Objekt `{ id, code, nr, kunde: p.name, kontakt, adresse, via: 'Website', quelle: host, host, art }`, `importCode` auf dem Pseudo-Konto, `anfrageAnlegen` mit `status: 'eingegangen'`, `versand: { runde, status: 'offen', versuche: 0 }` (K2.4). Doppeltes Senden → 409. Danach `env.EINGANG.send({ code, runde })`, ohne Queue `waitUntil(eingangVerarbeiten)`. Bestehende Anfrage (Einladung, Nachbesserung) über `linkAendern`. Fotos aufräumen und Entwurf vermerken wie konten.js:336-351. Antwort `{ ok, nr, betrieb, runde }`.
8. **PDF im Worker** (`blatt-server.js`, per `import()` geladen, K2.6): `blatt.js` und `blatt-schrift.js` auf `globalThis`, Schutz vor fehlendem `document` (blatt.js:33), `timeZone: 'Europe/Berlin'` (blatt.js:91), `logoFmt` mit WebP; neue Optionen `kennzeichnung` (Zeilen 97, 140, 181-183) und `marke`; neue Variante `anfrage` (Endkunden-Kopie in der Marke der Instanz: ohne Abzug, ohne Projekt-QR, ohne Werbeseiten). `blattFuerEingang(k, inst, z)` → `Uint8Array`: Variante `betrieb`, Fotos nur kleine Fassungen `<id>k` (fehlt sie, Original im Rahmen des Budgets), Budget `pdfBudget` 5 MB, darüber Zeile „weitere Fotos: x“. `textPdf(titel, abschnitte)` für D (Paketbedingungen im Anhang). Prüfweg wie `pdfversuch/versuch.mjs`.
9. **Mail an den Betrieb** (`eingang.js`, `eingangVerarbeiten`, idempotent über `versand.runde/status`): An: bestätigte `eingang.mails` (Demo: `MAIL_KONTAKT`); Von nach `m.absender` mit Anzeigename (Essential „EEZIframes für <Name>“, Plus „Konfigurator <Name>“, Signature „<Name> · Fensterplaner“); Antwort an: E-Mail des Kunden; Betreff „Neue Anfrage: <Kunde> · n Positionen · <Nr>“ (Test „[Test] …“); Text: Kontakt und Erreichbarkeit, Positionen, offene Klärungspunkte (Anzahl und erste 3), Wünsche und Notizen, `aufmassText` (aus portal.js:965 nach modell.js übernommen) als Textteil; Essential/Plus: Link „Originalfotos (14 Tage)“ (`/api/instanz/fotos/:code?t=`, Token Zweck `fotos`, nur auf dem Haupthost der Instanz, Abruf protokolliert); Signature: Knopf „Im Dashboard öffnen“ auf `https://<haupthost>/betrieb/#projekt-<id>` (nie `basis(ctx.url)`, benachrichtigung.js:16); nie Sperr- oder Preistext (benachrichtigung.js:30). Anhang `Aufmass-<Nr>-<Kunde>.pdf` ≤ `anhangMax` 7 MB, darüber ohne Fotos, im Notfall ohne Anhang mit „Aufmaßblatt folgt“. `Idempotency-Key: anfrage-<code>-<runde>-<n>`. Erfolg → `versand.status = 'gesendet'`, `id`; Signature: PDF in Bucket `blatt` (`pdfAblage`) und `melden` an die Betriebszeile. Fehler → `versuche++`, `naechster = jetzt + 10 min · 2^n`, nach 8 Versuchen bzw. 3 Tagen `fehler`, Hinweis in der Zentrale und Mail an `MAIL_KONTAKT`. `versandNachholen` (Cron alle 10 Minuten) holt fällige nach. `eingangMelden` (benachrichtigung.js:22) verzweigt für Instanzkonten hierher; `erinnerungenSenden` (benachrichtigung.js:51) überspringt Zeilen mit `daten.instanz`.
10. **Resend-Webhook** `POST /api/post/webhook` (`eingang.js`): Svix-Prüfung mit `RESEND_WEBHOOK_SECRET` (`svix-id`, `svix-timestamp` ±5 min, `svix-signature` = HMAC-SHA256 über `id.timestamp.body`), doppelte `svix-id` über `ereignisse`; `email.delivered` → `zugestellt`, bei `aufbewahrung` 30: `loeschen_ab = +30 Tage`; `email.bounced` → `bounce`, Hinweis in der Zentrale, Mail an den Inhaber, einmal neuer Versuch ohne Fotos; `email.complained` → `beschwerde`, Hinweis; `email.delivery_delayed` → nur vermerken.
11. **Aufbewahrung** (`anfragenAufraeumen`, täglich): Essential/Plus nach `loeschen_ab` Zeile, Fotos `link/<code>/` und Entwurf löschen; nie zugestellt → nach `unzustellbarTage` löschen mit Hinweis; Website-Entwürfe ohne Fenster nach 24 Stunden, mit Fenster nach 30 Tagen ohne Änderung, jeweils samt Fotos; Test/Demo nach 1 Tag; Signature: Fotos 365 Tage nach Eingang (wie fotos.js:33), Aufmaß und PDF bis Vertragsende. `instanzDatenLoeschen` (verwalten.js, K1.12) mit fester Liste: `anfragen`, `entwuerfe` des Betriebs, `fotos` `link/<code>` je Anfrage und Entwurf, `marke` `instanz/<id>/`, `blatt` `instanz/<id>/`, `bestellungen`-Dateien der Bestellung, Supabase-Anmeldungen der Zugänge (`anmeldungLoeschen`, auth.js:87, wenn sonst ungenutzt), KV-Schlüssel, `instanz_hosts`, danach `instanzen` und Betriebszeile.
12. **Abrechnungsschutz** (modell.js, konten.js): `RANG.instanz`/`PLAN_NAME.instanz` (modell.js:1047-1048), `konto()` kennt `instanz`; `bookAufmass` (modell.js:1112) bucht bei `instanz` 0 € „im Paket“ und sperrt nie; `planWechsel` (modell.js:1149) liefert bei `instanz` `{ art: 'paket' }`; `tickKonto` bucht ohnehin nur `plus`/`abo` (modell.js:1162-1165). `abrechnungslauf` (konten.js:359ff.) überspringt `daten.instanz`. Instanzkonten haben nie `stripe_customer`.
13. **Statistik** (statistik.js): Auf Instanz-Hosts kein `seitenaufruf`; Zähler `inst:<id8>:aufruf|start|anfrage|ki|foto`; `auswerten` (statistik.js:220) lässt `inst:` aus den eeziframes-Zahlen.
14. **verwalten.js**: Prüfungen beim Ändern: Paket nur über `paketWechseln` (D), Host-Format (klein, Punycode, keine eeziframes-Hosts, `^(?=.{4,253}$)…`), Farbe Hex mit Kontrast, Profil über `Einladung.einstellungen`; `empfaengerEinladen` schickt eine Mail mit Bestätigungslink (Token Zweck `empfaenger`, 14 Tage) an jede neue Eingangs- und Zugangsadresse; Bestätigung setzt `bestaetigt` (K1.9). Jede Änderung: `version++` wo die Marke betroffen ist, `cacheLeeren`, `protokoll(sp, 'instanz', …)`.

**Prüfungen**
- **Abschnitt 23 (Mandant, Routing, Schutz):** 23.1 Hauptdomain unverändert (`/`, `/app/`, `/config.js` bytegleich, `/zentrale/` und `/partner/` mit vollem CSP, X-Frame-Options DENY, `frame-ancestors 'none'`, `no-store`; Icons ohne X-Robots-Tag; zufälliger Pfad → `404.html` mit 404). 23.2 Unbekannter Host neutral; Kopfzeilen `X-Forwarded-Host`/`x-test-host` ändern nichts. 23.3 Routing-Matrix je Paket einschließlich zufälliger Pfade, Alias- und www-Umleitung, robots und noindex je `indexierung`, Canonical. 23.4 Status-Matrix (§2.7) mit Vorschau-Cookie. 23.5 `/config.js` je Paket, keine `preise`; Escaping mit dem Namen `Fenster "Brandt" $' <b>&` in Titel, `/config.js` (parsebar) und Initial-SVG. 23.6 `/api/status`. 23.7 Start und Host-Bindung (Code von Essential auf Plus, virtueller Code auf der Hauptdomain, Altbestandslink auf Instanz, 5-stelliger Code → je 404). 23.8 Fotos (ohne Fenster 409, fremde ID 400, zu viele 409, `k` angenommen). 23.9 KI (ohne Code, je Code, Monatsalarm einmal per Mail, hart bei 2×, globales Tagesbudget auch auf der Hauptdomain). 23.10 Abrechnung (5 Anfragen je Paket, 3 Einladungen, 1 Nachbesserung: kein Buchungsbetrag > 0, kein `locked`, `abrechnungslauf` erzeugt nichts; ein Altbestandskonto daneben wird normal abgerechnet; `grep` ohne `paket ===`). 23.11 Statistik getrennt. 23.12 Cache: Änderung wirkt mit `INSTANZ_CACHE_MS=0` sofort; Supabase-Störung (Attrappe) → `/` und `/config.js` aus L1. 23.13 `wrangler.jsonc` ohne `routes`/`custom_domain`, neue Pfade in `run_worker_first`, kein `not_found_handling`. 23.14 Manifest je Instanz.
- **Abschnitt 24 (Eingang):** 24.1 ohne Kontakt 400; mit Kontakt Zeile mit genau diesem Code, Nummern je Instanz unabhängig fortlaufend, `kunde = p.name`; zweimal 409. 24.2 Mail nur an bestätigte Adressen; Anhang `application/pdf`, `%PDF`, < 7 MB; PDF-Text (zlib) mit Betrieb, Kunde, Klärungspunkten; Kennzeichnung je Paket in PDF, Mail-HTML und Absendername (Signature: kein `/eeziframes/i`, auch nicht als Autor); Reply-To = Kunde; kein Sperr-/Preistext; Fotolink nur Essential/Plus; Dashboard-Knopf nur Signature mit `http://signature.localhost:PORT/betrieb/#projekt-…`; Signature-PDF im Bucket. 24.3 Störung (`/api/test/post?stoerung=1`) → offen, Nachholen schickt genau eine Mail, nach 8 Versuchen `fehler` mit Hinweis. 24.4 Queue-Attrappe und Rückfall ohne Queue. 24.5 Resend-Webhook: falsche Signatur 400, delivered/bounced/complained, doppelt idempotent. 24.6 40 Fotos: PDF ≤ 5 MB mit allen kleinen Fotos. 24.7 `blatt.js` ohne DOM in einer vm-Sandbox, Datum in Europe/Berlin. 24.8 Fotoseite: gültig 14 Tage, nur Haupthost der Instanz, falscher Zweck/abgelaufen 403, Signature 404. 24.9 Aufbewahrung mit vorgestellter Uhr (alle Fristen aus §2.7, Ablage-Attrappe leer). 24.10 `eingangErneut`. 24.11 Nachbesserung einer Einladung → Mail „Nachbesserung“ mit neuem PDF. 24.12 `instanzDatenLoeschen`: danach kein Pfad `instanz/<id>`, kein `link/<code>` der Instanz, Zugangs-Anmeldungen gelöscht.

**Abnahme:** Abschnitte 1–24 grün; Durchlauf mit `curl` gegen den dev-server mit `Host: essential.localhost` liefert eine Mail mit PDF in `/api/test/post`; keine Datei außerhalb der Liste geändert.

---

### D Kundenkonto, Bestellformular, Stripe auf eeziframes.com (Welle 1)

**Ziel:** Ein Fensteranbieter bestellt ein Paket, bezahlt die Einrichtung vorab und begleitet seinen Konfigurator bis Live und darüber hinaus in seinem Kundenkonto; das Abo läuft sauber neben dem Altbestand.

**Dateien (nur D):** `functions/api/partner.js`, `functions/api/bestellung.js` (neu); `functions/api/stripe.js` (Paketfunktionen anhängen); `functions/api/zahlung.js` (Weiche vor dem Zweig in zahlung.js:111); `functions/api/recht.js` (`PAKET_STAND`, `paketVerkaufStand`); `web/partner/index.html`, `web/assets/partner.js`, `web/assets/partner.css` (neu); `web/_headers` (`/partner/*` no-store); `scripts/stripe-attrappe.mjs`; `scripts/pruefen-instanzen/27.mjs`.

**Umsetzung** (Grundlage entwurf-bestellung §2–§9, mit diesen Festlegungen)
1. **Anmeldung** `/api/partner/anmelden|bestaetigen|abmelden`: Code per Supabase (`codeSenden`, `codePruefen`, auth.js:28/44); danach **keine Supabase-Token an den Browser**, sondern `sitzungSetzen(ctx, 'partner')` (K1.1). Fehlversuche je Adresse dauerhaft zählen (`budget('otpfehl:<sha256(mail)>', otpFehlerMailTag)`), danach Sperre bis Tagesende und Hinweis-Mail (K1.15). Geld-Aktionen (Storno, Stripe-Kundenportal, Zahlungsmittel) verlangen `frisch` (15 Minuten), sonst neuer Code.
2. **Bestellformular** `/partner/#bestellen/<paket>` (Wizard, GESTALTUNG.md-Rollen des Betriebsbereichs, eine Cream-Pille je Bildschirm): 0 Paket mit Preis aus `pakete.js` und Satz „Angebot nur für Unternehmer, Preise zzgl. 19 % MwSt.“ (bei `MWST=0` § 19 UStG) · 1 E-Mail bestätigen · 2 Unternehmen (Firma, Anschrift, Bundesland, USt-IdNr., Website, Ansprechpartner, Telefon, **Erreichbarkeit/Rückrufzeiten**) und **Impressumsangaben** (Rechtsform, Vertretung, Register, Kammer, Berufsbezeichnung) · 3 Konfigurator (Anzeigename, **Wunsch-Domains** 1–3 mit unverbindlicher Prüfung, Eingangsadressen 1–3, bei Signature Dashboard-Zugänge 1–5) · 4 Gestaltung nur bei `m.logo|farbe|fotos|startansicht` (Logo als PNG, JPEG, WebP oder SVG; PDF nur als „Druckvorlage“, K2.16; Farben 1–3; Fotos bis 6; Titel, Begrüßung, Foto des Ansprechpartners, Notizen) · 5 Prüfen und bezahlen mit drei Häkchen (Unternehmer § 14 BGB, Paketbedingungen Stand `PAKET_STAND`, AV-Vertrag) und Knopf „Kostenpflichtig bestellen“. Feldregeln aus einer Prüffunktion für Browser und Server (`Instanzregeln.bestellung.*`, entwurf-bestellung §4.2).
3. **Domain-Hinweis** `POST /api/partner/domain-pruefen` (K2.10): RDAP nur für Endungen aus dem IANA-Verzeichnis (dns.json, 24 h gemerkt); für `.de`, `.at`, `.ch`, `.eu` und alle ohne RDAP eine DoH-Abfrage (`https://cloudflare-dns.com/dns-query?name=…&type=NS`): NXDOMAIN → „wahrscheinlich frei“, sonst „vergeben“; immer mit „unverbindlich, wir prüfen beim Kauf“. Bremse `RL_FORM`.
4. **Uploads** (Bucket `bestellungen`, entwurf-bestellung §4.3): Typ nur aus der Dateisignatur; SVG und PDF nur als `attachment` mit `content-security-policy: sandbox; default-src 'none'`; Anzeige nur über `blob:`.
5. **Eingangsbestätigung sofort** beim Klick auf „Kostenpflichtig bestellen“ (K1.17, § 312i BGB): Mail an den Partner mit Bestellübersicht, Paketbedingungen und AV-Vertrag als PDF (`web/konfigurator-bedingungen/*-<STAND>.pdf` von F, über `env.ASSETS` gelesen) und Link auf die Fassung.
6. **Einrichtung bezahlen** (Stripe Checkout `mode=payment`, `card` und `sepa_debit`, `payment_intent_data.setup_future_usage=off_session`, `invoice_creation`, Metadaten `art=einrichtung, bestellung, partner, paket, stand`, **nie** `betrieb`; Preis nur vom Server). `einrichtungUebernehmen` (Rückkehr und Webhook gemeinsam, idempotent in `bestellungAendern`) verlangt `session.metadata.bestellung === id`, `metadata.partner === partner.id`, `session.customer === partner.stripe_customer`, `payment_status === 'paid'` und Betrag = Preisstand, sonst 403 bzw. Hinweis in der Zentrale (K1.8). SEPA unterwegs → „Zahlung in Bearbeitung“. Erst `bezahlt` erlaubt „Einrichtung beginnen“.
7. **Webhook-Weiche** in zahlung.js vor dem B2C-Zweig: `paketObjekt(ev)` (Metadaten `art ∈ {einrichtung, paket, paket_zahlungsart}`, Abo-Metadaten `art=paket`, Disputes mit bekannter `pi`) → `paketEreignis`; sonst unverändert. Ereignisse wie entwurf-bestellung §6.3. `stripeEreignis` (konten.js:397) sieht Paketobjekte nie.
8. **Abo** `aboStarten` (von C beim Live-Schalten aufgerufen): `POST /subscriptions` mit `paketPreis` (`lookup_key` `eeziframes_paket_<paket>_<cent>_eur_monat`), `default_payment_method`, `off_session`, `payment_behavior: allow_incomplete`, Metadaten `art=paket`, Idempotency `eeziframes-paketabo-<bestellung>-<n>`, Prüfung „läuft schon“. `paketWechseln`: setzt `instanzen.paket` (über verwalten.js) und den Abo-Preis zusammen; nach oben mit Differenz der Einrichtung als Rechnungsposten (Vorschlag §5.3 F2), nach unten zum Periodenende; der Tageslauf gleicht `instanzen.paket` und Stripe-Preis ab.
9. **Kulanz, Pause, Ende** (`bestellungenLauf`, täglich, Fristen aus `instanzregeln.js`, K2.1, K1.5): `zahlung_offen` und `kulanz_bis` vorbei → Bestellung `pausiert`, `instanzStatus(…, 'pausiert')`; `pausiert` länger als `pauseMaxTage` → `paketAboBeenden`, `beendet`; `beendet` + 30 Tage → `instanzDatenLoeschen`; Freigabe-Erinnerungen nach 3 und 7 Tagen; unbezahlte Entwürfe nach 30 Tagen löschen; wöchentlicher Abgleich offener Kassen und laufender Abos mit Stripe. Stripe-Kontoeinstellung bleibt „Abo kündigen“; `subscription.deleted` → `pausiert` + Hinweis „Abo neu starten“.
10. **Kundenkonto** `/partner/`: Statusleiste bzw. Abo-Karte, nächste Aktion als Hauptknopf; Wünsche ergänzen bis zur Freigabe; Vorschau ansehen, **Freigeben** oder **Änderung wünschen**; Nachrichten (beide Richtungen mit Mail); **Rückruf anfordern** (Wunschtag in den nächsten 10 Werktagen, Zeitfenster, Thema; höchstens einer offen); **Rechnungen** (Liste `GET /v1/invoices?customer=`, 5 Minuten gemerkt); **Rechnungen und Zahlung ändern, Kündigen** über das **Stripe-Kundenportal** (`billing_portal/sessions` mit eigener, vom Server einmal angelegter Konfiguration: Rechnungen, Zahlungsmittel, Kündigung zum Periodenende; K2.15); Empfängeradressen ändern (→ `empfaengerEinladen`, erneute Bestätigung); Paketwechsel anfragen (wird eine Nachricht); bei Signature Link „Zum Dashboard“ (`https://<host>/betrieb/`); Verlinkungs-Schnipsel nach Live. Fragen ohne Konto: `POST /api/partner/frage` (Formular auch ohne JavaScript, Honeypot, `RL_FORM`) → Nachricht `art: 'frage'` und Mail an `MAIL_KONTAKT`.
11. **Recht**: `PAKET_STAND` in recht.js; `paketVerkaufStand()` wie `verkaufStand` (recht.js:44-52) mit eigener Seitenliste; im Live-Modus öffnet die Einrichtungskasse erst bei `bereit` (Platzhalter in den Paketbedingungen schließen sie, die B2C-Kasse bleibt unberührt).

**Prüfungen (Abschnitt 27):** B1–B16 aus entwurf-bestellung §13, angepasst: 27.1 Anmeldung setzt `__Host-partner`, Antwort enthält kein Supabase-Token; Cookie gilt nicht auf `/api/konto` und nicht auf einem Instanz-Host; Geld-Aktion ohne `frisch` → 401 `{ frisch: true }`; 10 falsche Codes je Adresse → Sperre. 27.2 Feldregeln Browser = Server; Domain-Normalisierung (`HTTPS://WWW.Brandt-Fenster.App/x` → `brandt-fenster.app`, IDN → Punycode). 27.3 Uploads (Signatur, Größe, Anzahl, SVG/PDF als `attachment`+`sandbox`, fremd 404). 27.4 Eingangsbestätigung mit zwei PDF-Anhängen sofort beim Bestellen. 27.5 Kasse (Betrag aus `pakete.js`, Steuer exklusiv, `setup_future_usage`, `invoice_creation`, kein `betrieb`). 27.6 Bindung: Sitzung von Bestellung A an Bestellung B → 403; Rückkehr + Webhook + doppelte Zustellung → genau ein Übergang und je eine Mail; zweite Bestellung mit derselben Session → Unique-Fehler. 27.7 Statusmaschine (alle unerlaubten Übergänge 409). 27.8 Altbestand: nach allen Paketereignissen alle `betriebe` byteweise gleich, `abrechnungslauf` ohne Posten, `customer.subscription.updated` ändert keinen Betrieb (konten.js:436); Abschnitte 8, 11, 13 grün. 27.9 Abo-Start, Doppelklick → ein Abo. 27.10 Kulanz/Pause/Ende mit vorgestellter Uhr bis zur Löschung; Pause > 60 Tage beendet das Abo. 27.11 Kundenportal-Session nur mit `frisch`. 27.12 Nachrichten und Rückruf (Grenzen). 27.13 Domain-Hinweis: `.app` über RDAP, `.de` über DoH (beide als Attrappe). 27.14 Browser (390 und 1280 px): ganze Bestellung bis Rückkehr aus der Kasse, Zwischenspeichern, Fehlermeldungen am Feld, `aria-current` in der Leiste, Tastatur, kein waagrechter Scroll, keine Konsolenfehler. 27.15 `/partner/` und `/api/partner/anmelden` auf Instanz-Hosts 404.

**Abnahme:** Abschnitte 1–22, 27 grün; eine Bestellung läuft im Browser von „Paket wählen“ bis „Bezahlt“ (Attrappen), Mails an Partner und Inhaber sind in `/api/test/post`.

---

### B Konfigurator-App im Instanz-Modus (Welle 2)

**Ziel:** Die beste Konfigurator-App ihrer Art läuft unter der Marke des Betriebs: kostenlos, ohne Konto, mit Pflichtkontakt, Bestätigung, eigener PDF-Kopie und ohne jeden Bezug auf „Links“ oder eeziframes-Verkauf.

**Dateien (nur B):** `web/assets/app.js`, `app.css`, `web/app/index.html` (nur neutrale Haken, den Kopf ersetzt A), `web/assets/einladung.js`, `einladung.css`, `gemeinsam.js`, `gemeinsam.css`; `scripts/pruefen-instanzen/25.mjs`.

**Umsetzung** (Schalter `const INST = window.KONFIG && window.KONFIG.instanz`; ohne `INST` ändert sich nichts)
1. **Start** (`boot`, app.js:6043): `S.betrieb = readHash() || instanzBetrieb()` (Code aus `localStorage['instanz.<id8>.aktiv']`); `#k-…` (Signature-Einladung) hat Vorrang; im `hashchange` nie `loadOwn()`.
2. **Code erst bei Bedarf**: `case 'new'` und jede speichernde Aktion rufen `instanzStart()` → `POST /api/instanz/start`, dann `loadLink()`/`linkPruefen()`; ohne Code bewirken `persist`, Entwurf, Fotos und `fortschritt` nichts. 404 beim Prüfen → Code verwerfen, still neu.
3. **Kein Pilot-Rückfall** (`serverStart`, app.js:6130): mit `INST` immer `PILOT = false`; fällt `/api/status` aus: „Gerade nicht erreichbar, Ihr Entwurf bleibt gespeichert.“ statt WhatsApp-Weg (app.js:6104-6126).
4. **Kostenlos**: `NUR_EIGENES` (app.js:2351) greift; keine Preise, kein Einführungsbanner, keine Führung, keine Ratgeber-Links, kein „Neues Aufmaß“ aus eeziframes.
5. **Neutrale Texte** statt Link-Texten (`linkMerk`, `fertig`, `blatt`, `maxMsg`, `linkOffen`; Karte app §4.9); `aendStand` behandelt Instanzen als `frei`.
6. **Kontakt** (`anfrageHead`, `anfrage2`, `anfrage3`): drei Schritte; Name und Telefon oder E-Mail Pflicht; optional „Wann am besten erreichbar?“ (Vormittag, Nachmittag, Abend); Datenschutz-Link aus `KONFIG.datenschutz`; Knopf führt zu `blatt`.
7. **Bestätigung** (`SCREENS.gesendet`/`gesendetOrig`, app.js:6109): Nummer, „<Name> meldet sich bei Ihnen“, Kontaktkarte des Betriebs; **„Meine Anfrage als PDF“** (`Blatt.pdf({ variante: 'anfrage', kennzeichnung: m.kennzeichnung, marke })`, nur bei `m.kopieKunde`); „Weitere Anfrage starten“ (neuer Code). Danach bleiben lokal nur Nummer, Datum und Betrieb; Fenster, Kontakt und Fotos werden aus localStorage und IndexedDB gelöscht, sobald die Bestätigung verlassen wird; Knopf „Auf diesem Gerät vergessen“ (K1.16).
8. **Rechtslinks** (`rechtLinks`, app.js:6098): Impressum, Datenschutz, KI-Widerruf; ohne Widerruf, AGB, Cookies; Fuß nach `m.kennzeichnung` (`deutlich`: Zeichen und „Powered by EEZIframes“, Link auf `https://eeziframes.com/fuer-fensterbauer/` mit `rel="noopener"` und `referrerpolicy="no-referrer"`; `dezent`: kleiner Text ohne Link; `keine`: nichts).
9. **einladung.js**: Option `o.instanz` an `html`, `kopf`, `kontakt`, `fuss` (einladung.js:156-239): Kopf „Fensterplaner von“, keine Link-Texte (Zeilen 170, 171, 216, 234, 236), Fuß nach Kennzeichnung, bei `m.fotos` Bildreihe aus `start.bilder`, bei `m.startansicht` Kicker, Überschrift, Text; Essential mit dem Standard-Startbild von eeziframes und dem Namen als Text. `profil()`, `zeichen()`, `aufFarbe()` nehmen jede gültige Hex-Farbe (einladung.js:86, 129, 148). Schnittstellen `auftritt()`, `einstellungen()` bleiben (Server importiert sie).
10. **KI-Einwilligung** (gemeinsam.js:44-45): neutral; bei `rechtNennung: 'kategorie'` „unser technischer Dienstleister“. KI-Aufruf mit `&code=`.
11. **Fotos**: zusätzlich kleine Fassung `<id>k` (640 px, JPEG 0,7, Code wie `pdfFoto`, app.js:5269ff.) hochladen; Warten vor dem Senden umfasst beide.
12. **Kopf** (app.js:2386): Zeichen und Name des Betriebs; `--ok` bleibt grün.
13. **„Auf anderem Gerät weitermachen“**: `https://<host>/#k-<code>` zum Kopieren oder Teilen.
14. **Vorschau**: Band „Vorschau – noch nicht öffentlich“, Senden erzeugt eine Testanfrage.

**Prüfungen (Abschnitt 25, Chromium auf `http://<paket>.localhost:PORT`, Telefon- und Desktopbreite):** 25.1 Startansicht je Paket (Essential: „Powered by EEZIframes“ sichtbar, Name als Text, kein Logo; Plus: Logo, Fotos von `/marke/`, `--accent` = Firmenfarbe mit Kontrast ≥ 4,5:1, dezenter Fuß; Signature: kein `/eeziframes/i` in `innerText`, `document.title`, Icon-URLs). 25.2 Ganzer Ablauf mit Demo-Fenster bis Bestätigung, Code erst beim ersten Speichern, Kontakt Pflicht, PDF-Kopie (`%PDF`, Kennzeichnung je Paket), danach lokal nur Nummer/Datum/Betrieb, „Weitere Anfrage“ mit neuem Code, „Vergessen“. 25.3 Nirgends Preis/€, `kasse`, `wa.me`, `/agb/`, `/widerruf/`, `/cookies/`, Führung. 25.4 Neu laden und zweiter Browser mit `#k-<code>` → Entwurf da. 25.5 `/api/status` 500 → kein Pilot-Weg; 404 beim Prüfen → still neu. 25.6 Upload von `<id>` und `<id>k`, KI mit Code. 25.7 Signature-Einladung `#k-…` ohne eeziframes, „geöffnet“ gemeldet. 25.8 Vorschau-Band, Testanfrage. 25.9 keine Konsolenfehler, keine fremden Anfragen (außer dem Essential-Link), kein waagrechter Scroll. 25.10 Hauptdomain-App unverändert (Abschnitte 4, 14, 16, 19, 21, 22 grün).

**Abnahme:** Abschnitte 1–25 grün; Bildschirmfotos der Startansicht je Paket und der Bestätigung (Telefon) in der PR.

---

### C Zentrale: Bestellungen und Instanzen einrichten, gestalten, live schalten, pausieren (Welle 2)

**Ziel:** Der Inhaber richtet jede bezahlte Bestellung in einer geführten Folge ohne Code ein: Instanz anlegen, Domain anbinden und prüfen, gestalten, Vorschau senden, live schalten; danach pausieren, fortsetzen, beenden, Paket wechseln.

**Dateien (nur C):** `functions/api/zentrale-instanzen.js`, `zentrale-bestellungen.js`, `cloudflare.js` (neu); `functions/api/zentrale.js` (Exporte `zugang`, `daten`, `protokoll`, `frischerCode`, `betriebLaden`; Aufräumen zentrale.js:714-721 und 745-765; Anmeldungsliste 624-640; Löschschutz 593; Übersicht 416-477; Betriebe-Liste); `web/assets/zentrale.js`, `zentrale.css`, `web/zentrale/index.html` (lädt zusätzlich `pakete.js`, `instanzregeln.js`, `einladung.js`, `einladung.css`); `scripts/cloudflare-attrappe.mjs` (neu); `scripts/pruefen-instanzen/26.mjs`.

**Umsetzung**
1. **Bestellungen** (Liste mit Rückrufliste „heute und überfällig“, Filter, Badge in der Navigation; Detail wie entwurf-bestellung §7.2). Der **nächste Schritt ist der Hauptknopf**: Einrichtung beginnen → Instanz anlegen → Domain verbinden → Domain gesichert → Gestaltung veröffentlichen → Vorschau senden → Live schalten; darunter steht, was fehlt. Routen rufen nur D-Funktionen (`uebergang`, `aboStarten`, `aboSteuern`, `paketWechseln`, `erstatten`).
2. **Instanz anlegen** aus der Bestellung (idempotent): `instanzAnlegen` mit Paket, Name, Eingang, Zugängen, Recht aus den Firmen- und Impressumsdaten, Gestaltungs-Entwurf vorbelegt; schickt sofort `empfaengerEinladen` an alle Eingangs- und Zugangsadressen.
3. **Domain-Karte** (`cloudflare.js`, K2.3, K2.20): Mit `CF_API_TOKEN`/`CF_ACCOUNT_ID`: Zone suchen (`GET /zones?name=`), bei Bedarf **Zone anlegen** und die Nameserver anzeigen (für extern gekaufte .de), Status `active` abwarten; **Custom Domain** für Domain und www anhängen (`PUT /accounts/{id}/workers/domains`, service `fenstero`); DNS-Schutz (`MX 0 .`, `TXT v=spf1 -all`, `_dmarc TXT v=DMARC1; p=reject;`), dabei störende A/AAAA/CNAME-Einträge für genau diese Namen melden bzw. löschen (wie ONLINE-STELLEN.md:107); Registrar-Daten (Ablauf, auto_renew) lesen, extern als Feld. **Prüfung serverseitig**: API-Status der Custom Domain und des Zertifikats, DoH-Auflösung, Abruf `https://<host>/api/instanz/ping` mit erwarteter `id8` (scheitert der Selbstabruf, zählen API und DoH; „Öffnen“-Link für den Blick). Ohne Token: Klick-Anleitung (Text aus §4) und dieselbe Prüfung. Domain-Aktionen mit `frischerCode` (zentrale.js:131), wenn `ZENTRALE_2FA` gesetzt ist. `instanzenPruefen` (täglich): Ping, Ablaufwarnung 30 Tage vorher; bei `beendet` Custom Domain lösen und auto_renew aus (nach Vertragsregel §5.3 F1).
4. **Gestaltung** (nur bei `m.gestaltung === 'eigen'`, Werte über `Pakete`): Editor auf `instanzen.entwurf`; Knopf „aus Bestellung übernehmen“ je Datei (PNG/JPEG/WebP direkt; SVG über `<img>` aus Blob in Canvas → PNG 600 px; Farbe aus `wunsch.farben[0]` mit Kontrastanzeige; Startbilder aus den Bestellfotos mit Zuschnitt 16:9, 1600 px, JPEG 0,8); Canvas erzeugt `logo.png` (≤ 600 px), Icons 32/180/192/512, OG 1200×630; Vorschau im Telefonrahmen mit `Einladung.html({ instanz, vorschau: true })`; **Veröffentlichen** → `markeVeroeffentlichen` (Version +1, Bilder nach `marke/instanz/<id>/<v>/`, Cache leer).
5. **Ampel „Live“** (Vorbedingungen, alle sichtbar): bezahlt · Domain-Prüfung grün · Rechtsangaben vollständig · mindestens eine Eingangsadresse bestätigt · Gestaltung veröffentlicht (Plus/Signature) · Testanfrage **zugestellt** (Resend-Status) · Freigabe der aktuellen Vorschau oder Vermerk ≥ 10 Zeichen · Zahlungsmittel vorhanden · bei Signature ein bestätigter Zugang. „Live schalten“ → `aboStarten` (D) + `instanzStatus('aktiv')` + Mail mit Verlinkungs-Schnipsel.
6. **Vorschau senden**: `vorschauToken` (30 Tage) → Link `https://<host>/?vorschau=<token>` (setzt `__Host-vorschau`) an den Partner, Status `freigabe`.
7. **Betrieb**: Pausieren/Fortsetzen (mit Grund, `pause_bis` höchstens 60 Tage), Beenden, Paketwechsel (D), Zugänge (Signature: anlegen, aus, an, löschen; Mail mit Bestätigung), Testanfrage (`probeEingang`), Versandliste je Instanz (offen, gesendet, zugestellt, bounce, fehler) mit „erneut senden“ (`eingangErneut`), Kennzahlen aus `inst:*`, Demo-Schalter.
8. **zentrale.js**: Aufräumen behält `geschuetzteNutzer()` (Partner- und Zugangs-Anmeldungen) in `mit` (zentrale.js:714) und in der Liste „ohne Betrieb“ (624-640, Löschen dort verweigert); Entwürfe mit `meta.instanz` oder einer `anfragen`-Zeile werden nicht als „Link weg“ gelöscht (zentrale.js:753); Instanzkonten lassen sich unter „Betriebe“ nicht löschen (409 „über Instanz beenden“, zentrale.js:593); Betriebe-Liste markiert Instanzkonten und lässt sie aus den Altbestands-Kennzahlen; Übersicht mit Hinweisen (bezahlt, Freigabe erteilt, Rückruf heute, Zahlung offen, Bounce, Domain läuft ab) und KPI „Pakete live“ und „MRR Pakete“ getrennt vom bisherigen MRR.

**Prüfungen (Abschnitt 26):** 26.1 Bestellung (D-Attrappe bezahlt) mit Badge, Hauptknopf-Folge, Zeile „was fehlt“. 26.2 Instanz anlegen idempotent; Platzhalteradresse; Bestätigungsmails; doppelter Host, falsches Format, eeziframes-Host → Fehler. 26.3 Domain mit Cloudflare-Attrappe (Zone, Custom Domain apex+www, DNS-Schutz, Prüfung grün); ohne Token Anleitung; mit 2FA ohne frischen Code 403. 26.4 Gestaltung: SVG → PNG, Veröffentlichen erhöht die Version, `/marke/<v>/logo.png` liefert ein Bild, `/config.js` zeigt sofort die neue Version; Plus-Einrichtung im Browser in höchstens 20 Klicks. 26.5 Ampel sperrt Live bei jeder fehlenden Bedingung, mit allem → Abo (Attrappe) und `aktiv`. 26.6 Pausieren/Fortsetzen/Beenden; Paketwechsel Essential → Plus → Signature ändert `/config.js` ohne Code. 26.7 Zugänge. 26.8 Testanfrage, Versandliste, erneut senden. 26.9 Aufräumen mit gefälschter `anmeldungenAlle` (40 Tage): Partner- und Zugangs-uid bleiben, echte Leiche weg; Website-Entwürfe bleiben; Löschschutz 409. 26.10 Übersicht und KPI. 26.11 Domain-Ablaufwarnung und Lösen bei `beendet`. 26.12 Rückrufliste und Nachrichten.

**Abnahme:** Abschnitte 1–27 grün (inkl. 13 Zentrale-Altbestand); eine Bestellung lässt sich im Browser von „bezahlt“ bis „live“ durchklicken (Attrappen).

---

### E Signature-Dashboard unter der Instanz-Domain (Welle 3)

**Ziel:** Ein Signature-Betrieb meldet sich unter `https://<seine-domain>/betrieb/` an und arbeitet im bestehenden Betriebsbereich, ganz in seiner Marke: Einladungslinks auf die eigene Domain, Fortschritt, Status eingeladen / in Bearbeitung / eingereicht, Klärungsliste, PDF, Fotos, Nachbesserung, Website-Anfragen, Löschen, Export.

**Dateien (nur E):** `functions/api/dashboard.js` (neu); `functions/api/auth.js` (`admin` mit Body, `codeErzeugen`, `nutzerAnlegen`); `functions/api/konten.js` (Haken in `angemeldet` 48-54, `anmelden` 129, `bestaetigen` 143, gesperrte Routen, `PATCH /api/konto` 175, `projekte` 194/200/206, `sperrFehler` 44); `functions/api/fotos.js` (nur `GET /api/konto/foto`, 193-204); `web/betrieb/index.html` (neu); `web/assets/portal.js`, `portal.css`; `scripts/pruefen-instanzen/28.mjs`.

**Umsetzung** (Grundlage entwurf-signature, mit diesen Festlegungen)
1. **Anmeldung je Herkunft per E-Mail-Code** (kein Passwort, Entscheidung E15): `POST /api/konto/anmelden` auf dem Instanz-Host antwortet immer gleich; nur Adressen aus `instanzen.zugang` (bestätigt, nicht `aus`) bekommen einen Code. Code über `admin/generate_link` (`type: magiclink`, `email_otp`) und eigene Mail „Ihr Anmeldecode für <Name>“ ohne eeziframes (`m.absender`); Rückfall `codeSenden` (auth.js:28) ohne `redirect_to`. `POST /api/konto/bestaetigen` → `codePruefen`, Zugang prüfen und uid binden, dann **`sitzungSetzen(ctx, 'betrieb')`** mit `aud = host` (Cookie `__Host-betrieb`, kein Token im localStorage, K1.1). Fehlversuche je Adresse dauerhaft wie D.
2. **`kontoVon(ctx)`**: Betrieb immer aus dem Host (`ctx.instanz.betrieb`), nie aus der Sitzung; Sitzung muss `aud === host` und `sub` in `zugang` haben; jeder Aufruf prüft `zugang` und `m.dashboard` erneut (Entzug wirkt sofort); Status-Matrix §2.7 für lesen/schreiben/einladen/export.
3. **Sicht** `dashboardSicht`: Konto wie `sicht()` (konten.js:31) ohne `book`, `rechnungen`, `pay`, `freeUsed`, Tarif, Stripe; `links` aus `anfragenVonBetrieb` (eingereichte älter als 30 Tage nur als Kopf, Projektansicht lädt nach über `GET /api/konto/projekte/:id`); `fortschritt` je Link und anonyme Zahl laufender Website-Planungen aus `entwuerfeVonBetrieb` (nur meta). `GET /api/konto?stand=` antwortet `{ gleich: true }`, wenn `anfragenStand` und Betriebsversion unverändert sind; **GET schreibt nie** (E13 aus entwurf-signature).
4. **Routen auf dem Instanz-Host**: `projekte`, `projekte/liste` (nur `m.einladungslinks`, Status `aktiv`; neue Links als `anfragen`-Zeile `art: 'einladung'`, Nummer aus `instanz_nr`), `PATCH projekte/:id` über `linkAendern`, `POST projekte/:id/loeschen` (Nummer als Bestätigung; Zeile, Fotos, Entwurf, Protokoll ohne Kundendaten), `GET /api/konto/export` (JSON ohne `verwaltung`, ohne uids). Auf dem Instanz-Host 404: `registrieren`, `sitzung`, `plan*`, `zahlungsart*`, `import`. `PATCH /api/konto`: `logo`, `col` → 403 („pflegt Ihr Einrichtungsservice“), Profiltexte erlaubt. Hauptdomain: Anmeldung einer Zugangsadresse ohne Betriebskonto → 409 `{ umzug: 'https://<host>/betrieb/' }`.
5. **Hülle** `web/betrieb/index.html`: Stile wie web/index.html ohne Ratgeber, Skripte `/config.js`, `gemeinsam.js`, `ral.js`, `modell.js`, `pakete.js`, `einladung.js`, `blatt.js` (defer), `portal.js`; ohne JSON-LD, Werbetext, Lottie; `data-seite="betrieb"`.
6. **portal.js mit Schalter `INST`** (Stellen wie entwurf-signature §6): `APP_URL = new URL('/', location.href)` (Links `https://<host>/#k-…`, portal.js:8, 890); `Server` ohne Authorization-Kopf (Cookie), Abmelden über Route; Logo/Wortmarke = Zeichen und Name; Navigation Projekte · Nachrichten · Betrieb (ohne Abrechnung, portal.js:357); Statusnamen Angelegt / **Eingeladen** / **In Bearbeitung** / **Eingereicht** (portal.js:878-881); Filter inkl. „Über Ihre Website“; Projektkarte mit „3 Fenster · zuletzt vor 2 Std.“; keine Banner zu Zahlungsart und Kontingent (portal.js:872-876, 1497-1503); keine eeziframes-Sätze (Liste entwurf-signature §7); `amPDF` mit `kennzeichnung: m.pdfKennzeichnung`; Fuß mit Impressum und Datenschutz der Instanz und „Vertrag, Rechnungen und Support“ → `https://eeziframes.com/partner/`; neue Bildschirme `anmelden`, Aktionen `p-loeschen`, `export`; `aufmassText` aus modell.js. Pausiert: Banner, nur lesen. Beendet: nur Export.
7. **Landing-Haken für F** (portal.js, Startseite `#fensterbauer`): oben Karte „Ihr eigener Fensterkonfigurator – Pakete ansehen“ → `/fuer-fensterbauer/`; „Kostenlos starten“ (Registrierung) als Textlink darunter (nicht gelöscht).
8. **Erinnerungen** `einladungenErinnern` (täglich): offene Einladungen älter als 3 Tage einmal an die Eingangsadressen, mit Dashboard-Link, neutral.

**Prüfungen (Abschnitt 28):** S1–S17 und B1–B9 aus entwurf-signature §12, angepasst an Cookies und `anfragen`: 28.1 Essential/Plus: `/betrieb/`, `/api/konto*` → 404 neutral. 28.2 Hülle mit CSP, `noindex`, `no-store`, ohne eeziframes; Alias → 301. 28.3 Code nur für Zugänge, sonst gleiche Antwort ohne Mail; Mail ohne `/eeziframes/i`. 28.4 Bestätigen setzt `__Host-betrieb`, kein Token in der Antwort, uid gebunden. 28.5 Sicht ohne Abrechnungsfelder; `stand` → `gleich`; zwei GET ändern die `version` nicht. 28.6 Trennung: Sitzung von `signature` auf `signature2` → 403, auf eeziframes.com `/api/partner` → 401; Foto fremder Instanz 404; Zugang `aus` → nächster Aufruf 403. 28.7 gesperrte Routen. 28.8 Einladung mit Link `http://signature.localhost:PORT/#k-…`, Code nur auf diesem Host gültig. 28.9 Fortschritt und anonyme Website-Zahl. 28.10 Website-Anfrage erscheint als „Eingereicht“ mit Mail-Link auf `/betrieb/#projekt-…`. 28.11 Herabstufen Signature → Plus: Dashboard 403/404, offene Einladung nimmt noch ein Aufmaß an, Mail mit PDF. 28.12 Abrechnung unberührt. 28.13 Löschen und Export. 28.14 Status pausiert/einrichtung/beendet nach §2.7. 28.15 Browser: Anmeldung, jeder Bildschirm und jedes Blatt ohne `/eeziframes|Abrechnung|Tarif|Zahlungsart|€|Tour|kostenlos/i`, „Als Kunde öffnen“ auf derselben Herkunft im Vorschau-Modus (sendet nichts), PDF ohne eeziframes, `--accent` = Instanzfarbe, getrennte Sitzungen je Host, Abmelden bei Entzug. 28.16 Altbestand-Betriebsbereich unverändert (Links mit `/app/`, Abrechnung sichtbar, Anmeldung `123456`, Abschnitte 1–22).

**Abnahme:** Abschnitte 1–28 grün; Bildschirmfotos des Dashboards (Telefon und Schreibtisch) in der PR.

---

### F Verkaufsseite, Rechtstexte, Doku (Welle 3)

**Ziel:** eeziframes.com verkauft die drei Pakete mit einem einzigen Einstieg „Paket bestellen“ und beschreibt die Vorgehensweise; jede Instanz hat ein vollständiges Impressum und eine passende Datenschutzerklärung; die Doku beschreibt Betrieb und Einrichtung.

**Dateien (nur F):** `web/fuer-fensterbauer/index.html`; `functions/pakete-seite.js`; `web/konfigurator-bedingungen/index.html` (Paketbedingungen mit Anlage AV-Vertrag, Stand); `scripts/bedingungen-pdf.mjs` → `web/konfigurator-bedingungen/paketbedingungen-<STAND>.pdf`, `av-vertrag-<STAND>.pdf`; `web/datenschutz/index.html` (Abschnitt „Kundenkonto für Konfigurator-Pakete“); `functions/instanz/recht.js`; `scripts/pruefen.mjs` (nur Abschnitt 10, Preisabgleich); README.md; `docs/INSTANZEN.md` (Betriebsteil), `docs/BESTELLUNG.md` (neu), `docs/ONLINE-STELLEN.md`, `docs/ZENTRALE.md`, `docs/GESTALTUNG.md`, `docs/SEO.md`; `scripts/pruefen-instanzen/29.mjs`.

**Umsetzung**
1. **Seite „Für Fensterbauer“** neu nach GESTALTUNG.md (Startbild mit Kicker, Headline mit einem grünen Wort, Lead, Cream-Pille „Paket wählen“; Rollen 40/24/17/15/13): **Idee** („Ihr eigener Fenster-Konfigurator, ohne Programmierkosten, unter Ihrer Marke“) · **So funktioniert's** (Interessent kommt von Ihrer Website → plant mit KI, Zeichnung, Klärungsliste → Sie bekommen das Aufmaßblatt per Mail; Signature mit Dashboard) · **Pakete** (drei Karten und Vergleich, gerendert von `pakete-seite.js` aus `Pakete.PAKETE`/`MERKMALE`; Rückfall-Tabelle zwischen `<!--pakete:start-->` und `<!--pakete:ende-->`; bei jeder Preisangabe „nur für Unternehmer, zzgl. MwSt.“) · **Ablauf von der Bestellung bis Live** (die sechs Schritte der Statusleiste in denselben Worten, Dauer realistisch: meist 3–5 Werktage nach Zahlung) · **Live-Demos** je Paket (Demo-Instanzen, §4) · **FAQ** (Domain, Kosten, Kündigung, Datenschutz/AVV, was der Endkunde sieht, „brauche ich eine Website?“) · **Bestellen** (Knopf je Paket → `/partner/#bestellen/<paket>`, Frageformular ohne Konto → `/api/partner/frage`). JSON-LD: drei `Offer` mit `priceSpecification` netto (`valueAddedTaxIncluded: false`). Die alten Tarife (fuer-fensterbauer/index.html:102-111) und „Kostenlos starten“ verschwinden von dieser Seite; die Registrierung bleibt über `/#fensterbauer` erreichbar. `paketeLlms()`: Absatz zu den Paketen.
2. **Paketbedingungen und AV-Vertrag** (`/konfigurator-bedingungen/`, Stand `PAKET_STAND`): Leistungen je Paket (Tabelle aus `pakete.js`), Vorkasse der Einrichtung, Abo ab Livegang, Laufzeit und Kündigung, Kulanz und Pause, Höchstdauer der Pause, Löschung nach Ende, Domain (Inhaber, Übertragung), Verfügbarkeit, Haftung, Änderungen; AVV mit Unterauftragnehmern (Cloudflare, Supabase, Resend, Anthropic, Stripe nur für Partnerdaten), Speicherorten, Fristen je Paket aus `pakete.js`, Backups (Supabase Pro, 7 Tage), Löschliste (§3 A 11), Pflicht zur Nennung der Unterauftragnehmer gegenüber dem Betrieb (Art. 15, EuGH C-154/21). Platzhalter bis zur anwaltlichen Prüfung sind sichtbar markiert; `paketVerkaufStand()` hält die Live-Kasse bis dahin zu. PDF über `scripts/bedingungen-pdf.mjs` (jsPDF aus `web/vendor/`).
3. **Recht je Instanz** (`functions/instanz/recht.js`): Impressum aus Feldern (§ 5 DDG: Firma, Rechtsform, Vertretung, Anschrift, Kontakt, Register, USt-IdNr., Kammer, Berufsbezeichnung); Datenschutz mit Verantwortlichem Betrieb, Zwecken (Anfrage, lit. b; KI nur mit Einwilligung, lit. a), Empfängern in **allen** Paketen konkret genannt (Cloudflare, Supabase Frankfurt, Resend, Anthropic; Drittland mit DPF/SCC), eeziframes bei `rechtNennung: 'name'` als Auftragsverarbeiter, bei `kategorie` nur als technischer Dienstleister, Fristen aus `pakete.js`/`instanzregeln.js`, localStorage/IndexedDB und die Cookies `__Host-vorschau`/`__Host-betrieb` (§ 25 Abs. 2 TDDDG), Rechte, Aufsichtsbehörde nach Bundesland (Tabelle der 16 Landesbehörden), Stand. Alle Werte escapt.
4. **Datenschutz eeziframes.com**: neuer Abschnitt Kundenkonto für Pakete (Vertrag lit. b, Stripe, Resend, Supabase, Fristen aus §2.7) und Hinweis, dass eeziframes für Instanzen Auftragsverarbeiter des Betriebs ist.
5. **Doku**: README (Überblick Instanzen), docs/INSTANZEN.md (Betrieb, Status, Fristen, Fehlerbilder), docs/BESTELLUNG.md (Ablauf, Stripe), docs/ONLINE-STELLEN.md (neue Schritte §4, Webhook-Ereignisse, Resend, Cloudflare-Token, Regel „nie routes in wrangler.jsonc“), docs/ZENTRALE.md (Bestellungen, Instanzen, Domain-Karte), docs/GESTALTUNG.md (Abschnitte Instanz-Startansicht, Kundenkonto, Statusleiste, Verkaufsseite), docs/SEO.md (Indexierung der Instanzen).

**Prüfungen (Abschnitt 29):** 29.1 Preise der drei Pakete in HTML und JSON-LD = `pakete.js`, auch ohne JavaScript; „nur für Unternehmer“ bei jedem Preis; keine alten Tarife auf `/fuer-fensterbauer/`. 29.2 Jeder „Bestellen“-Knopf führt auf `/partner/#bestellen/<paket>`; Frageformular mit und ohne JS, Honeypot, Bremse, Mail an `MAIL_KONTAKT`. 29.3 Abschnitt 10 angepasst und grün (ein h1, Titel, Beschreibung, Canonical). 29.4 `/konfigurator-bedingungen/` mit Stand, beide PDFs vorhanden und lesbar. 29.5 Impressum/Datenschutz je Paket: Pflichtangaben, Unterauftragnehmer genannt, Signature ohne „eeziframes“, Essential/Plus mit eeziframes als Auftragsverarbeiter, Fristen = `pakete.js`, Aufsichtsbehörde passend zum Bundesland, Escaping. 29.6 Datenschutz eeziframes.com mit neuem Abschnitt (Abschnitt 17 grün). 29.7 llms.txt mit Paket-Absatz. 29.8 Doku-Links zeigen auf existierende Dateien.

**Abnahme:** Abschnitte 1–29 grün; Bildschirmfotos der Verkaufsseite (Telefon und Schreibtisch).

---

### I Integrator: Zusammenführen und Abschnitt 30

**Abschnitt 30 (Ende zu Ende, Attrappen für Stripe, Cloudflare, Resend):** Partner bestellt Plus → zahlt (SEPA „läuft“, dann bezahlt) → Zentrale: Einrichtung, Instanz anlegen, Empfänger bestätigt (Link aus der Mail), Domain verbunden und grün, Gestaltung aus Bestellung übernommen und veröffentlicht, Testanfrage zugestellt, Vorschau gesendet → Partner gibt frei → Live, Abo läuft → Endkunde plant auf `plus.localhost` und sendet → Mail mit PDF, Reply-To, zugestellt → Paketwechsel auf Signature → Dashboard-Zugang, Anmeldung, Einladung, Nachbesserung → Zahlungsausfall → Kulanz → Pause (Seite 503) → Zahlung → live → Kündigung im Kundenportal → Ende → nach 30 Tagen alles gelöscht (Liste §3 A 11). Danach Vollsuite 1–30, Bildschirmfotos, PR.

---

## 4. Manuelle Schritte des Inhabers (Checkliste in einfacher Sprache)

### Einmalig, bevor der erste Kunde bestellt
- [ ] **Cloudflare, Tarif:** Workers & Pages → Plans → **Workers Paid** buchen (5 $ im Monat). Ohne geht das PDF im Worker nicht.
- [ ] **Cloudflare, Speicher und Warteschlange:** Workers & Pages → KV → Namensraum `eezi-instanzen` anlegen; Queues → Warteschlange `eezi-eingang` anlegen. Beide Kennungen an Claude geben; dann kommt ein kleiner Commit mit den Bindungen. Bis dahin läuft alles, nur ohne diesen Puffer.
- [ ] **Cloudflare, Schlüssel für Domains:** My Profile → API Tokens → Create Token (eigene Vorlage): Konto „Workers Scripts: Edit“, „Zone: Edit“ (zum Anlegen neuer Zonen), „Registrar: Domains: Read“; Zonen „Zone: Read“, „DNS: Edit“, „Workers Routes: Edit“, **alle Zonen des Kontos außer `eeziframes.com`**. Bei fenstero als Secret `CF_API_TOKEN`, dazu Variable `CF_ACCOUNT_ID` (steht rechts auf der Kontoübersicht). Ohne Token zeigt die Zentrale eine Klick-Anleitung.
- [ ] **Geheimnis für Sitzungen:** Secret `SITZUNG_GEHEIMNIS` = langer Zufallstext (mindestens 32 Zeichen) aus dem Passwort-Manager. Nie ändern, sonst sind alle angemeldet ab.
- [ ] **Supabase:** `supabase/schema.sql` im SQL-Editor erneut komplett ausführen. Tarif **Pro** (war ohnehin vor dem ersten Betrieb fällig, ONLINE-STELLEN.md:217).
- [ ] **Resend:** Tarif **Pro** (20 $; der freie Tarif schafft nur 100 Mails am Tag für alles). Domains → Add Domain → `post.eeziframes.com`, Region Ireland, „Sign in to Cloudflare“ trägt DKIM/SPF selbst ein. Variable `MAIL_ABSENDER_INSTANZ` = `anfragen@post.eeziframes.com`. Webhooks → Add Endpoint → `https://eeziframes.com/api/post/webhook`, Ereignisse `email.delivered`, `email.bounced`, `email.complained`, `email.delivery_delayed` → Signing Secret als Secret `RESEND_WEBHOOK_SECRET`.
- [ ] **Optional für Signature:** eine neutrale Absender-Domain (z. B. `fensterplaner-post.de`) kaufen, bei Resend bestätigen, Variable `MAIL_ABSENDER_NEUTRAL`. Ohne sie kommen Signature-Mails an den Betrieb von `post.eeziframes.com` (Endkunden sehen das nie).
- [ ] **Stripe:** Workbench → Webhooks → dein Ziel → Ereignisse ergänzen: `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `customer.subscription.updated`, `charge.dispute.created` (Test- und Live-Modus). Einstellungen → Billing → Kundenportal einmal öffnen und speichern. **Wiederholungsversuche NICHT ändern**: „Abo kündigen“ bleibt (sonst stuft der Server Altbestand-Abos nicht mehr zurück). E-Mails → Rechnungen an Kunden senden: an.
- [ ] **Rechtstexte:** Paketbedingungen, AV-Vertrag und die Vorlagen für Impressum und Datenschutz der Instanzen anwaltlich prüfen lassen (Fragen §5.3). Bis die Platzhalter weg sind, bleibt die Paket-Kasse im Live-Modus zu.
- [ ] **Demo-Instanzen:** In Cloudflare am Worker drei Custom Domains `demo-essential.eeziframes.com`, `demo-plus.eeziframes.com`, `demo-signature.eeziframes.com` hinzufügen; in der Zentrale je eine Instanz mit Schalter „Demo“ anlegen. Anfragen dort gehen an dich und verschwinden nach einem Tag.

### Je Kunde (Weg 1: Domain im eigenen Cloudflare-Konto)
- [ ] Mail „Bestellung bezahlt“ kommt → Zentrale → Bestellungen → Hauptknopf **Einrichtung beginnen**.
- [ ] Kunden zur gewünschten Rückrufzeit anrufen, Domain festlegen (die Zentrale zeigt „wahrscheinlich frei“).
- [ ] **Domain kaufen:** `.app`, `.com` usw. bei Cloudflare (Domain Registration → Register Domains); `.de` bei einem anderen Anbieter (z. B. INWX) – dann in der Zentrale **Zone anlegen** und die angezeigten zwei Nameserver beim Anbieter eintragen. Auto-Verlängerung an.
- [ ] Zentrale: **Instanz anlegen** (übernimmt alles aus der Bestellung, schickt Bestätigungsmails an die Empfänger).
- [ ] Zentrale → Domain: **Mit Konfigurator verbinden** (mit Token automatisch; sonst die Klick-Anleitung: Workers & Pages → fenstero → Einstellungen → Domains & Routes → Add → Custom Domain, Domain und `www.` eintragen; vorhandene A-, AAAA-, CNAME-Einträge für genau diese Namen löschen).
- [ ] In der Zone des Kunden: Web Analytics aus, Rocket Loader aus, E-Mail-Adressen-Verschleierung aus, Bot Fight Mode aus (setzt sonst ein Cookie, das in keinem Datenschutztext steht).
- [ ] **Prüfen**, bis alles grün ist (Zertifikat, DNS, Antwort der Instanz).
- [ ] Plus/Signature: **aus Bestellung übernehmen**, ansehen, **Veröffentlichen**.
- [ ] Rechtsangaben ansehen; **Testanfrage** schicken, bis „zugestellt“ dasteht.
- [ ] **Vorschau senden** → der Kunde gibt im Kundenkonto frei (oder Vermerk nach Telefonat).
- [ ] **Live schalten** (das Abo startet von selbst; der Kunde bekommt den Link-Schnipsel für seine Website).

### Im laufenden Betrieb
- Die Übersicht der Zentrale meldet, was zu tun ist: Rückrufe, Nachrichten, Freigaben, Zahlung offen, Bounce, Domain läuft ab.
- Kündigung, Zahlungsausfall, Pause und Löschung erledigt der Server nach den Fristen. Bei „beendet“ Domain nach Vertrag halten oder übertragen (Frage F1).

### Später (nur entworfen)
- **Weg 2:** Subdomain beim Betrieb (`konfigurator.betrieb.de`) per CNAME über Cloudflare for SaaS (eigene Zone, Fallback-Origin, Worker-Route `*/*`, Host erst nach TXT-Nachweis). Tabelle (`weg = 'saas'`) und Weiche tragen das schon.

---

## 5. Entscheidungen und offene Fragen

### 5.1 Entscheidungen, die Claude getroffen hat

| Nr. | Entscheidung | Begründung |
|---|---|---|
| E1 | Gerüst „schnell“, Daten aus „tragfähig“: eigene Tabellen `instanzen`, `instanz_hosts`, `anfragen`; Projekte von Instanzen nie in `betriebe.daten.links` | Ein JSON-Dokument je Betrieb wächst mit unbegrenzten Anfragen; `betriebeAlle` lädt alle Dokumente mehrmals täglich (zentrale.js:712, 748, 767), `GET /api/konto` schrieb alle 30 s das ganze Dokument (konten.js:174 → 66-70). Mit dem Pseudo-Konto-Adapter bleibt modell.js unverändert nutzbar. |
| E2 | Eine Stelle je Wahrheit (§2.1); Paket nur in `instanzen.paket`, Änderung nur über `paketWechseln()` | Blocker K2.2; Stripe-Preis und Merkmale können nicht auseinanderlaufen. |
| E3 | Paketunterschiede nur als Merkmale in `pakete.js`; Zustände und Fristen nur in `instanzregeln.js` | Vorgabe „eine Stelle“; Pakete verschieben = eine Zelle; die Fristen speisen auch Datenschutz und AVV. |
| E4 | Paketschlüssel bleiben `essential/plus/signature` | Vorgabe des Inhabers; Verwechslung mit Altbestand-Tarif `plus` ist ausgeschlossen, weil Pakete nur im Feld `paket` stehen und Instanzkonten `konto: 'instanz'` haben (Kritik K2.11 zum Umbenennen abgelehnt). |
| E5 | Host-Weiche ganz vorn in worker.js, Hauptdomain ohne Datenbankzugriff | eeziframes.com bleibt so schnell und so robust wie heute. |
| E6 | Website-Besucher bekommen einen „virtuellen Link“ (nur `entwuerfe`), die `anfragen`-Zeile entsteht erst beim Senden | Bots erzeugen keine Projekte; keine Anfrage ohne Kontakt. |
| E7 | Endkunden bekommen keine automatische Mail, aber die Bestätigung auf dem Bildschirm und „Meine Anfrage als PDF“ | Eine Mail an eine unbestätigte Adresse mit Anhang wäre ein Spam-Verteiler; die PDF-Kopie gibt dem Kunden trotzdem etwas in die Hand (K2.17). |
| E8 | PDF im Worker aus Serverdaten, über Queue, mit kleinen Fotofassungen, Budget 5 MB, Anhang ≤ 7 MB | Verbindlich wie im Betriebsbereich; Speicher des Isolates geschützt; Mailserver lehnen größere Mails oft ab (K2.6). |
| E9 | Mails an Betriebe von `post.eeziframes.com` (eigene Reputation), Reply-To Endkunde, Zustellung über Resend-Webhook verfolgt | Ein Bounce darf eine Anfrage nicht still verschwinden lassen; Spam-Beschwerden treffen nicht ask@eeziframes.com (K2.4). |
| E10 | Signature-Dashboard unter `https://<instanz>/betrieb/` mit portal.js im Schalter-Modus | Vorgabe der Ergänzung; Einladungslinks zeigen von selbst auf die eigene Domain; Anmeldung per Code braucht keine Redirect-URLs (auth.js:4-7, konten.js:143-148). |
| E11 | Eigene, bereichsgebundene Sitzungen (`__Host-partner`, `__Host-betrieb`, HttpOnly) statt Supabase-Token im Browser; Geld-Aktionen nur mit frischer Anmeldung | Ein Supabase-Token gälte in allen Bereichen; ein gestohlenes Dashboard-Token könnte sonst das Abo kündigen (K1.1). |
| E12 | Bremsen über das Rate-Limiting-Binding je IP und je Code; Grenzen je Instanz als Alarm, harte Sperre erst bei 2× bzw. 4×; globales KI-Tagesbudget | Ein Angreifer kann echte Interessenten nicht aussperren, die Kosten bleiben gedeckelt (K1.2). |
| E13 | Turnstile wird nicht gebaut, nur vorbereitet | Braucht ein fremdes Skript und eine CSP-Ausnahme auf jeder Instanz, dazu einen Datenschutz-Hinweis; die Bremsen aus E12 reichen für den Start. |
| E14 | Essential/Plus: Anfragen 30 Tage nach bestätigter Zustellung löschen, nichts „für ein späteres Upgrade“ aufheben; Signature: Aufmaß und PDF für die Vertragsdauer, Originalfotos 12 Monate | Kein eigener Zweck des Auftragsverarbeiters (K1.4); Signature-Versprechen „Unterlagen jederzeit“ bleibt wahr (K2.14). Nach einem Upgrade erscheinen nur neue Anfragen. |
| E15 | Signature-Zugang per E-Mail-Code statt Passwort | Kein Rücksetz-Ablauf mit Link nötig, gleicher geprüfter Weg wie heute; die Verkaufsseite sagt „geschützter Zugang“, nicht „Passwort“. |
| E16 | Empfänger und Zugänge per Bestätigungslink; Live erst mit bestätigter Adresse und zugestellter Testanfrage | Ein Tippfehler wäre bei jeder Anfrage eine Datenpanne (K1.9). |
| E17 | Einrichtungsgebühr per Stripe Checkout mit gespeichertem Zahlungsmittel, Abo startet beim Live-Schalten; Zahlungsnachweis fest an Bestellung, Partner und Stripe-Kunde gebunden | Vorgabe; Missbrauch einer Session für zwei Bestellungen ausgeschlossen (K1.8). |
| E18 | Stripe-Kontoeinstellung „Abo kündigen“ bleibt; Kulanz von 14 Tagen führt der Server | Blocker K2.1: „unbezahlt markieren“ hätte die Rückstufung der Altbestand-Abos ausgehebelt (konten.js:423-436). |
| E19 | Pause höchstens 60 Tage, dann Ende, Löschung 30 Tage später | Sonst blieben Endkundendaten einer nicht zahlenden Instanz unbegrenzt liegen (K1.5); Werte stehen als Vorschlag in §5.3. |
| E20 | Rechnungen, Zahlungsmittel und Kündigung über das Stripe-Kundenportal; Rechnungsliste nur lesend im Kundenkonto | Spart den Eigenbau (K2.15); eeziframes-Marke dort ist zulässig, der Partner ist Kunde des Inhabers. |
| E21 | Domain-Anbindung per Cloudflare-API mit Token ohne Zugriff auf eeziframes.com, sonst Klick-Anleitung; Prüfung serverseitig | Vorgabe „kein Code-Eingriff je Kunde“; die CSP verbietet Prüfungen aus dem Browser der Zentrale (K2.3). Domainkauf bleibt ein Klick des Inhabers (Registrierung per API bietet Cloudflare nicht verlässlich an). |
| E22 | KV-Spiegel der Instanzdaten | Die Website des Betriebs bleibt erreichbar, wenn Supabase kurz ausfällt (K2.19). |
| E23 | `not_found_handling` entfällt, der Worker liefert 404 je Host | Sonst zeigt jede falsche Adresse einer Betriebs-Domain die eeziframes-Fehlerseite (K2.5). |
| E24 | Keine Umstellung von Altbestandskonten auf eine Instanz | Vermeidet Abrechnungsfragen bei alten Links (entwurf-signature F3); ein Bestandsbetrieb bestellt einfach eine neue Instanz. |
| E25 | Betriebszeile der Instanz mit Platzhalteradresse auf `.invalid`, `post.js` lehnt `.invalid` ab | `betriebe.mail` ist unique (schema.sql:15); die echte Adresse kann schon zu einem Bestandskonto gehören. Kritik K2.12 so gelöst statt ohne Platzhalter. |
| E26 | Indexierung: Plus/Signature nur `/`, Essential noindex ohne Disallow | Plus/Signature sollen unter ihrem Namen gefunden werden; Essential-Instanzen wären Doppelinhalt (K2.9). |
| E27 | Essential: „Powered by EEZIframes“ verlinkt (neuer Tab, ohne Referrer); Plus: unverlinkter Text; Signature: nichts | „Powered by“ ist der übliche Weg, über den andere Fensterbauer das Angebot finden; Endkunden müssen nie auf eeziframes.com. Schalter in `pakete.js`. |
| E28 | Ein Einstieg auf der Verkaufsseite („Paket bestellen“ → `/partner/`), Fragen ohne Konto über ein kleines Formular; alte Tarife nicht mehr beworben | Drei Einstiege aus den Entwürfen widersprachen sich (K2.11); Vorgabe „Altbestand nicht mehr bewerben“. |
| E29 | Fotolink für Essential/Plus 14 Tage gültig, nur auf dem Haupthost der Instanz, Abruf protokolliert | Kompromiss aus K1.14 (7 Tage) und K2.7 (Aufbewahrung): Der Betrieb sieht Originalfotos in den ersten Tagen, ein weitergeleiteter Link läuft bald ab. |
| E30 | Keine Einbettung per iframe, kein Weg 2, keine Mitarbeiter-Selbstverwaltung, keine Bestellung durch den Inhaber im Auftrag in diesem Bau | Hält den Bau in einer Nacht; Tabellen und Schalter tragen es später. |

### 5.2 Umgang mit der Kritik (jeder Blocker und jeder wichtige Punkt)

| Befund | Schwere | Lösung | Strang |
|---|---|---|---|
| K2.1 Stripe „unbezahlt markieren“ bricht Altbestand | Blocker | E18 | D, §4 |
| K2.2 Daten an mehreren Stellen | Blocker | E1, E2, §2.1 | S0 |
| K1.1 Token gilt in allen Bereichen | wichtig | E11 | S0, D, E |
| K1.2 Bremsen deckeln Kosten nicht, DoS | wichtig | E12, E13, eigene Mail-Subdomain | S0, A |
| K1.3 Anonyme Fotoablage | wichtig | nur IDs aus dem Entwurf, ≥ 1 Fenster, ≤ 2n+4, Tagesbudget, leere Entwürfe nach 24 h | A |
| K1.4 Speicherzweck Essential/Plus | wichtig | E14 | A, F |
| K1.5 Pausierte Instanz nie gelöscht | wichtig | E19 | D |
| K1.6 Keine Status-Tabelle | wichtig | §2.7 in `instanzregeln.js`, Prüfung 23.4 | S0, A |
| K1.7 Zentrale/Partner verlieren CSP | wichtig | `sicher()` für jede Worker-HTML-Antwort, Prüfung 23.1 | A |
| K1.8 Zahlungsnachweis nicht gebunden | wichtig | E17, Unique-Indizes | D |
| K1.9 Empfänger unbestätigt | wichtig | E16 | A, C |
| K2.3 Domain-Anbindung ohne Code fehlt | wichtig | E21, `cloudflare.js` | C |
| K2.4 Zustellung unbemerkt, 100 Mails/Tag | wichtig | E9, Resend Pro, Nachholen alle 10 min, Status im selben Schreibvorgang | A, §4 |
| K2.5 eeziframes-404 auf Betriebs-Domains | wichtig | E23 | S0, A |
| K2.6 PDF-Speicher im selben Isolate | wichtig | E8 (Queue, `import()`, kleine Fotos) | A |
| K2.7 Essential ohne alle Fotos | wichtig | kleine Fassungen aller Fotos im PDF + Fotolink (E29) | A, B |
| K2.8 Signature auf eeziframes.com | wichtig | E10 | E |
| K2.9 Indexierung widersprüchlich | wichtig | E26 | A |
| K2.10 RDAP meldet .de frei | wichtig | DoH für Endungen ohne RDAP | D |
| K2.11 Verkaufsseite, drei Einstiege, Name plus | wichtig | E28; Umbenennung abgelehnt (E4) | F |
| K1.10 Host-Bindung am Link, kurze Codes | Hinweis | `anfragen`-Tabelle + Bindung an `ctx.instanz`, nur 10-stellige Codes | A |
| K1.11 Escaping im Kopf | Hinweis | `esc()`, `JSON.stringify`, Ersatz per Funktion, Prüfung 23.5 | A |
| K1.12 Löschen unvollständig | Hinweis | feste Löschliste, Prüfung 24.12, AVV | A, F |
| K1.13 Zonen-Betrieb | Hinweis | Checkliste §4, Token ohne eeziframes.com, `frischerCode`, Domain halten (F1) | C, §4 |
| K1.14 HMAC-Rückfall schwach | Hinweis | `SITZUNG_GEHEIMNIS` Pflicht, Zweck im MAC, E29 | S0 |
| K1.15 Codes ausprobieren | Hinweis | dauerhafter Fehlzähler je Adresse; Supabase-Codelänge bleibt (würde auch B2C ändern) | D, E |
| K1.16 Geteilte Geräte | Hinweis | nur Nummer/Datum lokal, „vergessen“ | B |
| K1.17 B2B-Pflichten | Hinweis | Hinweis bei jedem Preis, Eingangsbestätigung sofort mit PDF | D, F |
| K2.12 Platzhalteradresse | Hinweis | E25 | S0 |
| K2.13 KI ohne Code | Hinweis | Code-Pflicht, Grenzen je Code und Monat | A |
| K2.14 Signature-Unterlagen | Hinweis | E14, PDF-Ablage | A |
| K2.15 Stripe-UI selbst gebaut | Hinweis | E20 | D |
| K2.16 Plus-Gestaltung dauert | Hinweis | Logo-Formate im Formular, „aus Bestellung übernehmen“, Prüfung 26.4 | D, C |
| K2.17 Endkunde ohne Kopie | Hinweis | E7 | B |
| K2.18 `keep_vars` missverstanden | Hinweis | Regel und Prüfung 23.13 | S0, F |
| K2.19 Abhängigkeit von Supabase | Hinweis | E22 | A |
| K2.20 Domain-Ablauf | Hinweis | Registrar-Daten, Warnung, Lösen bei Ende | C |

### 5.3 Fragen für morgen früh (nur Recht und Geld; bis zur Antwort gilt der Vorschlag, er steht als Wert in `pakete.js`/`instanzregeln.js`)

1. **F1 Domain und laufende Kosten.** Ist eine Domain im Paketpreis enthalten, und bis zu welchem Jahrespreis? Wem gehört sie, was passiert nach einer Kündigung? Sind die neuen Fixkosten freigegeben (Workers Paid 5 $, Resend Pro 20 $ im Monat; Supabase Pro 25 $ war ohnehin geplant)? *Vorschlag: eine Domain bis 25 € netto im Jahr inklusive; Inhaber hält sie; nach Ende 12 Monate gehalten und auf Wunsch gegen eine Pauschale übertragen; Kosten freigegeben.*
2. **F2 Laufzeit, Storno, Paketwechsel.** *Vorschlag: monatlich kündbar zum Monatsende ohne Mindestlaufzeit; Einrichtungsgebühr bis zum Beginn der Einrichtung voll erstattet, danach nicht; beim Wechsel nach oben wird die Differenz der Einrichtungsgebühr fällig (z. B. Essential → Plus 100 € netto), beim Wechsel nach unten zum Monatsende, Signature-Dashboard schließt dann.*
3. **F3 Fristen bei Zahlungsausfall und Ende.** *Vorschlag: 14 Tage Kulanz ab der ersten fehlgeschlagenen Abbuchung, dann Pause; Pause höchstens 60 Tage, dann endet das Abo; 30 Tage nach Ende werden alle Instanzdaten gelöscht; Signature kann bis dahin nur noch exportieren; Essential/Plus-Anfragen werden 30 Tage nach Zustellung gelöscht.*
4. **F4 Rechtstexte anwaltlich prüfen lassen:** Paketbedingungen, AV-Vertrag (Unterauftragnehmer, Backup-Frist 7 Tage, Löschliste), Impressum- und Datenschutz-Vorlage der Instanzen, Signature ohne Nennung von eeziframes (nur „technischer Dienstleister“), Rollen im Dashboard (Inhaber als Auftragsverarbeiter auch für die Anmeldedaten der Mitarbeiter). *Bis dahin bleibt die Paket-Kasse im Live-Modus zu.*
5. **F5 Zielgruppe.** *Vorschlag: zunächst nur Unternehmer in Deutschland, Preise netto zzgl. 19 % (bzw. § 19 UStG nach `MWST`); Österreich und Schweiz (Reverse-Charge bzw. Drittland) später auf Anfrage.*

---

## 6. Konfigurator-Ausbau (getrennt vom Domain-Bau; aus Karte „katalog“, nach Wirkung sortiert)

| Rang | Schritt | Nutzen | Aufwand | Wo |
|---|---|---|---|---|
| 1 | **Sortiment und Vorbelegung je Instanz** (Filter auf `OPT`/`DETAIL`, Standard des Betriebs), gepflegt in der Zentrale als neues Merkmal/Feld der Instanz | Betrieb +++, Kunde ++ | L | modell.js `OPT`/`DETAIL`, app.js `qList` (3417), einladung.js `auftritt`, zentrale-instanzen.js |
| 2 | **Erst gestalten, später messen**: Start mit Schätzmaß, danach „jetzt genau messen“ oder „misst der Betrieb“ (Klärungsliste kennt „Nicht gemessen“, modell.js:538) | größter Hebel für die Zahl der Anfragen | M | app.js:4437 |
| 3 | **Fachregeln automatisch** (Sicherheitsglas bei Absturz/bodentief, RC2 nur als Paket, PSK nie barrierefrei, Kippbegrenzer) | Betrieb ++, Kunde + | S–M | app.js ab 5551, modell.js `klaerung` 490ff. |
| 4 | **Laienfragen und Schallschutz über die Lage** (Bohren erlaubt?, Smart-Home-Bestand, Akku; Schallschutzklasse/Rw im Blatt) | Kunde ++, Betrieb ++ | S | modell.js `OPT`, Detail `sensor` 252, modell.js:21/370, blatt.js |
| 5 | **Kennwerte live** (Uw-Schätzung mit Förder-Ampel „0,95 erreicht?“) | Kunde ++ | M | modell.js:370, Fragenkopf |
| 6 | **Laien-Lücken im Detail** (Fensterbank innen aus Laibung, Glas VSG/P4A/ESG, Beschlag-Komfort als Mehrfachfrage, Holz-Oberfläche, Sonnenschutz S-Lamelle/ZIP; Rollladenkasten dämmen, Renovierungsrahmen) | Betrieb ++ | je S | modell.js, app.js `DETAIL_UI` |
| 7 | **Geschwindigkeit** (Abrechnung aus modell.js lösen, App in Teile, Hash-Dateinamen, Bühne bei Bedarf, < 100 ms je Tipp) | Kunde ++ (Mobilnetz) | M | app/index.html:88-92, modell.js ab 1027, app.js:2370 |
| 8 | **Offline-Warteschlange fürs Senden** (Manifest je Instanz kommt schon mit Strang A) und „auf anderem Gerät weitermachen“ per QR | Kunde + | M | app.js:4369 |
| 9 | **Barrierefreiheit** (3-D-Modell als Text, volle Tastatur, große Schrift; BFSG je Betrieb prüfen) | Kunde +, Recht | M | app.js, buehne.js |
| 10 | **Fotos und KI ausbauen** (Gütecheck vor dem Upload, Teilung „wie bisher“ als Vorschlag, Fassadenfoto legt Positionen an, Zollstock-Beleg) | Kunde ++, Betrieb ++ | M–L | ki.js:41/49, app.js:5272 |

Danach: Fenster ins eigene Hausfoto (L), Einbettung auf der Website des Betriebs mit freigegebenem `frame-ancestors` nur für dessen Domain und anonyme Abbruchmessung je Frage (S–L), weitere Formen, Kopplungen und Haustür als eigene Art (L).
