const fs = require("node:fs")

const template = fs.readFileSync("public/index.html", "utf8")
const data = JSON.parse(fs.readFileSync("data.json", "utf8"))

const baseURL = "https://github.com/Steamodded/smods/"

const html = data.map(d => {
	return `
<div id="${d.version}">
	<h3><a href="${baseURL}tree/${d.best}">${d.version}</a> <a href="${baseURL}${d.tags.length ? `archive/refs/tags/${d.best}.zip` : `archive/${d.best}.zip`}">Download</a> ${d.tags.length ? `<a href="${baseURL}releases/tag/${d.best}">Release (${d.best})</a>` : ""}</h3>
	<details>
		<summary>
			More Info
		</summary>
		<h4>Commits with this version number:</h4>
		<ul>
			${d.commits.map(c => `<li><a href="${baseURL}commit/${c}">${c}</a></li>`).join("\n")}
		</ul>
		${d.tags.length ? `
		<h4>Tags with this version number:</h4>
		<ul>
			${d.tags.map(t => `<li><a href="${baseURL}tree/${t[0]}">${t[0]}</a></li>`).join("\n")}
		</ul>` : ""}
	</details>
</div>`
}).join("\n");

const embeddedData = JSON.stringify(data.map(d => ({version: d.version, tags: d.tags.map(t => t[0])})))

const out = template.replace("%html%", html).replace("%data%", embeddedData);

fs.writeFileSync("data.html", out);
