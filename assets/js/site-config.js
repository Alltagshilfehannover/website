/* =========================================================================
   Frontend-Konfiguration – HIER deine Supabase-Werte eintragen.
   (Diese Datei kannst du direkt bearbeiten, ohne die Seite neu zu bauen.)

   Der anon-/public-Key darf öffentlich im Frontend stehen – das ist bei
   Supabase so vorgesehen. Die Sicherheit kommt aus Row Level Security (RLS):
   Mit diesem Key kann man NUR neue Anfragen einfügen, aber KEINE lesen.
   >>> Den service_role-Key NIEMALS hier eintragen! <<<

   Solange die Felder leer sind, öffnet das Formular ersatzweise das
   E-Mail-Programm (mailto). Siehe SUPABASE-SETUP.md für die Einrichtung.
   ========================================================================= */
window.SITE_CONFIG = {
  SUPABASE_URL:      '',   // z. B. https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: '',   // dein anon / public Key aus dem Supabase-Dashboard
  CONTACT_TABLE:     'kontaktanfragen',
  FALLBACK_EMAIL:    'info@alltagshilfe-hannover.de',  // TODO: echte E-Mail

  // Bewerbungen (Lebenslauf/Anschreiben) → Supabase Storage + Tabelle (EU-Region).
  // Nutzt SUPABASE_URL/SUPABASE_ANON_KEY von oben. Siehe BEWERBUNG-SETUP.md.
  BEWERBUNG_TABLE:  'bewerbungen',
  BEWERBUNG_BUCKET: 'bewerbungen',

  // Statistik / Tracking (cookiefrei) → Tabelle für anonyme Seitenaufrufe.
  // Nutzt SUPABASE_URL/SUPABASE_ANON_KEY von oben zum SCHREIBEN. Siehe TRACKING-SETUP.md.
  TRACK_TABLE:      'seitenaufrufe',
  // Nur für das Dashboard (stats.html) zum LESEN. Anon-Key mit SELECT-Policy auf die
  // Statistik-Tabelle. Bleibt leer -> Dashboard zeigt „nicht konfiguriert".
  STATS_READ_KEY:   '',
  // Passwort für das Statistik-Dashboard (leichter Zugriffsschutz, bitte ändern).
  STATS_PASSWORD:   'hannover2026'
};
