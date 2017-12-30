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
        return [
            [htBoundary.left, htBoundary.top],
            [htBoundary.right, htBoundary.top],
            [htBoundary.right, htBoundary.bottom],
            [htBoundary.left, htBoundary.bottom]
        ];
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
 * 动画
 */
WGame.Effect = function (fEffect) {
    var rxNumber = /^(\-?[0-9\.]+)(%|px|pt|em)?$/,
        rxRGB = /^rgb\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+)\)$/i,
        rxHex = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        rx3to6 = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i;

    var getUnitAndValue = function (v) {
        var nValue = v,
            sUnit;

        if (rxNumber.test(v)) {
            nValue = parseFloat(v);
            sUnit = RegExp.$2 || "";
        } else if (rxRGB.test(v)) {
            nValue = [parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)];
            sUnit = 'color';
        } else if (rxHex.test(v = v.replace(rx3to6, '#$1$1$2$2$3$3'))) {
            nValue = [parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16)];
            sUnit = 'color';
        }

        return {
            nValue: nValue,
            sUnit: sUnit
        };
    };

    return function (nStart, nEnd) {
        var sUnit;
        if (arguments.length > 1) {
            nStart = getUnitAndValue(nStart);
            nEnd = getUnitAndValue(nEnd);
            sUnit = nEnd.sUnit;
        } else {
            nEnd = getUnitAndValue(nStart);
            nStart = null;
            sUnit = nEnd.sUnit;
        }

        if (nStart && nEnd && nStart.sUnit != nEnd.sUnit) {
            throw new Error('unit error');
        }

        nStart = nStart && nStart.nValue;
        nEnd = nEnd && nEnd.nValue;

        var fReturn = function (p) {
            var nValue = fEffect(p),
                getResult = function (s, d) {
                    return (d - s) * nValue + s + sUnit;
                };

            if (sUnit == 'color') {
                var r = Math.max(0, Math.min(255, parseInt(getResult(nStart[0], nEnd[0]), 10))) << 16;
                r |= Math.max(0, Math.min(255, parseInt(getResult(nStart[1], nEnd[1]), 10))) << 8;
                r |= Math.max(0, Math.min(255, parseInt(getResult(nStart[2], nEnd[2]), 10)));

                r = r.toString(16).toUpperCase();
                for (var i = 0; 6 - r.length; i++) {
                    r = '0' + r;
                }

                return '#' + r;
            }
            return getResult(nStart, nEnd);
        };

        if (nStart === null) {
            fReturn.setStart = function (s) {
                s = getUnitAndValue(s);

                if (s.sUnit != sUnit) {
                    throw new Error('unit eror');
                }
                nStart = s.nValue;
            };
        }
        return fReturn;
    };
}
WGame.Effect.linear = WGame.Effect(function (s) {
    return s;
});
WGame.Effect.easeInSine = WGame.Effect(function (s) {
    return (s == 1) ? 1 : -Math.cos(s * (Math.PI / 2)) + 1;
});
/**
 * easeOutSine 
 */
WGame.Effect.easeOutSine = WGame.Effect(function (s) {
    return Math.sin(s * (Math.PI / 2));
});
/**
 * easeInOutSine 
 */
WGame.Effect.easeInOutSine = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInSine(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutSine(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInSine 
 */
WGame.Effect.easeOutInSine = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeOutSine(0, 1)(2 * s) * 0.5 : WGame.Effect.easeInSine(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInQuad 
 */
WGame.Effect.easeInQuad = WGame.Effect(function (s) {
    return s * s;
});
/**
 * easeOutQuad 
 */
WGame.Effect.easeOutQuad = WGame.Effect(function (s) {
    return -(s * (s - 2));
});
/**
 * easeInOutQuad 
 */
WGame.Effect.easeInOutQuad = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInQuad(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutQuad(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInQuad 
 */
WGame.Effect.easeOutInQuad = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeOutQuad(0, 1)(2 * s) * 0.5 : WGame.Effect.easeInQuad(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInCubic 
 */
WGame.Effect.easeInCubic = WGame.Effect(function (s) {
    return Math.pow(s, 3);
});
/**
 * easeOutCubic 
 */
WGame.Effect.easeOutCubic = WGame.Effect(function (s) {
    return Math.pow((s - 1), 3) + 1;
});
/**
 * easeInOutCubic 
 */
WGame.Effect.easeInOutCubic = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeIn(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOut(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInCubic 
 */
WGame.Effect.easeOutInCubic = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeOut(0, 1)(2 * s) * 0.5 : WGame.Effect.easeIn(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInQuart 
 */
WGame.Effect.easeInQuart = WGame.Effect(function (s) {
    return Math.pow(s, 4);
});
/**
 * easeOutQuart 
 */
WGame.Effect.easeOutQuart = WGame.Effect(function (s) {
    return -(Math.pow(s - 1, 4) - 1);
});
/**
 * easeInOutQuart 
 */
WGame.Effect.easeInOutQuart = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInQuart(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutQuart(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInQuart 
 */
WGame.Effect.easeOutInQuart = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeOutQuart(0, 1)(2 * s) * 0.5 : WGame.Effect.easeInQuart(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInQuint 
 */
WGame.Effect.easeInQuint = WGame.Effect(function (s) {
    return Math.pow(s, 5);
});
/**
 * easeOutQuint 
 */
WGame.Effect.easeOutQuint = WGame.Effect(function (s) {
    return Math.pow(s - 1, 5) + 1;
});
/**
 * easeInOutQuint 
 */
WGame.Effect.easeInOutQuint = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInQuint(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutQuint(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInQuint 
 */
WGame.Effect.easeOutInQuint = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeOutQuint(0, 1)(2 * s) * 0.5 : WGame.Effect.easeInQuint(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInCircle 
 */
WGame.Effect.easeInCircle = WGame.Effect(function (s) {
    return -(Math.sqrt(1 - (s * s)) - 1);
});
/**
 * easeOutCircle 
 */
WGame.Effect.easeOutCircle = WGame.Effect(function (s) {
    return Math.sqrt(1 - (s - 1) * (s - 1));
});
/**
 * easeInOutCircle 
 */
WGame.Effect.easeInOutCircle = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInCircle(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutCircle(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInCircle 
 */
WGame.Effect.easeOutInCircle = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeOutCircle(0, 1)(2 * s) * 0.5 : WGame.Effect.easeInCircle(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInBack 
 */
WGame.Effect.easeInBack = WGame.Effect(function (s) {
    var n = 1.70158;
    return (s == 1) ? 1 : (s / 1) * (s / 1) * ((1 + n) * s - n);
});
/**
 * easeOutBack 
 */
WGame.Effect.easeOutBack = WGame.Effect(function (s) {
    var n = 1.70158;
    return (s === 0) ? 0 : (s = s / 1 - 1) * s * ((n + 1) * s + n) + 1;
});
/**
 * easeInOutBack 
 */
WGame.Effect.easeInOutBack = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInBack(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutBack(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInElastic 
 */
WGame.Effect.easeInElastic = WGame.Effect(function (s) {
    var p = 0,
        a = 0,
        n;
    if (s === 0) {
        return 0;
    }
    if ((s /= 1) == 1) {
        return 1;
    }
    if (!p) {
        p = 0.3;
    }
    if (!a || a < 1) {
        a = 1;
        n = p / 4;
    } else {
        n = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    return -(a * Math.pow(2, 10 * (s -= 1)) * Math.sin((s - 1) * (2 * Math.PI) / p));
});

/**
 * easeOutElastic 
 */
WGame.Effect.easeOutElastic = WGame.Effect(function (s) {
    var p = 0,
        a = 0,
        n;
    if (s === 0) {
        return 0;
    }
    if ((s /= 1) == 1) {
        return 1;
    }
    if (!p) {
        p = 0.3;
    }
    if (!a || a < 1) {
        a = 1;
        n = p / 4;
    } else {
        n = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    return (a * Math.pow(2, -10 * s) * Math.sin((s - n) * (2 * Math.PI) / p) + 1);
});
/**
 * easeInOutElastic 
 */
WGame.Effect.easeInOutElastic = WGame.Effect(function (s) {
    var p = 0,
        a = 0,
        n;
    if (s === 0) {
        return 0;
    }
    if ((s /= 1 / 2) == 2) {
        return 1;
    }
    if (!p) {
        p = (0.3 * 1.5);
    }
    if (!a || a < 1) {
        a = 1;
        n = p / 4;
    } else {
        n = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    if (s < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (s -= 1)) * Math.sin((s - n) * (2 * Math.PI) / p));
    }
    return a * Math.pow(2, -10 * (s -= 1)) * Math.sin((s - n) * (2 * Math.PI) / p) * 0.5 + 1;
});

/**
 * easeOutBounce 
 */
WGame.Effect.easeOutBounce = WGame.Effect(function (s) {
    if (s < (1 / 2.75)) {
        return (7.5625 * s * s);
    } else if (s < (2 / 2.75)) {
        return (7.5625 * (s -= (1.5 / 2.75)) * s + 0.75);
    } else if (s < (2.5 / 2.75)) {
        return (7.5625 * (s -= (2.25 / 2.75)) * s + 0.9375);
    } else {
        return (7.5625 * (s -= (2.625 / 2.75)) * s + 0.984375);
    }
});
/**
 * easeInBounce 
 */
WGame.Effect.easeInBounce = WGame.Effect(function (s) {
    return 1 - WGame.Effect.easeOutBounce(0, 1)(1 - s);
});
/**
 * easeInOutBounce 
 */
WGame.Effect.easeInOutBounce = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInBounce(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutBounce(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInExpo 
 */
WGame.Effect.easeInExpo = WGame.Effect(function (s) {
    return (s === 0) ? 0 : Math.pow(2, 10 * (s - 1));
});
/**
 * easeOutExpo 
 */
WGame.Effect.easeOutExpo = WGame.Effect(function (s) {
    return (s == 1) ? 1 : -Math.pow(2, -10 * s / 1) + 1;
});
/**
 * easeInOutExpo 
 */
WGame.Effect.easeInOutExpo = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeInExpo(0, 1)(2 * s) * 0.5 : WGame.Effect.easeOutExpo(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutExpo 
 */
WGame.Effect.easeOutInExpo = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.easeOutExpo(0, 1)(2 * s) * 0.5 : WGame.Effect.easeInExpo(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * Cubic-Bezier curve
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @see http://www.netzgesta.de/dev/cubic-bezier-timing-function.html
 */
WGame.Effect._cubicBezier = function (x1, y1, x2, y2) {
    return function (t) {
        var cx = 3.0 * x1,
            bx = 3.0 * (x2 - x1) - cx,
            ax = 1.0 - cx - bx,
            cy = 3.0 * y1,
            by = 3.0 * (y2 - y1) - cy,
            ay = 1.0 - cy - by;

        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }

        function sampleCurveY(t) {
            return ((ay * t + by) * t + cy) * t;
        }

        function sampleCurveDerivativeX(t) {
            return (3.0 * ax * t + 2.0 * bx) * t + cx;
        }

        function solveCurveX(x, epsilon) {
            var t0, t1, t2, x2, d2, i;
            for (t2 = x, i = 0; i < 8; i++) {
                x2 = sampleCurveX(t2) - x;
                if (Math.abs(x2) < epsilon) {
                    return t2;
                }
                d2 = sampleCurveDerivativeX(t2);
                if (Math.abs(d2) < 1e-6) {
                    break;
                }
                t2 = t2 - x2 / d2;
            }
            t0 = 0.0;
            t1 = 1.0;
            t2 = x;
            if (t2 < t0) {
                return t0;
            }
            if (t2 > t1) {
                return t1;
            }
            while (t0 < t1) {
                x2 = sampleCurveX(t2);
                if (Math.abs(x2 - x) < epsilon) {
                    return t2;
                }
                if (x > x2) {
                    t0 = t2;
                } else {
                    t1 = t2;
                }
                t2 = (t1 - t0) * 0.5 + t0;
            }
            return t2; // Failure.
        }
        return sampleCurveY(solveCurveX(t, 1 / 200));
    };
};

/**
 * Cubic-Bezier 
 * @see http://en.wikipedia.org/wiki/B%C3%A9zier_curve
 * @param {Number} x1 control point 1
 * @param {Number} y1 control point 1
 * @param {Number} x2 control point 2
 * @param {Number} y2 control point 2
 * @return {Function} 
 */
WGame.Effect.cubicBezier = function (x1, y1, x2, y2) {
    return WGame.Effect(WGame.Effect._cubicBezier(x1, y1, x2, y2));
};

/**
 * Cubic-Bezier 
 * WGame.Effect.cubicBezier(0.25, 0.1, 0.25, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
WGame.Effect.cubicEase = WGame.Effect.cubicBezier(0.25, 0.1, 0.25, 1);

/**
 * Cubic-Bezier 
 * WGame.Effect.cubicBezier(0.42, 0, 1, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
WGame.Effect.cubicEaseIn = WGame.Effect.cubicBezier(0.42, 0, 1, 1);

/**
 * Cubic-Bezier 
 * WGame.Effect.cubicBezier(0, 0, 0.58, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
WGame.Effect.cubicEaseOut = WGame.Effect.cubicBezier(0, 0, 0.58, 1);

/**
 * Cubic-Bezier 
 * WGame.Effect.cubicBezier(0.42, 0, 0.58, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
WGame.Effect.cubicEaseInOut = WGame.Effect.cubicBezier(0.42, 0, 0.58, 1);

/**
 * Cubic-Bezier 
 * WGame.Effect.cubicBezier(0, 0.42, 1, 0.58);
 */
WGame.Effect.cubicEaseOutIn = WGame.Effect.cubicBezier(0, 0.42, 1, 0.58);

/**
 * overphase 
 */
WGame.Effect.overphase = WGame.Effect(function (s) {
    s /= 0.652785;
    return (Math.sqrt((2 - s) * s) + (0.1 * s)).toFixed(5);
});

/**
 * sin 
 */
WGame.Effect.sinusoidal = WGame.Effect(function (s) {
    return (-Math.cos(s * Math.PI) / 2) + 0.5;
});

/**
 * mirror 
 * sinusoidal 
 */
WGame.Effect.mirror = WGame.Effect(function (s) {
    return (s < 0.5) ? WGame.Effect.sinusoidal(0, 1)(s * 2) : WGame.Effect.sinusoidal(0, 1)(1 - (s - 0.5) * 2);
});

/**
 * nPulse
 * @param {Number} nPulse 
 * @return {Function} 
 * @example
var f = WGame.Effect.pulse(3); 
var fEffect = f(0, 100);
fEffect(0); => 0
fEffect(1); => 100
 */
WGame.Effect.pulse = function (nPulse) {
    return WGame.Effect(function (s) {
        return (-Math.cos((s * (nPulse - 0.5) * 2) * Math.PI) / 2) + 0.5;
    });
};

/**
 * nPeriod
 * @param {Number} nPeriod 
 * @param {Number} nHeight 
 * @return {Function}  
 * @example
var f = WGame.Effect.wave(3, 1); 
var fEffect = f(0, 100);
fEffect(0); => 0
fEffect(1); => 0
 */
WGame.Effect.wave = function (nPeriod, nHeight) {
    return WGame.Effect(function (s) {
        return (nHeight || 1) * (Math.sin(nPeriod * (s * 360) * Math.PI / 180)).toFixed(5);
    });
};

/**
 * easeIn 
 * easeInCubic 
 * @see easeInCubic
 */
WGame.Effect.easeIn = WGame.Effect.easeInCubic;
/**
 * easeOut 
 * easeOutCubic 
 * @see easeOutCubic
 */
WGame.Effect.easeOut = WGame.Effect.easeOutCubic;
/**
 * easeInOut 
 * easeInOutCubic 
 * @see easeInOutCubic
 */
WGame.Effect.easeInOut = WGame.Effect.easeInOutCubic;
/**
 * easeOutIn 
 * easeOutInCubic 
 * @see easeOutInCubic
 */
WGame.Effect.easeOutIn = WGame.Effect.easeOutInCubic;
/**
 * bounce 
 * easeOutBounce 
 * @see easeOutBounce
 */
WGame.Effect.bounce = WGame.Effect.easeOutBounce;
/**
 * elastic 
 * easeInElastic 
 * @see easeInElastic
 */
WGame.Effect.elastic = WGame.Effect.easeInElastic;

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

class DisplayObjectCanvas {
    constructor(oDisplayObject) {
        this._oDisplayObject = oDisplayObject;
        this._bUseCache = false;
        this._oDebugHitArea = null;
        this._htEvent = {};
        this._oLayer = null;
        this._htInfo = this._oDisplayObject.get();
        this._bIsRetinaDisplay = null;

        if (this._htInfo.useCache) {
            this.loadCache();
        }
    }
    loadCache() {
        if (!this._bUseCache) {
            this._bUseCache = true;
            this._elCache = wx.createCanvas();
            this._elCache.width = this._htInfo.width;
            this._elCache.height = this._htInfo.height;
            this._oContextCache = this._elCache.getContext("2d");
        }
    }

    /**
     * @private
     */
    unloadCache() {
        if (this._bUseCache) {
            this._oContextCache = null;
            this._elCache = null;
            this._bUseCache = false;
        }
    }

    /**
     * @private
     */
    clearCache() {
        if (this._bUseCache) {
            this._oContextCache.clearRect(0, 0, this._elCache.width, this._elCache.height);
            this._elCache.width = this._htInfo.width * (this._bIsRetinaDisplay ? 2 : 1);
            this._elCache.height = this._htInfo.height * (this._bIsRetinaDisplay ? 2 : 1);
        }
    }


    drawImage(oContext, sx, sy, sw, sh, dx, dy, dw, dh) {
        var oSource = this._oDisplayObject.getImage();
        var nImageWidth = this._oDisplayObject._nImageWidth; //TODO 임시
        var nImageHeight = this._oDisplayObject._nImageHeight;

        if (WGame.Renderer.isRetinaDisplay()) {
            for (i = 1, len = arguments.length; i < len; i++) {
                arguments[i] *= 2;
            }

            nImageWidth *= 2;
            nImageHeight *= 2;
        }

        try {
            oContext.drawImage(oSource, sx, sy, sw, sh, dx, dy, dw, dh);
        } catch (e) {
            throw new Error('invalid drawImage value : ' + sx + ',' + sy + ',' + sw + ',' + sh + ',' + dx + ',' + dy + ',' + dw + ',' + dh + ',' + this._oDisplayObject.getImage().src + ', original : ' + this._oDisplayObject.getImage().width + ',' + this._oDisplayObject.getImage().height + ',source : ' + oSource.width + ',' + oSource.height + ', isCached : ' + (this._elImageCached !== null ? 'true' : 'false'));
        }
    }

    /**
     * 
     * @private
     */
    load() {
        this._oLayer = this._oDisplayObject.getLayer();
        this._oContext = this._oDisplayObject.getLayer().getContext();
        this._bIsRetinaDisplay = WGame.Renderer.isRetinaDisplay();
    }

    /**
     * 
     * @private
     */
    unload() {
        this._oLayer = null;
        this._oContext = null;
    }

    draw(nFrameDuration, nX, nY, nLayerWidth, nLayerHeight, oContext) {
        var bUseParentContext = oContext ? true : false;
        oContext = oContext || this._oContext;
        var oTargetContext = this._bUseCache ? this._oContextCache : oContext;
        var oParentContext = oContext;
        var htInfo = this._htInfo;
        var htDirty = this._oDisplayObject.getDirty();
        var htOrigin = this._oDisplayObject.getOrigin();
        var nTargetWidth = htInfo.width;
        var nTargetHeight = htInfo.height;
        var nOriginX = htOrigin.x;
        var nOriginY = htOrigin.y;
        var nSavedX = nX;
        var nSavedY = nY;
        var nRatio = (this._bIsRetinaDisplay ? 2 : 1);
        var nSavedXRatio = nX * nRatio;
        var nSavedYRatio = nY * nRatio;
        var nSavedOpacity = 0;
        var bUseTransform = false;
        var oTransformContext = oContext;

        if (htInfo.useCache) {
            oContext = this._oContextCache;
        }

        if (this._bIsRetinaDisplay) {
            nX *= 2;
            nY *= 2;
            nOriginX *= 2;
            nOriginY *= 2;
            nTargetWidth *= 2;
            nTargetHeight *= 2;
        }

        if (this._bUseCache || htInfo.scaleX !== 1 || htInfo.scaleY !== 1 || htInfo.angle !== 0 || htInfo.opacity !== 1) {
            bUseTransform = true;

            if (this._bUseCache) {
                oTransformContext = !bUseParentContext ? this._oContext : oParentContext;
            }

            oTransformContext.save();
            oTransformContext.translate(nX + nOriginX, nY + nOriginY);

            if (htInfo.opacity !== 1) {
                nSavedOpacity = oTransformContext.globalAlpha;
                oTransformContext.globalAlpha = oTransformContext.globalAlpha === 0 ? htInfo.opacity : oTransformContext.globalAlpha * htInfo.opacity;
            }

            if (htInfo.angle !== 0) {
                oTransformContext.rotate(WGame.util.toRad(htInfo.angle));
            }

            if (htInfo.scaleX !== 1 || htInfo.scaleY !== 1) {
                oTransformContext.scale(htInfo.scaleX, htInfo.scaleY);
            }

            oTransformContext.translate(-nOriginX, -nOriginY);
            nX = nY = 0;
        }

        this._htEvent.displayObject = this;
        this._htEvent.context = oTargetContext;
        this._htEvent.x = nX;
        this._htEvent.y = nY;

        if (!this._bUseCache || (this._oDisplayObject.isChanged() && !this._oDisplayObject.isChanged(true))) {
            this.clearCache();

            if (htInfo.backgroundColor) {
                oTargetContext.fillStyle = htInfo.backgroundColor;
                oTargetContext.fillRect(nX, nY, nTargetWidth, nTargetHeight);
            }

            if (this._oDisplayObject.getImage()) {
                var elSourceImage = this._oDisplayObject.getImage();
                var htImageSize = this._oDisplayObject.getImageSize();

                if (htInfo.backgroundRepeat && htInfo.backgroundRepeat !== 'no-repeat') {
                    var nCountWidth = (htInfo.backgroundRepeat === 'repeat' || htInfo.backgroundRepeat === 'repeat-x') ? Math.ceil(htInfo.width / htImageSize.width) : 1;
                    var nCountHeight = (htInfo.backgroundRepeat === 'repeat' || htInfo.backgroundRepeat === 'repeat-y') ? Math.ceil(htInfo.height / htImageSize.height) : 1;

                    if (nCountWidth > 0 || nCountHeight > 0) {
                        for (var nLeftOffset = 0; nLeftOffset < nCountWidth; nLeftOffset++) {
                            for (var nTopOffset = 0; nTopOffset < nCountHeight; nTopOffset++) {
                                var nOffsetX = nLeftOffset * htImageSize.width + htImageSize.width;
                                var nOffsetY = nTopOffset * htImageSize.height + htImageSize.height;
                                var nPieceWidth = nOffsetX > htInfo.width ? htImageSize.width - (nOffsetX - htInfo.width) : htImageSize.width;
                                var nPieceHeight = nOffsetY > htInfo.height ? htImageSize.height - (nOffsetY - htInfo.height) : htImageSize.height;

                                this.drawImage(
                                    oTargetContext,
                                    0,
                                    0,
                                    nPieceWidth,
                                    nPieceHeight,
                                    (nX / nRatio) + nLeftOffset * htImageSize.width,
                                    (nY / nRatio) + nTopOffset * htImageSize.height,
                                    nPieceWidth,
                                    nPieceHeight
                                );
                            }
                        }
                    }
                } else {
                    var nDrawingWidth = Math.min(htImageSize.width, htInfo.width);
                    var nDrawingHeight = Math.min(htImageSize.height, htInfo.height);

                    this.drawImage(
                        oTargetContext,
                        htInfo.offsetX,
                        htInfo.offsetY,
                        htInfo.fitImage ? htImageSize.width : nDrawingWidth,
                        htInfo.fitImage ? htImageSize.height : nDrawingHeight,
                        nX / nRatio, //TODO floating value 
                        nY / nRatio,
                        htInfo.fitImage ? htInfo.width : nDrawingWidth,
                        htInfo.fitImage ? htInfo.height : nDrawingHeight
                    );
                }
            }

            if ("onCanvasDraw" in this._oDisplayObject) {
                this._oDisplayObject.onCanvasDraw(this._htEvent);
            }
        }

        if (htInfo.debugHitArea && htInfo.hitArea) {
            if (this._oDebugHitArea === null) {
                this._oDebugHitArea = new WGame.Polyline({
                    x: 0,
                    y: 0,
                    width: htInfo.width,
                    height: htInfo.height,
                    strokeColor: htInfo.debugHitArea === true ? "yellow" : htInfo.debugHitArea,
                    strokeWidth: 3
                }).addTo(this._oDisplayObject);
                this._oDebugHitArea.setPointData(htInfo.hitArea);
            }
        }

        if (this._oDisplayObject.hasChild() && (!htInfo.useCache || (this._oDisplayObject.isChanged() && !this._oDisplayObject.isChanged(true)))) {
            var aDisplayObjects = this._oDisplayObject.getChildren();

            for (var i = 0, len = aDisplayObjects.length; i < len; i++) {
                aDisplayObjects[i].update(
                    nFrameDuration,
                    // 0,
                    // 0,
                    htInfo.useCache || bUseTransform ? 0 : nSavedX, // 
                    htInfo.useCache || bUseTransform ? 0 : nSavedY,
                    nLayerWidth,
                    nLayerHeight,
                    bUseParentContext || htInfo.useCache ? oContext : null
                );
                aDisplayObjects[i].unsetChanged();
                aDisplayObjects[i]._resetDirty();
            }
        }

        if (htInfo.useCache) {
            (bUseParentContext ? oParentContext : this._oContext).drawImage(oContext.canvas, 0, 0);
        }

        this._oLayer.drawCount++;

        if (bUseTransform) {
            oTransformContext.restore();
        }
    }
}
WGame.DisplayObjectCanvas = DisplayObjectCanvas;


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

        if (this._elImage && this._elImage === vImage) {
            return;
        }

        // reflow 
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
            this._oParent.setChanged(false); // transforms
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
            this._oDrawing = new WGame.DisplayObjectCanvas(this);
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

        if (!this._htOption.visible) {
            this.unsetChanged();
            return;
        }

        nX += this._htOption.x;
        nY += this._htOption.y;

        if (
            nX + this._htOption.width >= 0 ||
            nX <= nLayerWidth ||
            nY + this._htOption.height >= 0 ||
            nY <= nLayerHeight
        ) {
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
        this._elCanvas = wx.createCanvas();
        var htSize = this._getLayerSize(this._elCanvas.width, this._elCanvas.height);
        this._oContext = this._elCanvas.getContext('2d');
    }
    _getLayerSize(nWidth, nHeight) {
        nWidth = nWidth;
        nHeight = nHeight;
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
            var nRatioWidth = nWidth / this._oLayer.option("width");
            var nRatioHeight = nHeight / this._oLayer.option("height");
            this._oEvent.setEventRatio(nRatioWidth, nRatioHeight);
        } else {
            this.clear(this._oContext);
            this._oLayer.setChanged();
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
        if (!oDisplayObject._htOption.useEvent ||
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


class SpriteSheet {
    constructor() {
        this._htSpriteSheet = {};
    }
    add(sImageName, vSpriteName, nOffsetX, nOffsetY, nWidth, nHeight, nSpriteLength) {

        if (typeof vSpriteName === "object") {
            if (vSpriteName instanceof Array) {
                for (var i = 0, l = vSpriteName.length; i < l; i++) {
                    this.add.apply(this, [sImageName, i].concat(vSpriteName[i]));
                }
            } else {
                for (var i in vSpriteName) {
                    this.add.apply(this, [sImageName, i].concat(vSpriteName[i]));
                }
            }
        } else {
            this._htSpriteSheet[sImageName] = this._htSpriteSheet[sImageName] || {};

            if (typeof nWidth !== "undefined") {
                WGame.ImageManager.getImage(sImageName, function (el) {
                    this._addWithSpriteLength(el, sImageName, vSpriteName, nOffsetX, nOffsetY, nWidth, nHeight, nSpriteLength);
                }.bind(this));
            } else {
                this._htSpriteSheet[sImageName][vSpriteName] = [nOffsetX, nOffsetY];
            }
        }
    }

    /**
     * @private
     */
    _addWithSpriteLength(elImage, sImageName, sSpriteName, nOffsetX, nOffsetY, nWidth, nHeight, nSpriteLength) {
        var aSpriteList = this._htSpriteSheet[sImageName][sSpriteName] = [];
        var nImageWidth = elImage.width;
        var nImageHeight = elImage.height;

        if (WGame.Renderer.isRetinaDisplay()) {
            nImageWidth /= 2;
            nImageHeight /= 2;
        }

        var x = nOffsetX;
        var y = nOffsetY;

        for (i = 0; i < nSpriteLength; i++) {
            if (x >= nImageWidth) {
                x = 0;
                y += nHeight;
            }

            if (y >= nImageHeight) {
                break;
            }

            aSpriteList.push([x, y]);
            x += nWidth;
        }
    }

    remove(sImageName) {
        if (this._htSpriteSheet[sImageName]) {
            delete this._htSpriteSheet[sImageName];
        }
    }

    get(sImageName) {
        return this._htSpriteSheet[sImageName] ? this._htSpriteSheet[sImageName] : false;
    }

    reset() {
        this._htSpriteSheet = {};
    }

}
WGame.SpriteSheet = SpriteSheet;

class ImageManager extends Component {
    RETRY_COUNT = 3
    RETRY_DELAY = 500
    USE_PRERENDERING_DOM = false
    constructor(props) {
        super(props)
        this._aImages = [];
        this._htImageNames = {};
        this._htImageRetryCount = {};
        this._htImageWhileLoading = {};
        this._nCount = 0;
        this._oSpriteSheet = new WGame.SpriteSheet();
    }
    _addImage(elImage, sName) {
        var nLength = this._aImages.push({
            element: elImage,
            name: sName
        });

        var aCallback = this._htImageNames[sName];
        this._htImageNames[sName] = nLength - 1;
        delete this._htImageRetryCount[sName];

        // callback 
        if (aCallback && aCallback instanceof Array) {
            for (var i = 0, len = aCallback.length; i < len; i++) {
                aCallback[i](elImage, sName);
            }

            aCallback = null;
        }

        this.fireEvent("process", {
            name: sName,
            url: elImage.src,
            count: nLength,
            total: this._nCount,
            ratio: Math.round((nLength / this._nCount) * 1000) / 1000
        });

        if (this._nCount === nLength) {
            this.fireEvent("complete");
        }
    }

    _markImage(sName) {
        if (!this._htImageNames[sName]) {
            this._htImageNames[sName] = [];
        }

        if (!this._htImageRetryCount[sName]) {
            this._htImageRetryCount[sName] = 0;
        }
    }

    _makeHash() {
        this._htImageNames = {};

        for (var i = 0, len = this._aImages.length; i < len; i++) {
            this._htImageNames[this._aImages[i].name] = i;
        }
    }

    getImage(sName, fCallback) {
        if (!sName && sName !== 0) {
            return false;
        }

        if (!(sName in this._htImageNames)) {
            this._markImage(sName);
        }

        if (this._htImageNames[sName] instanceof Array) {
            return (fCallback && this._addMarkCallback(sName, fCallback));
        } else {
            if (fCallback) {
                fCallback(this._aImages[this._htImageNames[sName]].element);
            } else {
                return this._aImages[this._htImageNames[sName]].element;
            }
        }
    }

    _addMarkCallback(sName, fCallback, fFail) {
        if ((sName in this._htImageNames) && this._htImageNames[sName] instanceof Array) {
            if (fFail) {
                var fError = function fError(oEvent) {
                    if (oEvent.name === sName) {
                        fFail();
                        this.detach("error", fError);
                    }
                };

                this.attach("error", fError);
            }

            if (fCallback) {
                this._htImageNames[sName].push(fCallback);
            }

            return true;
        } else {
            return false;
        }
    }

    removeImage(sName) {
        if (!(sName in this._htImageNames)) {
            return false;
        }

        var elImage = this._aImages.splice(this._htImageNames[sName], 1);
        this._makeHash();
        elImage.onload = null;
        elImage.onerror = null;
        elImage.src = null;
        elImage = null;
        this._oSpriteSheet.remove(sName);
    }

    remove(sName) {
        this.removeImage(sName);
    }

    add() {
        if (typeof arguments[0] === "object") {
            this.addImages.apply(this, arguments);
        } else {
            this.addImage.apply(this, arguments);
        }
    }

    addImages(htList, fCallback, fFail) {
        var fOnComplete = null;
        var fOnFail = null;
        var nTotalCount = 0;
        var nCurrentCount = 0;
        var aFailedImages = [];

        for (var i in htList) {
            nTotalCount++;
        }

        // 
        if (fCallback && fCallback !== null) {
            fOnComplete = (function () {
                nCurrentCount++;

                if (nCurrentCount >= nTotalCount) {
                    fCallback(htList);
                }
            }).bind(this);
        }

        // 
        if (fFail && fFail !== null) {
            fOnFail = (function (el, sName, sURL) {
                aFailedImages.push([el, sName, sURL]);

                if (aFailedImages.length + nCurrentCount >= nTotalCount) {
                    fFail(aFailedImages);
                }
            }).bind(this);
        }

        for (var i in htList) {
            this.addImage(i, htList[i], fOnComplete, fOnFail);
        }
    }

    /**
     * 
     * 
     * @param {String} sName 
     * @param {String} sURL 
     * @param {Function} fCallback 
     * @param {HTMLElement} fCallback.elImage
     * @param {String} fCallback.sName
     * @param {String} fCallback.sURL 
     * @param {Function} fFail 
     */
    addImage(sName, sURL, fCallback, fFail) {
        if (this.getImage(sName)) {
            if (fCallback && fCallback !== null) {
                fCallback(this.getImage(sName), sName, sURL);
            }
            return;
        }

        if ((sName in this._htImageWhileLoading) && this._addMarkCallback(sName, fCallback, fFail)) {
            return;
        }

        this._nCount++;
        this._markImage(sName);
        var el = wx.createImage();

        this._htImageWhileLoading[sName] = el;

        el.onload = (function (e) {
            this._addImage(el, sName);

            if (fCallback && fCallback !== null) {
                fCallback(el, sName, sURL);
            }

            el.onerror = el.onload = null;
            this._deleteWhileLoading(sName);
        }).bind(this);

        el.onerror = (function (e) {
            if (this._htImageRetryCount[sName] < this.RETRY_COUNT) {
                this._htImageRetryCount[sName]++;

                this.fireEvent("retry", {
                    count: this._aImages.length,
                    total: this._nCount,
                    name: sName,
                    url: sURL,
                    delay: this.RETRY_DELAY,
                    retryCount: this._htImageRetryCount[sName]
                });

                setTimeout(function () {
                    el.src = "about:blank";
                    el.src = sURL;
                }, this.RETRY_DELAY);
                return;
            }

            if (fFail && fFail !== null) {
                fFail(el, sName, sURL);
            }

            this.fireEvent("error", {
                count: this._aImages.length,
                total: this._nCount,
                name: sName,
                url: sURL
            });

            el.onerror = el.onload = null;
            this._deleteWhileLoading(sName);
        }).bind(this);

        // el.crossOrigin = "";
        el.src = sURL;
    }

    _deleteWhileLoading(sName) {
        delete this._htImageWhileLoading[sName];
    }

    abort() {
        for (var i in this._htImageWhileLoading) {
            this._htImageWhileLoading[i].onload = this._htImageWhileLoading[i].onerror = null;
            this._htImageWhileLoading[i].src = null;
            this._htImageWhileLoading[i] = null;
        }

        this._htImageWhileLoading = {};
        this._htImageStartedLoading = {};
    }

    reset() {
        this.abort();
        this._aImages = [];
        this._htImageNames = {};
        this._htImageRetryCount = {};
        this._htImageWhileLoading = {};
        this._nCount = 0;
        this._oSpriteSheet.reset();
    }

    cancelGetImage(sName, fCallback) {
        if (this._htImageNames[sName] instanceof Array) {
            for (var i = 0, len = this._htImageNames[sName].length; i < len; i++) {
                if (this._htImageNames[sName][i] === fCallback) {
                    this._htImageNames[sName].splice(i, 1);
                    return;
                }
            }
        }
    }


    addSprite(sImageName, vSpriteName, nOffsetX, nOffsetY) {
        this._oSpriteSheet.add(sImageName, vSpriteName, nOffsetX, nOffsetY);
    }


    getSprite(sImageName) {
        return this._oSpriteSheet.get(sImageName);
    }


    removeSprite(sImageName) {
        this._oSpriteSheet.remove(sImageName);
    }
}
WGame.ImageManager = new ImageManager();

class Animation extends Component {
    constructor(fCallback, nDuration, htOption) {
        super(htOption)
        this._nId = ++WGame.Animation._idx;
        this._bIsPlaying = false;
        this._fCallback = fCallback;
        this._oTimerList = null;

        this.option("useAutoStart", true);
        this.option((typeof nDuration === "object" ? nDuration : htOption) || {});
        this.setDuration(nDuration);

        this.setOptionEvent(htOption);
    }
    setOptionEvent(htOption) {
        if (htOption) {
            for (var i in htOption) {
                if (i.toString().indexOf("on") === 0) {
                    this.attach(i.toString().replace(/^on/, '').toLowerCase(), htOption[i]);
                }
            }
        }
    }

    triggerCallback(htParam) {
        if (typeof this._fCallback !== "function" && this._htOption.set) {
            var htOption = {};

            if (this._htOption.set instanceof Array) {
                for (var i = 0, len = this._htOption.set.length; i < len; i++) {
                    htOption[this._htOption.set[i]] = (htParam.value instanceof Array) ? htParam.value[i] : htParam.value;
                }
            } else {
                htOption[this._htOption.set] = htParam.value;
            }

            if (this._fCallback instanceof Array) {
                for (var j = 0, len = this._fCallback.length; j < len; j++) {
                    this._fCallback[j].set(htOption);
                }
            } else {
                this._fCallback.set(htOption);
            }
        } else if (this._fCallback) {
            this._fCallback(htParam);
        }
    }
    setDuration(nDuration) {
        this._nDuration = parseInt(nDuration, 10);
    }
    getDuration() {
        return this._nDuration;
    }
    setTimerList(oTimerList) {
        this._oTimerList = oTimerList;

        if (this._htOption.useAutoStart) {
            this.start();
        }
    }
    getId() {
        return this._nId;
    }
    run(nCurrentFrame, nFrameDuration) {
        throw new Error('abstract method');
    }
    reset() {
        throw new Error('abstract method');
    }
    stop(bSkipEvent) {
        if (this.isPlaying()) {
            if (this._oTimerList !== null) {
                this._oTimerList.remove(this);
            }

            this._bIsPlaying = false;
            this.reset();


            if (!bSkipEvent) {
                this.fireEvent("stop");
            }
        }
    }
    pause() {
        if (this.isPlaying()) {
            this._bIsPlaying = false;

            this.fireEvent("pause");

            if (this._oTimerList !== null) {
                this._oTimerList.remove(this);
            }
        }
    }
    start() {
        if (!this.isPlaying()) {
            this._bIsPlaying = true;

            if (this._oTimerList !== null) {
                this._oTimerList.add(this);
            }

            this.fireEvent("start");
        }
    }
    isPlaying() {
        return this._bIsPlaying;
    }
    complete() {
        if (this.isPlaying()) {
            if (this._fCallbackComplete) {
                this._fCallbackComplete();
            }

            this.stop(true);

            this.fireEvent("complete");
        }
    }
}
WGame.Animation = Animation;
WGame.Animation._idx = 0;

class AnimationTransition extends Animation {
    constructor(fCallback, nDuration, htOption) {
        super(fCallback, nDuration, htOption)
        this.option({
            from: null,
            to: null,
            set: "",
            loop: 1,
            effect: WGame.Effect.linear // 
        });
        this._htCallback = {};
        this.option(htOption || {});
        var fReset = this.reset.bind(this);
        this.optionSetter("from", fReset);
        this.optionSetter("to", fReset);
        this._nCount = 0;
        this._nCountCycle = 0;
        this._nFrameAtRunLastest = null;
        this._nRunningTime = null;
        this._bIsArrayValue = false;
    }
    start() {
        if (this._htOption.from === null && typeof this._fCallback !== "function") {
            this._setDefaultFromValues();
        }

        if (this._nFrameAtRunLastest === null) {
            this.reset();
        }

        this.constructor.$super.start.call(this);
    }
    _setDefaultFromValues() {
        var vFrom = null;

        if (this._htOption.set) {
            if (this._htOption.set instanceof Array) {
                vFrom = [];
                for (var i = 0, len = this._htOption.set.length; i < len; i++) {
                    vFrom.push(this._fCallback.get(this._htOption.set[i]));
                }
            } else {
                vFrom = this._fCallback.get(this._htOption.set)
            }

            this.option("from", vFrom);
        }
    }
    reset() {
        this._nFrameAtRunLastest = null;
        this._nRunningTime = null;
        this._nValue = this._htOption.from;
        this._bIsArrayValue = this._htOption.from instanceof Array;
        this._nCount = 0;
        this._nCountCycle = 0;

        if (this._bIsArrayValue) {
            this._fEffect = [];
            var fEffect = null;

            for (var i = 0, len = this._htOption.from.length; i < len; i++) {
                fEffect = (this._htOption.effect instanceof Array) ? this._htOption.effect[i] : this._htOption.effect;
                this._fEffect[i] = fEffect(this._htOption.from[i], this._htOption.to[i]);
            }
        } else {
            this._fEffect = this._htOption.effect(this._htOption.from, this._htOption.to);
        }
    }
    setValue(vValue) {
        this._nValue = vValue;
    }
    getValue() {
        return this._nValue;
    }
    run(nCurrentFrame, nFrameDuration) {
        if (nCurrentFrame === undefined) {
            nCurrentFrame = WGame.Renderer.getInfo().frame;
        }

        if (this._nFrameAtRunLastest > nCurrentFrame) {
            this.reset();
            return;
        }

        if (this._nFrameAtRunLastest === null) {
            this._nFrameAtRunLastest = nCurrentFrame;
            this._nRunningTime = 0;
            nFrameDuration = 0;
        }

        this._nRunningTime += nFrameDuration;
        this._nCount++;

        if (this._nRunningTime >= this._nDuration) {
            this._nCountCycle++;

            if (!this._isEndValue() && this._htOption.loop && this._htOption.loop <= this._nCountCycle) {
                this._setEndValue();
            } else if (!this._htOption.loop || this._htOption.loop > this._nCountCycle) {

                this.fireEvent("end");
                this._nFrameAtRunLastest = nCurrentFrame;
                this._nRunningTime = this._nRunningTime - this._nDuration; // 
                this._nValue = this._htOption.from;
                this._transitionValue(this._nRunningTime);
            } else {

                this.complete();
                return;
            }
        } else if (this._nRunningTime > 0) {
            this._transitionValue(this._nRunningTime);
        }

        this._htCallback.timer = this;
        this._htCallback.frame = nCurrentFrame;
        this._htCallback.duration = this._nDuration;
        this._htCallback.cycle = this._nCountCycle;
        this._htCallback.runningTime = this._nRunningTime;
        this._htCallback.from = this._htOption.from;
        this._htCallback.to = this._htOption.to;
        this._htCallback.value = this._nValue; //
        this.triggerCallback(this._htCallback);

        if (this._nRunningTime > 0) {
            this._nFrameAtRunLastest = nCurrentFrame;
        }
    }
    _transitionValue(nCurrentRunningTime) {
        if (this._bIsArrayValue) {
            this._nValue = [];

            for (var i = 0, len = this._htOption.from.length; i < len; i++) {
                this._nValue[i] = parseFloat(this._fEffect[i](Math.max(0, Math.min(1, nCurrentRunningTime / this._nDuration))));
            }
        } else {
            this._nValue = parseFloat(this._fEffect(Math.max(0, Math.min(1, nCurrentRunningTime / this._nDuration))));
        }
    }
    _isEndValue() {
        if (this._bIsArrayValue) {
            for (var i = 0, len = this._htOption.to.length; i < len; i++) {
                if (this._nValue[i] !== parseFloat(this._fEffect[i](1))) {
                    return false;
                }
            }

            return true;
        } else {
            return this._nValue === parseFloat(this._fEffect(1));
        }
    }
    _setEndValue() {
        if (this._bIsArrayValue) {
            for (var i = 0, len = this._htOption.to.length; i < len; i++) {
                this._nValue[i] = parseFloat(this._fEffect[i](1));
            }
        } else {
            this._nValue = parseFloat(this._fEffect(1));
        }
    }
}
WGame.AnimationTransition = AnimationTransition;

class AnimationRepeat extends Animation {
    constructor(fCallback, nDuration, htOption) {
        super(fCallback, nDuration, htOption)
        this.option({
            beforeDelay: 0,
            afterDelay: 0,
            loop: 0,
            useRealTime: true
        });
        this.option(htOption || {});
        this.reset();
        this.setDuration(nDuration);
        this._nFrameAtRunLastest = null;
    }
    setDuration(nDuration) {
        nDuration = parseInt(nDuration, 10);

        if (nDuration < WGame.Renderer.getDuration()) {
            nDuration = WGame.Renderer.getDuration();
        }

        this._nDuration = nDuration;
    }
    reset() {
        this._nCount = 0;
        this._nFrameAtRunLastest = null;
        this._nRunningTime = null;
        this._nRunLastestTime = null;
        this._nBeforeDelay = this._htOption.beforeDelay;
    }
    run(nCurrentFrame, nFrameDuration) {
        if (nCurrentFrame === undefined) {
            nCurrentFrame = WGame.Renderer.getInfo().frame;
        }

        if (this._nFrameAtRunLastest > nCurrentFrame) {
            this.reset();
            return;
        }

        if (this._nFrameAtRunLastest === null) {
            this._nFrameAtRunLastest = nCurrentFrame;
            this._nRunningTime = 0;
            this._nRunLastestTime = 0;
            nFrameDuration = 0;
        }

        this._nRunningTime += nFrameDuration;
        var nSkippedCount = Math.max(1, Math.floor((this._nRunningTime - this._nRunLastestTime) / this._nDuration)) - 1;

        if (this._nCount === 0 && this._nBeforeDelay) {
            if (this._nRunLastestTime + this._nBeforeDelay <= this._nRunningTime) {
                this.reset();
                this._nBeforeDelay = 0;
            }
            return;
        }

        if (this._nRunningTime === 0 || this._nRunLastestTime + this._nDuration <= this._nRunningTime) {
            this._nCount += this._htOption.useRealTime ? 1 + nSkippedCount : 1;
            this._fCallback({
                timer: this,
                frame: nCurrentFrame,
                duration: this._nDuration,
                count: this._nCount,
                skippedCount: nSkippedCount,
                runningTime: this._nRunningTime
            });

            if (this._htOption.loop && this._htOption.loop <= this._nCount) {
                this.complete();
                return;
            }

            this._nFrameAtRunLastest = nCurrentFrame;
            this._nRunLastestTime = this._nRunningTime;
        }
    }

}
WGame.AnimationRepeat = AnimationRepeat;

class AnimationCycle extends Animation {
    constructor(fCallback, nDuration, htOption) {
        super(fCallback, nDuration, htOption)
        this._nFPS = null;
        this._htCallback = {};
        var fSetterFPS = this._setterFPS.bind(this);
        this.optionSetter("valueSet", this._setterValueSet.bind(this));
        this.optionSetter("to", fSetterFPS);
        this.optionSetter("from", fSetterFPS);
        this.option({
            delay: 0, //
            from: 0, // 
            to: 0, // 
            step: 1, //
            loop: 0, // 
            set: "spriteX",
            useRealTime: true,
            valueSet: null,
            start: null // 
        });
        this.option(htOption || {});
        this._nFrameAtRunLastest = null;
        this._nRunLastestTime = null;
        this._nRunningTime = null;
        this._nCountCycle = 0;
        this._nCountCycleBefore = 0;
        this.setDuration(nDuration);
        this.reset();
    }
    reset() {
        this._nCount = 0;
        this._nCountCycle = 0;
        this._nCountCycleBefore = 0;
        this._nFrameAtRunLastest = null;
        this._nRunningTime = null;
        this._nRunLastestTime = null;
        this._nValue = (this._htOption.start !== null ? this._htOption.start : this._htOption.from) - this._htOption.step;
    }
    _setterValueSet() {
        var aValueSet = this._htOption.valueSet;

        if (aValueSet && aValueSet instanceof Array) {
            this.option({
                from: 0,
                to: aValueSet.length - 1,
                step: 1
            });
        }
    }
    _setterFPS() {
        if (this._nFPS !== null && typeof this._htOption.to !== "undefined" && typeof this._htOption.from !== "undefined") {
            var nCount = (this._htOption.to - this._htOption.from) + 1;
            this._nDuration = Math.round(1000 / this._nFPS * nCount);
        }
    }
    setDuration(nDuration) {
        this._nDuration = parseInt(nDuration, 10);

        if (/fps/i.test(nDuration) && typeof this._htOption.to !== "undefined" && typeof this._htOption.from !== "undefined") {
            this._nFPS = parseInt(nDuration, 10);
            this._setterFPS();
        } else {
            this._nFPS = null;
        }
    }
    setValue(vValue) {
        this._nValue = vValue;
    }
    getValue() {
        return this._htOption.valueSet ? this._htOption.valueSet[this._nValue] : this._nValue;
    }

    run(nCurrentFrame, nFrameDuration) {
        if (typeof nCurrentFrame === "undefined") {
            nCurrentFrame = WGame.Renderer.getInfo().frame;
        }

        if (this._nFrameAtRunLastest > nCurrentFrame) {
            this.reset();
            return;
        }

        if (this._nFrameAtRunLastest === null) {
            this._nFrameAtRunLastest = nCurrentFrame;
            this._nRunLastestTime = 0; // 
            this._nRunningTime = 0;
            nFrameDuration = 0; //
        }

        if (!nFrameDuration) {
            nFrameDuration = 0;
        }

        var htOption = this._htOption;
        var nDiff = htOption.to - htOption.from;
        this._nTotalCount = nDiff / htOption.step; // 
        this._nTerm = this._nDuration / this._nTotalCount; // 
        this._nRunningTime += nFrameDuration; // x
        var nSkippedCount = (!htOption.useRealTime) ? 0 : Math.max(1, Math.floor((this._nRunningTime - this._nRunLastestTime) / this._nTerm)) - 1;

        if (this._nRunningTime === 0 || this._nRunLastestTime + this._nTerm <= this._nRunningTime) {
            if (this._nCountCycleBefore !== this._nCountCycle) {

                this.fireEvent("end");
            }

            if (htOption.loop && this._nCountCycle >= htOption.loop) {
                this.complete();
                return;
            }

            if (this._nValue === htOption.to) {
                this._nValue = htOption.from - htOption.step;
            }

            this._nValue += (htOption.step * (1 + nSkippedCount));
            this._nCount += (1 + nSkippedCount);
            this._nCountCycleBefore = this._nCountCycle;

            if (htOption.from <= htOption.to ? this._nValue >= htOption.to : this._nValue <= htOption.to) {
                var nOverCount = (this._nValue - htOption.to) / htOption.step;
                var nOverCountCycle = Math.ceil(nOverCount / (this._nTotalCount + 1)); // 
                nOverCount = nOverCount % (this._nTotalCount + 1);

                if (nOverCount) { // 
                    this._nCountCycle += nOverCountCycle;
                    this._nValue = htOption.from + (nOverCount - 1) * htOption.step;
                } else { // 
                    this._nCountCycle += 1;
                    this._nValue = htOption.to;
                }
            }

            this._htCallback.timer = this;
            this._htCallback.frame = nCurrentFrame;
            this._htCallback.duration = this._nDuration;
            this._htCallback.count = this._nCount;
            this._htCallback.skippedCount = nSkippedCount;
            this._htCallback.runningTime = this._nRunningTime;
            this._htCallback.value = this.getValue();
            this._htCallback.cycle = this._nCountCycle;
            this._htCallback.step = htOption.step;
            this._htCallback.from = htOption.from;
            this._htCallback.to = htOption.to;
            this.triggerCallback(this._htCallback);

            this._nFrameAtRunLastest = nCurrentFrame;
            this._nRunLastestTime = this._nRunningTime;
        }
    }
}
WGame.AnimationCycle = AnimationCycle;

class AnimationDelay extends Animation {
    constructor(fCallback, nDuration) {
        super(fCallback, nDuration)
        this.reset();
    }
    reset() {
        this._nFrameAtRunLastest = null;
        this._nRunningTime = null;
        this._nRunLastestTime = null;
    }
    run(nCurrentFrame, nFrameDuration) {
        if (nCurrentFrame === undefined) {
            nCurrentFrame = WGame.Renderer.getInfo().frame;
        }

        if (this._nFrameAtRunLastest > nCurrentFrame) {
            this.reset();
            return;
        }

        if (this._nFrameAtRunLastest === null) {
            this._nFrameAtRunLastest = nCurrentFrame;
            this._nRunLastestTime = 0;
            this._nRunningTime = 0;
            nFrameDuration = 0;
        }

        this._nRunningTime += nFrameDuration;

        if (this._nRunLastestTime + this._nDuration <= this._nRunningTime) {
            if (this._fCallback) {
                this._fCallback({
                    timer: this,
                    frame: nCurrentFrame,
                    duration: this._nDuration,
                    runningTime: this._nRunningTime
                });
            }

            this.complete();
        }
    }
}
WGame.AnimationDelay = AnimationDelay;

class AnimationTimeline extends Animation {
    constructor(fCallback, nDuration, htOption) {
        super(fCallback, nDuration, htOption)
        this.option("loop", 1);
        this.option(htOption || {});
        this.setOptionEvent(htOption);
        this._htAnimations = {};
        this._aTimeline = null;
        this._aRunningAnimation = null;
        this._nRunningTime = null;
        this._nCountCycle = 0;

        if (aTimeline) {
            for (var i = 0, l = aTimeline.length; i < l; i++) {
                this.addTimeline.apply(this, aTimeline[i]);
            }
        }

        this.reset();
    }

    add(nStartTime, vType, fCallback, nDuration, htOption) {
        var oAnimation;

        switch (vType) {
            case "delay":
                oAnimation = new WGame.AnimationDelay(fCallback, nDuration, htOption);
                break;

            case "repeat":
                oAnimation = new WGame.AnimationRepeat(fCallback, nDuration, htOption);
                break;

            case "transition":
                oAnimation = new WGame.AnimationTransition(fCallback, nDuration, htOption);
                break;

            case "cycle":
                oAnimation = new WGame.AnimationCycle(fCallback, nDuration, htOption);
                break;

            case "queue":
                oAnimation = new WGame.AnimationQueue(fCallback /* htOption임 */ );
                break;

            default:
                if (vType instanceof WGame.Animation) {
                    oAnimation = vType;
                } else {
                    throw new Error(vType + ' timer is not defined');
                }
        }

        this._addTimeline(nStartTime, oAnimation);
        return oAnimation;
    }
    _addTimeline(nStartTime, oAnimation) {
        nStartTime = parseInt(nStartTime, 10);
        this._htAnimations[nStartTime] = this._htAnimations[nStartTime] || [];
        this._htAnimations[nStartTime].push(oAnimation);

        if (this._aTimeline !== null) {
            this.reset();
        }
    }
    remove(nStartTime, oTimer) {
        nStartTime = parseInt(nStartTime, 10);

        if (this._htAnimations && this._htAnimations[nStartTime]) {
            for (var i = 0; i < this._htAnimations[nStartTime].length; i++) {
                if (typeof oTimer === "undefined" || oTimer === this._htAnimations[nStartTime][i]) {
                    this._htAnimations[nStartTime][i].stop();
                    this._htAnimations[nStartTime].splice(i, 1);
                    i--;

                    if (typeof oTimer !== "undefined") {
                        break;
                    }
                }
            }

            if (this._htAnimations[nStartTime].length < 1) {
                delete this._htAnimations[nStartTime];
                this._removeTimelineStartTime(nStartTime);
            }
        }
    }
    _removeTimelineStartTime(nStartTime) {
        if (this._aTimeline) {
            for (var i = 0, l = this._aTimeline.length; i < l; i++) {
                if (this._aTimeline[i] === nStartTime) {
                    this._aTimeline.splice(i, 1);
                    break;
                }
            }
        }
    }
    _initTimeline() {
        this._aTimeline = [];
        this._aRunningAnimation = [];

        for (var i in this._htAnimations) {
            this._aTimeline.push(parseInt(i, 10));
        }

        this._aTimeline.sort(function (a, b) {
            return a - b;
        });
    }
    getAnimation(nStartTime) {
        nStartTime = parseInt(nStartTime, 10);
        return (this._htAnimations && this._htAnimations[nStartTime]) ? this._htAnimations[nStartTime] : false;
    }
    getRunningTime() {
        return this._nRunningTime || 0;
    }
    getCycle() {
        return this._nCountCycle || 0;
    }
    reset() {
        this._nFrameAtRunLastest = null;
        this._nRunningTime = null;
        this._aTimeline = null;
        this._aRunningAnimation = null;
        this._nCountCycle = 0;
        this._initTimeline();
    }
    run(nCurrentFrame, nFrameDuration) {
        if (nCurrentFrame === undefined) {
            nCurrentFrame = WGame.Renderer.getInfo().frame;
        }

        if (this._nFrameAtRunLastest > nCurrentFrame) {
            this.reset();
            return;
        }

        if (this._nFrameAtRunLastest === null) {
            this._nFrameAtRunLastest = nCurrentFrame;
            this._nRunningTime = 0;
            nFrameDuration = 0;
        }

        this._nRunningTime += nFrameDuration;

        if (this._aTimeline.length > 0) {
            while (this._aTimeline[0] <= this._nRunningTime) {
                var nStartTime = this._aTimeline.shift();

                for (var i = 0, l = this._htAnimations[nStartTime].length; i < l; i++) {
                    this._aRunningAnimation.push(this._htAnimations[nStartTime][i]);
                    this._htAnimations[nStartTime][i].start();
                }
            }
        }

        if (this._aRunningAnimation.length > 0) {
            for (var i = 0; i < this._aRunningAnimation.length; i++) {
                if (this._aRunningAnimation[i]) {
                    this._aRunningAnimation[i].run(nCurrentFrame, nFrameDuration);
                }

                if (!this._aRunningAnimation[i] || !this._aRunningAnimation[i].isPlaying()) {
                    if (this._aRunningAnimation[i]) {
                        this._aRunningAnimation[i].reset();
                    }

                    this._aRunningAnimation.splice(i, 1);
                    i--;
                    this._checkComplete();
                }
            }
        }
    }
    _checkComplete() {
        if (this._aRunningAnimation.length < 1 && this._aTimeline.length < 1) {
            this._nCountCycle++;

            if (this._htOption.loop && this._htOption.loop <= this._nCountCycle) {

                this.complete();
            } else {

                this.fireEvent("end");
                this._nFrameAtRunLastest = null;
                this._nRunningTime = null;
                this._aTimeline = null;
                this._aRunningAnimation = null;
                this._initTimeline();
            }
        }
    }
}
WGame.AnimationTimeline = AnimationTimeline;

class AnimationQueue extends Animation {
    constructor(htOption) {
        super(null, null, htOption)
        this.option("loop", 1);
        this.option(htOption || {});
        this.setOptionEvent(htOption);
        this._aAnimations = [];
        this._fOnCompleteAnimation = this._onCompleteAnimation.bind(this);
        this.reset();
    }
    delay(fCallback, nDuration, htOption) {
        this._add(new WGame.AnimationDelay(fCallback, nDuration, htOption));
        return this;
    }
    repeat(fCallback, nDuration, htOption) {
        this._add(new WGame.AnimationRepeat(fCallback, nDuration, htOption));
        return this;
    }
    transition(fCallback, nDuration, htOption) {
        this._add(new WGame.AnimationTransition(fCallback, nDuration, htOption));
        return this;
    }
    cycle(fCallback, nDuration, htOption) {
        this._add(new WGame.AnimationCycle(fCallback, nDuration, htOption));
        return this;
    }
    getAnimation(nIdx) {
        return this._aAnimations[nIdx] || false;
    }
    _add(oAnimation) {
        oAnimation.attach("complete", this._fOnCompleteAnimation);
        this._aAnimations.push(oAnimation);
    }
    _onCompleteAnimation() {
        this.next();
    }
    next() {
        if (this._nAnimationIdx === null) {
            this._nAnimationIdx = 0;
        } else {
            this._nAnimationIdx++;
        }

        if (this._nAnimationIdx >= this._aAnimations.length) {
            this._nCount++;

            this.fireEvent("end", {
                count: this._nCount
            });

            if (!this._htOption.loop || this._htOption.loop > this._nCount) {
                this._nAnimationIdx = 0;
            } else {

                this.complete();
                return;
            }
        }

        this._aAnimations[this._nAnimationIdx].stop();
        this._aAnimations[this._nAnimationIdx].start();
    }
    reset() {
        this._nFrameAtRunLastest = null;
        this._nAnimationIdx = null;
        this._nCount = 0;
    }
    removeAll() {
        this._aAnimations = [];
        this.reset();
    }
    removeAfter() {
        if (this._nAnimationIdx + 1 <= this._aAnimations.length - 1) {
            var count = this._aAnimations.length - (this._nAnimationIdx + 1);
            this._aAnimations.splice(this._nAnimationIdx + 1, count);
        }
    }
    run(nCurrentFrame, nFrameDuration) {
        if (this._aAnimations.length < 1) {
            return;
        }

        if (nCurrentFrame === undefined) {
            nCurrentFrame = WGame.Renderer.getInfo().frame;
        }

        if (this._nFrameAtRunLastest > nCurrentFrame) {
            this.reset();
            return;
        }

        if (this._nFrameAtRunLastest === null) {
            this._nFrameAtRunLastest = nCurrentFrame;
        }

        if (this._nAnimationIdx === null) {
            this.next();
        }

        this._aAnimations[this._nAnimationIdx].run(nCurrentFrame, nFrameDuration);
    }
}
WGame.AnimationQueue = AnimationQueue;

class TimerList {
    constructor() {
        this._aList = [];
    }
    add(oAnimation) {
        this._aList.unshift(oAnimation);
    }
    remove(oAnimation) {
        for (var i = 0, len = this._aList.length; i < len; i++) {
            if (this._aList[i] === oAnimation) {
                this._aList.splice(i, 1);
                break;
            }
        }
    }
    removeAll() {
        this._aList = [];
    }
    stopAll() {
        for (var i = 0, len = this._aList.length; i < len; i++) {
            this._aList[i].stop();
        }
    }
    run(nCurrentFrame, nFrameDuration) {
        for (var i = this._aList.length - 1; i >= 0; i--) {
            if (this._aList[i]) {
                if (this._aList[i].isPlaying()) {
                    this._aList[i].run(nCurrentFrame, nFrameDuration);
                } else {
                    this._aList.splice(i, 1);
                }
            }
        }
    }
}
WGame.TimerList = TimerList;

class Timer {
    constructor() {
        this._oList = new WGame.TimerList();
    }
    run(nCurrentFrame, nFrameDuration) {
        this._oList.run(nCurrentFrame, nFrameDuration);
    }
    stopAll() {
        this._oList.stopAll();
    }
    removeAll() {
        this._oList.removeAll();
    }
    queue(htOption) {
        var oAnimation = new WGame.AnimationQueue(htOption);
        oAnimation.setTimerList(this._oList);
        return oAnimation;
    }
    repeat(fCallback, nDuration, htOption) {
        var oAnimation = new WGame.AnimationRepeat(fCallback, nDuration, htOption);
        oAnimation.setTimerList(this._oList);
        return oAnimation;
    }
    transition(fCallback, nDuration, htOption) {
        var oAnimation = new WGame.AnimationTransition(fCallback, nDuration, htOption);
        oAnimation.setTimerList(this._oList);
        return oAnimation;
    }
    cycle(fCallback, nDuration, htOption) {
        var oAnimation = new WGame.AnimationCycle(fCallback, nDuration, htOption);
        oAnimation.setTimerList(this._oList);
        return oAnimation;
    }
    delay(fCallback, nDuration, htOption) {
        var oAnimation = new WGame.AnimationDelay(fCallback, nDuration, htOption);
        oAnimation.setTimerList(this._oList);
        return oAnimation;
    }
    timeline(aTimeline, htOption) {
        var oAnimation = new WGame.AnimationTimeline(aTimeline, htOption);
        oAnimation.setTimerList(this._oList);
        return oAnimation;
    }
}
WGame.Timer = new Timer();


class Renderer extends Component {
    DEFAULT_FPS = "60fps"
    RETINA_DISPLAY = false
    DEBUG_USE_DELAY = false
    DEBUG_MAX_DELAY = 200

    constructor(props) {
        super(props)
        this._bPlaying = false;
        this._bPause = false;
        this._nFPS = 0;
        this._nDuration = 0; // ms
        this._nCurrentFrame = 0;
        this._nSkippedFrame = 0;
        this._nBeforeFrameTime = null; // ms
        this._nBeforeRenderingTime = 0; // ms
        this._aLayerList = [];
        this._fRender = this._render.bind(this);
        this._fCallback = null;
        this._htCallback = {};
        this._elContainer = document.createElement("div");
        this._elParent = null;
        this._nDebugDelayedTime = 0;
        this._oRenderingTimer = null;
        this._bLoaded = false;
        this._sRenderingMode = null;
        this._bUseRetinaDisplay = null;
        this._htEventStatus = {};
        this._htPosition = {};
        this._bIsPreventDefault = true;
        this._htDeviceInfo = WGame.util.getDeviceInfo();

    }

    refresh() {
        if (this._elParent !== null) {
            this._htPosition = WGame.util.getPosition(this._elParent);
        }
    }

    getPosition() {
        return this._bLoaded ? this._htPosition : false;
    }

    addLayer(oLayer) {
        if (!oLayer || !("type" in oLayer) || oLayer.type !== "layer") {
            throw new Error('oLayer is not Layer instnace');
        }

        for (var i = 0, len = this._aLayerList.length; i < len; i++) {
            if (this._aLayerList[i] === oLayer) {
                return;
            }
        }

        this._aLayerList.push(oLayer);

        if (this._bLoaded) {
            oLayer.load(this._elContainer, this._aLayerList.length);
            this.resetLayerEvent();
        }
    }

    removeLayer(oLayer) {
        for (var i = 0, len = this._aLayerList.length; i < len; i++) {
            if (this._aLayerList[i] === oLayer) {
                this._aLayerList[i].unload(); // 
                this._aLayerList.splice(i, 1);
                return;
            }
        }
    }

    removeAllLayer() {
        for (var i = this._aLayerList.length - 1; i >= 0; i--) {
            this._aLayerList[i].unload();
        }

        this._aLayerList = [];
    }

    getLayers() {
        return this._aLayerList;
    }

    resetLayerEvent() {
        for (var i = 0, len = this._aLayerList.length; i < len; i++) {
            this._aLayerList[i].detachEvent();
        }

        for (var i = this._aLayerList.length - 1; i >= 0; i--) {
            this._aLayerList[i].attachEvent();
        }
    }

    getElement() {
        return this._elContainer;
    }

    getDuration() {
        return this._nDuration;
    }

    getInfo() {
        this._htCallback.frame = this._nCurrentFrame;
        this._htCallback.skippedFrame = this._nSkippedFrame;
        this._htCallback.fps = this._nFPS;
        this._htCallback.duration = this._nDuration;
        this._htCallback.renderingTime = this._nBeforeRenderingTime;
        this._htCallback.beforeFrameTime = this._nBeforeFrameTime;
        return this._htCallback;
    }

    getRenderingMode() {
        if (this._sRenderingMode === null) {
            var htDeviceInfo = WGame.util.getDeviceInfo();
            this._sRenderingMode = "canvas";
        }

        return this._sRenderingMode;
    }

    setRenderingMode(sMode) {
        this._sRenderingMode = null;
    }

    isRetinaDisplay() {
        if (this._bUseRetinaDisplay === null) {
            this._bUseRetinaDisplay = this.RETINA_DISPLAY !== "auto" ? this.RETINA_DISPLAY : window.devicePixelRatio >= 2 && (!WGame.util.getDeviceInfo().android || WGame.util.getDeviceInfo().android >= 4);
            var htDeviceInfo = WGame.util.getDeviceInfo();

            if (htDeviceInfo.ie && htDeviceInfo.ie < 9) {
                this._bUseRetinaDisplay = false;
            }
        }

        return this._bUseRetinaDisplay;
    }

    setRetinaDisplay(vMode) {
        this.RETINA_DISPLAY = vMode;
        this._bUseRetinaDisplay = null;
    }

    _getNameAnimationFrame(bCancelName) {
        if (typeof window.requestAnimationFrame !== "undefined") {
            return bCancelName ? "cancelAnimationFrame" : "requestAnimationFrame";
        } else if (typeof window.webkitRequestAnimationFrame !== "undefined") {
            return bCancelName ? "webkitCancelAnimationFrame" : "webkitRequestAnimationFrame";
        } else if (typeof window.msRequestAnimationFrame !== "undefined") {
            return bCancelName ? "msCancelAnimationFrame" : "msRequestAnimationFrame";
        } else if (typeof window.mozRequestAnimationFrame !== "undefined") {
            return bCancelName ? "mozCancelAnimationFrame" : "mozRequestAnimationFrame";
        } else if (typeof window.oRequestAnimationFrame !== "undefined") {
            return bCancelName ? "oCancelAnimationFrame" : "oRequestAnimationFrame";
        } else {
            return false;
        }
    }


    load(elParent) {
        this.unload();
        this._bLoaded = true;
        this._elParent = elParent;
        this._elParent.appendChild(this._elContainer);
        this.refresh();

        if (this._aLayerList.length) {
            for (var i = 0, len = this._aLayerList.length; i < len; i++) {
                this._aLayerList[i].load(this._elContainer, i);
            }

            for (var i = this._aLayerList.length - 1; i >= 0; i--) {
                this._aLayerList[i].attachEvent();
            }
        }

    }

    unload() {
        if (this._bLoaded) {
            for (var i = 0, len = this._aLayerList.length; i < len; i++) {
                this._aLayerList[i].unload();
            }

            this._elParent.removeChild(this._elContainer);
            this._elParent = null;
            this._bLoaded = false;
        }
    }


    start(vDuration, fCallback) {
        if (!this._bPlaying) {
            vDuration = vDuration || this.DEFAULT_FPS;
            this._nDuration = (/fps$/i.test(vDuration)) ? 1000 / parseInt(vDuration, 10) : Math.max(16, vDuration);
            this._fCallback = fCallback || null;
            this._bPlaying = true;

            if (this._nDuration < 17) {
                this._sRequestAnimationFrameName = this._getNameAnimationFrame();
                this._sCancelAnimationFrameName = this._getNameAnimationFrame(true);
            } else {
                this._sRequestAnimationFrameName = false;
                this._sCancelAnimationFrameName = false;
            }

            this.fireEvent("start");
            this._trigger(0);
        }

    }

    _trigger(nDelay) {

        if (typeof nDelay === "undefined") {
            nDelay = 0;
        } else {
            nDelay = parseInt(nDelay, 10);
        }

        if (this._sRequestAnimationFrameName !== false && !this.DEBUG_USE_DELAY) {
            this._oRenderingTimer = window[this._sRequestAnimationFrameName](this._fRender);
        } else {
            this._oRenderingTimer = setTimeout(this._fRender, nDelay);
        }
    }

    _render(nSkippedFrame, bForcePlay) {
        if (!this._bPlaying && !bForcePlay) {
            return;
        }

        var nTime = this._getDate();
        var nRealDuration = 0;
        var nFrameStep = 1; // 

        if (this._nBeforeFrameTime !== null) {
            nRealDuration = nTime - this._nBeforeFrameTime; //
            nFrameStep = nSkippedFrame || Math.max(1, Math.round(nRealDuration / this._nDuration));

            if (this._sRequestAnimationFrameName !== false) {
                nSkippedFrame = 0;
                nFrameStep = 1;
            }

            this._nSkippedFrame += Math.max(0, nFrameStep - 1);
            this._nFPS = Math.round(1000 / (nTime - this._nBeforeFrameTime));
        }

        this._nCurrentFrame += nFrameStep;
        var htInfo = this.getInfo();

        if ((this._fCallback === null || this._fCallback(htInfo) !== false) && this.fireEvent("process", htInfo) !== false) {
            WGame.Timer.run(this._nCurrentFrame, nRealDuration);
            this._update(nRealDuration);
            var nDebugDelayedTime = 0;

            if (this.DEBUG_USE_DELAY) {
                nDebugDelayedTime = Math.round(Math.random() * this.DEBUG_MAX_DELAY);
                this._nDebugDelayedTime += nDebugDelayedTime;
            }

            this._nBeforeRenderingTime = this._getDate() - nTime;
            this._nBeforeFrameTime = nTime;

            if (this._bPlaying) {
                this._trigger(Math.max(0, this._nDuration - this._nBeforeRenderingTime + nDebugDelayedTime * 2));
            }
        } else {
            this.stop();
        }
    }

    draw(nSkippedFrame) {
        this._fRender(nSkippedFrame, true);
    }

    _getDate() {
        return (+new Date()) + (this.DEBUG_USE_DELAY ? this._nDebugDelayedTime : 0);
    }

    stop() {
        if (this._bPlaying) {
            this._bPlaying = false;
            this._resetTimer();

            this.fireEvent("stop", this.getInfo());

            this._sRenderingMode = null;
            this._bUseRetinaDisplay = null;
            this._fCallback = null;
            this._nCurrentFrame = 0;
            this._nBeforeRenderingTime = 0;
            this._nSkippedFrame = 0;
            this._nBeforeFrameTime = null;
        }
    }

    _resetTimer() {
        if (this._oRenderingTimer !== null) {
            if (this._sCancelAnimationFrameName !== false) {
                window[this._sCancelAnimationFrameName](this._oRenderingTimer);
            } else {
                clearTimeout(this._oRenderingTimer);
            }

            //TODO debug			
            window.tempTimer = window.tempTimer || [];
            window.tempTimer.push(this._oRenderingTimer);
            this._oRenderingTimer = null;
        }
    }

    pause() {
        if (this._bPlaying) {
            this._bPlaying = false;
            this._bPause = true;

            this.fireEvent("pause", this.getInfo());

            this._resetTimer();
        }
    }

    resume() {
        if (this._bPause) {
            this._nBeforeFrameTime = this._getDate();
            this._nBeforeRenderingTime = 0;
            this._bPlaying = true;
            this._bPause = false;

            this.fireEvent("resume", this.getInfo());
            this._trigger(0);
        }
    }

    isPlaying() {
        return this._bPlaying;
    }

    _update(nFrameDuration) {
        for (var i = 0, len = this._aLayerList.length; i < len; i++) {
            this._aLayerList[i].update(nFrameDuration);
        }
    }

    setEventStatus(sEventType, bFiredOnTarget) {
        this._htEventStatus = {
            type: sEventType,
            firedOnTarget: bFiredOnTarget
        };
    }

    isStopEvent(sEventType) {
        if (sEventType === "click") {
            sEventType = "mouseup";
        }

        return sEventType === this._htEventStatus.type && this._htEventStatus.firedOnTarget;
    }

    getEventStatus() {
        return this._htEventStatus;
    }

    setPreventDefault(bPreventDefault) {
        this._bIsPreventDefault = !!bPreventDefault;
    }

    isPreventDefault() {
        return this._bIsPreventDefault;
    }

    resize(nWidth, nHeight, bExpand) {
        for (var i = 0, len = this._aLayerList.length; i < len; i++) {
            this._aLayerList[i].resize(nWidth, nHeight, bExpand);
        }
    }
}
WGame.Renderer = new Renderer();


export default WGame;