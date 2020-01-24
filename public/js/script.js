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
                comments: [],
                leftId: null,
                rightId: null,
                leftImage: null,
                rightImage: null
            };
        },
        mounted: function() {
            this.showModal();
        },
        watch: {
            imageId: function() {
                this.showModal();
            }
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
            },
            showModal: function() {
                var self = this;
                var imageId = this.imageId;
                document.getElementById("overlay").classList.add("overlay");

                axios.get("/selected/" + imageId).then(function(res) {
                    if (res.data == "") {
                        return self.closeModal();
                    }
                    self.image = res.data.url;
                    self.title = res.data.title;
                    self.description = res.data.description;
                    self.username = res.data.username;
                    self.leftId = res.data.left_id;
                    self.rightId = res.data.right_id;
                    self.leftImage = res.data.left_url;
                    self.rightImage = res.data.right_url;
                });
                axios.get(`/comments/${imageId}`).then(function(res) {
                    for (var i in res.data) {
                        self.comments.push(res.data[i]);
                    }
                });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            imageSelected: location.hash.slice(1),
            heading: "HOT DOGS",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            showResultsButton: true
        },
        mounted: function() {
            var self = this;
            addEventListener("hashchange", function() {
                self.imageSelected = location.hash.slice(1);
            });
            axios
                .get("/images")
                .then(res => {
                    this.images = res.data;
                })
                .catch(function(err) {
                    console.log("error: ", err);
                });
        },
        updated: function() {
            axios.get("/last").then(res => {
                if (this.images[this.images.length - 1].id == res.data[0].id)
                    this.showResultsButton = false;
            });
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
                // location.hash = "";
                history.replaceState(null, null, " ");
            },
            moreImages: function() {
                let lastId = this.images[this.images.length - 1].id;
                axios
                    .get(`/images/${lastId}`)
                    .then(res => {
                        for (let i in res.data) {
                            this.images.push(res.data[i]);
                        }
                    })
                    .catch(function(err) {
                        console.log("moreImages method err: ", err);
                    });
            }
        }
    });
})();
