<template>
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1>{{ $t('team.title') }}</h1>
        </div>
      </div>
      <div class="row">
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
          <table class="table">
            <tr>
              <th>Dávid Špak</th>
              <th>Martin Biľanský</th>
              <th>Jakub Fedorko</th>
              <th>Patrik Vaverčák</th>
            </tr>

            <tr>
              <td>Setup projektu</td>
              <td>Inverzné kyvadlo</td>
              <td>Náklon lietadla</td>
              <td>Tlmič kolesa</td>
            </tr>
            <tr>
              <td>Gulička na tyči a kalkulačka</td>
              <td>Logovanie API volaní</td>
              <td>Export do PDF a CSV</td>
              <td>Najviac využívaná služba</td>
            </tr>
            <!-- <tr>
              <td>CAS kalkulačka</td>

            </tr> -->
            <tr>
              <td>Komunikácia pomocou API klúča</td>
              <td>Implementácia Octave</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h3>Frontend</h3>
          <table class="table">
            <tr>
              <th>Dávid Špak</th>
              <th>Martin Biľanský</th>
              <th>Jakub Fedorko</th>
              <th>Patrik Vaverčák</th>
            </tr>

            <tr>
              <td>Setup projektu</td>
              <td>Popis API</td>
              <td>Graficky dizajn</td>
              <td>Podstránka tím</td>

            </tr>
            <tr>
              <td>Gulička na tyči</td>
              <td>Inverzné kyvadlo</td>
              <td>Náklon lietadla</td>
              <td>Tlmič kolesa</td>
            </tr>
            <tr>
              <td>Multijazyčnosť, štatistika</td>
              <td></td>
              <td>Optimalizácia animácií</td>
            </tr>
            <!-- <tr>
              <td>Multijazyčnosť</td>
            </tr> -->
          </table>
        </div>
      </div>
    </div>
  </section>
</template>