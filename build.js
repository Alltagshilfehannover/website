'use strict';
/* =========================================================================
   Build-Script – erzeugt alle statischen HTML-Seiten.
   Aufruf:  node build.js
   ========================================================================= */
var fs = require('fs');
var path = require('path');

var ROOT = __dirname;
var cfg  = require('./build/config');
var home = require('./build/home');
var locations = require('./build/locations');
var pages, legal;
try { pages = require('./build/pages'); } catch (e) { pages = null; console.log('· pages.js noch nicht vorhanden'); }
try { legal = require('./build/legal'); } catch (e) { legal = null; console.log('· legal.js noch nicht vorhanden'); }

var written = [];
function write(name, html) {
  fs.writeFileSync(path.join(ROOT, name), html, 'utf8');
  written.push(name);
}

/* ---------------------------------- Seiten ------------------------------- */
var ORTE = locations.ORTE;

write('index.html', home.render(ORTE));

locations.all().forEach(function (p) { write(p.slug, p.html); });

if (pages) { pages.all(ORTE).forEach(function (p) { write(p.slug, p.html); }); }
if (legal) { legal.all().forEach(function (p) { write(p.slug, p.html); }); }

/* -------------------------------- Sitemap -------------------------------- */
var base = cfg.site.domain.replace(/\/$/, '');
var urls = written.map(function (name) {
  var loc = base + '/' + (name === 'index.html' ? '' : name);
  var pr  = name === 'index.html' ? '1.0' : (name.indexOf('haushaltshilfe-') === 0 ? '0.8' : '0.7');
  return '  <url><loc>' + loc + '</loc><changefreq>monthly</changefreq><priority>' + pr + '</priority></url>';
}).join('\n');
var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

var robots = 'User-agent: *\nAllow: /\n\nSitemap: ' + base + '/sitemap.xml\n';
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');

/* --------------------------------- Report -------------------------------- */
console.log('\n✓ ' + written.length + ' HTML-Seiten erzeugt:');
written.forEach(function (n) { console.log('   – ' + n); });
console.log('✓ sitemap.xml (' + written.length + ' URLs) + robots.txt');
