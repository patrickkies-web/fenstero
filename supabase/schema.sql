-- Fensterino · Datenbank (Supabase/Postgres)
-- Einmal im SQL-Editor des Supabase-Projekts ausführen (docs/ONLINE-STELLEN.md, Stufe 2).
-- Der Server greift ausschließlich mit dem service_role-Schlüssel zu (functions/api/speicher.js);
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

-- Kein direkter Zugriff aus dem Browser: RLS an, keine Regeln → nur der service_role-Schlüssel kommt durch
alter table public.betriebe   enable row level security;
alter table public.zahlungen  enable row level security;
alter table public.ereignisse enable row level security;
revoke all on public.betriebe, public.zahlungen, public.ereignisse from anon, authenticated;

-- updated_at pflegt der Server selbst (speicher.js); dieser Auslöser ist nur ein Netz für Änderungen von Hand
create or replace function public.fensterino_touch() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists betriebe_touch on public.betriebe;
create trigger betriebe_touch before update on public.betriebe for each row execute function public.fensterino_touch();
