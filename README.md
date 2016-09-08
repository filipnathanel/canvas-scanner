## Synopsis

A canvas based scanner emulation for producing glitched art

## Motivation

#### The analog approach

The original way to create [scanned effect](http://www.trendlist.org/trends/scanned) requires a designer/artitst to possess:

- a physical representation of scan object (photo, print, booty)
- a scanner

The scanned effect is then produced by moving the scan object on the surface of scanner while the scanner is scanning.

#### Analog approach critique

As much as the human introduced 'error' is required to produce the effect, the manual movement of a scan object introduces few flaws especially from the perspective of professional application. The flaws being:

- lack of repeatability
- lack of fine control

And from the less professional perspective:

- dependency on extra hardware (printer/scanner) 

## Development prerequisites

You need to have [node.js](https://nodejs.org/) with up to date npm to develop this project.

## Development process

The project structure and build automation is based on modified [Yeoman Webapp Generator](https://github.com/yeoman/generator-webapp)

In order to start developing this project:

Clone the repo to your local machine:

`git clone http://github.com/filipnathanel/canvas-scanner`

Then cd into the `canvas-scanner` directory and execute `npm install`

After the npm will have finished installing you should be able to simply `gulp serve` to start up a server with livereload.