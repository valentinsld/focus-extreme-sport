import { onBeforeUnmount, onMounted, shallowRef } from 'vue';

export function useIntersectObserver({
	ref,
	margin = '0px',
	threshold = 0,
	replay = false
} = {}) {
	ref = ref ?? shallowRef();

	let intersectObserver, children;

	onMounted(() => {
		const options = {
			root: null,
			rootMargin: margin,
			threshold: threshold,
		};

		intersectObserver = new IntersectionObserver(checkEntries, options);

		for (let i = 0; i < ref.length; i++) {
			const element = ref[ i ];
			children = element.value?.$el.querySelectorAll('[data-in-view]');
			if (!children) return;

			for (let j = 0; j < children.length; j++) {
				const element = children[ j ];
				intersectObserver.observe(element);
			}
		}
	});

	onBeforeUnmount(() => {
		for (let i = 0; i < ref.length; i++) {
			const element = ref[ i ];
			children = element.value?.$el.querySelectorAll('[data-in-view]');
			if (!children) return;

			for (let j = 0; j < children.length; j++) {
				const element = children[ j ];
				intersectObserver.unobserve(element);
			}
		}
	});

	function checkEntries(entries) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-observed');
				if (!replay) intersectObserver.unobserve(entry.target);
			} else {
				if (replay) entry.target.classList.remove('is-observed');
				return;
			}
		});
	}
}
