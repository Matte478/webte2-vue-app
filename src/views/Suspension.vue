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
                        <label for="exampleFormControlTextarea1">
                            {{ 
                                $t('suspension.problem') 
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
import { fabric } from "fabric"
import LineChart from "./graphs/Graph.js"

export default {
    components: {
        LineChart
    },
    data() {
        return {
            inputRange: {
                min: -30,
                max: 30
            },

            r: 0,
            speed: 50,
            wheelAnimDuration: 1000,
            yMin: 0,
            yMax: 0,

            carPosition: [],
            wheelPosition: [],
            carPositionOnScreen: [],
            wheelPositionOnScreen: [],
            lastPosition: [],


            showGraph: true,
            showSim: true,

            imgsLoaded: 0,
            imgs: {},

            carTop: 0,
            wheelTop: 0,
            carTopOrigin: 0,
            wheelTopOrigin: 0,
            spinnersTopOrigin: 0,

            canvas: null,
            car: null,
            wheel: null,
            wwBrakes: null,
            hill: null,
            hole: null,
            spinners: null

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
                    label: this.$t("suspension.dataone"),
                    backgroundColor: "#f82599",
                    borderWidth: 3,
                    borderColor: "#f82599",
                    data: this.carPositionOnScreen
                },
                {
                    fill: false,
                    label: this.$t("suspension.datatwo"),
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
        },
        animationDuration() {
            return Math.round((this.speed * 0.201 + Number.EPSILON) * 100) / 100
        },
    },
    watch: {
        wheelTop() {
            this.wwBrakes.set({
                top: this.wheelTopOrigin + this.wheelTop
            })

            this.car.set({
                top: this.carTopOrigin + this.carTop
            })

            this.spinners.set({
                top: this.spinnersTopOrigin + this.wheelTop
            })

            window.requestAnimationFrame(() => {
                this.canvas.renderAll()
            })
        },
        imgsLoaded() {
            if (this.imgsLoaded === 5) this.carCallback(this.imgs)
        }
    },
    mounted() {
        this.resizeCanvas()

        this.canvas = new fabric.StaticCanvas("suspensionCanvas")
        this.canvas.set({
            backgroundColor: "#cce6ff"
        })
    
        fabric.Image.fromURL(
            require("../assets/images/jeep_crashtest.png"),
            img => {
                this.imgs.car = img
                this.imgsLoaded++
            }
        )

        fabric.Image.fromURL(
            require("../assets/images/patresova_hlava.png"),
            img => {
                this.imgs.patres = img
                this.imgsLoaded++
            }
        )

        fabric.Image.fromURL(
            require("../assets/images/brakes.png"),
            img => {
                this.imgs.brakes = img
                this.imgsLoaded++
            }
        )

        fabric.Image.fromURL(
            require("../assets/images/wheel_offroad.png"),
            img => {
                this.imgs.wheel = img
                this.imgsLoaded++
            }
        )

        fabric.Image.fromURL(
            require("../assets/images/crashtest_tape_v2.png"),
            img => {
                this.imgs.tape = img
                this.imgsLoaded++
            }
        )

    },
    methods: {
        carCallback() {
            let ground = new fabric.Rect({
                centeredRotation: false,
                originX: "left",
                originY: "top",
                width: 1110 + 80,
                height: 400,
                left: - 40,
                top: 1110 - 300,
                stroke: 'black',
                strokeWidth: 40
            })
            ground.setGradient("fill", {
                x1: 0, //* 0.4
                y1: 0, //ball.height * 0.6
                x2: 0,
                y2: ground.height,
                colorStops: {
                    0: "#D3D3D3",
                    1: "#57606F"
                }
            })
            let tape = this.imgs.tape
            tape.set({
                top: 1110 - 300,
                left: 35
            })

            let emptySpot = new fabric.Rect({
                width: 280,
                height: 400,
                top: 1110 - 305,
                left: 310,
            })
            emptySpot.setGradient('fill', {
                x1: 0, //* 0.4
                y1: emptySpot.height * 0.15, 
                x2: 0,
                y2: emptySpot.height,
                colorStops: {
                    0: "#cce6ff",
                    1: "#57606F"
                }
            })


            let leftBelt = new fabric.Rect({
                height: 400,
                width: 15,
                top: 1110 - 300,
                left: 310,
                fill: 'black'
            })
            let rightBelt = fabric.util.object.clone(leftBelt)
            rightBelt.set({
                left: 575
            })

            let groundGroup = new fabric.Group([ground, tape, emptySpot, leftBelt, rightBelt])

            let leftSpinner = new fabric.Circle({
                centeredRotation: false,
                originX: "center",
                originY: "center",
                radius: 55,
                top: 843,
                left: 383,
                stroke: 'grey'
            })
            leftSpinner.setGradient("fill", {
                x1: leftSpinner.width, //* 0.4
                y1: leftSpinner.height * 0.5, //ball.height * 0.6
                x2: leftSpinner.width * 0.5,
                y2: leftSpinner.height,
                colorStops: {
                    0: "#D3D3D3",
                    1: "#57606F"
                }
            })

            let rightSpinner = fabric.util.object.clone(leftSpinner)
            rightSpinner.set({
                left: 520
            })

            let spinnerCage = new fabric.Rect({
                width: 260,
                height: 100,
                top: 830,
                left: 320,
                stroke: 'grey',
                strokeWidth: 2
            })
            spinnerCage.setGradient("fill", {
                x1: 0, //* 0.4
                y1: 0, //ball.height * 0.6
                x2: 0,
                y2: spinnerCage.height,
                colorStops: {
                    0: "#D3D3D3",
                    1: "#57606F"
                }
            })


            this.spinners = new fabric.Group([leftSpinner, rightSpinner, spinnerCage], {
                objectCaching: false
            })


            let chasis = this.imgs.car
            chasis.scaleToWidth(1665)
            chasis.set({
                left: 0,
                top: 0
            })

            let brakes = this.imgs.brakes
            brakes.scaleToWidth(brakes.width * 1.5)
            brakes.set({
                centeredRotation: false,
                originX: "center",
                originY: "center",
                top: 592,
                left: 453
            })
            
            this.wheel = this.imgs.wheel
            this.wheel.scaleToWidth(this.wheel.width * 1.6)
            this.wheel.set({
                centeredRotation: false,
                originX: "center",
                originY: "center",
                top: 592, //395, 405
                left: 453
            })

            let patres = this.imgs.patres
            patres.scaleToWidth(patres.width * 0.4)
            patres.set({
                top: 183,
                left: 720
            })

            this.wwBrakes = new fabric.Group([brakes, this.wheel], {
                centeredRotation: false,
                originX: "center",
                originY: "bottom",
                objectCaching: false
            })

            this.car = new fabric.Group([patres, chasis, this.wwBrakes], {
                centeredRotation: false,
                originX: "center",
                originY: "bottom",
                top: groundGroup.top + 5,
                objectCaching: false
            })

            let masterGroup = new fabric.Group([groundGroup, this.car, this.spinners])
            let masterGroupRatio = masterGroup.width / 1110
            masterGroup.scaleToWidth(this.canvas.width * masterGroupRatio)
            this.canvas.add(masterGroup)

            this.carTopOrigin = this.car.top
            this.wheelTopOrigin = this.wwBrakes.top
            this.spinnersTopOrigin = this.spinners.top
        },
        animateWheel() {
            let duration  = (this.animationDuration + 50) * 1000
            this.wheel.animate("angle", '+=7000', {
                onChange: () => {
                    window.requestAnimationFrame(() => {
                        this.canvas.renderAll()
                    })
                },
                duration: duration,
                easing: fabric.util.ease.easeOutElastic
            })
        },
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
                    r: -this.r,
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
                    this.carPositionOnScreen.push(nextPen.value) // concatenate word to the string
                    this.carTop = Number(nextPen.value)

                    this.wheelPositionOnScreen.push(nextPos.value)
                    this.wheelTop = Number(nextPos.value)
                    
                    setTimeout(tout, this.speed)
                }
            }
            setTimeout(tout, this.speed)
            this.animateWheel()
        },
        resizeCanvas() {
            let wrapper = document
                .getElementById("canvas-wrapper")
                .getBoundingClientRect()
            let htmlCanvas = document.getElementById("suspensionCanvas")

            htmlCanvas.width = wrapper.width
            htmlCanvas.height = wrapper.height
        },
    }
}
</script>