<template>
  <div class="icon highline">
    <svg
      class="picto"
      viewBox="0 0 423 303"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M404.805 105.102c-101.133 67.283-139.076 194.013-139.076 194.013M13.143 105.102C114.277 172.385 152.22 299.115 152.22 299.115"
        stroke="#fff"
        stroke-width="20.292"
      />
      <path
        d="M.275 145.897V50.87C20.485 38.167 90.7.635 209.878.635c119.18 0 191.703 37.532 213.068 50.235v95.027c-21.365-18.395-93.888-55.185-213.068-55.185-119.179 0-189.393 36.79-209.603 55.185Z"
        fill="#fff"
      />
    </svg>
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="picto-background"
    >
      <path
        d="M.138 63.242a70.564 70.564 0 0 0 0-62.87 70.565 70.565 0 0 0 62.872 0 70.564 70.564 0 0 0 0 62.87 70.565 70.565 0 0 0-62.872 0Z"
        fill="#fff"
      />
    </svg>
    <p class="sport-text">
      Parachute
    </p>
  </div>
</template>

<script setup>

  </script>

<style lang="scss" scoped>
.icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  aspect-ratio: 1/1;
}

.picto {
  position: absolute;
  width: 50%;
  z-index: 1;

  path {
    fill: colors(white);
    stroke: colors(white);
    transition: fill .3s ease(out-swift), stroke .3s ease(out-swift);
  }
}

.picto-background {
  width: 100%;
  opacity: .3;
  transition: opacity .3s ease(out-swift);
}

.sport-text {
  position: absolute;
  font-family: const(font-gotham);
  text-transform: uppercase;
  font-size: 9px;
  bottom: -2rem;
  opacity: 0;
  transition: opacity .3s ease(out-swift);
}
</style>
