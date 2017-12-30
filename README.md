# wechat-game
微信小游戏开发引擎。基于canvas的2D渲染方式。简单易操作。

## demo

![](https://gitee.com/cuo9958/wechat-game/raw/master/dist/weixin.png)
```
//添加图片资源
wgame.ImageManager.add({
  "logo": "./images/hero.png"
});

//添加视图层
var layer=new wgame.Layer({
  width:200,
  height:200
})
//添加图片组件
var item = new wgame.DisplayObject({
  x: "center",
  y: "center",
  velocityRotate: 180,
  backgroundImage: "logo" // The background image is re-sized to the pre-loaded logo.png size
}).addTo(layer);

//加入到画板上
wgame.Renderer.addLayer(layer);
//开始
wgame.Renderer.start();
```