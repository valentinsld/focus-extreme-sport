import eslintPlugin from 'vite-plugin-eslint';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	vite: {
		plugins: [
			eslintPlugin()
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
	},
	modules: [
		'@nuxtjs/eslint-module'
	  ],
	  eslint: {
		/* module options */
	}
});
