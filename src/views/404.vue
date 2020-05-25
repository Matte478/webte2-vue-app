<template>
  <!-- Source: https://codepen.io/salehriaz/pen/erJrZM -->
  <section class="section--404">
    <div class="bg-purple">
      <div class="stars">
        <div class="central-body">
          <h1 class="image-404">404</h1>
          <p class="image-404 text-404">{{$t('page-not-found.text')}}</p>
        </div>
        <div class="objects">
          <img
            class="object_rocket"
            alt=""
            src="http://salehriaz.com/404Page/img/rocket.svg"
          >
          <div class="earth-moon">
            <img
              class="object_earth"
              alt=""
              src="http://salehriaz.com/404Page/img/earth.svg"
            >
            <img
              class="object_moon"
              alt=""
              src="http://salehriaz.com/404Page/img/moon.svg"
            >
          </div>
          <div class="box_astronaut">
            <img
              class="object_astronaut"
              alt=""
              src="http://salehriaz.com/404Page/img/astronaut.svg"
            >
          </div>
        </div>
        <div class="glowing_stars">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
      </div>
    </div>
  </section>
</template>