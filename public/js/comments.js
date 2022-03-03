export default {
    data() {
        return {
            commenter: "",
            comment: "",
            comments: [
                {
                    id: 44,
                    commenter: "Tim",
                    commentText: "I loves the cat",
                },
                {
                    id: 44,
                    commenter: "jon",
                    commentText: "I hates the cat",
                },
            ],
        };
    },
    props: ["focusPicId"],
    // emits: ["hide-img-module"],
    mounted: function () {
        console.log("this.focusPicId :>> ", this.focusPicId);
        fetch(`/comments.json/:${this.focusPicId}:1`)
            .then(res => res.json())
            .then(commentsData => {
                this.comments = commentsData;
            })
            .catch(err =>
                console.log(`fetch comments failed with: ${err}`)
            );
    },
    methods: {
        getAllComments: function () {
            fetch(`/comments.json/:${this.focusPicId}`)
                .then(res => res.json())
                .then(commentsData => {
                    this.comments = commentsData;
                })
                .catch(err =>
                    console.log(`fetch comments failed with: ${err}`)
                );
        },
        deleteComment: function (commentId) {
            console.log("commentId :>> ", commentId);
            // fetch(`/comments.json/:${this.focusPicId}`)
            //     .then(res => res.json())
            //     .then(commentsData => {
            //         this.comments = commentsData;
            //     })
            //     .catch(err =>
            //         console.log(`fetch comments failed with: ${err}`)
            //     );
        },
        submitComment: function () {
            //on enter press on comment text & submit button pressed
            // this.$emit("hide-img-module");
        },
    },
    template: `
        <div class="comments" aria-label="comments-title">
            <div class="comments__header">
                <h3 id="comments-title">Comments</h3>
                <button @click="getAllComments">
                    See all
                </button>
            </div>
            
            <div clss="comments__list" v-for="comment in comments">
                <div class="comments__li">
                    <p :key="comment.id" :id="comment.id">{{comment.commenter}}: {{comment.comment}}
                    </p>
                    <p :id="comment.id" @click="deleteComment(comment.id)">Delete</p>
                </div>
            </div>
            <div class="comments__submit">
                <input v-model="commenter" type="text" name="commenter" id="commenter" 
                    placeholder="user name">
                <input v-model="comment" type="text" name="commentText" id="comment-text" 
                    placeholder="Write a comment...">
                <button @click.prevent.default="">
                    Submit
                </button>
            </div>
        </div>
    `,
};
