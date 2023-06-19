<template>
  <aside
    ref="base"
    class="countdown"
  >
    <div
      ref="three"
      class="item-showed"
    >
      <p>3</p>
    </div>
    <div
      ref="two"
      class="item-showed"
    >
      <p>2</p>
    </div>
    <div
      ref="one"
      class="item-showed"
    >
      <p>1</p>
    </div>
    <div
      ref="go"
      class="item-showed"
    >
      <p>
        <span
          v-for="word in letgo"
          :key="word"
          class="word"
          v-html="word.innerText"
        />
      </p>
    </div>
  </aside>
</template>

<script setup>
	import anime from 'animejs';
	import { splitByWord } from '~~/webgl/Utils/splitText';
	import destroyTimeline from '~~/webgl/Utils/destroyTimeline';
	import useStore from '@/stores/index.js'

	const store = useStore()

	const base = ref()
	const three = ref()
	const two = ref()
	const one = ref()
	const go = ref()
	const letgo = ref()

	const easing =  'cubicBezier(0.25, 1, 0.5, 1);'

	let tl, words;

	// console.log(letgo);

	watch(() => store.state.isCountdownPlaying, (value) => {
		if(value) {
			show()
		}
	}, { immediate: false });
	onMounted(()=> {
		base.value.style.display = 'none';
		letgo.value = splitByWord("Et c\'est parti");


		setTimeout(()=> {
			words = base.value.querySelectorAll('.word')
		}, 10)
	});


	function show() {
		if(base.value) base.value.style.display = '';
		if (tl) destroyTimeline(tl);

		tl = anime.timeline({ autoplay: true });
		tl.add({
			targets: three.value,
			scale: {
				value: [ 2, 1 ],
				duration: 500,
				easing: easing,
			},
			rotate: {
				value: [ '20deg', '0deg' ],
				duration: 500,
				easing: easing,
			},
			opacity: {
				value: [ 0, 1 ],
				duration: 500,
				easing: easing,
			}
		})
		tl.add({
			targets: three.value,
			opacity: {
				value: [ 1, 0 ],
				duration: 500,
				easing: easing,
			}
		}, '-=200')
		tl.add({
			targets: two.value,
			scale: {
				value: [ 2, 1 ],
				duration: 500,
				easing: easing,
			},
			rotate: {
				value: [ '-20deg', '0deg' ],
				duration: 500,
				easing: easing,
			},
			opacity: {
				value: [ 0, 1 ],
				duration: 500,
				easing: easing,
			}
		})
		tl.add({
			targets: two.value,
			opacity: {
				value: [ 1, 0 ],
				duration: 500,
				easing: easing,
			}
		}, '-=200')
		tl.add({
			targets: one.value,
			scale: {
				value: [ 2, 1 ],
				duration: 500,
				easing: easing,
			},
			rotate: {
				value: [ '20deg', '0deg' ],
				duration: 500,
				easing: easing,
			},
			opacity: {
				value: [ 0, 1 ],
				duration: 500,
				easing: easing,
			}
		})
		tl.add({
			targets: one.value,
			opacity: {
				value: [ 1, 0 ],
				duration: 500,
				easing: easing,
			}
		}, '-=200')

		tl.add({
			targets: words[0],
			scale: {
				value: [ 2, 1 ],
				duration: 200,
				easing: easing,
			},
			rotate: {
				value: [ '-20deg', '0deg' ],
				duration: 200,
				easing: easing,
			},
			opacity: {
				value: [ 0, 1 ],
				duration: 200,
				easing: easing,
			}
		}, '+=500')
		tl.add({
			targets: words[0],
			opacity: {
				value: [ 1, 0 ],
				duration: 50,
				easing: easing,
			}
		}, '-=50')
		tl.add({
			targets: words[1],
			scale: {
				value: [ 2, 1 ],
				duration: 200,
				easing: easing,
			},
			rotate: {
				value: [ '20deg', '0deg' ],
				duration: 200,
				easing: easing,
			},
			opacity: {
				value: [ 0, 1 ],
				duration: 200,
				easing: easing,
			}
		}, '-= 50')
		tl.add({
			targets: words[1],
			opacity: {
				value: [ 1, 0 ],
				duration: 50,
				easing: easing,
			}
		}, '-=50')
		tl.add({
			targets: words[2],
			scale: {
				value: [ 2, 1 ],
				duration: 200,
				easing: easing,
			},
			rotate: {
				value: [ '-20deg', '0deg' ],
				duration: 200,
				easing: easing,
			},
			opacity: {
				value: [ 0, 1 ],
				duration: 200,
				easing: easing,
			}
		}, '-= 50')
		tl.add({
			targets: words[2],
			opacity: {
				value: [ 1, 0 ],
				duration: 1000,
				easing: easing,
			}
		}, '-=50');

		tl.finished
			.then(() => {
				if (base.value) base.value.style.display = 'none';
				clear();
			});
	}

	function clear() {
		if (tl) destroyTimeline(tl);
	}
</script>

<style lang="scss" scoped>
.countdown {
	position: absolute;
	z-index: 3;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.item-showed {
	position: absolute;

	p {
		font-family: const(font-akira);
		font-weight: 900;
		text-transform: uppercase;
		color: colors(white);
		font-size: 7rem;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.word {
	position: absolute;
	display: block;
}
</style>
