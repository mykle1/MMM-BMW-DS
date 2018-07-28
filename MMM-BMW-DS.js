/* Magic Mirror
 * Module: MMM-BMW-DS
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-BMW-DS", {

    // Module config defaults.
    defaults: {
		apiKey: "",                               // Get FREE API key from darksky.net
		tempUnits: "",		                      // C  or F
        lat: "",                                  // Latitude
        lng: "",                                  // Longitude
        useHeader: false,                         // true if you want a header      
        header: "Your Header",                    // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000,           // 5 minutes
        
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

    getStyles: function() {
        return ["MMM-BMW-DS.css"];
    },
    
    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);


        //  Set locale.
        this.url = "https://api.darksky.net/forecast/" + this.config.apiKey + "/" + this.config.lat + "," + this.config.lng;
        
        this.forecast = {};
        this.scheduleUpdate();
    },

    getDom: function() {
        
        function to_celcius (t) {
		 	return (t - 32) * 5 / 9;              // convert fahrenheit to celcius
		 }

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Boring weather . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

            var forecast = this.forecast;
//		    var apiKey = this.config.apiKey;
        
        
            var current = document.createElement("div");
            current.classList.add("small", "bright", "current");
        if (this.config.tempUnits != "F") {
			current.innerHTML = "Current conditions: &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.minutely.icon + ".png>" +  " &nbsp &nbsp " + Math.round(to_celcius(forecast.currently.temperature)) + "°C &nbsp @ &nbsp " + moment(forecast.time).local().format("h:mm a") + ". &nbsp " + forecast.minutely.summary;
			wrapper.appendChild(current);
		} else {
			current.innerHTML = "Current conditions: &nbsp &nbsp " + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.minutely.icon + ".png>" +  " &nbsp &nbsp "  + Math.round(forecast.currently.temperature) + "°F &nbsp @ &nbsp " + moment(forecast.time).local().format("h:mm a") + ". &nbsp " + forecast.minutely.summary;
			wrapper.appendChild(current);
		}
        
        
        var summary = document.createElement("div");
        summary.classList.add("xsmall", "bright", "summary");
        summary.innerHTML = forecast.hourly.summary; // + "<img class = image src=./modules/MMM-BMW/icons/" + forecast.hourly.icon + ".png>";
        wrapper.appendChild(summary);
       
        // daily names, high/low and icons
        var daily = document.createElement("div");
        daily.classList.add("small", "bright", "daily");
  		daily.innerHTML = this.config.tempUnits != "C" ?  /* ? shorthand if statement */
           
         moment.unix(forecast.daily.data[1].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[1].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[1].temperatureHigh) + "/" + Math.round(forecast.daily.data[1].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" 
       + moment.unix(forecast.daily.data[2].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[2].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[2].temperatureHigh) + "/" + Math.round(forecast.daily.data[2].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[3].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[3].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[3].temperatureHigh) + "/" + Math.round(forecast.daily.data[3].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[4].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[4].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[4].temperatureHigh) + "/" + Math.round(forecast.daily.data[4].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[5].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[5].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[5].temperatureHigh) + "/" + Math.round(forecast.daily.data[5].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[6].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[6].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[6].temperatureHigh) + "/" + Math.round(forecast.daily.data[6].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[7].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[7].icon + ".png>" + " &nbsp" + Math.round(forecast.daily.data[7].temperatureHigh) + "/" + Math.round(forecast.daily.data[7].temperatureLow) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"

         :     /* :  shorthand else */
                    
         moment.unix(forecast.daily.data[1].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[1].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[1].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[1].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" 
       + moment.unix(forecast.daily.data[2].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[2].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[2].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[2].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[3].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[3].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[3].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[3].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[4].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[4].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[4].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[4].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[5].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[5].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[5].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[5].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[6].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[6].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[6].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[6].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"
       + moment.unix(forecast.daily.data[7].time).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-DS/icons/" + forecast.daily.data[7].icon + ".png>" + " &nbsp" + Math.round(to_celcius(forecast.daily.data[7].temperatureHigh)) + "/" + Math.round(to_celcius(forecast.daily.data[7].temperatureLow)) + " &nbsp &nbsp  &nbsp &nbsp &nbsp"

        
        wrapper.appendChild(daily);

        return wrapper;
		
    },
    
    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_WEATHER') {
            this.hide(1000);
        }  else if (notification === 'SHOW_WEATHER') {
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