import { tauriBuildScript, tauriDevScript } from "./stuff.js";

/** @type {import("../..").AdderRun<import("./__info.js").Options>} */
export const run = async ({ folderInfo, install, runCommand, updateJson }) => {
	const appName = "My Tauri App";
	const windowTitle = "Tauri App Window";
	const port = 3000;

	let distDir = "../dist";
	// TODO: extract build directory from vite config
	if (folderInfo.kit) {
		// TODO: set adapter to static
		// TODO: setdefault ssr to false
		// TODO: setdefault prerender to false?
		// TODO: setdefault fallback to index.html?

		// TODO: extract build directory from options
		distDir = "../build";

		await install({ package: "@sveltejs/adapter-static" });
	}

	await runCommand({
		command: ["cargo", "tauri", "init", "--app-name", appName, "--dist-dir", distDir, "--dev-path", `http://localhost:${port}`, "--window-title", windowTitle],
		async interact() {},
	});

	await updateJson({
		path: "/package.json",
		async json({ obj }) {
			const devScript = "dev";
			const buildScript = "build";

			let applicationFrameworkDevScript = "vite:dev";
			let applicationFrameworkBuildScript = "vite:build";

			const scripts = obj.scripts;

			scripts[applicationFrameworkDevScript] = scripts[devScript];
			scripts[applicationFrameworkBuildScript] = scripts[buildScript];

			scripts[tauriDevScript] = "cargo tauri dev";
			scripts[tauriBuildScript] = "cargo tauri build";

			scripts[devScript] = `run-p ${applicationFrameworkDevScript} ${tauriDevScript}`;
			scripts[buildScript] = `run-s ${applicationFrameworkBuildScript} ${tauriBuildScript}`;

			return { obj };
		},
	});

	await install({ package: "npm-run-all" });

	await install({ package: "@tauri-apps/api" });
};
