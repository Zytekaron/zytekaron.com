import markdownit from "markdown-it";
import readFile from "./readFile.js";
import matter from "gray-matter";

const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
});

const renderMarkdownFromStr = (raw) => {
    const frontMatter = matter(raw);
    const rendered = md.render(frontMatter.content);

    return { meta: frontMatter.data, content: rendered };
};

const renderMarkdown = (file) => {
    const raw = readFile(
        "cms/content/" + file + (file.toLowerCase().endsWith(".md") ? "" : ".md")
    );

    return renderMarkdownFromStr(raw);
};

export default renderMarkdown;
export { renderMarkdown, renderMarkdownFromStr };
