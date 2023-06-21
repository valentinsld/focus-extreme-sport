<template>
  <div class="icon highline">
    <svg
      class="picto"
      viewBox="0 0 392 390"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M352.381 154.316c-9.676-23.744-26.102-34.028-36.972-40.833-1.814-1.136-3.474-2.175-4.922-3.164-10.119-6.91-26.004-26.6-29.417-32.169-10.195-16.62-25.231-29.7-42.823-38.125C197.865 20.69 141.205 0 141.205 0l1.985 83.948c.714 30-13.993 58.259-38.954 74.909L.755 227.84l69.782 37.211a138.214 138.214 0 0 1 56.903 56.903l36.184 67.841 68.983-103.482c16.649-24.96 44.908-39.668 74.909-38.954l83.947 1.985s-20.019-54.804-39.068-95.028h-.014Z"
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
      Wingsuit
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
    transition: fill .5s ease(out-swift), stroke .5s ease(out-swift);
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
