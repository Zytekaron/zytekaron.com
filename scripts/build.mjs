import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ejs from 'ejs';
import { site, projects, referrals } from '../src/config.js';
import readJSON from '../src/utils/readJSON.js';
import renderMarkdown from '../src/utils/renderMarkdown.js';
import projectDir from '../src/utils/_project_dir.js';
import { calculateAge } from '../public/js/calculate-age.js';

// The Express app remains the main runtime. This export uses the same EJS
// templates and CMS files to produce a portable static review/deployment.
const output = path.join(projectDir, 'dist');
const imports = readJSON('cms/_imports.json');
const now = new Date();
const age = calculateAge(site.global.profile.birthDate, now, site.global.profile.timeZone);
const visibleProjects = projects.filter(project => !project.hide).map(project => ({
  ...project, pinned: Boolean(project.pinned),
}));
const pages = [
  { route: '/', subView: 'index', content: renderMarkdown('home-intro').content,
    projects: visibleProjects.filter(project => project.pinned) },
  { route: '/about', subView: 'about', content: renderMarkdown('about').content },
  { route: '/projects', subView: 'projects', content: renderMarkdown('projects').content,
    projects: [...visibleProjects].sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.title.localeCompare(b.title)) },
  { route: '/referrals', subView: 'referrals', referrals: referrals.filter(referral => !referral.hide) },
  { route: '/error', subView: 'error', code: 404, referer: null, ...site.global.errors['404'] },
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(projectDir, 'public'), output, { recursive: true });
for (const page of pages) {
  const html = await ejs.renderFile(path.join(projectDir, 'views/layout.ejs'), {
    global: { ...site.global, socials: site.global.socials.filter(social => !social.hide) },
    imports: imports[page.route], __path: page.route, _date: now, _age: age, ...page,
  });
  const destination = path.join(output, page.route, 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
  if (page.route === '/error') await writeFile(path.join(output, '404.html'), html);
}
console.log(`Built ${pages.length} pages and the 404 fallback in dist/.`);
