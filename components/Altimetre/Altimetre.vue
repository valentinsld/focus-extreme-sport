<template>
  <div class="altimetre">
    <!-- <h2>
      Altimètre : {{ store.state.altimetre.altitude }}
    </h2> -->
    <div class="score">
      <svg
        viewBox="0 0 61 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M54.06 23.725c-1.737-4.26-4.886-5.702-6.442-6.765-1.555-1.062-3.997-4.089-4.522-4.945-1.567-2.555-3.88-4.566-6.584-5.862C30.304 3.181 21.593 0 21.593 0l.305 12.906a13.459 13.459 0 0 1-5.989 11.517L0 35.028l10.728 5.721a21.249 21.249 0 0 1 8.749 8.748l5.563 10.43 10.605-15.909a13.459 13.459 0 0 1 11.517-5.989l12.906.305s-3.078-8.425-6.006-14.61h-.003Z"
          fill="#fff"
        />
      </svg>
      <div
        ref="wingsuit"
        class="bar-container wingsuit-bar"
      />
    </div>
    <div class="score">
      <svg
        viewBox="0 0 49 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.193 8.215a4.402 4.402 0 1 1 7.625-4.402L48.525 50.07l-7.624 4.403-26.708-46.26ZM2.201 8.215a4.402 4.402 0 0 1 7.625-4.402L36.533 50.07l-7.624 4.403L2.2 8.214Z"
          fill="#fff"
        />
      </svg>
      <div
        ref="ski"
        class="bar-container ski-bar"
      />
    </div>
    <div class="score">
      <svg
        viewBox="0 0 51 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="m30.698 34.292 15.197 16.713 2.127-1.935-15.254-16.775A70.178 70.178 0 0 0 50.786 1.048 74.463 74.463 0 0 0 20.17 18.439L3.4 0 1.274 1.935 18.112 20.45C9.799 28.901 3.499 39.336 0 51.008l3.73-1.153a70.164 70.164 0 0 0 26.968-15.563Zm-.29-4.592a6.26 6.26 0 0 0-8.298-9.125L30.41 29.7Zm-10.312-7.067 8.073 8.879a6.26 6.26 0 0 1-8.073-8.878Z"
          fill="#fff"
        />
      </svg>
      <div
        ref="kayak"
        class="bar-container kayak-bar"
      />
    </div>
    =======
    >>>>>>> ac43cbf (feat(altimetre): remove scores for test)
  </div>
</template>

<script setup>
// call store
import useStore from '@/stores/index.js'
const store = useStore()

const wingsuit = ref()
const ski = ref()
const kayak = ref()

watch(() => store.state.altimetre.scores.wingsuit, (value) => {
  wingsuit.value.style.setProperty('--wing-translate', value + '%')
	}, { immediate: false });

watch(() => store.state.altimetre.scores.ski, (value) => {
  ski.value.style.setProperty('--ski-translate', value + '%')
	}, { immediate: false });

  watch(() => store.state.altimetre.scores.kayak, (value) => {
  kayak.value.style.setProperty('--kayak-translate', value + '%')
	}, { immediate: false });
</script>

<style lang="scss">
.altimetre {
  position: absolute;
  left: 20px;
  bottom: 20px;
}

.score {
  display: flex;
  align-items: center;
  margin: 1em 0;

  svg {
    width: 20px;
    margin-right: 15px;
  }
}

.bar-container {
  --wing-translate: 0%;
  --ski-translate: 0%;
  --kayak-translate: 0%;

  position: relative;
  overflow: hidden;
  width: 100px;
  height: 8px;
  border-radius: 0px 20px 20px 0px;
  background-color: rgba(colors(f_green), .4);

  &::after {
    border-radius: 0px 20px 20px 0px;
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    background-color: colors(f_green);
    transform-origin: left center;
    transition: transform .3s ease(out-swift);
  }
}

.wingsuit-bar {
  &::after {
    transform: translateX(calc(-100% + var(--wing-translate)));
  }
}

.ski-bar {
  &::after {
    transform: translateX(calc(-100% + var(--ski-translate)));
  }
}

.kayak-bar {
  &::after {
    transform: translateX(calc(-100% + var(--kayak-translate)));
  }
}
</style>
