import {resolve, join} from "path";
import {
	defaultOutputConfig,
	defaultPlugins,
	defaultProdPlugins,
	defaultServePlugins,
	isProd,
	isServe
} from "@appnest/web-config";

const folders = {
	src: resolve(__dirname, "src/demo"),
	dist: resolve(__dirname, "dist"),
	src_assets: resolve(__dirname, "src/demo/assets"),
	dist_assets: resolve(__dirname, "dist/assets")
};

const files = {
	main: join(folders.src, "main.ts"),
	src_index: join(folders.src, "index.html"),
	src_robots: join(folders.src, "robots.txt"),
	dist_index: join(folders.dist, "index.html"),
	dist_robots: join(folders.dist, "robots.txt")
};

export default {
	input: {
		main: files.main
	},
	output: [
		defaultOutputConfig({
			dir: folders.dist,
			format: "esm"
		})
	],
	plugins: [
		...defaultPlugins({
			cleanConfig: {
				targets: [
					folders.dist
				]
			},
			copyConfig: {
				resources: [
					[files.src_robots, files.dist_robots],
					[folders.src_assets, folders.dist_assets]
				]
			},
			htmlTemplateConfig: {
				polyfillConfig: {
					features: ["es", "template", "shadow-dom", "custom-elements"]
				},
				template: files.src_index,
				target: files.dist_index,
				include: /main(-.*)?\.js$/
			},
			importStylesConfig: {
				globals: ["main.scss"]
			}
		}),

		// Serve
		...(isServe ? defaultServePlugins({
			dist: folders.dist
		}) : []),

		// Production
		...(isProd ? defaultProdPlugins({
			dist: folders.dist,
			budgetConfig: {
				sizes: {
					".js": 1024 * 170,
					".jpg": 1024 * 400
				}
			}
		}) : [])
	],
	treeshake: isProd,
	context: "window"
}