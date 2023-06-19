<template>
  <div class="icon highline">
    <svg
      viewBox="0 0 398 352"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="picto"
    >
      <path
        d="M237.025 137.04c3.683-9.155 14.091-13.591 23.247-9.908 9.155 3.683 13.591 14.091 9.908 23.247l-80.983 201.296-33.155-13.339 80.983-201.296Z"
        fill="#fff"
      />
      <path
        d="M129.158 154.241c-4.183-8.938-.327-19.575 8.611-23.757 8.939-4.183 19.575-.327 23.758 8.611l91.956 196.526-32.369 15.146-91.956-196.526Z"
        fill="#fff"
      />
      <path
        d="M380.255 98.68c-94.837 63.095-130.417 181.935-130.417 181.935M12.98 98.68c94.837 63.095 130.417 181.935 130.417 181.935"
        stroke="#fff"
        stroke-width="19.029"
      />
      <path
        d="M.912 136.94V47.829C19.864 35.916 85.707.72 197.466.72c111.76 0 179.769 35.195 199.804 47.108v89.111c-20.035-17.25-88.044-51.75-199.804-51.75S19.864 119.69.912 136.94Z"
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
      Speed riding
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
  max-height: 50%;
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
  white-space: nowrap;
  bottom: -2rem;
  opacity: 0;
  transition: opacity .3s ease(out-swift);
}
</style>
