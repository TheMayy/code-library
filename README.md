# code-labrary
> 存放常用的代码片段，随拿随用

[TOC]

## SASS/SCSS

### 多行文本超出打点
```scss
// 多行文本超出打点, 参数为行数
@mixin textOver($num) {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: $num; //行数
	-webkit-box-orient: vertical;
}
```

### 绝对定位水平居中
```scss
// 绝对定位 水平居中 参数为高度
@mixin absHorizontalCenter($top) {
	position: absolute;
	top: $top;
	left: 50%;
	transform: translateX(-50%);
}

```

### 文本水平垂直居中

```scss
// 文本水平垂直居中 参数为高度
@mixin textCenter($height) {
	height: $height;
	line-height: $height;
	text-align: center;
}
```
## JS

### cookie

```js
// 设置cookie值
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

// 获取cookie值
function getCookie(cname) {
	
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

// 检测cookie值
function checkCookie() {
	var username = getCookie("username");
	if (username != "") {
		alert("Welcome again " + username);
	} else {
		username = prompt("Please enter your name:", "");
		if (username != "" && username != null) {
			setCookie("username", username, 365);
		}
	}
}
```

### ip排序

```js
// ip排序
function ipsSort(ips) {
	// ips =  ["10.10.15.130", "10.10.16.40", "127.0.0.1", "192.168.1.123", "192.168.1.38", "192.168.1.39"];
	// 升序
	ips.sort(function(a, b) {
		a = a.trim(); // 空格会影响排序
		b = b.trim();
		var arr1 = a.split('.')
		var arr2 = b.split('.')
		for (var i = 0; i < 4; i++) {
			if (arr1[i] > arr2[i]) {
				return 1
			} else if (arr1[i] < arr2[i]) {
				return -1
			}
		}
	})
	return ips
}
```

### 获取浏览器信息
```js
// 获取浏览器信息
function getBrowserInfo() {
	var inBrowser = typeof window !== 'undefined';
	var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
	var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE = UA && /msie|trident/.test(UA);
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isEdge = UA && UA.indexOf('edge/') > 0;
	var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
	var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
	var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
	var isPhantomJS = UA && /phantomjs/.test(UA);
	var isFF = UA && UA.match(/firefox\/(\d+)/);
	return {
		inBrowser,
		inWeex,
		weexPlatform,
		UA,
		isIE,
		isIE9,
		isEdge,
		isAndroid,
		isIOS,
		isChrome,
		isPhantomJS,
		isFF
	}
}
```

### 生成范围内随机数

```js
// 生成范围内的随机数
function getRandom(left, right) {
	if (right < left) return 0;
	if (left >= 0) {
		return Math.random() * (right - left) + left;
	}
}
```

### 获取图片原始宽高
```js
// 获取图片原始宽高
function loadImageAsync(url) {
	return new Promise(function(resolve, reject) {
		var image = new Image();

		image.onload = function() {
			var obj = {
				w: image.naturalWidth,
				h: image.naturalHeight
			}
			resolve(obj);
		};

		image.onerror = function() {
			reject(new Error('Could not load image at ' + url));
		};
		image.src = url;
	});
}

```

### 数字前补零

```js
/*
*功能: {在数字前以0补全指定位数}	
*输入: {number}    (原数据,指定位数)
*输出: {string}	"04"
*/
function supNumber(num, x) {
	if ((num + "").length < x) {
		return "0" + num;
	} else {
		return num
	}
}
```


## NodeJS

### 遍历文件夹
```js
const path = require('path')
const fs = require('fs')

const basePath = 'D:/work/ruite/src/views/print/report' // 目标目录

function mapDir(dir, callback, finish) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((filename, index) => {
      let pathname = path.join(dir, filename)
      fs.stat(pathname, (err, stats) => { // 读取文件信息
        if (err) {
          console.log('获取文件stats失败')
          return
        }
        if (stats.isDirectory()) {
          mapDir(pathname, callback, finish)
        } else if (stats.isFile()) {
          if (['.json', '.less'].includes(path.extname(pathname))) {  // 排除 目录下的 json less 文件
            return
          }
          callback && callback(filename)

          // 读取文件内容
          // fs.readFile(pathname, (err, data) => {
          //   if (err) {
          //     console.error(err)
          //     return
          //   }
          //   callback && callback(data)
          // })
        }
      })
      if (index === files.length - 1) {
        finish && finish()
      }
    })
  })
}

mapDir(
  basePath,
  function(file) {
    console.log(file.split('.')[0])
    // 读取文件后的处理
  },
  function() {
    // console.log('xxx文件目录遍历完了')
  }
)
```
