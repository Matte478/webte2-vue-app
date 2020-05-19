<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark indigo">
      <router-link
        :to="{name: 'home'}"
        class="logo navbar-brand"
      >{{ $t('nav.title') }}</router-link>
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
            <!-- <router-link
              :to="{name: 'test'}"
              class="nav-link"
            >{{ $t('nav.page') }}</router-link> -->
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
            > {{ $t('nav.page') }} </a>
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