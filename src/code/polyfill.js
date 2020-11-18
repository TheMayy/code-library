// 兼容方法

// 1.Object.js方法, 检查两个值是否严格相等
if (!Object.is) {
    Object.is = function (v1, v2) {
        // 检查-0
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2;
        }
        // 检查NaN
        if (v1 !== v1) {
            return v2 !== v2;
        }
        // 其余所有情况
        return v1 === v2;
    };
}

// 2.requestAnimationFrame 兼容
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

// 3.浏览器全屏方法 兼容
(function () {
    /*全屏操作的主要方法和属性
     * 1.requestFullScreen():开启全屏显示
     *   不同浏览器需要添加不同的前缀
     *   chrome:webkit   firefox:moz   ie:ms   opera:o
     * 2.cancelFullScreen():退出全屏显示:也添加前缀，在不同的浏览器下.退出全屏只能使用document来实现
     * 3.fullScreenElement:是否是全屏状态，也只能使用document进行判断
     */

    // 全屏操作
    window._RequestFullScreen = (dom) => {
        if (dom.requestFullScreen) {
            dom.requestFullScreen();
        } else if (dom.webkitRequestFullScreen) {
            dom.webkitRequestFullScreen();
        } else if (dom.mozRequestFullScreen) {
            dom.mozRequestFullScreen();
        } else if (dom.msRequestFullScreen) {
            dom.msRequestFullScreen();
        }
    }

    // 退出全屏
    window._cancelFullScreen = () => {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msCancelFullScreen) {
            document.msCancelFullScreen();
        }
    }

    // 判断是否是全屏状态
    window._fullScreenType = () => {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            return true;
        } else {
            return false;
        }
    }
}())

/*
 ** 4.HTML accesskey辅助增强脚本
 ** by zhangxinxu(.com) 2017-05-14
 ** 作用包括：
 ** 1. 统一IE浏览器和其它浏览器的快捷访问行为；
 ** 2. 增加单独accesskey属性值对应按键按下的focus行为；
 ** 3. 增加accesskey生效的前置键按下的提示行为，例如window上Alt键提示，Mac下的Alt + control组合提示等；
 ** 4. 增加shift + '?'(keyCode=191)键的提示行为支持；
 ** MIT
 */

(function (doc, win) {
    // 操作系统和浏览器设备检测
    var ua = navigator.userAgent;

    var syetem = 'windows';

    if (/Mac\sOS\sX/i.test(ua)) {
        syetem = 'mac';
    }

    // 浏览器判断
    var browser = 'chrome';
    if (typeof doc.mozFullScreen != 'undefined') {
        browser = 'moz';
    } else if (typeof doc.msHidden != 'undefined' || typeof doc.hidden == 'undefined') {
        browser = 'ie';
    }

    // 快捷键组合
    var keyPrefix = ({
        windows: (browser == 'moz' ? {
            ctrlKey: false,
            altKey: true,
            shiftKey: true
        } : {
            ctrlKey: false,
            altKey: true,
            shiftKey: false
        }),
        mac: {
            ctrlKey: true,
            altKey: true,
            shiftKey: false
        }
    })[syetem];

    // 获取字符Unicode值方法
    var U = function (a, b) {
        if (!a) return "";
        for (var b = b || "x", c = "", d = 0, e; d < a.length; d += 1) a.charCodeAt(d) >= 55296 && a.charCodeAt(d) <= 56319 ? (e = (65536 + 1024 * (Number(a.charCodeAt(d)) - 55296) + Number(a.charCodeAt(d + 1)) - 56320).toString(16), d += 1) : e = a.charCodeAt(d).toString(16),
            c += b + e;
        return c.substr(b.length)
    };

    // 提示当前元素快捷键的方法
    var timerTips = null;
    var tips = function (arrEles) {
        // 已经显示中，忽略
        if (doc.hasTipsShow) {
            return;
        }
        // 页面的滚动高度
        var scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
        var scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;

        // 遍历创建提示元素
        arrEles.forEach(function (ele) {

            // 如果元素隐藏，也忽略
            if (ele.clientHeight * ele.clientWidth == 0) {
                return;
            }

            var accesskey = ele.getAttribute('accesskey');
            var arrAccesskey = [];
            for (var key in keyPrefix) {
                if (keyPrefix[key]) {
                    arrAccesskey.push(key);
                }
            }
            arrAccesskey.push(accesskey);

            // 当前元素相对于文档的偏移
            var bounding = ele.getBoundingClientRect();

            // 创建tips提示元素
            var div = document.createElement('div');
            div.className = 'AK_Tips';
            div.setAttribute('style', 'position:absolute;top:' + (bounding.top + scrollTop) + 'px;left:' + (bounding.left + scrollLeft) + 'px;z-index:9999;font-family:consolas,"Liberation Mono",courier,monospace;font-size:12px;border-radius:2px;color:#fff;background:rgba(0,0,0,.75);opacity:0.8;line-height:13px;padding:0 3px;');
            div.innerHTML = arrAccesskey.map(function (key) {
                return '<kbd style="font-family:inherit;">' + key.replace('Key', '') + '</kbd>';
            }).join('+');

            document.body.appendChild(div);

            div.fromTarget = ele;
        });

        // 标记，避免重复生成
        doc.hasTipsShow = true;

        // 一段时间隐藏
        timerTips = setTimeout(function () {
            removeTips();
        }, 3000);
    };
    // 隐藏tips
    var removeTips = function () {
        clearTimeout(timerTips);
        // 移除所有的快捷键提示
        var elesTips = doc.querySelectorAll('.AK_Tips');
        [].slice.call(elesTips).forEach(function (ele) {
            if (ele.fromTarget) {
                ele.fromTarget.hasTipsShow = null;
            }
            doc.body.removeChild(ele);
        });
        doc.hasTipsShow = null;
    };

    if (doc.addEventListener) {
        // IE9+
        doc.addEventListener('keydown', function (event) {
            // 当前元素是否是可输入的input或者textarea
            var isTargetInputable = false;
            var eleTarget = event.target || doc.activeElement;
            var tagName = eleTarget.tagName.toLowerCase();
            if (tagName == 'textarea' || (tagName == 'input' && /checkbox|radio|select|file|button|image|hidden/.test(eleTarget.type) == false)) {
                isTargetInputable = true;
            }

            // 遍历所有设置了accesskey的符合HTML4.0.1规范的元素
            // 包括<a>, <area>, <button>, <input>, <label>, <legend>以及<textarea>
            var elesOwnAccesskey = doc.querySelectorAll('a[accesskey],area[accesskey],button[accesskey],input[accesskey],label[accesskey],legend[accesskey],textarea[accesskey]');
            if (elesOwnAccesskey.length == 0) {
                return;
            }
            // 对象列表转换成数组
            var arrElesOwnAccesskey = [].slice.call(elesOwnAccesskey);
            // 进行遍历
            var arrAcceeekey = arrElesOwnAccesskey.map(function (ele) {
                return ele.getAttribute('accesskey');
            });
            // windows下图下直接event.key就是按下的键对于的内容，但OS X系统却没有key属性，有的是event.keyIdentifier，表示字符的Unicode值
            // 根据这个判断按键是否有对应的匹配
            var indexMatch = -1;
            arrAcceeekey.forEach(function (accesskey, index) {
                if ((event.key && event.key == accesskey) || (event.keyIdentifier && parseInt(event.keyIdentifier.toLowerCase().replace('u+', ''), 16) == parseInt(U(accesskey), 16))) {
                    indexMatch = index;
                    return false;
                }
            });

            // 1. 单独按下某个键的匹配支持
            if (event.altKey == false && event.shiftKey == false && event.ctrlKey == false) {
                if (isTargetInputable) {
                    return;
                }
                // focus高亮
                if (arrElesOwnAccesskey[indexMatch]) {
                    arrElesOwnAccesskey[indexMatch].focus();
                    // 阻止内容输入
                    event.preventDefault();
                }
                // 2. shift + '?'(keyCode=191)键的提示行为支持
            } else if (event.altKey == false && event.shiftKey == true && event.ctrlKey == false) {
                if (event.keyCode == 191 && !isTargetInputable) {
                    doc.hasTipsShow ? removeTips() : tips(arrElesOwnAccesskey);
                }
                // 3. 增加accesskey生效的前置键按下的提示行为
            } else if (event.altKey == keyPrefix.altKey && event.shiftKey == keyPrefix.shiftKey && event.ctrlKey == keyPrefix.ctrlKey) {
                if (indexMatch == -1) {
                    event.preventDefault();
                    doc.hasTipsShow ? removeTips() : tips(arrElesOwnAccesskey);
                } else {
                    removeTips();
                }

                // 4. IE浏览器和其他浏览器行为一致的处理
                if (browser == 'ie' && arrElesOwnAccesskey[indexMatch] && !isTargetInputable) {
                    // click行为触发
                    arrElesOwnAccesskey[indexMatch].click();
                }
            }
        });
        doc.addEventListener('mousedown', function (event) {
            removeTips();
        });
    }
})(document, window);

// 5.ajax兼容
(function(win) {
	var xhr;
	if(window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}else {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
})(window);