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
                this.$emit("close");
            },
            addComment: function(e) {
                e.preventDefault();
                var imageId = this.imageId;
                var username = this.comment_username;
                var comment = this.comment;
                if (username == null || username == "") {
                    username = "anon";
                }
                if (comment == null || comment == "") {
                    window.alert("please enter comment");
                } else {
                    axios
                        .post(`/addcomment/${imageId}/${username}/${comment}`)
                        .then(res => {
                            this.comments.push(res.data);
                            this.comment_username = null;
                            this.comment = null;
                        });
                }
            },
            showModal: function() {
                var self = this;
                this.comments = [];
                this.$emit("fixed");
                axios.get("/selected/" + self.imageId).then(function(res) {
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
                axios.get(`/comments/${self.imageId}`).then(function(res) {
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
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            selectedFilter: null,
            fixed: null,
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
            this.darkMode();
        },
        updated: function() {
            axios.get("/last").then(res => {
                if (this.images[this.images.length - 1].id == res.data[0].id)
                    this.showResultsButton = false;
            });
            this.darkMode();
            this.changeFilter();
        },
        methods: {
            upload: function(e) {
                var vueInstance = this;
                e.preventDefault();
                if (this.file == null) {
                    window.alert("You must select a file! \nplease try again");
                }
                if (this.username == null || this.username == "") {
                    this.username = "anon";
                }
                if (this.description == null || this.description == "") {
                    window.alert("please enter comment");
                } else {
                    var formData = new FormData();
                    // We need to use formData to send a file to the server
                    formData.append("title", this.title);
                    formData.append("description", this.description);
                    formData.append("username", this.username);
                    formData.append("file", this.file);

                    axios
                        .post("/upload", formData)
                        .then(function(response) {
                            console.log(
                                "response from POST /upload: ",
                                response
                            );
                            vueInstance.images.unshift(response.data);
                        })
                        .catch(function(err) {
                            console.log("Error in POST: ", err);
                        });
                }
                this.title = "";
                this.description = "";
                this.username = "";
                this.file = null;
            },
            handleChange: function(e) {
                console.log("handlechange is running");
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
            closeMe: function() {
                this.imageSelected = null;
                this.fixed = null;
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
            },
            darkMode: function() {
                const toggleSwitch = document.getElementById("checkbox");
                function switchTheme(e) {
                    if (e.target.checked) {
                        console.log("dark switch on");
                        document.documentElement.setAttribute(
                            "data-theme",
                            "dark"
                        );
                        localStorage.setItem("theme", "dark");
                    } else {
                        document.documentElement.setAttribute(
                            "data-theme",
                            "light"
                        );
                        localStorage.setItem("theme", "light");
                    }
                }

                toggleSwitch.addEventListener("change", switchTheme, false);

                const currentTheme = localStorage.getItem("theme")
                    ? localStorage.getItem("theme")
                    : null;

                if (currentTheme) {
                    document.documentElement.setAttribute(
                        "data-theme",
                        currentTheme
                    );

                    if (currentTheme === "dark") {
                        toggleSwitch.checked = true;
                    }
                }
            },
            changeFilter: function() {
                var select = document.querySelector("select");
                var disco = document.querySelector("audio");
                select.onchange = () => {
                    // this will detect any change to select element
                    var filter = select.options[select.selectedIndex].value;
                    //this will grab the value of option at clicked index
                    this.selectedFilter = filter;
                    if (filter !== "animated") {
                        console.log("STOP PLEASE!");
                        disco.src = "";
                        disco.pause();
                    }
                    if (filter == "animated") {
                        disco.src = "/stuff/room5.mp3";
                        disco.play();
                    }
                };
            },
            setFixed: function() {
                this.fixed = "fixed";
            }
        }
    });
})();
