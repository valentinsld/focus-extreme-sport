<template>
  <footer class="footer flow-section">
    <img
      class="gobelins"
      src="/flow-state/footer/gobelins.png"
    >
    <div class="footer-content">
      <p class="initialisation">
        Ce projet est réalisé dans le cadre du Master 2 - DMII
      </p>
      <p class="links">
        par
        <a
          href="http://vaninaidiart.fr/"
          target="_blank"
        ><span>Vanina IDIART</span></a>,
        <a
          href="https://www.behance.net/tanguypuech"
          target="_blank"
        ><span>Tanguy PUECH</span></a>,
        <a
          href="http://www.leoblondin.com/"
          target="_blank"
        ><span>Léo BLONDIN</span></a>,
        <a
          href="https://www.valentinsld.fr/"
          target="_blank"
        ><span>Valentin SALAUD</span></a>,
        <a
          href="https://www.behance.net/axelcrb"
          target="_blank"
        ><span>Axel CROUILBOIS</span></a> et
        <a
          href="https://www.behance.net/margauxclm6c96"
          target="_blank"
        ><span>Margaux CLEMENT</span></a>
      </p>
    </div>

    <img
      class="cci"
      src="/flow-state/footer/cci.png"
    >
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  max-width: 980px;
  margin: auto;
  padding: 5.5rem 0;

  border-top: 1px solid colors(black);

  @include above(bpw(xl)) {
    max-width: 80vw;
  }

  .gobelins {
    width: 8.5rem;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    color: colors(black);

    .initialisation {
      font-family: const(font-gotham);
      font-weight: 400;
      font-size: 1.5rem;
      text-align: center;
    }

    .links {
      max-width: 60%;
      font-family: const(font-gotham);
      font-weight: 400;
      font-size: 1.5rem;
      text-align: center;
      color: rgba(colors(black), .5);

      a {
        color: rgba(colors(black), .5);
        white-space: nowrap;
        line-height: 140%;
        transition: color .3s ease(out-swift);

        span {
          position: relative;
          z-index: 1;

          &::after {
            content: "";
            position: absolute;
            display: block;
            width: 100%;
            height: 1px;
            background-color: rgba(colors(black), .5);
            bottom: -2px;
            left: 0;
            transform: scaleX(0);
            transform-origin: center right;
            transition: transform .3s ease(out-swift), background-color .3s ease(out-swift);
            will-change: transform;
          }
        }

        &:hover {
          color: colors(f_pink);

          span {
            &::after {
              transform: scaleX(1);
              transform-origin: center left;
              background-color: colors(f_pink);
            }
          }
        }

      }
    }
  }

  .cci {
    width: 8.5rem;
  }
}
</style>
