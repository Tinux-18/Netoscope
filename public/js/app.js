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
            lastPic: 0,
            clickedPicId: location.pathname.slice(1),
            inputError: "",
            errorStyle: "",
            lowestId: 0,
        };
    },
    components: {
        "focus-on-pic": focusPic,
    },
    mounted: function () {
        this.getPics();

        let intervalId = window.setInterval(() => {
            this.infiniteScroll(intervalId);
        }, 1000);

        document.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                this.hideImgModule();
            }
        });

        window.addEventListener("popstate", e => {
            this.clickedPicId = location.pathname.slice(1);
        });
    },
    methods: {
        selectFile: function (e) {
            this.file = e.target.files[0];
        },
        upload: function () {
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
                    this.inputError = "";
                    this.errorStyle = "";
                    this.pics.unshift(uploadData);
                })
                .catch(err => {
                    console.log(
                        `fetch upload data failed with: ${err}`
                    );
                    this.inputError = "Fill in required fields";
                    this.errorStyle =
                        "background-color: rgb(216, 99, 158)";
                });
        },
        getPics: function () {
            fetch(`/pics.json/:0:${this.lastPic}`)
                .then(res => res.json())
                .then(picsData => {
                    if (this.pics.length > 0) {
                        console.log("should push");
                        this.pics.push(...picsData);
                    } else {
                        this.pics = picsData;
                    }

                    this.lastPic = picsData[picsData.length - 1].id;
                    this.lowestId =
                        picsData[picsData.length - 1].lowestId;
                    console.log("lastPic :>> ", this.lastPic);
                    console.log("lowestId :>> ", this.lowestId);
                    console.log("this.pics.lenght :>> ", this.pics);
                })
                .catch(err =>
                    console.log(`fetch pics failed with: ${err}`)
                );
        },
        showImgModule: function (e) {
            console.log(`img with id ${e.target.id} clicked`);
            this.clickedPicId = e.target.id;
            history.pushState({}, "", `/${e.target.id}`);
        },
        hideImgModule: function () {
            this.clickedPicId = 0;
            history.pushState({}, "", `/`);
        },
        logInfiniteScroll: function (x) {
            console.log(
                "%c########################################",
                "color: white; background-color: #007acc;"
            );
            console.log(
                "🚀 ~ file: app.js ~ line 89 ~ infiniteScroll ~ document.scrollingElement.scrollTop",
                document.scrollingElement.scrollTop
            );
            console.log(
                "🚀 ~ file: app.js ~ line 91 ~ infiniteScroll ~ window.innerHeight",
                window.innerHeight
            );
            console.log(
                "🚀 ~ file: app.js ~ line 93 ~ infiniteScroll ~ document.innerHeight",
                x
            );
        },
        logLastId: function () {
            console.log("this :>> ", this);
            console.log("this.lastId :>> ", this.lowestId);
        },
        infiniteScroll: function infiniteScroll(intervalId) {
            if (this.lowestId == this.lastPic) {
                console.log("Nothing more to display");
                clearInterval(intervalId);
                return;
            }

            let documentScrollTop = Math.round(
                document.scrollingElement.scrollTop
            );

            let windowHeight = window.innerHeight;

            var htmlElement = document.documentElement;
            var bodyElement = document.body;
            let documentHeight = Math.max(
                htmlElement.clientHeight,
                htmlElement.scrollHeight,
                htmlElement.offsetHeight,
                bodyElement.scrollHeight,
                bodyElement.offsetHeight
            );

            // this.logInfiniteScroll(documentHeight);

            if (documentScrollTop + windowHeight == documentHeight) {
                console.log("user is at the bottom");
                this.getPics();
            }
        },
    },
});

app.mount("#main");
