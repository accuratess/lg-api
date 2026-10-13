/**
 * Builds the documentation site into docs/ (published by GitHub Pages):
 * the guide from pages/*.md, the reference from schema.gql, the look from src/.
 *
 *   npm install && npm run build
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Marked } from "marked";
import {
	buildSchema,
	getNamedType,
	isEnumType,
	isInputObjectType,
	isObjectType,
	isScalarType,
	isNonNullType,
} from "graphql";

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, "docs");

const slug = (text) =>
	text
		.toLowerCase()
		.replace(/<[^>]+>/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- code highlighting (small, no dependencies) ---------- */

const KEYWORDS = {
	graphql: ["query", "mutation", "fragment", "on", "true", "false", "null"],
	js: ["const", "let", "await", "async", "return", "true", "false", "null", "new", "function"],
	php: ["true", "false", "null", "new", "return", "fn"],
	bash: ["curl"],
};

function highlight(code, lang) {
	const words = KEYWORDS[lang] ?? [];
	const rules = [
		["comment", lang === "js" || lang === "php" ? /\/\/[^\n]*/y : lang === "graphql" || lang === "bash" ? /#[^\n]*/y : null],
		["key", lang === "json" ? /"(?:[^"\\]|\\.)*"(?=\s*:)/y : null],
		["string", /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/y],
		["variable", lang === "graphql" || lang === "php" ? /\$[A-Za-z_]\w*/y : null],
		["number", /\b\d+(?:\.\d+)?\b/y],
		["flag", lang === "bash" ? /(?<=\s)-{1,2}[A-Za-z][\w-]*/y : null],
		["keyword", words.length ? new RegExp(`\\b(?:${words.join("|")})\\b`, "y") : null],
	].filter(([, re]) => re);

	let html = "";
	let i = 0;
	let plain = "";
	while (i < code.length) {
		let matched = false;
		for (const [kind, re] of rules) {
			re.lastIndex = i;
			const m = re.exec(code);
			if (m && m[0].length) {
				html += escape(plain);
				plain = "";
				html += `<span class="tok-${kind}">${escape(m[0])}</span>`;
				i += m[0].length;
				matched = true;
				break;
			}
		}
		if (!matched) plain += code[i++];
	}
	return html + escape(plain);
}

const LANGUAGE_NAMES = { graphql: "GraphQL", json: "JSON", bash: "Shell", js: "JavaScript", php: "PHP", text: "Text" };

function codeBlock(code, lang, title) {
	return `<div class="code"><div class="code-head"><span>${escape(title || LANGUAGE_NAMES[lang] || lang || "")}</span><button class="copy" type="button" aria-label="Copy code">Copy</button></div><pre><code class="lang-${escape(lang)}">${highlight(code.replace(/\n$/, ""), lang)}</code></pre></div>`;
}

/* ---------- the guide ---------- */

const FENCE = /```(\w+)?(?:[ \t]+title=([^\n]+))?\n([\s\S]*?)```/g;

function tabs(body) {
	const blocks = [...body.matchAll(FENCE)].map(([, lang = "text", title, code]) => ({ lang, title: (title || LANGUAGE_NAMES[lang] || lang).trim(), code }));
	const buttons = blocks.map((b, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}">${escape(b.title)}</button>`).join("");
	const panels = blocks
		.map((b, i) => `<div class="tab-panel" role="tabpanel" data-panel="${i}"${i ? " hidden" : ""}><pre><code class="lang-${b.lang}">${highlight(b.code.replace(/\n$/, ""), b.lang)}</code></pre></div>`)
		.join("");
	return `<div class="tabs"><div class="tab-bar"><div class="tab-list" role="tablist">${buttons}</div><button class="copy" type="button" aria-label="Copy code">Copy</button></div>${panels}</div>`;
}

function renderPage(markdown, sectionId, marked) {
	// custom blocks first, so marked leaves their HTML alone
	const placeholders = [];
	const keep = (html) => `\n\n%%BLOCK${placeholders.push(html) - 1}%%\n\n`;
	let md = markdown
		.replace(/:::tabs\n([\s\S]*?)\n:::/g, (_, body) => keep(tabs(body)))
		.replace(/:::steps\n([\s\S]*?)\n:::/g, (_, body) => keep(`<div class="steps">${marked.parse(body)}</div>`))
		.replace(/:::tip\n([\s\S]*?)\n:::/g, (_, body) => keep(`<div class="callout">${marked.parse(body)}</div>`))
		.replace(FENCE, (_, lang = "text", title, code) => keep(codeBlock(code, lang, title?.trim())));

	const headings = [];
	let html = marked.parse(md, {
		walkTokens: undefined,
	});
	// ids: the page's h1 is the section; its h2s are prefixed with it
	html = html.replace(/<h([12])>(.*?)<\/h\1>/g, (_, level, text) => {
		const id = level === "1" ? sectionId : `${sectionId}-${slug(text)}`;
		if (level === "2") headings.push({ id, text: text.replace(/<[^>]+>/g, "") });
		return level === "1"
			? `<h1 id="${id}">${text}</h1>`
			: `<h2 id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${text}</h2>`;
	});
	html = html.replace(/<p>%%BLOCK(\d+)%%<\/p>|%%BLOCK(\d+)%%/g, (_, a, b) => placeholders[a ?? b]);
	// tables scroll sideways inside a frame on small screens
	html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
	// external links open in a new tab
	html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
	return { html, headings };
}

/* ---------- the reference ---------- */

function typeLink(type) {
	const named = getNamedType(type);
	const label = escape(String(type));
	if (isScalarType(named)) return `<code class="type">${label}</code>`;
	return `<a class="type" href="#type-${named.name}"><code>${label}</code></a>`;
}

const required = (type) => (isNonNullType(type) ? '<span class="badge">required</span>' : "");

function fieldsTable(fields, withRequired) {
	if (!fields.length) return "";
	const rows = fields
		.map((f) => `<tr><td><code>${f.name}</code>${withRequired ? " " + required(f.type) : ""}</td><td>${typeLink(f.type)}</td><td>${f.description ? escape(f.description) : ""}</td></tr>`)
		.join("");
	return `<div class="table-wrap"><table class="fields"><thead><tr><th>Name</th><th>Type</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderReference(schema) {
	const operations = [];
	for (const [kind, type] of [["Mutation", schema.getMutationType()], ["Query", schema.getQueryType()]]) {
		for (const field of Object.values(type?.getFields() ?? {})) operations.push({ kind, field });
	}
	operations.sort((a, b) => a.field.name.localeCompare(b.field.name));

	const ops = operations
		.map(({ kind, field }) => `
		<article class="ref" id="op-${field.name}">
			<h3><span class="pill ${kind.toLowerCase()}">${kind === "Query" ? "Query" : "Mutation"}</span> <code>${field.name}</code></h3>
			${field.description ? `<p>${escape(field.description)}</p>` : ""}
			${field.args.length ? `<h4>Arguments</h4>${fieldsTable(field.args, true)}` : ""}
			<p class="returns">Returns ${typeLink(field.type)}</p>
		</article>`)
		.join("");

	const named = Object.values(schema.getTypeMap())
		.filter((t) => !t.name.startsWith("__") && !["Query", "Mutation"].includes(t.name) && !isScalarType(t))
		.sort((a, b) => a.name.localeCompare(b.name));

	const types = named
		.map((t) => {
			let body = "";
			let kind = "Type";
			if (isEnumType(t)) {
				kind = "Enum";
				body = `<div class="enum">${t.getValues().map((v) => `<code>${v.name}</code>`).join(" ")}</div>`;
			} else if (isInputObjectType(t)) {
				kind = "Input";
				body = fieldsTable(Object.values(t.getFields()), true);
			} else if (isObjectType(t)) {
				body = fieldsTable(Object.values(t.getFields()), false);
			}
			return `
		<article class="ref" id="type-${t.name}">
			<h3><span class="pill ${kind.toLowerCase()}">${kind}</span> <code>${t.name}</code></h3>
			${t.description ? `<p>${escape(t.description)}</p>` : ""}
			${body}
		</article>`;
		})
		.join("");

	return {
		html: `
		<section class="section" id="reference">
			<h1>API reference</h1>
			<p class="lead">Every operation and type available to your account. Click a type to jump to it.</p>
			<h2 id="reference-operations"><a class="anchor" href="#reference-operations" aria-hidden="true">#</a>Operations</h2>
			${ops}
			<h2 id="reference-types"><a class="anchor" href="#reference-types" aria-hidden="true">#</a>Types</h2>
			${types}
		</section>`,
		operations: operations.map(({ kind, field }) => ({ id: `op-${field.name}`, text: field.name, kind })),
		types: named.map((t) => ({ id: `type-${t.name}`, text: t.name })),
	};
}

/* ---------- the page ---------- */

const marked = new Marked({ gfm: true });
const pagesDir = path.join(root, "pages");
const sections = fs
	.readdirSync(pagesDir)
	.filter((f) => f.endsWith(".md"))
	.sort()
	.map((file) => {
		const markdown = fs.readFileSync(path.join(pagesDir, file), "utf8");
		const title = markdown.match(/^# (.+)$/m)[1];
		const id = slug(title);
		const { html, headings } = renderPage(markdown, id, marked);
		return { id, title, html, headings };
	});

const schema = buildSchema(fs.readFileSync(path.join(root, "schema.gql"), "utf8"));
const reference = renderReference(schema);

const nav = `
	<p class="nav-group">Guide</p>
	<ul>${sections.map((s) => `<li><a href="#${s.id}" data-nav="${s.id}">${escape(s.title)}</a></li>`).join("")}</ul>
	<p class="nav-group">API reference</p>
	<ul>
		<li><details><summary>Operations</summary><ul>${reference.operations.map((o) => `<li><a href="#${o.id}" data-nav="${o.id}"><span class="dot ${o.kind.toLowerCase()}"></span>${o.text}</a></li>`).join("")}</ul></details></li>
		<li><details><summary>Types</summary><ul>${reference.types.map((t) => `<li><a href="#${t.id}" data-nav="${t.id}">${t.text}</a></li>`).join("")}</ul></details></li>
	</ul>`;

const content = sections.map((s) => `<section class="section">${s.html}</section>`).join("\n") + reference.html;

const template = fs.readFileSync(path.join(root, "src", "template.html"), "utf8");
const page = template.replace("{{nav}}", nav).replace("{{content}}", content).replace("{{year}}", String(new Date().getFullYear()));

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), page);
for (const file of ["style.css", "app.js"]) fs.copyFileSync(path.join(root, "src", file), path.join(out, file));
for (const file of fs.readdirSync(path.join(root, "assets"))) if (!file.startsWith(".")) fs.copyFileSync(path.join(root, "assets", file), path.join(out, file));
fs.writeFileSync(path.join(out, ".nojekyll"), "");

console.log(`Built docs/index.html: ${sections.length} guide sections, ${reference.operations.length} operations, ${reference.types.length} types`);
