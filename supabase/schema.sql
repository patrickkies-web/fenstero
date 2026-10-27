-- eeziframes · Datenbank (Supabase/Postgres)
-- Im SQL-Editor des Supabase-Projekts ausführen (docs/ONLINE-STELLEN.md, Stufe 2). Die Datei lässt sich gefahrlos erneut ausführen:
-- Vorhandenes bleibt, Neues (zuletzt: Zustimmung an der Kasse und Vertragsbestätigung bei den Zahlungen, davor Zwischenstände der
-- Kundenlinks, Protokoll und Statistik der Zentrale) kommt dazu. Ganz unten: Konfigurator-Instanzen und Pakete (Oktober 2026).
-- Der Server greift ausschließlich mit dem geheimen Schlüssel zu (sb_secret_… bzw. früher service_role, functions/api/speicher.js);
-- Browser haben keinen direkten Zugriff: Row Level Security ist an, ohne Regeln für anon/authenticated.

create extension if not exists pgcrypto;

-- Ein Betrieb = ein Konto. Projekte, Buchungen, Rechnungen und Nachrichten liegen als JSON-Dokument in "daten"
-- (gleiches Format wie im Browser, Regeln in web/assets/modell.js). "version" schützt vor gleichzeitigem Überschreiben.
create table if not exists public.betriebe (
  id                  uuid primary key default gen_random_uuid(),
  auth_user           uuid unique,                       -- Nutzer aus Supabase Auth (E-Mail-Code)
  mail                text unique not null,
  name                text not null,
  plz                 text,
  tel_norm            text,                              -- nur Ziffern, für die Doppelkonto-Prüfung
  name_norm           text,                              -- Firmenname ohne Rechtsform/Leerzeichen, klein
  version             integer not null default 0,
  daten               jsonb not null default '{}'::jsonb,
  stripe_customer     text,
  stripe_subscription text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists betriebe_daten_idx on public.betriebe using gin (daten jsonb_path_ops); -- Link-Code → Betrieb (daten @> {"links":[{"code":…}]})
create index if not exists betriebe_tel_idx on public.betriebe (tel_norm);
create index if not exists betriebe_name_idx on public.betriebe (name_norm, plz);
create index if not exists betriebe_customer_idx on public.betriebe (stripe_customer);
create index if not exists betriebe_subscription_idx on public.betriebe (stripe_subscription);

-- Käufe des Aufmaßblatts (Hauseigentümer, 7,99 €): eine Zeile je Stripe-Kasse
create table if not exists public.zahlungen (
  id              uuid primary key default gen_random_uuid(),
  stripe_session  text unique not null,
  art             text not null default 'aufmass',
  kennung         text,                                  -- Kennung des Projekts in der App
  mail            text,
  betrag_cent     integer not null default 0,
  status          text not null default 'offen',         -- offen | bezahlt
  token           text,                                  -- Freischalt-Nachweis (HMAC), siehe functions/api/zahlung.js
  created_at      timestamptz not null default now()
);
create index if not exists zahlungen_kennung_idx on public.zahlungen (kennung);
-- Seit Oktober 2026: Zustimmung an der Kasse (AGB-Stand, Wortlaut, Zeitpunkt; Nachweis für das Erlöschen des Widerrufsrechts),
-- Zeitpunkt der Zahlung und der zugestellten Vertragsbestätigung (der tägliche Lauf holt nicht zugestellte nach, versuche zählt mit)
alter table public.zahlungen add column if not exists daten jsonb not null default '{}'::jsonb;
alter table public.zahlungen add column if not exists bezahlt_am timestamptz;
alter table public.zahlungen add column if not exists bestaetigt_am timestamptz;
alter table public.zahlungen add column if not exists versuche integer not null default 0;
create index if not exists zahlungen_offen_idx on public.zahlungen (status, bestaetigt_am);

-- Verarbeitete Stripe-Ereignisse (Webhook), damit nichts doppelt gebucht wird
create table if not exists public.ereignisse (
  stripe_id   text primary key,
  created_at  timestamptz not null default now()
);

-- Zentrale des Inhabers: Protokoll der Anmeldungen und Eingriffe (sperren, löschen, Export, Einblick …), siehe functions/api/zentrale.js,
-- und der Widerrufe über die Website (widerruf, nachgeholte Eingangsbestätigung widerruf_bestaetigt; functions/api/widerruf.js).
-- Aufbewahrung: Anmeldungen 90 Tage, Eingriffe und Löschnachweise 3 Jahre, Widerrufe bis zum Ende des dritten Jahres nach dem Eingang
-- (der Server räumt jeden Tag auf).
create table if not exists public.protokoll (
  id       uuid primary key default gen_random_uuid(),
  zeit     timestamptz not null default now(),
  art      text not null,                                  -- anmeldung | anmeldung_fehlgeschlagen | sperren | entsperren | loeschen | export | einblick | notiz | gutschrift | nachricht | abo | abrechnung | …
  betrieb  uuid,                                           -- betroffenes Konto (bleibt nach dem Löschen als Nachweis stehen)
  text     text not null default '',                       -- kurze Beschreibung, z. B. die Begründung
  daten    jsonb not null default '{}'::jsonb,             -- Einzelheiten, z. B. der Löschnachweis
  netz     text                                            -- nur bei Anmeldungen: gekürzte IP-Adresse (/24 bzw. /48)
);
create index if not exists protokoll_zeit_idx on public.protokoll (zeit desc);
create index if not exists protokoll_betrieb_idx on public.protokoll (betrieb, zeit desc);

-- Eigene Statistik ohne Cookies: nur Tageszähler je Schlüssel (z. B. aufruf:/app/, herkunft:Google, ereignis:kauf),
-- keine IP-Adressen, keine Kennungen, keine einzelnen Aufrufe (functions/api/statistik.js)
create table if not exists public.statistik (
  tag         date not null,
  schluessel  text not null,
  anzahl      integer not null default 0,
  primary key (tag, schluessel)
);
-- Zählt eine Liste von Schlüsseln für einen Tag hoch (ein Aufruf je Seitenaufruf oder Vorgang)
create or replace function public.eeziframes_zaehlen(p_tag date, p_schluessel text[]) returns void
language sql security invoker set search_path = '' as $$
  insert into public.statistik (tag, schluessel, anzahl)
  select p_tag, s, count(*)::integer from unnest(p_schluessel) as s group by s
  on conflict (tag, schluessel) do update set anzahl = public.statistik.anzahl + excluded.anzahl;
$$;
-- Auswertung für die Zentrale, in der Datenbank verdichtet: je Tag die Summen der Aufrufe, Besuche und Bots (Schlüssel aufruf:* usw.),
-- dazu je Schlüssel die Summe über den Zeitraum (ohne Tag). So bleibt die Antwort klein, auch über ein Jahr.
create or replace function public.eeziframes_auswerten(p_von date) returns table (tag date, schluessel text, anzahl bigint)
language sql stable security invoker set search_path = '' as $$
  select s.tag, split_part(s.schluessel, ':', 1) || ':*', sum(s.anzahl)::bigint
    from public.statistik s
   where s.tag >= p_von and split_part(s.schluessel, ':', 1) in ('aufruf', 'besuch', 'bot')
   group by s.tag, split_part(s.schluessel, ':', 1)
  union all
  select null::date, s.schluessel, sum(s.anzahl)::bigint
    from public.statistik s
   where s.tag >= p_von
   group by s.schluessel;
$$;
-- Dasselbe für einen Zeitraum mit Ende (Zentrale: frei gewählter Zeitraum, beide Tage eingeschlossen)
create or replace function public.eeziframes_auswerten_zeitraum(p_von date, p_bis date) returns table (tag date, schluessel text, anzahl bigint)
language sql stable security invoker set search_path = '' as $$
  select s.tag, split_part(s.schluessel, ':', 1) || ':*', sum(s.anzahl)::bigint
    from public.statistik s
   where s.tag between p_von and p_bis and split_part(s.schluessel, ':', 1) in ('aufruf', 'besuch', 'bot')
   group by s.tag, split_part(s.schluessel, ':', 1)
  union all
  select null::date, s.schluessel, sum(s.anzahl)::bigint
    from public.statistik s
   where s.tag between p_von and p_bis
   group by s.schluessel;
$$;

-- Zwischenstand eines Kundenlinks: Der Kunde kommt über seinen Link zurück (auch auf einem anderen Gerät) und sieht seine Fenster.
-- Ohne Fotos (die bleiben auf dem Gerät). meta hält die Zähler gegen Mehrfachnutzung: angelegte Fenster (auch gelöschte) und je
-- Fenster erstes Speichern und Änderungen nach der ersten Woche (functions/api/entwurf.js). Gelöscht wird beim Aufräumen, wenn der
-- Link fertig, abgelaufen oder weg ist.
create table if not exists public.entwuerfe (
  code        text primary key,                          -- Code des Kundenlinks
  betrieb     uuid not null references public.betriebe(id) on delete cascade,
  daten       jsonb not null default '{}'::jsonb,        -- Fenster und Angaben zum Haus, wie in der App, ohne Fotos
  meta        jsonb not null default '{}'::jsonb,        -- Zähler (angelegt, fenster: {kennung: {t0, aend}}), gesendet
  stand       bigint not null default 0,                 -- letzte Änderung im Browser (Millisekunden)
  version     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists entwuerfe_betrieb_idx on public.entwuerfe (betrieb);
create index if not exists entwuerfe_updated_idx on public.entwuerfe (updated_at);

-- Aufmaße der Hauseigentümer mit Konto (functions/api/eigene.js): Wer ohne Link eines Fensterbauers misst, startet als Gast (alles im
-- Browser). Wer sein Aufmaß sichert (E-Mail und Code, kein Passwort), hat es hier und damit auf jedem Gerät; zum Kauf des
-- Aufmaßblatts ist das Konto Pflicht. Ohne Fotos; meta hält die Zähler gegen Mehrfachnutzung und den Kauf. Gelöscht wird in der App
-- (Aufmaß oder Konto löschen: Inhalt sofort weg, eine Löschmarke mit Kennung und Zeitpunkt bleibt 12 Monate, damit ein anderes Gerät
-- das Aufmaß nicht wieder anlegt) und beim Aufräumen nach Fristen. Wird die Anmeldung gelöscht, verlieren die Zeilen ihren Besitzer.
create table if not exists public.eigene (
  kennung     text primary key,                          -- Kennung des Aufmaßes (dieselbe wie beim Kauf)
  nutzer      uuid references auth.users(id) on delete set null, -- die Anmeldung (Supabase Auth); leer, wenn sie gelöscht ist
  daten       jsonb not null default '{}'::jsonb,        -- Fenster und Angaben zum Haus, wie in der App, ohne Fotos
  meta        jsonb not null default '{}'::jsonb,        -- Zähler (angelegt, fenster, geloescht), Kauf (bezahlt), Löschmarke (entfernt)
  stand       bigint not null default 0,                 -- letzte Änderung im Browser (Millisekunden)
  version     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists eigene_nutzer_idx on public.eigene (nutzer);
create index if not exists eigene_updated_idx on public.eigene (updated_at);
-- Wer die Tabelle mit einer früheren Fassung angelegt hat (nutzer not null, on delete cascade): angleichen, damit Löschmarken das
-- Löschen der Anmeldung überstehen
alter table public.eigene alter column nutzer drop not null;
alter table public.eigene drop constraint if exists eigene_nutzer_fkey;
alter table public.eigene add constraint eigene_nutzer_fkey foreign key (nutzer) references auth.users(id) on delete set null;

-- Kein direkter Zugriff aus dem Browser: RLS an, keine Regeln → nur der geheime Schlüssel des Servers kommt durch
alter table public.betriebe   enable row level security;
alter table public.zahlungen  enable row level security;
alter table public.ereignisse enable row level security;
alter table public.protokoll  enable row level security;
alter table public.statistik  enable row level security;
alter table public.entwuerfe  enable row level security;
alter table public.eigene     enable row level security;
revoke all on public.betriebe, public.zahlungen, public.ereignisse, public.protokoll, public.statistik, public.entwuerfe, public.eigene from anon, authenticated;
revoke all on function public.eeziframes_zaehlen(date, text[]) from public, anon, authenticated;
revoke all on function public.eeziframes_auswerten(date) from public, anon, authenticated;
revoke all on function public.eeziframes_auswerten_zeitraum(date, date) from public, anon, authenticated;
-- Der Server (geheimer Schlüssel sb_secret_… bzw. service_role) darf lesen und schreiben; ausdrücklich gewährt, auch wenn neue
-- Tabellen im Projekt nicht mehr von selbst für die Data API freigegeben werden
grant usage on schema public to service_role;
grant select, insert, update, delete on public.betriebe, public.zahlungen, public.ereignisse, public.protokoll, public.statistik, public.entwuerfe, public.eigene to service_role;
grant execute on function public.eeziframes_zaehlen(date, text[]) to service_role;
grant execute on function public.eeziframes_auswerten(date) to service_role;
grant execute on function public.eeziframes_auswerten_zeitraum(date, date) to service_role;

-- updated_at pflegt der Server selbst (speicher.js); dieser Auslöser ist nur ein Netz für Änderungen von Hand
create or replace function public.eeziframes_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists betriebe_touch on public.betriebe;
create trigger betriebe_touch before update on public.betriebe for each row execute function public.eeziframes_touch();
-- Rest aus der Zeit vor der Umbenennung, falls die Datei schon einmal ausgeführt wurde
drop function if exists public.fensterino_touch();

-- ===== Konfigurator-Instanzen und Pakete (docs/INSTANZEN.md) =====
-- Seit Oktober 2026: Fensteranbieter bestellen auf eeziframes.com ein Paket (Essential, Plus, Signature) und bekommen einen eigenen
-- Konfigurator unter ihrer Domain (eine Instanz). Bestehende Tabellen und Daten bleiben, wie sie sind; nichts wird migriert.
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
  marke       jsonb not null default '{}'::jsonb,             -- veröffentlicht: { name, titel, beschreibung, farbe, v, bilder:{logo,icon32,icon180,icon512,og,start:[],ap}, start:{kicker,ueberschrift,text} }
  entwurf     jsonb,                                          -- Gestaltung in Arbeit (Zentrale), gleiche Form
  eingang     jsonb not null default '{"mails":[]}'::jsonb,   -- { mails:[{ mail, bestaetigt: ISO|null, eingeladen: ISO }], absendername }
  zugang      jsonb not null default '[]'::jsonb,             -- Signature: [{ mail, uid, name, rolle, bestaetigt, zuletzt, aus }]
  recht       jsonb not null default '{}'::jsonb,             -- Impressum- und Datenschutzangaben, Bundesland, Stand
  indexierung boolean not null default false,
  demo        boolean not null default false,                 -- Demo-Instanz der Verkaufsseite: Anfragen an MAIL_KONTAKT, nach 1 Tag weg
  nr_jahr     integer, nr_zaehler integer not null default 0,
  version     integer not null default 1,                     -- steigt bei jeder Änderung: Schutz vor gleichzeitigem Schreiben und Cache-Schlüssel (/marke/<version>/…)
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

-- Instanz mit Betriebszeile atomar anlegen; betriebe.mail ist unique not null → Platzhalter auf .invalid,
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

-- Projektliste des Dashboards ohne Aufmaß und Vorstand (daten - aufmass - vorher), damit die Liste klein bleibt (speicher.js anfragenVonBetrieb)
create or replace function public.anfragen_kopf(p_betrieb uuid, p_seit timestamptz default null) returns setof jsonb language sql stable set search_path = '' as $$
  select (to_jsonb(a) - 'daten') || jsonb_build_object('daten', a.daten - 'aufmass' - 'vorher')
    from public.anfragen a
   where a.betrieb = p_betrieb and (p_seit is null or a.updated_at >= p_seit)
   order by a.updated_at desc
   limit 2000 $$;

-- Dauerhafter Zähler für Budgets und Grenzen (bremse.js budget): zählt einen Schlüssel hoch und gibt den neuen Stand zurück, atomar
create or replace function public.eeziframes_budget(p_tag date, p_schluessel text, p_n integer default 1) returns integer
language sql security invoker set search_path = '' as $$
  insert into public.statistik (tag, schluessel, anzahl) values (p_tag, p_schluessel, p_n)
  on conflict (tag, schluessel) do update set anzahl = public.statistik.anzahl + excluded.anzahl
  returning anzahl $$;

alter table public.partner             enable row level security;
alter table public.bestellungen        enable row level security;
alter table public.partner_nachrichten enable row level security;
alter table public.instanzen           enable row level security;
alter table public.instanz_hosts       enable row level security;
alter table public.anfragen            enable row level security;
revoke all on public.partner, public.bestellungen, public.partner_nachrichten, public.instanzen, public.instanz_hosts, public.anfragen from anon, authenticated;
revoke all on function public.instanz_nr(uuid), public.instanz_fuer_host(text), public.instanz_anlegen(jsonb), public.anfragen_kopf(uuid, timestamptz), public.eeziframes_budget(date, text, integer) from public, anon, authenticated;
grant select, insert, update, delete on public.partner, public.bestellungen, public.partner_nachrichten, public.instanzen, public.instanz_hosts, public.anfragen to service_role;
grant usage, select on sequence public.bestellung_nr to service_role;
grant execute on function public.instanz_nr(uuid), public.instanz_fuer_host(text), public.instanz_anlegen(jsonb), public.anfragen_kopf(uuid, timestamptz), public.eeziframes_budget(date, text, integer) to service_role;
drop trigger if exists partner_touch on public.partner;           create trigger partner_touch before update on public.partner for each row execute function public.eeziframes_touch();
drop trigger if exists bestellungen_touch on public.bestellungen; create trigger bestellungen_touch before update on public.bestellungen for each row execute function public.eeziframes_touch();
drop trigger if exists instanzen_touch on public.instanzen;       create trigger instanzen_touch before update on public.instanzen for each row execute function public.eeziframes_touch();
drop trigger if exists anfragen_touch on public.anfragen;         create trigger anfragen_touch before update on public.anfragen for each row execute function public.eeziframes_touch();

-- ========== Aufträge (seit 27.10.2026): Bestellung einer Landingpage mit Konfigurator, Kundenbereich /konto/, Zentrale /zentrale/ ==========
-- functions/auftrag/daten.js. Kunden melden sich per Code an (anmeldecodes, nur HMAC des Codes). Ein Auftrag ist ein Dokument; adresse hält
-- bei Essential den Namen unter eeziframes.com (eindeutig, solange der Auftrag läuft). Erneut ausführen schadet nicht.
create table if not exists public.kunden (
  id uuid primary key default gen_random_uuid(),
  mail text not null unique,
  stripe text not null default '',
  angemeldet_am timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.anmeldecodes (
  mail text primary key,
  hash text not null,
  bis timestamptz not null,
  fehl integer not null default 0,
  created_at timestamptz not null default now()
);
create sequence if not exists public.auftrag_nr;
create table if not exists public.auftraege (
  id uuid primary key default gen_random_uuid(),
  nr text not null unique,
  kunde uuid not null references public.kunden(id) on delete cascade,
  paket text not null,
  weg text not null default 'ausfuehrlich',
  stand text not null default 'entwurf',
  angaben jsonb not null default '{}'::jsonb,
  dateien jsonb not null default '[]'::jsonb,
  preise jsonb,
  zahlung jsonb not null default '{}'::jsonb,
  abo jsonb not null default '{}'::jsonb,
  vorschau jsonb not null default '{}'::jsonb,
  zustimmung jsonb,
  verlauf jsonb not null default '[]'::jsonb,
  notiz text not null default '',
  adresse text,
  angaben_geaendert timestamptz,
  gesehen timestamptz,
  wechsel jsonb,
  version integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.auftraege add column if not exists angaben_geaendert timestamptz;
alter table public.auftraege add column if not exists gesehen timestamptz;
alter table public.auftraege add column if not exists wechsel jsonb;
-- KI-Kontingent (27.10.2026): verknüpfter Konfigurator { id, id8, host, seit } und { frei, frei_seit, abgerechnet: { 'JJJJ-MM': {…} } }
alter table public.auftraege add column if not exists instanz jsonb;
alter table public.auftraege add column if not exists ki jsonb not null default '{}'::jsonb;
create index if not exists auftraege_instanz on public.auftraege ((instanz->>'id'));
create index if not exists auftraege_kunde on public.auftraege (kunde);
create index if not exists auftraege_session on public.auftraege ((zahlung->>'session'));
create unique index if not exists auftraege_adresse on public.auftraege (adresse) where adresse is not null and stand in ('angefragt', 'bezahlt', 'in_arbeit', 'vorschau', 'live', 'pausiert');
create table if not exists public.auftrag_nachrichten (
  id uuid primary key default gen_random_uuid(),
  auftrag uuid not null references public.auftraege(id) on delete cascade,
  von text not null check (von in ('kunde', 'inhaber', 'system')),
  text text not null,
  gelesen boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists auftrag_nachrichten_auftrag on public.auftrag_nachrichten (auftrag, created_at);
create or replace function public.naechste_auftrag_nr() returns bigint language sql security invoker set search_path = '' as $$ select nextval('public.auftrag_nr') $$;
alter table public.kunden              enable row level security;
alter table public.anmeldecodes        enable row level security;
alter table public.auftraege           enable row level security;
alter table public.auftrag_nachrichten enable row level security;
revoke all on public.kunden, public.anmeldecodes, public.auftraege, public.auftrag_nachrichten from anon, authenticated;
revoke all on function public.naechste_auftrag_nr() from public, anon, authenticated;
grant select, insert, update, delete on public.kunden, public.anmeldecodes, public.auftraege, public.auftrag_nachrichten to service_role;
grant usage, select on sequence public.auftrag_nr to service_role;
grant execute on function public.naechste_auftrag_nr() to service_role;
