

import { ref } from 'vue';
import { clampedMap } from './Math';
import Sizes from './Sizes';

export function useParallax({
	section = document.querySelector('.parallax'),
	page = document.body,
	start = 0,
	end = 100,
	isOnTop = false
} = {}) {
	const parallaxValues = {
		section: null,
		page: null,
		top: null,
		bottom: null,
	};

	const size = new Sizes()

	const translate = ref(0);

	function getParallaxValues() {
		if (!section || !page) return;
		parallaxValues.section = section.getBoundingClientRect();
		parallaxValues.page = page.getBoundingClientRect();

		parallaxValues.top = parallaxValues.section.top - parallaxValues.page.top;
		parallaxValues.bottom = parallaxValues.top + parallaxValues.section.height;
	}

	function setTranslate(scroll) {
		if (!parallaxValues.section || !parallaxValues.page) return;
		const sectionTop = parallaxValues.top;
		const sectionBottom = parallaxValues.bottom;

		const clamp = clampedMap(
			scroll,
			isOnTop ? sectionTop : sectionTop - size.height,
			sectionBottom,
			start,
			end
		);
		translate.value = clamp.toFixed(2);
	}

	return {
		parallaxValues,
		translate,
		getParallaxValues,
		setTranslate
	};
}
