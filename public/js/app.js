import * as Vue from "./vue.js";
import focusPic from "./image_modal.js";

const app = Vue.createApp({
    data() {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
            pics: [],
            clickedPicId: 0,
            inputError: "",
        };
    },
    components: {
        "focus-on-pic": focusPic,
    },
    mounted: function () {
        fetch("/pics.json/:0")
            .then(res => res.json())
            .then(picsData => {
                this.pics = picsData;
            })
            .catch(err =>
                console.log(`fetch pics failed with: ${err}`)
            );
    },
    methods: {
        selectFile: function (e) {
            this.file = e.target.files[0];
        },
        upload: function (e) {
            const fd = new FormData();
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            fd.append("file", this.file);

            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then(res => res.json())
                .then(uploadData => {
                    this.pics.unshift(uploadData);
                })
                .catch(err => {
                    console.log(
                        `fetch upload data failed with: ${err}`
                    );
                    this.inputError = "Fill in required fields";
                });
        },
        //TODO check user input
        checkFile: function (e) {
            console.log("e :>> ", e);
        },
        showImgModule: function (e) {
            console.log(`img with id ${e.target.id} clicked`);
            this.clickedPicId = e.target.id;
        },
        hideImgModule: function () {
            this.clickedPicId = 0;
        },
    },
});

app.mount("#main");
