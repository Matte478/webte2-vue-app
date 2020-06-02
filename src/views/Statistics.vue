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

      <div class="row mb--2">
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
        <div class="col">
          <h3>{{ $t('statistics.most-used') }}</h3>
        </div>
      </div>

      <div class="row">
        <div class="col">
          // TODO API CALL
        </div>
      </div>
    </div>

  </section>

</template>

<script>
import axios from "axios"

export default {
  data() {
    return {}
  },

  methods: {
    download(format) {
      console.log(format)
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