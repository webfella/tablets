Tablet optimised ad templates
===

Proof of concepts for tablet advertising templates

Current templates
---

* Swipe to reveal
* Scratch to reveal
* Drag to rotate

Future concepts
---

* TBD

Environment setup
---

* Download and install [Node JS](http://nodejs.org/download/)
* Clone the directory `git clone git@github.com:webfella/tablets.git`
* Change into the directory `cd tablets`
* Install Grunt and dependencies `npm install`
* Install the Grunt CLI globally `npm install -g grunt-cli`

Compiling templates
---

* Generate all files
	* `grunt`
* Spin up a local server for development
	* `grunt develop`
* Run unit tests
	* `grunt test`
* Generate task specific files
	* `grunt swipe`
	* `grunt scratch`
	* `grunt rotate`