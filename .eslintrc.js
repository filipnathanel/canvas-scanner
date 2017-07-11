module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
	    "arrow-body-style": [0],
	    "comma-dangle": 0,
	    "indent": ["error", "tab"],
	    "no-tabs": 0,
      "space-in-parens": [ 2, "always" ],
      "arrow-parens":0,
      "padded-blocks":["error", "always"]
    },
    "env": {
      "es6": true,
      "node": true,
      "browser": true
    }
};




