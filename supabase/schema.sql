-- eeziframes · Datenbank (Supabase/Postgres)
-- Im SQL-Editor des Supabase-Projekts ausführen (docs/ONLINE-STELLEN.md, Stufe 2). Die Datei lässt sich gefahrlos erneut ausführen:
-- Vorhandenes bleibt, Neues (zuletzt: Zustimmung an der Kasse und Vertragsbestätigung bei den Zahlungen, davor Zwischenstände der
-- Kundenlinks, Protokoll und Statistik der Zentrale) kommt dazu.
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
