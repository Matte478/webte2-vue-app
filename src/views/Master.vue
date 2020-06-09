<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark indigo fixed-top">
      <router-link
        :to="{name: 'home'}"
        class="logo navbar-brand"
      >{{ $t('nav.title') }}</router-link>
      <span class="divider">|</span>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        id="navbarText"
      >
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link
              :to="{name: 'home'}"
              class="nav-link"
            >{{ $t('nav.calculator') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{name: 'airplane'}"
              class="nav-link"
            >{{ $t('nav.airplane') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{name: 'pendulum'}"
              class="nav-link"
            >{{ $t('nav.pendulum') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{name: 'ballbeam'}"
              class="nav-link"
            >{{ $t('nav.ballbeam') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{name: 'suspension'}"
              class="nav-link"
            >{{ $t('nav.suspension') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{name: 'statistics'}"
              class="nav-link"
            >{{ $t('nav.statistics') }}</router-link>
          </li>
           <li class="nav-item">
            <router-link
              :to="{name: 'api'}"
              class="nav-link"
            >{{ $t('nav.api') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link
              :to="{name: 'team'}"
              class="nav-link"
            >{{ $t('nav.team') }}</router-link>
          </li>
        </ul>
        <span class="navbar-text white-text">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <span class="lang-select">{{ $t('nav.language') }}:</span>
              <select
                v-model="$i18n.locale"
                @change="changeLocale"
              >
                <option
                  v-for="(lang, i) in $i18n.availableLocales"
                  :key="`Lang${i}`"
                  :value="lang"
                > {{ lang }} </option>
              </select>
            </li>
          </ul>
        </span>
      </div>
    </nav>

    <transition
      name="fade"
      mode="out-in"
    >
      <router-view />
    </transition>

    <footer class="footer">
      <div class="container">
        <div class="col">
          <span class="brand">dzive_kody</span> | Copyright © 2020 | {{ $t('footer.rights') }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    changeLocale() {
      this.$router.push({
        params: {
          lang: this.$i18n.locale
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/scss/app.scss";

.lang-select {
  margin-right: 0.5em;
}
</style>