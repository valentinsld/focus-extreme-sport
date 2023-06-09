import eslintPlugin from 'vite-plugin-eslint';
import glsl from 'vite-plugin-glsl'
import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			title: 'Focus | A la poursuite de l\'état',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'description', name: 'description', content: 'Une expérience documentaire intéractive au coeur des sports d’actions.' },
				{ property:"og:description", content: "Une expérience documentaire intéractive au coeur des sports d’actions." },
				{ property: "og:title", content: "Focus | A la poursuite de l\'état" },
				{ property: "og:url", content: "https://focus-sports.vercel.app/" },
				{ property: "og:image", content: "/media.png" },
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon-dark.ico', media: "(prefers-color-scheme: light)" },
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon-white.ico', media: "(prefers-color-scheme: dark)" }
			]
		},
	},
	vite: {
		plugins: [
			eslintPlugin(),
			glsl(),
		],
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@import "@/assets/styles/index.scss";',
				},
			},
		},
		assetsInclude: [
			'**/*.glb',
			'**/*.gltf',
			'**/*.hdr',
			'**/*.jpeg',
			'**/*.png',
		],
		resolve: {
			alias: {
				'three/examples': path.resolve(__dirname, 'node_modules/three/examples/'),
				'three/addons': path.resolve(__dirname, 'node_modules/three/examples/jsm/'),
				three: path.resolve(__dirname, 'node_modules/three/build/three.module.js'),
			},
		},
	},
	modules: [
		'@nuxtjs/eslint-module',
		'@pinia/nuxt'
	],
	eslint: {
		/* module options */
	},
	// disable SSR for localStorage
	ssr: false,
});
