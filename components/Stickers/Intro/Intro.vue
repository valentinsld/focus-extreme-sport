<template>
  <div clas="stickers-intro">
    <div class="stickers-intro__image">
      <img src="/end-photos/wingsuit.png">
    </div>
    <div class="stickers-intro__image">
      <img src="/end-photos/ski.png">
    </div>
    <div class="stickers-intro__image">
      <img src="/end-photos/kayak.png">
    </div>

    <button
      class="stickers-intro__button btn-underline"
      @click="close"
    >
      <span>
        Suivant
      </span>
    </button>
  </div>
</template>

<script setup>
import AudioManager from '~~/webgl/Managers/AudioManager'

const emit = defineEmits(['close'])

function close() {
	emit('close')
}

onMounted(() => {
  playSounds()
})

function playSounds() {
  const AUDIO = new AudioManager()

  setTimeout(() => {
    AUDIO.play('camera-click-1')
  }, 750);
  setTimeout(() => {
    AUDIO.play('camera-click-2')
  }, 1250);
  setTimeout(() => {
    AUDIO.play('camera-click-3')
  }, 1450);
}
</script>

<style lang="scss" scoped>
$button-bottom: 40px;
$button-right: 70px;

$top: 4vh;
$left: 20vh;

.stickers-intro {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &__image {
    position: absolute;
    z-index: 1;
    top: calc(50% + $top);
    left: 50%;

    transform: translate3d(-50%, -50%, 0);

    &:nth-child(1) {
      --delay-image: 0.75s;

      left: calc(50% - $left);

      transform: translate3d(-50%, -50%, 0) rotate(-14deg);
    }

    &:nth-child(2) {
      --delay-image: 1s;

      left: calc(50% + $left);

      transform: translate3d(-50%, -50%, 0) rotate(-11deg);
    }

    &:nth-child(3) {
      --delay-image: 1.25s;

      top: calc(50% - $top);

      transform: translate3d(-50%, -50%, 0) rotate(-3deg);
    }

    img {
      max-width: 50vh;
      max-height: 50vh;

      opacity: 0;
      transform: scale(2);
      filter: blur(4px);

      animation: photoAppear 0.75s ease(ease_generic) var(--delay-image) forwards;

      @keyframes photoAppear {
        from {
          opacity: 0;
          transform: scale(2);
          filter: blur(4px);
        }

        to {
          opacity: 1;
          transform: scale(1);
          filter: blur(0px);
        }
      }
    }
  }

  &__button {
    position: absolute;
    bottom: $button-bottom;
    right: $button-right;

    animation: buttonAppear 1.5s ease(in-out-smooth) 2s forwards;

    @keyframes buttonAppear {
      to {
        opacity: 1;
      }
    }
  }
}
</style>
