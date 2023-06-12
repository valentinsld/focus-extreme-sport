<template>
  <section
    class="page page-phrase"
  >
    <div
      ref="sport"
      class="sport"
    >
      <p
        class="intro-phrase"
      >
        <span
          v-for="word in text1"
          :key="word"
          class="word"
          v-html="word.innerText"
        />
      </p>
      <p
        class="intro-phrase"
      >
        <span
          v-for="word in text2"
          :key="word"
          class="word"
          v-html="word.innerText"
        />
      </p>
    </div>
  </section>
</template>

<script setup>
  import useStore from '@/stores/index.js'
  import SceneHome from '~~/webgl/Scenes/SceneHome';
  import { splitByWord } from '~~/webgl/Utils/splitText';
  import { MathUtils } from 'three';

  const store = useStore()

  const sport = ref()
  const delayNext = 6000

  const text1 = splitByWord('Le sport est régi par la concentration.')
  const text2 = splitByWord('Délicate et capricieuse, elle est le fruit d\'une préparation intense.')

  onMounted(()=> {
	const sceneHome = new SceneHome()

	const words = sport.value.querySelectorAll('.word')
	for (let i = 0; i < words.length; i++) {
	  const element = words[i];

	  const randomIndex = Math.round(MathUtils.randFloat(1, 17));

	  element.classList.add(`word-`+ randomIndex)
	}

	sceneHome.playDark()

	setTimeout(()=> {
		store.state.gamestate = 'intro'
	}, delayNext)
  })
</script>

<style lang="scss" scoped>
.intro-phrase {
	display: flex;
	align-items: center;
	flex-direction: row;
}

.sport {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.word {
	margin: 0 .2rem;
	font-size: 1.8rem;
	line-height: 110%;
	font-family: const(font-gotham);
}
</style>
