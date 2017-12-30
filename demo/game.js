// import './js/libs/weapp-adapter'
// import './js/libs/symbol'

// import Main from './js/main'

// new Main()

import wgame from './wgame.js'
wgame.ImageManager.add({
  "logo": "./images/hero.png"
});


var layer=new wgame.Layer({
  width:200,
  height:200
})
console.log(layer)

var item = new wgame.DisplayObject({
  x: "center",
  y: "center",
  velocityRotate: 180,
  backgroundImage: "logo" // The background image is re-sized to the pre-loaded logo.png size
}).addTo(layer);


wgame.Renderer.addLayer(layer);
wgame.Renderer.start();
