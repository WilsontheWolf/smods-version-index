const fs = require("node:fs")

let [commits, tags] = fs.readFileSync("data", "utf8").split("=======TAGS=======").map(d => d.trim().split("\n").map(l => l.split(' ')))

tags = tags
	.map(t => {
		t[1] = t[1].replace("refs/tags/", "")
		return t
	})
    .filter(([c,t]) => !t.startsWith("Nightly-"))

let versions = new Map()

commits.forEach(([c, v], i) => {
	v = v || "Unknown"
	if (!versions.has(v)) {
		versions.set(v, {
			firstIndex: v === "Unknown" ? Infinity : i,
			commits: [],
			tags: [],
			version: v,
		})
	}
	const version = versions.get(v)
	version.commits.push(c)
});

commits = new Map(commits)

tags.forEach(([c,t]) => {
	const v = commits.get(c) || "Unknown"
	const version = versions.get(v)
	if (!version) throw new Error("WTF No version")
	version.tags.push([t, c])
})

versions = Array.from(versions.values()).sort((a,b) => a.firstIndex - b.firstIndex).map(v => {
	let preferedCommit = v.commits[v.commits.length - 1]
	if (v.version === "Unknown") preferedCommit = v.commits[0]
	if (v.tags.length) preferedCommit = v.tags[0][0]
	v.best = preferedCommit
	return v
});

fs.writeFileSync("data.json", JSON.stringify(versions))
