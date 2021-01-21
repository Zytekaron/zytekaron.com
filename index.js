require('dotenv').config();

const fs = require('fs');
const express = require('express');
const YAML = require('yaml');
const type = require('jvar/fn/type');

const port = process.env.PORT || 8080;

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/views', express.static(__dirname + '/views'));

const context = {
    render: {
        js: (route, file = 'index') => `<script src="/views/${route}/${file}.js"></script>`,
        css: (route, file = 'index') => `<link rel="stylesheet" href="/views/${route}/${file}.css"/>`,
        template(name, vars = {}) {
            const html = fs.readFileSync(`./templates/${name}.html`).toString();
            const keyRegex = new RegExp(`{(${Object.keys(vars).join('|')})}`, 'gi');
            return html.replace(keyRegex, (_, key) => vars[key]);
        }
    },
    links: {
        sk: 'https://github.com/Zytekaron/sk',
        site: 'https://github.com/Zytekaron/zytekaron.com',
        jvar: 'https://github.com/Zytekaron/jvar.js',
        commando: 'https://github.com/Zytekaron/commando'
    }
};

app.get('/', (req, res) => res.status(200).render('home', context));
app.get('/about', (req, res) => res.status(200).render('about', context));
app.get('/contact', (req, res) => res.status(200).render('contact', context));

const text = fs.readFileSync('./links.yaml').toString();
const shortUrls = YAML.parse(text);
for (const [path, url] of keys(shortUrls)) {
    app.get(path, (req, res) => {
        res.status(301)
            .location(url)
            .end();
    });
}

app.use((req, res) => {
    res.status(404).render('404', context);
});

function* keys(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
        const sub = path + '/' + key;
        if (type(value) === 'object') {
            yield* keys(value, sub);
        } else {
            yield [sub, value];
        }
    }
}

app.listen(port, () => console.log("Listening on " + port));
