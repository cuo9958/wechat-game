/**
 * 游戏引擎
 */

let WGame = {
    //版本号
    version: "1.0.0",
    raphaelDashArray: {
        "": [0],
        "none": [0],
        "-": [3, 1],
        ".": [1, 1],
        "-.": [3, 1, 1, 1],
        "-..": [3, 1, 1, 1, 1, 1],
        ". ": [1, 3],
        "- ": [4, 3],
        "--": [8, 3],
        "- .": [4, 3, 1, 3],
        "--.": [8, 3, 1, 3],
        "--..": [8, 3, 1, 3, 1, 3]
    }
};

/**
 * 工具集
 */
class util {
    constructor() {
        this._sCSSPrefix = null;
        this._htDeviceInfo = null;
        this._bSupport3d = null;
        this._bSupportCSS3 = null;
        this._htBoundary = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
    }
    getDisplayObjectById(id) {
        return WGame.DisplayObject.htFactory[nId];
    }
    getDisplayObjectByName(sName) {
        for (var i in WGame.DisplayObject.htFactory) {
            if (WGame.DisplayObject.htFactory[i].get("name") === sName) {
                return WGame.DisplayObject.htFactory[i];
            }
        }

        return false;
    }
    getDeviceInfo(sAgent) {
        if (this._htDeviceInfo !== null && typeof sAgent === "undefined") {
            return this._htDeviceInfo;
        }

        var aMat = null;
        var bIsDesktop = false;
        var bSupportCanvas = typeof CanvasRenderingContext2D !== "undefined";
        var bIsAndroid = false;
        var bIsIOS = false;
        var bIsIE = false;
        var bHasChrome = (/chrome/i.test(sAgent)) ? true : false;
        var sAgent = sAgent || navigator.userAgent;
        var nVersion = 0;

        if (/android/i.test(sAgent)) { // android
            bIsAndroid = true;
            aMat = sAgent.toString().match(/android ([0-9]\.[0-9])\.?([0-9]?)/i);

            if (aMat && aMat[1]) {
                nVersion = (parseFloat(aMat[1]) + (aMat[2] ? aMat[2] * 0.01 : 0)).toFixed(2);
            }
        } else if (/(iphone|ipad|ipod)/i.test(sAgent)) { // iOS
            bIsIOS = true;
            aMat = sAgent.toString().match(/([0-9]_[0-9])/i);

            if (aMat && aMat[1]) {
                nVersion = parseFloat(aMat[1].replace(/_/, '.'));
            }
        } else { // PC
            bIsDesktop = true;

            if (/(MSIE)/i.test(sAgent)) { // IE
                bIsIE = true;
                aMat = sAgent.toString().match(/MSIE ([0-9])/i);

                if (aMat && aMat[1]) {
                    nVersion = parseInt(aMat[1], 10);
                }
            }
        }

        this._htDeviceInfo = {
            supportCanvas: bSupportCanvas,
            desktop: bIsDesktop,
            android: bIsAndroid ? nVersion : false,
            ios: bIsIOS ? nVersion : false,
            ie: bIsIE ? nVersion : false,
            chrome: bHasChrome
        };

        return this._htDeviceInfo;
    }
    getCSSPrefix(sName, bJavascript) {
        var sResult = '';

        if (this._sCSSPrefix === null) {
            this._sCSSPrefix = '';

            if (typeof document.body.style.webkitTransform !== "undefined") {
                this._sCSSPrefix = "-webkit-";
            } else if (typeof document.body.style.MozTransform !== "undefined") {
                this._sCSSPrefix = "-moz-";
            } else if (typeof document.body.style.OTransform !== "undefined") {
                this._sCSSPrefix = "-o-";
            } else if (typeof document.body.style.msTransform !== "undefined") {
                this._sCSSPrefix = "-ms-";
            }
        }

        sResult = this._sCSSPrefix + (sName ? sName : '');

        if (bJavascript) {
            var aTmp = sResult.split("-");
            sResult = '';

            for (var i = 0, len = aTmp.length; i < len; i++) {
                if (aTmp[i]) {
                    sResult += sResult ? aTmp[i].substr(0, 1).toUpperCase() + aTmp[i].substr(1) : aTmp[i];
                }
            }

            if (this._sCSSPrefix === "-moz-" || this._sCSSPrefix === "-o-") {
                sResult = sResult.substr(0, 1).toUpperCase() + sResult.substr(1);
            }
        }

        return sResult;
    }
    getSupportCSS3() {
        if (this._bSupportCSS3 === null) {
            this._bSupportCSS3 = typeof document.body.style[WGame.util.getCSSPrefix("transform", true)] !== "undefined" || typeof document.body.style.transform != "undefined";
        }

        return this._bSupportCSS3;
    }
    getSupportCSS3d() {
        if (this._bSupport3d === null) {
            this._bSupport3d = (typeof document.body.style[WGame.util.getCSSPrefix("perspective", true)] !== "undefined" || typeof document.body.style.perspective != "undefined") && (!WGame.util.getDeviceInfo().android || WGame.util.getDeviceInfo().android >= 4);
        }

        return this._bSupport3d;
    }
    toRad(nDeg) {
        return nDeg * Math.PI / 180;
    }
    toDeg(nRad) {
        return nRad * 180 / Math.PI;
    }
    approximateValue(nValue) {
        return Math.round(nValue * 10000000) / 10000000;
    }
    fixAngle(nAngleRad) {
        var nAngleDeg = WGame.util.toDeg(nAngleRad);
        nAngleDeg -= Math.floor(nAngleDeg / 360) * 360;
        return WGame.util.toRad(nAngleDeg);
    }
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    getBoundary(aPoints) {
        var nMinX = aPoints[0][0];
        var nMaxX = aPoints[0][0];
        var nMinY = aPoints[0][1];
        var nMaxY = aPoints[0][1];

        for (var i = 1, len = aPoints.length; i < len; i++) {
            nMinX = Math.min(nMinX, aPoints[i][0]);
            nMaxX = Math.max(nMaxX, aPoints[i][0]);
            nMinY = Math.min(nMinY, aPoints[i][1]);
            nMaxY = Math.max(nMaxY, aPoints[i][1]);
        }

        return {
            left: nMinX,
            right: nMaxX,
            top: nMinY,
            bottom: nMaxY
        };
    }
    getBoundaryToPoints(htBoundary) {
        return [[htBoundary.left, htBoundary.top], [htBoundary.right, htBoundary.top], [htBoundary.right, htBoundary.bottom], [htBoundary.left, htBoundary.bottom]];
    }
    queryString() {
        var htResult = {};

        if (location.search) {
            var aParam = location.search.substr(1).split("&");

            for (var i = 0, len = aParam.length; i < len; i++) {
                var aKeyValue = aParam[i].split("=");
                htResult[aKeyValue.shift()] = aKeyValue.join("=");
            }
        }

        return htResult;
    }
    cloneObject(oSource) {
        var oReturn = {};

        for (var i in oSource) {
            oReturn[i] = oSource[i];
        }

        return oReturn;
    }
    pushWithSort(aTarget, oDisplayObject) {
        var bAdded = false;

        for (var i = 0, len = aTarget.length; i < len; i++) {
            if (aTarget[i]._htOption.zIndex > oDisplayObject._htOption.zIndex) {
                aTarget.splice(i, 0, oDisplayObject);
                bAdded = true;
                break;
            }
        }

        if (!bAdded) {
            aTarget.push(oDisplayObject);
        }
    }
    addEventListener(el, sName, fHandler, bUseCapture) {
        if ("addEventListener" in el) {
            el.addEventListener(sName, fHandler, bUseCapture);
        } else {
            el.attachEvent("on" + sName, fHandler, bUseCapture);
        }
    }
    removeEventListener(el, sName, fHandler, bUseCapture) {
        if ("removeEventListener" in el) {
            el.removeEventListener(sName, fHandler, bUseCapture);
        } else {
            el.detachEvent("on" + sName, fHandler, bUseCapture);
        }
    }
    stopEventDefault(e) {
        e = e || window.event;

        if ("preventDefault" in e) {
            e.preventDefault();
        }

        e.returnValue = false;
    }
    getPosition(el) {
        var elDocument = el.ownerDocument || el.document || document;
        var elHtml = elDocument.documentElement;
        var elBody = elDocument.body;
        var htPosition = {};

        if ("getBoundingClientRect" in el) {
            var htBox = el.getBoundingClientRect();
            htPosition.x = htBox.left;
            htPosition.x += elHtml.scrollLeft || elBody.scrollLeft;
            htPosition.y = htBox.top;
            htPosition.y += elHtml.scrollTop || elBody.scrollTop;
            htPosition.width = htBox.width;
            htPosition.height = htBox.height;
        } else {
            htPosition.x = 0;
            htPosition.y = 0;
            htPosition.width = el.offsetWidth;
            htPosition.height = el.offsetHeight;

            for (var o = el; o; o = o.offsetParent) {
                htPosition.x += o.offsetLeft;
                htPosition.y += o.offsetTop;
            }

            for (var o = el.parentNode; o; o = o.parentNode) {
                if (o.tagName === 'BODY') {
                    break;
                }

                if (o.tagName === 'TR') {
                    htPosition.y += 2;
                }

                htPosition.x -= o.scrollLeft;
                htPosition.y -= o.scrollTop;
            }
        }

        return htPosition;
    }
}
WGame.util = new util();

/**
 * 基础组件类
 */
class Component {

    constructor() {
        this._bInitOption = false;
        this._htOption = {};
        this._htOptionSetter = {};
        this._htHandler = {};
    }
    /**
     * 选项
     * @param {*} vName 名称
     * @param {*} vValue 值
     * @param {*} bNotOverwrite 如果为true，覆盖
     */
    option(vName, vValue, bNotOverwrite) {
        if (typeof vName === "object") {
            // 默认值
            if (!this._bInitOption) {
                this._htOption = WGame.util.cloneObject(vName);
                this._bInitOption = true;
            } else {
                for (var i in vName) {
                    this.option(i, vName[i], bNotOverwrite);
                }
            }
        } else if (typeof vName === "string") {
            if (vValue !== undefined) {
                if (!bNotOverwrite || typeof this._htOption[vName] === "undefined") {
                    this._htOption[vName] = vValue;

                    if (this._htOptionSetter[vName] !== undefined) {
                        this._htOptionSetter[vName](vValue);
                    }

                    this._bInitOption = true;
                }
            } else {
                return this._htOption[vName];
            }
        } else {
            return this._htOption;
        }
    }

    /**
     * 基础能力get
     * @param {*} sName 
     */
    get(sName) {
        return this.option(sName);
    }

    /**
     * 基础能力set
     * @param {*} sName 
     * @param {*} vValue 
     * @param {*} bNotOverwrite 
     */
    set(sName, vValue, bNotOverwrite) {
        this.option(sName, vValue, bNotOverwrite);
        return this;
    }

    /**
     * 去掉
     * @param {*} sKey 
     */
    unset(sKey) {
        if (this._htOption && typeof this._htOption[sKey] !== "undefined") {
            delete this._htOption[sKey];
        }
    }

    /**
     * 指定设置
     * @param {*} sName 
     * @param {*} fSetter 
     */
    optionSetter(sName, fSetter) {
        this._htOptionSetter[sName] = fSetter;
    }
    /**
     * 事件触发
     * @param {*} sName 
     * @param {*} oEvent 
     */
    fireEvent(sName, oEvent) {
        if (typeof this._htHandler[sName] !== "undefined" && this._htHandler[sName].length > 0) {
            oEvent = oEvent || {};
            oCustomEvent = new WGame.ComponentEvent(sName, oEvent);
            var aHandler = this._htHandler[sName].concat();
            var bCanceled = false;

            for (var i = 0, len = aHandler.length; i < len; i++) {
                this._htHandler[sName][i](oCustomEvent);
                if (oCustomEvent.isStop()) {
                    bCanceled = true;
                }
            }

            if (bCanceled) {
                return false;
            }
        }
        return true;
    }

    /**
     * 注册
     * @param {*} vEvent 
     * @param {*} fHandler 
     */
    attach(vEvent, fHandler) {
        if (typeof vEvent !== "string") {
            for (var i in vEvent) {
                this.attach(i, vEvent[i]);
            }
        } else {
            this._htHandler[vEvent] = this._htHandler[vEvent] || [];
            var aHandler = this._htHandler[vEvent];

            if (!fHandler) {
                return this;
            }

            for (var i = 0, len = aHandler.length; i < len; i++) {
                if (aHandler[i] === fHandler) {
                    return this;
                }
            }
            aHandler.push(fHandler);
        }
        return this;
    }

    /**
     * 注销
     * @param {*} vEvent 
     * @param {*} fHandler 
     */
    detach(vEvent, fHandler) {
        if (typeof vEvent !== "string") {
            for (var i in vEvent) {
                this.detach(i, vEvent[i]);
            }
        } else if (this._htHandler[vEvent] !== undefined) {
            var aHandler = this._htHandler[vEvent];

            if (!fHandler) {
                delete this._htHandler[vEvent];
            } else {
                for (var i = 0, len = aHandler.length; i < len; i++) {
                    if (aHandler[i] === fHandler) {
                        this._htHandler[vEvent].splice(i, 1);

                        if (this._htHandler[vEvent].length < 1) {
                            delete this._htHandler[vEvent];
                        }
                        break;
                    }
                }
            }
        }
    }
    /**
     * 注销所有
     * @param {*} sName 
     */
    detachAll(sName) {
        if (sName) {
            if (this._htHandler[sName] !== undefined) {
                this._htHandler[sName] = [];
            }
        } else {
            this._htHandler = {};
        }
    }
}
WGame.Component = Component;
/**
 * 基础事件类
 */
class ComponentEvent {

    constructor(sName, oEvent) {
        this.type = sName;
        this._bCanceled = false;
        if (oEvent) {
            for (var i in oEvent) {
                this[i] = oEvent[i];
            }
        }
    }
    /**
     * 停止
     */
    stop() {
        this._bCanceled = true;
    }
    /**
     * 是否停止
     */
    isStop() {
        return this._bCanceled;
    }
}
WGame.ComponentEvent = ComponentEvent;
/**
 * 
 * @extends Component
 * @param {Object} [htOption] Options
 * @param {String} [htOption.name]  对象名称，可以重复
 * @param {Number|String} [htOption.width="auto"] 宽度
 * @param {Number|String} [htOption.height="auto"] 高度
 * @param {Number|String} [htOption.x=0] x
 * @param {Number|String} [htOption.y=0] y
 * @param {Number} [htOption.zIndex=0] 层级
 * @param {Number} [htOption.opacity=1] 透明0-1
 * @param {Number} [htOption.angle=0] 角度
 * @param {Number} [htOption.scaleX=1] x缩放
 * @param {Number} [htOption.scaleY=1] y缩放
 * @param {Number} [htOption.originX=center] scale, angle x中心[left, right, center]
 * @param {Number} [htOption.originY=center] scale, angle y中心[top, bottom, center]
 * @param {Number} [htOption.offsetX=0] 背景x
 * @param {Number} [htOption.offsetY=0] 背景y
 * @param {Number} [htOption.spriteX=null] sprite的x
 * @param {Number} [htOption.spriteY=null] sprite的y
 * @param {Number} [htOption.spriteLength=0] 背景frame雪碧，雪碧横向宽度限制时可以指定完整的框架。height高度不大的情况下不适用。
 * @param {Number} [htOption.spriteSheet=null] 背景雪碧表名称，ImageManager中addSprite信息的情况下，可以使用
 * @param {Array} [htOption.rangeX=null] x的范围[min,max]
 * @param {Array} [htOption.rangeY=null] y的范围[min,max]
 * @param {Boolean} [htOption.positionRepeat=false] 边界
 * @param {String} [htOption.backgroundColor] 
 * @param {String} [htOption.backgroundImage] 
 * @param {String} [htOption.backgroundRepeat='no-repeat'] repeat, repeat-x, repeat-y, no-repeat, no-repeat
 * @param {Boolean} [htOption.fitImage=false] 图像缩放
 * @param {WGame.DisplayObject|Array} [htOption.hitArea] 点击范围 [[x1, y1], [x2, y2], ...] 
 * @param {Boolean} [htOption.debugHitArea=false]  
 * @param {Number} [htOption.velocityX=0] x速递
 * @param {Number} [htOption.velocityY=0] y速度
 * @param {Number} [htOption.velocityRotate=0] 角度的速度
 * @param {Number} [htOption.forceX=0] x转速
 * @param {Number} [htOption.forceY=0] y转速
 * @param {Number} [htOption.forceRotate=0] 
 * @param {Number} [htOption.mass=1] 质量
 * @param {Number} [htOption.friction=0] 摩擦力
 * @param {Boolean} [htOption.useRealTime=true] 
 * @param {Boolean} [htOption.useCache=false] 
 * @param {String|Boolean} [htOption.useEvent="auto"] 
 * @param {Boolean} [htOption.visible=true] 
 */
class DisplayObject extends Component {
    /**
     * 类型
     */
    type = "displayobject"

    constructor(htOption) {
        super(htOption);
        this._bInitOption = true;
        this._htOption = {
            name: "", // 名称
            width: 'auto',
            height: 'auto',
            x: 0,
            y: 0,
            zIndex: 0, // 层级
            opacity: 1, // 透明度
            angle: 0, // 旋转角度
            scaleX: 1,
            scaleY: 1,
            originX: "center",
            originY: "center",
            offsetX: 0,
            offsetY: 0,
            spriteX: null,
            spriteY: null,
            spriteLength: 0,
            spriteSheet: null,
            rangeX: null, // x的范围 [min, max]
            rangeY: null, // y的范围 [min, max]
            positionRepeat: false, // 边界停止
            backgroundColor: '', // 背景颜色
            backgroundImage: '', // 背景图片或资源组件
            backgroundRepeat: 'no-repeat', // 背景重复 repeat, repeat-x, repeat-y, no-repeat
            hitArea: null,
            debugHitArea: false,
            useCache: false,
            useEvent: "auto",
            fitImage: false, // 图像
            velocityX: 0,
            velocityY: 0,
            velocityRotate: 0,
            forceX: 0,
            forceY: 0,
            forceRotate: 0,
            mass: 1, // 质量
            friction: 0, // 摩擦
            useRealTime: true,
            visible: true //显示
        };

        if (htOption) {
            this.option(htOption);
        }

        this._htDirty = {};
        this._htMatrix = {};
        this._sId = ++WGame.DisplayObject._idx;
        this._elImage = null;
        this._aDisplayObjects = [];
        this._oLayer = null;
        this._oParent = null;
        this._oDrawing = null;
        this._bIsSetOption = false;
        this._bChanged = true;
        this._bChangedTransforms = true;
        this._bCustomSize = false;
        this._aChangedQueue = null;
        this._htGetImageData = null;
        this._htRelatedPosition = {};
        this._htParentRelatedPosition = {};
        this._htBoundary = {};
        this._sRenderingMode = null;
        this._bRetinaDisplay = WGame.Renderer.isRetinaDisplay();
        this._oTimerMove = null;
        this._nPositionRight = null;
        this._nPositionBottom = null;
        this._nImageWidth = 0;
        this._nImageHeight = 0;
        this._htImageSize = null;
        this._htSpriteSheet = null;
        this._htOrigin = {
            x: 0,
            y: 0
        };

        this.set(this._htOption);
        this._bIsSetOption = true;
    }
    /**
     * 设置
     * @param {*} vKey 
     * @param {*} vValue 
     * @param {*} bSkipSetter 
     * @param {*} bSkipChanged 
     */
    set(vKey, vValue, bSkipSetter, bSkipChanged) {
        if (typeof vKey === "object") {
            for (var i in vKey) {
                this.set(i, vKey[i]);
            }
        } else {
            if (this._bIsSetOption && this._htOption[vKey] === vValue) {
                return;
            }

            if (vKey === "width" || vKey === "height") {
                if (vValue !== "auto") {
                    this._bCustomSize = true;
                } else if (vValue === "auto" && this.getImage() !== null) {
                    vValue = this.getImageSize()[vKey];
                } else {
                    vValue = 100;
                }
            }

            this._htOption[vKey] = vValue;
            this.setDirty(vKey);

            if (!bSkipSetter) {
                this._setter(vKey, vValue);
            }

            if (!bSkipChanged) {
                this.setChanged((vKey === 'x' || vKey === 'y' || vKey === 'angle' || vKey === 'scaleX' || vKey === 'scaleY' || vKey === 'opacity') ? true : false);
            }
        }

        return this;
    }
    /**
     * 
     * @param {*} vKey 
     * @param {*} vValue 
     */
    _setter(vKey, vValue) {
        if (vKey === "zIndex") {
            if (this._oParent) {
                this._oParent.changeDisplayObjectZIndex(this);
            } else if (this.getLayer()) {
                this._oLayer.changeDisplayObjectZIndex(this);
            }
        }

        if (vKey === "x" || vKey === "y") {
            if (typeof vValue === "string") {
                this.align(vKey === "x" ? vValue : false, vKey === "y" ? vValue : false);
            }

            this._fixPosition();
            this.resetPositionCache();
        }

        if (vKey === "backgroundImage") {
            this.setImage(vValue);
        }

        if (vKey === 'spriteX' || vKey === 'spriteY' || vKey === 'spriteSheet') {
            this._setSpritePosition(vKey, vValue);
        }

        if (vKey === 'hitArea' && vValue instanceof Array) {
            this._makeHitAreaBoundary();
        }

        if (vKey === 'width' || vKey === 'height' || vKey === 'originX' || vKey === 'originY') {
            this._setOrigin();
        }

        if ((vKey === 'backgroundRepeat' && vValue !== 'no-repeat')) {
            this.set("useCache", true);
        }

        if (vKey === 'useCache' && this._oDrawing !== null && this._oDrawing.loadCache) {
            if (vValue) {
                this._oDrawing.loadCache();
            } else {
                this._oDrawing.unloadCache();
            }
        }
    }
    /**
     * 
     * @param {*} sKey 
     */
    get(sKey) {
        if (!sKey) {
            return this._htOption;
        } else {
            return this._htOption[sKey];
        }
    }
    /**
     * 
     * @param {*} sKey 
     */
    setDirty(sKey) {
        if (this._htDirty === null) {
            this._htDirty = {};
        }

        if (typeof sKey === "undefined") {
            for (var i in this._htOption) {
                this._htDirty[i] = true;
            }
        } else {
            this._htDirty[sKey] = true;
        }
    }
    /**
     * 
     * @param {*} sKey 
     */
    getDirty(sKey) {
        if (!sKey) {
            return this._htDirty;
        } else {
            return this._htDirty[sKey] ? true : false;
        }
    }
    /**
     * 
     */
    _resetDirty() {
        this._htDirty = null;
    }
    /**
     * 
     * @param {*} oDisplayObject 
     */
    addChild(oDisplayObject) {
        WGame.util.pushWithSort(this._aDisplayObjects, oDisplayObject);
        oDisplayObject.setParent(this);

        if (this._oLayer !== null) {
            oDisplayObject.setLayer(this._oLayer);
        }

        this.setChanged();
    }
    /**
     * 
     * @param {*} oDisplayObject 
     * @param {*} nIdx 
     */
    removeChild(oDisplayObject, nIdx) {
        if (typeof nIdx !== "undefined") {
            this._aDisplayObjects[nIdx].unsetLayer();
            this._aDisplayObjects[nIdx].unsetParent();
            this._aDisplayObjects.splice(nIdx, 1);
        } else {
            for (var i = 0, len = this._aDisplayObjects.length; i < len; i++) {
                if (this._aDisplayObjects[i] === oDisplayObject) {
                    this._aDisplayObjects[i].unsetLayer();
                    this._aDisplayObjects[i].unsetParent();
                    this._aDisplayObjects.splice(i, 1);
                    break;
                }
            }
        }

        this.setChanged();
    }
    /**
     * 
     * @param {*} oDisplayObject 
     */
    changeDisplayObjectZIndex(oDisplayObject) {
        this.removeChild(oDisplayObject);
        this.addChild(oDisplayObject);
    }
    /**
     * 
     * @param {*} oTarget 
     */
    addTo(oTarget) {
        if (this._oLayer || this._oParent) {
            if (this._oLayer === oTarget || this._oParent === oTarget) {
                return this;
            } else {
                this.leave();
            }
        }

        oTarget.addChild(this);
        return this;
    }
    /**
     * 
     */
    hasChild() {
        return this._aDisplayObjects.length > 0;
    }
    /**
     * 
     */
    getChildren() {
        return this._aDisplayObjects;
    }
    /**
     * 
     */
    getParent() {
        return this._oParent || false;
    }
    /**
     * 
     * @param {*} oDisplayObject 
     */
    setParent(oDisplayObject) {
        this._oParent = oDisplayObject;
    }
    unsetParent() {
        this._oParent = null;
    }
    leave() {
        var oParent = null;

        if (this._oParent !== null) {
            oParent = this._oParent;
        } else if (this._oLayer) {
            oParent = this.getLayer();
        }

        if (oParent) {
            oParent.removeChild(this);
        }

        return this;
    }
    getId() {
        return this._sId;
    }
    getImage() {
        return this._elImage || null;
    }
    getImageSize() {
        return this._htImageSize || false;
    }
    /**
     * 
     * @param {*} vImage 
     */
    setImage(vImage) {
        if (typeof vImage === "string" || !vImage) {
            if (this._htGetImageData !== null && this._htGetImageData.name !== vImage) {
                WGame.ImageManager.cancelGetImage(this._htGetImageData.name, this._htGetImageData.callback);
                this._htGetImageData = null;
            }

            if (!vImage) {
                this._elImage = null;
                this.setChanged();
            } else {
                this._htGetImageData = {
                    name: vImage,
                    callback: (function (elImage) {
                        this.setImage(elImage);
                    }).bind(this)
                };

                WGame.ImageManager.getImage(this._htGetImageData.name, this._htGetImageData.callback);
            }

            return;
        }

        // 같은 이미지면 적용하지 않음
        if (this._elImage && this._elImage === vImage) {
            return;
        }

        // reflow 예방을 위한 이미지 크기 캐시
        this._elImage = vImage;
        this._nImageWidth = vImage.width;
        this._nImageHeight = vImage.height;
        this._htImageSize = {
            width: this._bRetinaDisplay ? this._nImageWidth / 2 : this._nImageWidth,
            height: this._bRetinaDisplay ? this._nImageHeight / 2 : this._nImageHeight
        };
        this._htSpriteSheet = WGame.ImageManager.getSprite(this._htOption.backgroundImage);

        if (!this._bCustomSize) {
            this.set({
                width: this._htImageSize.width,
                height: this._htImageSize.height
            });
        }

        this._setSpritePosition("spriteSheet", this._htOption.spriteSheet);
        this._setSpritePosition("spriteX", this._htOption.spriteX);
        this._setSpritePosition("spriteY", this._htOption.spriteY);
        this.setDirty("backgroundImage");
        this.setChanged();
    }
    getDrawing() {
        return this._oDrawing;
    }
    setChanged(bChangedTransforms) {
        if (this._bChanged || (bChangedTransforms && this._bChangedTransforms)) {
            return;
        }

        if (this._oLayer !== null) {
            this._oLayer.setChanged();
        }

        if (!bChangedTransforms) {
            this._bChanged = true;
        }

        this._bChangedTransforms = true;

        if (this._oParent) {
            this._oParent.setChanged(false); // transforms만 바꼈어도 부모에게는 전체가 바뀐것으로 통보
        }
    }
    unsetChanged() {
        this._bChanged = false;
        this._bChangedTransforms = false;
    }
    isChanged(bChangedOnlyTranforms) {
        return !bChangedOnlyTranforms ? (this._bChanged || this._bChangedTransforms) : !this._bChanged && this._bChangedTransforms;
    }
    setLayer(oLayer) {
        if (this._sId in WGame.DisplayObject.htFactory) {
            throw new Error('不存在的disable id：' + this._sId);
        }

        WGame.DisplayObject.htFactory[this._sId] = this;
        this._oLayer = oLayer;
        this._sRenderingMode = this._oLayer.getRenderingMode();
        this._makeDrawing();
        this._oDrawing.load();
        this.setChanged();

        if (typeof this._htOption.x === "string" || typeof this._htOption.y === "string") {
            this.align(typeof this._htOption.x === "string" ? this._htOption.x : false, typeof this._htOption.y === "string" ? this._htOption.y : false);
        }

        if (this._nPositionRight !== null) {
            this.right(this._nPositionRight);
            this._nPositionRight = null;
        }

        if (this._nPositionBottom !== null) {
            this.bottom(this._nPositionBottom);
            this._nPositionBottom = null;
        }

        for (var i = 0, len = this._aDisplayObjects.length; i < len; i++) {
            this._aDisplayObjects[i].setLayer(oLayer);
        }
    }
    unsetLayer() {
        if (this.getLayer()) {
            for (var i = 0, len = this._aDisplayObjects.length; i < len; i++) {
                this._aDisplayObjects[i].unsetLayer();
            }

            this._oDrawing.unload();
            this.setDirty();
            this.setChanged();
            this._sRenderingMode = null;
            this._oDrawing = null;
            this._oLayer = null;
            delete WGame.DisplayObject.htFactory[this._sId];
        }
    }
    _makeDrawing() {
        if (this._oDrawing === null) {
            this._oDrawing = this._sRenderingMode === "dom" ? new WGame.DisplayObjectDOM(this) : new WGame.DisplayObjectCanvas(this);
        }
    }
    getLayer() {
        return this._oLayer || false;
    }
    addMatrix(vMatrix) {
        if (vMatrix instanceof Array) {
            for (var i = 0, len = vMatrix.length; i < len; i++) {
                this.addMatrix(vMatrix[i]);
            }
            return;
        }

        this._htMatrix[vMatrix.name] = vMatrix;
        delete this._htMatrix[vMatrix.name].name;
    }
    changeMatrix(sName) {
        if (sName in this._htMatrix) {
            this.set(this._htMatrix[sName]);
        }
    }
    update(nFrameDuration, nX, nY, nLayerWidth, nLayerHeight, oContext) {
        this._updateMovableOption(nFrameDuration);

        if (this._sRenderingMode === "canvas" && !this._htOption.visible) {
            this.unsetChanged();
            return;
        }

        nX += this._htOption.x;
        nY += this._htOption.y;

        if (
            (this._sRenderingMode === "dom" && this.isChanged()) || (
                this._sRenderingMode === "canvas" && (
                    nX + this._htOption.width >= 0 ||
                    nX <= nLayerWidth ||
                    nY + this._htOption.height >= 0 ||
                    nY <= nLayerHeight
                )
            )) {
            this._oDrawing.draw(nFrameDuration, nX, nY, nLayerWidth, nLayerHeight, oContext);
        }

        this.unsetChanged();
        this._resetDirty();

        if (
            this._htOption.velocityX !== 0 ||
            this._htOption.velocityY !== 0 ||
            this._htOption.velocityRotate !== 0 ||
            this._htOption.forceX !== 0 ||
            this._htOption.forceY !== 0 ||
            this._htOption.forceRotate !== 0
        ) {
            this.setChanged(true);
        }

        if (this._sRenderingMode === "canvas" || !this._htOption.visible) {
            return;
        }

        if (this.hasChild()) {
            for (var i = 0, len = this._aDisplayObjects.length; i < len; i++) {
                this._aDisplayObjects[i].update(nFrameDuration, nX, nY, nLayerWidth, nLayerHeight);
            }
        }
    }
    _updateMovableOption(nFrameDuration) {
        if (
            this._htOption.velocityX !== 0 ||
            this._htOption.velocityY !== 0 ||
            this._htOption.velocityRotate !== 0 ||
            this._htOption.forceX !== 0 ||
            this._htOption.forceY !== 0 ||
            this._htOption.forceRotate !== 0
        ) {
            var nFrame = Math.max(17, nFrameDuration) / 1000;

            if (!this._htOption.useRealTime) {
                nFrame = 1;
            }

            var nVelocityX = this._htOption.velocityX;
            var nVelocityY = this._htOption.velocityY;
            var nX = this._htOption.x;
            var nY = this._htOption.y;

            nVelocityX += (this._htOption.forceX / this._htOption.mass) * nFrame;
            nVelocityY += (this._htOption.forceY / this._htOption.mass) * nFrame;

            var nForceFrictionX = this._htOption.friction * nVelocityX * this._htOption.mass * nFrame;
            var nForceFrictionY = this._htOption.friction * nVelocityY * this._htOption.mass * nFrame;

            if (nVelocityX !== 0) {
                nVelocityX = (Math.abs(nVelocityX) / nVelocityX !== Math.abs(nVelocityX - nForceFrictionX) / (nVelocityX - nForceFrictionX)) ? 0 : nVelocityX - nForceFrictionX;
            }

            if (nVelocityY !== 0) {
                nVelocityY = (Math.abs(nVelocityY) / nVelocityY !== Math.abs(nVelocityY - nForceFrictionY) / (nVelocityY - nForceFrictionY)) ? 0 : nVelocityY - nForceFrictionY;
            }

            nX += nVelocityX * nFrame;
            nY += nVelocityY * nFrame;
            nVelocityX = Math.floor(nVelocityX * 1000) / 1000;
            nVelocityY = Math.floor(nVelocityY * 1000) / 1000;

            if (this._htOption.friction && Math.abs(nVelocityX) < 0.05) {
                nVelocityX = 0;
            }

            if (this._htOption.friction && Math.abs(nVelocityY) < 0.05) {
                nVelocityY = 0;
            }

            if (
                nX !== this._htOption.x ||
                nY !== this._htOption.y ||
                nVelocityX !== this._htOption.velocityX ||
                nVelocityY !== this._htOption.velocityY
            ) {
                this.set("x", nX);
                this.set("y", nY);
                this.set("velocityX", nVelocityX);
                this.set("velocityY", nVelocityY);
            }

            if (this._htOption.forceRotate !== 0) {
                this.set("velocityRotate", this._htOption.velocityRotate + this._htOption.forceRotate);
            }

            if (this._htOption.velocityRotate !== 0) {
                var nAngleRad = WGame.util.fixAngle(WGame.util.toRad(this._htOption.angle + this._htOption.velocityRotate * nFrame));
                this.set("angle", Math.round(WGame.util.toDeg(nAngleRad) * 1000) / 1000);
            }
        }
    }
    getRelatedPosition() {
        if (this._htRelatedPosition.x === null) {
            this._htRelatedPosition.x = this._htOption.x;
            this._htRelatedPosition.y = this._htOption.y;

            if (this._oParent) {
                var htPosition = this._oParent.getRelatedPosition();
                this._htRelatedPosition.x += htPosition.x;
                this._htRelatedPosition.y += htPosition.y;
            }
        }

        return this._htRelatedPosition;
    }
    getBoundary(bWithRelatedPosition, bWithPoints) {
        var htBoundary = WGame.Transform.getBoundary(this, bWithPoints);
        this._htBoundary.left = htBoundary.left;
        this._htBoundary.right = htBoundary.right;
        this._htBoundary.top = htBoundary.top;
        this._htBoundary.bottom = htBoundary.bottom;
        this._htBoundary.isTransform = htBoundary.isTransform;
        this._htBoundary.points = htBoundary.points;

        if (bWithRelatedPosition) {
            var htPos = this.getRelatedPosition();

            if (this._htBoundary.points) {
                for (var i = 0, l = this._htBoundary.points.length; i < l; i++) {
                    this._htBoundary.points[i][0] += htPos.x;
                    this._htBoundary.points[i][1] += htPos.y;
                }
            }

            this._htBoundary.left += htPos.x;
            this._htBoundary.right += htPos.x;
            this._htBoundary.top += htPos.y;
            this._htBoundary.bottom += htPos.y;
        }

        return this._htBoundary;
    }
    resetPositionCache() {
        this._htRelatedPosition.x = null;
        this._htRelatedPosition.y = null;

        if (this.hasChild()) {
            for (var i = 0, l = this._aDisplayObjects.length; i < l; i++) {
                this._aDisplayObjects[i].resetPositionCache();
            }
        }
    }
    getHitAreaBoundary() {
        if (!this._htOption.hitArea) {
            return this.getBoundary(true);
        } else if (this._htOption.hitArea instanceof Array) {
            var aPoints = WGame.Transform.points(this, WGame.util.getBoundaryToPoints(this._htHitAreaBoundary));
            var htBoundary = WGame.util.getBoundary(aPoints);
            var htPos = this.getRelatedPosition();

            return {
                left: htBoundary.left + htPos.x,
                right: htBoundary.right + htPos.x,
                top: htBoundary.top + htPos.y,
                bottom: htBoundary.bottom + htPos.y
            };
        } else {
            return this._htOption.hitArea.getBoundary(true);
        }
    }
    getOrigin() {
        return this._htOrigin;
    }
    _setOrigin() {
        switch (this._htOption.originX) {
            case "left":
                this._htOrigin.x = 0;
                break;

            case "right":
                this._htOrigin.x = this._htOption.width;
                break;

            case "center":
                this._htOrigin.x = this._htOption.width / 2;
                break;

            default:
                this._htOrigin.x = parseInt(this._htOption.originX, 10);
        }

        switch (this._htOption.originY) {
            case "top":
                this._htOrigin.y = 0;
                break;

            case "bottom":
                this._htOrigin.y = this._htOption.height;
                break;

            case "center":
                this._htOrigin.y = this._htOption.height / 2;
                break;

            default:
                this._htOrigin.y = parseInt(this._htOption.originY, 10);
        }
    }
    _fixPosition() {
        var nX = this._htOption.x;
        var nY = this._htOption.y;
        var nMinX;
        var nMaxX;
        var nMinY;
        var nMaxY;

        if (this._htOption.rangeX) {
            nMinX = this._htOption.rangeX[0];
            nMaxX = this._htOption.rangeX[1];

            if (this._htOption.positionRepeat) {
                if (nX < nMinX) { // 
                    do {
                        nX += (nMaxX - nMinX);
                    } while (nX < nMinX);
                } else if (nX > nMaxX) { //
                    do {
                        nX -= (nMaxX - nMinX);
                    } while (nX > nMaxX);
                }
            } else {
                nX = Math.max(nMinX, nX);
                nX = Math.min(nMaxX, nX);
            }

            if (nX !== this._htOption.x) {
                this.set("x", nX, true);
            }
        }

        if (this._htOption.rangeY) {
            nMinY = this._htOption.rangeY[0];
            nMaxY = this._htOption.rangeY[1];

            if (this._htOption.positionRepeat) {
                if (nY < nMinY) { // 
                    do {
                        nY += (nMaxY - nMinY);
                    } while (nY < nMinY);
                } else if (nY > nMaxY) { //
                    do {
                        nY -= (nMaxY - nMinY);
                    } while (nY > nMaxY);
                }
            } else {
                nY = Math.max(nMinY, nY);
                nY = Math.min(nMaxY, nY);
            }

            if (nY !== this._htOption.y) {
                this.set("y", nY, true);
            }
        }
    }
    _makeHitAreaBoundary() {
        this._htHitAreaBoundary = WGame.util.getBoundary(this._htOption.hitArea);
    }


    align(sHorizontal, sVertical, oBaseObject) {
        if (!this.getLayer()) {
            return;
        }

        oBaseObject = oBaseObject || this.getParent();
        var nWidth = 0;
        var nHeight = 0;
        var nX = 0;
        var nY = 0;

        if (oBaseObject) {
            nWidth = oBaseObject._htOption.width;
            nHeight = oBaseObject._htOption.height;
        } else {
            nWidth = this._oLayer._htOption.width;
            nHeight = this._oLayer._htOption.height;
        }

        if (sHorizontal !== false) {
            nX = (sHorizontal === "right") ? nWidth - this._htOption.width : nWidth / 2 - this._htOption.width / 2;
            this.set("x", nX);
        }

        if (sVertical !== false) {
            nY = (sVertical === "bottom") ? nHeight - this._htOption.height : nHeight / 2 - this._htOption.height / 2;
            this.set("y", nY);
        }
    }


    right(nPosition) {
        var nWidth = 0;

        if (this._oParent) {
            nWidth = this._oParent._htOption.width;
        }

        if (!nWidth && this._oLayer) {
            nWidth = this._oLayer._htOption.width;
        }

        if (nWidth) {
            this.set("x", nWidth - (this._htOption.width + nPosition));
        } else {
            this._nPositionRight = nPosition;
        }

        return this;
    }


    bottom(nPosition) {
        var nHeight = 0;

        if (this._oParent) {
            nHeight = this._oParent.get("height");
        }

        if (!nHeight && this._oLayer) {
            nHeight = this._oLayer.option("height");
        }

        if (nHeight) {
            this.set("y", nHeight - (this._htOption.height + nPosition));
        } else {
            this._nPositionBottom = nPosition;
        }

        return this;
    }
    resizeFixedRatio(nWidth, nHeight) {
        if (this.getImage()) {
            var nImageWidth = this.getImage().width;
            var nImageHeight = this.getImage().height;

            if (nWidth) {
                nHeight = nWidth * (nImageHeight / nImageWidth);
            } else if (nHeight) {
                nWidth = nHeight * (nImageWidth / nImageHeight);
            }

            this.set("width", Math.round(nWidth));
            this.set("height", Math.round(nHeight));
        }
    }
    _setSpritePosition(sKey, nValue) {
        if (this._elImage && nValue !== null) {
            if (this._htOption.spriteSheet !== null) {
                var sheet = this._htSpriteSheet[this._htOption.spriteSheet];
                var nOffsetX;
                var nOffsetY;

                if (sKey === "spriteSheet" && this._htSpriteSheet && this._htSpriteSheet[nValue]) {
                    if (typeof sheet[0][0] !== "undefined") {
                        if (this._htOption.spriteX !== null) { // 이미 spriteX가 있다면
                            nOffsetX = sheet[this._htOption.spriteX][0];
                            nOffsetY = sheet[this._htOption.spriteX][1];
                        } else {
                            nOffsetX = sheet[0][0];
                            nOffsetY = sheet[0][1];
                        }
                    } else {
                        nOffsetX = sheet[0];
                        nOffsetY = sheet[1];
                    }

                    this.set("offsetX", nOffsetX, true);
                    this.set("offsetY", nOffsetY, true);
                } else if (sKey === "spriteX" && typeof sheet[nValue] !== "undefined") {
                    this.set("offsetX", sheet[nValue][0], true);
                    this.set("offsetY", sheet[nValue][1], true);
                }
            } else {
                var htImageSize = this.getImageSize();
                var nWidth = this._htOption.width;
                var nHeight = this._htOption.height;
                var nSpriteLength = this._htOption.spriteLength - 1; // 
                var nMaxSpriteX = (htImageSize.width / this._htOption.width) - 1;
                var nMaxSpriteY = (htImageSize.height / this._htOption.height) - 1;
                var nMaxOffsetX = htImageSize.width - 1;
                var nMaxOffsetY = htImageSize.height - 1;

                if (nSpriteLength >= 0 && nHeight < htImageSize.height) {
                    nMaxOffsetX = nMaxSpriteX * htImageSize.width;
                    nMaxOffsetY = nMaxSpriteY * htImageSize.height;
                }

                switch (sKey) {
                    case "spriteX":
                        var nOffsetX = 0;
                        var nOffsetY = 0;

                        if (nSpriteLength > nMaxSpriteX && nHeight < htImageSize.height) {
                            nOffsetY = Math.floor(nValue / (nMaxSpriteX + 1)) * nHeight;
                            nOffsetX = (nValue % (nMaxSpriteX + 1)) * nWidth;
                        } else {
                            nOffsetX = Math.min(nValue, nMaxSpriteX) * nWidth;
                        }

                        this.set("offsetX", nOffsetX, true);
                        this.set("offsetY", nOffsetY, true);
                        break;

                    case "spriteY":
                        nValue = Math.min(nValue, nMaxSpriteY);
                        this.set("offsetY", nValue * nHeight, true);
                        break;
                }
            }
        }
    }
    hasAttachedHandler() {
        if (
            this._htHandler &&
            (("click" in this._htHandler) && this._htHandler.click.length > 0) ||
            (("mousedown" in this._htHandler) && this._htHandler.mousedown.length > 0) ||
            (("mouseup" in this._htHandler) && this._htHandler.mouseup.length > 0)
        ) {
            return true;
        } else {
            return false;
        }
    }
    move(nX, nY, nVelocity, fCallback) {
        var nCurrentX = this._htOption.x;
        var nCurrentY = this._htOption.y;
        var nDistance = WGame.util.getDistance(nCurrentX, nCurrentY, nX, nY);
        var nDuration = Math.round((nDistance / nVelocity) * 1000);

        if (this._oTimerMove !== null) {
            this._oTimerMove.stop();
            this._oTimerMove = null;
        }

        if (!nVelocity || nDuration < WGame.Renderer.getInfo().fps) {
            this.set({
                x: nX,
                y: nY
            });


            if (fCallback) {
                fCallback(this);
            }
        } else {
            var htOption = {
                from: [nCurrentX, nCurrentY],
                to: [nX, nY],
                set: ["x", "y"]
            };

            if (fCallback) {
                htOption.onComplete = function () {
                    fCallback(this);
                };
            }

            this._oTimerMove = WGame.Timer.transition(this, nDuration, htOption);
            return this._oTimerMove;
        }
    }
    moveBy(nX, nY, nVelocity, fCallback) {
        var nCurrentX = this._htOption.x;
        var nCurrentY = this._htOption.y;
        return this.move(nCurrentX + nX, nCurrentY + nY, nVelocity, fCallback);
    }
    toString() {
        return "DisplayObject" + (this._htOption.name ? " " + this._htOption.name : "") + " #" + this.getId() + (this.getImage() ? "(image:" + this.getImage().src + ")" : "");
    }
    clone(bRecursive) {
        var oDisplayObject = new this.constructor(this._htOption);

        if (bRecursive && this._aDisplayObjects.length) {
            for (var i = 0, l = this._aDisplayObjects.length; i < l; i++) {
                this._aDisplayObjects[i].clone(true).addTo(oDisplayObject);
            }
        }

        return oDisplayObject;
    }
}
WGame.DisplayObject = DisplayObject;
WGame.DisplayObject._idx = 0;
WGame.DisplayObject.htFactory = {};

class MovableObject extends DisplayObject {
    constructor(props) {
        super(props)
    }
}
WGame.MovableObject = MovableObject;

/**
 * 
 */
class LayerCanvas {
    constructor(oLayer) {
        this._oLayer = oLayer;
        this._oEvent = oLayer.getEvent();
        this._htDeviceInfo = WGame.util.getDeviceInfo();
        this._initCanvas();
    }
    _initCanvas() {
        var htSize = this._getLayerSize();
        this._elCanvas = wx.createCanvas();
        this._elCanvas.width = htSize.width;
        this._elCanvas.height = htSize.height;
        this._elCanvas.className = "_WGame_layer";
        this._elCanvas.style.position = "absolute";
        this._elCanvas.style.left = this._oLayer.option("x") + "px";
        this._elCanvas.style.top = this._oLayer.option("y") + "px";

        if (WGame.Renderer.isRetinaDisplay()) {
            this._elCanvas.style.width = (htSize.width / 2) + "px";
            this._elCanvas.style.height = (htSize.height / 2) + "px";
        }

        this._oContext = this._elCanvas.getContext('2d');
    }
    _getLayerSize(nWidth, nHeight) {
        nWidth = nWidth || this._oLayer.option("width");
        nHeight = nHeight || this._oLayer.option("height");

        if (WGame.Renderer.isRetinaDisplay()) {
            nWidth *= 2;
            nHeight *= 2;
        }

        return {
            width: nWidth,
            height: nHeight
        };
    }
    getContext() {
        return this._oContext;
    }
    getElement() {
        return this._elCanvas;
    }
    clear(oContext) {
        oContext = oContext || this.getContext();

        if (!this._htDeviceInfo.android || (this._htDeviceInfo.android < 4.12 && this._htDeviceInfo.android >= 4.2)) {
            oContext.clearRect(0, 0, this._elCanvas.width + 1, this._elCanvas.height + 1);
        } else {
            this._elCanvas.width = this._elCanvas.width;
        }
    }
    resize(nWidth, nHeight, bExpand) {
        var htSize = this._getLayerSize(nWidth, nHeight);

        if (bExpand) {
            this._elCanvas.style.width = nWidth + "px";
            this._elCanvas.style.height = nHeight + "px";
            var nRatioWidth = nWidth / this._oLayer.option("width");
            var nRatioHeight = nHeight / this._oLayer.option("height");
            this._oEvent.setEventRatio(nRatioWidth, nRatioHeight);
        } else {
            var nCanvasWidth = typeof nWidth === 'number' ? htSize.width : this._elCanvas.width;
            var nCanvasHeight = typeof nHeight === 'number' ? htSize.height : this._elCanvas.height;
            this.clear(this._oContext);
            this._oLayer.setChanged();
            this._elCanvas.width = nCanvasWidth;
            this._elCanvas.height = nCanvasHeight;

            if (WGame.Renderer.isRetinaDisplay()) {
                this._elCanvas.style.width = nCanvasWidth / 2 + "px";
                this._elCanvas.style.height = nCanvasHeight / 2 + "px";
            }
        }
    }
}
WGame.LayerCanvas = LayerCanvas;

/**
 * 
 */
class LayerEvent {
    THRESHOLD_CLICK = 7
    constructor(oLayer) {
        this._oLayer = oLayer;
        this._bHasTouchEvent = !!('ontouchstart' in window);
        this._fOnEvent = this._onEvent.bind(this);
        this._oMousedownObject = null;
        this._htEventRatio = {
            width: 1,
            height: 1
        };
        this._bAttached = false;
    }
    attachEvent() {
        var el = this._oLayer.getParent();

        if (this._bHasTouchEvent) {
            WGame.util.addEventListener(el, "touchstart", this._fOnEvent);
            WGame.util.addEventListener(el, "touchend", this._fOnEvent);
            WGame.util.addEventListener(el, "touchmove", this._fOnEvent);
            WGame.util.addEventListener(el, "touchcancel", this._fOnEvent);
        } else {
            WGame.util.addEventListener(el, "mousedown", this._fOnEvent);
            WGame.util.addEventListener(el, "mouseup", this._fOnEvent);
            WGame.util.addEventListener(el, "mousemove", this._fOnEvent);
        }

        this._bAttached = true;
    }

	/**
	 * @private
	 */
    detachEvent() {
        var el = this._oLayer.getParent();

        if (this._bAttached) {
            if (this._bHasTouchEvent) {
                WGame.util.removeEventListener(el, "touchstart", this._fOnEvent);
                WGame.util.removeEventListener(el, "touchend", this._fOnEvent);
                WGame.util.removeEventListener(el, "touchmove", this._fOnEvent);
                WGame.util.removeEventListener(el, "touchcancel", this._fOnEvent);
            } else {
                WGame.util.removeEventListener(el, "mousedown", this._fOnEvent);
                WGame.util.removeEventListener(el, "mouseup", this._fOnEvent);
                WGame.util.removeEventListener(el, "mousemove", this._fOnEvent);
            }

            this._bAttached = false;
        }
    }

    _onEvent(e) {
        if (!this._oLayer._htOption.useEvent) {
            return;
        }

        e = e || window.event;
        var oEvent = this._bHasTouchEvent ? e.changedTouches[0] : e || window.event;
        var el = this._bHasTouchEvent ? this._getEventTargetElement(e) : e.target || e.srcElement;
        var oDocument = el.ownerDocument || document;
        var oBody = oDocument.body || oDocument.documentElement;
        var nPageX = this._bHasTouchEvent ? oEvent.pageX : oEvent.pageX || oEvent.clientX + oBody.scrollLeft - oDocument.body.clientLeft;
        var nPageY = this._bHasTouchEvent ? oEvent.pageY : oEvent.pageY || oEvent.clientY + oBody.scrollTop - oDocument.body.clientTop;
        var sType = e.type;
        var oDisplayObject = null;

        var htPosition = this._oLayer.getParentPosition();
        var nRelatedX = nPageX - htPosition.x - this._oLayer._htOption.x;
        var nRelatedY = nPageY - htPosition.y - this._oLayer._htOption.y;
        nRelatedX = nRelatedX / this._htEventRatio.width;
        nRelatedY = nRelatedY / this._htEventRatio.height;

        if (sType === "touchcancel") {
            if (this._htEventStartPos !== null) {
                nRelatedX = this._htEventStartPos.x;
                nRelatedY = this._htEventStartPos.y;
            }
        }

        sType = this._convertEventType(sType);

        if (sType === "mousemove" || sType === "mousedown") {
            if (WGame.Renderer.isPreventDefault()) {
                WGame.util.stopEventDefault(e);
            }
        }

        if (sType === "mousedown") {
            this._htEventStartPos = {
                x: nRelatedX,
                y: nRelatedY
            };
        }

        var bFiredEventOnTarget = this._fireEvent(e, sType, nRelatedX, nRelatedY);

        if (sType === "mouseup") {
            var nThresholdX = this.THRESHOLD_CLICK;
            var nThresholdY = this.THRESHOLD_CLICK;

            if (
                this._htEventStartPos &&
                this._htEventStartPos.x - nThresholdX <= nRelatedX &&
                nRelatedX <= this._htEventStartPos.x + nThresholdX &&
                this._htEventStartPos.y - nThresholdY <= nRelatedY &&
                nRelatedY <= this._htEventStartPos.y + nThresholdY
            ) {
                this._fireEvent(e, "click", nRelatedX, nRelatedY);
            }

            this._htEventStartPos = null;
        }

        WGame.Renderer.setEventStatus(sType, bFiredEventOnTarget);
    }


    _fireEvent(e, sType, nX, nY) {
        var oDisplayObject = null;
        var bIsNotStoppedBubbling = true;

        if (sType !== "mousemove" && !WGame.Renderer.isStopEvent(sType)) {
            var aDisplayObjects = this._oLayer.getChildren();
            oDisplayObject = this._getTargetOnHitEvent(aDisplayObjects, nX, nY);

            if (oDisplayObject) {
                bIsNotStoppedBubbling = this._bubbleEvent(oDisplayObject, sType, e, nX, nY);

                if (sType === "mousedown") {
                    this._setMousedownObject(oDisplayObject);
                }
                if (sType === "mouseup") {
                    this._unsetMousedownObject(oDisplayObject);
                }
            }
        }

        if (sType === "mouseup" && this._getMousedownObject() !== null) {
            oDisplayObject = this._getMousedownObject();
            this._bubbleEvent(oDisplayObject, sType, e, nX, nY);
            this._unsetMousedownObject(oDisplayObject);
        }


        if (bIsNotStoppedBubbling) { // stop되면 Layer이벤트도 일어나지 않는다
            this._oLayer.fireEvent(sType, {
                event: e,
                displayObject: oDisplayObject,
                x: nX,
                y: nY
            });
        }

        return !!oDisplayObject;
    }


    _getTargetOnHitEvent(vDisplayObject, nX, nY) {
        var oTargetObject = null;

        if (vDisplayObject instanceof Array) {
            for (var i = vDisplayObject.length - 1; i >= 0; i--) {
                if (vDisplayObject[i].hasChild()) {
                    oTargetObject = this._getTargetOnHitEvent(vDisplayObject[i].getChildren(), nX, nY);

                    if (oTargetObject) {
                        return oTargetObject;
                    }
                }

                oTargetObject = this._getTargetOnHitEvent(vDisplayObject[i], nX, nY);

                if (oTargetObject) {
                    return oTargetObject;
                }
            }
        } else {
            return this._isPointInDisplayObjectBoundary(vDisplayObject, nX, nY) ? vDisplayObject : false;
        }
    }


    _convertEventType(sType) {
        var sConvertedType = sType;

        switch (sType) {
            case "touchstart":
                sConvertedType = "mousedown";
                break;

            case "touchmove":
                sConvertedType = "mousemove";
                break;

            case "touchend":
            case "touchcancel":
                sConvertedType = "mouseup";
                break;

            case "tap":
                sConvertedType = "click";
                break;
        }

        return sConvertedType;
    }

    _getEventTargetElement(e) {
        var el = e.target;

        while (el.nodeType != 1) {
            el = el.parentNode;
        }

        return el;
    }


    _bubbleEvent(oDisplayObject, sType, e, nX, nY, oCurrentObject) {

        if (oDisplayObject.fireEvent(sType, {
            displayObject: oCurrentObject || oDisplayObject,
            event: e,
            x: nX,
            y: nY
        }) === false) {
            return false;
        }

        if (oDisplayObject.getParent() && !this._bubbleEvent(oDisplayObject.getParent(), sType, e, nX, nY, oDisplayObject)) {
            return false;
        }

        return true;
    }


    _isPointInDisplayObjectBoundary(oDisplayObject, nPointX, nPointY) {
        if (
            !oDisplayObject._htOption.useEvent ||
            !oDisplayObject._htOption.visible ||
            !oDisplayObject._htOption.width ||
            !oDisplayObject._htOption.height ||
            (oDisplayObject._htOption.useEvent === "auto" && !oDisplayObject.hasAttachedHandler())
        ) {
            return false;
        }

        var htHitArea = oDisplayObject.getHitAreaBoundary();

        if (
            htHitArea.left <= nPointX && nPointX <= htHitArea.right &&
            htHitArea.top <= nPointY && nPointY <= htHitArea.bottom
        ) {
            if (!oDisplayObject._htOption.hitArea) {
                return true;
            } else {
                var htPos = oDisplayObject.getRelatedPosition();

                nPointX -= htPos.x;
                nPointY -= htPos.y;

                var aHitArea = oDisplayObject._htOption.hitArea;
                aHitArea = WGame.Transform.points(oDisplayObject, aHitArea);
                return this._isPointInPolygon(aHitArea, nPointX, nPointY);
            }
        }

        return false;
    }


    _isPointInPolygon(aVertices, nX, nY) {
        var bIntersects = false;

        for (var i = 0, j = aVertices.length - 1, len = aVertices.length; i < len; j = i++) {
            if (
                (aVertices[i][1] > nY) !== (aVertices[j][1] > nY) &&
                (nX < (aVertices[j][0] - aVertices[i][0]) * (nY - aVertices[i][1]) / (aVertices[j][1] - aVertices[i][1]) + aVertices[i][0])
            ) {
                bIntersects = !bIntersects;
            }
        }

        return bIntersects;
    }


    _setMousedownObject(oDisplayObject) {
        this._oMousedownObject = oDisplayObject;
    }


    _unsetMousedownObject(oDisplayObject) {
        if (this._oMousedownObject === oDisplayObject) {
            this._oMousedownObject = null;
        }
    }


    _getMousedownObject() {
        return this._oMousedownObject;
    }

    setEventRatio(nWidth, nHeight) {
        this._htEventRatio.width = nWidth || this._htEventRatio.width;
        this._htEventRatio.height = nHeight || this._htEventRatio.height;
    }

    getEventRatio() {
        return this._htEventRatio;
    }
}
WGame.LayerEvent = LayerEvent;
/**
 * 
 */
class Layer extends Component {
    type = "layer";
    constructor(htOption) {
        super(htOption);
        this.option({
            x: 0,
            y: 0,
            width: 320, // 
            height: 480, // 
            useEvent: true,
            visible: true,
            freeze: false,
            renderingMode: "inherit"
        });

        this._sAlignLeft = null;
        this._sAlignTop = null;


        if (htOption !== undefined) {
            if (("x" in htOption) && (htOption.x === "left" || htOption.x === "right" || htOption.x === "center")) {
                this._sAlignLeft = htOption.x;
                htOption.x = 0;
            }

            if (("y" in htOption) && (htOption.y === "top" || htOption.y === "bottom" || htOption.y === "center")) {
                this._sAlignTop = htOption.y;
                htOption.y = 0;
            }

            this.option(htOption);
        }

        this._renderingMode = this._htOption.renderingMode;

        if (this._renderingMode === "canvas" && !WGame.util.getDeviceInfo().supportCanvas) {
            this._renderingMode = "dom";
        }

        this.drawCount = 0; // 
        this.optionSetter("visible", this._setVisible.bind(this)); // 
        this._elParent = null;
        this._bChanged = false;
        this._aDisplayObjects = [];
        this._bLoaded = false;
        this._oEvent = new WGame.LayerEvent(this);
        this._makeDrawing();
        this._setVisible();
    }
    _makeDrawing() {
        this._oDrawing = new WGame.LayerCanvas(this);
    }

    getDrawing() {
        return this._oDrawing;
    }
    getRenderingMode() {
        return this._renderingMode;
    }
    getEvent() {
        return this._oEvent;
    }
    getParent() {
        return this._elParent || false;
    }
    load(elParent, nZIndex) {
        this.unload();
        this._bLoaded = true;
        this._elParent = this._elParent || elParent;
        this._elParent.style.width = Math.max(parseInt(this._elParent.style.width || 0, 10), this.option("width")) + "px";
        this._elParent.style.height = Math.max(parseInt(this._elParent.style.height || 0, 10), this.option("height")) + "px";
        this.getElement().style.zIndex = nZIndex;

        if (this._sAlignLeft !== null) {
            this.offset(this._sAlignLeft, null, true);
        }

        if (this._sAlignTop !== null) {
            this.offset(null, this._sAlignTop, true);
        }

        this._elParent.appendChild(this.getElement());
    }
    unload() {
        if (this.isLoaded()) {
            this._oEvent.detachEvent();
            this._elParent.removeChild(this.getElement());
            this._elParent = null;
            this._bLoaded = false;
        }
    }
    attachEvent() {
        this._oEvent.attachEvent();
    }
    detachEvent() {
        this._oEvent.detachEvent();
    }
    _setVisible() {
        if (this.getElement()) {
            this.getElement().style.display = this.option("visible") ? "block" : "none";
        }
    }
    isLoaded() {
        return this._bLoaded;
    }
    addChild(oDisplayObject) {
        // 추가할 때마다 정렬하기
        WGame.util.pushWithSort(this._aDisplayObjects, oDisplayObject);
        oDisplayObject.setLayer(this);
        this.setChanged();
    }
    addChildren(aList) {
        for (var i = 0, len = aList.length; i < len; i++) {
            this.addChild(aList[i]);
        }
    }
    removeChild(oDisplayObject, nIdx) {
        oDisplayObject.unsetLayer();

        if (typeof nIdx !== "undefined") {
            this._aDisplayObjects.splice(nIdx, 1);
        } else {
            for (var i = 0, len = this._aDisplayObjects.length; i < len; i++) {
                if (this._aDisplayObjects[i] === oDisplayObject) {
                    this._aDisplayObjects.splice(i, 1);
                    break;
                }
            }
        }

        this.setChanged();
    }
    removeChildren(aList) {
        for (var i = aList.length - 1; i >= 0; i--) {
            if (aList[i]) {
                this.removeChild(aList[i], i);
            }
        }
    }
    addTo(oRenderer) {
        oRenderer = oRenderer || WGame.Renderer;
        oRenderer.addLayer(this);
        return this;
    }
    changeDisplayObjectZIndex(oDisplayObject) {
        this.removeChild(oDisplayObject);
        this.addChild(oDisplayObject);
    }
    getChildren() {
        return this._aDisplayObjects;
    }
    hasChild() {
        return this._aDisplayObjects && this._aDisplayObjects.length > 0;
    }
    setChanged() {
        this._bChanged = true;
    }
    isChanged() {
        return this._bChanged;
    }
    unsetChanged() {
        this._bChanged = false;
    }
    getContext() {
        return ("getContext" in this._oDrawing) ? this._oDrawing.getContext() : false;
    }
    getElement() {
        return ("getElement" in this._oDrawing) ? this._oDrawing.getElement() : false;
    }
    update(nFrameDuration) {
        this.drawCount = 0;

        if (!this.isChanged() || this.option("freeze")) {
            return;
        }

        this.clear();
        this.unsetChanged();
        var nWidth = this.option("width");
        var nHeight = this.option("height");

        for (var i = 0, len = this._aDisplayObjects.length; i < len; i++) {
            this._aDisplayObjects[i].update(nFrameDuration, 0, 0, nWidth, nHeight);
        }
    }
    clear() {
        this._oDrawing.clear();
    }
    resize(nWidth, nHeight, bExpand) {
        if (!bExpand) {
            this.option("width", nWidth || this._htOption.width);
            this.option("height", nHeight || this._htOption.height);
        }

        if (this._oDrawing) {
            this._oDrawing.resize(nWidth, nHeight, bExpand);
        }

        if (this._elParent) {
            this._elParent.style.width = Math.max(parseInt(this._elParent.style.width || 0, 10), nWidth || this.option("width")) + "px";
            this._elParent.style.height = Math.max(parseInt(this._elParent.style.height || 0, 10), nHeight || this.option("height")) + "px";
        }


        this.fireEvent("resize");
    }
    offset(nX, nY, bSkipResetInitAlign) {
        var el = this.getElement();

        if (typeof nX !== "undefined" && nX !== null) {
            switch (nX) {
                case "left":
                    nX = 0;
                    break;

                case "right":
                    nX = parseInt(this._elParent.style.width, 10) - this._htOption.width;
                    break;

                case "center":
                    nX = parseInt(this._elParent.style.width, 10) / 2 - this._htOption.width / 2;
                    break;
            }

            this.option("x", nX);
            el.style.left = nX + "px";

            if (!bSkipResetInitAlign) {
                this._sAlignLeft = null;
            }
        }

        if (typeof nY !== "undefined" && nY !== null) {
            switch (nY) {
                case "top":
                    nY = 0;
                    break;

                case "bottom":
                    nY = parseInt(this._elParent.style.height, 10) - this._htOption.height;
                    break;

                case "center":
                    nY = parseInt(this._elParent.style.height, 10) / 2 - this._htOption.height / 2;
                    break;
            }

            this.option("y", nY);
            el.style.top = nY + "px";

            if (!bSkipResetInitAlign) {
                this._sAlignTop = null;
            }
        }
    }
    setParent(elParent) {
        if (this._bLoaded) {
            this._oEvent.detachEvent();
            this._elParent.removeChild(this.getElement());
            this._elParent = elParent;
            this._elParent.appendChild(this.getElement());
            this._oEvent.attachEvent();
        } else {
            this._elParent = elParent;
        }
    }
    getParentPosition() {
        if (this._elParent !== null) {
            return this._elParent === WGame.Renderer.getElement() ? WGame.Renderer.getPosition() : WGame.util.getPosition(this._elParent);
        }
    }
    clone(bRecursive) {
        var oLayer = new this.constructor(this._htOption);

        if (bRecursive && this._aDisplayObjects.length) {
            for (var i = 0, l = this._aDisplayObjects.length; i < l; i++) {
                this._aDisplayObjects[i].clone(true).addTo(oLayer);
            }
        }

        return oLayer;
    }

}
WGame.Layer = Layer;



export default WGame;
