import { tauriBuildScript, tauriDevScript } from "./stuff.js";

export const name = "(work in progress) Tauri";

export const emoji = "💫";

export const usageMarkdown = ["You can [configure Tauri](https://tauri.studio/en/docs/api/config/) in the `src-tauri/tauri.conf.json` file.", 'You can import from [the `"@tauri-apps/api"` package](https://tauri.studio/en/docs/api/js/index) to access the backend.'];

/** @type {import("../..").Gatekeep} */
export const gatekeep = async ({ runCommand }) => {
	try {
		await runCommand({
			cwd: "",
			command: ["cargo", "--version"],
			async interact() {},
		});
	} catch (e) {
		return {
			advice: "you need to install cargo first https://tauri.studio/docs/get-started/intro#setting-up-your-environment, then install tauri as a cargo subcommand https://tauri.studio/docs/development/integration#alternatively-install-tauri-cli-as-a-cargo-subcommand",
		};
	}

	try {
		await runCommand({
			cwd: "",
			command: ["cargo", "tauri", "--version"],
			async interact() {},
		});
	} catch (e) {
		return {
			advice: "you need to install tauri as a cargo subcommand first https://tauri.studio/docs/development/integration#alternatively-install-tauri-cli-as-a-cargo-subcommand",
		};
	}

	return { able: true };
};

/** @type {import("../..").Heuristic[]} */
export const heuristics = [
	{
		description: "There are Tauri dev and build scripts in `package.json`",
		async detector({ readFile }) {
			const { text } = await readFile({ path: "/package.json" });
			if (!text.includes(tauriDevScript)) return false;
			if (!text.includes(tauriBuildScript)) return false;

			return true;
		},
	},
	{
		description: "`src-tauri/tauri.conf.json` exists",
		async detector({ readFile }) {
			const tauriConf = await readFile({ path: "/src-tauri/tauri.conf.json" });

			return tauriConf.exists;
		},
	},
	{
		description: "When using SvelteKit, the static adapter is set up",
		async detector({ readFile }) {
			const js = await readFile({ path: "/svelte.config.js" });

			if (!js.exists) return false;

			if (js.text.includes("@sveltejs/kit")) {
				if (!js.text.includes("@sveltejs/adapter-static")) return false;
			}

			return true;
		},
	},
];

/** @typedef {{}} Options */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {};
