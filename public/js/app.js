import * as Vue from "./vue.js";

const app = Vue.createApp({
    data() {
        return {
            name: "rue",
            pics: [],
        };
    },
    mounted: function () {
        fetch("/pics.json")
            .then(res => res.json())
            .then(picsData => {
                this.pics = picsData;
            })
            .catch(err => `fetch pics failde with: ${err}`);
    },
    methods: {
        testMethod: function () {
            console.log("test method output", "color: #26bfa5;");
        },
    },
});

app.mount("#main");
