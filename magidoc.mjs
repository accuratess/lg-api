import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * The guide's pages: pages/<language>/NN-name.md, in file order.
 * Menu titles stay in English in both languages: Magidoc makes each page's URL from its title and can't
 * find a page with an Arabic URL, so an Arabic page shows its Arabic title as its heading instead.
 */
const titles = ["Getting started", "Authentication", "Create a shipment", "Track shipments", "Webhooks", "Codes", "Errors", "What changed"];
const arabicTitles = ["البداية", "المصادقة", "إنشاء شحنة", "متابعة الشحنات", "الإشعارات (Webhooks)", "الأكواد", "الأخطاء", "ما الجديد"];

/** Arabic reads right to left: the text between code blocks goes in an RTL block (Magidoc drops code blocks inside one) */
const rightToLeft = (markdown) =>
	markdown
		.split(/(```[\s\S]*?```)/)
		.map((part) => (part.startsWith("```") || !part.trim() ? part : `<div dir="rtl">\n\n${part.trim()}\n\n</div>`))
		.join("\n\n");

const guide = (language) => {
	const dir = path.join(__dirname, "pages", language);
	return fs
		.readdirSync(dir)
		.filter((file) => file.endsWith(".md"))
		.sort()
		.map((file, index) => {
			const content = fs.readFileSync(path.join(dir, file), "utf8");
			return {
				title: titles[index],
				content: language === "ar" ? rightToLeft(`# ${arabicTitles[index]}\n\n${content}`) : `# ${titles[index]}\n\n${content}`,
			};
		});
};

export default {
	introspection: {
		type: "sdl",
		paths: ["./schema.gql"],
	},
	website: {
		template: "carbon-multi-page",
		staticAssets: path.join(__dirname, "assets"),
		options: {
			appTitle: "Accurate API",
			appLogo: "/Accurate-logistics.png",
			siteRoot: "/lg-api",
			pages: [
				{ title: "English", content: guide("en") },
				{ title: "Arabic", content: guide("ar") },
			],
			queryGenerationFactories: {
				Time: "00:00",
				DateTime: "2025-01-01 00:00:00",
			},
		},
	},
};
