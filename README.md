## MMM-BMW-DS

**Bugger My Weather** DarkSky

## Same church, different pew

I wanted to take a new approach at a weather module. Until now, I had only done WWI and WWI2 but I
wasn't really happy with those, although they were fun to do. This has a bit more style to it (not much)
and it doesn't resemble other modules in format or appearance. I learned a couple of new things while
doing it and I used what I learned in the module itself. Nothing monumental but very satisfying for me.

## Good-bye bottom_bar (Well, not really)

* This was designed for use in the bottom_bar position of your MagicMirror
* Can share bottom bar position with newsfeed module via Hello_Lucy
* Minutely updates for current conditions
* Support for a host of different languages from the API
* CSS provided for coloring and sizing. Make it your own.

## Examples

* Default white

![](images/1.png)

* Colored and summary hidden

![](images/2.png)

## Installation and requirements

* `git clone https://github.com/mykle1/MMM-BMW-DS` into the `~/MagicMirror/modules` directory.

* Free API key at `https://www.darksky.net` (Required)

* No dependencies needed! No kidding!

## Config.js entry and options

    {
		disabled: false,
		module: "MMM-BMW-DS",
		position: "bottom_bar",               // bottom_bar is best
		config: {
            apiKey: "YOUR API KEY GOES HERE", // Free API key @ darksky.net
            tempUnits: "F",		              // C of F
            lat: 'YOUR LATITUDE GOES HERE', 
            lng: 'YOUR LONGITUDE GOES HERE',
            css: "1",                         // 1-6 (default, Clean, Lord of the Rings, Handwriting, etc)
            ownTitle: "Current Conditions",   // Use your own language and statement
			useHeader: false,               
			header: "Your header",
			maxWidth: "100%",
		}
	},
	
## Language support

* The module will read the language being used in your config file and adjust accordingly

* Supported languages from the API

ar: Arabic
az: Azerbaijani
be: Belarusian
bg: Bulgarian
bs: Bosnian
ca: Catalan
cs: Czech
da: Danish
de: German
el: Greek
en: English (which is the default)
es: Spanish
et: Estonian
fi: Finnish
fr: French
he: Hebrew
hr: Croatian
hu: Hungarian
id: Indonesian
is: Icelandic
it: Italian
ja: Japanese
ka: Georgian
ko: Korean
kw: Cornish
nb: Norwegian Bokmål
nl: Dutch
no: Norwegian Bokmål (alias for nb)
pl: Polish
pt: Portuguese
ro: Romanian
ru: Russian
sk: Slovak
sl: Slovenian
sr: Serbian
sv: Swedish
tet: Tetum
tr: Turkish
uk: Ukrainian
x-pig-latin: Igpay Atinlay
zh: simplified Chinese
zh-tw: traditional Chinese

## Thanks to "Big Salty" for suggesting a rewrite of MMM-BMW

* The original MMM-BMW is still available. However, it requires an older WunderGround API key



