require('dotenv').config();

const fs = require('fs');
const express = require('express');

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
            let html = fs.readFileSync('./templates/' + name + '.html').toString();
            for (const [key, value] of Object.entries(vars)) {
                html = html.replace(new RegExp('{' + key + '}', 'g'), value);
            }
            return html;
        }
    },
    links: {
        sk: 'https://github.com/Zytekaron/sk',
        jvar: 'https://github.com/Zytekaron/jvar',
    }
};

app.get('/', (req, res) => res.status(200).render('home', context));
app.get('/about', (req, res) => res.status(200).render('about', context));
app.get('/contact', (req, res) => res.status(200).render('contact', context));

app.get('/discord', (req, res) => {
    res.status(301).location('https://discord.gg/FfzwgUm');
});

app.get('/youtube', (req, res) => {
    res.status(301).location('https://www.youtube.com/channel/UC67LJAS2TtIedsr0xA8UQ3w');
});

const shortUrls = require('./short');
for (const [basePath, innerPaths] of Object.entries(shortUrls)) {
    for (const [item, url] of Object.entries(innerPaths)) {
        // console.log('GET', expressPath(basePath, item), '->', url);
        app.get(expressPath(basePath, item), (req, res) => {
            res.status(301).location(url);
        });
    }
}

function expressPath(...path) {
    const out = [];
    for (const str of path) {
        out.push('/');
        out.push(str);
    }
    return out.join('');
}

app.listen(port, () => console.log("Listening on " + port));

console.log("testing process environment variables");
console.log("port:", process.env.PORT);
console.log("token:", process.env.TOKEN);
