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
    mounted: function () {},
    methods: {
        getComments: function (limit) {
            fetch(`/comments.json/:${this.focusPicId}:${limit}`)
                .then(res => res.json())
                .then(commentsData => {
                    this.comments = commentsData;
                    this.areComments = commentsData.length > 0;
                })
                .catch(err =>
                    console.log(`fetch comments failed with: ${err}`)
                );
        },
    },
    template: `
        <div class="upload-module">
            <div class="comments__header">
                <h3 id="comments-title">Comments</h3>
                <button @click="getComments(0)" v-show="areComments">
                    See all
                </button>
            </div>
        </div>
    `,
};
