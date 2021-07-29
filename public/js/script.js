(function() {
    Vue.component("popup", {
        template: "#modal_window",
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
                rightImage: null,
                swiping: false,
                swipeArr: [],
                x: false
            };
        },
        mounted: function() {
            this.showModal();
            window.addEventListener("touchend", this.stopSwipe);
            window.addEventListener("keydown", this.keyAction);
        },
        beforeDestroy: function() {
            window.removeEventListener("touchend", this.stopSwipe);
            window.removeEventListener("keydown", this.keyAction);
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
                self.comments = [];
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
            },
            keyAction: function(e) {
                let key = e.keyCode;
                if (key == 37 && this.leftId) {
                    location.assign(`/#${this.leftId}`);
                }
                if (key == 39 && this.rightId) {
                    location.assign(`/#${this.rightId}`);
                }
                if (key == 27) {
                    this.closeModal();
                }
            },
            startClick: function(e) {
                this.swiping = true;
                this.x = e.touches[0].clientX;
            },
            swipe: function(e) {
                let modal = this.$refs.modal,
                    swipeX = e.touches[0].clientX;
                if (this.swiping) {
                    modal.style.left = swipeX - this.x + "px";
                    this.swipeArr.push(swipeX);

                    if (!this.leftId && this.swipeArr[50] > this.x) {
                        modal.style.left = 0 + "px";
                    }
                    if (!this.rightId && this.swipeArr[50] < this.x) {
                        modal.style.left = 0 + "px";
                    }
                    if (swipeX < this.x - 250 && this.rightId) {
                        this.stopSwipe(this.rightId);
                    }
                    // If mouse position has moved right, then show newer image on the left
                    if (this.x + 250 < swipeX && this.leftId) {
                        this.stopSwipe(this.leftId);
                    }
                }
            },
            stopSwipe: function(id) {
                if (typeof id === "number") {
                    location.assign(`/#${id}`);
                }
                this.swiping = false;
                this.swipeArr = [];
                this.x = false;
                this.$refs.modal.style.left = "0px";
            },
            delete_image: function() {
                let self = this;
                axios.post("/delete", { id: self.imageId }).then(function() {
                    self.$emit("deleted", self.imageId);
                    if (self.leftId) {
                        location.assign(`/#${self.leftId}`);
                    } else {
                        location.assign(`/#${self.rightId}`);
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
                var self = this;
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
                            self.images.unshift(response.data);
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
                // console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
            closeMe: function() {
                this.imageSelected = null;
                this.fixed = null;
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
                        disco.src = "";
                        disco.pause();
                    }
                    if (filter == "animated") {
                        disco.src = "/stuff/room5_PartyLad_edit.mp3";
                        disco.volume = 0.5;
                        disco.play();
                    }
                };
            },
            setFixed: function() {
                this.fixed = "fixed";
            },
            updateOnDelete: function(id) {
                this.images = this.images.filter(image => image.id != id);
                let arr = [];
                for (let i in this.images) {
                    arr.push(this.images[i].id);
                }
                console.log("deleted", arr);
            }
        }
    });
})();
