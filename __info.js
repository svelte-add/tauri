import { tauriBuildScript, tauriDevScript } from "./stuff.js";

export const name = "(work in progress) Tauri";

/** @typedef {{}} Options */

/** @type {import("../..").AdderOptions<Options>} */
export const options = {};

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
