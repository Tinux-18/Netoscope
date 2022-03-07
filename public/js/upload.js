export default {
    data() {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
            inputError: "",
            errorStyle: "",
        };
    },
    emits: ["hide-upload-module", "img-uploaded"],
    mounted: function () {},
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
                    this.$emit("img-uploaded", uploadData);
                    this.$emit("hide-upload-module");
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
        closeModule: function () {
            this.$emit("hide-upload-module");
        },
    },
    template: `
        <div id="overlay" @click="closeModule"></div>

        <div class="upload-module" aria-description="Pop-up showing image info & comments" aria-label="Image pop-up">

            <img id="img-module__close" src="/close_button.png" alt="close module button" @click="closeModule">

            <form aria-labelledby="form-title" class="upload">
                <div>
                    <label for="title"><h3>Title:</h3></label>
                    <input v-model="title" type="text" name="title" id="title" class="upload__input-text">
                </div>
                
                <div>
                    <label for="description">
                        <h3>Description:</h3>
                    </label>
                    <input v-model="description" type="text" name="description" id="description" class="upload__input-text upload__input">
                </div>

                <div>
                    <label for="username">
                        <h3>User:</h3>
                    </label>
                    <input v-model="username" type="text" name="username" id="username" class="upload__input-text upload__input"
                    :style="errorStyle" required>
                </div>

                <div>
                    <label for="file">
                        <h3>File:</h3>
                    </label>
                    <input @change="selectFile" @keyup.enter="upload" type="file" name="file" id="file" class="upload__input" accept="image/*"
                    required>
                    <label for="file" id="file-label" :style="errorStyle">cool_pic.jpg</label>
                </div>

                
                
                <button @click.prevent.default="upload">
                    Upload
                </button>

                <h3 id="input-error">{{inputError}}</h3>
            </form>
        </div>
    `,
};
