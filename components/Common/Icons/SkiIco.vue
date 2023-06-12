<template>
  <div class="icon highline">
    <svg
      class="picto"
      viewBox="0 0 346 389"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M101.338 59.05c-8.655-14.99-3.52-34.16 11.472-42.815 14.992-8.656 34.161-3.52 42.816 11.472l190.158 329.364-54.288 31.343L101.338 59.05ZM15.941 59.05c-8.655-14.99-3.519-34.16 11.473-42.815 14.991-8.656 34.16-3.52 42.816 11.472l190.158 329.364-54.289 31.343L15.941 59.05Z"
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
      Free ride
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
