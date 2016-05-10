Traveler RPG Subsector Generator
================================

![Alt screenshot](screenshot.png?raw=true "Screenshot")

This web app creates subsector starmaps for the classic desktop role playing game Traveler. You can search existing starmaps and download the maps and data.

As I no longer have copies of the Traveler rulebooks (classic or the more recent Mongoose edtions) I've cribbed the world generation rules from around the net. They're very likely wrong or non-canon, so caveat emptor! Pull requests from veteran players welcome.

Subsectors are stored in a database. There's an arbitrary limit of 1000 subsectors you can change in the settings. Names are randomly assigned from a text file; pass in another text file in the settings. Thanks to Chris Pound for the sources:

http://generators.christopherpound.com/

The application uses Python and Flask on the backend and ReactJS for the web app. The map is drawn on HTML5 canvas: thanks to Mike Palmerlee for his article providing pointers:

http://www.mattpalmerlee.com/2012/04/10/creating-a-hex-grid-for-html5-games-in-javascript/

Install
-------

Requires Python 3.5+.

```
   git clone https://github.com/danjac/traveler-starmap.git
   cd ui
   npm install
   cd ../api
   pip install -r requirements.txt
```
