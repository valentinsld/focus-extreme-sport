<template>
  <header class="header">
    <NuxtLink
      to="/"
    >
      <span>
        home
      </span>
    </NuxtLink>

    <nav class="nav">
      <a href="#flow"><span>Le flow</span></a>
      <div class="separator" />
      <a href="#map"><span>Parcours</span></a>
      <div class="separator" />
      <a href="#athletes"><span>Athlètes</span></a>
      <div class="separator" />
      <a href="#sports"><span>Sports</span></a>
      <div class="separator" />
      <a href="#event"><span>Évènement</span></a>
    </nav>


    <NuxtLink
      to="/stickers-rewards"
    >
      <span>
        stickers
      </span>
    </NuxtLink>
  </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2rem 4rem;
  width: 100vw;
}
</style>
