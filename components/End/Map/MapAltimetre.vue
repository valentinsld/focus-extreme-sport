<template>
  <div
    class="map-altimetre"
  >
    <div
      class="map-altimetre-graduation"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="map-graduation"
        :class="['gradution-'+ i]"
      >
        <span>
          {{ altitude[i - 1] }}M
        </span>
      </div>
      <div
        class="map-altimetre-cursor"
      >
        <svg
          viewBox="0 0 184 184"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="cursor-icon"
        >
          <path
            d="M183.142 91.57a145.346 145.346 0 0 0-91.57 91.572A145.347 145.347 0 0 0 0 91.57 145.347 145.347 0 0 0 91.571 0a145.347 145.347 0 0 0 91.571 91.57Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>

const altitude = [
	'4000',
	'2600',
	'2000',
	'1700'
]

</script>

<style lang="scss" scoped>
.map-altimetre {
	position: absolute;
	height: 100%;
	top: 0;
	right: 2%;
}

.map-altimetre-graduation {
	height: 80%;
	display: flex;
	position: relative;
	align-items: flex-start;
	justify-content: space-between;
	flex-direction: column;
	border-right: .15rem solid colors(black);
}

.map-graduation {
	position: relative;
	width: 1rem;
	height: .15rem;
	background-color: colors(black);
	font-family: const(font-akira);
	font-weight: 900;
	font-size: 1.2rem;
	color: colors(black);
	display: flex;
	align-items: center;

	span {
		position: absolute;
		transform: translateX(-110%);
	}
}

.map-altimetre-cursor {
	position: absolute;
	transform: translateY(var(--graduation-translate));

	svg {
		width: 2rem;
		margin-right: 1rem;
		filter: drop-shadow(0px 0px 5px rgba(colors(black), .5));
		fill: colors(f_green);
	}
}
</style>
