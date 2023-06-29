<template>
  <section class="thanks flow-section">
    <div
      class="parallax-container"
      :style="`transform:
					translateY(${cloudTranslate}%)
				`"
    >
      <img
        src="/cloud.png"
        draggable="false"
        class="cloud"
      >
      <div
        class="sticker"
        data-in-view
      >
        <img
          src="/STICKERS_HOLO.png"
          draggable="false"
        >
      </div>
    </div>
    <h2
      class="thanks-title"
      data-in-view
    >
      <span
        v-for="(word, index) in title"
        :key="word"
        class="title-word"
        :class="[
          'title-word-' + index,
        ]"
        v-html="word.innerText"
      />
    </h2>

    <div
      class="thanks-wrapper"
      data-in-view
    >
      <div
        v-for="(el, index) in data.list"
        :key="'tank'+index"
        class="thanks-list"
        :class="[
          'thanks-' + index
        ]"
      >
        <div
          class="thanks-picture"
          :class="['pic-' + index]"
        >
          <img
            class="thanks-pic"
            :src="el.image"
            draggable="false"
            rel="preload"
            fetchpriority="high"
          >
        </div>
        <h3
          class="thanks-name"
          :class="['name-' + index]"
        >
          {{ el.name }}
        </h3>

        <div class="thanks-socials">
          <a
            v-for="(l, i) in el.socials"
            :key="index+'socials'+i"
            :href="l.link"
            target="_blank"
            class="thanks-link"
            :class="['link-' + i]"
          >
            <span class="icon-wrapper">
              <svg
                v-if="l.type === 'tiktok'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 21.45 24.54"
                class="thanks-link-icon"
              >
                <path d="M21.4 5.98c0-.11 0-.11-.12-.11-.28 0-.55-.03-.83-.07-1-.15-4.23-1.85-4.78-4.62-.01-.05-.13-.74-.13-1.04 0-.13 0-.13-.13-.13h-.09C14.06 0 12.79 0 11.53 0c-.25 0-.22-.03-.22.22v16.46c0 .2 0 .41-.04.61-.19 1.06-.73 1.89-1.65 2.46-.8.49-1.66.63-2.58.45-.29-.06-.56-.17-.83-.27l-.07-.06c-.09-.08-.19-.14-.29-.21-1.17-.81-1.73-1.94-1.56-3.34.17-1.43.99-2.4 2.35-2.9.4-.15.83-.21 1.26-.19.28.01.55.05.82.13.09.03.14 0 .15-.11v-.1c0-.98-.04-3.14-.04-3.14v-.85c0-.08-.04-.1-.11-.1-.51-.06-1.02-.07-1.53-.03-.71.05-1.4.2-2.06.44-1.07.38-2 .98-2.81 1.77a7.713 7.713 0 0 0-2.3 5.01c-.03.4-.02.8.02 1.21.05.56.16 1.1.33 1.63.49 1.53 1.37 2.78 2.63 3.78.13.1.25.21.4.28l.19.17c.2.15.42.28.65.4 1.41.69 2.89.98 4.45.79 2.03-.25 3.71-1.15 5.04-2.69 1.25-1.46 1.86-3.16 1.87-5.07.02-2.73 0-5.46 0-8.2 0-.07-.04-.16.03-.19.06-.03.11.05.17.08a9.98 9.98 0 0 0 3.3 1.42c.69.16 1.39.25 2.1.25.22 0 .25-.01.25-.23 0-.97-.05-3.62-.05-3.88Z" />
              </svg>
              <svg
                v-if="l.type === 'facebook'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 11.49 24.9"
                class="thanks-link-icon"
              >
                <path d="M2.61 24.9h5.01V12.35h3.5l.37-4.2H7.62V5.76c0-.99.2-1.38 1.16-1.38h2.71V0H8.02C4.29 0 2.61 1.64 2.61 4.79v3.35H0v4.26h2.61v12.5Z" />
              </svg>
              <svg
                v-if="l.type === 'vimeo'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 23.36 20.22"
                class="thanks-link-icon"
              >
                <path d="M19.96 0c-3.24-.1-5.43 1.72-6.58 5.49.59-.25 1.17-.38 1.73-.38 1.19 0 1.71.67 1.57 2-.07.81-.59 1.98-1.57 3.53-.98 1.55-1.71 2.32-2.2 2.32-.63 0-1.21-1.19-1.73-3.57-.18-.7-.49-2.49-.94-5.36C9.81 1.37 8.69.12 6.87.3c-.77.07-1.92.77-3.46 2.1C2.29 3.41 1.15 4.43 0 5.44l1.1 1.42c1.05-.73 1.66-1.1 1.83-1.1.8 0 1.55 1.26 2.25 3.77l1.89 6.92c.94 2.52 2.09 3.77 3.46 3.77 2.2 0 4.89-2.06 8.06-6.2 3.07-3.95 4.66-7.07 4.76-9.35.14-3.04-.99-4.59-3.39-4.67Z" />
              </svg>
              <svg
                v-if="l.type === 'youtube'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 25.76 18.15"
                class="thanks-link-icon"
              >
                <path d="M25.23 2.83A3.236 3.236 0 0 0 22.95.54C20.94 0 12.88 0 12.88 0S4.82 0 2.81.54A3.24 3.24 0 0 0 .54 2.83C0 4.85 0 9.07 0 9.07s0 4.22.54 6.24c.3 1.12 1.17 1.99 2.28 2.29 2.01.54 10.07.54 10.07.54s8.06 0 10.07-.54c1.11-.3 1.98-1.18 2.28-2.29.54-2.02.54-6.24.54-6.24s0-4.22-.54-6.24ZM10.25 12.91V5.25l6.73 3.83-6.73 3.83Z" />
              </svg>
              <svg
                v-if="l.type === 'instagram'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20.17 20.17"
                class="thanks-link-icon"
              >
                <path d="M10.09 1.82c2.69 0 3.01.01 4.08.06.98.04 1.52.21 1.87.35.47.18.81.4 1.16.75.35.35.57.69.75 1.16.14.36.3.89.35 1.87.05 1.06.06 1.38.06 4.08s-.01 3.01-.06 4.08c-.05.98-.21 1.52-.35 1.87-.18.47-.4.81-.75 1.16s-.69.57-1.16.75c-.36.14-.89.3-1.87.35-1.06.05-1.38.06-4.08.06s-3.01-.01-4.08-.06c-.98-.04-1.52-.21-1.87-.35-.47-.18-.81-.4-1.16-.75-.35-.35-.57-.69-.75-1.16-.14-.36-.3-.89-.35-1.87-.05-1.06-.06-1.38-.06-4.08s.01-3.01.06-4.08c.05-.98.21-1.52.35-1.87.18-.47.4-.81.75-1.16.35-.35.69-.57 1.16-.75.36-.14.89-.3 1.87-.35 1.06-.05 1.38-.06 4.08-.06m0-1.82C7.35 0 7.01.01 5.93.06 4.86.11 4.12.28 3.48.53c-.66.26-1.23.6-1.79 1.16-.56.56-.91 1.12-1.16 1.79-.25.64-.42 1.37-.47 2.45C.01 7.01 0 7.35 0 10.09s.01 3.08.06 4.16c.05 1.07.22 1.81.47 2.45.26.66.6 1.23 1.16 1.79s1.12.91 1.79 1.16c.64.25 1.37.42 2.45.47 1.08.05 1.42.06 4.16.06s3.08-.01 4.16-.06c1.07-.05 1.81-.22 2.45-.47.66-.26 1.23-.6 1.79-1.16.56-.56.91-1.12 1.16-1.79.25-.64.42-1.37.47-2.45.05-1.08.06-1.42.06-4.16s-.01-3.08-.06-4.16c-.05-1.07-.22-1.81-.47-2.45-.26-.66-.6-1.23-1.16-1.79-.56-.56-1.12-.91-1.79-1.16-.64-.25-1.37-.42-2.45-.47C13.17.01 12.83 0 10.09 0" /><path d="M10.09 4.91a5.181 5.181 0 0 0 0 10.36 5.181 5.181 0 0 0 0-10.36m0 8.54c-1.86 0-3.36-1.51-3.36-3.36s1.51-3.36 3.36-3.36 3.36 1.51 3.36 3.36-1.51 3.36-3.36 3.36M16.68 4.7c0 .67-.54 1.21-1.21 1.21s-1.21-.54-1.21-1.21.54-1.21 1.21-1.21 1.21.54 1.21 1.21" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
 import { splitByWord } from '~~/webgl/Utils/splitText';

  const props = defineProps({
	  data: {
		  type: Object,
		  required: true
	  },
    cloudTranslate: {
			type: [ Number, String ],
			default: 0
		},
  })

  const title = splitByWord(props.data.title)
  </script>

<style lang="scss" scoped>
.parallax-container {
  position: absolute;
  bottom: 0%;
  left: -75%;
  z-index: -1;
}

.cloud {
  opacity: .5;
}

.sticker {
  position: absolute;
  z-index: -2;
  right: 0%;
  bottom: 45%;
  transform: rotate(20deg) scale(.25);
  opacity: 0;
  transition: transform .5s ease(out-bounce), opacity .5s ease(out-swift);

  img {
    width: 15rem;
    filter: drop-shadow(0px 0px 5px rgba(colors(black), .25));
    animation: RollingSticker 20s linear forwards infinite;

  }

  &.is-observed {
    transform: none;
    opacity: 1;

  }
}


.thanks-title {
  font-family: const(font-tusker);
  font-weight: 400;
  color: colors(black);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-size: 5rem;
  margin-bottom: 3rem;

  &.is-observed {
    @for $i from 0 through 20 {
      .title-word-#{$i} {
        transition-delay: calc(100ms + (#{$i} * 25ms));
        transform: none;
        opacity: 1;
      }
    }
  }
}

.title-word {
  margin: 0 .6rem;
  display: inline-block;
  transform: translateY(2rem);
  opacity: 0;
  transition: transform .5s ease(out-swift), opacity .5s ease(out-swift);
}

.thanks-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-flow: row wrap;

  &.is-observed {
    @for $i from 0 through 20 {
      .pic-#{$i} {
        transition-delay: calc(100ms + (#{$i} * 75ms));
        transform: none;
        opacity: 1;
      }
    }

    @for $i from 0 through 20 {
      .name-#{$i} {
        transition-delay: calc(300ms + (#{$i} * 75ms));
        transform: none;
        opacity: 1;
      }
    }

    @for $i from 0 through 20 {
      .link-#{$i} {
        .icon-wrapper {

          transition-delay: calc(500ms + (#{$i} * 75ms));
          transform: none;
          opacity: 1;
        }
      }
    }
  }
}

.thanks-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem;
}

.thanks-picture {

  transform: scale(0.25);
  opacity: 0;
  transition: transform .8s ease(out-bounce), opacity .7s ease(out-swift);

  .is-observed & {
    transform: none;
    opacity: 1;
  }

  &:hover {
    .thanks-pic {
      filter: grayscale(0%);
      transform: scale(1.15);
    }
  }
}

.thanks-pic {
  width: 10rem;
  filter: grayscale(100%);
  transition: transform .5s ease(out-swift), filter .5s ease(out-swift);
  transition-delay: 0;
}

.thanks-name {
  font-family: const(font-akira);
  font-weight: 900;
  font-size: 1.4rem;
  color: colors(black);
  text-transform: uppercase;
  margin-top: 1rem;
  transform: translateY(-2rem);
  opacity: 0;
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);
}

.thanks-socials {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto 0;
}

.thanks-link {
  transition: transform .5s ease(out-swift);

  &:hover {
    transform: scale(1.2);

    .thanks-link-icon {
      fill: colors(f_pink);
    }
  }
}

.icon-wrapper {
  transition: transform .8s ease(out-bounce), opacity .7s ease(out-swift);
  transform: scale(0.25);
  opacity: 0;

}

.thanks-link-icon {
  height: 2rem;
  margin: 0 1rem;
  transition: fill .3s ease(out-swift);

}
</style>
