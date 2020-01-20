(function() {
    new Vue({
        el: "#main",
        data: {
            heading: "HOT BOIS",
            className: "header",
            url: "https://polygon.com",
            images: null,
            title: "Enter title"
        },
        mounted: function() {
            axios
                .get("/images")
                .then(res => {
                    console.log("response is: ", res.data);
                    this.images = res.data;
                })
                .catch(function(err) {
                    console.log("error: ", err);
                });
        },
        updated: function() {
            console.log("updated", this.title);
        },
        methods: {}
    });
})();
