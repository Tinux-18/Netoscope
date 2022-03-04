import comments from "./comments.js";

export default {
    data() {
        return {
            id: 0,
            url: "",
            username: "",
            title: "",
            description: "",
            createdAt: "",
        };
    },
    props: ["clickedPicIdProp"],
    emits: ["hide-img-module"],
    components: {
        comments: comments,
    },
    watch: {
        clickedPicIdProp: () => {
            console.log("clickedPicIdProp changed");
        },
    },
    mounted: function () {
        this.getPic();
    },
    methods: {
        closeButtonClicked: function () {
            this.$emit("hide-img-module");
        },
        getPic: function () {
            fetch(`/pics.json/:${this.clickedPicIdProp}`)
                .then(res => res.json())
                .then(picData => {
                    this.id = picData[0].id;
                    this.url = picData[0].url;
                    this.username = picData[0].username;
                    this.title = picData[0].title;
                    this.description = picData[0].description;
                    this.createdAt = picData[0].created_at;
                })
                .catch(err => {
                    console.log(`fetch pics failed with: ${err}`);
                    this.$emit("hide-img-module");
                });
        },
        formatDate: function (sqlDate) {
            let dateParams = sqlDate
                .replace("T", " ")
                .replace("Z", "")
                .split(/[- :]/);
            let dateObj = new Date(
                Date.UTC(
                    dateParams[0],
                    dateParams[1] - 1,
                    dateParams[2],
                    dateParams[3],
                    dateParams[4],
                    dateParams[5]
                )
            );
            return dateObj.toLocaleString().replace(",", " at");
        },
    },
    template: `
        <div id="overlay" @click="closeButtonClicked" aria-description="Pop-up showing image info & comments" aria-label="Image pop-up"></div>
            <div class="img-module">
                <img id="img-module__close" src="/close_button.png" alt="close module button" @click="closeButtonClicked">
                <img :id="id" class="img-module__pic" :src='url' :alt="description">
                <label :for="id"><h3>{{title}}</h3></label>
                <p>{{description}}</p>
                <p>Uploaded by {{username}} on {{formatDate(createdAt)}}</p>
                <comments :focus-pic-id="this.clickedPicIdProp">
                </comments>
        </div>
    `,
};
