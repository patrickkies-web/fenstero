/* eeziframes · Code an die Telefonnummer des Hauseigentümers (docs/VERMITTLUNG.md, Abschnitte 2 und 10)
   Anbieter: seven.io (früher sms77, Sitz in Kiel, Deutschland). Schnittstelle geprüft gegen docs.seven.io am 29.10.2026:
     SMS:   POST https://gateway.seven.io/api/sms    Kopf X-Api-Key, Accept: application/json; Formular to, text, from
     Anruf: POST https://gateway.seven.io/api/voice  dasselbe mit to, text (Klartext oder SSML, Stimme über <voice name="…">)
     Antwort JSON mit success "100" = angenommen (101 teilweise, 2xx/3xx/4xx/5xx/9xx Fehler, etwa 500 Guthaben, 900 Schlüssel).
   Zugangsdaten (Cloudflare → Variablen und Geheimnisse): SMS_API_KEY (Secret, API-Schlüssel aus dem Konto bei seven.io), optional
   SMS_ABSENDER (Text, Absender der SMS, bis 11 Zeichen; Vorgabe eeziframes) und SMS_STIMME (Stimme des Anrufs; Vorgabe de-de-female,
   Schema Sprache plus female/male laut seven; vor dem Start mit einer eigenen Festnetznummer ausprobieren).
   Ein anderer Anbieter passt hierher: senden(tel, code, kanal) → { ok } austauschen, sonst ändert sich nichts.
   Attrappe: SMS_ATTRAPPE=1 oder DATEN_ATTRAPPE=1 (ohne SMS_API_KEY): Code immer 123456, verschickt wird nichts.
   Ohne Anbieter und ohne Attrappe: kein Dienst (null); die Vermittlung läuft dann ohne Code („Nummer nicht bestätigt“). */

const GATEWAY = 'https://gateway.seven.io/api/';

/* SMS_ATTRAPPE=0 schaltet die Attrappe trotz DATEN_ATTRAPPE ab (Prüfung des Wegs ohne Code) */
export const smsArt = (env) => { env = env || {}; return String(env.SMS_API_KEY || '').trim() ? 'sms' : env.SMS_ATTRAPPE === '1' || (env.DATEN_ATTRAPPE === '1' && env.SMS_ATTRAPPE !== '0') ? 'attrappe' : ''; };

/* Text, den die Stimme vorliest: Ziffern einzeln, zweimal, mit Pausen */
export function ansage(code, stimme) {
  const z = String(code).split('').join(', ');
  return '<voice name="' + String(stimme || 'de-de-female').replace(/[^a-z-]/gi, '') + '">Hallo, hier ist eezi frames. Dein Code lautet: <break time="600ms"/>' + z + '. <break time="1s"/>Noch einmal: ' + z + '. Er gilt zehn Minuten.</voice>';
}
export const smsText = (code) => 'Dein Code für eeziframes: ' + String(code).replace(/(\d{3})(\d{3})/, '$1 $2') + '. Er gilt 10 Minuten. Hast du keinen angefordert, ignoriere diese SMS.';

export function smsDienst(env) {
  env = env || {};
  const art = smsArt(env);
  if (!art) return null;
  if (art === 'attrappe') return { art: 'attrappe', senden: async () => ({ ok: true, attrappe: true }) };
  const key = String(env.SMS_API_KEY).trim(), absender = String(env.SMS_ABSENDER || 'eeziframes').replace(/[^A-Za-z0-9 ]/g, '').slice(0, 11) || 'eeziframes';
  return {
    art: 'seven',
    /* tel: +49…; kanal: 'sms' (Handy) oder 'anruf' (Festnetz, Code als Ansage). Ins Log kommen nur Status und Fehlercode, nie die Nummer */
    async senden(tel, code, kanal) {
      const anruf = kanal === 'anruf', form = new URLSearchParams({ to: String(tel).replace(/^\+/, ''), text: anruf ? ansage(code, env.SMS_STIMME) : smsText(code) });
      if (!anruf) form.set('from', absender);
      const ab = new AbortController(), uhr = setTimeout(() => ab.abort(), 12000);
      try {
        const r = await fetch(GATEWAY + (anruf ? 'voice' : 'sms'), { method: 'POST', signal: ab.signal, headers: { 'X-Api-Key': key, accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' }, body: form.toString() });
        const j = await r.json().catch(() => null);
        const ok = r.ok && j && String(j.success) === '100';
        if (!ok) console.log('Code nicht verschickt', anruf ? 'anruf' : 'sms', r.status, String((j && j.success) || '').slice(0, 10));
        return { ok: !!ok };
      } catch (e) { console.log('Code nicht verschickt', anruf ? 'anruf' : 'sms', String(e && e.name || 'Fehler').slice(0, 40)); return { ok: false }; }
      finally { clearTimeout(uhr); }
    }
  };
}
