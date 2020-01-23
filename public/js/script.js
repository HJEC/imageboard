(function() {
    Vue.component("popup", {
        template: "#template",
        props: ["imageId"],
        data: function() {
            return {
                image: null,
                title: null,
                description: null,
                username: null,
                comment_username: null,
                comment: null,
                comments: []
            };
        },
        mounted: function() {
            console.log("mounted id: ", this.imageId);
            var vueInstance = this;
            var imageId = this.imageId;
            document.getElementById("overlay").classList.add("overlay");

            axios.get("/selected/" + vueInstance.imageId).then(function(res) {
                // console.log("component request data: ", res.data);
                vueInstance.image = res.data.url;
                vueInstance.title = res.data.title;
                vueInstance.description = res.data.description;
                vueInstance.username = res.data.username;
            });
            axios.get(`/comments/${imageId}`).then(function(res) {
                console.log("comments in get: ", res.data);
                for (var i in res.data) {
                    vueInstance.comments.push(res.data[i]);
                }
            });
        },
        methods: {
            closeModal: function() {
                document.getElementById("overlay").classList.remove("overlay");
                this.$emit("close");
            },
            addComment: function(e) {
                e.preventDefault();
                var imageId = this.imageId,
                    username = this.comment_username,
                    comment = this.comment;
                axios
                    .post(`/addcomment/${imageId}/${username}/${comment}`)
                    .then(res => {
                        // console.log("main vue comment response: ", res.data);
                        this.comments.push(res.data);
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            imageSelected: null,
            heading: "HOT DOGS",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null
        },
        mounted: function() {
            axios
                .get("/images")
                .then(res => {
                    // console.log("response is: ", res.data);
                    this.images = res.data;
                })
                .catch(function(err) {
                    console.log("error: ", err);
                });
        },
        updated: function() {
            // console.log("updated");
        },
        methods: {
            upload: function(e) {
                var vueInstance = this;
                e.preventDefault();
                // console.log("this: ", this);

                var formData = new FormData();
                // We need to use formData to send a file to the server
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function(response) {
                        console.log("response from POST /upload: ", response);
                        vueInstance.images.unshift(response.data);
                    })
                    .catch(function(err) {
                        console.log("Error in POST: ", err);
                    });
            },
            handleChange: function(e) {
                console.log("handlechange is running");
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
            closeMe: function() {
                this.imageSelected = null;
                console.log("V.MAIN: Method fired. Count is: ");
            },
            moreImages: function() {
                console.log(
                    "Id of last image: ",
                    this.images[this.images.length - 1].id
                );
                let lastId = this.images[this.images.length - 1].id;
                axios
                    .get(`/images/${lastId}`)
                    .then(res => {
                        for (let i in res.data) {
                            console.log("response is: ", res.data[i]);
                            this.images.push(res.data[i]);
                        }
                    })
                    .catch(function(err) {
                        console.log("error in GMI: ", err);
                    });
            }
        }
    });
})();
