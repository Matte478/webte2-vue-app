<template>
  <section class="section section--full">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="section__title">{{ $t('documentation.title') }}</h1>
        </div>
      </div>

      <!-- <div class="row">
        <div class="col">
          <h3>{{ $t('documentation.info') }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          PhpMyAdmin
        </div>
      </div> -->

      <div class="row">
        <div class="col">
          <h3>API - Laravel & Octave</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <ol>
            <li><pre>composer install</pre></li>
            <li>{{ $t('documentation.env') }}</li>
            <li><pre>php artisan migrate</pre></li>
            <li><pre>sudo add-apt-repository ppa:octave/stable</pre></li>
            <li><pre>sudo apt-get update</pre></li>
            <li><pre>sudo apt-get install octave</pre></li>
            <li>octave > <pre>pkg install -global -forge control</pre></li>
          </ol>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h3>Frontend - Vue.js</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <ol>
            <li><pre>npm install</pre></li>
            <li>{{ $t('documentation.env-vue') }}</li>
            <li><pre>npm run build</pre></li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>

</style>