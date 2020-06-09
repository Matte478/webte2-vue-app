<template>
  <div>
    <section class="section section--full section--home">
      <div class="container">
        <div class="row">
          <div class="col">
            <h1 class="section__title">{{ $t('home.title') }}</h1>
            <p class="text-center title-desc" v-html="$t('home.desc')" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="exampleFormControlTextarea1">
                  {{ $t('home.problem') }}
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  v-model="problem"
                  :placeholder="$t('home.problem-placeholder')"
                ></textarea>
              </div>
              <button
                type="submit"
                class="btn btn-green btn-block"
              > {{ $t('home.calculate') }} </button>
            </form>
          </div>
        </div>

        <div class="row">
          <div
            class="col pt-3"
            v-if="result"
          >
            {{ $t('home.result') }}:
            <div>
              {{ result }}
            </div>
          </div>
        </div>

        <div class="row">
          <div
            class="col pt-3"
            v-if="error"
          >
            {{ $t('home.error') }}:
            <div>
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      problem: "",
      result: "",
      error: ""
    }
  },

  methods: {
    submitForm() {
      axios
        .get("/calculate", {
          params: {
            problem: this.problem
          }
        })
        .then(response => {
          this.error = ""
          this.result = response.data.data
        })
        .catch(error => {
          this.result = ""
          this.error = error.response.data.message
          console.log(error.response.data.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.title-desc {
  margin: 0 auto 2.5em auto;
  max-width: 590px;
}
</style>