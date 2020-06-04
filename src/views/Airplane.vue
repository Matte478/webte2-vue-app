<template>
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2 class="section__title">{{ $t('airplane.title') }}</h2>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form
            @submit.prevent="submitForm"
            class="mb--2"
          >
            <div class="form-group">
              <label for="exampleFormControlTextarea1">
                {{ 
                  $t('airplane.problem') 
                + inputRange.min
                + $t('cas.range-join')
                + inputRange.max
                }}
              </label>
              <input
                class="form-control"
                id="exampleFormControlTextarea1"
                type="number"
                step="any"
                :min="inputRange.min"
                :max="inputRange.max"
                v-model="r"
                name="r"
                :placeholder="$t('airplane.placeholder')"
              />
            </div>
            <button
              type="submit"
              class="btn btn-green btn-block"
            >{{ $t('home.calculate') }}</button>
          </form>
        </div>
      </div>
      <div class="row mb--2">
        <div class="col-2">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="graphCheck"
              v-model="showGraph"
            />
            <label
              class="form-check-label"
              for="graphCheck"
            >{{ $t('cas.graph') }}</label>
          </div>
        </div>
        <div class="col-2">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="simCheck"
              v-model="showSim"
            />
            <label
              class="form-check-label"
              for="simCheck"
            >{{ $t('cas.simulation') }}</label>
          </div>
        </div>
      </div>
      <div class="row mb--2">
        <div class="col">
          <div class="form-group">
            <label for="dataflowSpeed">{{ $t('cas.duration') }}</label>
            <input
              type="range"
              class="form-control-range"
              id="dataflowSpeed"
              min="50"
              max="100"
              v-model="speed"
            />
            {{animationDuration}} s
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid result">
      <div class="row justify-content-md-center">
        <div
          class="col-md-6"
          v-if="showGraph"
        >
          <div class="result__box">
            <line-chart class="card" :chart-data="datacollection"></line-chart>
          </div>
        </div>
        <div
          class="col-md-6"
          v-show="showSim"
        >
          <div class="result__box">
            <div
              class="canvas-wrapper card"
              id="canvas-wrapper"
            >
              <canvas
                id="airplaneCanvas"
                class="canvas"
              ></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios"
import { fabric } from "fabric"
import LineChart from "./graphs/Graph.js"

export default {
  components: {
    LineChart
  },
  data() {
    return {
      inputRange: {
        min: -45,
        max: 45
      },

      r: 0.0,
      pitchAngle: [],
      pitchAngleOnScreen: [],
      backflapAngle: [],
      backflapAngleOnScreen: [],
      lastX: [],

      showGraph: true,
      showSim: true,

      speed: 50,

      aircraftAngle: 0,
      flapAngle: 0,

      canvas: null,
      aircraft: null,
      flap: null
    }
  },
  computed: {
    pa() {
      return this.pitchAngle[Symbol.iterator]() // convenient for yeilding values
    },
    bfa() {
      return this.backflapAngle[Symbol.iterator]()
    },
    graphOptions() {
      return {
        showLines:  true,
        animation: {
          duration: 0
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: this.yMin,
                suggestedMax: this.yMax, //suggestedMax
              }
            }
          ]
        },
        elements: {
          point: {
            radius: 1
          }
        }
      }
    },
    datacollection() {
      return {
        labels: this.labels,
        datasets: [
          {
            fill: false,
            label: this.$t("airplane.dataone"),
            backgroundColor: "#f82599",
            borderWidth: 3,
            borderColor: "#f82599",
            data: this.pitchAngleOnScreen
          },
          {
            fill: false,
            label: this.$t("airplane.datatwo"),
            backgroundColor: "#f87979",
            borderWidth: 3,
            borderColor: "#f87979",
            data: this.backflapAngleOnScreen
          }
        ]
      }
    },
    labels() {
      let time = []
      for (let x = 0; x <= 40.1; x += 0.1) {
        time.push(Math.round((x + Number.EPSILON) * 100) / 100)
      }
      return time
    },
    rRad() {
      return this.degToRad(this.r)
    },
    aircraftAngleDegrees() {
      return this.radToDeg(this.aircraftAngle)
    },
    flapAngleDegrees() {
      return this.radToDeg(this.flapAngle)
    },
    canvasWidth() {
      return this.canvas.get("width")
    },
    animationDuration() {
      return Math.round((this.speed * 0.401 + Number.EPSILON) * 100) / 100
    }
  },
  watch: {
    aircraftAngle() {
      this.aircraft.set({
        angle: this.aircraftAngleDegrees * -1
      })

      this.flap.set({
        angle: this.flapAngleDegrees
      })

      window.requestAnimationFrame(() => {
        this.canvas.renderAll()
      })
    }
  },
  mounted() {
    this.resizeCanvas()

    this.canvas = new fabric.StaticCanvas("airplaneCanvas")
    this.canvas.set({
      backgroundColor: "#cce6ff" //#cce6ff
    })
    fabric.Image.fromURL(
      require("../assets/images/cloud-superwide-500.png"),
      img => {
        this.cloudCallback(img, 500, 25000)
      }
    )
    fabric.Image.fromURL(
      require("../assets/images/cloud-bent-300.png"),
      img => {
        this.cloudCallback(img, 600, 39000)
      }
    )
    fabric.Image.fromURL(
      require("../assets/images/cloud-wide-200.png"),
      img => {
        this.cloudCallback(img, 350, 28000)
      }
    )

    let wing = new fabric.Path(
      "M 41.551287,211.61352 100.01625,206.29433 C 100.01625,206.29433 139.48587,201.83989 158.48123,200.97514 \
        167.61085,200.55952 200.59156,200.74449 199.90373,209.44752 199.29528,217.14594 166.60245,222.90297 158.48122,222.2519 138.62849,220.66032 \
        100.01625,216.93271 100.01625,216.93271 Z"
    )

    this.flap = new fabric.Path(
      "M 41.549177,210.8484 92.728452,207.74522 C 92.728452,207.74522 127.28364,205.086 143.90774,204.64205 151.89768,204.42867 \
        155.34752,204.78238 154.32091,212.47298 153.5975,217.8922 150.90894,219.02382 143.80637,218.54651 126.44379,217.37977 92.677767,214.69746 92.677767,214.69746 Z"
    )

    fabric.Image.fromURL(
      require("../assets/images/airplane_final.png"),
      img => {
        this.aircraftCallback(img, wing)
      }
    )

    fabric.Image.fromURL(
      require("../assets/images/cloud-wide-900.png"),
      img => {
        this.cloudCallback(img, 250, 15000)
      }
    )

    fabric.Image.fromURL(
      require("../assets/images/cloud-wide-500.png"),
      img => {
        this.cloudCallback(img, -100, 26000)
      }
    )

    fabric.Image.fromURL(
      require("../assets/images/cloud-wide-200.png"),
      img => {
        this.cloudCallback(img, 850, 50000)
      }
    )
  },
  methods: {
    animateImg(img, hidingWidth, duration) {

      img.animate("left", -hidingWidth, {
        onChange: () => {
          window.requestAnimationFrame(() => {
            this.canvas.renderAll()
          })
        },
        duration: duration,
        onComplete: () => {
          img.set({ 
            top: this.randomIntFromInterval(-50, this.canvasWidth + 50),
            left: this.canvasWidth
           })

          setTimeout(() => {
            this.animateImg(img, hidingWidth, duration)
          }, duration)
        }
      })
    },
    cloudCallback(img, top, duration) {
      this.canvas.add(img)

      img.set({
        top: top,
        left: this.canvasWidth,
        dirty: true,
        objectCaching: false
      })

      let imgWidth = img.get("width")
      let imgCanvasRatio = imgWidth / 1100
      // let canvasScaleRatio = this.canvas.width / 1100

      img.scaleToWidth(this.canvasWidth * imgCanvasRatio)

      let hidingWidth = img.scaleX * img.width
      this.animateImg(img, hidingWidth, duration)
    },

    aircraftCallback(img, wing) {
      let halfCanvas = this.canvasWidth / 2

      wing.set({
        strokeWidth: 2,
        stroke: "grey",
        fill: "lightGrey",
        top: 160
      })

      this.flap.set({
        centeredRotation: false,
        originX: "right",
        originY: "top",
        fill: "red",
        top: 166,
        left: 165
      })

      let dk = new fabric.Text("dzive_kody", {
        fontFamily: "menlo",
        fill: "red",
        fontSize: 20,
        left: 440,
        top: 158
      })

      this.aircraft = new fabric.Group([img, this.flap, dk, wing], {
        centeredRotation: false,
        originX: "center",
        originY: "center",
        top: halfCanvas,
        left: 0
      })
      this.aircraft.scaleToWidth(this.canvasWidth * 0.85, false)

      this.canvas.add(this.aircraft)

      this.aircraft.animate("left", halfCanvas, {
        onChange: () => {
          fabric.util.requestAnimFrame(() => {
            this.canvas.renderAll()
          })
        },
        duration: 4500,
        easing: fabric.util.ease.easeOutCubic
      })
    },
    resizeCanvas() {
      let wrapper = document
        .getElementById("canvas-wrapper")
        .getBoundingClientRect()
      let htmlCanvas = document.getElementById("airplaneCanvas")

      htmlCanvas.width = wrapper.width
      htmlCanvas.height = wrapper.height
    },
    submitForm() {
      axios
        .get("/airplane", {
          params: {
            r: this.rRad,
            lr1: this.lastX[0],
            lr2: this.lastX[1],
            lr3: this.lastX[2]
          }
        })
        .then(response => {
          let data = response.data.data

          this.pitchAngleOnScreen = []
          this.backflapAngleOnScreen = []

          this.pitchAngle = data.pitchAngle
          this.backflapAngle = data.backflapAngle
          this.lastX = data.lastX

          this.appendOnScreenData()
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    appendOnScreenData() {
      let tout = () => {
        const nextPa = this.pa.next() // next value
        const nextBfa = this.bfa.next()

        if (!nextPa.done) {
          // done = true when the end of array reached
          this.pitchAngleOnScreen.push(nextPa.value) // concatenate word to the string
          this.aircraftAngle = Number(nextPa.value) // aircraft angle change

          this.backflapAngleOnScreen.push(nextBfa.value)
          this.flapAngle = Number(nextBfa.value)

          setTimeout(tout, this.speed)
        }
      }
      setTimeout(tout, this.speed)
    },
    radToDeg(radians) {
      return radians * (180 / Math.PI)
    },
    degToRad(degrees) {
      return degrees / (180 / Math.PI)
    },
    randomIntFromInterval(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  }
}
</script>