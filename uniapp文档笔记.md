

# uniapp
参考博文：uniapp+vue3+vite+pinia+ts 项目技术 + 框架详解

[uniapp 项目框架目录详解]('https://uniapp.dcloud.net.cn/tutorial/project.html')
[uniapp内置状态管理pinia]('https://uniapp.dcloud.net.cn/tutorial/vue3-pinia.html#%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86-pinia')


小tips：
* components文件夹中，自定义组件时，不建议嵌套，并且为每一个组件定义一个同名文件夹，这样可以不用引入就可以在全局中使用组件，如果不这样的话，按照vue3的语法，自定义组件需要在文件中引入，并且自定义组件必须以大写字母开头
![alt text](image.png)

* pages页面中，建议是为每一个单独的页面也创建一个同名文件夹，并且为每一个在当前页面单独使用的组件定义一个components文件夹用来存放自定义组件，同时，在小程序或者APP项目中，为了方便管理，pages下面的第一层文件应当按照底部的菜单栏或者是功能划分文件夹，并为一些不属于这些模块的页面单独建立一个文件夹，名称尽量接近文件本身的含义
![alt text](image-1.png)
一些错误页、需要用webview承载的H5页面，或者是登录页等等，可以放到other文件夹下

* 非 static 目录下的文件（vue组件、js、css 等）只有被引用时，才会被打包编译。
css、less/scss 等资源不要放在 static 目录下，建议这些公用的资源放在自建的 common 目录下
static目录主要放图片


## uniapp页面
详见[文档]('https://uniapp.dcloud.net.cn/tutorial/page.html')

### uniapp页面生命周期
uni-app 页面除支持 Vue 组件生命周期外还支持下方页面生命周期函数。
比如：
onInit() 监听页面初始化
onLoad() 监听页面加载，该钩子被调用时，响应式数据、计算属性、方法、侦听器、props、slots 已设置完成
onShow() 监听页面显示
onReady() 监听页面初次渲染完成，此时组件已挂载完成
onHide() 监听页面隐藏
onUnload() 监听页面卸载
onResize() 监听窗口尺寸变化

重点：uniapp页面生命周期 和 Vue3 页面及组件生命周期流程图
![alt text](image-2.png)

### 页面调用接口
```js
	// getApp()，获取app页面实例，一般用于获取globalData
	const app = getApp();
	console.log('app--',app.globalData);
	
	// 获取当前页面实例
	const currentPage = getCurrentPages();
	console.log('currentPage--', currentPage);
```


# uniapp遇到的问题及对策
1. 打开内置终端只有光标闪，无法输入
- 项目路径不能包含汉字

2. uniapp项目引入phaser方式一：使用npm安装phaser。浏览器运行正常，在微信开发者工具中运行phaser,
报错: "app.js错误: TypeError: Cannot read property 'userAgent' of undefined"
- 原因：
使用 npm 安装 Phaser 并在代码中import，这种方法适用于 H5 和小程序环境（小程序环境中仍然需要处理 navigator.userAgent 兼容问题）。Phaser 在运行时会检测浏览器的 navigator.userAgent，以识别设备信息。然而，小程序环境没有 navigator.userAgent，因此会导致 Cannot read property 'userAgent' of undefined 报错。
- 解决方案(！！试过，没用)：
在小程序环境中模拟 navigator.userAgent
在 main.js 文件中，检测是否在小程序环境中运行，如果是则模拟 navigator 对象。可以将此代码放在 main.js 的顶部，以确保在加载 Phaser 之前执行此操作
```js
// main.js

// 判断是否在微信小程序环境中
if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
  // 使用 globalThis 兼容不同环境
  globalThis.navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) UniApp' 
    // 设置一个类似浏览器的 UserAgent，或根据项目需求自定义
  };
}
// ...

```

3. uniapp项目引入phaser方式二（小程序不行）：在index.html引入phaser文件：<script src="//cdn.jsdelivr.net/npm/phaser@3.86.0/dist/phaser.min.js"></script>。浏览器运行正常，微信开发者工具报错"ReferenceError: Phaser is not defined"
- 原因：
在 UniApp 项目中，通过 index.html 或 App.vue 文件直接引入的 <script> 标签方式仅在 H5 端有效，而小程序端并不能识别这种引用方式。这会导致在小程序端无法访问 Phaser，因为它并没有被真正加载到小程序的运行环境中。

4. uniapp项目引入phaser方式三：将 Phaser 作为本地静态文件导入,
从 Phaser 官方网站 下载 phaser.min.js，将其放入 static/libs 文件夹中，
代码中导入 import * as Phaser from 'phaser';
报错："TypeError: Cannot read property 'userAgent' of undefined"
- 原因：同方式二

5. uni-app项目中避免提交不必要的文件
.gitignore文件
```
node_modules/
.project
unpackage/
.DS_Store

```
如果以前提交过unpackage文件的话，需要执行一下命令
git rm -r --cached unpackage


6. uniapp只能开发微信小程序，不能开发微信小游戏
UniApp 和微信小游戏的区别：
运行环境：微信小游戏运行环境与小程序不同，它没有页面结构 (Page、Component)，而是基于 Canvas 渲染，所以页面和组件的生命周期在小游戏中不起作用。

API 支持：UniApp 是为小程序和应用设计的，它封装了 Page 和 Component，支持微信小程序的 API。而小游戏有自己的一套 API，比如 wx.getOpenDataContext()、wx.createGameContext() 等，这些 API 在 UniApp 项目中没有直接的支持。

性能要求：小游戏通常有较高的渲染性能需求，微信小游戏平台也提供了优化工具，比如帧率和内存管理工具，方便对高性能游戏进行优化。UniApp 的 UI 渲染方式和性能并不适合高频率的游戏渲染。