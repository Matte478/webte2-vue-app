<template>
  <div>
    <section class="section section--home">
      <div class="container">
        <div class="row">
          <div class="col">
            <h2 class="section__title">{{ $t('home.title') }}</h2>
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
                class="btn btn-primary btn-block"
              > {{ $t('home.calculate') }} </button>
            </form>
          </div>
        </div>

        <div class="row">
          <div
            class="col"
            v-if="result"
          >
            {{ $t('home.result') }}
            <div>
              {{ result }}
            </div>
          </div>
        </div>

        <div class="row">
          <div
            class="col"
            v-if="error"
          >
            {{ $t('home.error') }}
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
          console.log(error.response.data)
        })
    }
  }
}
</script>