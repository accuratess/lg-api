// Tabs, copy buttons, theme, the mobile menu, search and the current section in the sidebar

// tabs
document.querySelectorAll(".tabs").forEach((tabs) => {
	tabs.querySelectorAll("[role=tab]").forEach((button) => {
		button.addEventListener("click", () => {
			tabs.querySelectorAll("[role=tab]").forEach((b) => b.setAttribute("aria-selected", String(b === button)));
			tabs.querySelectorAll("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== button.dataset.tab));
		});
	});
});

// copy
document.querySelectorAll(".copy").forEach((button) => {
	button.addEventListener("click", async () => {
		// a code block's own code, or the tab showing
		const box = button.closest(".tabs") ? button.closest(".tabs").querySelector("[data-panel]:not([hidden])") : button.closest(".code");
		const code = box.querySelector("code").innerText;
		try {
			await navigator.clipboard.writeText(code);
			button.textContent = "Copied";
			button.classList.add("done");
			setTimeout(() => {
				button.textContent = "Copy";
				button.classList.remove("done");
			}, 1500);
		} catch (e) {}
	});
});

// theme: follows the system until chosen here
const root = document.documentElement;
document.querySelector(".theme-toggle").addEventListener("click", () => {
	const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
	root.dataset.theme = dark ? "light" : "dark";
	try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

// mobile menu
const sidebar = document.querySelector(".sidebar");
const scrim = document.querySelector(".scrim");
const toggle = document.querySelector(".menu-toggle");
const setMenu = (open) => {
	sidebar.classList.toggle("open", open);
	scrim.hidden = !open;
	toggle.setAttribute("aria-expanded", String(open));
};
toggle.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
scrim.addEventListener("click", () => setMenu(false));
sidebar.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// a link to an operation or type opens its group in the sidebar
const openInSidebar = (id) => {
	const link = sidebar.querySelector(`[data-nav="${CSS.escape(id)}"]`);
	link?.closest("details")?.setAttribute("open", "");
};

// search: filters the sidebar
const search = document.querySelector(".search");
search.addEventListener("input", () => {
	const term = search.value.trim().toLowerCase();
	sidebar.querySelectorAll("li").forEach((li) => {
		if (li.querySelector("details")) return;
		li.classList.toggle("hidden", !!term && !li.textContent.toLowerCase().includes(term));
	});
	sidebar.querySelectorAll("details").forEach((d) => {
		const any = [...d.querySelectorAll("li")].some((li) => !li.classList.contains("hidden"));
		d.parentElement.classList.toggle("hidden", !!term && !any);
		if (term && any) d.setAttribute("open", "");
	});
});

// the section on screen, highlighted in the sidebar
const links = [...sidebar.querySelectorAll("[data-nav]")];
const targets = links.map((a) => document.getElementById(a.dataset.nav)).filter(Boolean);
let current = null;
const observer = new IntersectionObserver(
	(entries) => {
		const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
		if (!visible || visible.target.id === current) return;
		current = visible.target.id;
		links.forEach((a) => a.classList.toggle("active", a.dataset.nav === current));
	},
	{ rootMargin: "-70px 0px -70% 0px" }
);
targets.forEach((t) => observer.observe(t));

if (location.hash) openInSidebar(decodeURIComponent(location.hash.slice(1)));
window.addEventListener("hashchange", () => openInSidebar(decodeURIComponent(location.hash.slice(1))));
