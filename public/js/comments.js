export default {
    data() {
        return {
            commenter: "",
            comment: "",
            comments: [],
            areComments: false,
            inputError: "",
            errorStyle: "",
            commentLimit: 3,
        };
    },
    props: ["focusPicId"],
    // emits: ["hide-img-module"],
    mounted: function () {
        console.log("this.focusPicId :>> ", this.focusPicId);
        this.getComments(this.commentLimit);
    },
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
        deleteComment: function (commentId) {
            fetch("/comments", {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    id: commentId,
                }),
            })
                .then(res => {
                    this.getComments(this.commentLimit);
                })
                .catch(err => {
                    console.log(
                        `fetch upload data failed with: ${err}`
                    );
                });
        },
        submitComment: function () {
            fetch("/comments", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    commenter: this.commenter,
                    comment: this.comment,
                    picId: this.focusPicId,
                }),
            })
                .then(res => res.json())
                .then(commentData => {
                    this.inputError = "";
                    this.errorStyle = "";
                    this.comments.unshift(commentData);
                })
                .catch(err => {
                    console.log(
                        `fetch submit comment failed with: ${err}`
                    );
                    this.inputError = "Fill in required fields";
                    this.errorStyle =
                        "background-color: rgb(216, 99, 158)";
                });
        },
    },
    template: `
        <div class="comments" aria-label="comments-title">
            <div class="comments__header">
                <h3 id="comments-title">Comments</h3>
                <button @click="getComments(0)" v-show="areComments">
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
            <h3 id="input-error">{{inputError}}</h3>
            <div class="comments__submit">
                <input v-model="commenter" type="text" name="commenter" id="commenter" 
                    placeholder="user name" :style="errorStyle">
                <input v-model="comment" type="text" name="commentText" id="comment-text" 
                    placeholder="Write a comment..." :style="errorStyle">
                <button @click="submitComment">
                    Submit
                </button>
            </div>
        </div>
    `,
};
