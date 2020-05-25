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
                    <form @submit.prevent="submitForm" class="mb--2">
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">{{ $t('ballbeam.problem') }}</label>
                            <input class="form-control" id="exampleFormControlTextarea1" type="text" v-model="r" name="r" :placeholder="$t('ballbeam.placeholder')" />
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">{{ $t('home.calculate') }}</button>
                    </form>
                    <!-- {{position}} -->
                                <!-- {{anglePendulum}} -->

                </div>
            </div>
            <div class="row mb--2">
                <div class="col-2">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="graphCheck" v-model="showGraph" />
                        <label class="form-check-label" for="graphCheck">{{ $t('cas.graph') }}</label>
                    </div>
                </div>
                <div class="col-2">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="simCheck" v-model="showSim" />
                        <label class="form-check-label" for="simCheck">{{ $t('cas.simulation') }}</label>
                    </div>
                </div>
            </div>
            <div class="row mb--2">
                <div class="col">
                    <div class="form-group">
                        <label for="dataflowSpeed">{{ $t('cas.duration') }}</label>
                        <input type="range" class="form-control-range" id="dataflowSpeed" min="1" max="500" v-model="speed" />
                        <!-- {{animationDuration}} s -->
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid result">
            <div class="row justify-content-md-center">
                <div class="col-md-6" v-show="showGraph">
                    <div class="result__box">
                        <line-chart :chart-data="datacollection" :options="graphOptions"></line-chart>
                    </div>
                </div>
                <div class="col-md-6" v-show="showSim">
                    <!-- width="1000" height="750" -->
                    <div class="result__box">
                        <div class="canvas-wrapper" id="canvas-wrapper">
                            <canvas id="ballbeamCanvas" class="canvas"></canvas> 
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="row" v-show="showSim">
                
            </div> -->
        </div>
    </section>
</template>

<script>
import axios from "axios";
import LineChart from "./graphs/Graph.js";

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


            showGraph: true,
            showSim: true,

            speed: 100,
            r: 0,
            yMax: 0,
            yMin: null
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
            return  {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMax: this.yMax,
                            suggestedMin: this.yMin
                        }
                    }]
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
                datasets: [{
                        fill: false,
                        label: this.$t('airplane.dataone'),
                        backgroundColor: "#f82599",
                        borderWidth: 3,
                        borderColor: "#f82599",
                        data: this.positionOnScreen
                    },
                ]
            };
        },
        labels() {
            let time = []
            for (let x = 0; x <= 5.01; x += 0.01) {
                time.push(Math.round((x + Number.EPSILON) * 100) / 100)
            }
            return time
        },
    },
    methods: {
        submitForm() {
            // let lastPosition = 0
            // let lastDegree = 0

            // if (this.pendulumZero === 0) 
            //     this.pendulumZero = this.pendulum.left

            // if (this.position.length)
            //     lastPosition = this.position[this.position.length - 1]
            // if (this.anglePendulum.length)
            //     lastDegree = this.anglePendulum[this.anglePendulum.length - 1]
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

                    this.yMax = Math.max.apply(Math,this.position)
                    this.yMin = Math.min.apply(Math,this.position)

                    this.appendOnScreenData()
                })
                .catch(error => {
                    console.log(error.response.data);
                });
        },
        appendOnScreenData() {
            let tout = () => {
                const nextPos = this.pos.next(); // next value 
                const nextPen = this.pen.next();
                
                if (!nextPos.done) { // done = true when the end of array reached
                    this.positionOnScreen.push(nextPos.value) // concatenate word to the string
                    // this.aircraftAngle = Number(nextPos.value); // aircraft angle change
                    // this.pendulumPosition = Number(nextPos.value)

                    this.angleOnScreen.push(nextPen.value)
                    // this.flapAngle = Number(nextPen.value);
                    // this.stickAngle = Number(nextPen.value)
                    
                    setTimeout(tout, this.speed);
                }
            }
            setTimeout(tout, this.speed);
        },
    }
}
</script>