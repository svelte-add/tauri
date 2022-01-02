import { tauriBuildScript, tauriDevScript } from "./stuff.js";

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
];
