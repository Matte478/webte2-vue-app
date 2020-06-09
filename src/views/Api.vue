<template>
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="section__title">{{ $t('api.title') }}</h1>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h4>{{ $t('api.base') }}:
            <pre>https://wt45.fei.stuba.sk:4445/final-api/api</pre>
          </h4>
        </div>
      </div>
      <hr />

      <div class="row">
        <div class="col">
          <h4>{{ $t('api.authentication') }}</h4>
          <p>{{ $t('api.authentication-desc') }}</p>
        </div>
      </div>
      <hr />

      <div class="row">
        <div class="col">
          <h4>{{ $t('api.airplane') }}</h4>
          <h5>
            <pre>[GET] /airplane</pre>
          </h5>
          <p class="ml-5">
            <pre>?r={value}</pre> - {{ $t('api.required') }}, {{ $t('api.airplane-r') }}</p>
          <p class="ml-5">
            <pre>?lr1={value}&lr2={value}&lr3={value}</pre> - {{ $t('api.optional') }}, {{ $t('api.old') }}</p>
        </div>
      </div>
      <hr />

      <div class="row">
        <div class="col">
          <h4>{{ $t('api.pendulum') }}</h4>
          <h5>
            <pre>[GET] /pendulum</pre>
          </h5>
          <p class="ml-5">
            <pre>?r={value}</pre> - {{ $t('api.required') }}, {{ $t('api.pendulum-r') }}</p>
          <p class="ml-5">
            <pre>?startDegree={value}&startPosition={value}</pre> - {{ $t('api.optional') }}, {{ $t('api.old') }}</p>
        </div>
      </div>
      <hr />

      <div class="row">
        <div class="col">
          <h4>{{ $t('api.ballbeam') }}</h4>
          <h5>
            <pre>[GET] /ballbeam</pre>
          </h5>
          <p class="ml-5">
            <pre>?r={value}</pre> - {{ $t('api.required') }}, {{ $t('api.ballbeam-r') }}</p>
          <p class="ml-5">
            <pre>?lr1={value}&lr2={value}&lr3={value}&lr4={value}</pre> - {{ $t('api.optional') }}, {{ $t('api.old') }}</p>
        </div>
      </div>
      <hr />

      <div class="row">
        <div class="col">
          <h4>{{ $t('api.suspension') }}</h4>
          <h5>
            <pre>[GET] /suspension</pre>
          </h5>
          <p class="ml-5">
            <pre>?r={value}</pre> - {{ $t('api.required') }}, {{ $t('api.suspension-r') }}</p>
          <p class="ml-5">
            <pre>?initX1={value}&initX1d={value}&initX2={value}&initX2d={value}&initX3={value}</pre> - {{ $t('api.optional') }}, {{ $t('api.old') }}</p>
        </div>
      </div>
      <hr />

      <div class="row">
        <div class="col">
          <h4>{{ $t('api.calculator') }}</h4>
          <h5>
            <pre>[GET] /calculate</pre>
          </h5>
          <p class="ml-5">
            <pre>?problem={value}</pre> - {{ $t('api.required') }}, {{ $t('api.calculator-desc') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>