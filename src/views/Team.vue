<template>
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="section__title">{{ $t('team.title') }}</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <div class="person">
            <h4 class="person__name">Martin Biľanský</h4>
            <p class="person__id">92255</p>
            <a
              class="person__email"
              href="mailto:xbilansky@stuba.sk"
            >{{ $t('team.contact') }}</a>
          </div>
        </div>
        <div class="col-md-3">
          <div class="person">
            <h4 class="person__name">Jakub Fedorko</h4>
            <p class="person__id">92272</p>
            <a
              class="person__email"
              href="mailto:xfedorko@stuba.sk"
            >{{ $t('team.contact') }}</a>
          </div>
        </div>
        <div class="col-md-3">
          <div class="person">
            <h4 class="person__name">Dávid Špak</h4>
            <p class="person__id">92365</p>
            <a
              class="person__email"
              href="mailto:xspak@stuba.sk"
            >{{ $t('team.contact') }}</a>
          </div>
        </div>
        <div class="col-md-3">
          <div class="person">
            <h4 class="person__name">Patrik Vaverčák</h4>
            <p class="person__id">92382</p>
            <a
              class="person__email"
              href="mailto:xvavercak@stuba.sk"
            >{{ $t('team.contact') }}</a>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h3>API</h3>

          <div class="table-wrapper">
            <table class="table">
              <tr>
                <th>Martin Biľanský</th>
                <th>Jakub Fedorko</th>
                <th>Dávid Špak</th>
                <th>Patrik Vaverčák</th>
              </tr>

              <tr
                v-for="(row, rowIndex) in tableAPI"
                :key="rowIndex"
              >
                <td
                  v-for="(item, itemIndex) in row"
                  :key="rowIndex + '_' + itemIndex"
                >{{ item }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h3>Frontend</h3>

          <div class="table-wrapper">
            <table class="table">
              <tr>
                <th>Martin Biľanský</th>
                <th>Jakub Fedorko</th>
                <th>Dávid Špak</th>
                <th>Patrik Vaverčák</th>
              </tr>

              <tr
                v-for="(row, rowIndex) in tableFrontend"
                :key="rowIndex"
              >
                <td
                  v-for="(item, itemIndex) in row"
                  :key="rowIndex + '_' + itemIndex"
                >{{ item }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    tableAPI() {
      return this.$t("team.table-api")
    },
    tableFrontend() {
      return this.$t("team.table-frontend")
    }
  }
}
</script>
