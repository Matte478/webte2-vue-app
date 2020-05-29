<template>
    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h2 class="section__title">{{ $t('suspension.title') }}</h2>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <form
                        @submit.prevent="submitForm"
                        class="mb--2"
                    >
                        <div class="form-group">
                        <label for="exampleFormControlTextarea1">{{ $t('suspension.problem') }}</label>
                        <input
                            class="form-control"
                            id="exampleFormControlTextarea1"
                            type="number"
                            step="any"
                            min="-350"
                            max="350"
                            v-model="r"
                            name="r"
                            :placeholder="$t('suspension.placeholder')"
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
                        <!-- {{animationDuration}} s -->
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
                <div
                class="canvas-wrapper"
                id="canvas-wrapper"
                >
                    <canvas
                        id="suspensionCanvas"
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

export default {
    components: {
        LineChart
    },
    data() {
        return {
            r: 0,
            speed: 100,
            yMin: 0,
            yMax: 0,

            carPosition: [],
            wheelPosition: [],
            carPositionOnScreen: [],
            wheelPositionOnScreen: [],
            lastPosition: [],

            showGraph: true,
            showSim: true,


        }
    },
    computed: {
        pos() {
            return this.carPosition[Symbol.iterator]() // convenient for yeilding values
        },
        pen() {
            return this.wheelPosition[Symbol.iterator]()
        },
        graphOptions() {
            return {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                suggestedMin: this.yMin,
                                suggestedMax: this.yMax
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
                    data: this.carPositionOnScreen
                },
                {
                    fill: false,
                    label: this.$t("airplane.datatwo"),
                    backgroundColor: "#f87979",
                    stroke: "#f87979",
                    borderWidth: 3,
                    borderColor: "#f87979",
                    data: this.wheelPositionOnScreen
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
        }
    },
    methods: {
        submitForm() {
            let lastinitX1 = 0
            let lastinitX1d = 0
            let lastinitX2 = 0
            let lastinitX2d = 0
            let lastinitX3 = 0

            if (this.lastPosition.length){
                lastinitX1 = this.lastPosition[0]
                lastinitX1d = this.lastPosition[1]
                lastinitX2 = this.lastPosition[2]
                lastinitX2d = this.lastPosition[3]
                lastinitX3 = this.lastPosition[4]
            }
            axios
                .get("/suspension", {
                params: {
                    r: this.r,
                    initX1: lastinitX1,
                    initX1d: lastinitX1d,
                    initX2: lastinitX2,
                    initX2d: lastinitX2d,
                    initX3: lastinitX3,
                }
                })
                .then(response => {
                let data = response.data.data
                let yMax = 0
                let yMin = null
                this.carPositionOnScreen = []
                this.wheelPositionOnScreen = []


                this.carPosition = data.carPosition
                this.wheelPosition = data.wheelPosition
                this.lastPosition = data.lastPosition

                if (Math.max.apply(Math, this.carPosition) > yMax)
                    yMax = Math.max.apply(Math, this.carPosition)
                if (Math.max.apply(Math, this.wheelPosition) > yMax)
                    yMax = Math.max.apply(Math, this.wheelPosition)

                if (!yMin || Math.min.apply(Math, this.carPosition) < yMin)
                    yMin = Math.min.apply(Math, this.carPosition)
                if (!yMin || Math.min.apply(Math, this.wheelPosition) < yMin)
                    yMin = Math.min.apply(Math, this.wheelPosition)

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
            this.carPositionOnScreen.push(nextPos.value) // concatenate word to the string
            // this.pendulumPosition = Number(nextPos.value)

            this.wheelPositionOnScreen.push(nextPen.value)
            // this.stickAngle = Number(nextPen.value)

            setTimeout(tout, this.speed)
            }
        }
        setTimeout(tout, this.speed)
        },
    }
}
</script>