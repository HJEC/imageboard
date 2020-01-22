(function() {
    // window.app = new Vue({ -- this allows for event handling in the dev console
    new Vue({
        el: "#main",
        data: {
            heading: "HOT BOIS",
            className: "pretty",
            hotboi: "big dogs need love too.",
            url: "https://polygon.com",
            candy: null,
            greetee: "puppies"
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            var vueInstance = this;
            axios
                .get("/candy")
                .then(function(res) {
                    console.log("response is: ", res.data);
                    vueInstance.candy = res.data;
                })
                .catch(function(err) {
                    console.log("error: ", err);
                });
        },
        updated: function() {
            console.log("updated", this.greetee);
        },
        methods: {
            sayHello: function() {
                console.log("hello, " + this.candy[0].name);
            },
            changeName: function(name) {
                for (var i = 0; i < this.candy.length; i++) {
                    if (this.candy[i].name == name) {
                        this.candy[i].name = "puppers";
                    }
                }
                this.sayHello();
            }
        }
    });
})();
