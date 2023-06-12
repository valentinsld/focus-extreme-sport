<template>
  <div class="icon highline">
    <svg
      class="picto"
      viewBox="0 0 396 402"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M29.878 392.576.914 401.53C57.19 213.789 206.805 67.265 395.298 13.563 346.596 194.233 208.651 337.31 29.878 392.575ZM198.6 254.93c26.851 0 48.619-21.768 48.619-48.619 0-26.852-21.768-48.62-48.619-48.62-26.852 0-48.62 21.768-48.62 48.62 0 26.851 21.768 48.619 48.62 48.619Z"
        fill="#fff"
      />
      <path
        stroke="#fff"
        stroke-width="29.616"
        d="m21.741 10.508 346.505 381.057"
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
      Kayak
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
