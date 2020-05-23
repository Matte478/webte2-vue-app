<template>
    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col">
                    <h2 class="section__title">{{ $t('pendulum.title') }}</h2>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <form @submit.prevent="submitForm" class="mb--2">
                        <div class="form-group">
                            <label for="exampleFormControlTextarea1">{{ $t('pendulum.problem') }}</label>
                            <input class="form-control" id="exampleFormControlTextarea1" type="text" v-model="r" name="r" :placeholder="$t('pendulum.placeholder')" />
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
                        {{animationDuration}} s
                    </div>
                </div>
            </div>
            <div class="row" v-if="showGraph">
                <div class="col">
                    <div class="small">
                        <line-chart :chart-data="datacollection" :options="graphOptions"></line-chart>
                    </div>
                </div>
            </div>
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
            position: [],
            anglePendulum: [],

            r: 0,
            speed: 100,

            yMax: 0,

            positionOnScreen: [],
            anglePendulumOnScreen: [],

            showGraph: true,
            showSim: true,
        }
    },
    computed: {
        graphOptions() {
            return  {
                scales: {
                     yAxes: [{
                        ticks: {
                            // suggestedMin: 50,
                            suggestedMax: this.yMax
                }
            }]
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
            return Math.round(((this.speed * 0.201) + Number.EPSILON) * 100) / 100
        },
        datacollection() {
            return {
                labels: this.labels,
                datasets: [{
                        fill: false,
                        label: this.$t('airplane.dataone'),
                        backgroundColor: "#f82599",
                        data: this.positionOnScreen
                    },
                    {
                        fill: false,
                        label: this.$t('airplane.datatwo'),
                        backgroundColor: "#f87979",
                        stroke: "#f87979",
                        data: this.anglePendulumOnScreen
                    }
                ]
            };
        },
        labels() {
            let time = []
            for (let x = 0; x <= 10.05; x += 0.05) {
                time.push(Math.round((x + Number.EPSILON) * 100) / 100)
            }
            return time
        },
    },
    methods: {
        submitForm() {
            let lastPosition = 0;
            let lastDegree = 0; 
            if (this.position.length)
                lastPosition = this.position[this.position.length - 1];
            if (this.anglePendulum.length)
                lastDegree = this.anglePendulum[this.anglePendulum.length - 1];
            axios
                .get("/pendulum", {
                    params: {
                        r: this.r,
                        startPosition: lastPosition,
                        startDegree: lastDegree,
                    }
                })
                .then(response => {
                    let data = response.data.data;
                    let yMax = 0;
                    this.positionOnScreen = [];
                    this.anglePendulumOnScreen = [];

                    this.position = data.position;
                    this.anglePendulum = data.anglePendulum;

                    if (Math.max.apply(Math,this.position) > yMax)
                        yMax = Math.max.apply(Math,this.position);
                    if (Math.max.apply(Math,this.anglePendulum) > yMax)
                        yMax = Math.max.apply(Math,this.anglePendulum);

                    this.yMax = yMax;
                    this.appendOnScreenData();
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
                    this.positionOnScreen.push(nextPos.value); // concatenate word to the string
                    // this.aircraftAngle = Number(nextPos.value); // aircraft angle change

                    this.anglePendulumOnScreen.push(nextPen.value);
                    // this.flapAngle = Number(nextPen.value);
                    
                    setTimeout(tout, this.speed);
                }
            }
            setTimeout(tout, this.speed);
        },
    }
}
</script>

<style lang="scss" scoped>

.form-control-range {
    direction:rtl;
}

</style>>