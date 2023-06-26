<template>
  <section class="athletes flow-section">
    <h2
      class="athletes-title"
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

    <div class="athletes-list">
      <div
        v-for="(el, index) in data.list"
        :key="'athletes'+index"
        :class="`is-${el.color}`"
        class="athletes-card"
      >
        <div class="card-background" />
        <p class="athletes-sport">
          <span>
            {{ el.aptitude }}
          </span>
        </p>
        <div class="athletes-pic-wrapper">
          <img
            :src="el.image"
            class="athletes-picture"
          >
          <p class="athletes-type">
            <span>
              {{ el.type }}
            </span>
          </p>
        </div>
        <div class="athletes-name-wrapper">
          <h3 class="athletes-name">
            {{ el.name }}
          </h3>
          <div class="athletes-country">
            <svg
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="country-star"
            >
              <path
                d="M15.727 30.462A23.518 23.518 0 0 0 .91 15.645 23.518 23.518 0 0 0 15.727.828a23.518 23.518 0 0 0 14.817 14.817 23.518 23.518 0 0 0-14.817 14.817Z"
              />
            </svg>
            <p class="athletes-code">
              {{ el.country }}
            </p>
          </div>
        </div>


        <div class="athletes-info">
          <div class="athletes-achivement">
            <svg
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="achivement-icon"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.042 15.566.246 20.682l1.484-.107a3.601 3.601 0 0 1 3.763 2.762l.355 1.502 4.461-6.012a9.978 9.978 0 0 1-6.267-3.261Zm8.926 3.222 4.49 6.05.355-1.5c.407-1.72 2-2.89 3.763-2.763l1.484.107-3.944-5.315a9.985 9.985 0 0 1-6.148 3.42Z"
                fill="#000"
              />
              <path
                d="M11.494 17.695a8.799 8.799 0 1 0 0-17.597 8.799 8.799 0 0 0 0 17.597Z"
                fill="#000"
              />
              <path
                d="M11.484 15.169a9.946 9.946 0 0 0-6.266-6.266 9.946 9.946 0 0 0 6.266-6.266 9.946 9.946 0 0 0 6.266 6.266 9.946 9.946 0 0 0-6.266 6.266Z"
                fill="#C4FE1F"
              />
            </svg>
            <p class="achivement-text">
              {{ el.achieved }}
            </p>
          </div>

          <div class="athletes-skills">
            <p class="skill-title">
              Aptitudes <span>-  {{ el.aptitude }} :</span>
            </p>
            <div class="skills">
              <p
                v-for="(d, i) in el.capacities"
                :key="index+'capacities'+i"
                class="skill"
              >
                <span>
                  {{ d }}
                </span>
              </p>
            </div>
          </div>

          <div class="athletes-socials">
            <a
              v-for="(l, i) in el.socials"
              :key="index+'socials'+i"
              :href="l.link"
              target="_blank"
              class="athletes-link"
              :class="['link-' + i]"
            >
              <span class="icon-wrapper">
                <svg
                  v-if="l.type === 'tiktok'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21.45 24.54"
                  class="athletes-link-icon"
                >
                  <path d="M21.4 5.98c0-.11 0-.11-.12-.11-.28 0-.55-.03-.83-.07-1-.15-4.23-1.85-4.78-4.62-.01-.05-.13-.74-.13-1.04 0-.13 0-.13-.13-.13h-.09C14.06 0 12.79 0 11.53 0c-.25 0-.22-.03-.22.22v16.46c0 .2 0 .41-.04.61-.19 1.06-.73 1.89-1.65 2.46-.8.49-1.66.63-2.58.45-.29-.06-.56-.17-.83-.27l-.07-.06c-.09-.08-.19-.14-.29-.21-1.17-.81-1.73-1.94-1.56-3.34.17-1.43.99-2.4 2.35-2.9.4-.15.83-.21 1.26-.19.28.01.55.05.82.13.09.03.14 0 .15-.11v-.1c0-.98-.04-3.14-.04-3.14v-.85c0-.08-.04-.1-.11-.1-.51-.06-1.02-.07-1.53-.03-.71.05-1.4.2-2.06.44-1.07.38-2 .98-2.81 1.77a7.713 7.713 0 0 0-2.3 5.01c-.03.4-.02.8.02 1.21.05.56.16 1.1.33 1.63.49 1.53 1.37 2.78 2.63 3.78.13.1.25.21.4.28l.19.17c.2.15.42.28.65.4 1.41.69 2.89.98 4.45.79 2.03-.25 3.71-1.15 5.04-2.69 1.25-1.46 1.86-3.16 1.87-5.07.02-2.73 0-5.46 0-8.2 0-.07-.04-.16.03-.19.06-.03.11.05.17.08a9.98 9.98 0 0 0 3.3 1.42c.69.16 1.39.25 2.1.25.22 0 .25-.01.25-.23 0-.97-.05-3.62-.05-3.88Z" />
                </svg>
                <svg
                  v-if="l.type === 'facebook'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 11.49 24.9"
                  class="athletes-link-icon"
                >
                  <path d="M2.61 24.9h5.01V12.35h3.5l.37-4.2H7.62V5.76c0-.99.2-1.38 1.16-1.38h2.71V0H8.02C4.29 0 2.61 1.64 2.61 4.79v3.35H0v4.26h2.61v12.5Z" />
                </svg>
                <svg
                  v-if="l.type === 'vimeo'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23.36 20.22"
                  class="athletes-link-icon"
                >
                  <path d="M19.96 0c-3.24-.1-5.43 1.72-6.58 5.49.59-.25 1.17-.38 1.73-.38 1.19 0 1.71.67 1.57 2-.07.81-.59 1.98-1.57 3.53-.98 1.55-1.71 2.32-2.2 2.32-.63 0-1.21-1.19-1.73-3.57-.18-.7-.49-2.49-.94-5.36C9.81 1.37 8.69.12 6.87.3c-.77.07-1.92.77-3.46 2.1C2.29 3.41 1.15 4.43 0 5.44l1.1 1.42c1.05-.73 1.66-1.1 1.83-1.1.8 0 1.55 1.26 2.25 3.77l1.89 6.92c.94 2.52 2.09 3.77 3.46 3.77 2.2 0 4.89-2.06 8.06-6.2 3.07-3.95 4.66-7.07 4.76-9.35.14-3.04-.99-4.59-3.39-4.67Z" />
                </svg>
                <svg
                  v-if="l.type === 'youtube'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 25.76 18.15"
                  class="athletes-link-icon"
                >
                  <path d="M25.23 2.83A3.236 3.236 0 0 0 22.95.54C20.94 0 12.88 0 12.88 0S4.82 0 2.81.54A3.24 3.24 0 0 0 .54 2.83C0 4.85 0 9.07 0 9.07s0 4.22.54 6.24c.3 1.12 1.17 1.99 2.28 2.29 2.01.54 10.07.54 10.07.54s8.06 0 10.07-.54c1.11-.3 1.98-1.18 2.28-2.29.54-2.02.54-6.24.54-6.24s0-4.22-.54-6.24ZM10.25 12.91V5.25l6.73 3.83-6.73 3.83Z" />
                </svg>
                <svg
                  v-if="l.type === 'instagram'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20.17 20.17"
                  class="athletes-link-icon"
                >
                  <path d="M10.09 1.82c2.69 0 3.01.01 4.08.06.98.04 1.52.21 1.87.35.47.18.81.4 1.16.75.35.35.57.69.75 1.16.14.36.3.89.35 1.87.05 1.06.06 1.38.06 4.08s-.01 3.01-.06 4.08c-.05.98-.21 1.52-.35 1.87-.18.47-.4.81-.75 1.16s-.69.57-1.16.75c-.36.14-.89.3-1.87.35-1.06.05-1.38.06-4.08.06s-3.01-.01-4.08-.06c-.98-.04-1.52-.21-1.87-.35-.47-.18-.81-.4-1.16-.75-.35-.35-.57-.69-.75-1.16-.14-.36-.3-.89-.35-1.87-.05-1.06-.06-1.38-.06-4.08s.01-3.01.06-4.08c.05-.98.21-1.52.35-1.87.18-.47.4-.81.75-1.16.35-.35.69-.57 1.16-.75.36-.14.89-.3 1.87-.35 1.06-.05 1.38-.06 4.08-.06m0-1.82C7.35 0 7.01.01 5.93.06 4.86.11 4.12.28 3.48.53c-.66.26-1.23.6-1.79 1.16-.56.56-.91 1.12-1.16 1.79-.25.64-.42 1.37-.47 2.45C.01 7.01 0 7.35 0 10.09s.01 3.08.06 4.16c.05 1.07.22 1.81.47 2.45.26.66.6 1.23 1.16 1.79s1.12.91 1.79 1.16c.64.25 1.37.42 2.45.47 1.08.05 1.42.06 4.16.06s3.08-.01 4.16-.06c1.07-.05 1.81-.22 2.45-.47.66-.26 1.23-.6 1.79-1.16.56-.56.91-1.12 1.16-1.79.25-.64.42-1.37.47-2.45.05-1.08.06-1.42.06-4.16s-.01-3.08-.06-4.16c-.05-1.07-.22-1.81-.47-2.45-.26-.66-.6-1.23-1.16-1.79-.56-.56-1.12-.91-1.79-1.16-.64-.25-1.37-.42-2.45-.47C13.17.01 12.83 0 10.09 0" /><path d="M10.09 4.91a5.181 5.181 0 0 0 0 10.36 5.181 5.181 0 0 0 0-10.36m0 8.54c-1.86 0-3.36-1.51-3.36-3.36s1.51-3.36 3.36-3.36 3.36 1.51 3.36 3.36-1.51 3.36-3.36 3.36M16.68 4.7c0 .67-.54 1.21-1.21 1.21s-1.21-.54-1.21-1.21.54-1.21 1.21-1.21 1.21.54 1.21 1.21" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="separator">
      <svg
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="separator-icon"
      >
        <path
          d="M15.727 30.462A23.518 23.518 0 0 0 .91 15.645 23.518 23.518 0 0 0 15.727.828a23.518 23.518 0 0 0 14.817 14.817 23.518 23.518 0 0 0-14.817 14.817Z"
        />
      </svg>
      <div class="arrow" />
    </div>
  </section>
</template>

<script setup>
  import { splitByWord } from '~~/webgl/Utils/splitText';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const title = splitByWord(props.data.title)

</script>

<style lang="scss" scoped>
.athletes-title {
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

.athletes-list {
  display: flex;
  align-items: stretch;
}

.athletes-card {
  @include fluidSize("card-size",
    (bpw(s): 250px,
      bpw(lg): 300px,
      bpw(xxl): 350px));

  position: relative;
  box-shadow: 0 0 40px 5px rgba(colors(black), .3);
  width: fit-content;
  padding: 2rem 1.6rem;
  border-radius: .9rem;
  overflow: hidden;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  .is-green & {
    background: const(gradient-green)
  }

  .is-pink & {
    background: const(gradient-pink)
  }

  .is-purple & {
    background: const(gradient-purple)
  }
}

.athletes-sport {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  padding: .4rem .8rem;
  width: fit-content;

  span {
    font-family: const(font-akira);
    font-weight: 700;
    font-size: 2.2rem;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: colors(black);
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}

.athletes-pic-wrapper {
  position: relative;

  .athletes-picture {

    width: var(--card-size);
    height: auto;
    display: block;
    border-radius: .4rem;
  }

  .athletes-type {
    position: absolute;
    z-index: 2;
    top: 15%;
    right: 0;
    padding: 0 .8rem;

    span {
      font-family: const(font-akira);
      font-weight: 700;
      font-size: 1.8rem;
      color: colors(black);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: -1;

      .is-green & {
        background-color: colors(f_green);
      }

      .is-pink & {
        background-color: colors(f_pink);
      }

      .is-purple & {
        background-color: colors(f_purple);
      }
    }
  }
}

.athletes-name-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 1.2rem;
  max-width: var(--card-size);
}

.athletes-name {
  font-family: const(font-tusker);
  font-weight: 500;
  text-transform: uppercase;
  color: colors(black);
  font-size: 4.2rem;
}

.athletes-country {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  margin-left: 1.5rem;
}

.country-star {
  width: 2.4rem;
  fill: colors(black);

  .is-green & {
    fill: colors(f_green);
  }

  .is-pink & {
    fill: colors(f_pink);
  }

  .is-purple & {
    fill: colors(f_purple);
  }
}

.athletes-code {
  font-family: const(font-akira);
  font-weight: 900;
  font-size: 1.5rem;
  color: colors(black);
  margin-top: .4rem;
}

.athletes-info {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  max-width: var(--card-size);
  border-top: 1px solid colors(black);
  margin-top: 1rem;
  padding-top: 1rem;
}

.athletes-achivement {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: var(--card-size);
}

.achivement-icon {
  width: 2rem;
  margin-right: 1rem;
}

.achivement-text {
  font-family: const(font-tusker);
  font-weight: 600;
  text-transform: uppercase;
  color: colors(black);
  font-size: 1.8rem;
}

.athletes-skill {
  margin-top: 1.2rem;
}

.skill-title {
  font-family: const(font-akira);
  font-weight: 900;
  color: colors(black);
  text-transform: uppercase;
  font-size: 1.8rem;
  letter-spacing: .35px;
  margin-bottom: 1.2rem;

  span {
    display: block;
    font-weight: 700;
    font-size: 1.5rem;
  }
}

.skills {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;

  .skill {
    font-family: const(font-gotham);
    font-weight: 400;
    font-size: 1.4rem;
    color: colors(black);
    margin: .4rem .6rem .4rem 0;
    padding: 0 .8rem;
    border: 1px solid colors(black);
    border-radius: 1rem;
  }
}

.athletes-socials {
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 1rem;
}

.athletes-link {
  transition: transform .5s ease(out-swift);

  &:hover {
    transform: scale(1.2);
  }
}

.athletes-link-icon {
  height: 1.5rem;
  margin: 0 1rem;
}

.separator {
  margin-top: 5rem;
  width: 100%;
}

.separator-icon {
  width: 2rem;
  fill: colors(black);
  margin-right: 2rem;
  display: inline-block;
  vertical-align: middle;
}

.arrow {
  position: relative;
  width: 60%;
  height: 1px;
  background-color: colors(black);
  display: inline-block;
  vertical-align: middle;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: .75rem;
    height: 1px;
    right: 0;
    display: block;
    background-color: colors(black);
    transform-origin: center right;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
}
</style>
