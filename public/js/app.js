import * as Vue from "./vue.js";

const app = Vue.createApp({
    data() {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
            pics: [],
        };
    },
    mounted: function () {
        fetch("/pics.json")
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
            // console.log("e.target.files :>> ", e.target.files[0]);
            this.file = e.target.files[0];
        },
        upload: function (e) {
            console.log("this.file :>> ", this.file);
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
                    // console.log("uploadData :>> ", uploadData);
                    // console.log("this.pics :>> ", this.pics);
                    this.pics.unshift(uploadData);
                })
                .catch(err =>
                    console.log(
                        `fetch upload data failed with: ${err}`
                    )
                );
        },
        //TODO check user input
        checkFile: function () {},
    },
});

app.mount("#main");
