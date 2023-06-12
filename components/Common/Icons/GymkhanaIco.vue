<template>
  <div class="icon highline">
    <svg
      class="picto"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M319.33 159.863c0 87.983-71.324 159.307-159.307 159.307C72.039 319.17.715 247.846.715 159.863.715 71.879 72.039.555 160.023.555c87.983 0 159.307 71.324 159.307 159.308ZM53.82 132.794c-11.222 3.121-22.134-6.232-18.229-17.206 18.2-51.146 67.039-87.763 124.432-87.763 57.632 0 106.641 36.925 124.659 88.407 3.818 10.91-6.961 20.205-18.111 17.158-30.205-8.254-69.786-16.021-108.472-16.021-37.744 0-75.388 7.393-104.279 15.425Zm232.317 66.292c2.343-7.542-2.264-15.271-9.881-17.354-16.926-4.629-39.06-9.407-64.456-12.468-6.02-.726-11.942 2.234-14.395 7.779-7.435 16.804-15.042 46.168-13.762 95.076.244 9.316 8.916 16.083 17.766 13.165 40.351-13.307 72.098-45.544 84.728-86.198Zm-147.36 73.604c-.247 9.27-8.757 16.123-17.62 13.397-41.691-12.822-74.584-45.731-87.382-87.433-2.293-7.472 2.221-15.131 9.744-17.25 17.076-4.81 39.732-9.742 66.095-12.693 4.781-.536 9.63 1.191 12.442 5.094 4.566 6.336 8.733 14.874 11.799 27.918 3.705 15.758 5.798 38.086 4.922 70.967Zm21.247-90.397c12.387 0 22.429-10.042 22.429-22.43 0-12.387-10.042-22.429-22.429-22.429-12.388 0-22.43 10.042-22.43 22.429 0 12.388 10.042 22.43 22.43 22.43Z"
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
      Gymkhana
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
