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
  FALLBACK_EMAIL:    'info@alltagshilfe-hannover.de'  // TODO: echte E-Mail
};
