<template>
  <div>
    <section class="section section--home">
      <div class="container">
        <div class="row">
          <div class="col">
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="exampleFormControlTextarea1">Príkaz</label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  v-model="command"
                ></textarea>
              </div>
              <button
                type="submit"
                class="btn btn-primary btn-block"
              >Vypočítať</button>
            </form>
          </div>
        </div>

        <div class="row">
          <div
            class="col"
            v-if="result"
          >
            výsledok
            <div>
              {{command}}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      command: "",
      result: ""
    }
  },

  methods: {
    submitForm() {
      axios
        .post("/calculate", {
          calculate: this.calculate
        })
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>