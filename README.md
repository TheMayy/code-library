# code-labrary
> 存放常用的代码片段，随拿随用

## sass
```scss
// 多行文本超出打点, 参数为行数
@mixin textOver($num) {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: $num; //行数
	-webkit-box-orient: vertical;
}

// 绝对定位 水平居中 参数为高度
@mixin absHorizontalCenter($top) {
	position: absolute;
	top: $top;
	left: 50%;
	transform: translateX(-50%);
}

// 文本水平垂直居中 参数为高度
@mixin textCenter($height) {
	height: $height;
	line-height: $height;
	text-align: center;
}
```
