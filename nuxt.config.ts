// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	vite: {
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
});
