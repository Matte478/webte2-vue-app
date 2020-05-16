<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark indigo">
      <router-link
        :to="{name: 'home'}"
        class="logo navbar-brand"
      >Dzive kody</router-link>
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
          <li class="nav-item active">
            <a
              class="nav-link"
              href="#"
            > page </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
            > page </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#"
            > page </a>
          </li>
        </ul>
        <span class="navbar-text white-text">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a
                class="nav-link"
                href="#"
              > SK </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
              > EN </a>
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

<style lang="scss">
@import "~@/assets/scss/app.scss";
</style>