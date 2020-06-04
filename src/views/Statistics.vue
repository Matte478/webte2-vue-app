<template>
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2 class="section__title">{{ $t('statistics.title') }}</h2>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h3>{{ $t('statistics.export') }}</h3>
        </div>
      </div>

      <div class="row mb--2 justify-content-center">
        <div class="col-1">
          <button
            type="button"
            class="btn btn-dark"
            @click="download('csv')"
          >CSV</button>
        </div>
        <div class="col-1">
          <button
            type="button"
            class="btn btn-dark"
            @click="download('pdf')"
          >PDF</button>
        </div>
      </div>

      <div class="row">
        <div
          class="col"
          v-if="statistics.length"
        >
          <h3>{{ $t('statistics.statistics') }}</h3>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div
            class="table-wrapper"
            v-if="statistics.length"
          >
            <table class="table layout-fixed">
              <tr>
                <th>{{ $t('statistics.service') }}</th>
                <th>{{ $t('statistics.count') }}</th>
              </tr>
              <tr
                v-for="(stat, index) in statistics"
                :key="index"
              >
                <td>{{ stat.service[$i18n.locale] }}</td>
                <td>{{ stat.count }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h3>{{ $t('statistics.send-title') }}</h3>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form
            @submit.prevent="sendEmail"
            class="mb--2"
          >
            <div class="form-group">
              <input
                class="form-control"
                type="email"
                name="email"
                id="email"
                :placeholder="$t('statistics.placeholder')"
                v-model="email"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-block"
              :disabled="sending"
            >{{ $t('statistics.send') }}</button>
          </form>
          <p v-if="success">
            {{ success }}
          </p>
        </div>
      </div>
    </div>

  </section>

</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      statistics: [],
      email: "",
      success: "",
      sending: false
    }
  },

  created() {
    this.loadMostUsedService()
  },

  methods: {
    loadMostUsedService() {
      axios
        .get("/statistics")
        .then(response => {
          this.statistics = response.data.data
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },

    sendEmail() {
      this.sending = true

      axios
        .get("/statistics/send-email", {
          params: {
            email: this.email
          }
        })
        .then(() => {
          this.sending = false
          this.success = "Štatistika bola odoslaná na email: " + this.email
        })
        .catch(error => {
          this.sending = false
          console.log(error.response.data)
        })
    },

    download(format) {
      axios
        .get(`logs/export/${format}`, {
          responseType: "blob"
        })
        .then(response => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement("a")

          fileLink.href = fileURL
          fileLink.setAttribute("download", `export.${format}`)
          document.body.appendChild(fileLink)

          fileLink.click()
        })
    }
  }
}
</script>