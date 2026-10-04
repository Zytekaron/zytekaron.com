import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { calculateAge } from '../public/js/calculate-age.js';

let server;
let origin;
before(async () => {
  if (process.env.SITE_TEST_ORIGIN) {
    origin = new URL(process.env.SITE_TEST_ORIGIN).origin;
    return;
  }
  server = spawn(process.execPath, ['src/server.js'], {
    env: { ...process.env, PORT: '0', HOSTNAME: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  origin = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server did not start')), 10000);
    const exit = code => { clearTimeout(timeout); reject(new Error(`Server exited: ${code}`)); };
    server.once('exit', exit);
    server.once('error', reject);
    server.stdout.on('data', chunk => {
      const match = chunk.toString().match(/Listening on (http:\/\/127\.0\.0\.1:\d+)/);
      if (match) { clearTimeout(timeout); server.off('exit', exit); resolve(match[1]); }
    });
  });
});
after(async () => {
  if (server && server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
});

test('all public pages render complete, accessible documents', async () => {
  for (const route of ['/', '/about', '/projects', '/referrals', '/about/']) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /<html lang="en">/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${route}: one main heading`);
    assert.match(html, /Skip to content/);
    assert.match(html, /mailto:michael@zyte\.dev/);
    assert.doesNotMatch(html, /michael@zyte\.me/);
    assert.match(html, /aria-current="page"/);
    assert.doesNotMatch(html, /Foo Project|Random Project|Service 3|href="\/docs"|20-year-old/);
    for (const tag of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      assert.match(tag[0], /rel="noopener noreferrer"/);
    }
  }
});

test('age changes on the birthday in Seattle rather than at UTC midnight', () => {
  assert.equal(calculateAge('2003-07-10', new Date('2026-07-10T06:59:59.999Z')), 22);
  assert.equal(calculateAge('2003-07-10', new Date('2026-07-10T07:00:00.000Z')), 23);
  assert.equal(calculateAge('2003-07-10', new Date('2027-01-01T08:00:00.000Z')), 23);
  assert.equal(calculateAge('2003-07-10', new Date('2027-07-10T07:00:00.000Z')), 24);
  assert.throws(() => calculateAge('2003-02-30'), RangeError);
});

test('about page renders the current age and includes automatic browser updates', async () => {
  const html = await (await fetch(origin + '/about')).text();
  const expected = calculateAge('2003-07-10');
  assert.match(html, new RegExp(`data-age-time-zone="America/Los_Angeles">${expected}</span> years old`));
  assert.match(html, /<script type="module" src="\/js\/age\.js"><\/script>/);
  const calculator = await fetch(origin + '/js/calculate-age.js');
  assert.equal(calculator.status, 200);
});

test('every local navigation and asset link resolves', async () => {
  const links = new Set();
  for (const route of ['/', '/about', '/projects', '/referrals']) {
    const html = await (await fetch(origin + route)).text();
    for (const match of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)) links.add(match[1]);
  }
  for (const link of links) {
    const response = await fetch(origin + link, { method: 'HEAD', redirect: 'manual' });
    assert.equal(response.status, 200, link);
  }
});

test('missing pages and invalid error codes return useful error responses', async () => {
  for (const [route, status] of [
    ['/does-not-exist', 404], ['/error', 400], ['/error?code=404', 404],
    ['/error?code=503', 503], ['/error?code=404.5', 400], ['/error?code[]=404', 400],
  ]) {
    const response = await fetch(origin + route, { redirect: 'manual' });
    assert.equal(response.status, status, route);
    const html = await response.text();
    assert.match(html, /Back to home/);
    assert.doesNotMatch(html, /ReferenceError|TypeError/);
  }
});

test('error return links reject executable and external destinations', async () => {
  for (const ref of ['javascript:alert(1)', 'https://example.com/phishing', '//example.com', '/error?code=404']) {
    const html = await (await fetch(`${origin}/error?code=404&ref=${encodeURIComponent(ref)}`)).text();
    assert.doesNotMatch(html, />Go back /);
  }
  const html = await (await fetch(`${origin}/error?code=404&ref=${encodeURIComponent('https://zyte.dev/projects')}`)).text();
  assert.match(html, /href="\/projects">Go back /);
});
