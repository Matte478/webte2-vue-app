<template>
  <section class="section">
    <div class="container">
      <div class="row">
        <div class="col">
          <h2 class="section__title">{{ $t('ballbeam.title') }}</h2>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <form
            @submit.prevent="submitForm"
            class="mb--2"
          >
            <div class="form-group">
              <label for="exampleFormControlTextarea1">{{ $t('ballbeam.problem') }}</label>
              <input
                class="form-control"
                id="exampleFormControlTextarea1"
                type="text"
                v-model="r"
                name="r"
                :placeholder="$t('ballbeam.placeholder')"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-block"
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
              min="1"
              max="500"
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
            ></line-chart>
          </div>
        </div>
        <div
          class="col-md-6"
          v-show="showSim"
        >
          <div class="result__box">
            <!-- <div
              class="canvas-wrapper"
              id="canvas-wrapper"
            >
              <canvas
                id="ballbeamCanvas"
                class="canvas"
              ></canvas>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col">
           <div
              class="canvas-wrapper"
              id="canvas-wrapper"
            >
              <canvas
                id="ballbeamCanvas"
                class="canvas"
              ></canvas>
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
      angle: [],
      position: [],
      positionOnScreen: [],
      angleOnScreen: [],
      lastX: [],

      showGraph: false, // true
      showSim: true,

      speed: 100,
      r: 0,
      yMax: 0,
      yMin: null,

      beamAngle: 0,
      ballPos: 0,

      canvas: null,
      beam: null,
      ball: null,
      gear: null
    }
  },
  computed: {
    pos() {
      return this.position[Symbol.iterator]() // convenient for yeilding values
    },
    pen() {
      return this.angle[Symbol.iterator]()
    },
    graphOptions() {
      return {
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMax: this.yMax,
                suggestedMin: this.yMin
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
    animationDuration() {
      return Math.round((this.speed * 0.201 + Number.EPSILON) * 100) / 100
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
            data: this.positionOnScreen
          }
        ]
      }
    },
    labels() {
      let time = []
      for (let x = 0; x <= 5.01; x += 0.01) {
        time.push(Math.round((x + Number.EPSILON) * 100) / 100)
      }
      return time
    },
    beamAngleDegrees() {
      return this.radToDeg(this.beamAngle)
    },
    // beamMiddle() {
    //   return this.canvas.width / 2 
    // }
  },
  watch: {
    beamAngle() { //newValue, oldValue
      // if (newValue.toFixed(3) == oldValue.toFixed(3)) return

      this.beam.set({
        angle: this.beamAngleDegrees
      })
      
      fabric.util.requestAnimFrame(() => {
        this.canvas.renderAll()
      })
    },
    ballPos() {
      // if (newValue.toFixed(1) == oldValue.toFixed(1)) return

      // console.log(newValue, oldValue)

      this.ball.set({
        left: this.ballPos
      })
      this.gear.set({
        angle: this.ball.left
      })

      // console.log(this.ball.left)

      fabric.util.requestAnimFrame(() => {
        this.canvas.renderAll()
      })
    }
  },
  mounted() {
    this.resizeCanvas()

    this.canvas = new fabric.StaticCanvas("ballbeamCanvas")
    this.canvas.set({
      backgroundColor: "#cce6ff" //#cce6ff
    })
    // this.beamMiddle = this.canvas.width / 2

    fabric.Image.fromURL(
      require("../assets/images/gear_green.png"),
      img => {
        this.gear = img
        this.imgCallback()
      }
    )
  },
  methods: {
    submitForm() {
      axios
        .get("/ballbeam", {
          params: {
            r: this.r,
            lr1: this.lastX[0],
            lr2: this.lastX[1],
            lr3: this.lastX[2],
            lr4: this.lastX[3]
          }
        })
        .then(response => {
          let data = response.data.data

          this.positionOnScreen = []
          this.angleOnScreen = []

          this.position = data.position
          this.angle = data.angle
          this.lastX = data.lastX

          this.yMax = Math.max.apply(Math, this.position)
          this.yMin = Math.min.apply(Math, this.position)

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
          this.positionOnScreen.push(nextPos.value) // concatenate word to the string
          this.ballPos = Number(nextPos.value)

          this.angleOnScreen.push(nextPen.value)
          this.beamAngle = Number(nextPen.value)

          setTimeout(tout, this.speed)
        }
      }
      setTimeout(tout, this.speed)
    },
    resizeCanvas() {
      let wrapper = document
        .getElementById("canvas-wrapper")
        .getBoundingClientRect()
      let htmlCanvas = document.getElementById("ballbeamCanvas")

      htmlCanvas.width = wrapper.width
      htmlCanvas.height = wrapper.height
    },
    imgCallback() {

      let triangle = new fabric.Triangle({
        centeredRotation: false,
        originX: "center",
        originY: "bottom",
        width: 110, 
        height: 240, 
        fill: 'black', 
        left: this.canvas.width / 2, 
        top: this.canvas.width,
      })
      // triangle.setGradient("fill", {
      //   x1: triangle.width,
      //   y1: 0,
      //   x2: 0,
      //   y2: triangle.height,
      //   colorStops: {
      //     0: "#7F8C8D",
      //     1: "#000000"
      //   }
      // })

      let pole = new fabric.Rect({
        width: 1000,
        height: 15,
        stroke: "#C3CBDC", //#C3CBDC
        left: 55,
        top: 900
      })
      // pole.setGradient("fill", {
      //   x1: 0,
      //   y1: 0,
      //   x2: 0,
      //   y2: pole.height,
      //   colorStops: {
      //     0: "#EDF1F4",
      //     1: "#C3CBDC"
      //   }
      // })

      let poleStopperRight = new fabric.Rect({
        centeredRotation: false,
        originX: "center",
        originY: "center",
        width: 15,
        height: 50,
        fill: "black",
        left: pole.width + 55,
        top: 902,
        // rx: 5,
        // ry: 5
      })
      let poleStopperLeft = new fabric.Rect({
        centeredRotation: false,
        originX: "center",
        originY: "center",
        width: 15,
        height: 50,
        fill: "black",
        left: pole.left,
        top: 902,
        // rx: 5,
        // ry: 5
      })

      this.ball = new fabric.Circle({
        centeredRotation: false,
        originX: "center",
        originY: "bottom",
        top: 907.5,
        left: 555,
        radius: 30,
        // fill: 'lightGrey',
        stroke: "#C3CBDC"
      })
      // this.ball.setGradient("fill", {
      //   x1: this.ball.width, //* 0.4
      //   y1: 0, //ball.height * 0.6
      //   x2: 0,
      //   y2: this.ball.height,
      //   colorStops: {
      //     0: "#EDF1F4",
      //     1: "#C3CBDC"
      //   }
      // })

      let screw = new fabric.Circle({
        centeredRotation: false,
        originX: "center",
        originY: "center",
        top: pole.top + 8,
        left: pole.width / 2 + 55,
        radius: 6,
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

      this.gear.set({
        centeredRotation: false,
        originX: "center",
        originY: "center",
        top: screw.top + 50,
        left: screw.left - 15
      })
      this.gear.scaleToWidth(screw.width * 5)

      this.beam = new fabric.Group([this.ball, pole, poleStopperRight, poleStopperLeft], {
        centeredRotation: false,
        originX: "center",
        originY: "bottom",
      })
      
      let mainGroup = new fabric.Group([this.beam, triangle, screw, this.gear], {
        centeredRotation: false,
        originX: "center",
        originY: "bottom",
        top: this.canvas.width,
        left: this.canvas.width / 2
      })
      mainGroup.scaleToWidth(this.canvas.width * 0.925)
      // this.ball.set({
      //   left: this.ball.left + 200
      // }) 

      // this.beam.set({
      //   angle: 20
      // })
      this.canvas.add(this.ball)
      this.canvas.add(pole)
      this.canvas.add(poleStopperRight)
      this.canvas.add(poleStopperLeft)
      this.canvas.add(this.beam)
      this.canvas.add(triangle)
      this.canvas.add(screw)
      this.canvas.add(this.gear)
 
      this.canvas.add(mainGroup)
    },
    radToDeg(radians) {
      return radians * (180 / Math.PI)
    } 
  }
}
</script>