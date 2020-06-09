<template>
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="section__title">{{ $t('pendulum.title') }}</h1>
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
                  $t('pendulum.problem')
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
                :placeholder="$t('pendulum.placeholder')"
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
          v-show="showGraph"
        >
          <div class="result__box">
            <line-chart
              :chart-data="datacollection"
              :options="graphOptions"
              class="card"
            ></line-chart>
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
                id="pendulumCanvas"
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
import LineChart from "./graphs/Graph.js"
import { fabric } from "fabric"

export default {
  components: {
    LineChart
  },
  data() {
    return {
      inputRange: {
        min: -350,
        max: 350
      },

      position: [],
      anglePendulum: [],

      r: 0,
      speed: 50,

      yMax: 0,
      yMin: 0,

      positionOnScreen: [],
      anglePendulumOnScreen: [],

      showGraph: true,
      showSim: true,

      pendulumPosition: 0,
      stickAngle: 0,

      canvas: null,
      imgsLoaded: 0,
      imgs: {},
      pendulum: null,
      stick: null,
      pendulumZero: 0
    }
  },
  computed: {
    graphOptions() {
      return {
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: this.yMin,
                suggestedMax  : this.yMax
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
    pos() {
      return this.position[Symbol.iterator]() // convenient for yeilding values
    },
    pen() {
      return this.anglePendulum[Symbol.iterator]()
    },
    animationDuration() {
      return Math.round((this.speed * 0.201 + Number.EPSILON) * 100) / 100
    },
    datacollection() {
      return {
        labels: this.labels,
        datasets: [
          {
            fill: false,
            label: this.$t("pendulum.dataone"),
            backgroundColor: "#f82599",
            borderWidth: 3,
            borderColor: "#f82599",
            data: this.positionOnScreen
          },
          {
            fill: false,
            label: this.$t("pendulum.datatwo"),
            backgroundColor: "#f87979",
            stroke: "#f87979",
            borderWidth: 3,
            borderColor: "#f87979",
            data: this.anglePendulumOnScreen
          }
        ]
      }
    },
    labels() {
      let time = []
      for (let x = 0; x <= 10.05; x += 0.05) {
        time.push(Math.round((x + Number.EPSILON) * 100) / 100)
      }
      return time
    }
  },
  watch: {
    imgsLoaded() {
      if (this.imgsLoaded == 3) this.pendulumCallback()
    },
    pendulumPosition() {
      this.pendulum.item(2).angle = this.pendulum.left

      this.pendulum.set({
        left: this.pendulumZero + this.pendulumPosition
      })

      this.stick.set({
        angle: this.stickAngle
      })

      window.requestAnimationFrame(() => {
        this.canvas.renderAll()
      })
    }
  },
  mounted() {
    this.resizeCanvas()
    this.canvas = new fabric.StaticCanvas("pendulumCanvas")
    this.canvas.set({
      backgroundColor: "#cce6ff" //#cce6ff
    })

    fabric.Image.fromURL(
      require("../assets/images/pendulum_stick_short.png"),
      img => {
        this.imgs.stick = img
        this.imgsLoaded++
      }
    )

    fabric.Image.fromURL(require("../assets/images/gear_green.png"), img => {
      this.imgs.greenGear = img
      this.imgsLoaded++
    })

    fabric.Image.fromURL(require("../assets/images/gear_red.png"), img => {
      this.imgs.redGear = img
      this.imgsLoaded++
    })
  },
  methods: {
    submitForm() {
      let lastPosition = 0
      let lastDegree = 0

      if (this.pendulumZero === 0) this.pendulumZero = this.pendulum.left

      if (this.position.length)
        lastPosition = this.position[this.position.length - 1]
      if (this.anglePendulum.length)
        lastDegree = this.anglePendulum[this.anglePendulum.length - 1]
      axios
        .get("/pendulum", {
          params: {
            r: this.r,
            startPosition: lastPosition,
            startDegree: lastDegree
          }
        })
        .then(response => {
          let data = response.data.data
          let yMax = 0
          let yMin = null
          this.positionOnScreen = []
          this.anglePendulumOnScreen = []

          this.position = data.position
          this.anglePendulum = data.anglePendulum

          if (Math.max.apply(Math, this.position) > yMax)
            yMax = Math.max.apply(Math, this.position)
          if (Math.max.apply(Math, this.anglePendulum) > yMax)
            yMax = Math.max.apply(Math, this.anglePendulum)

          if (!yMin || Math.min.apply(Math, this.position) < yMin)
            yMin = Math.min.apply(Math, this.position)
          if (!yMin || Math.min.apply(Math, this.anglePendulum) < yMin)
            yMin = Math.min.apply(Math, this.anglePendulum)

          this.yMax = yMax
          this.yMin = yMin

          this.appendOnScreenData()
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    appendOnScreenData() {
      let tout = () => {
        const nextPos = this.pos.next() // next value
        const nextPen = this.pen.next()

        if (!nextPos.done) {
          // done = true when the end of array reached
          this.positionOnScreen.push(nextPos.value) // concatenate word to the string
          this.pendulumPosition = Number(nextPos.value)

          this.anglePendulumOnScreen.push(nextPen.value)
          this.stickAngle = Number(nextPen.value)

          setTimeout(tout, this.speed)
        }
      }
      setTimeout(tout, this.speed)
    },
    resizeCanvas() {
      let wrapper = document
        .getElementById("canvas-wrapper")
        .getBoundingClientRect()
      let htmlCanvas = document.getElementById("pendulumCanvas")

      htmlCanvas.width = wrapper.width
      htmlCanvas.height = wrapper.height
    },
    pendulumCallback() {
      let canvasWidth = this.canvas.width

      let leftLeg = new fabric.Rect({
        width: 55.5,
        height: 166.5,
        stroke: "black",
        left: 0,
        top: 943.5
      })
      leftLeg.setGradient("fill", {
        x1: 0,
        y1: 0,
        x2: leftLeg.width,
        y2: 0,
        colorStops: {
          0.3: "#000000",
          1: "#7f8c8d"
        }
      })

      let rightLeg = new fabric.Rect({
        width: 55.5,
        height: 166.5,
        stroke: "black",
        left: 1054.5,
        top: 943.5
      })
      rightLeg.setGradient("fill", {
        x1: 0,
        y1: 0,
        x2: rightLeg.width,
        y2: 0,
        colorStops: {
          0.3: "#000000",
          1: "#7f8c8d"
        }
      })

      let pole = new fabric.Rect({
        width: 1054.5,
        height: 11.1,
        stroke: "#C3CBDC", //#C3CBDC
        left: 27.75,
        top: 937.95
      })
      pole.setGradient("fill", {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: pole.height,
        colorStops: {
          0: "#EDF1F4",
          1: "#C3CBDC"
        }
      })

      this.stick = this.imgs.stick
      this.stick.set({
        centeredRotation: false,
        originX: "center",
        originY: "bottom",
        top: 910,
        left: 533 //1110 / 2 - stick.width / 2
      })
      this.stick.scaleToWidth(1110 * 0.08)

      let screw = new fabric.Circle({
        centeredRotation: false,
        originX: "center",
        originY: "center",
        top: this.stick.top,
        left: this.stick.left - 3,
        radius: 10,
        // fill: 'lightGrey',
        stroke: "grey"
      })
      screw.setGradient("fill", {
        x1: screw.width * 0.4,
        y1: screw.height * 0.6,
        x2: screw.width,
        y2: screw.height * 0.3,
        colorStops: {
          0: "#C3CBDC",
          1: "#EDF1F4"
        }
      })

      let cart = new fabric.Rect({
        width: 120,
        height: 100,
        top: 880,
        left: 470,
        stroke: "black"
      })
      cart.setGradient("fill", {
        x1: 0,
        y1: 0,
        x2: cart.width,
        y2: 0,
        colorStops: {
          0.5: "#000000",
          1: "#7f8c8d"
        }
      })

      let gear = this.imgs.greenGear
      gear.set({
        centeredRotation: false,
        originX: "center",
        originY: "center",
        left: 480,
        top: 950
      })
      gear.scaleToWidth(cart.width * 0.5)

      let gearScrew = new fabric.Circle({
        centeredRotation: false,
        originX: "center",
        originY: "center",
        left: 480,
        top: 950,
        radius: 4,
        stroke: "grey"
      })
      gearScrew.setGradient("fill", {
        x1: gearScrew.width * 0.4,
        y1: gearScrew.height * 0.6,
        x2: gearScrew.width,
        y2: gearScrew.height * 0.3,
        colorStops: {
          0: "#C3CBDC",
          1: "#EDF1F4"
          // 1: "#000000"
        }
      })

      this.pendulum = new fabric.Group(
        [cart, this.stick, gear, gearScrew, screw],
        {
          centeredRotation: false,
          originX: "center",
          originY: "bottom"
        }
      )

      let mainGroup = new fabric.Group(
        [pole, leftLeg, rightLeg, this.pendulum],
        {
          centeredRotation: false,
          originX: "center",
          originY: "bottom",
          top: canvasWidth,
          left: canvasWidth / 2
        }
      )
      mainGroup.scaleToWidth(canvasWidth)
      this.canvas.add(mainGroup)
    }
  }
}
</script>