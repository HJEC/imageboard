(function() {
    new Vue({
        el: "#main",
        data: {
            heading: "HOT BOIS",
            className: "header",
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
                    console.log("response is: ", res.data);
                    this.images = res.data.reverse();
                })
                .catch(function(err) {
                    console.log("error: ", err);
                });
        },
        updated: function() {
            // console.log("updated");
        },
        methods: {
            handleClick: function(e) {
                var vueInstance = this;
                e.preventDefault();
                console.log("this: ", this);

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
            }
        }
    });
})();
