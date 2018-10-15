/* Magic Mirror
 * Module: MMM-BMW-DS
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-BMW-DS", {

    // Module config defaults.
    defaults: {
        apiKey: "", // Get FREE API key from darksky.net
        tempUnits: "", // C  or F
        lat: "", // Latitude
        lng: "", // Longitude
        css: "", // 1-6 (default, Clean, Lord of the Rings, Handwriting, etc)
        ownTitle: "", // Default = Current Conditions
        useHeader: false, // true if you want a header
        header: "Your Header", // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000,

        iconArray: {
            "clear-day": "clear",
            "clear-night": "nt_clear",
            "partly-cloudy-day": "partlycloudy",
            "partly-cloudy-night": "nt_partlycloudy",
            "cloudy": "mostlycloudy",
            "rain": "rain",
            "sleet": "sleet",
            "snow": "chancesnow",
            "wind": "fog",
            "fog": "fog"
        }
    },

    // Gets correct css file from config.js
    getStyles: function() {
        return ["modules/MMM-BMW-DS/css/MMM-BMW-DS" + this.config.css + ".css"];
    },


    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);
        this.config.lang = this.config.lang || config.language;

        //  Set locale.
        this.url = "https://api.darksky.net/forecast/" + this.config.apiKey + "/" + this.config.lat + "," + this.config.lng + "?lang=" + config.language;
        this.forecast = {};
        this.scheduleUpdate();
    },

    getDom: function() {
        var forecast = this.forecast;

        // convert fahrenheit to celcius function
        function to_celcius(t) {
            return (t - 32) * 5 / 9;
        }

        // 12 or 24 hour time function based on config.js timeFormat //
        function getTime(gTime) {
            if (this.config.timeFormat == "12") {
                gTime = moment(forecast.time).format("h:mm a");
            } else {
                gTime = moment(forecast.time).format("H:MM");
            }
            return gTime
        }


        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Acquiring your weather . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var current = document.createElement("div");
        current.classList.add("small", "bright", "current");

        // Check if element exists, courtesy of @CBD
        var numbnuts = forecast.minutely;
        if (typeof numbnuts !== 'undefined') { // This checks if element exists courtesy of @CBD

            if (this.config.tempUnits != "F") {
                if (this.config.ownTitle !== "") {
                    current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(to_celcius(forecast.currently.temperature)) + "°C &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;
                } else {
                    current.innerHTML = "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(to_celcius(forecast.currently.temperature)) + "°C &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;
                }
                wrapper.appendChild(current);
            } else {
                if (this.config.ownTitle !== "") {
                    current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(forecast.currently.temperature) + "°F &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;
                } else {
                    current.innerHTML = "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.minutely.icon + ".png>" + " &nbsp &nbsp " + Math.round(forecast.currently.temperature) + "°F &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.minutely.summary;

                }
                wrapper.appendChild(current);
            }
        } else {

            if (this.config.tempUnits != "F") {
                current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.currently.icon + ".png>" + " &nbsp &nbsp " + Math.round(to_celcius(forecast.currently.temperature)) + "°C &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.currently.summary;
                wrapper.appendChild(current);
            } else {
                current.innerHTML = this.config.ownTitle + " &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.currently.icon + ".png>" + " &nbsp &nbsp " + Math.round(forecast.currently.temperature) + "°F &nbsp @ &nbsp " + getTime() + " &nbsp " + forecast.currently.summary;
                wrapper.appendChild(current);
            }

        }


        var summary = document.createElement("div");
        summary.classList.add("xsmall", "bright", "summary");
        summary.innerHTML = forecast.hourly.summary; // + "<img class = image src=./modules/MMM-BMW/icons/" + forecast.hourly.icon + ".png>";
        wrapper.appendChild(summary);

        // daily names, high/low and icons
        var daily = document.createElement("div");
        daily.classList.add("small", "bright", "daily");
        daily.innerHTML = this.config.tempUnits != "C" ? /* ? shorthand if statement */

            moment.unix(forecast.daily.data[1].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[1].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[1].temperatureHigh) + "/" + Math.round(forecast.daily.data[1].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[2].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[2].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[2].temperatureHigh) + "/" + Math.round(forecast.daily.data[2].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[3].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[3].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[3].temperatureHigh) + "/" + Math.round(forecast.daily.data[3].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[4].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[4].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[4].temperatureHigh) + "/" + Math.round(forecast.daily.data[4].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[5].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[5].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[5].temperatureHigh) + "/" + Math.round(forecast.daily.data[5].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[6].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[6].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[6].temperatureHigh) + "/" + Math.round(forecast.daily.data[6].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[7].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[7].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[7].temperatureHigh) + "/" + Math.round(forecast.daily.data[7].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"

            :
            /* :  shorthand else */

            moment.unix(forecast.daily.data[1].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[1].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[1].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[1].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[2].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[2].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[2].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[2].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[3].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[3].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[3].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[3].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[4].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[4].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[4].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[4].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[5].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[5].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[5].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[5].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[6].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[6].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[6].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[6].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +
            moment.unix(forecast.daily.data[7].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[7].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[7].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[7].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
            wrapper.appendChild(daily);

                // Sound for rain, wind, thunder, etc.
                if (forecast.hourly.data[0].icon === "rain"){
                      var sound = new Audio();
                      sound.src = 'modules/MMM-BMW-DS/sounds/rain.mp3';
                      sound.play();
        } else if (forecast.hourly.data[0].icon === "thunder"){
                      var sound = new Audio();
                      sound.src = 'modules/MMM-BMW-DS/sounds/thunder.mp3';
                      sound.play();
        } else if (forecast.hourly.data[0].icon === "wind"){
                      var sound = new Audio();
                      sound.src = 'modules/MMM-BMW-DS/sounds/wind.mp3';
                      sound.play();
                }

        return wrapper;
    },

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_WEATHER') {
            this.hide(1000);
        } else if (notification === 'SHOW_WEATHER') {
            this.show(1000);
        }
    },

    processWeather: function(data) {
        this.forecast = data;
                console.log(this.forecast);
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getWeather();
        }, this.config.updateInterval);
        this.getWeather(this.config.initialLoadDelay);
    },

    getWeather: function() {
        this.sendSocketNotification('GET_WEATHER', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "WEATHER_RESULT") {
            this.processWeather(payload);

            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
