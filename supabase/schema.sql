-- eeziframes · Datenbank (Supabase/Postgres)
-- Im SQL-Editor des Supabase-Projekts ausführen (docs/ONLINE-STELLEN.md, Stufe 2). Die Datei lässt sich gefahrlos erneut ausführen:
-- Vorhandenes bleibt, Neues (zuletzt: Protokoll und Statistik der Zentrale) kommt dazu.
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

-- Verarbeitete Stripe-Ereignisse (Webhook), damit nichts doppelt gebucht wird
create table if not exists public.ereignisse (
  stripe_id   text primary key,
  created_at  timestamptz not null default now()
);

-- Zentrale des Inhabers: Protokoll der Anmeldungen und Eingriffe (sperren, löschen, Export, Einblick …), siehe functions/api/zentrale.js.
-- Aufbewahrung: Anmeldungen 90 Tage, Eingriffe und Löschnachweise 3 Jahre (der Server räumt beim Abrechnungslauf auf).
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

-- Kein direkter Zugriff aus dem Browser: RLS an, keine Regeln → nur der geheime Schlüssel des Servers kommt durch
alter table public.betriebe   enable row level security;
alter table public.zahlungen  enable row level security;
alter table public.ereignisse enable row level security;
alter table public.protokoll  enable row level security;
alter table public.statistik  enable row level security;
revoke all on public.betriebe, public.zahlungen, public.ereignisse, public.protokoll, public.statistik from anon, authenticated;
revoke all on function public.eeziframes_zaehlen(date, text[]) from public, anon, authenticated;
revoke all on function public.eeziframes_auswerten(date) from public, anon, authenticated;
-- Der Server (geheimer Schlüssel sb_secret_… bzw. service_role) darf lesen und schreiben; ausdrücklich gewährt, auch wenn neue
-- Tabellen im Projekt nicht mehr von selbst für die Data API freigegeben werden
grant usage on schema public to service_role;
grant select, insert, update, delete on public.betriebe, public.zahlungen, public.ereignisse, public.protokoll, public.statistik to service_role;
grant execute on function public.eeziframes_zaehlen(date, text[]) to service_role;
grant execute on function public.eeziframes_auswerten(date) to service_role;

-- updated_at pflegt der Server selbst (speicher.js); dieser Auslöser ist nur ein Netz für Änderungen von Hand
create or replace function public.eeziframes_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists betriebe_touch on public.betriebe;
create trigger betriebe_touch before update on public.betriebe for each row execute function public.eeziframes_touch();
-- Rest aus der Zeit vor der Umbenennung, falls die Datei schon einmal ausgeführt wurde
drop function if exists public.fensterino_touch();
