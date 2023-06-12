<template>
  <div class="icon highline">
    <svg
      viewBox="0 0 458 283"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="picto"
    >
      <path
        d="m81.685 78.006 81.685 204.676H0L81.685 78.006ZM344.839.033 457.62 282.682H232.059L344.839.033Z"
        fill="#fff"
      />
      <path
        d="m91.432 141.588 52.318 9.37a405.645 405.645 0 0 0 136.565 1.101l64.445-10.471"
        stroke="#fff"
        stroke-width="13.459"
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
      Highline
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
