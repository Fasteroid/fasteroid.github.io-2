/**
 * Function that mutates the original webpack config.
 * Supports asynchronous changes when a promise is returned (or it's an async function).
 * You can find more info here: https://github.com/preactjs/preact-cli#webpack
 *
 * @param {import('preact-cli').Config} config - original webpack config
 * @param {import('preact-cli').Env} env - current environment and options pass to the CLI
 * @param {import('preact-cli').Helpers} helpers - object with useful helpers for working with the webpack config
 */
const path = require('path');

import manifest from "./src/manifest.json";
export default (config, env, helpers) => {
	config.output.publicPath = manifest.start_url;
	config.devServer = {
		static: {
			directory: path.join(__dirname, manifest.start_url)
		},
		devMiddleware: {
			writeToDisk: true,
			publicPath: manifest.start_url.slice(0,-1),
		}
	}
};
