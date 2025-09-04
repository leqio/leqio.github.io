1. phaser3的api文档：https://newdocs.phaser.io/docs/3.85.2/

2. 安装web服务器（vscode安装插件live-Sever就行）

3. 安装phaser
   npm install phaser@v3.85.2


# 官网教程第一个游戏
```html
<!doctype html> 
<html lang="en"> 
<head> 
    <meta charset="UTF-8" />
    <title>Making your first Phaser 3 Game - Part 1</title>
    <script src="//cdn.jsdelivr.net/npm/phaser@3.11.0/dist/phaser.js"></script>
    <style type="text/css">
        body {
            margin: 0;
        }
    </style>
</head>
<body>

<script type="text/javascript">

    var config = {
       /*  属性type可以是Phaser.CANVAS，或者Phaser.WEBGL，或者Phaser.AUTO。
        这是你要给你的游戏使用的渲染环境（context）。
        推荐值是Phaser.AUTO，
        它将自动尝试使用WebGL，如果浏览器或设备不支持，它将回退为Canvas。 */
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        // 场景：包含proload、create、update函数
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        // 物理引擎配置
        physics: {
            // 指定使用 Arcade Physics 引擎，这是 Phaser 提供的一个轻量级、高效的物理引擎。它适合处理简单的物理效果，比如碰撞、重力、速度等。
            default: 'arcade',
            // Arcade Physics 引擎的具体设置
            arcade: {
                // 表示沿垂直方向（Y轴）的重力加速度为 300（300 像素/秒²），{ y: 0 } 可以取消垂直重力。
                gravity: { y: 300 },
                // 关闭调试模式，如果设置为 true，则游戏中所有物理对象的边界和碰撞框会显示出来，这样可以帮助开发者调试游戏中的物理行为
                debug: false
            }
        }
    };

    var game = new Phaser.Game(config);
    var platforms;
    var player;
    var cursors;
    var stars;

    var score = 0;
    var scoreText;

    // 预加载资源,作用：用于加载游戏资源，比如图片、音频、字体等
    function preload ()
    {
        // 调用Phaser的Loader（加载器）,this.load.image()加载一个图形类对象并命名
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        // 加载一张 精灵图集（spritesheet），并指定每个帧的大小(切割为多个小帧)
        this.load.spritesheet('dude', 'assets/dude.png', 
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    // 显示图像,作用：初始化场景中的对象和元素，比如创建精灵、设置初始状态、配置物理效果等
    function create ()
    {
        // 1. this.add.image生成一个新的Image（图形）类游戏对象
            // 方法一：设置图像坐标为画布中心点
            // 400和300是图像坐标的x值和y值，在Phaser 3 中，所有游戏对象的定位都默认基于它们的中心点。这个背景图像的尺寸是800 x 600像素，所以，如果我们显示它时将它的中心定在0 x 0，你将只能看到它的右下角。如果我们显示它时定位在400 x 300，你能看到整体。
            // this.add.image(400, 300, "sky");

            // 方法二：使用setOrigin（设置原点）。比如代码this.add.image(0, 0, 'sky').setOrigin(0, 0)，将把图像的绘制定位点重置为左上角
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        // 游戏对象的显示顺序与生成它们的顺序一致，星星在天空后面
        // this.add.image(600, 450,'star');
        // this.add.image(100, 450, 'bomb');


        // 2. this.physics.add.staticGroup()创建一个物理静态对象组platforms
        platforms = this.physics.add.staticGroup();
        // platforms.create()在 platforms 组中创建一个新的静态物体
        // .setScale(2) 改变了对象的尺寸,.refreshBody(),当对象的尺寸或其他物理属性改变时，调用这个函数会重新计算并刷新该对象的物理体
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        

        // 3. this.physics.add.sprite()生成物理精灵（sprite）叫player，为动态物体
        player =  this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2); //设置0.2的反弹
        player.setCollideWorldBounds(true); //设置世界边界碰撞为true,player不能超出世界边界

        
        // 4. this.anims.create()创建动画
        // 动画管理器（Animation Manager）是全局系统。其中生成的动画是全局变量，所有游戏对象都能用到它们   
        // 定义left动画
        this.anims.create({
            key: 'left',
            // 使用精灵图的0,1,2,3帧
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
            
            /* // 使用 generateFrameNames，Phaser 会按照 start 和 end 之间的数字顺序生成帧名称，并按顺序播放
            frames: this.anims.generateFrameNames('texture1', {
                start: 1, 
                end: 3, 
                prefix: "yellow-bird", //帧名称前缀
                suffix: ".png" //帧名称后缀
            }), */

            // 每秒播放的帧数，这里设置为 10 帧/秒
            frameRate: 10,
            // 设置动画循环行为，-1 表示动画将无限循环播放，直到手动停止，设置为 0，动画会播放一次，正数值表示动画循环播放的次数
            repeat: -1
        });

        // 定义turn动画
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude',frame: 4}],
            frameRate: 20
        });

        // 定义right动画
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });


        // 6. 创建一个碰撞对象，监控两个物体（或者组）的碰撞和重叠事件
        this.physics.add.collider(player, platforms);


        // 7.将键盘按键植入光标cursor
        cursors = this.input.keyboard.createCursorKeys();

        // 8. 创建新的动态组stars
        stars = this.physics.add.group({
            // 设置纹理key（键值）为星星图像
            key: 'star',
            // 重复11次就意味着我们总共将得到12颗
            repeat: 11,
            // setXY设置组的12个子项的位置,第一个子项将位于12 x 0；第二个离开70像素，位于82 x 0；第三个在152 x 0
            setXY: { x: 12, y: 0, stepX: 70}
        });
        stars.children.iterate(function (child) {
            // bounce.y赋予0.4到0.8之间的随机值，反弹范围在0（不反弹）到1之间（完全反弹
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        // 9. 创建一个碰撞对象检测stars和platforms的碰撞
        this.physics.add.collider(stars, platforms);
        // 10.检测玩家是否与星星重叠,检查玩家与组中任何一颗星星的重叠。如果检测到，他们就会被传递到'collectStar'函数
        this.physics.add.overlap(player, stars, collectStar, null, this);


        // 11.设置文字分数
        scoreText = this.add.text(16,16, 'score: 0', { fontSize: '32px', fill: '#000'});


        // 12.创建新的动态组bobms
        bobms = this.physics.add.group();
        this.physics.add.collider(bobms, platforms);
        this.physics.add.collider(player, bobms, hitBomb, null, this);
    }


    // 更新,作用：每帧调用一次，用于更新场景中动态元素的状态。
    function update ()
    {
        // 7.1 键盘按键的事件,left/right/up键
        if (cursors.left.isDown) {
            // 设置水平方向速度值
            player.setVelocityX(-160);
            // player.anims.play()启用left动画，true：表示动画循环播放。如果设置为 false，动画只会播放一次
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        };

        // player.body：表示玩家角色的物理体。touching.down：这是 Phaser Arcade Physics 中的一个属性，表示玩家物理体的底部（下方）是否接触到其他物体（比如地面、平台等）。如果玩家站在地面上，touching.down 会为 true；如果玩家在空中，则为 false。
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-350);
        }

    }

    // 10.1 设置star消失和得分score
    function collectStar(player, star) {
        star.disableBody(true, true); //设置star消失

        // 得分score
        score += 10;
        scoreText.setText('Score:'+ score);

        // 查看还剩余多少star，调用stars.countActive(true)方法
        if (stars.countActive(true) === 0) {
            // 使用迭代函数遍历 stars 组中的每一个子对象，重新激活所有星星，重置它们的y位置为0。这将使所有星星再次从画面顶部落下
            /* enableBody(), 启用星星的物理体，并设置其位置和其他物理属性,
                第一个参数 (true)：表示启用物理体,
                第二个参数 (child.x)：设置星星在 X 轴的初始位置，即使用当前星星的 X 坐标。
                第三个参数 (0)：设置星星在 Y 轴的初始位置。这里设置为 0，表示星星将在屏幕的顶部出现（假设 Y 坐标从上往下增加）。
                第四个参数 (true)：表示星星在启用物理体时是否会影响碰撞（例如，其他物体与星星的碰撞会产生反应）。
                第五个参数 (true)：表示星星在启用物理体时是否会被添加到物理引擎的更新列表中。 */
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });


            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            // bobms组创建新的炸弹对象，x坐标设置变量x，y坐标为16， 使用图像bomb
            var bomb = bobms.create(x, 16, 'bomb');
            bomb.setBounce(1);  //设置弹跳系数为 1，弹跳系数为 1 意味着炸弹在碰撞后将完全反弹，不会有能量损失（理想情况下的完全弹性碰撞）
            bomb.setCollideWorldBounds(true); 
            // 设置炸弹的初始速度，x方向速度为随机值（-200,200）之间，表示随机向左向右；y方向速度为20
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    };

    // 12.1 玩家player碰撞炸弹
    function hitBomb(player, bobm) {
        this.physics.pause();  //物理引擎暂停
        player.setTint(0xff0000);  //玩家变为红色
        player.anims.play('turn'); //玩家执行turn动画
        gameOver = true;
    }



</script>

</body>
</html>
```

# vue3 + phaser3项目(官网教程星星掉落积分游戏)

1. vite创建vue3项目
npm create vite@latest 项目名称
2. 安装依赖 
npm i 
3. 安装需要的其他依赖，比如
npm i pinia
npm i vue-router
npm i less -D
npm i axios
npm i normalize.css
npm i phaser
4. 修改vite.config.js
```js
// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import {fileURLToPath, URL} from 'node:url'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    // 添加别名
    alias: {
    //   '@': fileURLToPath(new URL('./src', import.meta.url))
    '@': resolve(__dirname,'src')
    }
  },
  server: {
    port: 8080, // 本地开发服务器端口
    open: true, // 是否自动在浏览器中打开
    cors: true, // 允许跨域
    // 添加代理
    proxy: {
      '/api': {
        target: 'https://cdn.phaserfiles.com/v385', // 代理目标 API 地址
        changeOrigin: true, // 开启代理，允许跨域
        rewrite: path => path.replace(/^\/api/, '') // 重写路径，将 /api 前缀替换为空
      }
    }
  }
})
```

5. src文件结构
│  App.vue(使用router-view占位组件)
│  main.js(引入中间件，使用app.use() 注册中间件，import 'normalize.css')
│
├─assets
│  │
│  └─images
│
├─components
│      Home.vue(添加canvas容器，onMounted后加载canvas)
├─game
│  │  index.js(引入Phaser, 配置phaser的config, 定义初始化new Phaser.Game()方法)
│  │
│  └─scenes
│          myScene.js
│
├─router
│      index.js(配置路由router)
│
└─store
        index.js(配置pinia状态管理)

6. 路由配置
```js
// /router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { 
            path: '/',
            name: 'home',
            component: Home
        }
    ]
});

export default router;
```

7. pinia状态管理配置
```js
// /store/index.js

import { createPinia } from "pinia";

const pinia = createPinia();

export default pinia;
```

8. 主入口文件main.js
```js
// /main.js

import { createApp } from 'vue'
import 'normalize.css'
import pinia from '@/store/index.js'
import App from './App.vue'
import router from '@/router';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');
```

9. App.vue
```vue
<!-- /App.vue -->

<script setup>

</script>

<template>
    <router-view></router-view>
</template>

<style scoped>

</style>

```

10. Home.vue
```vue
<template>
    <!-- canvas容器 -->
    <div id="game-container"></div>
</template>

<script setup>
import startGame from '@/game/index.js';
import {onMounted, onUnmounted, ref } from 'vue';

const game = ref();

onMounted(() => {
    // 初始化游戏，将canvas加载到容器中
   game.value = startGame('game-container');
})

onUnmounted(() => {
    // 销毁游戏实例
    if (game.value) {
        game.value.destroy(true);
        game.value = null;
    }
});

</script>

<style scoped>

</style>

```

11. phaser初始化配置
```js
// /game/index.js

import Phaser from 'phaser';
import MyScene from '@/game/scenes/myScene.js'

const config = {
    type:Phaser.AUTO, // 自动尝试WebGL，否则退回到Canvas
    width:800,// 游戏界面宽
    height:600, //游戏界面高
    scene:MyScene,//游戏的具体场景
    physics:{ // 开启游戏物理引擎，不然物理环境不会生效，分别是arcade\impact\matter
        default:"arcade",//默认arcade
        arcade:{
            gravity:{ //重力加速度 单位px/s
                y:300 
            },
            debug:false //开启调试模式，如果开启了，就会给每隔元素加上边框，还有移动的方向
        }
    }
}
// 定义初始化游戏方法
const startGame = (parent) => {
    return new Phaser.Game({...config, parent});
};

export default startGame;
```

12. phaser游戏场景
```js
// /game/scenes/muScene.js

import Phaser from 'phaser';

class MyScene extends Phaser.Scene{

    constructor ()
    {
        super('MyScene');
    }

//预加载函数，加载各种资源
    preload(){ 
        this.load.setBaseURL("./src/assets/images/");
        this.load.image("sky", "sky.png");
        this.load.image("ground","platform.png");
        this.load.image("star", "star.png");
        this.load.image("bomb", "bomb.png");
        //this.load.image("dude", "assets/dude.png");
        //spritesheet 和CSS sprite差不多，将一些图片合并放到一张大图上
        //一般这种方法用到经常需要变动的元素
        this.load.spritesheet("dude", "dude.png", {
            frameWidth:32,// 展示的宽
            frameHeight:48 //展示的高
        })

        this.gameOver = false;
    }

// 创建场景，将资源加载进去，并处理游戏中的逻辑、物理碰撞，事件监听都在这里
    create(){ 
        this.add.image(400, 300, "sky");// phaser3中，资源的坐标不是从左上角定位的，而是从元素中心开始定位的
        //this.add.image(0,0,"sky").setOrigin(0,0)，这一句和上一句含义相同（改变了原点坐标）
        
        //physics属性必须在配置中添加，否则会报错
        let platforms = this.physics.add.staticGroup();//创建一个静态物理组
        //setScale 放大图像，之后必须使用refreshBody进行刷新
        platforms.create(400, 568, "ground").setScale(2).refreshBody();
        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        //将英雄添加到游戏场景中
        this.player = this.physics.add.sprite(100, 450, "dude");
        this.player.setBounce(0.2);//设置弹跳能力，0不会跳，1跳来跳去
        this.player.setCollideWorldBounds(true); //设置英雄是否与界面碰撞， true表示英雄不会掉到世界外面去
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1 
        });

        this.anims.create({
            key: 'turn',
            frames:[{key: "dude", frame:4}],
            frameRate:20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers('dude', {start:5, end: 8}),
            frameRate: 10,
            repeate: -1
        });

        this.physics.add.collider(this.player, platforms);

        let stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { 
                x: 12, 
                y: 0, 
                stepX: 70 
            }
        });
        stars.children.iterate(function (child) {
            child.setScale(0.2);//缩小星星
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));//设置每一个星星的垂直弹力值
        });

        //让星星和平台产生碰撞
        this.physics.add.collider(stars, platforms);

        function createBomb(player, bombs){
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1); //设置一直弹
            bomb.setCollideWorldBounds(true); //设置边界碰撞，不会到界面外
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);//设置x、y轴的速度
        }

        let bombs = this.physics.add.group();
        createBomb(this.player, bombs);

        // this.add.text 是创建一个文字对象并添加到当前的场景中。返回一个 Phaser.GameObjects.Text 实例，将实例赋值给 scoreText。
        // 它传入 4 个参数：
        // 文字 x 坐标
        // 文字 y 坐标
        // 文字内容
        // 文字的样式配置
        let scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        let score = 0;    
        function collectStar (player, star){
            star.disableBody(true, true);
            score += 10;
            scoreText.setText('Score: ' + score);

            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);//重新添加至场景中
                });
                createBomb(this.player, bombs);
            }
        }


        this.physics.add.collider(bombs, platforms)

        //处理英雄与炸弹碰撞    
        this.physics.add.collider(this.player, bombs, hitBomb, null, this);
        function hitBomb(player, bomb){
            this.physics.pause(); //设置暂停
            player.setTint(0xff0000); // 设置英雄哥颜色
            player.anims.play('turn'); //设置英雄样式
            this.gameOver = true; //设置游戏结束
        }

        //this.physics.add.overlap 用来创建一个碰撞覆盖对象，可以监听到两个物体是否发生了碰撞覆盖。它会返回一个 Phaser.Physics.Arcade.Collider 对象实例
        // 5个参数
        // 前面两个是覆盖的游戏元素对象
        // 第三个是覆盖的回调函数
        // 第四个也是覆盖的回调函数，但是必须返回一个 boolean 值。
        // 第五个是函数执行的作用域对象指向
        this.physics.add.overlap(this.player, stars, collectStar, null, this);
        
        

    }

// 每一帧就会执行，有两个参数，time,delta, time是执行了多长时间，单位是ms, delta是间隔时间，默认是16ms，也就是每隔16ms就会执行一次 
    update() 
    {
        if(this.gameOver ){
            return;
        }
        
        //this.input.keyboard.createCursorKeys 返回一个 Phaser.Types.Input.Keyboard.CursorKeys 实例，这个实例里面包含了 up、down、left、right、space、shift 6个键。
        let cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if (cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);//330像素每秒
        }


    }
} 

export default MyScene;

```

13. 启动项目
npm run dev



# phaser的API

## 概念
[phaser概念文档]('https://docs.phaser.io/phaser/concepts/game')

案例scene文件信息：
- action:
alignToScene -- 对齐
alignToBaseScene -- 对齐
alignToOffset -- 偏移
angleScene -- 旋转角度
angleWithStepScene -- 旋转角度
getFirstScene -- 
gridAlignScene -- 网格对齐
gridAlignOverlapScene -- 网格对齐

- gameObject:
video --加载webm视频
GetBounds --容器container的边界
ContainerAsMask -- 容器作为位图遮罩
ContainerAndCameraZoom --容器和摄像机缩放
Text_wordWrap --文字换行

- loadScene:
loadFileFromJson --加载资源包 
loadFileFromJson2 -- 加载远程资源包 
sceneFilesPayload -- 场景启动前加载资源包
unitySpriteSheet -- unity精灵图集 
animationJson -- JSON中获取动画数据 
htmlToTexture -- 加载html纹理 

- audio
AudioSprite --加载音频精灵
html5Audio --加载音频 
AudioMarkers --多按钮触发不同音效
PlaySoundOnKeypress --按键触发音效
reuseAudioContext --创建音频上下文

- scenes:
SceneController:  多场景同时运行，场景切换隐藏

- Input
DragOnAFixedAxis --拖拽，在固定轴上拖动

### Game类
Phaser.Game 类的实例，游戏的核心，任何给定时间只有一个 Phaser 游戏实例
```js
// 创建基本的phaser游戏实例
const game = new Phaser.Game({
  scene: {
    create: function () {
      this.add.text(0, 0, 'Hello world');
    }
  }
});

// 或者
const config = {

};
// 创建Phaser.Game实例game
const game = new Phaser.Game(config);
```

创建游戏之前，不必等待 DOMContentLoaded 或 window.onload；
但是，如果你有影响页面布局的外部样式表或图像，并且你正在使用Scale Manager（缩放管理器），则可能需要使用 window.onload。
该游戏实例在所有场景中都作为 this.game 可用，并作为参数传递给相关的回调和事件侦听器，因此您通常不需要保存对游戏的引用，除非您需要从 Phaser 外部访问它。

#### Game configuration 游戏配置
[官方config完整文档]('https://newdocs.phaser.io/docs/3.86.0/Phaser.Types.Core.GameConfig')
由于历史原因，一些配置值可以在两个地方设置：例如，width 和 height 与 scale.width 和 scale.height 相同
```js
// 基本配置
const config = {
    type: Phaser.AUTO, // automatically detect browser WebGL support
    // width: 800, // canvas width
    // height: 600, // canvas height
    scale: {
        width: width,  // 设置游戏画布的宽度
        height: height, // 设置游戏画布的高度
        autoCenter: Phaser.Scale.CENTER_BOTH, // 设置游戏画布居中
        mode: Phaser.Scale.FIT, // 自动调整游戏画布大小以适应窗口
    },
    backgroundColor: '#2d2d2d', // canvas background color
    parent: 'phaser-example', // parent DOM element
    scene: Example // 
};
```


部分config说明(具体查看[官方config完整文档]('https://newdocs.phaser.io/docs/3.86.0/Phaser.Types.Core.GameConfig'))：
| 名字 | 默认值 | 说明 |
|------|---------|----------|
|width |1024|宽|
|height |768|高|
|zoom|1|画布的简单缩放|
|type|CONST.AUTO|要使用的渲染器。Phaser.AUTO、Phaser.CANVAS、Phaser.HEADLESS 或 Phaser.WEBGL。AUTO 选择 WEBGL（如果可用），否则选择 CANVAS。|
|parent||包含游戏画布或其 ID 的 DOM 元素,如果未定义，或者命名元素不存在，则游戏画布将附加到文档正文。如果为 null，则不会使用父级，您负责将画布添加到 dom 中|
|scene||要添加到游戏中的一个或多个场景。如果给出了几个，则启动第一个;仅当其余部分具有 { active： true } 时，才会启动它们。请参阅 中的 Phaser.Scenes.SceneManager#add sceneConfig 参数。|
|title||游戏的标题。显示在浏览器控制台中。|
|...

##### 配置中scale的值：
| 名字 | 值 | 说明 |
|------|---------|----------|
|width |1024|宽|
|height |768|高|
|zoom|1|画布的简单缩放|
|mode||缩放模式|
|autoCenter|CENTER_BOTH 水平垂直都居中<br/>CENTER_HORIZONTALLY 水平居中<br/>CENTER_VERTICALLY 垂直居中<br/>NO_CENTER 游戏画布未通过 Phaser 在父级中居中。仍然可以通过 CSS 自行居中。|是否自动居中|

#### Global members 获取game成员
##### Scene manager 场景管理
game.scene中，或者每个scene的scene.

##### Data manager 数据管理
game.registry 中的数据管理器实例，或每个scene中的 scene.registry
```js
// 获取数据管理器的数据：
var value = scene.registry.get(key);
// var value = game.registry.get(key);

// 在数据管理器中添加/更新数据:
scene.registry.set(key, value);
// game.registry.set(key, value);

// 设置数据事件event：
scene.registry.events.on('setdata', function(parent, key, value){ /* ... */ });
// game.registry.events.on('setdata', function(parent, key, value){ /* ... */ })

// 更改数据事件：
scene.registry.events.on('changedata-' + key, function(parent, value, previousValue){ /* ... */ });
// game.registry.events.on('changedata-' + key, function(parent, value, previousValue){ /* ... */ });
```

##### Game time 游戏时间
```js
// 游戏开始时间
var time = game.getTime();
// var time = scene.game.getTime();

// 当前游戏帧
var frameCount = game.getFrame();
// var frameCount = scene.game.getFrame();

// 增量时间，自上一个游戏步骤以来。这是固定和平滑的平均值
var delta = game.loop.delta;
// var delta = scene.game.loop.delta;

```

##### Game config 游戏配置
```js
// 获取游戏配置
var config = game.config;
// var config = scene.game.config;
```

##### Window size 窗口大小
```js
// 获取游戏宽高
var width = game.config.width;
// var width = scene.game.config.width;

var height = game.config.height;
// var height = scene.game.config.height;

```


#### game的暂停/恢复方法
```js
// 暂停整个游戏
game.pause();

// 恢复整个游戏
game.resume();

// 判断游戏是否暂停
var isPaused = game.isPaused;
```

#### game的Event事件监听
```js
// 监听game暂停
game.events.on('pause', function() {});

// 监听game恢复
game.events.on('resume', function() {});

// 监听game销毁
game.events.on('destroy', function() {})

// 监听聚焦事件
game.events.on('focus', function() {})

// 监听失去焦点事件
game.events.on('blur', function(){ })

```

#### Registry注册表--游戏数据存储
```js
// 无法直接通过游戏配置传递注册表数据，但您可以在回调中执行此操作
const config = {
    callbacks: {
        preBoot: function (game) {
            game.registry.merge({
                highScore: 0
            });
        }
   }
};

const game = new Phaser.Game(config);

```

#### 销毁游戏实例
```js
game.destroy();
// game.destroy(removeCanvas, noReturn);

```

### Scene类
Scene 由一个 Scene Configuration 对象和一组函数组成。
不必具有 preload 方法，成为有效 Scene 的唯一要求是 create 方法，因为这是 Phaser 3 中所有 Scene 的全局入口点。
```js
// 定义了一个名为 MyScene 的 Phaser 场景，包含了三个主要部分：构造函数、预加载和创建场景
class MyScene extends Phaser.Scene {

    constructor ()
    {
        // 场景的名称设置为 'MyFirstScene'
        super('MyFirstScene');
    }

    preload ()
    {
        this.load.image('logo', 'assets/sprites/logo.png');
    }

    create ()
    {
        this.add.image(400, 300, 'logo');
    }

    update() {

    }

};

export default MyScene;

```

将scene添加到配置中
```js
import MyScene from './MyScene.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MyScene

    // 如果是多个scene,则scene是一个数组
    /* scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        GameOver
    ] */
};

var game = new Phaser.Game(config);

```



### Loader
https://docs.phaser.io/phaser/concepts/loader

资产需要先加载才能使用，但一旦加载，它们就可以随处使用。哪个加载器或场景加载它们并不重要。加载后，它们将位于 Texture Manager （this.textures） 或资源缓存 （this.cache） 中。

Asset types 资源类型：
```js
// 加载图片
this.load.image(key, url);
// this.load.image(key, url, xhrSettings);

//  图像和法线贴图
this.load.image(key, [url, normalMapUrl]);
// this.load.image(key, [url, normalMapUrl], xhrSettings);

// 加载SVG
this.load.svg(key, url);
// this.load.svg(key, url, svgConfig);
// this.load.svg(key, url, svgConfig, xhrSettings);

// 加载html纹理
this.load.htmlTexture(key, url, width, height);
// this.load.htmlTexture(key, url, width, height, xhrSettings);


// 加载精灵图
this.load.spritesheet(key, url, {
  // frameWidth: frameWidth,
  // frameHeight: frameHeight,
  // startFrame: startFrame,
  // endFrame: endFrame,
  // margin: margin,
  // spacing: spacing
});
// this.load.spritesheet(key, url, frameConfig, xhrSettings);

// 加载图集
this.load.atlas(key, textureURL, atlasURL);
// this.load.atlas(key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings);

// 加载多文件图集
this.load.multiatlas(key, atlasURL);
// this.load.multiatlas(key, atlasURL, path, baseURL, atlasXhrSettings);

// 加载Unity图集
this.load.unityAtlas(key, textureURL, atlasURL);
// this.load.unityAtlas(key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings);

// 加载动画
this.load.animation(key, url);
// this.load.animation(key, url, dataKey, xhrSettings);

// 加载音频
this.load.audio(key, urls);
// this.load.audio(key, urls, {instances: 1}, xhrSettings);

// 加载音频 sprite
this.load.audioSprite(key, jsonURL, audioURL, audioConfig);
// this.load.audioSprite(key, jsonURL, audioURL, audioConfig, audioXhrSettings, jsonXhrSettings);

// 加载视频
this.load.video(key, url, noAudio);
// this.load.video(key, url, noAudio, xhrSettings);

// 加载位图字体
this.load.bitmapFont(key, textureURL, fontDataURL);
// this.load.bitmapFont(key, textureURL, fontDataURL, textureXhrSettings, fontDataXhrSettings);

// 加载瓦片地图
this.load.tilemapTiledJSON(key, url);
// this.load.tilemapTiledJSON(key, url, xhrSettings);


// 加载文字
this.load.text(key, url);
// this.load.text(key, url, xhrSettings);

// 加载JSON文件
this.load.json(key, url);
// this.load.json(key, url, dataKey, xhrSettings);

// 加载XML
this.load.xml(key, url);
// this.load.xml(key, url, xhrSettings);

// 加载html
this.load.html(key, url);
// this.load.html(key, url, xhrSettings);

// 加载CSS
this.load.css(key, url);
// this.load.css(key, url, xhrSettings);

// 加载场景文件
this.load.sceneFile(key, url);
// this.load.sceneFile(key, url, xhrSettings);

// 加载脚本
this.load.script(key, url);
// this.load.script(key, url, type, xhrSettings);

// 加载glsl
this.load.glsl(key, url);
// this.load.glsl(key, url, shaderType, xhrSettings);

// 加载二进制
this.load.binary(key, url, dataType); // dataType: Uint8Array
// this.load.binary(key, url, dataType, xhrSettings);



// 加载插件
this.load.plugin(key, url, true); // start plugin when loaded
// this.load.plugin(key, url, true, undefined, xhrSettings);

// 加载场景插件
this.load.scenePlugin(key, url, systemKey, sceneKey);
// this.load.scenePlugin(key, url, systemKey, sceneKey, xhrSettings);

// 加载资源包
this.load.pack(key, url);
// this.load.pack(key, url, dataKey, xhrSettings);

...

```

#### 加载资源包file pack
##### JSON 文件或使用 JavaScript 对象定义资源包
以 JSON 格式加载文件
```js
/* key 是资源包的键，用于标识这个资源包。
url 是资源包的 JSON 文件或对象，定义了所有需要加载的资源。
config 是可选项，用于进一步配置加载。 */
this.load.pack(key, url[, config]);

this.load.pack(key, url);
// this.load.pack(key, url, dataKey, xhrSettings);

// or
this.load.pack(key, json);
// this.load.pack(key, json, dataKey);

```
要使用 this.load.pack 加载资源包，你需要一个 JSON 文件或一个 JavaScript 对象，其中列出了所有资源的详细信息。以下是一个例子：
1.先创建一个 pack1.json 文件，定义要加载的资源：
```json
{
    "pack1": [
        {
            "type": "image",
            "key": "background",
            "url": "assets/images/background.png"
        },
        {
            "type": "spritesheet",
            "key": "player",
            "url": "assets/images/player.png",
            "frameConfig": { "frameWidth": 32, "frameHeight": 32 }
        },
        {
            "type": "audio",
            "key": "bgMusic",
            "url": ["assets/audio/music.mp3", "assets/audio/music.ogg"]
        }
    ]
}

```
2.在场景的 preload 方法中使用 this.load.pack 加载资源包
```js
class MyScene extends Phaser.Scene {
    preload() {
        // 加载资源包
        this.load.pack('pack1', 'pack1.json');
    }

    create() {
        // 资源加载后可以在这里使用
        this.add.image(400, 300, 'background');
        this.sound.play('bgMusic');
    }
}

```
如果不使用 JSON 文件，也可以直接使用 JavaScript 对象定义资源包：
```js
const FilePackObject = {
    "pack1": [
        {
            "type": "image",
            "key": "background",
            "url": "assets/images/background.png"
        },
        {
            "type": "spritesheet",
            "key": "player",
            "url": "assets/images/player.png",
            "frameConfig": { "frameWidth": 32, "frameHeight": 32 }
        },
        {
            "type": "audio",
            "key": "bgMusic",
            "url": ["assets/audio/music.mp3", "assets/audio/music.ogg"]
        }
    ]
};

class MyScene extends Phaser.Scene {
    preload() {
        // 加载资源包
        this.load.pack('pack1', FilePackObject);
    }

    create() {
        // 资源加载后可以在这里使用
        this.add.image(400, 300, 'background');
        this.sound.play('bgMusic');
    }
}

```

File type: 文件类型：见[官方文档](https://docs.phaser.io/phaser/concepts/loader)

例子1：加载资源包：
```js
// this.load.pack()加载资源包

import Phaser from 'phaser';

const FilePackObject = {
    test1: {
        files: [
            {
                type: 'image',
                key: 'taikodrummaster',
                url: 'assets/pics/taikodrummaster.jpg'
            },
            {
                type: 'image',
                key: 'sukasuka-chtholly',
                url: 'assets/pics/sukasuka-chtholly.png'
            }
        ]
    },
    test2: {
        prefix: 'TEST2.',
        path: 'assets/pics',
        defaultType: 'image',
        files: [
            {
                key: 'donuts',
                extension: 'jpg'
            },
            {
                key: 'ayu'
            }
        ]
    },
    meta: {
        generated: '1401380327373',
        app: 'Phaser 3 Asset Packer',
        url: 'https://phaser.io',
        version: '1.0',
        copyright: 'Photon Storm Ltd. 2018'
    }
};

class LoadFileFromJson extends Phaser.Scene {
   constructor() {
      super('LoadFileFromJson')
   }
   preload() {
    this.load.setBaseURL('/api');
    // this.load.pack 方法可以用于加载一组资源包，可以将所有资源打包在一个 JSON 文件（或 JavaScript 对象）中，并通过该文件来批量加载资源
    this.load.pack('pack1', FilePackObject);
   }
   create() {
    this.add.image(400, 300, 'taikodrummaster');
    this.add.image(400, 500, 'sukasuka-chtholly');
   }
   update() {

   }
};

export default LoadFileFromJson;
```

例子2：加载远程资源包
```js
// this.load.pack()加载远程资源包
// 用法一：加载获取图集资源（资源包资源设置了前缀）
// 用法二：加载获取图集资源
// 用法三：指定加载资源包的部分资源 
// 用法四：加载资源包中嵌套的资源包

import Phaser from 'phaser';

class LoadFileFromJson2 extends Phaser.Scene {
   constructor() {
      super('LoadFileFromJson2')
   }
   preload() {
    this.load.setBaseURL('/api');
    // 加载远程资源包
    // this.load.pack('pack1', 'assets/loader-tests/pack1.json');
    // this.load.pack('pack', 'assets/loader-tests/pack4.json');
    // this.load.pack('pack1', 'assets/loader-tests/pack1.json','test1');  //指定只加载test1
    // this.load.pack('pack1', 'assets/loader-tests/pack1.json','test2');  //指定只加载test2
    this.load.pack('pack1', 'assets/loader-tests/pack2.json');  // pack2.json中嵌套了pack3.json资源
   }
   create() {
    /* this.add.image(400, 300, 'taikodrummaster');
    this.add.image(900, 300, 'TEST2.donuts');  //用了前缀"prefix": "TEST2."
    this.add.image(400, 500, 'sukasuka-chtholly');
    this.add.image(180, 300, 'TEST2.ayu'); //用了前缀"prefix": "TEST2." */

   
    /* const atlasTextures = this.textures.get('megaset');  // this.textures.get()从预加载资源中获取资源
    const frames = atlasTextures.getFrameNames();  // 获取每一帧的名称
    console.log('frames:', frames);
    
    for(let i = 0 ; i < frames.length; i++) {
        const x = Phaser.Math.Between(0,1024);
        const y = Phaser.Math.Between(0,768);

        this.add.image(x, y, 'megaset', frames[i]);
    } */


    /* this.add.image(400, 300, 'taikodrummaster');
    this.add.image(400, 500, 'sukasuka-chtholly');
    // this.add.image(180, 300, 'TEST2.ayu');  // 这是test2的，指定加载test1后test2不被加载 */


    /* // this.add.image(400, 300, 'taikodrummaster'); // 这是test1的，指定加载test2后test1不被加载
    // this.add.image(400, 500, 'sukasuka-chtholly');
    this.add.image(400, 300, 'TEST2.donuts');
    this.add.image(180, 300, 'TEST2.ayu');   */


    this.add.image(400, 300, 'taikodrummaster');  //这是pack3.json的资源
    this.add.image(400, 500, 'sukasuka-chtholly');//这是pack3.json的资源
    this.add.image(200, 300, 'makoto');
    this.add.image(400, 400, 'nayuki');

   }
   update() {

   }
};

export default LoadFileFromJson2;


/* 

远程资源包pack4.json：
{
    "test": {
        "files": [
            {
                "type": "multiatlas",  // 多图集类型
                "key": "megaset",
                "url": "assets/loader-tests/texture-packer-multi-atlas.json",  //资源的 URL 路径, 这个JSON文件包含了图集的所有信息（包含每一帧的信息）
                "path": "assets/loader-tests/"  //资源图集文件所在的目录路径 ，即图集的路径：assets/loader-tests/texture-packer-multi-atlas-0.png
            }
        ]
    },
    "meta": {
        "generated": "1401380327373",
        "app": "Phaser 3 Asset Packer",
        "url": "https://phaser.io",
        "version": "1.0",
        "copyright": "Photon Storm Ltd. 2018"
    }
}


远程资源包pack2.json：
{
    "test3": {
        "files": [
            {
                "type": "image",
                "key": "makoto",
                "url": "assets/pics/makoto.png"
            },
            {
                "type": "image",
                "key": "nayuki",
                "url": "assets/pics/nayuki.png"
            },
            {
                "type": "pack",  //类型为包
                "key": "pack3",
                "url": "assets/loader-tests/pack3.json"
            }
        ]
    },
    "meta": {
        "generated": "1401380327373",
        "app": "Phaser 3 Asset Packer",
        "url": "https://phaser.io",
        "version": "1.0",
        "copyright": "Photon Storm Ltd. 2018"
    }
}
*/
```

#### 场景内部资源加载scene payload
场景有效负载是 preload（） 的替代方案，可让您在场景开始时立即加载资产。当你需要加载一些小资源以在preload（） 期间使用时，并且你不希望在此之前启动额外的场景（及其加载器）的麻烦，通常会使用它。下载负载的场景不处于 LOADING 状态，无法更新或渲染任何内容，因此最好保持较小的负载。
加载失败。
```js
import Phaser from 'phaser';

class SceneFilesPayload extends Phaser.Scene {
   constructor() {
      super('SceneFilesPayload' , {
        pack: {
            files: [
                { type: 'image', 
                  key: 'sonic', 
                  url: 'api/assets/sprites/sonic_havok_sanity.png' 
                }
            ]
        }
      })
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('face', 'assets/pics/bw-face.png');
    // this.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
   }
   create() {
    // this.add.image(0, 0, 'face').setOrigin(0);
    this.add.image(0, 0, 'sonic').setOrigin(0);
   }
   update() {

   }
};

export default SceneFilesPayload;
```

#### 加载unity精灵图集
```js
// 加载Unity图集: [textureURL]：资源URl , [atlasURL]: 从中加载纹理图集 json 数据文件的绝对或相对 URL
// this.load.unityAtlas(key, textureURL, atlasURL);

import Phaser from 'phaser';

class UnitySpriteSheet extends Phaser.Scene {
   constructor() {
      super('unitySpriteSheet')
   }
   preload() {
    this.load.setBaseURL('/api');
    // this.load.unityAtlas('asteroids', 'assets/atlas/asteroids.png', 'assets/atlas/asteroids.png.meta')

    this.load.unityAtlas('ant','assets/atlas/ant.png', 'assets/atlas/ant.meta');
    this.load.unityAtlas('ant2','assets/atlas/ant2.png', 'assets/atlas/ant2.meta');
   }
   create() {
    // 基本用法
    /* this.add.image(200, 200, 'asteroids', 'asteroids_1');
    this.add.image(400, 200, 'asteroids', 'asteroids_2');
    this.add.image(600, 200, 'asteroids', 'asteroids_3');
    this.add.image(200, 400, 'asteroids', 'asteroids_4');
    this.add.image(400, 400, 'asteroids', 'asteroids_5');
    this.add.image(600, 400, 'asteroids', 'asteroids_6');
    this.add.image(200, 550, 'asteroids', 'asteroids_7'); */

    // 扩展使用
    // 创建动画
    this.anims.create({
        key: 'nod',
        // this.anims.generateFrameNames()生成动画帧
        frames: this.anims.generateFrameNames('ant', {prefix: 'ant1Sprite_', end: 12}),
        repeat: -1,
        repeatDelay: 2,
        frameRate: 15
    });

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('ant2',{prefix: 'ant2Sprite_', end: 3}),
        repeat: -1,
        frameRate: 14
    });

    // 添加精灵并播放动画
    const walker = this.add.sprite(1000, 250, 'ant2','ant2Sprite_0').play('walk');
    this.add.sprite(200,400,'ant','ant1Sprite_0').play('nod');

    // 创建链式动画
    this.tweens.add({
        targets: walker,
        x: -200,
        duration: 6000,
        ease: 'Linear',
        repeat: -1,
     });

   }
   update() {

   }
};

export default UnitySpriteSheet;

```

#### 加载JSON格式动画
```js
import Phaser from 'phaser';

class AnimationJson extends Phaser.Scene {
   constructor() {
      super('animationJson')
   }
   preload() {
    this.load.setBaseURL('api');
    // 加载动画（设置了哪几帧、动画相关参数）
    this.load.animation('gemData', 'assets/animations/gems.json')
    // 加载纹理图集（分成每一帧）
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json')
   }

   create() {
    // 加载精灵播放动画
    this.add.sprite(400, 100, 'gems').play('diamond');
    this.add.sprite(400, 200, 'gems').play('prism');
    this.add.sprite(400, 300, 'gems').play('ruby');
   }
   update() {

   }
};

export default AnimationJson;
```

#### 加载html纹理

#### 加载xml位图字体并使用；从textures的图集atlas中创建精灵图并分帧
```js

preload() {
      this.load.setBaseURL('/api');
      this.load.image('bg', 'assets/tests/scenes/bg.jpg');
      // 加载图集altas
      this.load.atlas('space', 'assets/tests/scenes/space.png', 'assets/tests/scenes/space.json');
      this.load.atlas('ui', 'assets/tests/scenes/ui.png', 'assets/tests/scenes/ui.json');
      // 加载位图字体，this.load.bitmapFont()将字体(基于 XML 的位图字体或字体数组)添加到当前加载队列中
      this.load.bitmapFont('digital', 'assets/tests/scenes/digital.png', 'assets/tests/scenes/digital.xml')
      
   }
create() {
    // 1.使用加载的位图字体
    this.text1 = this.add.bitmapText(520, 42, 'digital', 'nebula', 32).setOrigin(0.5, 0).setAlpha(0.8);


    // 2.this.textures.addSpriteSheetFromAtlas()方法是从已加载纹理的图集'space'中获取帧名'mine', 创建一个新的精灵图表命名'mine'，设置生成精灵表时，每帧的宽度为 64 像素
    this.textures.addSpriteSheetFromAtlas('mine', {atlas: 'space', frame: 'mine', frameWidth: 64});
    this.textures.addSpriteSheetFromAtlas('asteroid', {atlas: 'space', frame: 'asteroid', frameWidth: 96});
    
    // 使用创建的精灵图asteroid制作动画
    this.anims.create({
        key: 'asteroid', 
        // this.anims.generateFrameNumbers() 用于根据帧编号生成帧序列，帧序列的范围，从第 0 帧开始，到第 15 帧结束，共 16 帧
        frames: this.anims.generateFrameNumbers('asteroid', {start: 0, end: 24}), 
        frameRate: 12, //动画的帧率，每秒播放 20 帧
        repeat: -1
    });
    // 加载使用精灵图并播放动画
    let therock = this.add.sprite(100, 100, 'asteroid').play('asteroid');


    // 3.this.add.tileSprite(x, y, width, height, key),添加一个平铺精灵（Tile Sprite）,默认原点为 (0.5, 0.5)。平铺精灵是一种特殊的精灵，它会重复渲染指定的纹理，可以用来实现背景滚动效果
    this.bg = this.add.tileSprite(0, 135, 1024, 465, 'bg').setOrigin(0);
} 
      
```

#### 加载音频精灵audioSprite
```js
import Phaser from 'phaser';

class AudioSprite extends Phaser.Scene {
   constructor() {
      super('AudioSprite')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('assets/audio/kyobi/');

    // 预加载音频精灵，Audio Sprite 是音频文件和 JSON 配置的组合
    // 'kyobi'：自定义资源键名；
    // 'kyobi.json'：包含音频精灵数据的 JSON 文件；
    // ['kyobi.ogg', 'kyobi.mp3', 'kyobi.m4a']：实际的音频文件数组，提供多种格式以支持不同浏览器。
    this.load.audioSprite('kyobi', 'kyobi.json', [
        'kyobi.ogg',
        'kyobi.mp3',
        'kyobi.m4a',
    ]);

   }
   create() {
    // 1.this.sound.addAudioSprite()将声音添加进声音管理器，使用play()播放,播放结束后，声音将自动删除（销毁）
    // const music = this.sound.addAudioSprite('kyobi'); // kyobi添加到声音管理器
    // music.play();//默认播放音频精灵中的第一个音段
    // music.play('title');//播放音频精灵中的音段title
    // music.play('warning');//播放音频精灵中的音段warning
   
    // 2.this.sound.playAudioSprite()将声音添加进声音管理器并播放whoosh，播放结束后，该 sprite 将自动删除（销毁）。这样，您就可以动态地播放新声音，而无需保留对它的引用
    this.sound.playAudioSprite('kyobi', 'whoosh');
    

   }
   update() {

   }
};

export default AudioSprite;
```

#### 加载音频audio
api: https://docs.phaser.io/api-documentation/class/sound-html5audiosoundmanager#pauseonblur
- 一般使用：
```js
import Phaser from 'phaser';

class Html5Audio extends Phaser.Scene {
   constructor() {
      super('Html5Audio')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;
   }
   preload() {
      this.load.setBaseURL('/api');

      this.text = this.add.text(this.centerX,this.centerY, 'loading audio ...', {
         font: '16px Courier',
         fill: '#00ff00'
      }).setOrigin(0.5);

      // 加载音频
      this.load.audio('dafunk', [
         'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).ogg',
         'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).mp3',
         'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).m4a'
      ]);
   }
   create() {
      // 默认true,指示当游戏失去焦点时（例如，当用户切换到另一个选项卡/程序/应用程序时）是否应暂停声音的标志。
      // this.sound.pauseOnBlur = true;
      this.sound.pauseOnBlur = false; // 切换时不暂停
      

    //   this.add(key, [config])，将音频dafunk添加进声音管理器
      const music= this.sound.add('dafunk', {
         loop: true,// 循环播放
         volume: 0.5 // 音量范围0-1
      });
      music.play(); // 播放dafunk

      this.text.setText('Click - Playing Dafunk - Hardcore Power (We Believe In Goa - Remix)')


    // this.input.once('pointerdown', () => {
    //     const music = this.sound.add('dafunk');
    //     music.play();
    // })
   }
   update() {

   }
};

export default Html5Audio;

```

- 使用数组标记播放音段
```js
import Phaser from 'phaser';

class AudioMarkers extends Phaser.Scene {
   constructor() {
      super('AudioMarkers')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;

     this.markers = [
        { name: 'alien death', start: 1, duration: 1.0, config: {} },
        { name: 'boss hit', start: 3, duration: 0.5, config: {} },
        { name: 'escape', start: 4, duration: 3.2, config: {} },
        { name: 'meow', start: 8, duration: 0.5, config: {} },
        { name: 'numkey', start: 9, duration: 0.1, config: {} },
        { name: 'ping', start: 10, duration: 1.0, config: {} },
        { name: 'death', start: 12, duration: 4.2, config: {} },
        { name: 'shot', start: 17, duration: 1.0, config: {} },
        { name: 'squit', start: 19, duration: 0.3, config: {} }
     ];
   }
   preload() {
    this.load.setBaseURL('api');
    this.load.image('title', 'assets/pics/catastrophi.png');
    this.load.spritesheet('button', 'assets/ui/flixel-button.png', {frameWidth: 80, frameHeight: 20});
    this.load.bitmapFont('nokia', 'assets/fonts/bitmap/nokia16black.png', 'assets/fonts/bitmap/nokia16black.xml');
    this.load.audio('sfx', [
        'assets/audio/SoundEffects/fx_mixdown.ogg',
        'assets/audio/SoundEffects/fx_mixdown.mp3'
    ]);

   }
   create() {
    this.add.image(400, 300, 'title');
    for(let i = 0; i < this.markers.length; i++) {
        this.makeButton(this.markers[i].name, i); // 创建按钮元素
    };

    // this.input.on('gameobjectover', (pointer, gameObject) = {})，
    // 这个事件用于监听鼠标指针（Pointer）悬停在某个游戏对象（Game Object）上的情况;
    /* 注意区别：
    - this.input.on('gameobjectover', ...) --全局事件监听器，适用于所有启用 setInteractive() 的游戏对象。需要通过回调判断哪个游戏对象触发了事件（比如 if (gameObject === button)）
    - button.on('pointerover', ...) --直接绑定到特定的按钮对象（或其他 Game Object）上。
    总结：对于多个按钮，推荐使用 this.input.on('gameobjectover', ...) 来集中管理。
        对于单独的按钮或游戏对象，使用 button.on('pointerover', ...) 更简洁直观。
    */

        this.input.on('gameobjectover', (pointer, button) => {
            this.setButtonFrame(button, 0);
            // console.log('111', button.scene);  // button所在的scene
            // console.log('222', this); // 本scene
        });
        this.input.on('gameobjectout', (pointer, button) => {
            this.setButtonFrame(button, 1);
        });
        this.input.on('gameobjectdown', (pointer, button) => {
            // 播放音效
            const index = button.getData('index');
            this.sound.play('sfx', this.markers[index]); 

            this.setButtonFrame(button, 2);
        });
        this.input.on('gameobjectup', (pointer, button) => {
            this.setButtonFrame(button, 0);
        });
    
   }
   update() {

   }

   // 创建按钮元素
   makeButton(name, index) {
        // 加载精灵图的第1帧
        const button = this.add.image(680, 115 + index * 40, 'button', 1).setInteractive();
        button.setData('index', index);
        button.setScale(2, 1.5);

        // console.log('button', button.width, button.height); // 80 20
        // console.log('button', button.displayWidth, button.displayHeight); // 160 30
        
        // 文字居中
        const text = this.add.bitmapText(0, 0, 'nokia', name, 16);
        text.x = button.x - text.displayWidth / 2;
        text.y = button.y - text.displayHeight / 2;

   }

    // 修改按钮图片
    setButtonFrame(button, frame) {
        // button.scene: 按钮所属的场景
        button.frame = button.scene.textures.getFrame('button', frame); //将按钮的帧改为名为'button'的纹理的第frame帧
    }
};

export default AudioMarkers;
```

- 按键触发音效
```js
import Phaser from 'phaser';

class PlaySoundOnKeypress extends Phaser.Scene {
   constructor() {
      super('PlaySoundOnKeypress')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('touhou', 'assets/pics/touhou1.png');

    this.load.setPath('assets/audio/tech');
    this.load.audio('bass', [ 'bass.ogg', 'bass.mp3' ]);
    this.load.audio('drums', [ 'drums.ogg', 'drums.mp3' ]);
    this.load.audio('percussion', [ 'percussion.ogg', 'percussion.mp3' ]);
    this.load.audio('synth1', [ 'synth1.ogg', 'synth1.mp3' ]);
    this.load.audio('synth2', [ 'synth2.ogg', 'synth2.mp3' ]);
    this.load.audio('top1', [ 'top1.ogg', 'top1.mp3' ]);
    this.load.audio('top2', [ 'top2.ogg', 'top2.mp3' ]);
   }
   create() {
    this.add.image(790, 600, 'touhou').setOrigin(1);

    const bass = this.sound.add('bass');
    const drums = this.sound.add('drums');
    const percussion = this.sound.add('percussion');
    const synth1 = this.sound.add('synth1');
    const synth2 = this.sound.add('synth2');
    const top1 = this.sound.add('top1');
    const top2 = this.sound.add('top2');

    const keys = [
        'Press A for Bass',
        'Press B for Drums',
        'Press C for Percussion',
        'Press D for Synth1',
        'Press E for Synth2',
        'Press F for Top1',
        'Press G for Top2',
        '',
        'SPACE to stop all sounds'
    ];
    // 直接传入数组，简化了换行操作，省去了手动拼接 \n 的麻烦
    const text = this.add.text(10, 10, keys, { font: '32px Courier', fill: '#00ff00' });
    // keys[0] = 'Press A for Lead Guitar'; // 修改第一行内容
    // text.setText(keys); // 更新文本内容


    // 当 this.sound.locked === true 时，表示浏览器当前禁止自动播放音频，必须等待用户与页面交互（如点击事件）后，才能解锁音频播放权限
    if(this.sound.locked) {
        text.setText('Click to start');
        // 监听音频解锁事件
        this.sound.once('unlocked', () => {
            text.setText(keys);
        })
    };



    // 监听按键交互事件
    this.input.keyboard.on('keydown-SPACE', () => {
        this.sound.stopAll(); // 按下空格键，停止所有音效
    });
    this.input.keyboard.on('keydown-A', () => {
        bass.play(); // 按下A键，播放音效bass
    });
    this.input.keyboard.on('keydown-B', () => {
        drums.play();// 按下B键，播放音效drums
    });
    this.input.keyboard.on('keydown-C', () => {
        percussion.play();
    });
    this.input.keyboard.on('keydown-D', () => {
        synth1.play();
    });
    this.input.keyboard.on('keydown-E', () =>
    {
        synth2.play();
    });

    this.input.keyboard.on('keydown-F', () =>
    {
        top1.play();
    });

    this.input.keyboard.on('keydown-G', () =>
    {
        top2.play();
    });
    
   }

   update() {

   }
};

export default PlaySoundOnKeypress;
```

### Action 动作
除了要操作的游戏对象数组之外，许多action还采用以下可选参数：
- step 参数是一个可选量，它添加到传递给 Action 的值中，乘以迭代计数器。例如，如果您将包含 10 个 sprite 的数组传递给 SetX Action，并将值设置为 100，则每个 Sprite 都将获得相同的 x 坐标 100。但是，如果将 step 参数设置为 50，则第一个 sprite 的位置为 100，第二个 sprite 的位置为 150，第三个 sprite 的位置为 200，依此类推，因为步长值 （50） 乘以数组迭代

- direction参数允许您调整遍历游戏对象数组的顺序。默认值为，1表示它将从数组的开头到结尾进行迭代。如果您将设置为，direction它将-1从数组的结尾到开头进行迭代。如果您希望反转将操作应用于数组的顺序，而不修改数组本身，这将非常有用。

- index 参数允许您跳过数组中的“n”个项目（由起始索引定义），并且仅将 Action 应用于其余条目。默认情况下，索引为零，这意味着它将在数组中的每个条目上运行 Action

#### Phaser.Actions.AlignTo 设置一组元素相对第一个元素位置
* AlignTo(items, position, [offsetX], [offsetY])
第一项不会移动，其他项依次跟在第一项后，
对齐位置由 position 参数控制，该参数应该是 Phaser.Display.Align 常量之一：Phaser.Display.Align.TOP_LEFT Phaser.Display.Align.TOP_CENTER
offsetX和offsetY表示相对上一项的x，y偏移量
例子1：
```js
import Phaser from "phaser";

class alignToScene extends Phaser.Scene {
    constructor() {
        super('alignToScene');
    }

    preload() {
        this.load.setBaseURL('/api');
        this.load.image('red', 'assets/sprites/gem.png');
        this.load.image('blue', 'assets/sprites/columns-blue.png');
    }

    create() {
        const gems = [];
        // 先设置第一个元素位置
        gems.push(this.add.sprite(200, 300, 'red'));

        for (let i = 0; i < 8; i++) {
            gems.push(this.add.sprite(0,0,'blue'));
        };
        // AlignTo(items, position, [offsetX], [offsetY])
        /* 第一项不会移动，其他项依次跟在第一项后，
        对齐位置由 position 参数控制，该参数应该是 Phaser.Display.Align 常量之一：Phaser.Display.Align.TOP_LEFT Phaser.Display.Align.TOP_CENTER
        offsetX和offsetY表示相对上一项的x，y偏移量 */
        Phaser.Actions.AlignTo(gems, Phaser.Display.Align.RIGHT_CENTER, 20, -20);

        // 切换下一个场景
        // this.scene.start("alignToBaseScene");
    }
}

export default alignToScene;
```

例子2：
```js
import Phaser from 'phaser';

class alignToBaseScene extends Phaser.Scene {
   constructor() {
      super('alignToBaseScene')
   }
   preload() {
    this.load.setBaseURL('/api'),
    this.load.setPath('assets/sprites'),
    this.load.image('image1', 'advanced_wars_tank.png');
    this.load.image('image2', 'amiga-cursor.png');
    this.load.image('image3', 'apple.png');
    this.load.image('image4', 'asuna_by_vali233.png');
    this.load.image('image5', 'beball1.png');
   }
   create() {
    // 0, 500：矩形的 位置坐标，800, 100：矩形的 宽度和高度，0x9d2d9d：矩形的 颜色
    // setOrigin(0, 0) 将矩形的 锚点（origin） 设为左上角 (0, 0)。默认情况下，Phaser的add.rectangle会将矩形的中心设为锚点；
    this.add.rectangle(0, 500, 800, 100, 0x9d2d9d).setOrigin(0, 0);
    this.add.text(20, 20, "Loading game...");

    const sprite = [];
    for (let i = 1; i < 6; i++) {
        // 设置元素位置
        sprite.push(this.add.sprite(150, 493, `image${i}`));
    };
    // 设置元素相对第一个元素对齐方式
    Phaser.Actions.AlignTo(sprite, Phaser.Display.Align.RIGHT_BOTTOM)
   }
   update() {

   }
};

export default alignToBaseScene;
```

例子3：偏移动作
```js
import Phaser from 'phaser';

class AlignToOffset extends Phaser.Scene {
   constructor() {
      super('AlignToOffset'),
      this.gems = [];
      this.y = 0;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('assets/sprites');

    this.load.image('red', 'gem.png');
    this.load.image('blue', 'columns-blue.png');
   }
   create() {
    this.gems.push(this.add.sprite(200,300,'red'));

    for (let i = 0; i < 8; i++) {
       this.gems.push(this.add.sprite(0,0,'blue'));
    }
   }
   update() {
    // Math.sin(this.y) * 8范围是[-8,8]
    Phaser.Actions.AlignTo(this.gems, Phaser.Display.Align.RIGHT_CENTER, 0, Math.sin(this.y) * 8);
    this.y += 0.1; // 控制变化速度
   }
};

export default AlignToOffset;
```

#### Phaser.Actions.Angle 设置游戏对象旋转
* Angle(items, value, [step], [index], [direction])
items 游戏对象数组
value 旋转速度（角度）
[step=0] 步差（这里是角度步差）
[index=0] 跳过多少个对象后开始action
[direction=1] 1是从开始遍历action,-1是从末尾遍历action
例子1：
```js
import Phaser from 'phaser';

class angleScene extends Phaser.Scene {
   constructor() {
      super('angleScene');
      this.gingerbreads = [];
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('assets/sprites');
    
    this.load.image('gingerbread', 'gingerbread.png');
   }
   create() {
    for (let i = 0; i < 30; i++) {
        const x = Phaser.Math.Between(0,800);
        const y = Phaser.Math.Between(0,600);

        this.gingerbreads.push(this.add.sprite(x ,y ,'gingerbread'));
    }
   }
   update() {
    // Phaser.Actions.Angle(myObjects, 1),游戏对象旋转, 1为旋转速度
    Phaser.Actions.Angle(this.gingerbreads, 1)
   }
};

export default angleScene;
```

例子2：
```js
import Phaser from 'phaser';

class angleWithStepScene extends Phaser.Scene {
   constructor() {
      super('angleWithStepScene');
      this.gingerbreads = [];
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('assets/sprites');
    
    this.load.image('gingerbread', 'gingerbread.png');
   }
   create() {
    for (let i = 0; i < 30; i++) {
        this.gingerbreads.push(this.add.sprite(32 * i, 300 ,'gingerbread'));
    }
   }
   update() {
    // Angle(items, value, [step], [index], [direction])
    /**
     * @param {(array|Phaser.GameObjects.GameObject[])} items 游戏对象数组
     * @param {number} value 旋转速度（角度）
     * @param {number} [step=0] 步差（这里是角度步差）
     * @param {number} [index=0] 跳过多少个对象后开始action
     * @param {number} [direction=1] 1是从开始遍历action,-1是从末尾遍历action
     */
    Phaser.Actions.Angle(this.gingerbreads, 2, 0, 5, 1)
   }
};

export default angleWithStepScene;
```

#### Phaser.Actions.GetFirst  返回第一个匹配的元素
Phaser.Actions.GetFirst(items, compare, [index])
index可选，index默认为0，返回数组对象中第index个匹配的元素，该元素具有与 compare 对象中指定的所有属性匹配的属性。
例如，如果比较对象为：{ scaleX： 0.5， alpha： 1 }，则它将返回属性 scaleX 设置为 0.5 且 alpha 设置为 1 的第一项

this.children 代表当前场景或游戏对象的子元素（children），即场景中添加的所有游戏对象
this.tweens.chain(...)：使用 Phaser 的 tweens 系统创建一个动画链

例子：
```js
import Phaser from 'phaser';

class getFirstScene extends Phaser.Scene {
   constructor() {
      super('getFirstScene');
      this.gems = [];
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('/assets/sprites/');
    //预加载精灵图表spritesheet， { frameWidth: 64, frameHeight: 64 }指定帧宽度和高度。这通常用于加载一个精灵图集（spritesheet），其中包含多个小图像,指定每一帧的宽高
    this.load.spritesheet('diamonds','diamonds32x5.png',{ frameWidth: 64, frameHeight: 64 });
   }
   create() {
    for (let i = 1; i < 64; i ++) {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        const frame = Phaser.Math.Between(0, 4);
        // 随机帧0-4，默认是0
        this.gems.push(this.add.sprite(x, y, 'diamonds', frame));
    };

    this.add.text(16, 16, 'Click to find the first Red gem with a Scale of 1');
   
    // 获取精灵图表第0帧
    const redFrame = this.textures.getFrame('diamonds', 0);

    this.input.on('pointerdown', () => {
        // 获取第一个scaleX=1，并且frame=0的精灵帧
        const red = Phaser.Actions.GetFirst(this.gems, { scaleX: 1, frame: redFrame});
        
        if (red) {
            // this.children 代表当前场景或游戏对象的子元素（children），即场景中添加的所有游戏对象（sprites, images, text, 等等）。children 是一个包含所有子对象的集合，通常用于管理和操作这些对象
            // 将 red 精灵移动到其父容器的最上层，以确保它在其他子元素之上显示。这样做可以避免其他精灵遮挡 red
            this.children.bringToTop(red);
            
            // this.tweens.chain(...)：使用 Phaser 的 tweens 系统创建一个动画链
            this.tweens.chain({
                targets: red, //指定动画的目标为 red 精灵
                tweens: [
                    {
                        // 缩放比例设置为 2，持续时间为 400 毫秒，使用 Bounce.easeOut 作为缓动效果
                        scale: 2,
                        duration: 400,
                        ease: 'Bounce.easeOut'
                    },
                    {
                        // 在第一个动画结束后延迟 500 毫秒执行。将 red 精灵的缩放比例设置为 0，持续时间为 1000 毫秒，使精灵逐渐消失
                        delay: 500,
                        scale: 0,
                        duration: 1000
                    }
                ]
            })
        };
    })
    
   }
   update() {

   }
};

export default getFirstScene;
```

#### Phaser.Actions.GridAlign  元素网格分布对齐
获取一组游戏对象或具有公共 x 和 y 属性的任何对象，然后根据为此操作提供的网格配置对它们进行对齐
GridAlign(items, options)
options包含：
width：列，以项为单位的网格宽度（不是像素）。-1 表示所有项目水平放置，无论数量如何
height ：行，以项目为单位的网格高度（不是像素）。-1 表示所有项目垂直放置，无论数量如何
cellWidth ：放置项目的单元格的宽度（以像素为单位）
cellHeight ：放置项目的单元格高度（以像素为单位）。
position ： 对齐位置。Phaser.Display.Align 常量之一，例如 TOP_LEFT 或 RIGHT_CENTER
x ： （可选）将最终网格的左上角放置在此坐标处
y ：（可选）将最终网格的左上角置于此坐标处

this.anims.create和this.tweens.chain区别：
this.anims.create
主要用于定义精灵的动画，通过一系列帧来表现连续的动作
功能: 定义一个动画，包括动画的帧、帧率和重复次数。
使用场景: 当你想要为精灵（sprite）创建循环播放的动画时，比如走路、跳跃或攻击动画

this.tweens.chain
主要用于控制对象的插值(tweens)动画，允许更复杂的动画序列和过渡效果
功能: 允许你在多个插值动画之间进行链式调用，定义不同的动画效果和过渡。
使用场景: 当你需要在一个物体上执行多个动画（如缩放、移动、旋转等），并希望以特定顺序执行这些动画时使用

例子1：精灵播放动画
```js
import Phaser from 'phaser';

class gridAlignScene extends Phaser.Scene {
   constructor() {
      super('gridAlignScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/deepblue.png');
    this.load.spritesheet('sotb', 'assets/animations/sotb-64x112x11.png', { frameWidth: 64, frameHeight: 112 });
   }
   create() {
    this.add.image(400,300,'bg');

    // this 指的是当前场景实例，anims 是 Phaser 提供的动画管理器
    this.anims.create({
        key: 'walk', //key 属性指定动画的名称
        //frames 属性用于指定动画中使用的帧，this.anims.generateFrameNumbers('sotb') 方法用于从精灵图集（spritesheet）sotb 中生成帧序列
        frames: this.anims.generateFrameNumbers('sotb'),
        frameRate: 16, // 指定动画播放的帧率，在这里是 16 帧每秒。这决定了动画播放的速度
        repeat: -1, //-1 表示无限循环播放该动画
    });

    const sprites = [];
    for (let i = 0; i < 24; i++) {
        // 在坐标（0,0）处添加一个精灵图集并播放walk动画,画布添加24个精灵
        sprites.push(this.add.sprite(0, 0, 'sotb').play('walk'));
    };

    // GridAlign(items, options)
    // 将24个精灵按网格分布
    Phaser.Actions.GridAlign(sprites, {
        width: 12,  //设置网格12列，-1代表全部水平分布
        height: 2, // 设置网格2行，-1代表全部垂直分布
        cellWidth: 64, //单元格宽度
        cellHeight: 120, //单元格高度，
        x: 16, //网格在 x 轴上的起始偏移量，这里设为 16 像素，表示所有精灵将从横坐标 16 开始放置
        y: 4 // 网格在 y 轴上的起始偏移量，这里设为 4 像素，表示所有精灵将从纵坐标 4 开始放置
    })

   }
   update() {

   }
};

export default gridAlignScene;
```

例子2：精灵排布
```js
import Phaser from 'phaser';

class gridAlignGroupScene extends Phaser.Scene {
   constructor() {
      super('gridAlignGroupScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/deepblue.png');
    this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png',{frameWidth: 32, frameHeight: 24});

   }
   create() {
    this.add.image(400,300,'bg');
    const group = this.add.group({
        key: 'diamonds', //使用已加载的名为 'diamonds' 的精灵图集
        frame: [0,1,2,3,4], //要使用的帧
        frameQuantity: 40 // 每帧创建40个精灵实例
    });

    // group.getChildren() 返回当前精灵组 group 中的所有精灵（200个精灵）
    Phaser.Actions.GridAlign(group.getChildren(), {
        width: 20,
        height: 10,
        cellWidth: 32,
        cellHeight: 32,
        x: 80,
        y: 140,
    })

   }
   update() {

   }
};

export default gridAlignGroupScene;
```

例子3：精灵部分叠着
```js
import Phaser from 'phaser';

class gridAlignOverlapScene extends Phaser.Scene {
   constructor() {
      super('gridAlignOverlapScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/deepblue.png');
    // this.load.atlas() 是用来加载一个图集的方法,
    // 图集包括一张图像和一个 JSON 配置文件(包含了图集中每个图像的位置信息和尺寸)
    this.load.atlas('cards', 'assets/atlas/cards.png','assets/atlas/cards.json');
   }
   create() {
    this.add.image(400, 300, 'bg');

    // this.textures.get('cards') 方法用于获取关键字为 'cards' 的图集对象。
    // getFrameNames() 是一个方法，返回图集中所有帧的名称的数组
    const frames = this.textures.get('cards').getFrameNames();
    // console.log('frames--', frames);
    

    const cards = [];




    // 添加16个随机精灵实例
    for (let i = 0; i < 16; i++) {
        cards.push(this.add.sprite(0,0, 'cards', Phaser.Math.RND.pick(frames)));
    };

    // 将精灵实例按网格分布
    Phaser.Actions.GridAlign(cards, {
        width: 8,
        height: 2,
        cellWidth: 80, //数值小一点就是元素部分叠着
        cellHeight: 220,
        x: 50,
        y: 80
    })

   }
   update() {

   }
};

export default gridAlignOverlapScene;
```


### Game Objects
#### 添加图形对象Graphics
一个 graphics 可以同时画多个图形，只要不调用 graphics.clear()，你画的东西都会累积在同一个 graphics 上。
如果你希望图形之间独立控制、分开管理，可以创建多个 graphics 对象

- graphic有几种绘图方式：
    Phaser.GameObjects.Graphics 是 Phaser 中的“画笔”，它可以用来在屏幕上画各种 2D 图形
```js
1. 线条相关
lineStyle(width, color, alpha)  设置线宽、颜色、不透明度
lineBetween(x1, y1, x2, y2)  从点 A 到点 B 画一条直线（快速）
moveTo(x, y) + lineTo(x, y)   手动控制路径点，适合连线/多段
strokePath()    描边整个路径（线条）

2. 图形绘制
strokeRect(x, y, w, h)  描边矩形
fillRect(x, y, w, h)  填充矩形
strokeCircle(x, y, r)   描边圆
fillCircle(x, y, r)   填充圆
strokeEllipse(x, y, w, h)   描边椭圆
fillEllipse(x, y, w, h) 填充椭圆
strokeRoundedRect(x, y, w, h, radius)   描边圆角矩形
fillRoundedRect(x, y, w, h, radius)    填充圆角矩形

fillTriangle(x0, y0, x1, y1, x2, y2) 填充三角形,6 个顶点坐标


3. 路径控制
beginPath() 开始一段新的绘图路径
closePath() 结束当前路径（可封闭）
strokePath()    描边路径
fillPath()  填充路径

4. 高级图形
请确保在开始 arc 之前调用 .beginPath()，除非你希望 arc 自动填充或描边时关闭。
arc(x, y, radius, startAngle, endAngle, [anticlockwise], [overshoot])  画圆弧
quadraticBezierTo(cpX, cpY, x, y)   二阶贝塞尔曲线
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) 三阶贝塞尔曲线
fillPoint(x, y, [size]) 在给定位置(x ,y)填充一个点(正方形)，默认大小为 1 像素
fillPoints(points, [closeShape], [closePath], [endIndex])   根据点列表填充区域
fillPointShape(point, [size]) 填充给定的点,在给定位置绘制一个正方形，默认大小为 1 像素。
strokePoints([...]) 根据点列表描边
fillTriangleShape(triangle) 填充给定的动态三角形,triangle: Phaser.Geom.Triangle 

5. 通用
clear() 清除当前画布
fillStyle(color, alpha) 设置填充色、不透明度
setScrollFactor() 设置跟随摄像机行为

小技巧:
想画多个形状 → 用 beginPath() + 一堆 draw + strokePath()/fillPath() 组合。
    “一堆 draw”指你在 beginPath() 和 strokePath() / fillPath() 之间，连续调用的绘图指令，比如 moveTo()、lineTo()、arc()、ellipse()、quadraticBezierTo() 等。就像你在纸上用笔画路径，画一笔是一条线，再画一笔是另一条线，最后统一描边或填充
每帧动态绘制 → clear() + 重画。
需要持久保留 → 用 RenderTexture 替代 Graphics。

例子：
graphics.lineStyle(2, 0x00ff00);
graphics.beginPath(); // 开始路径
graphics.moveTo(100, 100);       // 起点
graphics.lineTo(200, 100);       // 连第一条
graphics.lineTo(300, 200);       // 再连第二条
graphics.strokePath();           // 一次画出来
效果就是 一整条连续折线。
```


```js

const graphics = this.add.graphics();

// 设置线条样式
graphics.lineStyle(2, 0xff0000);
graphics.lineBetween(100, 100, 200, 200); // 红线

// 设置填充样式并画圆
graphics.fillStyle(0x00ff00, 1);
graphics.fillCircle(300, 150, 50); // 绿色圆

// 设置填充样式并画矩形
graphics.fillStyle(0x0000ff, 1);
graphics.fillRect(400, 300, 100, 80); // 蓝色矩形

```

在 Phaser 中使用 graphics 绘制填充图形时，需要确保在绘制形状之前已经设置填充颜色，并且每次绘制时要调用 fillStyle() 方法
```js
create() {
    // 0, 500：矩形的 位置坐标，800, 100：矩形的 宽度和高度，0x9d2d9d：矩形的 颜色
    // setOrigin(0, 0) 将矩形的 锚点（origin） 设为左上角 (0, 0)。默认情况下，Phaser的add.rectangle会将矩形的中心设为锚点；
    this.add.rectangle(0, 500, 800, 100, 0x9d2d9d).setOrigin(0, 0);
    this.add.text(20, 20, "Loading game...");


    /* 创建进度条的背景和填充条 */
        const progressBoxWidth = 500;
        const progressBoxHeight = 24;
        
    // 绘制圆角矩形：进度条的背景
        const progressBox = this.add.graphics();
            //  在 Phaser 中使用 graphics 绘制填充图形时，需要确保在绘制形状之前已经设置填充颜色，并且每次绘制时要调用 fillStyle() 方法
        progressBox.fillStyle(0xFFFFFF, 0.8); // 填充白色，透明度0.8
        progressBox.fillRoundedRect(centerX - progressBoxWidth / 2, centerY + 45 - progressBoxHeight / 2, progressBoxWidth, progressBoxHeight, 12); // 绘制圆角矩形
    
   }
```



元素设置交互性：
```js
        // 设置交互性setInteractive(), 默认互动区域是矩形的
        const btn1 = this.add.image(790 * scaleX, 585 * scaleY, "PC-开始按钮").setScale(0.5).setOrigin(0,0).setInteractive(); 

        // 悬浮后光标变手势
        btn1.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });
        btn1.on('pointerout', () => {
            this.input.setDefaultCursor('default');
        });
```



#### 从图集alats中创建精灵图分帧并制作动画
```js

preload() {
      this.load.setBaseURL('/api');
      this.load.image('bg', 'assets/tests/scenes/bg.jpg');
      // 加载图集altas
      this.load.atlas('space', 'assets/tests/scenes/space.png', 'assets/tests/scenes/space.json');
      this.load.atlas('ui', 'assets/tests/scenes/ui.png', 'assets/tests/scenes/ui.json');
}
create() {
    // this.textures.addSpriteSheetFromAtlas()方法是从已加载纹理的图集'space'中获取帧名'mine', 创建一个新的精灵图表命名'mine'，设置生成精灵表时，每帧的宽度为 64 像素
    this.textures.addSpriteSheetFromAtlas('mine', {atlas: 'space', frame: 'mine', frameWidth: 64});
    this.textures.addSpriteSheetFromAtlas('asteroid', {atlas: 'space', frame: 'asteroid', frameWidth: 96});
    
    // 使用创建的精灵图asteroid制作动画
    this.anims.create({
        key: 'asteroid', 
        // this.anims.generateFrameNumbers() 用于根据帧编号生成帧序列，帧序列的范围，从第 0 帧开始，到第 15 帧结束，共 16 帧
        frames: this.anims.generateFrameNumbers('asteroid', {start: 0, end: 24}), 
        frameRate: 12, //动画的帧率，每秒播放 20 帧
        repeat: -1
    });

    // this.add.image(x, y, textureKey, frameKey)适用于使用图集altas的情况
    let btn = this.add.image(x, y, 'ui', 'button-out').setOrigin(0);
    
    // .setData()通过键值对存储与对象相关联的任意数据，可以使用.getData()获取数据
    btn.setData('id', id);

    // 重新设置btn的framekey
    btn.setFrame('button-over');

    this['button' + id] = btn; // 添加动态属性名， 相当于this.button1 = btn;
} 

```

#### 添加平铺精灵tileSprite
```js
// this.add.tileSprite(x, y, width, height, key),添加一个平铺精灵（Tile Sprite）,默认原点为 (0.5, 0.5)。平铺精灵是一种特殊的精灵，它会重复渲染指定的纹理，可以用来实现背景滚动效果
 this.bg = this.add.tileSprite(0, 135, 1024, 465, 'bg').setOrigin(0);
```

#### 粒子发射
https://docs.phaser.io/api-documentation/class/gameobjects-particles-particleemitter

1. 模拟火焰
```js
/* new ParticleEmitter(scene, [x], [y], [texture], [config])
    this.add.particles(x, y,textureKey, config) 将返回一个 ParticleEmitter 实例,
    x：粒子发射器的 X 坐标（150）。
    y：粒子发射器的 Y 坐标（550）。
    textureKey：粒子的纹理键（'flares'），这是加载到游戏中的纹理集的键名。
    config：一个对象，包含粒子发射器的配置参数。 */

// 火焰粒子发射器
    const flame = this.add.particles(50, 550, "flares", {
      frame: "white",                                    //指定粒子使用的纹理帧
      color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],   // 一个数组，定义了粒子的颜色渐变。粒子的颜色将在这些颜色之间过渡
      colorEase: "quad.out",                             //定义颜色过渡的缓动函数
      lifespan: 2400,                                    //每个粒子的生命周期（以毫秒为单位）,2400ms = 2.4s
      angle: { min: -100, max: -80 },                    // 定义粒子发射的角度范围,负角度表示粒子向上发射
      scale: { start: 0.7, end: 0, ease: "sine.out" },   // 定义粒子的缩放效果
      speed: 100,                                        // 定义粒子的速度,100 像素/秒
      advance: 2000,                                     // 定义粒子发射器的发射频率,粒子发射器每 2000 毫秒（2 秒）发射一次粒子
      blendMode: "ADD",                                  //定义粒子的混合模式。在这个例子中，使用了 'ADD'，表示粒子将使用加性混合模式。这种模式可以使粒子效果更加明亮，通常用于火焰、光效等场景。
    });

```

2. 添加粒子发射器的发射区域，.addEmitZone(config)
```js
// 创建几何形状
   const shape1 = new Phaser.Geom.Circle(0, 0, 160); // 圆形

   // 创建粒子发射器
   const emitter = this.add.particles(750, 400, "flares", {
      frame: {
         frames: [ 'white', 'blue', 'red', 'yellow', 'green'], // 指定粒子使用的纹理帧
         cycle: true, // 循环播放
      },
      blendMode: "ADD",
      lifespan: 500, // 每个粒子的生命周期（以毫秒为单位）
      quantity: 4, // 每次发射4个粒子
      scale: { start: 0.5, end: 0.1 }, // 定义粒子的缩放效果
   });

   // 添加发射区域， .addEmitZone(config)
   // 巧合每个发射区域都是同色粒子：粒子纹理帧是 按顺序使用 frames 列表中的内容的，所以如果你连续添加了 5 个 zone，5个发射区域同时发射1次粒子，Phaser 在发射过程中就会轮流使用 frame，也就是白色、蓝色、红色、黄色、绿色，依次发射，第2个生命周期内又会依次发射
   // 发射区域粒子分布点依次发射：粒子不是随机选点发射，而是顺序走过这 64 个点，每个点发射 1 个粒子
   emitter.addEmitZone({
      type: 'edge', // 发射区域类型edge: 沿着边缘
      source: shape1, // 圆形
      quantity: 64, // 沿边缘分布64个粒子的位置
      total: 1, // 表示 整个生命周期内，只会从这些点各发射一次粒子
   });
```


#### Phaser灯光系统 lights
##### 文字和背景光影，法线贴图
纹理图（diffuse map）和法线贴图（normal map） 
    纹理图（diffuse map）：是一个普通的图片，包含了物体的颜色和细节信息。
    法线贴图（normal map）：是一个特殊的图片，包含了物体表面的法线信息，用于模拟光照效果。

快速生成一张法线贴图: 在线免费工具 NormalMap-Online（https://cpetry.github.io/NormalMap-Online/）、Materialize（本地工具 - 免费）（下载地址 👉 https://boundingboxsoftware.com/materialize/）

Phaser 识别法线贴图，命名建议：原图：gold.png，法线贴图：gold-n.png
```js
1.加载纹理图（diffuse map）和法线贴图，这种写法是为了启用 光照效果（Lighting）。当你在场景中开启了光照，Phaser 会使用法线贴图计算每个像素的光照响应，从而让图像呈现出更真实的立体感。
this.load.image('bg', [ 
    'assets/textures/gold.png', // 纹理图（diffuse map）
    'assets/textures/gold-n.png'  // 法线贴图（normal map）
]);

2.启用灯光系统
// 启用灯光系统,使用光照管道的对象必须在启用灯光系统后才能使用光照效果。
this.lights.enable(); 
// 设置环境光颜色
this.lights.setAmbientColor(0x808080); 

3. 元素启用光照管道
this.add.image(this.centerX, this.centerY, 'bg')
    .setPipeline('Light2D') // 启用2D光照管道
    .setAlpha(0.5);

const text1 = this.add.text(20, 50, 'Shadow Stroke', { fontFamily: 'Arial Black', fontSize: 74, color: '#00a6ed' });
    text1.setStroke('#2d2d2d', 16); // 设置描边颜色和宽度
    text1.setShadow(4, 4, '#000000', 8, true, false); // 设置阴影偏移量和颜色
    text1.setPipeline('Light2D'); // 启用光照管道

4. 使用灯光系统添加一个点光源，随鼠标移动
// 添加一个点光源
// this.lights.addLight([x], [y], [radius], [rgb], [intensity]) , x/y 是位置，radius 是光照半径(默认128)，rgb 是光源的整数 RGB 颜色(默认"0xffffff"  “0xffffff”)。intensity 是光的强度（默认1）
const spotlight = this.lights.addLight(this.centerX, this.centerY, 280, '0xffffff', 3);

// 鼠标移动事件--点光源随鼠标移动
this.input.on('pointermove', (pointer, gameObject, target) => {
    spotlight.x = pointer.x;
    spotlight.y = pointer.y;
});

// 切换点光源颜色
spotlight.setColor('0x00ffff');
```

#### Mesh 网格铺设纹理扭曲
```js
/* 
vertices：顶点坐标
    定义网格顶点，常规坐标系（向右为 x 坐标，向上为 y 坐标）。
uvs：UV 坐标
    纹理映射到网格，UV坐标系（左上角(0, 0) 开始，向右为 x 坐标，向下为 y 坐标）。
indicies：
    使用顶点连接，构建多个三角形来形成一个多边形（以 0 开始标记左上角顶点，顺时针标记其他顶点）。
    比如：矩形的四个顶点标记分别为：左上角(0), 右上角(1), 左下角(2), 右下角(3)，
    const indicies = [0 ,2, 1, 2, 3, 1]; // 构建一个三角形（0, 2, 1）和另一个三角形（2, 3, 1），组成四边形

注意：在 Phaser 的 Mesh 渲染流程中，必须通过三角形（由三个顶点组成）来构建表面；
    .addVertices(vertices, uvs, indices) 中的 indices 就是告诉引擎：哪三个顶点组成一个三角形

    你可以通过自定义更多顶点和 indices 连接规则来绘制任意形状，但 最终 Phaser 还是把它们按三角形处理;
    因为GPU 只能渲染三角形，三角形是最稳定的图形单位。


*/



// 顶点数据 (vertices),定义矩形顶点
const vertices = [
    -1, 1,  // 左上角
    1, 1,   // 右上角
    -1, -1, // 左下角
    1, -1,  // 右下角
];
// UV 坐标，将纹理映射到网格上
const uvs = [
    0, 0,  // 左上
    1, 0,  // 右上
    0, 1,  // 左下
    1, 1,  // 右下
];

// 索引数据 (indices)
const indicies = [0 ,2, 1, 2, 3, 1];

// this.add.mesh() 创建了一个 Mesh 对象，并传入了加载的纹理 'ayu'
const mesh = this.add.mesh(400, 300, 'ayu');
// .addVertices() 方法将顶点、UV 和索引数据添加到 Mesh 中
mesh.addVertices(vertices, uvs, indicies);
// .panZ(7) 则是将 Mesh 向前移动了 7 个单位，给它一定的 深度感
/* Mesh 是 3D 的,它的顶点在 3D 空间 (x, y, z),一开始你定义的顶点 vertices只有 x 和 y，没有 z 坐标,
Phaser 在内部默认补 z = 0，所以你的网格其实是完全贴在摄像机的原点 (z=0) 平面上的。
Phaser 的 Mesh 渲染逻辑是：
摄像机默认在 (0, 0, Z正轴某处)
如果一个 mesh 的模型在 摄像机后面 或 跟摄像机太接近，渲染的时候就会被“裁剪”或者看不到！
加了 mesh.panZ(7) → 把 mesh 往摄像机 Z负方向移动了7个单位 → 摄像机能正常看到 mesh */
mesh.panZ(7);
```

### TileMap 瓦片地图
Phaser 瓦片地图格式：
    CSV：简洁、轻量，只包含瓦片索引，适合静态地图；
    JSON：富信息，支持多个图层、对象、属性，适合复杂地图 

this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv');
this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile-collision-test.json');


1. 加载瓦片地图,使用 Tiled编辑器 创建的 JSON 文件
```js
 // 加载瓦片地图数据,使用 Tiled编辑器 创建的 JSON 文件
 this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile-collision-test.json'); 
```

2. 使用瓦片地图，Tilemap 的主要作用是将瓦片数据组织在一起，以便在游戏中进行渲染和交互。
- 创建瓦片地图对象
- 将瓦片集添加进瓦片地图对象
- 创建瓦片图层

```js
preload() {
    this.load.setBaseURL("/api");
    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    this.load.spritesheet('coin','assets/sprites/coin.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('player', 'assets/sprites/phaser-dude.png');
    this.load.image('mask', 'assets/sprites/mask1.png');

    // 加载瓦片地图数据,使用 Tiled编辑器 创建的 JSON 文件
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile-collision-test.json'); 
   }
   create() {
    // make和add区别：make() 方法用于创建一个新的对象，而 add() 方法用于将现有对象添加到场景中。

    /* Tilemap 的主要作用是将瓦片数据组织在一起，以便在游戏中进行渲染和交互。 */

    // this.make.tilemap(), 创建一个瓦片地图 Tilemap 对象，存储和管理瓦片地图的数据。
    const map = this.make.tilemap({key: 'map'}); // 创建瓦片地图，使用加载的地图资源map

    // .addTilesetImage() ，将瓦片集（Tileset）添加到瓦片地图中，瓦片集是一个包含多个瓦片（Tiles）的图像。
    // 当瓦片集加入到地图中后，会按照全局索引重新分配瓦片索引值，第一个瓦片集的第一个瓦片的索引为1
    const groundTiles = map.addTilesetImage('ground_1x1'); // 包含25个瓦片，瓦片全局索引为1-25
    const coinTiles = map.addTilesetImage('coin'); // 包含5个瓦片，瓦片全局索引为26-30


    // .createLayer(layerID, tileset, [x], [y])，创建一个瓦片图层。layerID 是图层的名称，对应于在地图编辑器中定义的图层名称。tileset：指定该图层使用的瓦片集。图层的起始位置（X 和 Y 坐标）。
    const backgroundLayer = map.createLayer('Background Layer', groundTiles, 0, 0); // 背景图层
    const groundLayer = map.createLayer('Ground Layer', groundTiles, 0, 0); // 地面图层
    const coinLayer = map.createLayer('Coin Layer', coinTiles).setVisible(false); // 硬币图层


    // 创建一个渲染纹理，渲染纹理在backgroundLayer，groundLayer，coinLayer等图层上方，但在coin对象下方。
    // this.add.renderTexture：创建一个渲染纹理对象。渲染纹理用于在游戏中创建动态效果，比如粒子效果、光照效果等。
    this.rt = this.add.renderTexture(0, 0, this.scale.width, this.scale.height); // 创建一个渲染纹理对象，大小为画布的宽度和高度。
    this.rt.setOrigin(0, 0); // 设置原点为左上角
    this.rt.setScrollFactor(0, 0); // 设置滚动因子为0，表示不随摄像机滚动而滚动

    
    const coins = []; //包含所有硬币对象
    // 遍历硬币图层的每个瓦片，查找硬币瓦片（硬币瓦片索引为26），并创建一个硬币对象
    coinLayer.forEachTile(tile => {
        // console.log('tile:',tile);
        if (tile.index !== -1) { // 排除空瓦片，即索引为-1的瓦片
            console.log('Tile index:', tile);
        }
        if(tile.index === 26) {
            // 瓦片尺寸是 32x32 像素，(tile.pixelX, tile.pixelY) 是瓦片的左上角坐标
            const coin = this.physics.add.image(tile.pixelX + 16, tile.pixelY + 16, 'coin');
            coin.body.allowGravity = false; // 禁用重力
            coins.push(coin); 
        }
    }); 

    // 设置地面图层的碰撞范围
    // .setCollisionBetween(start, end, collide, layer)，设置图层的碰撞范围
    groundLayer.setCollisionBetween(1, 25); // groundLayer图层中，索引 1 到 25 的瓦片将被设置为可碰撞

    // 创建一个玩家对象
    this.player = this.physics.add.sprite(80, 70, 'player').setBounce(0.1); 

    // 添加碰撞检测
    this.physics.add.collider(this.player, groundLayer); 
    // 添加重叠检测
    this.physics.add.overlap(this.player, coins, (p, c) => {
        c.visible = false; // 隐藏硬币
    }); 


    // 设置摄像机边界
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); 
    // 摄像机跟随玩家移动
    this.cameras.main.startFollow(this.player); 


    // 创建方向键输入
    this.cursor = this.input.keyboard.createCursorKeys(); 

   }
   update() {
    this.player.body.setVelocityX(0); // 设置玩家横向速度为0

    // 键盘输入控制玩家移动
    if(this.cursor.left.isDown) {
        this.player.body.setVelocityX(-200); // 向左移动
    } else if(this.cursor.right.isDown) {
        this.player.body.setVelocityX(200); // 向右移动
    }

    if((this.cursor.space.isDown || this.cursor.up.isDown) && this.player.body.onFloor()) {
        this.player.body.setVelocityY(-300); // 向上移动
    } 

    const cam = this.cameras.main; // 获取主摄像机


    this.rt.clear(); // 清除渲染纹理
    this.rt.fill(0x000000); // 渲染纹理填充黑色背景

    // .erase(key, x, y) 擦除渲染纹理中的区域，形成聚光灯效果
    // key:任何可渲染的游戏对象,x: 绘制 Frame 的 x 位置，或应用于对象的偏移,y: 绘制 Frame 的 y 位置，或应用于对象的偏移。

    // mask宽高为213*213，擦除区域的默认原点在左上角，擦除区域需要相对于主相机的位置，所以需要减去摄像机的滚动值 cam.scrollX 和 cam.scrollY
    this.rt.erase('mask', this.player.x - 107 - cam.scrollX,this.player.y - 107 - cam.scrollY); 
    
    
   }
```

### Geom几何图形属性

```js
new Phaser.Geom.Ellipse(light1.x, light1.y, 70, 100); // 创建椭圆形

const light1 = this.lights.addLight(280, 400, 200); // 点光源，200半径
//Phaser.Geom.Ellipse.Random(ellipse, [out]) ,ellipse: 返回来自给定 Ellipse 内任意位置的均匀分布的随机点。out: 将随机点坐标赋值给out坐标
// 把 ellipse1 内部的随机一个点坐标，赋值到 light1.x 和 light1.y 上
Phaser.Geom.Ellipse.Random(ellipse1, light1); 
```

### Math 数学算法
#### distance
```js
// 直线距离（欧几里得距离）：
Phaser.Math.Distance.BetweenPoints(this.player, this.ufo); // 接受两个点对象，返回两者之间直线距离
Phaser.Math.Distance.Between(x1, y1, x2, y2); // 接受数值坐标，返回两者之间直线距离
应用场景：子弹、飞行追踪

// 曼哈顿距离（蛇形距离）：
Phaser.Math.Distance.Snake(x1, y1, x2, y2);  // 返回值: |x2 - x1| + |y2 - y1|
应用场景：方格移动、路径估算

// 切比雪夫距离:
Phaser.Math.Distance.Chebyshev(x1, y1, x2, y2); // 返回值：横向和纵向距离的最大值
// ，相当于Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
// Chebyshev 距离 = 横着或竖着差得最多的那个值
应用场景：战棋游戏、八向移动
```

#### vec
Phaser.Math.Vector2 是 Phaser 中一个非常常用的 二维向量类，用来处理坐标、方向、速度、角度等各种2D 数学运算
const vec = new Phaser.Math.Vector2(x, y);
简单理解：
可以把 Vector2 当成一个带有 (x, y) 的小工具人，它可以帮你：
表示一个点、方向或速度
自动做加减乘除、旋转、归一化等运算


## 线性动画效果tweens
以下是常用的 ease 类型及其基本分类和效果简要说明：

- Power 系列 (简化别名)
Power0: 等价于 Linear，匀速运动。
Power1: 等价于 Quadratic.Out，快速开始，逐渐减速。
Power2: 等价于 Cubic.Out，中等加速和减速。
Power3: 等价于 Quartic.Out，更强烈的加速和减速。
Power4: 等价于 Quintic.Out，最强烈的加速和减速

- 基础系列
Linear: 匀速线性运动。
Quad (Quadratic): 平滑的二次方运动。
Quad.easeIn: 缓慢加速。
Quad.easeOut: 快速开始，逐渐减速。
Quad.easeInOut: 加速和减速结合。
Cubic: 平滑的三次方运动，效果更显著。
Quart (Quartic): 四次方运动，较强的动态感。
Quint (Quintic): 五次方运动，最显著的动态效果。

- 曲线系列
Sine (正弦):
    Sine.easeIn: 类似波形，缓慢加速。
    Sine.easeOut: 快速开始，缓慢结束。
    Sine.easeInOut: 平滑的加速和减速。
Expo (指数):
    Expo.easeIn: 非常缓慢开始，迅速加速。
    Expo.easeOut: 快速开始，迅速停止。
    Expo.easeInOut: 缓慢开始，中间快速，缓慢结束。
Circ (圆形):
    Circ.easeIn: 类似圆的加速效果。
    Circ.easeOut: 快速开始，圆滑减速。
    Circ.easeInOut: 开始和结束都平滑过渡。

- 弹性系列
Elastic:
    Elastic.easeIn: 起点带弹性效果。
    Elastic.easeOut: 目标点带弹性效果。
    Elastic.easeInOut: 两端都带弹性效果。

- 反弹系列
Bounce:
    Bounce.easeIn: 反弹进入目标。
    Bounce.easeOut: 到达目标后反弹。
    Bounce.easeInOut: 结合弹性进入和弹性结束。

- 超出回退系列
Back:
    Back.easeIn: 从目标外部进入。
    Back.easeOut: 超过目标后回退到目标。
    Back.easeInOut: 两端都超出目标范围后返回。

- 其他
Stepped: 分段式动画，目标位置按步骤逐一移动。

总结：
常见用途
    自然过渡: Quad.easeOut, Cubic.easeOut.
    反弹动画: Bounce.easeOut, Elastic.easeOut.
    快速过渡: Linear, Expo.easeOut.
    强调效果: Back.easeOut, Elastic.easeOut.
选择时可以根据动画的风格和需求匹配适合的 ease 效果。


============================================================================================




# ========================分割线=======================================================
==========================分割线=======================================================




# Phaser实践笔记
### 1.扩展 Phaser.Scene的方法--添加文字
```js
// /utils/assetsConfig.js
// 扩展 Phaser.Scene，使所有场景都可以调用 addText 方法
Phaser.Scene.prototype.addText = function (x, y, text, fontWeight, fontSize, lineHeight, color, wordWrapWidth = null, originX = 0, originY = 0) {
    const style = {
        // fontFamily: 'PingFang SC',
        fontFamily: 'Douyin Sans, PingFang SC',
        fontWeight: fontWeight,
        fontSize: fontSize,
        color: color,
        lineHeight: lineHeight,
    };

    if (wordWrapWidth) {
        style.wordWrap = { width: wordWrapWidth };
    }

    return this.add.text(x, y, text, style).setOrigin(originX, originY);
};

```

```js
// /src/game/index.js
// 导入Phaser.Scene扩展
import  '@/utils/sceneExtensions.js';
```

```js
// 其他场景下调用
import {preloadSceneAssets} from '@/utils/assetsConfig.js';
// 添加文字
this.addText(this.centerX, 878 * this.scaleY , "健康游戏忠告", 500, 20* this.scaleX , 32, '#FFFFFF', null, 0.5, 0);
```

### 2.进度条绘制： 使用方式二
方式一：
```js
import Phaser from 'phaser';
import {preloadSceneAssets} from '@/utils/assetsConfig.js';

class LoadingScene extends Phaser.Scene {
   constructor() {
      super('LoadingScene')
   }
   init() {
    // 获取画布中心位置
    this.centerX = this.scale.width/2;
    this.centerY = this.scale.height/2;
    // 计算位置比例
    this.scaleX = this.scale.width / 1920;
    this.scaleY = this.scale.height / 1080;

    /* 进度条框 */
    this.progressBoxWidth = 500;
    this.progressBoxHeight = 24;
    this.progressStartX = this.centerX - this.progressBoxWidth / 2;   // 进度条开始位置
    this.progressStartY = this.centerY + 45 - this.progressBoxHeight / 2;  // 进度条开始位置
    this.progressBox = this.add.graphics();
    this.progressBox.setDepth(1); //设置图层等级为1 ，默认为0
      //在 Phaser 中使用 graphics 绘制填充图形时，需要确保在绘制形状之前已经设置填充颜色，并且每次绘制时要调用 fillStyle() 方法
    this.progressBox.fillStyle(0xFFFFFF, 0.8); // 填充颜色
    this.progressBox.fillRoundedRect(this.progressStartX, this.progressStartY, this.progressBoxWidth, this.progressBoxHeight, 12); // 绘制圆角矩形

    /* 进度填充条 */
    this.progressBarWidth = this.progressBoxWidth - 6;  //填充条宽
    this.progressBarHeight = this.progressBoxHeight - 4;  //填充条高
    
    this.nowWidth = 0; 
    this.loadingSpeed = 3;  // 填充条速度
    this.loadingWidth = 0;  // 填充条实时宽度
    this.progressBar = this.add.graphics();
    this.progressBar.setDepth(1);

    this.progressBarText;
    
   }

   preload() {
        this.load.image("background",preloadSceneAssets["background"]);
        this.load.image("loading",preloadSceneAssets['loading']);

        // 监听进度条事件
        this.load.on('progress', value => {
            //value 是个0-1的浮点数，也就是加载的百分比
            this.nowWidth = this.progressBarWidth * value;
        })
   }
   
   create() {
        // console.log('当前scene:', this.scene);

        /* 加载背景 */
        this.add.image(this.centerX, this.centerY, "background").setScale(0.5);
        const img1 = this.add.image(this.centerX, 426 * this.scaleY, "loading").setScale(0.5);
        this.tweens.add(
            {
                targets: img1,
                y: 426 * this.scaleY - 30,
                duration: 600,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            }
        );

        // 加载文本
        this.progressBarText = this.addText(this.centerX, this.centerY + 90, '数据加载中，请稍后...', 500, 20 , 23, '#FFFFFF', null, 0.5, 0.5)
 
   }

   update() {
    // 每一帧都绘制新的进度填充条
    if (this.loadingWidth < this.nowWidth) {
        // console.log('nowWidth', this.nowWidth); // 496
        this.loadingWidth += this.loadingSpeed;
        this.drawprogressBar();
        return;
    };
    this.progressBarText.setText('加载完毕！');
    this.loadingSpeed = 0;
    // this.progressBox.destroy();
    // this.progressBar.destroy(); 
    // this.scene.stop();
    // this.scene.start('LevelScene'); 
   }

  //实时绘制进度条
   drawprogressBar() {
    this.progressBar.clear(); //清除之前的绘制
    this.progressBar.fillStyle(0xE9A9FF, 1);
    this.progressBar.fillRoundedRect(this.progressStartX + 2, this.progressStartY + 2, this.loadingWidth, this.progressBarHeight, 10);
   }
};

export default LoadingScene;
```

方式二：
```js
// import Phaser from 'phaser';
import preloadSceneAssets from "../../../utils/assetsConfig.js";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }
  init() {
    // 获取画布中心位置
    this.centerX = this.scale.width / 2;
    this.centerY = this.scale.height / 2;
    // 计算位置比例
    this.scaleX = this.scale.width / 1920;
    this.scaleY = this.scale.height / 1080;
  }
  preload() {
    this.drawProgress(); // 绘制加载进度条

    this.load.atlas(
      "texture1",
      preloadSceneAssets["texture1"],
      preloadSceneAssets["texture1_JSON"]
    );
    this.load.bitmapFont(
      "flappy_font",
      preloadSceneAssets["flappy_font_png"],
      preloadSceneAssets["flappy_font_fnt"]
    );

    //飞翔的音效
    this.load.audio("fly_sound", preloadSceneAssets["fly_sound"]);
    //得分的音效
    this.load.audio("score_sound", preloadSceneAssets["score_sound"]);
    //撞击管道的音效
    this.load.audio("hit_pipe_sound", preloadSceneAssets["hit_pipe_sound"]);
    //撞击地面的音效
    this.load.audio("hit_ground_sound", preloadSceneAssets["hit_ground_sound"]);
    //切换场景声效
    this.load.audio("swooshing", preloadSceneAssets["swooshing"]);

    // 得分板
    this.load.image("score_board", preloadSceneAssets["score_board"]);
    this.load.spritesheet("medals", preloadSceneAssets["medals"], {
      frameWidth: 44,
      frameHeight: 46,
    });
  }
  create() {
    console.log("this", this);
    this.scene.start("MenuScene");
    this.sound.add("swooshing").play();
  }
  update() {}

  // 绘制实时进度条
  drawProgress() {
    /* 
    逻辑尺寸：this.scale.width/height === this.sys.game.canvas.width/height
    */

    let { width, height } = this.scale;

    // 进度条坐标
    let x = 50;
    let y = height / 2 - 5;
    // 进度条宽高
    let w = width - 100;
    let h = 10;
    let radius = 5;

    let progress = this.add.graphics();
    progress.setPosition(x, y); // 图形默认坐标是(0, 0), setPosition()设置图形实际坐标，绘制图形时坐标是相对graphics坐标的

    // 监控load进度事件
    this.load.on("progress", (value) => {
      progress.clear();
      progress.lineStyle(1, 0xffffff, 1.0); //设置白色边框，1px 宽度，不透明
      progress.fillStyle(0xffffff, 1); // 设置填充颜色为白色，不透明
      progress.strokeRoundedRect(-1, -1, w + 2, h + 2, radius); // 画一个**带圆角的边框**（比进度条略大 1px）
      progress.fillRoundedRect(0, 0, Math.floor(w * value), h, radius); // 画填充的进度条，宽度随着 `value` 变化
    });
  }
}

export default PreloadScene;


```

### 3.元素资源屏幕尺寸适配方式
1. 获取画布中心位置centerX，centerY，所有居中图片位置根据centerX，centerY设置
2. 计算窗口尺寸变化比例，以1920*1080为标准，按宽度的变化比例scaleX设置图片的缩小比例，
3. 文字字体大小fontSize也要乘以scaleX。
4. 元素的位置，x坐标乘以scaleX，y坐标乘以scaleY。
```js
import Phaser from 'phaser';
import {preloadSceneAssets} from '@/utils/assetsConfig.js';

class GameBeginScene extends Phaser.Scene{

    constructor ()
    {
        super('GameBeginScene');
    }

    init() {
        // 获取画布中心位置
        this.centerX = this.scale.width/2;
        this.centerY = this.scale.height/2;
        // 计算位置比例
        this.scaleX = this.scale.width / 1920;
        this.scaleY = this.scale.height / 1080;
    }

//预加载函数，加载各种资源
    preload(){ 
        this.load.image("background",preloadSceneAssets['background']);
        this.load.image("img1", preloadSceneAssets['img1']);
        this.load.image("img2", preloadSceneAssets['img2']);
        this.load.image("img3", preloadSceneAssets['img3']);
        this.load.image("gameName", preloadSceneAssets['gameName']);
        this.load.image("begin_btn", preloadSceneAssets['begin_btn']);
    }

// 创建场景，将资源加载进去，并处理游戏中的逻辑、物理碰撞，事件监听都在这里
    create(){ 

        // 添加图像
        const img2 = this.add.image(1230 * this.scaleX, 73 * this.scaleY, "img2").setScale(0.5 * this.scaleX).setOrigin(0,0);
        const img3 = this.add.image(639 * this.scaleX, 559 * this.scaleY, "img3").setScale(0.5* this.scaleX).setOrigin(0,0);
        this.add.image(this.centerX, this.centerY, "background").setScale(0.5 *  this.scaleX);
        this.add.image(420 * this.scaleX, -95 * this.scaleX, "img1").setScale(0.5* this.scaleX).setOrigin(0,0);
        const name = this.add.image(this.centerX, 0, "gameName").setScale(0.5);
        const btn1 = this.add.image(this.centerX, 644.5 * this.scaleY, "begin_btn").setScale(0.5).setInteractive();  // 设置交互性setInteractive()
        // 添加文字
        this.addText(this.centerX, 878 * this.scaleY , "健康游戏忠告",'PingFang SC', 500, 20* this.scaleX , 32, '#FFFFFF', null, 0.5, 0);

        this.addText(this.centerX - 252 * this.scaleX, 1006 *  this.scaleY, "软著登记号：0000000000000",'PingFang SC', 400, 14* this.scaleX, 24, '#FFFFFF', null, 0, 0);
    }


} 

export default GameBeginScene;
```

### 4.元素设置鼠标事件及交互禁用和恢复
1. 元素设置交互性setInteractive()
```js
const btn1 = this.add.image(this.centerX, 644.5 * this.scaleY, "begin_btn").setScale(0.5).setInteractive();  // 设置交互性setInteractive()
```

2. 元素添加鼠标事件
鼠标悬浮：btn1.on('pointerover', () => {});  
鼠标移出：pointerout
鼠标点击：pointerdown
鼠标松开点击：pointerup
```js
create () {
    // 注意：新场景重置鼠标样式
    this.input.setDefaultCursor('default'); 

    // 鼠标移入时更改光标为手势
    btn1.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        btn1.setScale(btn1.scaleX * 1.1);
    });
    // 鼠标移出时还原光标
    btn1.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        btn1.setScale(btn1.scaleX / 1.1);
    });
    // 点击按钮跳转新场景
    btn1.on('pointerdown', () => {
        btn1.setTint(0xe0e0e0); 
    });
    // 点击按钮跳转新场景
    btn1.on('pointerup', () => {
        btn1.setTint(0xffffff); 
        // this.input.setDefaultCursor('default');
        this.scene.stop();
        this.scene.start('LoadingScene');
    });

    // 鼠标移动触发事件，触发频率：频率较高，取决于指针移动的速度
    btn.on('pointermove', (event) => {
        console.log(`Pointer moved to: ${event.x}, ${event.y}`);
    });


    // this.input.on('gameobjectover', (pointer, gameObject) = {})，
    // 这个事件用于监听鼠标指针（Pointer）悬停在某个游戏对象（Game Object）上的情况;
    /* 注意区别：
    - this.input.on('gameobjectover', ...) --全局事件监听器，适用于所有启用 setInteractive() 的游戏对象。需要通过回调判断哪个游戏对象触发了事件（比如 if (gameObject === button)）
    - button.on('pointerover', ...) --直接绑定到特定的按钮对象（或其他 Game Object）上。 
    总结：对于多个按钮，推荐使用 this.input.on('gameobjectover', ...) 来集中管理。
        对于单独的按钮或游戏对象，使用 button.on('pointerover', ...) 更简洁直观。
    */
    this.input.on('gameobjectover', (pointer, button) => {
   
    });
    this.input.on('gameobjectout', (pointer, button) => {
        
    });

    


    
}


```

3. 元素设置不可input交互 恢复交互  item.input.enabled = false;
```js
// 停止被遮罩元素的交互性
      this.eventLevel.forEach(item => {
         // item.setInteractive(false); // 不可交互， 不能设置为true,会报错
         // item.removeAllListeners();  // 移除所有事件监听器
         item.input.enabled = false;  //不可input交互, true恢复input交互
      })
```

#### 鼠标事件触发事件使用箭头函数和普通函数用法
建议:
    如果你需要解绑事件，推荐用：this.startGame, this
    如果你不需要解绑，或想在触发前加判断逻辑，可以用箭头函数
```js
    // 在 Phaser 中，this.input.on 方法的第三个参数允许你指定回调函数的上下文（即 this 的值）。如果不传递 this，那么在 this.startGame 方法中，this 的值可能会与你期望的不同。
create() {
    // 1.直接传递普通函数，需要传第三个参数指定回调函数的上下文（即 this 的值）
    this.input.on("pointerdown", this.startGame, this); // 监听鼠标点击事件
    this.input.off("pointerdown", this.startGame, this); // 可以解绑
    // 2.或者使用箭头函数
    this.input.on("pointerdown", () => this.startGame()); 
    this.input.off("pointerdown", () => this.startGame()); // ❌用箭头函数，就没办法解绑匿名函数


}
startGame() {
    if (!this.hasStarted && !this.gameIsOver) {
        this.gameIsOver = false; // 游戏是否已结束的标志
        this.hasHitGround = false; // 是否已碰撞到地面的标志
        this.hasStarted = true; // 游戏是否已经开始的标志
        this.score = 0; // 初始得分

        this.birdTween.stop();
        this.bird.body.setAllowGravity(true);
        this.readyText.destroy();
        this.playTip.destroy();
        this.timer.paused = false;
        this.labelScore.setVisible(true);
    } else {
        this.fly(); // 小鸟飞行
    }
}
fly() {

}
```


### 5.鼠标悬浮切换图片元素setTexture()
```js
preload() {
    // 1.预加载需要用到的图片元素
      this.load.image("back_btn",preloadSceneAssets['back_btn']);
      this.load.image("back_btn_hover",preloadSceneAssets['back_btn_hover']);
}
create() {
    // 2.添加元素并设置元素交互性
    const btn_back = this.add.image(84 * this.scaleX, 84 * this.scaleX,'back_btn').setScale(0.5* this.scaleX).setInteractive();

    // 3.添加鼠标事件
    btn_back.on('pointerover', () => {
         this.input.setDefaultCursor('pointer');
        //  4.使用setTexture()方法更换图片元素
         btn_back.setTexture('back_btn_hover'); 
      });
    btn_back.on('pointerout', () => {
        this.input.setDefaultCursor('default'); 
        btn_back.setTexture('back_btn'); 
    });
}
```

### 6.获取元素的位置和宽高
```js
const btn_setting = this.add.image(this.centerX + 100 * this.scaleX, this.centerY + 385 * this.scaleY,'icon_setting').setScale(0.5* this.scaleX).setInteractive();
//图片元素的默认坐标是图片中心，图片中心坐标：btn_setting.x, btn_setting.y
// 图片原始宽高： btn_setting.width, btn_setting.height
// 图片缩放后显示宽高： btn_setting.displayWidth, btn_setting.displayHeight

// 设置文字位置在图片正下方居中，文字的默认坐标是左上角，需要设置横向原点0.5

```

### 7.graphics图形设置交互性
graphics没有默认的交互区域，需要手动设置交互区域
例子1：
```js
let graphics = this.add.graphics(); // 图形坐标(0,0)
graphics.fillStyle(0xe74133, 1);
graphics.fillCircle(100, 100, 50);  // 填充一个圆形，位置相对图形坐标偏移(100,100)

// 1.设置交互区域,位置相对图形坐标偏移(100,100)
graphics.setInteractive(new Phaser.Geom.Circle(100, 100, 50), Phaser.Geom.Circle.Contains);

// 2.添加事件监听
graphics.on('pointerover', () => {
    this.input.setDefaultCursor('pointer');  // 鼠标样式更改为手形
    console.log('Pointer over the graphic');
});

graphics.on('pointerout', () => {
    this.input.setDefaultCursor('default');  // 恢复鼠标样式
});

graphics.on('pointerdown', () => {
    console.log('Pointer down on graphic');
});
```

例子2：
！！！绘制图形，先设置实际坐标setPosition(), 默认是(0,0)
其他的填充或者互动区域的坐标都是相对该图形实际坐标的偏移量
```js
// 绘制音量调节点
      const adjustPoints = [];
      for (let i = 0; i < 18; i++) {
         let spacing = 24; // 点之间的水平间距
         let x = this.dialog.x - this.dialog.displayWidth/2 + (418 + spacing * i + 6) * this.scaleX;
         let y = this.dialog.y + (44 - 628/2 + 80 + 32) * this.scaleX;

         let adjustPoint1 = this.add.graphics();
         adjustPoint1.setPosition(x, y); // 图形默认坐标是(0, 0), setPosition()设置图形实际坐标
         adjustPoint1.fillStyle(0x69BAFF, 1);
         adjustPoint1.fillCircle(0, 0, 3 * this.scaleX);  // fillCircle([x], [y], [r])的参数坐标x，y是相对图形的实际坐标(默认坐标0,0)的偏移量，进行填充绘制的
         // 为图形添加交互，并设置点击区域
         adjustPoint1.setInteractive(new Phaser.Geom.Circle(0, 0, 10 * this.scaleX), Phaser.Geom.Circle.Contains); // new Phaser.Geom.Circle([x], [y], [r]) 的参数坐标x，y也是相对图形的实际坐标(默认坐标0,0)的偏移量

         adjustPoints.push(adjustPoint1);
      };
      
      // 设置音量事件监听
      adjustPoints.forEach((item, index) => {
         item.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
         });
         item.on('pointerout', () => {
            this.input.setDefaultCursor('default');
         });
         item.on('pointerdown', () => {
            // 点击的点半径变大
            item.clear();  // 清除原来的图形
            item.fillStyle(0xFFFFFF);  // 设置颜色
            item.fillCircle(0, 0, 18 * this.scaleX);  // 设置新的半径为21

            // 其他点半径恢复为3
            adjustPoints.forEach((otherItem) => {
               if (otherItem !== item) {
                     otherItem.clear();  // 清除原来的图形
                     otherItem.fillStyle(0x69BAFF);  // 设置颜色
                     otherItem.fillCircle(0, 0, 3* this.scaleX);  // 恢复半径为3
               }
            });
         });
      });
```

### 8.创建可复用的元素集
#### 1.音量调节条
```js
/* 创建音量调节条
 * @param {string} scene - 当前场景
 * @param {array} text - 文本
 * @param {number} xBar - 音量条x坐标
 * @param {number} yBar - 音量条y坐标
 * @param {number} defaultValue - 默认大小
 */
export const creatAdjustBar = (scene,text, xBar, yBar, defaultValue) => {

      const adjustBar = scene.add.graphics();
      adjustBar.fillStyle(0x308CF4);
      adjustBar.fillRoundedRect(xBar, yBar, 606 * scene.scaleX, 53 * scene.scaleX, 20 * scene.scaleX);
      text.push(scene.addText(xBar + 36 * scene.scaleX, yBar + 26 * scene.scaleX, '关', 'Douyin Sans', 'blod', 24* scene.scaleX, 28, '#FFFFFF', '',0, 0.5, 1));
      text.push(scene.addText(xBar + 546 * scene.scaleX, yBar + 26 * scene.scaleX, '开', 'Douyin Sans', 'blod', 24* scene.scaleX, 28, '#FFFFFF', '',0, 0.5, 1));
      
      // 绘制音量调节点
      const adjustPoints = [];  // 存放音量点
      for (let i = 0; i < 18; i++) {
         const spacing = 24; // 点之间的水平间距
         const x = xBar + (84 + spacing * i + 6) * scene.scaleX;
         const y = yBar + 26 * scene.scaleX;

         const adjustPoint1 = scene.add.graphics();
         adjustPoint1.setPosition(x, y); // 图形默认坐标是(0, 0), setPosition()设置图形实际坐标
        //  设置默认音量
         if(i === defaultValue - 1) {
            adjustPoint1.fillStyle(0xFFFFFF, 1);
            adjustPoint1.fillCircle(0, 0, 18 * scene.scaleX);   // fillCircle([x], [y], [r])的参数坐标x，y是相对图形的实际坐标(默认坐标0,0)的偏移量，进行填充绘制的
         } else {
            adjustPoint1.fillStyle(0x69BAFF, 1);
            adjustPoint1.fillCircle(0, 0, 3 * scene.scaleX);
         };
         // 为图形添加交互，并设置点击区域
         adjustPoint1.setInteractive(new Phaser.Geom.Circle(0, 0, 10 * scene.scaleX), Phaser.Geom.Circle.Contains); // new Phaser.Geom.Circle([x], [y], [r]) 的参数坐标x，y也是相对图形的实际坐标(默认坐标0,0)的偏移量
         
         adjustPoints.push(adjustPoint1);
      };
      
      // 设置音量事件监听
      adjustPoints.forEach((item, index) => {
         item.on('pointerover', () => {
            scene.input.setDefaultCursor('pointer');
         });
         item.on('pointerout', () => {
            scene.input.setDefaultCursor('default');
         });
         item.on('pointerdown', () => {
            // 点击的点半径变大
            item.clear();  // 清除原来的图形
            item.fillStyle(0xFFFFFF);  // 设置颜色
            item.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

            // 其他点半径恢复为3
            adjustPoints.forEach((otherItem) => {
               if (otherItem !== item) {
                     otherItem.clear();  // 清除原来的图形
                     otherItem.fillStyle(0x69BAFF);  // 设置颜色
                     otherItem.fillCircle(0, 0, 3* scene.scaleX);  // 恢复半径为3
               }
            });
         });
      });
      
      return {adjustPoints, adjustBar};  //便于场景获取销毁
}


```

场景中使用：
```js
import { preloadSceneAssets } from '@/utils/assetsConfig.js';
import { creatAdjustBar } from '@/utils/createAdjustBar.js';

class LevelScene extends Phaser.Scene {
   constructor() {
      super('LevelScene');
   }

    // 显示设置弹窗
   showDialog() {
    // 创建一个数组来保存弹窗元素
      this.dialogElements = [];
      const text = [];
      const imgs = [];

      // 添加弹窗
      this.dialog = this.add.image(this.centerX, this.centerY, 'dialog').setScale(0.5 * this.scaleX);

         // 音量条绘制
      const xBar1 = this.dialog.x - this.dialog.displayWidth/2 + 334  * this.scaleX;
      const yBar1 = this.dialog.y + (44 - 628/2 + 86) * this.scaleX;
      /* 场景中使用： */
      const {adjustPoints: soundPointers, adjustBar: soundBar} = creatAdjustBar(this, text, xBar1, yBar1, 10);


      // 关闭弹窗按钮事件
      this.closeBtn = this.add.image(this.dialog.x + this.dialog.displayWidth / 2 - 50* this.scaleX, this.dialog.y + (44 - 628/2 + 30) * this.scaleX , 'close_btn').setScale(0.5 * this.scaleX);
      this.closeBtn.setInteractive();
      this.closeBtn.on('pointerover', () => {
         this.input.setDefaultCursor('pointer');
         this.closeBtn.setScale(this.closeBtn.scaleX * 1.1);
      });
      this.closeBtn.on('pointerout', () => {
         this.input.setDefaultCursor('default');
         this.closeBtn.setScale(this.closeBtn.scaleX / 1.1);
      });
      this.closeBtn.on('pointerdown', () => {
         this.hideDialog();  // 隐藏弹窗
      });
      



      // 保存弹窗元素
      this.dialogElements.push(this.overlay, this.dialog, text, imgs, soundPointers, soundBar, musicPointers, musicBar, this.closeBtn);
      
   }

   // 隐藏弹窗
   hideDialog() {
      this.hideEls(this.dialogElements);  // 隐藏弹窗元素

      // 恢复被遮罩元素的交互性
      this.eventLevel.forEach(item => {
         item.input.enabled = true;
      });
      
   }

   // 隐藏元素
   hideEls(els) {
      console.log('111--', els.flat());
      
      els.flat().forEach(item => {
            item.visible = false; //设置元素不可见
      });
   }
}
```

#### 2. 弹窗
```js
/** 创建弹窗/隐藏弹窗 createDialog.js
 * @param {string} scene - 当前场景
 * @param {string} dialogImg - 弹窗图片
 * @param {array} coverdItems - 弹窗之前的元素
 * @param {function} addDialogItems - 添加弹窗内的元素方法
 * @param {array} dialogElements - 弹窗内元素
*/  

// 显示弹窗
const showDialog = (scene, dialogImg, coverdItems, addDialogItems) => {

    // 创建灰色遮罩
    scene.overlay = scene.add.graphics();
    scene.overlay.fillStyle(0x000000, 0.5);
    scene.overlay.fillRect(0, 0, scene.scale.width, scene.scale.height);

    // 停止被遮罩元素的交互性
    coverdItems.forEach(item => {
       item.input.enabled = false;
    });

    // 恢复鼠标手势默认
    scene.input.setDefaultCursor('default'); 

    // 添加弹窗
    scene.dialog = scene.add.image(scene.centerX, scene.centerY, dialogImg).setScale(0.5 * scene.scaleX);
    
    // 添加弹窗元素，addDialogItems的this指向scene
    addDialogItems.call(scene);
 }

// 隐藏弹窗
const hideDialog = (dialogElements, coverdItems) => {
    // 隐藏弹窗元素
    dialogElements.flat().forEach(item => {
        item.visible = false; //设置元素不可见
    });

    // 恢复被遮罩元素的交互性
    coverdItems.forEach(item => {
       item.input.enabled = true;
    });
 }


export {showDialog, hideDialog};
```

场景中使用：
```js
import Phaser from 'phaser';
import { preloadSceneAssets } from '@/utils/assetsConfig.js';
import { creatAdjustBar } from '@/utils/createAdjustBar.js';
import {showDialog, hideDialog} from '@/utils/createDialog.js';

class LevelScene extends Phaser.Scene {
   constructor() {
      super('LevelScene');
   }
   init() {
      // 获取画布中心位置
      this.centerX = this.scale.width/2;
      this.centerY = this.scale.height/2;
      // 计算位置比例
      this.scaleX = this.scale.width / 1920;
      this.scaleY = this.scale.height / 1080;

      this.dialogElements = []; // 初始化 dialogElements
   }

   preload() {
      this.load.image("icon_setting",preloadSceneAssets['icon_setting']);

      this.load.image('dialog',preloadSceneAssets['dialog']);
      this.load.image('close_btn',preloadSceneAssets['close_btn']);
      this.load.image('icon_sounds',preloadSceneAssets['icon_sounds']);
      this.load.image('icon_music',preloadSceneAssets['icon_music']);
      this.load.image('icon_msg',preloadSceneAssets['icon_msg']);
      this.load.image('icon_msg_open',preloadSceneAssets['icon_msg_open']);
      this.load.image('icon_msg_close',preloadSceneAssets['icon_msg_close']);
   }
   create() {
      this.input.setDefaultCursor('default'); 

      const btn_setting = this.add.image(this.centerX + 100 * this.scaleX, this.centerY + 385 * this.scaleY,'icon_setting').setScale(0.5* this.scaleX).setInteractive();
   
      btn_setting.on('pointerup', () => {
         btn_setting.setTint(0xffffff); 
         btn_setting.setScale(btn_setting.scaleX / 1.1);
         // 显示弹窗!!!
         showDialog(this, 'dialog', this.coverdItems, this.addDialogItems);
      });

      this.coverdItems = [];  // 存放所有事件元素，方便统一管理和销毁
      this.coverdItems.push(btn_setting);
   }
   update() {

   }

   // 创建弹窗内元素，作为showDialog方法的参数
   addDialogItems() {
      // 创建一个数组来保存弹窗内元素
      this.dialogElements = [this.overlay, this.dialog];  // 存放弹窗背景及遮罩层,this.overlay, this.dialog是showDialog()中创建的
      const text = [];
      const imgs = [];

      /* 弹窗中心坐标(this.dialog.x, this.dialog.y)
      弹窗方框中心坐标(this.dialog.x, this.dialog.y + 44)
      弹窗左上角坐标(this.dialog.x - this.dialog.displayWidth/2, this.dialog.y + 44 - 628/2)
      */
      // this.dialog.height显示原始元素高度, this.dialog.displayHeight显示缩放后元素高度
  
      const text1 = this.addText(this.centerX, this.dialog.y - this.dialog.displayHeight / 2 + 44 * this.scaleX, '设置', 'Douyin Sans', 'blod', 32 * this.scaleX, 38,'#2A3853','', 0.5, 0.5, 3)
      text.push(text1);
      const closeBtn = this.add.image(this.dialog.x + this.dialog.displayWidth / 2 - 50* this.scaleX, this.dialog.y + (44 - 628/2 + 30) * this.scaleX , 'close_btn').setScale(0.5 * this.scaleX);
      closeBtn.setInteractive();
      
      // 声音
      imgs[0] = this.add.image(this.dialog.x - this.dialog.displayWidth/2 + 132 * this.scaleX, this.dialog.y + (44 - 628/2 + 80 + 32) * this.scaleX, 'icon_sounds').setScale(0.5 * this.scaleX);
      const text2 = this.addText(this.dialog.x - this.dialog.displayWidth/2 + 198 * this.scaleX, this.dialog.y + (44 - 628/2 + 80 + 32) * this.scaleX, '声音', 'Douyin Sans', 'blod', 28* this.scaleX, 33, '#3E6698', '',0, 0.5, 1);
      text.push(text2);
         // 音量条绘制
      const xBar1 = this.dialog.x - this.dialog.displayWidth/2 + 334  * this.scaleX;
      const yBar1 = this.dialog.y + (44 - 628/2 + 86) * this.scaleX;
      const {adjustPoints: soundPointers, adjustBar: soundBar} = creatAdjustBar(this, text, xBar1, yBar1, 10);
      
      // 关闭弹窗按钮事件
      closeBtn.on('pointerover', () => {
         this.input.setDefaultCursor('pointer');
         closeBtn.setScale(closeBtn.scaleX * 1.1);
      });
      closeBtn.on('pointerout', () => {
         this.input.setDefaultCursor('default');
         closeBtn.setScale(closeBtn.scaleX / 1.1);
      });
      closeBtn.on('pointerdown', () => {
         hideDialog(this.dialogElements, this.coverdItems);  // 隐藏弹窗
      });

      // 保存弹窗内元素
      this.dialogElements.push(text, imgs, soundPointers, soundBar, musicPointers, musicBar, closeBtn, msg_state);
  } 
  

};

export default LevelScene;
```

### 9. 使用软件TexturePacker对帧序列图片打包成精灵图并生成json文件
1. 先使用在线工具(ezgif)['https://ezgif.com/gif-to-sprite?err=expired']将GIF动图切割成帧图片并导出，生成整张精灵图并导出，
2. 使用软件TexturePacker，将帧图片（不能有全透明的图片）添加进TexturePacker，
数据格式：选择自己要用的框架，
json文件：选择自己创建的json文件，用于保存生成的json数据，
布局：大小为整张精灵图的大小
拉伸，边距选择0
3. 点击发布精灵表，会生成一个整张精灵图（被红色盖住图片了，要VIP才行）和JSON数据保存在json文件中了

4. 将json文件和ezgif工具生成的精灵图放进phaser项目，
scene中使用：
```js
const preloadSceneAssets = {
    'congratulation': 'src/assets/images/testure_frame/congratulation.png',
    'congratulation_JSON': 'src/assets/images/testure_frame/congratulation.json',
}

// ======预加载图集================
this.load.atlas('congratulation', preloadSceneAssets['congratulation'], preloadSceneAssets['congratulation_JSON']);

// ======使用图集做成动画播放===================

// 过关动画
      this.anims.create({
         key: 'congratulation',
         frames: 'congratulation',
         frameRate: 8,
         repeat: -1
     });
     const congratulation_anims = this.add.sprite(this.dialog.x, this.dialog.y - 50 *this.scaleX).setScale(this.scaleX).play('congratulation');

```

### 10.phaser播放视频webm格式（透明背景）
使用HoneyCam软件，通过多帧图片png组合成webm格式视频(非vip用户有视频水印)

phaser使用：
```js
// const video = this.add.video();
// video.play(); // 播放video
// video.play(true); // 重复播放video
// video.play(false); // 只播放一次video
// video.on('complete', () => {
//     // 播放完成后执行事件
// })

const video = this.add.video(this.centerX, this.centerY, 'success_video').setScale(this.scaleX).setDepth(3).play(false); // 播放庆祝视频
video.on('complete', () => {
    // video.setVisible(false); // 隐藏video
    // video.stop(); // 暂停video
    // video.destroy(); // 销毁video

    // 延迟0.5s出现过关弹窗
    this.time.delayedCall(500, () => {
    showDialog(this, 'gameEnd_bg', this.coverdInteractiveItems, this.addSuccessDialogItems); 
    });
})
```


### 11. phaser的延迟事件方法
```js
// Phaser.Time.Clock属性方法：
this.time.delayedCall(500, () => {
    // 延迟执行500ms
})
```

### 12. 方块的上升和下落方法封装
```js
// tableBlocks_calc.js

/**
 * 使指定方块上升动画，并记录其上升前的状态。
 *
 * @param {Phaser.Scene} scene - 当前的 Phaser 场景对象。
 * @param {Object} block - 要移动的方块对象
 * @param {number} riseY - 方块上升后的目标 y 坐标。
 * @param {string} tableName - 点击的台面名称（标识方块所在的台面）。
 * @returns {Object} 返回一个对象，包含以下信息：
 *    @property {Object} block - 上升的方块对象。
 *    @property {number} block_last_y - 方块上升前的 y 坐标。
 *    @property {string} table - 方块所在的台面。
 */

// 方块上升
export const blockRise = (scene, block, tableName) => {
    const {block_up, block_bottom, value} = block;
    const diff_y = block_bottom.y - block_up.y;  // 方块上下两半y坐标差
 
    // 记录上升方块的原y坐标及原台面
    const block_last_y = block_bottom.y;

    const riseY = scene.centerY - 280 * scene.scaleX;  // 被选中方块要上升的位置
    
    // 上升动画
    scene.tweens.add({
       targets: block_bottom, 
       y: riseY,
       duration: 200,
       ease: 'Quad.easeOut',
       yoyo: false,
       repeat: 0,
       onUpdate: () => {
          block_up.setPosition(block_bottom.x, block_bottom.y - diff_y); // 方块上半部分跟着下半部分移动
       }
    });
    
    return {block , block_last_y, tableName};
 
 };

 
/**
 * 使指定方块水平位移下落动画。
 *
 * @param {Phaser.Scene} scene - 当前的 Phaser 场景对象。
 * @param {Object} block - 要移动的方块对象
 * @param {number} dropX - 方块水平移动的目标 x 坐标。
 * @param {number} dropY - 方块下落的目标 y 坐标。
 * @param {function} onMoveComplete -  移动完成后操作。
 */

// 方块移动（水平位移、下落）
export const blockDrop = (scene, block, dropX, dropY, onMoveComplete) => {
    const {block_up, block_bottom, value} = block;
    const diff_y = block_bottom.y - block_up.y;  // 方块上下两半y坐标差

    // 方块没有水平位移则直接执行下落动画，否则先执行水平动画，再执行下落动画
    if(block_bottom.x === dropX) {
       // 下落动画
       scene.tweens.add({
          targets: block_bottom,
          y: dropY,
          duration: 200,
          ease: 'Quad.easeOut',
          yoyo: false,
          repeat: 0,
          onUpdate: () => {
             block_up.setPosition(block_bottom.x, block_bottom.y - diff_y); // 方块上半部分跟着下半部分移动
          },
          onComplete: () => {
             // 执行弹窗
             if (onMoveComplete) {
                  onMoveComplete();
             }
          },
       });
    } else {
       // 水平动画
       scene.tweens.add({
          targets: block_bottom,
          x: dropX,
          duration: 300,
          ease: 'Power2',
          yoyo: false,
          repeat: 0,
          onUpdate: () => {
             block_up.setPosition(block_bottom.x, block_bottom.y - diff_y);  // 方块上半部分跟着下半部分移动
          },
          onComplete: () => {
             // 下落动画
             scene.tweens.add({
                targets: block_bottom,
                y: dropY,
                duration: 200,
                ease: 'Quad.easeOut',
                yoyo: false,
                repeat: 0,
                onUpdate: () => {
                   block_up.setPosition(block_bottom.x, block_bottom.y - diff_y); // 方块上半部分跟着下半部分移动
                },
                onComplete: () => {
                  // 执行弹窗
                  if (onMoveComplete) {
                       onMoveComplete();
                  };
                }
             })
          }
       });
    };
    
 };

 

/**
 * 点击台面时，执行方块移动方法： 
 *  没有上升方块（riseBlock.length === 0）时，将该台面最小方块上升(台面没有方块（minValue === 99）则不执行)；
    有上升方块时，比较上升方块的value和该台面最小value： 上升方块小于台面最小value, 将上升方块下落到该台面上，否则上升方块落回原位置，该台面最小方块上升
 * @param {Phaser.Scene} scene -- 当前场景
 * @param {Array} tables -- 所有台面信息：存放了每一个台面的台面名称tableName, 台面每层坐标tableFloorPos, 台面上的方块信息table_blocks
 * @param {number} index -- tables索引
 * @param {Array} riseBlock -- 上升方块数组
 * @param {function} onMoveComplete -- 移动完成后操作
 */


export const tableBlocks_calc = (scene, tables, index, riseBlock, onMoveComplete) => {

    const table = tables[index]; // 获取被点击的台面
    let minValue = table.table_blocks.length ? Math.min(...table.table_blocks.map((block) => block.value)) : 99;  // 获取台面最小方块value，台面没有方块则设置minValue为99               
    let minBlock = table.table_blocks.find(block => block.value ===  minValue);   // 获取当前台面最小方块
        
    // 1.没有上升方块（riseBlock.length === 0）
    if(riseBlock.length === 0) {

        // 1.1 若该台面没有方块（minValue === 99），则不执行， 否则台面上最小的方块上升
        if(minValue === 99) return;   
        
        // 1.2 台面有方块
        let rise_block = blockRise(scene, minBlock, table.tableName);    //台面上最小的方块上升
        riseBlock.push(rise_block);     // 添加进上升方块数组riseBlock
        table.table_blocks = table.table_blocks.filter(item => item !== riseBlock[0].block);   // 当前台面删除被上升的方块
        
    } else { 
    // 2. 有上升方块：判断上升方块的value 小于台面上最小方块的value则将上升方块放到此台面，否则将上升方块放回原位置，台面最小方块上升
        
        // 2.1 上升方块小于台面最小value，放到此台面
        if (riseBlock[0].block.value < minValue) {
            let j = table.table_blocks.length; // 当前台面上有 table.table_blocks.length 个方块， 最上面方块在第 j-1 层（层数从第0层开始）, 落下的方块坐标应该在第 j 层
            blockDrop(scene, riseBlock[0].block, table.tableFloorPos[j].x, table.tableFloorPos[j].y, onMoveComplete); // 上升的方块放到台面
            table.table_blocks.push(riseBlock[0].block); // 台面添加被上升的方块
            riseBlock.length = 0; // 清除上升方块 

        } else {
        // 2.2 上升方块小于台面最小value，上升方块放回原位置，该台面最小方块上升

            blockDrop(scene, riseBlock[0].block, riseBlock[0].block.block_bottom.x, riseBlock[0].block_last_y, onMoveComplete); // 上升方块放回原位置
            // 原台面添加被上升的方块
            tables.forEach(item => {
                if (item.tableName === riseBlock[0].tableName) {
                    item.table_blocks.push(riseBlock[0].block);
                };
            });
            riseBlock.length = 0; // 清除上升方块 

            // 该台面最小方块上升
            let rise_block = blockRise(scene, minBlock, table.tableName);    
            riseBlock.push(rise_block);     // 更新上升方块数组riseBlock
            table.table_blocks = table.table_blocks.filter(item => item !== riseBlock[0].block);   // 台面删除被上升的方块
        }
    };
}


```


### 13. phaser时间系统，添加计时事件this.time.addEvent()
```js
const Timer = this.time.addEvent({
    delay: 1000,
    // TimerEvent 发生时将调用的回调
    callback: () => {
//   

    },
    loop: true // 循环
});

this.time.now; // 当前时间属性
this.time.paused = true; // 计时暂停属性
this.time.startTime; //场景scene开始时间
this.time.timeScale = 0.5; //时间流速，默认值为 1, 时间流速减慢为原来的 50%
this.time.daleydCall(500, () => {
    // 延迟执行500ms
});
Timer.remove(); // 移除倒计时事件

```


### 14. timeLine时间线使用
- 倒计时钟震动
```js
// 倒计时钟震动
waveShakeClock() {
    
    if( !this.isclockTweenRunning) {
        this.isclockTweenRunning = true; // 闹钟动画启动标识true
        // 创建时间线
        this.timeLine = this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.clock,
                    scale: 0.7 * this.scaleX,
                    ease: 'Sine.easeInout',
                    duration: 100,
                    yoyo: true,
                    repeat: 1
                }
            },
            {
                at: 500,
                tween: {
                    targets: this.clock,
                    angle: 20,
                    ease: 'Sine.easeInout',
                    duration: 100,
                    yoyo: true,
                    repeat: -1
                }
            }
        ]);
        this.timeLine.play();  // 时间线播放
        // this.timeLine.pause();  // 时间线暂停播放
        // this.timeLine.resume();  // 时间线继续播放
        // this.timeLine.stop();  // 时间线终止
    }
};
```

- 指引手势移动及点击模拟
```js
     // 创建指引手势的光圈
      this.hand_circle1 = this.add
      .image(this.centerX - 400 * this.scaleX, this.centerY + 100 * this.scaleX, 'hand_circle')
      .setDepth(4)
      .setAlpha(0);

      this.hand_circle2 = this.add
      .image(this.hand_circle1.x, this.hand_circle1.y, 'hand_circle')
      .setDepth(4)
      .setAlpha(0);

      // 创建时间线动画
      const timeline = this.add.timeline([
         {
            at: 200,
            run: () => {
               // 创建手势对象
               this.hand = this.add
               .image(this.hand_circle1.x - 14 * this.scaleX, this.hand_circle1.y + 100 * this.scaleX, 'hand')
               .setScale(0.5 * this.scaleX)
               .setAlpha(0)
               .setDepth(5)
               .setOrigin(0);

               // 手指移动到指定位置
               this.add.tween({
                  targets: this.hand,
                  y: this.hand_circle1.y - 31 * this.scaleX,
                  alpha: { from: 0, to: 1 },
                  ease: 'Sine.easeInOut',
                  duration: 800,
                  yoyo: false,
                  repeat: 0,
                  onComplete: () => {
                     // 移动完成后，手指缩放
                     this.add.tween({
                        targets: this.hand,
                        scale: {from: 0.48 *this.scaleX, to: 0.5 *this.scaleX},
                        ease: 'Sine.easeInOut',
                        duration: 400,
                        yoyo: true,
                        repeat: -1,
                        onStart: () => {

                           // 创建两个圆的平滑动画
                           const tweenDuration = 800; // 动画持续时间
                           const overlapTime = 0.25;   // 两个动画重叠的时间比例

                           // 圆1动画
                           this.add.tween({
                              targets: this.hand_circle1,
                              scale: { from: 0.2* this.scaleX, to: 0.4 * this.scaleX },
                              alpha: { from: 1, to: 0 },
                              // ease: 'Quad.easeInOut',
                              ease: 'Linear',
                              duration: tweenDuration,
                              repeat: -1,
                              onStart: () => {
                                 // 圆2动画，延迟适当时间启动
                                 this.add.tween({
                                    targets: this.hand_circle2,
                                    scale: { from: 0.1* this.scaleX, to: 0.4 * this.scaleX },
                                    alpha: { from: 1, to: 0 },
                                    ease: 'Linear',
                                    duration: tweenDuration,
                                    // delay: tweenDuration * overlapTime, // 圆1和圆2之间有部分重叠
                                    repeat: -1,
                                 });
                              }
                           });

                           
                        }
                     })
                  },
               })
            }
         }
            
      ]);

      // 播放时间线动画
      // timeline.repeat().play();
      timeline.play();

```

### 15. 设置场景切换淡入淡出效果
- 第一种，使用tweens实现场景淡入淡出：
```js
// 在当前场景中触发的场景切换，带有淡入淡出效果
            this.tweens.add({
                targets: this.cameras.main,
                alpha: 0,  // 让当前场景透明
                duration: 500,  // 动画时长
                ease: 'Cubic.easeInOut',
                onComplete: () => {
                    this.scene.start('LoadingScene');  // 启动新场景

                    // ！！！延迟500ms，确保新场景已经加载
                    this.time.delayedCall(10, () => { 
                        const newScene = this.scene.get('LoadingScene'); // 获取新场景的摄像机并设置透明度为0
                        newScene.cameras.main.alpha = 0; 

                        this.tweens.add({
                            targets: newScene.cameras.main,
                            alpha: 1,  // 让新场景渐显
                            duration: 100,  // 设定淡入时间为 500ms
                            ease: 'Cubic.easeInOut',
                        });
                    });
                }
            });

```

- 第二种，当前场景淡出黑色，新场景从黑色淡入：

this.cameras.main 是 Phaser 场景的主摄像机（默认情况下，一个场景至少有一台摄像机），它可以控制以下内容：
alpha：透明度，范围是 0 到 1，0 为完全透明，1 为完全不透明。
zoom：缩放比例。
scrollX 和 scrollY：摄像机的滚动位置。
fadeIn 和 fadeOut 方法：内置的淡入淡出功能，简化了淡入淡出的实现。

Phaser 提供了 fadeOut 和 fadeIn 方法，可以直接对摄像机执行渐变动画，避免手动调整 alpha 值
```js
// 当前场景淡出
this.cameras.main.fadeOut(500, 0, 0, 0); // 500ms淡出，颜色为黑色 (R:0, G:0, B:0)
this.cameras.main.on('camerafadeoutcomplete', () => {
    this.scene.start('LoadingScene');// 当前场景淡出完成后，启动新场景

    // 使用延迟500ms，确保新场景已经被加载
    this.time.delayedCall(500, () => {
        const newScene = this.scene.get('LoadingScene');// 获取新场景的摄像机
        newScene.cameras.main.alpha = 0; // 确保新场景从完全透明开始
        // 新场景淡入
        newScene.cameras.main.fadeIn(500, 0, 0, 0); // 500ms淡入，颜色为黑色 (R:0, G:0, B:0)
    })
});
```

### 16. 封装按钮弹跳效果及鼠标事件
```js
/**
 * 创建带有交互效果的按钮。
 * 
 * @param {Phaser.Scene} scene - 当前场景实例。
 * @param {Phaser.GameObjects.GameObject} button - 按钮对象，必须是可交互对象（已启用 `setInteractive()`）。
 * @param {Function} [callback1] - 鼠标悬停时的回调函数。
 * @param {Function} [callback2] - 鼠标移出时的回调函数。
 * @param {Function} [callback3] - 按下按钮后的回调函数（按下动画完成后触发）。
 * @param {Function} [callback4] - 松开按钮后的回调函数（包含延迟触发效果）。
 */
export const createButton = (scene, button, callback1 = () => {}, callback2 = () => {}, callback3 = () => {}, callback4 = () => {}) => {
    button.on('pointerover', () => {
        scene.input.setDefaultCursor('pointer');
        callback1.call(scene);
    });
    
    // 鼠标移出时还原光标
    button.on('pointerout', () => {
        scene.input.setDefaultCursor('default');
        callback2.call(scene);
    });
    
    button.on('pointerdown', () => {
        // 添加丝滑的弹跳效果
        scene.tweens.add({
            targets: button,
            scale: button.scale * 0.7, // 按下时缩小
            ease: 'Cubic.easeInOut',   // 使用平滑的缓动曲线
            duration: 80,             // 缩小动画时间
            yoyo: true,               // 回弹到原始大小
            repeat: 0,                // 不重复
            onComplete: () => {
                // 第二段弹跳效果，增加丝滑感
                scene.tweens.add({
                    targets: button,
                    scale: button.scale * 1.05, // 稍微放大
                    ease: 'Sine.easeInOut',       // 自然的减速效果
                    duration: 100,             // 放大动画时间
                    yoyo: true,                // 再回弹到原始大小
                    repeat: 0,                  // 不重复
                    onComplete: () => {
                        // 在按下动画结束后执行pointerup效果
                        callback3.call(scene);
                    }
                });
            }
        });
    });
    
    button.on('pointerup', () => { 
        scene.input.setDefaultCursor('default');
        // 只有在按下的动画完成后，才执行 pointerup 的回调
        scene.time.delayedCall(300, () => {
            // 延迟执行500ms
            callback4.call(scene);
        });
        
    });

}

```

场景调用：
```js
import {createButton} from '@/utils/createButton.js';

/* 开始按钮 */
createButton(this, btn1, undefined, undefined, undefined, () => {

    // 在当前场景中触发的场景切换，带有淡入淡出效果
    this.tweens.add({
        targets: this.cameras.main,
        alpha: 0,  // 让当前场景透明
        duration: 500,  // 动画时长
        ease: 'Cubic.easeInOut',
        onComplete: () => {
            this.scene.start('LoadingScene');  // 启动新场景
        }
    });
});
```

### 17. 同时运行多个场景，但切换场景可见性
```js
// 1. 切换场景时隐藏旧场景
// 在 Phaser 中，切换场景时可能需要隐藏旧场景而不销毁它，可以使用 setVisible(false)
this.scene.setVisible(false, 'MenuScene');  // 隐藏菜单场景
this.scene.start('GameScene');             // 切换到游戏场景

// 2. 多场景叠加显示
// 如果你同时运行多个场景，但不希望它们同时可见，可以用 setVisible 控制。例如：
this.scene.setVisible(true, 'HUDScene');   // 显示 HUD 场景
this.scene.setVisible(false, 'PauseScene'); // 隐藏暂停菜单

// setVisible 仅控制可见性:它不会暂停或销毁场景，只是让场景不可见。隐藏的场景仍然在后台运行（包括逻辑更新和事件监听）。

// 与 setActive() 配合使用:
// 如果希望隐藏MenuScene场景的同时暂停其逻辑更新，可以同时使用 setActive(false) 和 setVisible(false)：
this.scene.setActive(false, 'MenuScene');
this.scene.setVisible(false, 'MenuScene');
```


### 18. 设置区域 new Phaser.Geom.Rectangle
```js
    this.padUp = new Phaser.Geom.Rectangle(23, 0, 32, 26);

//pointermove 事件返回本地坐标, px, py: 指针在 this.dpad 上的本地坐标（相对于 this.dpad 的左上角）,
// this.padUp = new Phaser.Geom.Rectangle(23, 0, 32, 26); padUp 的矩形以 (23, 0) 为左上角，宽度为 32，高度为 26。
// this.padUp.contains(px, py) 判断指针的本地坐标是否在 padUp 内
// 由于使用的是 px 和 py 来判断是否在矩形内，矩形padUp的坐标必须与这些值在相同的坐标系下(也就是this.dpad的左上角),所以padUp 的位置是 相对于 this.dpad 的本地坐标  
      this.dpad.on('pointermove', (pointer, px, py) => {
         this.showTip = true;

         if (this.padUp.contains(px, py)) {
            this.dpad.setFrame('nav-up');
            this.updateToolTip('bring to top');
         } else if (this.padDown.contains(px, py)) {
            this.dpad.setFrame('nav-down');
            this.updateToolTip('send to back');
         }else if (this.padLeft.contains(px, py)) {
            this.dpad.setFrame('nav-left');
            this.updateToolTip('move down');
         } else if (this.padRight.contains(px, py)) {
            this.dpad.setFrame('nav-right');
            this.updateToolTip('move up');
         } else {
            this.dpad.setFrame('nav-out');
            this.showTip = false;
         }
      });
```

### 19. 同时多个场景同时运行，移动某场景到场景堆栈的顶部，使其成为最上层可见的场景
```js
// this.scene.bringToTop(this.currentScene); 是 Phaser 的场景管理功能，用于将指定的场景移动到场景堆栈的顶部，使其成为最上层可见的场景。
this.scene.bringToTop(this.currentScene);

// this.scene.moveAbove()将this.currentScene的场景移动到名为SceneController场景的上方
this.scene.moveAbove('SceneController', this.currentScene);

// this.scene.getIndex()获取当前场景 this.currentScene 在场景堆栈中的索引,最上层的场景索引为0
let idx = this.scene.getIndex(this.currentScene);

// this.scene.moveDown()将当前场景 this.currentScene 下移一层
this.scene.moveDown(this.currentScene);

// this.scene.moveUp()将当前场景 this.currentScene 上移一层
this.scene.moveUp(this.currentScene);

// this.scene.launch()启动场景，并不停止当前场景,新场景会作为一个额外的层被运行,适合场景叠加
// 使用场景:
    // 启动一个 HUD 场景或 UI 场景，同时保持游戏主场景运行。
    // 动态叠加效果，比如弹出一个小窗口或菜单。
// this.scene.start()停止当前场景，并启动指定的场景（SceneA）。
// 使用场景:
//     从一个关卡场景切换到下一个关卡场景。
//     从主菜单切换到游戏场景。

this.scene.launch('SceneA');
this.scene.launch('SceneB');
this.scene.launch('SceneC');
this.scene.launch('SceneD');
this.scene.launch('SceneE');
this.scene.launch('SceneF');
// 获取某场景，this.scene.get()
this.currentScene = this.scene.get('SceneA');



```


### 20. 创建遮罩播放文字，遮罩以外的文字不可见
```js
create() {
    const tip_bg = this.add.graphics();
    const tip_bg_width = 620 *this.scaleX;
    const tip_bg_height = 40 *this.scaleX;
    tip_bg.setPosition(name_label.x + 50 *this.scaleX, name_label.y );
    tip_bg.fillStyle(0x98C8FE, 1);
    tip_bg.fillRect(0,0, tip_bg_width, tip_bg_height);
    this.tip = this.addText(tip_bg.x + 35*this.scaleX, tip_bg.y + tip_bg_height / 2, '每次只能移动一个方块，将所有方块按照上小下大，放置到第三根柱子上则通关！', 'Douyin Sans','400', 20* this.scaleX, 24, '#E5F2FF', '', 0,0.5,3)

    // 创建文字播放遮罩，与 tip_bg 的区域一致
    const maskShape = this.add.graphics();
    maskShape.fillRect(
        tip_bg.x + 35*this.scaleX,
        tip_bg.y,
        tip_bg_width - 50*this.scaleX, // tip_bg 的宽度
        tip_bg_height  // tip_bg 的高度
    );

    // createGeometryMask(): 将 maskShape 转化为一个几何遮罩（GeometryMask）。遮罩是 Phaser 中用于隐藏或显示某些区域的工具
    // setMask(): 将几何遮罩 textMask 应用到 tip 对象,超出maskShape区域的部分被隐藏
    const textMask = maskShape.createGeometryMask();  
    this.tip.setMask(textMask); 

    // 若要求区域内隐藏，区域外显示，则需要反转遮罩
    // const textMask = maskShape.createGeometryMask();
    // textMask.setInvertAlpha(true); // 反转遮罩
    // tip.setMask(textMask); // 应用遮罩到文本

}
update(time, delta) {
    // 提示文字移动
    this.tip.x -= 0.09 * delta;
    if (this.tip.x < -10 * this.scaleX) {
        this.tip.x = 1300 * this.scaleX;
    }
}
```


### 21. 平铺精灵每帧都平滑移动在update周期里执行--游戏背景：创建一个自动滚动的星空、云朵或地面背景。
```js
create() {
    // this.add.tileSprite(x, y, width, height, key),添加一个平铺精灵（Tile Sprite）,默认原点为 (0.5, 0.5)。平铺精灵是一种特殊的精灵，它会重复渲染指定的纹理，可以用来实现背景滚动效果
    this.bg = this.add.tileSprite(0, 135, 1024, 465, 'bg').setOrigin(0);
}

update( time, delta) {
    // time: 游戏启动以来的总时间（以毫秒为单位）。
    // delta: 自上一帧以来的时间（以毫秒为单位）。它是帧间隔，用来实现帧速率无关的逻辑。
    // 这两行代码更新背景纹理的平铺位置（tilePositionX 和 tilePositionY）,this.bg 是一个带有平铺纹理的 TileSprite 对象
    // tilePositionX 和 tilePositionY 控制背景平铺纹理在 X 和 Y 方向上的偏移，增加它们的值会导致纹理看起来在不断滚动，实现平滑的背景移动效果
    // 为什么乘以 delta：使用 delta 是为了让背景滚动速度与帧速率无关（frame-rate independent）。无论帧速率快慢，滚动的速度都保持一致

    this.bg.tilePositionX += 0.02 * delta;
    this.bg.tilePositionY += 0.005 * delta;

}
```

### 22. 画布通过cameras控制可视区域
this.cameras.main.setViewport(x, y, width, height)是Phaser 中用来调整相机视口的方法，设置主相机（main）的可视区域（可以用它来控制场景的可见部分）
// x: 视口的左上角相对于游戏画布的水平坐标。
// y: 视口的左上角相对于游戏画布的垂直坐标。
// width: 视口的宽度（显示区域的宽度）。
// height: 视口的高度（显示区域的高度）。

cameras使用场景：
    UI布局：当需要在游戏画布的不同部分显示不同内容时，可以用 setViewport 为每个相机定义特定的显示区域。例如：顶部区域显示游戏场景。下方区域显示 HUD（用户界面）。

    分屏效果：如果游戏需要在单个画布中为不同玩家显示独立的视角，可以使用多个相机并分别设置它们的视口。
    
    限制显示区域：用于只渲染某些特定部分，比如菜单、状态栏或游戏地图的一部分。
举例：
```js
create() {
      // this.cameras.main.setViewport(x, y, width, height)是Phaser 中用来调整相机视口的方法，设置主相机（main）的可视区域（可以用它来控制场景的可见部分）
      // x: 视口的左上角相对于游戏画布的水平坐标。
      // y: 视口的左上角相对于游戏画布的垂直坐标。
      // width: 视口的宽度（显示区域的宽度）。
      // height: 视口的高度（显示区域的高度）。

      /* cameras使用场景：
         UI布局：当需要在游戏画布的不同部分显示不同内容时，可以用 setViewport 为每个相机定义特定的显示区域。例如：
         顶部区域显示游戏场景。下方区域显示 HUD（用户界面）。

         分屏效果：如果游戏需要在单个画布中为不同玩家显示独立的视角，可以使用多个相机并分别设置它们的视口。
         
         限制显示区域：用于只渲染某些特定部分，比如菜单、状态栏或游戏地图的一部分。 
      // 举例：
      // 设置主相机的视口
      this.cameras.main.setViewport(0, 136, 1024, 465);

      // 创建一个额外的相机，显示在画布右侧
      const hudCamera = this.cameras.add(1024, 0, 200, 600);
      hudCamera.setBackgroundColor('#000000'); // 设置背景色为黑色
      */

      this.cameras.main.setViewport(0, 136, 1024, 465); //相当于裁剪出一个区域，从 (0, 136) 到 (1024, 601)，并只显示该区域内的内容
      this.nebula = this.add.image(300, 250, 'space', 'nebula');
   }
   update(time, delta) {
      // rotation 属性控制对象的旋转角度（单位是弧度，0 表示不旋转，Math.PI 表示半圈，2 * Math.PI 表示一圈）
      // +=: 增量赋值，表示在现有旋转角度的基础上增加值。
      // 0.00006: 旋转速度的基准值，值越大，旋转越快。这里值非常小，因此旋转会很慢。
      // delta: 表示从上一帧到当前帧之间的时间差（以毫秒为单位）。乘以 delta 是为了实现 帧率无关的动画，这种做法确保了无论帧率如何，旋转速度保持一致

      // 应用场景：
      //    视觉效果：让背景中的星云、行星、齿轮等物体缓慢旋转，增强动态效果。
      //    装饰动画：添加旋转效果使画面更生动，例如菜单界面的装饰性动画。
      // 注意：
      // rotation 单位是弧度：在 Phaser 中，rotation 的值是以弧度为单位的。如果需要使用角度，可以通过以下公式进行转换：
      // const degrees = radians * (180 / Math.PI); // 弧度转角度
      // const radians = degrees * (Math.PI / 180); // 角度转弧度

      this.nebula.rotation += 0.00006 * delta; //让 this.nebula 对象缓慢地以固定速度顺时针旋转
   }
```


### 22. 控制场景元素固定速度顺时针旋转
```js
update(time, delta) {
      // rotation 属性控制对象的旋转角度（单位是弧度，0 表示不旋转，Math.PI 表示半圈，2 * Math.PI 表示一圈）
      // +=: 增量赋值，表示在现有旋转角度的基础上增加值。
      // 0.00006: 旋转速度的基准值，值越大，旋转越快。这里值非常小，因此旋转会很慢。
      // delta: 表示从上一帧到当前帧之间的时间差（以毫秒为单位）。乘以 delta 是为了实现 帧率无关的动画，这种做法确保了无论帧率如何，旋转速度保持一致

      // 应用场景：
      //    视觉效果：让背景中的星云、行星、齿轮等物体缓慢旋转，增强动态效果。
      //    装饰动画：添加旋转效果使画面更生动，例如菜单界面的装饰性动画。
      // 注意：
      // rotation 单位是弧度：在 Phaser 中，rotation 的值是以弧度为单位的。如果需要使用角度，可以通过以下公式进行转换：
      // const degrees = radians * (180 / Math.PI); // 弧度转角度
      // const radians = degrees * (Math.PI / 180); // 角度转弧度

      this.nebula.rotation += 0.00006 * delta; //让 this.nebula 对象缓慢地以固定速度顺时针旋转
   }
```


### 23. 控制场景元素固定速度移动并重新设置位置
```js
    create() {
        this.cameras.main.setViewport(0, 136, 1024, 465);
        this.sun = this.add.image(300, 250, 'space','sun');
    }
    update(time, delta) {
        this.sun.x -= 0.02 * delta;
        this.sun.y += 0.015 * delta;

        if(this.sun.y >= 630) {
            this.sun.setPosition(1150, -190);
        }
    }

```


### 24. 添加粒子系统及发射轨迹--用于轨迹展示或动态 UI 装饰等
this.add.particles()
```js
// 飞船移动及添加飞船移动的粒子发射轨迹
class SceneE extends Phaser.Scene {
   constructor() {
      super('SceneE');
      this.ship;
      this.particles;

      // 一组点（控制点）
      this.splineData = [
         50, 300,
         146, 187,
         35, 94,
         180, 40,
         446, 35,
         438, 100,
         337, 150,
         452, 185,
         560, 155,
         641, 90,
         723, 147,
         755, 262,
         651, 271,
         559, 318,
         620, 384,
         563, 469,
         433, 457,
         385, 395,
         448, 334,
         406, 265,
         316, 305,
         268, 403,
         140, 397,
         205, 309,
         204, 240,
         144, 297,
         50, 300
      ];

      this.curve;
   }
   init() {
   
   }
   preload() {

   }
   create() {
      this.cameras.main.setViewport(0, 136, 1024, 465);

      // Phaser.Curves.Spline：Phaser 提供的一种曲线类型，它根据一组点（控制点）绘制一条平滑的曲线。
      // this.splineData：传递给 Spline 的点集合（数组）。这些点是曲线的控制点，用于定义曲线的形状

      // this.add.follower(): Phaser 提供的功能，用于生成一个能沿着路径（曲线）移动的对象

      // 这段代码创建了一条 样条曲线（spline curve），并让一个对象（ship）沿着该曲线移动
      this.curve = new Phaser.Curves.Spline(this.splineData);
      let ship = this.add.follower(this.curve, 50, 300, 'space', 'ship');
      // 启动路径跟随动画
      ship.startFollow({
         duration: 12000,
         yoyo: true,
         repeat: -1,
         ease: 'Sine.easeInOut'
      });

      // 应用场景：
         // 飞船运动效果: 在太空游戏中展示飞船在曲线轨道上移动的视觉效果。
         // 轨迹展示: 用于火箭、子弹、导弹等运动物体的轨迹可视化。
         // 动态 UI 装饰: 制作菜单中类似光线运动的装饰动画。
         
      // this.add.particles()添加一个粒子系统，创建跟随 ship 的视觉效果
      this.particles = this.add.particles(0, 0, 'space', {
         frame: 'blue', //粒子使用space图集中的 'blue' 帧
         speed: 100,    //粒子的初速度（单位：像素/秒）
         lifespan: 2000,  //粒子的生存时间（毫秒）,默认值为 1000 毫秒，这里设置粒子会在 2 秒后消失
         alpha: 0.6, //粒子的透明度
         angle: 180,  // 粒子的初始发射角度（向左发射）
         scale: {start: 0.7, end: 0}, //粒子的缩放，逐渐从 0.7 缩小到 0
         blendMode: 'ADD' //设置粒子的混合模式，产生发光效果
      });

      ship.setDepth(1);
      this.ship = ship;
      // 让粒子系统 this.particles 跟随 ship 的位置移动
      this.particles.startFollow(this.ship);



   }
   update() {

   }
};
```


### 25. 手势指引
```js
     // 创建指引手势的光圈
      this.hand_circle1 = this.add
      .image(this.centerX - 400 * this.scaleX, this.centerY + 100 * this.scaleX, 'hand_circle')
      .setDepth(4)
      .setAlpha(0);

      this.hand_circle2 = this.add
      .image(this.hand_circle1.x, this.hand_circle1.y, 'hand_circle')
      .setDepth(4)
      .setAlpha(0);

      // 创建时间线动画
      const timeline = this.add.timeline([
         {
            at: 200,
            run: () => {
               // 创建手势对象
               this.hand = this.add
               .image(this.hand_circle1.x - 14 * this.scaleX, this.hand_circle1.y + 100 * this.scaleX, 'hand')
               .setScale(0.5 * this.scaleX)
               .setAlpha(0)
               .setDepth(5)
               .setOrigin(0);

               // 手指移动到指定位置
               this.add.tween({
                  targets: this.hand,
                  y: this.hand_circle1.y - 31 * this.scaleX,
                  alpha: { from: 0, to: 1 },
                  ease: 'Sine.easeInOut',
                  duration: 800,
                  yoyo: false,
                  repeat: 0,
                  onComplete: () => {
                     // 移动完成后，手指缩放
                     this.add.tween({
                        targets: this.hand,
                        scale: {from: 0.48 *this.scaleX, to: 0.5 *this.scaleX},
                        ease: 'Sine.easeInOut',
                        duration: 400,
                        yoyo: true,
                        repeat: -1,
                        onStart: () => {

                           // 创建两个圆的平滑动画
                           const tweenDuration = 800; // 动画持续时间
                           const overlapTime = 0.25;   // 两个动画重叠的时间比例

                           // 圆1动画
                           this.add.tween({
                              targets: this.hand_circle1,
                              scale: { from: 0.2* this.scaleX, to: 0.4 * this.scaleX },
                              alpha: { from: 1, to: 0 },
                              // ease: 'Quad.easeInOut',
                              ease: 'Linear',
                              duration: tweenDuration,
                              repeat: -1,
                              onStart: () => {
                                 // 圆2动画，延迟适当时间启动
                                 this.add.tween({
                                    targets: this.hand_circle2,
                                    scale: { from: 0.1* this.scaleX, to: 0.4 * this.scaleX },
                                    alpha: { from: 1, to: 0 },
                                    ease: 'Linear',
                                    duration: tweenDuration,
                                    // delay: tweenDuration * overlapTime, // 圆1和圆2之间有部分重叠
                                    repeat: -1,
                                 });
                              }
                           });

                           
                        }
                     })
                  },
               })
            }
         }
            
      ]);

      // 播放时间线动画
      // timeline.repeat().play();
      timeline.play();


```


### 26. 添加音频audio并使用以及动态修改全局音量
```js
preload() {
    this.load.audio('background_music', 'assets/music/background_music.wav');
}
create(){
    // 设置全局最新音量值
    this.registry.set('sounds_value', 3); // 声音默认值
    this.registry.set('music_value', 3);  // 音乐默认值
    this.registry.set('msg_state_value', true);  // 通知声音默认值

    // 避免其他场景使用this.scene.start()返回此场景时音乐重复播放导致音乐交叠
    if (!this.sound.get('background_music')) {
        // 添加背景音乐
        this.background_music = this.sound.add('background_music', {
            loop: true,    // 循环播放
            volume: this.registry.get('music_value') / 17,//音量范围(0-1.0)
        });

        this.background_music.play();// 播放音乐
    } else {
        this.background_music = this.sound.get('background_music');
    };
    // music_value动态更新音量
    this.registry.events.on('changedata-music_value', (parent, key, value) => {
        // console.log('Parent:', parent); // 指向 this.registry
        // console.log('Key:', key);       // 被修改的键名，例如 'music_value'
        // console.log('value', value); //music_value旧值
        const newValue = this.registry.get('music_value'); // 获取music_value最新值
        this.background_music.setVolume(newValue / 10);
        // this.background_music.pause(); // 暂停
        // this.background_music.resume(); // 恢复
        // this.background_music.stop(); // 停止
    });

}

```

### 27. 键盘按键交互
```js
// 监听按键交互事件
    this.input.keyboard.on('keydown-SPACE', () => {
        // this.sound.stopAll(); // 按下空格键，停止所有音效
    });
    this.input.keyboard.on('keydown-A', () => {
        // bass.play(); // 按下A键，播放音效bass
    });
    this.input.keyboard.on('keydown-B', () => {
        // drums.play();// 按下B键，播放音效drums
    });
```


### 28. 场景传递数据
传递数据的方法：使用场景的 events.emit 方法发送数据。在目标场景中使用 events.on 方法监听数据。
this.scene.events.emit('', {});
this.scene.events.on('', () => {});

### 29. 多场景和容器怎么选择
推荐使用场景
多场景：
主菜单、关卡选择、游戏内场景、暂停场景分开设计。
适合需要模块化管理和资源隔离的游戏结构。

容器作为场景组件：
游戏内的对话框、HUD、设置界面等功能作为主场景的附属模块。
适合需要简单管理的 UI 元素或子功能。


### 30. 创建音频上下文audioContext
```js
import Phaser from 'phaser';

class ReuseAudioContext extends Phaser.Scene {
   constructor() {
      super('ReuseAudioContext');
      this.audioContext;
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.spritesheet('explosion', 'assets/atlas/trimsheet/explosion.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('bomb', 'assets/sprites/xenon2_bomb.png', { frameWidth: 8, frameHeight: 16 });
    this.load.audio('explosion', [ 'assets/audio/SoundEffects/explosion.mp3' ]);
    
   }
   create() {
    this.anims.create({
        key: 'rotate',
        frames: this.anims.generateFrameNumbers('bomb', {star: 0, end: 3, first: 3}),
        frameRate: 20,
        repeat: -1,
    });
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', {star: 0, end: 23, first: 23}),
        frameRate: 20,
    });

    const bomb = this.add.sprite(400, 300, 'bomb');
    bomb.setScale(6, -6); // -6是在y方向倒转方向并放大6倍
    bomb.anims.play('rotate');
    bomb.play('rotate'); //播放帧动画

    this.input.once('pointerdown', () => {
        bomb.setVisible(false);

        const boom = this.add.sprite(400, 300, 'explosion').setScale(6);
        boom.play('explode'); //播放爆炸帧动画

        const explosion = this.sound.add('explosion', {
            volume: 0.5,
        });
        
        // 监听explosion完成事件
        explosion.on('complete', (sound) => {
            setTimeout(() => {
                //this.sys.game.destroy() 销毁当前的游戏实例。它的作用是完全停止游戏的运行，并清理所有与游戏相关的资源和内存
                this.sys.game.destroy(true); // 销毁当前游戏实例
                

                /* 音频上下文：负责管理音频的播放、处理、效果和其他与声音相关的功能,
                在 Phaser 中，音频上下文通常是自动创建的，并通过 Phaser.Sound 系统进行访问。当你加载和播放音频时，Phaser 会根据需要管理音频上下文
                    游戏初始化时，将自定义的 audioContext 传递给 Phaser 的配置。
                    在场景中可以通过 this.sound.context 访问音频上下文，控制音频行为（如暂停、恢复音频） */
                try{
                    // 创建音频上下文
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    // 如果音频上下文创建失败，直接退出
                    console.error(e); 
                    return;
                };

                // 左键点击，创建新的游戏实例
                document.addEventListener('click',  function newGame() {
                    const game = new Phaser.Game({
                        type: Phaser.AUTO,
                        width: 800,
                        height: 600,
                        parent: '#container',  // 挂载到#container的html元素上
                        scene: ReuseAudioContext,
                        pixelArt: true,
                        audio: {
                            context: this.audioContext // 指定音频上下文
                            /* 在场景中通过 this.sound.context 可以访问音频上下文：
                            this.sound.context.resume(); // 恢复音频上下文
                            this.sound.context.suspend(); // 暂停音频上下文
                            console.log(this.sound.context.state); // 检查音频上下文的状态 */
                        }
                    });

                    

                    //  移除点击事件监听器，防止重复创建游戏实例
                    document.removeEventListener('click', newGame);
                });
            })
        });

        explosion.play(); // 播放爆炸音效
        
    });

   }
   update() {

   }
};



export default ReuseAudioContext;
```

### 31. 元素边界 this.image1.getBounds()
```js
import Phaser from 'phaser';

class GetBounds extends Phaser.Scene {
   constructor() {
        super('GetBounds');
        this.graphics;
        this.bounds3;
        this.bounds2;
        this.bounds1;
        this.image3;
        this.image2;
        this.image1;
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    this.load.image('disk', 'assets/sprites/copy-that-floppy.png');
    this.load.image('tetris', 'assets/sprites/tetrisblock1.png');
   }
   create() {
    this.image1 = this.add.image(700, 200, 'eye');
    this.image2 = this.add.image(180, 180, 'tetris');
    this.image3 = this.add.image(400, 500, 'disk');

    this.image1.setOrigin(1);
    this.image2.setOrigin(0);
    this.image3.setOrigin(0.5);

    this.image3.setScale(0.5);

    const container = this.add.container(100, 0,[ this.image1, this.image2, this.image3 ]);
    container.setAngle(20);

    this.graphics = this.add.graphics();
    this.bounds1 = this.image1.getBounds();
    // console.log('bounds1', this.image1.getBounds()); // image1的边界（矩形）
    this.bounds2 = this.image2.getBounds();
    this.bounds3 = this.image3.getBounds();

    // image3放大动画
    this.tweens.add({
        targets: this.image3,
        duration: 2000,
        scaleX: 2,
        scaleY: 2,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });

   }
   update(time, delta) {
    this.image1.rotation += 0.013; //每帧都将旋转角度增加 0.013，从而实现一个平滑的旋转动画
    this.image2.rotation += 0.015;
    this.image3.rotation -= 0.010;

    this.bounds1 = this.image1.getBounds(); //getBounds():获取对象的边界框，返回一个 Phaser.Geom.Rectangle
    this.bounds2 = this.image2.getBounds();
    this.bounds3 = this.image3.getBounds();

    this.graphics.clear();
    this.graphics.lineStyle(1, 0xff0000); //设置绘制线条的样式:宽度1，颜色0xff0000
    this.graphics.strokeRectShape(this.bounds1);  //strokeRectShape():在场景中绘制一个矩形，使用 getBounds() 的结果作为参数，展示 image1 的边界框

    this.graphics.lineStyle(1, 0xffff00);
    this.graphics.strokeRectShape(this.bounds2);

    this.graphics.lineStyle(1, 0x00ff00);
    this.graphics.strokeRectShape(this.bounds3);
   }
};

export default GetBounds;
```


### 32. 停止/恢复元素的交互
```js

......
container3.add(btn_setting, btn_back, btn_rule,btn_announcement);

this.coverdInteractiveItems = [];  // 存放所有事件元素，方便统一管理和销毁
this.coverdInteractiveItems.push(container2.list, container3.list);

// 停止被遮罩元素的交互性
coverdInteractiveItems.flat().forEach(item => {
    // 在 Phaser 中，每个可交互的游戏对象都有一个 input 属性，这个属性是用来管理该对象交互事件的。通过检查 item.input，可以确保该元素是一个具备交互能力的对象。
    if(item.input) {
        item.input.enabled = false;
    };
});
```

### 33. phaser添加文字时添加普通空格
```js
// 在文本中插入非断空格 (\u00A0) 替代普通空格。非断空格是固定宽度的，不会被忽略。
const text1 = scene.addText(scene.dialog.x, scene.dialog.y + 85 * scene.scaleX, 
            [
                '亲爱的玩家：', 
                `${'\u00A0'.repeat(8)}值此新年之际，我们衷心感谢大家在过去一年里对我们的支持与厚爱！因为有你们的陪伴，我们的游戏世界更加精彩。`,
                `${'\u00A0'.repeat(8)}在新的一年里，我们将继续努力，为大家带来更多的乐趣和惊喜！愿你在新的一年里，游戏中所向披靡，现实中好运连连！`,
                `${'\u00A0'.repeat(8)}祝您和您的家人新年快乐，平安幸福！`,
                `${'\u00A0'.repeat(8)}期待在未来的冒险中与您再度相遇！`,
            ], 
            'Douyin Sans', 'blod', 20 * scene.scaleX, 10,'#5982AB',800, 0.5, 0.5, 2)
        text.push(text1);
```

### 34. 跳转网站window.open()
```js
 const text6 = scene.addText(text_area.x + text_area_width / 2, text_area.y + text_area_height, 
    `起司悦动官方网站：https://cheersjoy.cn`,
    'Douyin Sans', 'blod', 16 * scene.scaleX, 8* scene.scaleX,'#85abda', 800* scene.scaleX, 0.5, 1, 2);

text6.setInteractive();
text6.on('pointerover', () => {
    scene.input.setDefaultCursor('pointer');
});
text6.on('pointerout', () => {
    scene.input.setDefaultCursor('default');
});
text6.on('pointerdown', () => {
    // 跳转网站
    window.open('https://cheersjoy.cn', '_blank');  // 打开链接
    console.log("Text clicked, opening website...");  // 添加日志输出，确保事件触发
});
```

### 35. 创建几何图形作为遮罩
```js
// 1.创建一个矩形作为文本背景
const text_area_width = 800 * scene.scaleX;
const text_area_height = 280 * scene.scaleX;   
const text_area = scene.add.graphics();
text_area.fillStyle(0xFFFFFF, 0);
text_area.fillRect(0, 0, text_area_width, text_area_height); // 绘制一个 800x50 的矩形背景
// 设置矩形的位置为居中
text_area.setPosition(
    scene.dialog.x - text_area_width / 2,  // 水平居中
    scene.dialog.y - 30 * scene.scaleX 
);

// 2.创建一个遮罩(text_area的位置大小)
const text_mask_shape = scene.make.graphics({x: 0,  y: 0, add: false });
text_mask_shape.fillStyle(0xffffff, 1);
text_mask_shape.fillRect(text_area.x, text_area.y, text_area_width, text_area_height);
const text_mask = text_mask_shape.createGeometryMask();

// 3.根据text_area的位置添加文字
const text1 = scene.addText(text_area.x, text_area.y, '亲爱的玩家：', 'Douyin Sans', 'blod', 20 * scene.scaleX, 8* scene.scaleX,'#5982AB',text_area_width, 0, 0, 2);
const text2 = scene.addText(text1.x, text1.y + text1.height + 30 * scene.scaleX, 
    `${'\u00A0'.repeat(8)}值此新年之际，我们衷心感谢大家在过去一年里对我们的支持与厚爱！因为有你们的陪伴，我们的游戏世界更加精彩。`, 
    'Douyin Sans', 'blod', 20 * scene.scaleX, 8* scene.scaleX,'#5982AB', text_area_width, 0, 0, 2);
const text3 = scene.addText(text2.x, text2.y + text2.height + 30 * scene.scaleX, 
    `${'\u00A0'.repeat(8)}在新的一年里，我们将继续努力，为大家带来更多的乐趣和惊喜！`, 
    'Douyin Sans', 'blod', 20 * scene.scaleX, 8* scene.scaleX,'#5982AB', text_area_width, 0, 0, 2);
const text4 = scene.addText(text3.x, text3.y + text3.height + 30 * scene.scaleX, 
    `${'\u00A0'.repeat(8)}祝您和您的家人新年快乐，平安幸福！`,
    'Douyin Sans', 'blod', 20 * scene.scaleX, 8* scene.scaleX,'#5982AB', text_area_width, 0, 0, 2);
const text6 = scene.addText(text_area.x + text_area_width / 2, text_area.y + text_area_height, 
    `起司悦动官方网站：https://cheersjoy.cn`,
    'Douyin Sans', 'blod', 16 * scene.scaleX, 8* scene.scaleX,'#85abda', text_area_width, 0.5, 1, 2);

text6.setInteractive();
text6.on('pointerover', () => {
    scene.input.setDefaultCursor('pointer');
});
text6.on('pointerout', () => {
    scene.input.setDefaultCursor('default');
});
text6.on('pointerdown', () => {
    // 跳转网站
    window.open('https://cheersjoy.cn', '_blank');  // 打开链接
});


text.push(text1, text2, text3, text4, text6);
// text.forEach(item => item.setFixedSize(text_area_width, text_area_height)); // 固定每一个文本的大小，超出部分的文本被裁剪掉

// 4.将文字对象设置遮罩，超出遮罩部分不显示
text.forEach(item => item.setMask(text_mask)); 
```

### 36. this.add.text()和this.make.text(config)区别：
1. this.add.text(x, y, text, style); 直接将文本添加到当前场景的显示列表中，立即可见并参与渲染
- 适用场景:
    用于需要在场景中立即显示的文本场景，比如欢迎语、计数器等。
- 使用：
```js
this.add.text(this.centerX, this.centerY, 'Hello, Phaser!', { fontSize: '48px', fill: '#00ff00' });
```

2. this.make.text(config); 提供更灵活的文本创建方式。它创建一个文本对象自动添加到场景的显示列表中，适合需要更复杂的初始化设置或动态控制的场景
- 适用场景:
    用于需要在创建文本之前或之后进行更多自定义操作的场景，比如动态控制是否显示、延迟显示等。 
- 使用：
```js
const text = this.make.text({
    x: 400,
    y: 300,
    text: 'Custom Text',
    origin: 0.5,
    style: {
    font: '20px Arial',
    fill: '#ff0000',
    align: 'center'
    add: true, //  默认为true,会自动添加到场景中并显示
    }
});

// 需要手动控制添加到显示列表
// this.children.add(text); 
```


### 37. text换行属性
text.style.wordWarpWidth = { width: 200, useAdvancedWrap: true };
基本换行：
text.setWordWrapWidth(200, false); 
高级换行：
text.setWordWrapWidth(200, true); 
禁用换行：
text.setWordWrapWidth(null);
自定义换行：
text.setWordWrapCallback(callback, scope);
清除自定义换行：
text.setWordWrapCallback(null);

```js
import Phaser from 'phaser';

class Text_wordWrap extends Phaser.Scene {
   constructor() {
      super('Text_wordWrap')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;

     this.textsPassed = 0;
     this.totalTests = 0;
   }
   preload() {

   }
   create() {
/*this.add.text()和this.make.text(config)区别：
   1. this.add.text(x, y, text, style); 直接将文本添加到当前场景的显示列表中，立即可见并参与渲染
      - 适用场景:
         用于需要在场景中立即显示的文本场景，比如欢迎语、计数器等。
      - 使用：
      this.add.text(this.centerX, this.centerY, 'Hello, Phaser!', { fontSize: '48px', fill: '#00ff00' });
   
   2. this.make.text(config); 提供更灵活的文本创建方式。它创建一个文本对象但不会自动添加到场景的显示列表中，适合需要更复杂的初始化设置或动态控制的场景
      - 适用场景:
         用于需要在创建文本之前或之后进行更多自定义操作的场景，比如动态控制是否显示、延迟显示等。 
      - 使用：
      const text = this.make.text({
         x: 400,
         y: 300,
         text: 'Custom Text',
         origin: 0.5,
         style: {
            font: '20px Arial',
            fill: '#ff0000',
            align: 'center'
         }
      });

      // 手动控制添加到显示列表
      this.children.add(text);   
      */

      const text = this.make.text({
         x: 400,
         y: 300,
         text: '  The   sky above the port was the color of television, tuned to a dead channel.',
         origin: 0.5, // origin: [0.5, 0.5]
         style: {
            font: 'bold 30px Arial',
            fill: '#58e07c',  //color: '#58e07c'
         }
      });

      // 断言
      this.assert('文字宽度wordWarpWidth应该为空', text.style.wordWarpWidth === null);
      this.assert('高级自动换行属性wordWrapUseAdvanced应该为false', text.style.wordWrapUseAdvanced === false);
      this.assert('换行回调函数wordWrapCallback应该为null', text.style.wordWrapCallback === null);
      this.assert('自动换行回调范围wordWrapCallbackScope应该为null', text.style.wordWrapCallbackScope === null);
      this.assert('换行文本应为一行', text.getWrappedText().length === 1);
      

      {
         //1. 文字宽度换行基本用法(不启用高级换行)：
            /* 会换行--只会简单地根据空格或手动插入的换行符（\n）来处理文本，而不会主动按照宽度限制来自动断行；
               第一行不去除文字前的空格；
               多空格不被折叠； */
         text.setWordWrapWidth(200, false); 

         let lines = text.getWrappedText(); // 获取换行后的每一行文字，返回一个数组
         console.log(lines);

         this.assert('换行文本应该是多行', lines.length > 1);
         this.assert('第一行不应被修剪', lines[0].startsWith(' ')); //lines[0].startsWith(' ')检查第一行是否以空格开头,返回true/false
         this.assert('第一行没有空格折叠', lines[0].includes('The   sky'));   // lines[0].includes('The   sky')检查第一行是否包含该字符串
         // console.log(lines[0], lines[0].length); 

         text.setWordWrapWidth(null); // 禁用换行
      }

      {
         //2. 启用后禁用换行
         text.setWordWrapWidth(200, false); // 设置文字宽度200，不启用高级换行
         text.setWordWrapWidth(null);   // 禁用换行
      }

      {
         //3. 启用高级文字宽度换行: 
          /* 文字会换行--智能地根据 wordWrap.width 的限制计算文本的断行位置；
          第一行会去除文字前的空格；
          第一行多空格会被折叠； */
         text.setWordWrapWidth(200, true); // 设置文字宽度200，启用高级换行
         let lines = text.getWrappedText();
         this.assert('换行文本应该是多行', lines.length > 1);
         this.assert('第一行应该被修剪', !lines[0].startsWith(' '));
         this.assert('第一行多空格会被折叠', lines[0].includes('The sky'));
         text.setWordWrapWidth(null); // 禁用换行
      }

      {
         // 换行回调函数setWordWrapCallback(callback, scope)：自定义文本的换行逻辑，取代 Phaser 内置的 wordWrap，返回数组
         /* 参数1: callback(string, textObject) ,
               - string：要处理的完整文本字符串。
               - textObject：当前的 Phaser.Text 对象。
               回调函数的返回值应该是一个数组，每个数组元素代表一行的文本
            参数2: scope：
               设置回调函数的执行上下文（设置this 的指向）
         */
         text.setWordWrapCallback(function (string, textObject) {
            this.assert('第二个参数应该是文本对象', text === textObject);
            this.assert('范围应与给定范围对象匹配', this.testObject === true);
            
            return [ '12', '34' ]; // 第一行文本 12 第二行文本 34
         }, { testObject: true, assert: this.assert});  // this指向对象{ testObject: true, assert: this.assert}
         
         let lines = text.getWrappedText();
         console.log('lines--', lines); // ['12', '34']
         
         text.setWordWrapCallback(null);  // 清除自定义换行
      }

      {
         // 自定义换行函数回调，返回字符串,使用换行符\n
         text.setWordWrapCallback(() => '122\n34');
         let lines = text.getWrappedText();
         console.log('lines--', lines);  // ['122', '34']

         text.setWordWrapCallback(null);
      }

      {
         // 启用后禁用自定义换行函数回调
         text.setWordWrapCallback(text => text, {testObject: true});
         text.setWordWrapCallback(null);  // 启用后禁用自定义换行函数回调

         let lines = text.getWrappedText();
         console.log('lines--', lines); 
      }

      
   }
   update() {

   }

   // 调试断言
   assert(message, condition) {
      this.totalTests ++;
      if(condition) {
         this.textsPassed ++;
      };
      console.assert(condition, message);
      
   }
};

export default Text_wordWrap;
```


### 38. phaser3支持的视频格式及特点
在 Phaser 3 中，支持的视频格式主要包括以下几种常见格式：
格式 |	扩展名	|  | 
1. MP4 (.mp4)	
   浏览器支持情况: 广泛支持，兼容性好（主流浏览器支持）。	
   优势与限制：
    - 高兼容性
    - 文件大小较小
    - 常用编码（H.264）效率高
2. WebM	(.webm)	
   浏览器支持情况: 大多数现代浏览器支持。	Safari不支持
   优势与限制：
    - 开源格式
    - 压缩效率高
    - 支持透明视频（Alpha 通道）
3. OGG (.ogv)	
   浏览器支持情况: 较旧的浏览器支持（现代浏览器支持较少）。	
   优势与限制：
    - 开源格式  
    - 文件体积更小，但兼容性较差

总结：
首选格式：MP4（高兼容性） + WebM（透明效果）。
根据项目需求选择合适的格式，尽量避免使用 OGG。
确保服务器支持正确的 MIME 类型，避免视频加载问题（例如 MP4: video/mp4，WebM: video/webm）。


### 39. phaser定时器this.time.addEvent()
```js
// 创建一个定时器，每隔 2 秒触发
const timer1 = this.time.addEvent({
    delay: 2000, // 2 秒
    loop: true,   // 循环执行
    callback: () => {
        // 每次触发时创建一个 tween 动画
        this.tweens.add({
            targets: btn_nextLevel,
            scale: btn_nextLevel.scale * 0.7, // 按下时缩小
            ease: 'Cubic.easeInOut',   // 使用平滑的缓动曲线
            duration: 80,             // 缩小动画时间
            yoyo: true,               // 回弹到原始大小
            repeat: 0,                // 不重复
            onComplete: () => {
                // 第二段弹跳效果，增加丝滑感
                this.tweens.add({
                    targets: btn_nextLevel,
                    scale: btn_nextLevel.scale * 1.05, // 稍微放大
                    ease: 'Sine.easeInOut',       // 自然的减速效果
                    duration: 100,             // 放大动画时间
                    yoyo: true,                // 再回弹到原始大小
                    repeat: 0,                  // 不重复
                });
            }
        });
    }
});

// 移除当前场景中通过 this.time.addEvent() 创建的所有计时器事件（定时器）
// 常见用途：游戏结束时清理所有定时器；场景切换前清理；防止重复生成敌人、道具、障碍物等。
this.time.removeAllEvents();

this.timer1.remove(); // 移除指定的定时器事件timer1

```


### 40. 精灵图大小
1. 精灵图大小的考虑因素
（1）目标设备
移动设备：精灵图大小通常控制在 256 KB - 1 MB 之间。移动设备的内存和处理能力有限，尽量避免过大的精灵图。
PC 和主机：可以适当增大精灵图的大小，但最好不要超过 2 MB，以免加载时间过长或占用过多内存。
（2）纹理尺寸
常见的精灵图分辨率为 512x512、1024x1024、2048x2048，少数高端设备支持 4096x4096。
更大的纹理虽然可以包含更多帧，但会增加显存占用，尤其是在低端设备上可能导致性能问题。
（3）图像格式
PNG：常用于需要透明背景的精灵图，质量高但文件较大。
JPEG：用于不需要透明度的背景图，文件大小较小但质量可能略低。
压缩格式（PVR、ETC、ASTC）：适合移动设备，可大幅度减小文件大小，同时提升运行效率。
（4）帧数和动画复杂度
动画帧数越多，精灵图越大。可以考虑将精灵图拆分为多个小图集，按需加载。
2. 精灵图大小的推荐范围
小型精灵图（UI 图标、简单动画）
文件大小：50 KB - 300 KB
尺寸：256x256 或 512x512
适用场景：按钮、图标、小型角色动画。
中型精灵图（一般角色动画、多帧精灵）
文件大小：300 KB - 1 MB
尺寸：1024x1024
适用场景：主角动画、场景物件。
大型精灵图（复杂场景、多个动画帧）
文件大小：1 MB - 2 MB
尺寸：2048x2048 或更大
适用场景：场景背景、复杂角色动画。


### 41. 位图遮罩Phaser.Display.Masks.BitmapMask()
遮罩对象中不透明的部分才会显示目标对象
```js

const bunny = this.make.sprite({
    x: this.centerX,
    y: this.centerY,
    key: 'bunny',
    add: true,
});

// 创建容器
this.rootContainer = this.make.container({
    x: this.centerX,
    y: this.centerY,
    add: false,
});

 /* Phaser.Display.Masks.BitmapMask(): 
        它是 Phaser 中的一种遮罩类型--位图遮罩，用于基于另一个对象（如图像或容器）的像素透明度创建遮罩。
        遮罩的效果是：只有遮罩对象中不透明的部分才会显示目标对象（bunny） */
const Imgmask = new Phaser.Display.Masks.BitmapMask(this, this.rootContainer);
bunny.setMask(Imgmask); // 给bunny设置位图遮罩， this.rootContainer中不透明的地方才显示bunny

// rootContainer添加image
const image1 = this.make.image({  
    x: 0, 
    y: 0,
    key: 'arrow',
    add: true,
});
this.rootContainer.add(image1); 
```


### 42. 检测键盘上下左右的按键触发
```js
/* this.input.keyboard.createCursorKeys() 是一种便捷的方式，用于创建光标键（方向键）输入的快捷映射。
    通过 cursors 对象，可以轻松检测用户是否按下了上下左右键，并实现响应逻辑。 */
const cursors = this.input.keyboard.createCursorKeys();


// 检查光标键输入并移动玩家
if (cursors.left.isDown) {
    this.player.x -= 5; // 向左移动
} else if (cursors.right.isDown) {
    this.player.x += 5; // 向右移动
}

if (cursors.up.isDown) {
    this.player.y -= 5; // 向上移动
} else if (cursors.down.isDown) {
    this.player.y += 5; // 向下移动
}


// 自定义键 
const key_Q = this.input.keyboard.addKeys(Phaser.Input.Keyboard.KeyCodes.Q);

this.keys = this.input.keyboard.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    S: Phaser.Input.Keyboard.KeyCodes.S,
    D: Phaser.Input.Keyboard.KeyCodes.D
});

if (this.keys.W.isDown) {
    this.player.y -= 5; // 向上
}

```

### 43. 使用dat.gui插件的控制面板对游戏参数进行控制
安装dat.gui: npm i dat.gui
使用：
```js
import Phaser from 'phaser';
import * as dat from 'dat.gui';

class ContainerAndCameraZoom extends Phaser.Scene {
   constructor() {
      super('ContainerAndCameraZoom')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('lemming', 'assets/sprites/lemming.png');

   }
   create() {
    this.cameras.main.zoom = 0.5; // 视角缩小0.5

    const container = this.add.container(400, 300);

    const sprite0 = this.add.image(0, 0, 'lemming');
    const sprite1 = this.add.image(-100, -100, 'lemming');
    const sprite2 = this.add.sprite(100, -100, 'lemming');
    const sprite3 = this.add.sprite(100, 100, 'lemming');
    const sprite4 = this.add.sprite(-100, 100, 'lemming');
    container.add([sprite0, sprite1, sprite2, sprite3, sprite4]);

    this.tweens.add({
        targets: container,
        angle: 360,
        duration: 6000,
        yoyo: true,
        repeat: -1,
    });


    /* this.input.keyboard.createCursorKeys()，
     是一种便捷的方式，用于创建光标键（方向键）输入的快捷映射。通过 cursors 对象，可以轻松检测用户是否按下了上下左右键，并实现响应逻辑。
    自定义按键：this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)  
    */
    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q), // Q键控制缩小
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),// E键控制放大
        acceleration: 0.06, // 加速度
        drag: 0.0005,       // 阻力
        maxSpeed: 1.0       // 最大速度
    };

    /* 在 Phaser 3 中，Phaser.Cameras.Controls.SmoothedKeyControl 是一种内置的摄像机控制工具，用于实现平滑的摄像机移动、缩放等功能。
    通过配置 controlConfig，可以指定键盘输入控制摄像机的行为，例如方向键移动摄像机，Q 和 E 键缩放视图。 */
    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);


    
// 添加gui控制面板
    const gui = new dat.GUI();

    const cam = this.cameras.main;
    const help = {
        line1: 'Cursors to move',
        line2: 'Q and E to zoom',
    };

    // 在调试面板中创建一个名为 Camera_1 的文件夹
    const f1 = gui.addFolder('Camera_1');

    /* 在文件夹 f1 中添加一个滑块或输入框，用于显示和调试 cam 对象的 x 属性; .listen()使控件实时监听 cam.x 的变化，并动态更新界面上的值；
     在 dat.GUI 中，滑块和输入框(选中鼠标上下移动改变值)的默认行为是同时存在。当属性设置了 min 和 max 以及 step，dat.GUI 自动会在界面上生成滑块和输入框 */
    f1.add(cam, 'x', -400, 400).listen();  // 监听摄像机的位置(x, y)
    f1.add(cam, 'y').listen();
    f1.add(cam, 'scrollX').listen(); //scrollX 属性表示 摄像机在 X 轴上的滚动偏移，即摄像机的水平位置
    f1.add(cam, 'scrollY').listen();
    f1.add(cam, 'rotation').min(0).step(0.01).listen(); //rotation控制摄像机的旋转角度；设置控件的最小值为 0, 控件的步进值为 0.01
    f1.add(cam, 'zoom', 0.1, 2).step(0.1).listen(); //设置控件的最小值为 0.1，最大值为 2
    f1.add(help, 'line1'); 
    f1.add(help, 'line2'); 

    f1.open(); // 默认控制面板展开


   }
   update(time, delta) {
        // 每一帧更新摄像机控制器
        this.controls.update(delta);
   }
};

export default ContainerAndCameraZoom;
```


### 44. 游戏音效优化
1. 音效文件优化
- 使用合适的音频格式:
优先使用 Web-friendly 格式：
推荐：OGG（高质量压缩，支持循环）、MP3（广泛兼容）。
备用：WAV（高质量，但文件较大）。
在游戏中为不同设备提供多种格式以确保兼容性：
```json
{
  "sounds": [
    { "key": "effect", "url": ["effect.ogg", "effect.mp3"] }
  ]
}
```

- 压缩音频文件:
使用音频编辑工具（如 Audacity）降低采样率或比特率：
采样率：22 kHz 或 44 kHz 通常足够。
比特率：128 kbps 是良好的平衡点。
通过删除音频中的静音片段或使用循环缩短音频长度。

2. 音效加载与管理
预加载音效:
使用 Phaser 的 this.load.audio 在场景加载阶段加载音效，避免运行时加载音效引发的延迟。
```js
this.load.audio('bgm', ['bgm.ogg', 'bgm.mp3']);
this.load.audio('click', ['click.ogg', 'click.mp3']);
```
复用音频对象:
避免多次加载相同的音效，使用音频池复用音效对象。

3. 调整音效参数
设置合理的音量
控制全局音量或单个音频的音量：
```js
const sound = this.sound.add('effect');
sound.setVolume(0.5); // 设置为 50%
sound.play();
```

添加淡入淡出效果:
在切换场景或停止背景音乐时添加音量渐变：
```js
this.tweens.add({
    targets: sound,
    volume: 0,
    duration: 1000, // 1 秒淡出
    onComplete: () => sound.stop(),
});
```

控制并发播放
限制同一音效的并发播放次数，避免重叠音效导致的噪音：
```js
if (!this.sound.get('effect')) {
    this.sound.play('effect');
}
```

4. 使用音频精灵
合并多个小音效到一个文件中，通过音频精灵播放不同的片段，减少加载请求数：
```js
this.load.audioSprite('sfx', 'sfx.json', ['sfx.ogg', 'sfx.mp3']);

const sound = this.sound.addAudioSprite('sfx');
sound.play('shot');
```

5. 优化音频循环
确保背景音乐无缝循环：
```js
const bgm = this.sound.add('bgm', { loop: true });
bgm.play();
```
在音频编辑工具中设置无缝循环的起点和终点，或通过 Phaser 的 seek 属性手动控制。

6. 处理延迟与性能
音频解码延迟:
使用 Phaser 的 decodeAudio 提前解码音效：
```js 
this.sound.decodeAudio('bgm');
/* 
Phaser 会在音频加载后自动处理解码，如果你手动调用 decodeAudio，可能会重复触发解码逻辑，从而导致错误。
解决方法: 检查是否需要手动解码音频。如果音频已经可以正常播放，可以省略调用 decodeAudio。
*/
```
降低设备性能消耗:
避免频繁的音效播放，例如快速点击的按钮音效。
使用 Phaser 的 AudioContext 设置优化播放：
```js
this.sound.context.resume(); // 恢复或启用音频上下文
```

7. 多平台适配
在移动端测试音效播放，因为部分浏览器（如 iOS Safari）需要用户交互后才能播放音效。
使用 Phaser 的 unlock 方法确保移动端音频兼容性：
```js
this.sound.unlock();
```

8. 监控与调试
使用 Phaser 的音频调试工具检查音频播放状态：
```js
console.log(this.sound.sounds); // 输出当前加载的音频
```
在游戏开发和测试阶段，关注音效是否播放正常、是否存在音质问题或明显延迟。

通过这些方法，您可以优化 Phaser 3 游戏中的音效性能，同时提升音频的整体质量和用户体验。

### 45. 设置音量拖拽或点击修改音量
```js
// 设置弹窗内元素
    scene.addSettingDialogItems = () => {
        // 获取最新音量值
        scene.sounds_value = scene.registry.get('sounds_value'); // 声音值
        scene.music_value = scene.registry.get('music_value');  // 音乐值
        scene.msg_state_value = scene.registry.get('msg_state_value');  // 音乐值
        
        const dialogElements = [scene.overlay, scene.dialog];  //// 创建一个数组来保存弹窗内元素, 存放弹窗背景及遮罩层
        const text = [];
        const imgs = [];

        /* 弹窗中心坐标(scene.dialog.x, scene.dialog.y)
        弹窗方框中心坐标(scene.dialog.x, scene.dialog.y + 44)
        弹窗左上角坐标(scene.dialog.x - scene.dialog.displayWidth/2, scene.dialog.y + 44 - 628/2)
        */
        // scene.dialog.height显示原始元素高度, scene.dialog.displayHeight显示缩放后元素高度

        // 容器container坐标(scene.centerX, scene.centerY)
        const title = scene.addText(0, scene.dialog.y - scene.dialog.displayHeight / 2 + 44 * scene.scaleX, '设置', 'Douyin Sans', 'blod', 32 * scene.scaleX, 38,'#2A3853','', 0.5, 0.5, 3)
        text.push(title);
        const closeBtn = scene.add.image(scene.dialog.x + scene.dialog.displayWidth / 2 - 50* scene.scaleX, scene.dialog.y + (44 - 512/2 + 32) * scene.scaleX , 'close_btn').setScale(0.5 * scene.scaleX);
        closeBtn.setInteractive();
        

        /* 声音 */ 
        imgs[0] = scene.add.image(scene.dialog.x - scene.dialog.displayWidth/2 + 132 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 80 + 32) * scene.scaleX, 'icon_sounds').setScale(0.5 * scene.scaleX);
        const text1 = scene.addText(scene.dialog.x - scene.dialog.displayWidth/2 + 198 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 80 + 32) * scene.scaleX, '声音', 'Douyin Sans', 'blod', 28* scene.scaleX, 33, '#3E6698', '',0, 0.5, 1);
        text.push(text1);
        // 音量条绘制
        const xBar1 = scene.dialog.x - scene.dialog.displayWidth/2 + 334  * scene.scaleX;
        const yBar1 = scene.dialog.y + (44 - 512/2 + 86) * scene.scaleX;
        const {points: soundPoints, adjustPoint: soundAdjustPoint , adjustBar: soundBar, points_value: sound_points_value} = createAdjustBar(scene, text, xBar1, yBar1, scene.sounds_value);
        soundAdjustPoint.name = 'soundAdjustPoint'; // 用于识别拖拽gameObject.name
        soundBar.name = 'soundBar'; 
        /* 音乐 */
        imgs[1] = scene.add.image(scene.dialog.x - scene.dialog.displayWidth/2 + 132 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 204 + 32) * scene.scaleX, 'icon_music').setScale(0.5 * scene.scaleX);
        const text2 = scene.addText(scene.dialog.x - scene.dialog.displayWidth/2 + 198 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 204 + 32) * scene.scaleX, '音乐', 'Douyin Sans', 'blod', 28* scene.scaleX, 33, '#3E6698', '',0, 0.5, 1);
        text.push(text2);
        // 音量条绘制
        const xBar2 = scene.dialog.x - scene.dialog.displayWidth/2 + 334  * scene.scaleX;
        const yBar2 = scene.dialog.y + (44 - 512/2 + 210) * scene.scaleX;
        const {points: musicPoints,adjustPoint: musicAdjustPoint , adjustBar: musicBar, points_value: music_points_value} = createAdjustBar(scene, text, xBar2, yBar2, scene.music_value);
        musicAdjustPoint.name = 'musicAdjustPoint';
        musicBar.name = 'musicBar';
        
        // 设置拖拽音量调节点
        scene.input.on('drag', (pointer, gameObject, dragX) => {

            if(gameObject.name === 'soundAdjustPoint') {
                const minDragX = sound_points_value[0].x; // 第一个点的x坐标
                const maxDragX = sound_points_value[17].x; // 最后一个点的x坐标
                dragX = Phaser.Math.Clamp(dragX, minDragX, maxDragX); // 拖拽位置限制最大值最小值

                // 遍历sound_points_value，获取拖拽后音量调节点的最终位置
                for (let i = 0; i < sound_points_value.length; i++) {
                    if( i < sound_points_value.length -1 && dragX >= sound_points_value[i].x && dragX < sound_points_value[i+1].x) {                    
                        gameObject.x = sound_points_value[i].x; // 设置 gameObject 的最终x位置
                        const currentValue = sound_points_value[i].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey

                    } else if (dragX >= sound_points_value[sound_points_value.length - 1].x) {
                        gameObject.x = sound_points_value[sound_points_value.length - 1].x; // 设置 gameObject 的最终x位置
                        const currentValue = sound_points_value[sound_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
                
            } else if (gameObject.name === 'musicAdjustPoint') {
                const minDragX = music_points_value[0].x; // 第一个点的x坐标
                const maxDragX = music_points_value[17].x; // 最后一个点的x坐标
                dragX = Phaser.Math.Clamp(dragX, minDragX, maxDragX); // 拖拽位置限制最大值最小值

                for (let i = 0; i < music_points_value.length; i++) {
                    if (i < music_points_value.length -1 && dragX >= music_points_value[i].x && dragX < music_points_value[i+1].x) {
                        gameObject.x = music_points_value[i].x; // 设置 gameObject 的最终x位置
                        const currentValue = music_points_value[i].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey

                    } else if (dragX >= music_points_value[music_points_value.length - 1].x) {
                        gameObject.x = music_points_value[music_points_value.length - 1].x; // 设置 gameObject 的最终x位置
                        const currentValue = music_points_value[music_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
                
            };
            

        });

        // 设置点击移动音量调节点
        scene.input.on('pointerdown', (pointer) => {
            
            // 鼠标点击位置
            const clickX = pointer.x - scene.centerX; // 相对容器的坐标
            const clickY = pointer.y - scene.centerY;

            // 检查点击是否在音量点的范围内, x范围为第一个点x到最后一个点的x, y范围为各音量条的宽度
            const minClickX = sound_points_value[0].x - 15 *scene.scaleX; // 第一个点的x坐标前一点
            const maxClickX = sound_points_value[17].x + 15 *scene.scaleX; // 最后一个点的x坐标后一点
            // 声音的音量宽度
            const minClickY1 = yBar1;
            const maxClickY1 = yBar1 + 53 * scene.scaleX;  // 音量条宽53
            // 音乐的音量宽度
            const minClickY2 = yBar2;
            const maxClickY2 = yBar2 + 53 * scene.scaleX;  // 音量条宽53

            // 点击在声音调节点的范围内，音量修改
            if(clickX >= minClickX && clickX <= maxClickX && clickY >= minClickY1 && clickY <= maxClickY1) {
                for (let i = 0; i < sound_points_value.length; i++) {
                    if (i < sound_points_value.length -1 && clickX >= sound_points_value[i].x && clickX < sound_points_value[i+1].x) {
                        const soundAdjustPoint_x = sound_points_value[i].x; // 设置 调节点 的最终x位置
                        const soundAdjustPoint_y = sound_points_value[i].y; // 设置 调节点 的最终y位置

                        soundAdjustPoint.clear();  // 清除原来的图形
                        soundAdjustPoint.setPosition(soundAdjustPoint_x , soundAdjustPoint_y);  // 设置位置
                        soundAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        soundAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = sound_points_value[i].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey

                    } else if (clickX >= sound_points_value[sound_points_value.length - 1].x) {
                        const soundAdjustPoint_x  = sound_points_value[sound_points_value.length - 1].x; 
                        const soundAdjustPoint_y  = sound_points_value[sound_points_value.length - 1].y; 

                        soundAdjustPoint.clear();  // 清除原来的图形
                        soundAdjustPoint.setPosition(soundAdjustPoint_x , soundAdjustPoint_y);  // 设置位置
                        soundAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        soundAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = sound_points_value[sound_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
            } else if(clickX >= minClickX && clickX <= maxClickX && clickY >= minClickY2 && clickY <= maxClickY2) {
                // 点击在音乐调节点的范围内，音量修改
                for (let i = 0; i < music_points_value.length; i++) {
                    if (i < music_points_value.length -1 && clickX >= music_points_value[i].x && clickX < music_points_value[i+1].x) {
                        const musicAdjustPoint_x = music_points_value[i].x; // 设置 调节点 的最终x位置
                        const musicAdjustPoint_y = music_points_value[i].y; // 设置 调节点 的最终y位置

                        musicAdjustPoint.clear();  // 清除原来的图形
                        musicAdjustPoint.setPosition(musicAdjustPoint_x , musicAdjustPoint_y);  // 设置位置
                        musicAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        musicAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = music_points_value[i].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey

                    } else if (clickX >= music_points_value[music_points_value.length - 1].x) {
                        const musicAdjustPoint_x  = music_points_value[music_points_value.length - 1].x; 
                        const musicAdjustPoint_y  = music_points_value[music_points_value.length - 1].y; 
                        
                        musicAdjustPoint.clear();  // 清除原来的图形
                        musicAdjustPoint.setPosition(musicAdjustPoint_x , musicAdjustPoint_y);  // 设置位置
                        musicAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        musicAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = music_points_value[music_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
            }

        });



        /* 通知 */
        imgs[2] = scene.add.image(scene.dialog.x - scene.dialog.displayWidth/2 + 132 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 328 + 32) * scene.scaleX, 'icon_msg').setScale(0.5 * scene.scaleX);
        const text3 = scene.addText(scene.dialog.x - scene.dialog.displayWidth/2 + 198 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 328 + 32) * scene.scaleX, '通知', 'Douyin Sans', 'blod', 28* scene.scaleX, 33, '#3E6698', '',0, 0.5, 1);
        text.push(text3);
        const msg_state = scene.add.image(scene.dialog.x + scene.dialog.displayWidth/2 - 170 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 328 + 32) * scene.scaleX, 'icon_msg_open').setScale(0.5 * scene.scaleX);
        msg_state.setInteractive();
        if(scene.registry.get('msg_state_value')) {
            msg_state.setTexture('icon_msg_open');
            scene.registry.set('msg_state_value', true)
        } else {
            msg_state.setTexture('icon_msg_close');
            scene.registry.set('msg_state_value', false)
        }

        // 保存弹窗元素
        dialogElements.push( imgs, soundBar, soundPoints, soundAdjustPoint,  musicBar, musicPoints, musicAdjustPoint, closeBtn, msg_state, text);
        
        /* 通知按钮事件 */
        msg_state.on('pointerover', () => {
            scene.input.setDefaultCursor('pointer');
        });
        msg_state.on('pointerout', () => {
            scene.input.setDefaultCursor('default');
        });
        msg_state.on('pointerup', () => {
            // 切换图标
            if (scene.registry.get('msg_state_value')) {
                msg_state.setTexture('icon_msg_close');
                scene.registry.set('msg_state_value', false)
            } else {
                msg_state.setTexture('icon_msg_open');
                scene.registry.set('msg_state_value', true)
            };
        });


        /* 关闭弹窗按钮事件 */
        createButton(scene, closeBtn, undefined, undefined, undefined, () => {
            hideDialog(dialogElements, scene.coverdInteractiveItems);  // 隐藏弹窗

            if(!scene.isTimerRunning && scene.resumeTimer) {
                scene.resumeTimer(); //继续计时
            };
        });


        
        

        return dialogElements;
        
    } 


=============

/**  创建音量调节条
 * @param {Phaser.Scene} scene - 当前场景
 * @param {array} text - 文本
 * @param {number} xBar - 音量条x坐标
 * @param {number} yBar - 音量条y坐标
 * @param {number} defaultValue - 音量大小
 */

const createAdjustBar = (scene,text, xBar, yBar, defaultValue) => {

      // 绘制音量条
      const adjustBar = scene.add.graphics();
      adjustBar.fillStyle(0x308CF4);
      adjustBar.fillRoundedRect(xBar, yBar, 606 * scene.scaleX, 53 * scene.scaleX, 20 * scene.scaleX);
      text.push(scene.addText(xBar + 36 * scene.scaleX, yBar + 26 * scene.scaleX, '关', 'Douyin Sans', 'blod', 24* scene.scaleX, 28, '#FFFFFF', '',0, 0.5, 1));
      text.push(scene.addText(xBar + 546 * scene.scaleX, yBar + 26 * scene.scaleX, '开', 'Douyin Sans', 'blod', 24* scene.scaleX, 28, '#FFFFFF', '',0, 0.5, 1));
      
      // 绘制音量调节点
      const points = [];  // 存放音量点
      const points_value = [];  // 存放音量数据

      const spacing = 24; // 点之间的水平间距
      for (let i = 0; i < 18; i++) {
        const x = xBar + (84 + spacing * i + 6) * scene.scaleX;
        const y = yBar + 26 * scene.scaleX;

        const point = scene.add.graphics();
        point.setPosition(x, y); // 图形默认坐标是(0, 0), setPosition()设置图形实际坐标
        point.fillStyle(0x69BAFF, 1);
        point.fillCircle(0, 0, 3 * scene.scaleX);

        points_value[i] = {
            point: point,
            x: x,
            y: y,
            value: i
        };

         points.push(point);
      };

      // 创建可拖拽调节点
      const point_value = points_value.find(item => item.value === defaultValue);  // 获取对应音量的音量点数据
      const adjustPoint_x = point_value.x;
      const adjustPoint_y = point_value.y;

      const adjustPoint = scene.add.graphics();
      adjustPoint.setPosition( adjustPoint_x , adjustPoint_y); // 图形默认坐标是(0, 0), setPosition()设置图形实际坐标
      adjustPoint.fillStyle(0xFFFFFF, 1);
      adjustPoint.fillCircle(0, 0, 18 * scene.scaleX);
      
     // 设置互动
      adjustPoint.setInteractive(new Phaser.Geom.Circle(0, 0, 18 * scene.scaleX), Phaser.Geom.Circle.Contains);
      scene.input.setDraggable(adjustPoint); // 启用拖拽
      createButton(scene, adjustPoint, () => {}, () => {}, undefined, undefined);

    


      return {adjustBar, points, adjustPoint, points_value};
};
```


### 46. phaser设置中，自动匹配设备屏幕分辨率
```js
const dpr = window.devicePixelRatio || 1; //设备像素比 (DPR)
let width = window.innerWidth * dpr; //画布按 DPR 放大
let height = window.innerHeight * dpr;


const config = {
    type:Phaser.AUTO, // 自动尝试WebGL，否则退回到Canvas
    resolution: window.devicePixelRatio,
    scale: {
        width: width,  // 设置游戏画布的宽度
        height: height, // 设置游戏画布的高度
        autoCenter: Scale.CENTER_BOTH, // 设置游戏画布居中
        mode: Phaser.Scale.FIT, // 让画布自动适配屏幕
        resolution: window.devicePixelRatio // 自动匹配屏幕分辨率
    },
    backgroundColor: '#73B7FF',  // 画布背景
    scene: [ //游戏的具体场景
        GameBeginScene,  // 开始
        LoadingScene, // 加载
        LevelScene,  // 关卡选择
        Level_01, // 第一关
        Level_02, // 第二关
        Level_03, // 第二关
    ],
    physics:{ // 开启游戏物理引擎，不然物理环境不会生效，分别是arcade\impact\matter
        default:"arcade",//默认arcade
        arcade:{
            debug:false //开启调试模式，如果开启了，就会给每隔元素加上边框，还有移动的方向
        }
    }
}
// 定义初始化游戏方法
const startGame = (parent) => {
    game = new Phaser.Game({...config, parent});
    return game;
};

```


### 47. 在 Web 端 UI 适配到手机端 时，不一定要完全换掉 UI，但通常需要 调整布局、交互方式、字体大小等 以适应小屏幕。这里有几种处理方式：
#### **1. 响应式 UI 适配（推荐）**
✅ 适用于： 不想换 UI，但希望自动适配 不同分辨率。
🔹 方法： 使用 Phaser.Scale.FIT + setDisplaySize() 让 UI 自动适应屏幕，不变形。
```js
const config = {
    type: Phaser.AUTO,
    width: 1920, // Web 端分辨率
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT, // 让 UI 自动缩放
        autoCenter: Phaser.Scale.CENTER_BOTH // 居中
    },
    scene: MyScene
};

```
📌 适配效果：
PC 端 UI 直接缩小到手机屏幕大小，不变形。
适用于简单 UI，如按钮、对话框、得分面板。
⚠ 但 UI 可能过小，交互不便，可以结合 setScale() 调整大小：`button.setScale(this.scaleX * 1.5); // 手机端按钮放大
`

#### **2. 移动端独立 UI 方案**
✅ 适用于： 需要 完全不同 UI 的情况，比如 Web 端是横屏，手机端是竖屏。
🔹 方法： 在 create() 里 判断屏幕宽高，加载不同 UI。
```js
create() {
    if (this.scale.width < this.scale.height) {
        // 竖屏（手机）
        this.loadMobileUI();
    } else {
        // 横屏（PC）
        this.loadPCUI();
    }
}

loadMobileUI() {
    this.add.image(this.centerX, this.centerY, 'mobilePanel').setScale(this.scaleX);
    this.add.text(this.centerX, this.centerY - 100, "手机端UI", { fontSize: '24px', fill: '#fff' });
}

loadPCUI() {
    this.add.image(this.centerX, this.centerY, 'pcPanel').setScale(this.scaleX);
    this.add.text(this.centerX, this.centerY - 100, "PC端UI", { fontSize: '32px', fill: '#fff' });
}

```
📌 适配效果：
手机端和 PC 端使用不同 UI 资源（可以用不同的图片、按钮）。
适用于复杂 UI，如菜单、HUD、面板等。

#### **3. 交互方式适配**
🔹 触摸 vs 鼠标

Web 端一般用 pointerdown (鼠标点击)。
手机端用 pointerdown (触摸)，但有些 UI 可能需要 touchMove（比如滑动调整音量）。
🎯 解决方案：
```js
this.input.on('pointerdown', (pointer) => {
    if (this.scale.width < this.scale.height) {
        console.log("手机端点击");
    } else {
        console.log("PC端点击");
    }
});

```

#### **4. 适配 UI 细节**
📌 适配字体大小
```js
const fontSize = this.scale.width < this.scale.height ? 24 : 32;
this.add.text(100, 100, "适配文本", { fontSize: `${fontSize}px`, fill: "#fff" });

```
📌 适配按钮大小
```js
const buttonScale = this.scale.width < this.scale.height ? 1.5 : 1;
button.setScale(buttonScale);

```

#### **🎯 最佳方案（总结）**
| 方案 | 适用场景 | 需要换 UI? | 推荐度 |
|------|---------|---------|------|
| **Phaser.Scale.FIT** | 适配整个 UI | ❌ 否 | ⭐⭐⭐⭐ |
| **加载不同 UI 资源** | 需要完全不同 UI | ✅ 是 | ⭐⭐⭐⭐⭐ |
| **触摸 vs 鼠标适配** | 交互方式不同 | ❌ 否 | ⭐⭐⭐⭐ |
| **字体、按钮大小适配** | 适配 UI 细节 | ❌ 否 | ⭐⭐⭐⭐⭐ |

🚀 **如果 UI 差别不大，建议用 `Phaser.Scale.FIT` + `setScale()` 适配**  
📱 **如果 PC 和手机端 UI 差异大，就加载不同 UI**

### 48. 使用对象存放本地资源时，资源assets放在public下，路径才能直接写assets开头
```js
const preloadSceneAssets = {
    

    'texture1': 'assets/images/textures/atlas.png',
    'texture1_JSON': 'assets/images/textures/atlas.json',

    'flappy_font_png': 'assets/fonts/flappyfont.png',
    'flappy_font_fnt': 'assets/fonts/flappyfont.fnt',

    'fly_sound': ['assets/audio/wing.ogg', 'assets/audio/wing.mp3'],
    'score_sound': ['assets/audio/point.ogg', 'assets/audio/point.mp3'],
    'hit_pipe_sound':  ['assets/audio/hit.ogg', 'assets/audio/hit.mp3'],
    'hit_ground_sound': ['assets/audio/die.ogg', 'assets/audio/die.mp3'],
    'swooshing': ['assets/audio/swooshing.ogg', 'assets/audio/swooshing.mp3'],
   
    'score_board': 'assets/images/scoreboard.png',
    'medals': 'assets/images/medals.png',


};

export default preloadSceneAssets;

```


### 49. 注意渲染尺寸和逻辑尺寸的使用，举例子：绘制进度条，使用渲染尺寸绘制
逻辑尺寸：
this.sys.game.canvas.width === this.scale.width === this.sys.scale.canvas.width

渲染尺寸：

```js
// canvas尺寸自适应, 调整的是canvas的渲染尺寸（CSS 大小）
const handleResize = () => {
    const canvas = document.querySelector('canvas');
    const windowWidth = window.innerWidth; // 窗口视口宽度
    const windowHeight = window.innerHeight;// 窗口视口高度
    const gameRatio = config.width / config.height; // canvas宽高比

    // 若窗口宽大于高，canvas以高为标准; 否则以宽为标准
    if(windowWidth > windowHeight) {
        // 以高度优先
        canvas.style.height = '100%';  // canvas高度占100%
        canvas.style.width = windowHeight * gameRatio + 'px';  
    } else {
        // 宽度优先
        canvas.style.width = '100%';
        canvas.style.height = windowWidth / gameRatio + "px";  
    }
};
```

有handleResize，就不用 mode: Phaser.Scale.FIT了
```js
const config = {
    type:Phaser.AUTO, 
    width:288,// 游戏界面宽
    height:505, //游戏界面高
    // scale: {
    //     mode: Phaser.Scale.FIT, // 让游戏自适应屏幕, 自动调整 canvas 的大小，确保游戏填充窗口，不会有黑边 ,会调整逻辑尺寸this.scale.width/height)
    //     autoCenter: Phaser.Scale.CENTER_BOTH, // 居中显示
    // },
    // zoom: 2, // 仅影响渲染尺寸，适用于像素风格、高清缩放, 逻辑尺寸不变
    background: '#1f1f1f',
    scene: scenes,
    physics:{ // 开启游戏物理引擎，
        default:"arcade",//默认arcade
        arcade:{
            gravity:{ //重力加速度 单位px/s
                y:500 
            },
            debug:false //开启调试模式，如果开启了，就会给每隔元素加上边框，还有移动的方向
        }
    }
}



```

```js
preload() {
        this.drawProgress(); // 绘制加载进度条

        this.load.atlas('texture1', preloadSceneAssets['texture1'], preloadSceneAssets['texture1_JSON']);
        this.load.bitmapFont('flappy_font', preloadSceneAssets['flappy_font_png'],preloadSceneAssets['flappy_font_fnt']);

        //飞翔的音效
        this.load.audio("fly_sound", preloadSceneAssets['fly_sound']);
        //得分的音效
        this.load.audio("score_sound", preloadSceneAssets['score_sound']);
        //撞击管道的音效
        this.load.audio("hit_pipe_sound",preloadSceneAssets['hit_pipe_sound']);
        //撞击地面的音效
        this.load.audio("hit_ground_sound", preloadSceneAssets['hit_ground_sound']);
        //切换场景声效
        this.load.audio("swooshing", preloadSceneAssets['swooshing']);

        // 得分板
        this.load.image('score_board', preloadSceneAssets['score_board']);
        this.load.spritesheet('medals', preloadSceneAssets['medals'], {
            frameWidth: 44, frameHeight: 46
        }); 
   }
   create() {

        console.log('this.sys.game.canvas.width',this.sys.game.canvas.width); // 288
        console.log('this.sys.game.canvas.height',this.sys.game.canvas.height); // 505
        console.log('this.scale.width',this.scale.width);// 288
        console.log('this.scale.height',this.scale.height);// 505
        console.log('this.sys.scale.canvas.width',this.sys.scale.canvas.width);// 288
        console.log('this.sys.scale.canvas.height',this.sys.scale.canvas.height);// 505


        console.log('this',this);
        this.scene.start('MenuScene');
   }
   update() {

   }


    // 绘制实时进度条
    drawProgress() {
    /* 
    逻辑尺寸：this.scale.width/height
    渲染尺寸：this.sys.game.canvas.width/height

    要调整 Phaser 里的物体位置,用逻辑尺寸，用 this.scale.width；
    如果要调整 canvas 的 CSS 或外观，用渲染尺寸 this.sys.game.canvas.width。
    */

    // this.sys 是 Phaser.Scenes.Systems 对象，它存储了当前场景的各种系统信息，包括 canvas、game、scale 等。
    // this.sys.canvas === this.sys.game.canvas，它们指向同一个 canvas 画布

    let {width, height} = this.sys.game.canvas;

    // 进度条坐标
    let x = 50;
    let y = height / 2 - 5;
    // 进度条宽高
    let w = width - 100;
    let h = 10;
    let radius = 5;

    let progress = this.add.graphics();
    progress.setPosition(x, y); // 图形默认坐标是(0, 0), setPosition()设置图形实际坐标

    // 监控load进度事件
    this.load.on('progress', value => {
        progress.clear();
        progress.lineStyle(1, 0xFFFFFF, 1.0); //设置白色边框，1px 宽度，不透明
        progress.fillStyle(0xFFFFFF, 1); // 设置填充颜色为白色，不透明
        progress.strokeRoundedRect(-1, -1, w + 2, h +2, radius);  // 画一个**带圆角的边框**（比进度条略大 1px）
        progress.fillRoundedRect(0, 0 , Math.floor(w * value), h, radius); // 画填充的进度条，宽度随着 `value` 变化
    })
   }

```




### 50. phaser的重叠检测 overlap 和碰撞检测 collider
collider 是“物理碰撞器”，触发回调，产生物理效果（挡住物体、让它不继续穿透）。所以如果碰撞后 destroy() 掉 collider，小鸟就会失去“被地面阻挡”的效果，继续下落或穿透地面。
overlap 是“重叠检测器”，不处理物理碰撞行为，仅仅检测两者是否“重叠”并触发回调，所以销毁只是为了 防止重复触发回调，并不会导致小鸟“穿过去”或者“继续掉下去”。

总结：
collider：检测碰撞 + 处理物理阻挡，适用玩家与地面、墙壁等
overlap：检测重叠（触发器），适用玩家碰金币、敌人等

```js
   // 重叠检测器this.physics.add.overlap(Object1, Object2, callback, null, this) ，this.hitPipe：重叠时触发的回调函数，null：这是检测重叠时的过滤器条件，通常情况下设为 null 表示没有特殊的条件，this：这是回调函数的上下文对象，通常是当前场景或游戏对象
   // 碰撞检测器this.physics.add.collider(Object1, Object2, callback, null, this) ，this.hitGround：碰撞时触发的回调函数，null：这是碰撞回调的过滤器参数，通常可以用来设置碰撞的条件，通常情况下设为 null 表示没有特殊的条件，this：这是回调函数的上下文对象，通常是当前场景或游戏对象
   // overlap 不会触发物理反应（例如推开或弹回），而是用于处理更轻量级的事件，例如触发得分、播放音效等。
   // collider 用于检测需要物理反应的碰撞（例如反弹、停止、推开等），如小鸟与地面的碰撞
   this.physicBirdPipe = this.physics.add.overlap(this.bird, this.pipes, this.hitPipe, null, this);
   this.physicBirdGround = this.physics.add.collider(this.bird, this.ground, this.hitGround, null, this);

  /* -------------------------- */
  // 撞击管道，结束游戏
  hitPipe() {
    if (this.hasHitPipe || this.hasHitGround) return;

    this.hasHitPipe = true; // 标识撞击管道
    this.physicBirdPipe.destroy(); // 重叠检测事件销毁，防止后续重复触发 hitPipe()
    this.stopGame(); // 停止游戏
    this.soundHitPipe.play(); // 播放撞击管道声音
  }
  // 撞击地面，结束游戏
  hitGround() {
    if (this.hasHitGround || this.hasHitPipe) return;

    this.hasHitGround = true;
    //  this.physicBirdGround.destroy(); // 碰撞检测事件销毁，也消除了物理阻挡效果
    this.physicBirdGround.callback = null; // 解绑碰撞回调函数，防止多次触发回调函数
    this.stopGame();
    this.soundHitGround.play();

    /* 注意：
    this.physicBirdGround.destroy();移除了 bird 和 ground 之间的碰撞处理，也移除了物理引擎对两者之间的 阻挡行为！所以，小鸟仍然受重力影响，继续往下掉，而且地面不再“挡住它”，就穿过去了。
    不调用 destroy() 反而能停住，因为碰撞关系还在，物理引擎在持续执行：重力 → bird 往下掉，碰撞处理 → ground 顶住 bird
    正确的做法：
      在回调里，只是把回调解绑，而保留碰撞行为
      this.physicBirdGround.callback = null;
    */
  }

```


### 51. tween 动画未完成前多次点击触发新的tween，会带来哪些问题？导致动画错乱
1. ✅ 重复点击触发多个 tween，导致动画错乱
如果你在 tween 动画未完成之前又点击了交互区域，又再次调用了 blockRise 或 blockDrop，你就创建了多个 tween 动画在控制同一个对象，导致以下问题：
具体表现：
方块动画没跑完就又跑新的动画，会瞬移或乱飞；
动画没跑完状态就被改了（比如 riseBlock 被清空），造成逻辑错乱；
最后 block 的位置和状态是错的；
block_up 和 block_bottom 不同步（位置对不上）；
riseBlock.length 意外变成 2 个（本来应该只能有一个）；
有可能会导致找不到 tableFloorPos[j]，数组越界。

2. ❌ 游戏逻辑冲突：数组状态被修改
在 tween 未完成时再次触发 tableBlocks_calc() 会导致 riseBlock 状态没来得及重置就又被 push 新对象。
比如这种情况：
`riseBlock.push(rise_block);`
但 riseBlock.length !== 0 的前一个操作还没结束。

3. 🧨 onComplete 执行多次，触发回调重复
如果你给 tween 设了 onComplete 回调，比如说执行弹窗、判断下一步流程等——快速点击就可能会触发多次同一个逻辑，导致：
弹窗弹两次；
游戏流程提前执行下一轮；
状态提前解锁等等。

**✅ 怎么解决这种问题？**
- 方法一：添加「动画进行中」锁
```js
if (scene.isMoving) return;

scene.isMoving = true;
tableBlocks_calc(scene, tables, index, riseBlock, () => {
   scene.isMoving = false;  // 动画完成时再解锁
});
```
你可以在 blockDrop 或 blockRise 动画完成时才执行 scene.isMoving = false。

- 方法二：在 tween 创建前先 kill 所有旧 tween（不推荐用于精细交互）
```js
scene.tweens.killTweensOf(block.block_bottom);
```
但是这会让旧动画直接中止，体验上不够平滑，不适合这种有多个动画组合的逻辑。

- 方法三：禁用交互区域
```js
item.disableInteractive();
setTimeout(() => item.setInteractive(), 300); // 动画时间后重新启用
```

📌 总结建议
做法	效果	是否推荐
用 isMoving 锁住操作	简洁稳定	✅ 推荐
tween 前 kill 老动画	会中断动画	⚠️ 不建议
点击后禁用交互元素	控制粒度小	可作为辅助手段


### 52. tween的.pause(),.stop(),.remove()区别,以及tween的销毁情况
口诀：stop() 不杀 tween，complete 会杀 tween（除非 persist）。

this.flyDownTween.stop(); 会立即停止动画并从活跃 tween 列表中移除，但不会销毁 tween 对象本身
只要这个 tween 还没自然播放完成或被手动 remove，即使没有设置 persist: true，依然可以通过 .play() 或 .restart() 重放

* tween 会被销毁的 4 大情况：
1. ✅ tween 自然播放完毕 + 没有设置 persist: true
```js
this.tweens.add({
  targets: this.bird,
  x: 300,
  duration: 1000,
  // 默认 persist: false，播放完就销毁
});
```

2. ✅ 主动调用 .remove() 或 tweenManager.remove(tween)
永远用 .remove() 来销毁 tween，.destroy() 是“浅销毁”，容易出坑，不推荐！
```js
this.flyTween.remove(); // 永久删除，不能再用
```

3. ✅ 所在场景被销毁时（Scene 被切换或销毁）
tween 默认是绑定在场景（TweenManager）上的；
一旦场景销毁，没有手动保存或设置 persist: true 的 tween 会被统一销毁；
Phaser 是这么设计的，为了节省资源

4. ✅ 你用了 tween = null 或 tween 变量被覆盖/回收
虽然这不等同于销毁 tween 本身，但如果你没有引用它，GC（垃圾回收）会清除它；
所以 tween 实际上也“死”了，没法重用了。

* 那 tween 不会被销毁的情况呢？
✅ 调用了 .stop()，只是中止播放，不会销毁；
✅ 调用了 .pause()，只是暂停播放，也不会销毁；
✅ 设置了 persist: true，即使播放完也会保留；
✅ tween 没播放完，被中途打断（比如切场景前你手动 stop），也不会自动销毁。


```js
this.flyTween = this.tweens.add({
      targets: this.bird,
      angle: {
         // Type.tweenData自定义的 getStart 和 getEnd 方法调整angle 属性, Phaser 支持为属性定义 getStart 和 getEnd 方法
         // target:当前动画作用的目标对象（比如一个 Sprite、Image）
         // key:当前动画属性的键名，比如 'x'、'y'、'angle'、'alpha' 等
         // value:目标对象当前该属性的值（也就是 target[key] 的值）
         getStart(target, key, value) {
            let angle = value; // target[key]获取目标对象的 angle 属性值，也就是value
            console.log('angle',angle); // 0度
            
            if (angle <= -45) {
                return -45;  // 逆时针方向，上飞姿态是-45度
            }
            if (angle >= 0) {
                return -45;
            }
            return target[key];
         },
         getEnd() {
               return -45;
         }
      },
      duration: 350,
      onStart: (tween, target) => {
         this.flyDoing = true;  // 飞行状态：true为飞行中

         // 若小鸟下降，则停止下降
         if (this.flyDownTween.isPlaying()) {
             this.flyDownTween.stop();
         }
      },
      onComplete: (tween, target) => {

            if (this.flyDoing) {
                  this.flyDoing = false; // 设置飞行状态为 false，表示飞行结束
                  if (this.flyDownTween.isPlaying()) {
                     this.flyDownTween.stop(); // 如果下降动画正在播放，停止它
                  } else {
                     this.flyDownTween.restart(); // 如果下降动画没有在播放，重新启动它
                  }
            } else {
                  this.flyDownTween.restart(); // 如果没有在飞行，直接重新启动下降动画
            }
      },
      persist: true
});
this.flyDownTween.pause(); // 临时停住动画，比如暂停游戏时
this.flyDownTween.resume(); // 从暂停点继续播放


this.flyDownTween.stop(); // 立即停止动画，并将其从活跃的 tween 列表中移除,但没有销毁，可以 通过 play() 或 restart() 重放，但是要设置persist: true
this.flyDownTween.play(); // 重新播放
this.flyDownTween.restart(); // 重新播放

this.flyDownTween.remove(); // 销毁动画，彻底释放资源，不能再用,再调用 play()、restart() 会报错,常用于：场景切换、对象销毁时，防止内存泄漏

```

### 53. 启动物理引擎后，设置元素物理碰撞区域 .body.setCircle(radius, offsetX, offsetY), .setSize()
```js
// this.physics.add.sprite()创建了一个 带有物理效果的 Sprite, 默认使用 Arcade Physics 物理系统，意味着这个 Sprite 受重力、碰撞等影响
this.bird = this.physics.add.sprite(90, 260, "bird").setDepth(1);

// 任何启用了物理引擎的 Sprite 都会自动拥有 body 属性,它包含了 碰撞体 (hitbox)、速度、加速度、重力等物理属性，让 bird 具备 真实的物理效果（比如重力、碰撞、运动等）
// .setCircle(radius, offsetX, offsetY) 将物体的碰撞区域变成一个圆形, offsetX：X 轴偏移量 (相对于 Sprite 左上角)，offsetY：Y 轴偏移量 (相对于 Sprite 左上角)
this.bird.body.setCircle(13, 2, -2);
/* 
// .setSize(),设置矩形的碰撞区域,phaser3简化了，bird.setSize(34, 24)实际上也是对bird.body.setSize(34, 24)
bird.setSize(34, 24);  // 设置鸟的物理碰撞区域为34px宽，24px高
// .setCircle(radius, offsetX, offsetY), 设置圆形的碰撞区域,offsetX: 可选的水平偏移量，默认值是 0，表示圆心的 x 坐标相对于物体的原点的偏移
this.bird.body.setCircle(13, 2, -2);  // 设置鸟的物理碰撞区域为半径13像素的圆，圆心偏移 (2, -2) 像素
*/

//.setBounce() 的参数：接收一个数值（0 到 1 之间），用于设置物体的反弹系数。 0 表示 没有反弹，物体与其他物体碰撞后会停止,1 表示 完全反弹，物体会反弹回来，保持与碰撞前的速度相同,0.4 就是 部分反弹，物体会反弹回来，但会有一定的减速。
this.bird.setBounce(0.4);

// .setCollideWorldBounds(true) 用于 设置物体与世界边界（canvas 边界）的碰撞行为。防止物体穿出屏幕
this.bird.setCollideWorldBounds(true);

```

### 54. 
### 55. 
### 56. 




# 微信小游戏适配phaser3
使用v3.85.0的phaser.min.js和weapp-phaser3-adapter.js (https://github.com/taliove/weapp-phaser3-adapter的微信小游戏 phaser3 适配解决方案)，
## 报错：“TypeError: document.documentElement.appendChild is not a function at t.exports (http://127.0.0.1:15859/game/js/libs/phaser.min.js:2:148086)”
原因：weapp-phaser3-adapter项目中document.js文件中，设置documentElement:指向 window 对象，模拟了 document.documentElement，而window没有appendChild方法
解决：修改weapp-phaser3-adapter，document.js文件中将`documentElement: window`改为`documentElement: new HTMLElement('html'), // 创建一个模拟的 <html> 元素`

## 微信小程序中只能使用adapter里面的canvas进行绘制
指定canvas:
```js
const config = {
    type: Phaser.CANVAS,
	canvas: canvas, //微信自己的 Canvas 上下文供 Phaser 使用，而不是创建一个
}

new Phaser.Game(config);
```

## 运行后点击无效
解决：phaser的config中新增
```js
input: {
        activePointers: 1,  // 激活的指针数量
        touch: { 
            enabled: true // 启用触摸输入
        }
    }
```



## 无法加载本地图片资源
Phaser 默认使用 Blob 方式加载图片，而微信小游戏不支持 Blob 方式加载本地图片。解决方法：
让 Phaser 直接使用 Image 标签加载:
phaser的config中新增
```js
loader: {
        imageLoadType: "HTMLImageElement" // 让 Phaser 使用 <img> 加载图片
    },
```

## 无法加载atlas图集json文件
微信不允许加载json。
解决办法：把json导出成一个变量，用变量来做atlas
1. levels_buttons_js: atlas图集的json文件改为js文件
```js
const levels_buttons_JSON = {
	"textures": [
		{
			"image": "levels_buttons.png",
			"format": "RGBA8888",
			"size": {
				"w": 864,
				"h": 1710
			},
			"scale": 1,
			"frames": [
				{
					"filename": "中等模式-已解锁",
					"rotated": false,
					"trimmed": false,
					"sourceSize": {
						"w": 430,
						"h": 568
					},
					"spriteSourceSize": {
						"x": 0,
						"y": 0,
						"w": 430,
						"h": 568
					},
					"frame": {
						"x": 1,
						"y": 1,
						"w": 430,
						"h": 568
					},
					"anchor": {
						"x": 0.53367876,
						"y": 0.5
					}
				},
				{
					"filename": "中等模式-未解锁",
					"rotated": false,
					"trimmed": false,
					"sourceSize": {
						"w": 430,
						"h": 568
					},
					"spriteSourceSize": {
						"x": 0,
						"y": 0,
						"w": 430,
						"h": 568
					},
					"frame": {
						"x": 433,
						"y": 1,
						"w": 430,
						"h": 568
					},
					"anchor": {
						"x": 0.53367876,
						"y": 0.5
					}
				},
			]
		}
	],
	"meta": {
		"app": "https://www.codeandweb.com/texturepacker",
		"version": "3.0",
		"smartupdate": "$TexturePacker:SmartUpdate:df94a7f0ad37bcfe455ba6d44285931c:60cad573ea117173bc0648d31c948ae3:c16d8027c2289a88f80702a18546ada8$"
	}
}

export default  levels_buttons_JSON;

```
2. MyScene.js:场景使用atlas图集，@/是根目录（微信中应该改为相对路径）
```js
import levels_buttons_JSON from '@/assets/images/testure_frame/levels_buttons.js'

class MyScene extends Phaser.Scene
{
    constructor() {
        super('MyScene');
    }
    
    init() {
        // 获取画布中心位置
        this.centerX = this.scale.width/2;
        this.centerY = this.scale.height/2;
        // 计算位置比例
        this.scaleX = this.scale.width / 1920;
        this.scaleY = this.scale.height / 1080;
    }
    preload ()
    {
        this.load.atlas('levels_buttons', 'assets/images/testure_frame/levels_buttons.png', levels_buttons_JSON);
    }
    create ()
    {
        this.add.image(200, 300,'levels_buttons', 'PC-关卡按钮／简单');
    }
}
export default MyScene;
```

## 真机调试路径报错
不支持路径别名，应该使用相对路径

## 真机调试图片都在屏幕左上角
phaser3API的原因，具体解决还待排查，phaser版本问题，更换phaser版本为3.88.0后显示正常，查看版本日志未找到原因
（v3.60.0-beta.13显示正常，v3.60.0-beta.14 - v3.87.0 显示在左上角，v3.88.0之后版本显示正常，查看版本日志未找到原因）

## 微信小游戏环境不支持phaser的音频管理器，无法播放音频
### 方法1：排查修改phaser关于HTML5Audio添加微信音频适配，此方法未解决

### 方法2：使用微信自己的音频API（成功）
- 创建音频管理器类
```js
/**
 * 创建音频管理类：使用微信API提供统一的音频管理
 * // 使用音频管理器
const audioManager = new AudioManager();
// 创建音频
audioManager.createAudio('bgm', 'assets/audio/background_music.mp3', true, 1);
// 播放音频
audioManager.play('bgm');
// 暂停或停止音频
audioManager.pause('bgm');
audioManager.stop('bgm');
// 查看音频播放状态
audioManager.isPlaying('bgm');
 */
export default class AudioManager {
    constructor() {
        this.audioInstances = {}; // 存储所有音频实例
        this.audioStates = {}; // 存储音频播放状态
    }

    // 创建音频
    createAudio(key, src, loop = false, volume = 1) {
        if (!this.audioInstances[key]) { // 如果 key 不存在，就创建音频
            const audio = wx.createInnerAudioContext();
            audio.src = src;
            audio.loop = loop;
            audio.volume = volume;
            
            // 监听播放状态
            audio.onPlay(() => {
                // console.log(`${key} 开始播放`);
                this.audioStates[key] = true;
            });

            audio.onStop(() => {
                // console.log(`${key} 停止播放`);
                this.audioStates[key] = false;
            });

            audio.onPause(() => {
                // console.log(`${key} 暂停`);
                this.audioStates[key] = false;
            });

            audio.onEnded(() => {
                // console.log(`${key} 播放完成`);
                this.audioStates[key] = false;
            });

            this.audioInstances[key] = audio;
            this.audioStates[key] = false; // 初始状态为未播放
        }
    }

    // 播放音频
    play(key) {
        if (this.audioInstances[key] && !this.audioStates[key]) { // 只有在未播放时才播放
            this.audioInstances[key].play();
        }
    }

    // 暂停音频
    pause(key) {
        if (this.audioInstances[key] && this.audioStates[key]) {
            this.audioInstances[key].pause();
        }
    }

    // 停止音频
    stop(key) {
        if (this.audioInstances[key] && this.audioStates[key]) {
            this.audioInstances[key].stop();
        }
    }

    // 设置音量
    setVolume(key, volume) {
        if (this.audioInstances[key]) {
            this.audioInstances[key].volume = volume;
        }
    }

    // 检查音频是否正在播放
    isPlaying(key) {
        return !!this.audioStates[key]; //!! 可以确保返回的值 始终是 true 或 false
    }
}
```

- 实例一个音频管理器对象
```js
import AudioManager from './AudioManager.js';
// import preloadSceneAssets from '../utils/assetsConfig.js';
/**
 * 实例化一个音频管理对象
 */
const audioList = new AudioManager();

// 可使用：
// audioList.createAudio('background_music', preloadSceneAssets['background_music'], true, 5);

audioList.createAudio('background_music', 'assets/audio/background_music.mp3', true, 5);
audioList.createAudio('audio_click', 'assets/audio/点击按键.mp3', false, 5);
audioList.createAudio('audio_blockUp', 'assets/audio/方块上升.mp3', false, 5);
audioList.createAudio('audio_blockDown', 'assets/audio/方块下落.mp3', false, 5);
audioList.createAudio('audio_success', 'assets/audio/闯关成功.mp3', false, 5);

export default audioList;
```

- 场景中使用实例化的音频管理器对象管理音频
```js
import Phaser from '../libs/phaser.min.js'
import {preloadSceneAssets} from '../utils/assetsConfig.js';
import audioList from '../utils/audioList/audioList.js';

class MyScene extends Phaser.Scene
{
    constructor() {
        super('MyScene');
    }
    
    init() {
        // 获取画布中心位置
        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;
        // 计算位置比例
        this.scaleX = this.scale.width / 1920;
        this.scaleY = this.scale.height / 1080;

        this.sound.locked = false;
    }

    preload ()
    {
        this.load.image("background1",preloadSceneAssets['background1']);
    }

    create ()
    {
        this.add.image(this.centerX, this.centerY, "background1").setScale(0.5* this.scaleX);

        /* 使用实例化的音频管理器对象管理音频 */
        audioList.setVolume('background_music', 6); // 设置音量
        audioList.play('background_music'); // 播放音频
        audioList.stop('background_music'); // 停止播放音频 
      
    }
}

export default MyScene;
```

## 微信小游戏不支持phaser的拖拽
使用微信的wx.onTouchMove((e) => { });触发phaser的drag事件

- 元素位置相对画布左上角时：
```js
import Phaser from '../libs/phaser.min.js'
import {preloadSceneAssets} from '../utils/assetsConfig.js';
import audioList from '../utils/audioList/audioList.js';

class MyScene extends Phaser.Scene
{
    constructor() {
        super('MyScene');
    }
    
    init() {
        // 获取画布中心位置
        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;
        // 计算位置比例
        this.scaleX = this.scale.width / 1920;
        this.scaleY = this.scale.height / 1080;

        this.sound.locked = false;
    }

    preload ()
    {
        this.load.setBaseURL('https://cdn.phaserfiles.com/v385/');
        this.load.image('bg', 'assets/skies/sky2.png');
        this.load.atlas('blocks', 'assets/sprites/blocks.png', 'assets/sprites/blocks.json');
    }

    create ()
    {
        const redmonster = this.add.sprite(272, 300,'blocks','redmonster');
        const block = this.add.sprite(400, 300,'blocks','yellowmonster');
        const wooden = this.add.sprite(528, 300,'blocks','wooden');

        // 元素设置可拖拽互动
        wooden.setInteractive({
            draggable: true,
        });
        redmonster.setInteractive({
            draggable: true,
        });
        block.setInteractive({
            draggable: true,
        });

        /* pointerdown 事件 */
        redmonster.on('pointerdown', (pointer, x, y, event) => {
            console.log('点击对象:', pointer, x, y, event);
        });
        

        /* 微信小游戏环境中监听触摸移动事件 (touchmove) 并将其转换为 Phaser 的 pointermove 和 drag 事件，以便 Phaser 能够正确处理拖拽行为。
        e.touches.length > 0 ,确保至少有一个手指在屏幕上，避免 touches 数组为空时访问 e.touches[0] 时报错。
        e.touches[0], 获取第一个触摸点（如果有多个手指触摸屏幕，这里只处理第一个）。
        this.input.activePointer, 获取 Phaser 当前活动的指针对象（activePointer 代表当前正在操作的输入设备，比如鼠标或触摸点）。在触摸设备上，activePointer 代表当前手指的触摸事件。
        pointer.x = touch.clientX * window.devicePixelRatio; pointer.y = touch.clientY * window.devicePixelRatio; 计算并设置 Phaser 指针的坐标：clientX 和 clientY 是触摸点相对于视口左上角的坐标。window.devicePixelRatio 用于适配不同设备的分辨率。乘以 devicePixelRatio 确保 Phaser 的坐标系统与微信小游戏的屏幕坐标系统匹配（因为微信小游戏的 canvas 在高 DPI 屏幕上可能会缩放）。
        this.input.emit('pointermove', pointer)，Phaser 自带 pointermove 事件，但由于微信小游戏的触摸事件不直接兼容 Phaser，需要手动转换并触发该事件。
        this.input.emit(eventName, ...args) 是 Phaser 3 事件系统的一个方法，用来手动触发输入事件。通常用于自定义事件或者在特定情况下模拟 Phaser 内部的输入事件 */
        wx.onTouchMove((e) => {
            if (e.touches.length > 0) { 
                const touch = e.touches[0]; 
                const pointer = this.input.activePointer; 

                // 计算并设置 Phaser 指针的坐标
                pointer.x = touch.clientX * window.devicePixelRatio;
                pointer.y = touch.clientY * window.devicePixelRatio;

                // 拖动距离，Phaser.Math.Distance.Between(x1, y1, x2, y2) 用于计算两点之间的直线距离
                const distance = Phaser.Math.Distance.Between(
                    pointer.downX, pointer.downY, // 手指按下位置
                    pointer.x, pointer.y // 手指最后位置
                );

                this.input.emit('pointermove', pointer); // 触发phaser的pointermove事件

                // this.input.dragDistanceThreshold = 8; // phaser的最小拖动距离参数和微信触摸事件冲突，所以使用distance比较代替

                // 如果当前有拖拽的对象 (draggedObject)，且拖拽距离大于8，手动触发 drag 事件：
                /* phaser的 dragstart 事件在微信中有效触发，可获取触发元素gameObject, 将gameObject赋值给this.input.draggedObject */
                if (this.input.draggedObject && distance > 8) {
                    // console.log('distance', distance);
                    this.input.emit('drag', pointer, this.input.draggedObject, pointer.x, pointer.y);
                }
            }
        });   

        /* pointermove 事件 */
        // this.time.delayedCall(100, () => {
        //     this.input.on('pointermove', (pointer) => {
        //         console.log('pointermove:', pointer.x, pointer.y, pointer.velocity);
        //     });
        // });
        
        /* dragstart 事件 */
        this.input.on('dragstart', (pointer, gameObject) => {
            console.log('开始拖拽:', gameObject.texture.key, gameObject.x ,gameObject.y);
            console.log('gameObject:', gameObject, gameObject.frame.name);
            this.input.draggedObject = gameObject;  // 记录当前拖拽对象 
        });
        /* drag 事件： */
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => { 
            console.log('拖拽事件触发:', gameObject.frame.name, dragX, dragY);
            gameObject.x = dragX; 
            gameObject.y = dragY; 
        });
        /* dragend 事件 */
        this.input.on('dragend', (pointer, gameObject) => {
            console.log('拖拽结束:', gameObject.frame.name, gameObject.x ,gameObject.y);
            this.input.draggedObject = null; // 清除当前拖拽对象
        });
        
        


       /* 固定每次只能朝一个方向拖拽：
        let dragDirection = null; // 固定每次只能朝一个方向拖拽

        this.input.on('dragstart', (pointer, gameObject) => {
            dragDirection = null;

            console.log('拖拽开始:', gameObject.texture.key);
            this.input.draggedObject = gameObject;  // 记录当前拖拽对象

        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {

            console.log('拖拽中:', gameObject.texture.key, dragX, dragY);

            if(!dragDirection) {
                if(Math.abs(pointer.velocity.x) > Math.abs(pointer.velocity.y)){
                    dragDirection = 'horizontal';
                } else {
                    dragDirection = 'vertical';
                }
            };

            if(dragDirection === 'horizontal') {
                gameObject.x = dragX;
            } else if(dragDirection === 'vertical') {
                gameObject.y = dragY;
            }
        });

        this.input.on('dragend', (pointer, gameObject) => {
            dragDirection = null;
            this.input.draggedObject = null; // 清除当前拖拽对象
        });*/            
      
      
    }
}



export default MyScene;
```

- 元素在容器中，容器位置在画布中心时，则拖拽位置要改为相对容器的位置
1. 先封装微信中触发phaser拖拽功能:touchMoveHandler.js文件
```js
/**
 * 封装微信触发phaser的pointernove、drag
 * @param {scene} Phaser.Scene -- 当前场景 
 */
const touchMoveHandler = (scene) => {
    wx.onTouchMove((e) => {
        if (e.touches.length > 0) { 
            const touch = e.touches[0]; 
            const pointer = scene.input.activePointer; 

            // 计算并设置 Phaser 指针的坐标
            pointer.x = touch.clientX * window.devicePixelRatio;
            pointer.y = touch.clientY * window.devicePixelRatio;

            // 计算拖动距离
            const distance = Phaser.Math.Distance.Between(
                pointer.downX, pointer.downY, 
                pointer.x, pointer.y
            );

            scene.input.emit('pointermove', pointer); // 触发 pointermove 事件

            // 如果当前有拖拽对象，且拖动距离大于 8，手动触发 drag 事件
            // if (scene.input.draggedObject && distance > 8) {
            //     scene.input.emit('drag', pointer, scene.input.draggedObject, pointer.x, pointer.y);
            // }
            if (scene.input.draggedObject) {
                scene.input.emit('drag', pointer, scene.input.draggedObject, pointer.x, pointer.y);
            }
        }
    });
};

export default touchMoveHandler;

```
2. 容器中调用拖拽功能，容器container坐标(scene.centerX, scene.centerY)
```js
import touchMoveHandler from '../touchMoveHandler.js';
// 设置弹窗内元素
    scene.addSettingDialogItems = () => {

        // 获取最新音量值
        scene.sounds_value = scene.registry.get('sounds_value'); // 声音值
        scene.music_value = scene.registry.get('music_value');  // 音乐值
        scene.msg_state_value = scene.registry.get('msg_state_value');  // 音乐值
        
        const dialogElements = [scene.overlay, scene.dialog];  //// 创建一个数组来保存弹窗内元素, 存放弹窗背景及遮罩层
        const text = [];
        const imgs = [];

        /* 弹窗中心坐标(scene.dialog.x, scene.dialog.y)
        弹窗方框中心坐标(scene.dialog.x, scene.dialog.y + 44)
        弹窗左上角坐标(scene.dialog.x - scene.dialog.displayWidth/2, scene.dialog.y + 44 - 628/2)
        */
        // scene.dialog.height显示原始元素高度, scene.dialog.displayHeight显示缩放后元素高度

        // 容器container坐标(scene.centerX, scene.centerY)
        const title = scene.addText(0, scene.dialog.y - scene.dialog.displayHeight / 2 + 44 * scene.scaleX, '设置', 'Douyin Sans', 'blod', 32 * scene.scaleX, 38,'#2A3853','', 0.5, 0.5, 3)
        text.push(title);
        const closeBtn = scene.add.image(scene.dialog.x + scene.dialog.displayWidth / 2 - 50* scene.scaleX, scene.dialog.y + (44 - 512/2 + 32) * scene.scaleX , 'close_btn').setScale(0.5 * scene.scaleX);
        closeBtn.setInteractive();
        

        /* 声音 */ 
        imgs[0] = scene.add.image(scene.dialog.x - scene.dialog.displayWidth/2 + 132 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 80 + 32) * scene.scaleX, 'icon_sounds').setScale(0.5 * scene.scaleX);
        const text1 = scene.addText(scene.dialog.x - scene.dialog.displayWidth/2 + 198 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 80 + 32) * scene.scaleX, '声音', 'Douyin Sans', 'blod', 28* scene.scaleX, 33, '#3E6698', '',0, 0.5, 1);
        text.push(text1);
        // 音量条绘制
        const xBar1 = scene.dialog.x - scene.dialog.displayWidth/2 + 334  * scene.scaleX;
        const yBar1 = scene.dialog.y + (44 - 512/2 + 86) * scene.scaleX;
        const {points: soundPoints, adjustPoint: soundAdjustPoint , adjustBar: soundBar, points_value: sound_points_value} = createAdjustBar(scene, text, xBar1, yBar1, scene.sounds_value);
        soundAdjustPoint.name = 'soundAdjustPoint'; // 用于识别拖拽gameObject.name
        soundBar.name = 'soundBar'; 
        /* 音乐 */
        imgs[1] = scene.add.image(scene.dialog.x - scene.dialog.displayWidth/2 + 132 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 204 + 32) * scene.scaleX, 'icon_music').setScale(0.5 * scene.scaleX);
        const text2 = scene.addText(scene.dialog.x - scene.dialog.displayWidth/2 + 198 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 204 + 32) * scene.scaleX, '音乐', 'Douyin Sans', 'blod', 28* scene.scaleX, 33, '#3E6698', '',0, 0.5, 1);
        text.push(text2);
        // 音量条绘制
        const xBar2 = scene.dialog.x - scene.dialog.displayWidth/2 + 334  * scene.scaleX;
        const yBar2 = scene.dialog.y + (44 - 512/2 + 210) * scene.scaleX;
        const {points: musicPoints,adjustPoint: musicAdjustPoint , adjustBar: musicBar, points_value: music_points_value} = createAdjustBar(scene, text, xBar2, yBar2, scene.music_value);
        musicAdjustPoint.name = 'musicAdjustPoint';
        musicBar.name = 'musicBar';
        
        

// ！！！！！！！重点
        // 设置拖拽音量调节点
        touchMoveHandler(scene);  // 设置微信中phaser拖拽触发
        scene.input.on('dragstart', (pointer, gameObject) => {
            console.log('🔥 开始拖拽:', gameObject.name);
            scene.input.draggedObject = gameObject;  // 记录当前拖拽对象 
        });
        scene.input.on('dragend', (pointer, gameObject) => {
            console.log('拖拽结束:', gameObject.name);
            scene.input.draggedObject = null; // 清除当前拖拽对象
        }); 
        scene.input.on('drag', (pointer, gameObject, dragX) => {
            console.log('gameObject',gameObject);

            // ！！！！！！！
            let drag_x = dragX - scene.centerX;  // dragX是相对画布位置， 在容器中需要改为相对容器的位置

            if(gameObject.name === 'soundAdjustPoint') {
                const minDragX = sound_points_value[0].x; // 第一个点的x坐标
                const maxDragX = sound_points_value[17].x; // 最后一个点的x坐标
                drag_x = Phaser.Math.Clamp(drag_x, minDragX, maxDragX); // 拖拽位置限制最大值最小值
                console.log('dragX, minDragX, maxDragX',dragX,drag_x, minDragX, maxDragX);

                // 遍历sound_points_value，获取拖拽后音量调节点的最终位置
                for (let i = 0; i < sound_points_value.length; i++) {
                    if( i < sound_points_value.length -1 && drag_x >= sound_points_value[i].x && drag_x < sound_points_value[i+1].x) {                    
                        gameObject.x = sound_points_value[i].x; // 设置 gameObject 的最终x位置
                        const currentValue = sound_points_value[i].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey

                    } else if (drag_x >= sound_points_value[sound_points_value.length - 1].x) {
                        gameObject.x = sound_points_value[sound_points_value.length - 1].x; // 设置 gameObject 的最终x位置
                        const currentValue = sound_points_value[sound_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
                
            } else if (gameObject.name === 'musicAdjustPoint') {
                const minDragX = music_points_value[0].x; // 第一个点的x坐标
                const maxDragX = music_points_value[17].x; // 最后一个点的x坐标
                drag_x = Phaser.Math.Clamp(drag_x, minDragX, maxDragX); // 拖拽位置限制最大值最小值

                for (let i = 0; i < music_points_value.length; i++) {
                    if (i < music_points_value.length -1 && drag_x >= music_points_value[i].x && drag_x < music_points_value[i+1].x) {
                        gameObject.x = music_points_value[i].x; // 设置 gameObject 的最终x位置
                        const currentValue = music_points_value[i].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey

                    } else if (drag_x >= music_points_value[music_points_value.length - 1].x) {
                        gameObject.x = music_points_value[music_points_value.length - 1].x; // 设置 gameObject 的最终x位置
                        const currentValue = music_points_value[music_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
                
            };
            

        });

        // 设置点击移动音量调节点
        scene.input.on('pointerdown', (pointer) => {
            
            // 鼠标点击位置
            const clickX = pointer.x - scene.centerX; // 相对容器的坐标
            const clickY = pointer.y - scene.centerY;

            // 检查点击是否在音量点的范围内, x范围为第一个点x到最后一个点的x, y范围为各音量条的宽度
            const minClickX = sound_points_value[0].x - 15 *scene.scaleX; // 第一个点的x坐标前一点
            const maxClickX = sound_points_value[17].x + 15 *scene.scaleX; // 最后一个点的x坐标后一点
            // 声音的音量宽度
            const minClickY1 = yBar1;
            const maxClickY1 = yBar1 + 53 * scene.scaleX;  // 音量条宽53
            // 音乐的音量宽度
            const minClickY2 = yBar2;
            const maxClickY2 = yBar2 + 53 * scene.scaleX;  // 音量条宽53

            // 点击在声音调节点的范围内，音量修改
            if(clickX >= minClickX && clickX <= maxClickX && clickY >= minClickY1 && clickY <= maxClickY1) {
                for (let i = 0; i < sound_points_value.length; i++) {
                    if (i < sound_points_value.length -1 && clickX >= sound_points_value[i].x && clickX < sound_points_value[i+1].x) {
                        const soundAdjustPoint_x = sound_points_value[i].x; // 设置 调节点 的最终x位置
                        const soundAdjustPoint_y = sound_points_value[i].y; // 设置 调节点 的最终y位置

                        soundAdjustPoint.clear();  // 清除原来的图形
                        soundAdjustPoint.setPosition(soundAdjustPoint_x , soundAdjustPoint_y);  // 设置位置
                        soundAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        soundAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = sound_points_value[i].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey

                    } else if (clickX >= sound_points_value[sound_points_value.length - 1].x) {
                        const soundAdjustPoint_x  = sound_points_value[sound_points_value.length - 1].x; 
                        const soundAdjustPoint_y  = sound_points_value[sound_points_value.length - 1].y; 

                        soundAdjustPoint.clear();  // 清除原来的图形
                        soundAdjustPoint.setPosition(soundAdjustPoint_x , soundAdjustPoint_y);  // 设置位置
                        soundAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        soundAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = sound_points_value[sound_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('sounds_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
            } else if(clickX >= minClickX && clickX <= maxClickX && clickY >= minClickY2 && clickY <= maxClickY2) {
                // 点击在音乐调节点的范围内，音量修改
                for (let i = 0; i < music_points_value.length; i++) {
                    if (i < music_points_value.length -1 && clickX >= music_points_value[i].x && clickX < music_points_value[i+1].x) {
                        const musicAdjustPoint_x = music_points_value[i].x; // 设置 调节点 的最终x位置
                        const musicAdjustPoint_y = music_points_value[i].y; // 设置 调节点 的最终y位置

                        musicAdjustPoint.clear();  // 清除原来的图形
                        musicAdjustPoint.setPosition(musicAdjustPoint_x , musicAdjustPoint_y);  // 设置位置
                        musicAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        musicAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = music_points_value[i].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey

                    } else if (clickX >= music_points_value[music_points_value.length - 1].x) {
                        const musicAdjustPoint_x  = music_points_value[music_points_value.length - 1].x; 
                        const musicAdjustPoint_y  = music_points_value[music_points_value.length - 1].y; 
                        
                        musicAdjustPoint.clear();  // 清除原来的图形
                        musicAdjustPoint.setPosition(musicAdjustPoint_x , musicAdjustPoint_y);  // 设置位置
                        musicAdjustPoint.fillStyle(0xFFFFFF);  // 设置颜色
                        musicAdjustPoint.fillCircle(0, 0, 18 * scene.scaleX);  // 设置新的半径为18

                        const currentValue = music_points_value[music_points_value.length - 1].value;  // 获取音量值
                        scene.registry.set('music_value', currentValue); // 实时保存到指定 registryKey
                    }
                };
            }

        });



        /* 通知 */
        imgs[2] = scene.add.image(scene.dialog.x - scene.dialog.displayWidth/2 + 132 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 328 + 32) * scene.scaleX, 'icon_msg').setScale(0.5 * scene.scaleX);
        const text3 = scene.addText(scene.dialog.x - scene.dialog.displayWidth/2 + 198 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 328 + 32) * scene.scaleX, '通知', 'Douyin Sans', 'blod', 28* scene.scaleX, 33, '#3E6698', '',0, 0.5, 1);
        text.push(text3);
        const msg_state = scene.add.image(scene.dialog.x + scene.dialog.displayWidth/2 - 170 * scene.scaleX, scene.dialog.y + (44 - 512/2 + 328 + 32) * scene.scaleX, 'icon_msg_open').setScale(0.5 * scene.scaleX);
        msg_state.setInteractive();
        if(scene.registry.get('msg_state_value')) {
            msg_state.setTexture('icon_msg_open');
            scene.registry.set('msg_state_value', true)
        } else {
            msg_state.setTexture('icon_msg_close');
            scene.registry.set('msg_state_value', false)
        }

        // 保存弹窗元素
        dialogElements.push( imgs, soundBar, soundPoints, soundAdjustPoint,  musicBar, musicPoints, musicAdjustPoint, closeBtn, msg_state, text);
        
        /* 通知按钮事件 */
        msg_state.on('pointerover', () => {
            scene.input.setDefaultCursor('pointer');
        });
        msg_state.on('pointerout', () => {
            scene.input.setDefaultCursor('default');
        });
        msg_state.on('pointerdown', () => {
            // 播放点击音效
            audioPlay(scene, 'audio_click');

            // 切换图标
            if (scene.registry.get('msg_state_value')) {
                msg_state.setTexture('icon_msg_close');
                scene.registry.set('msg_state_value', false)
            } else {
                msg_state.setTexture('icon_msg_open');
                scene.registry.set('msg_state_value', true)
            };
        });


        /* 关闭弹窗按钮事件 */
        createButton(scene, closeBtn, undefined, undefined, undefined, () => {
            hideDialog(dialogElements, scene.coverdInteractiveItems);  // 隐藏弹窗

            if(!scene.isTimerRunning && scene.resumeTimer) {
                scene.resumeTimer(); //继续计时
            };
        });


        
        

        return dialogElements;
        
    } 

```

## 微信小游戏不支持字体设置'bold'
将'bold'改为数字，比如font-style: '700'; font-style: '800'


## 微信小游戏分包加载
主包不能超过4MB,分包无限制，但合起来不能超过20MB

主包可以被分包调用，所以主包包含所有要最先加载的东西。
[微信官方分包文档](https://developers.weixin.qq.com/minigame/dev/api/base/subpackage/wx.preDownloadSubpackage.html)

```js
// 1. 首先要在 app.json / game.json 中配置分包
{
    "subPackages": [
      {
        "name": "scenes",
        "root": "js/scenes/"
      }
    ]
}

// 2. 在分包目录下创建game.js文件夹，作为分包入口，game.js：
// 分包入口，用module.exports
module.exports = {
    LoadingScene: require('./loadingScene').default,
    GameBeginScene: require('./gameBeginScene').default,
    LevelScene: require('./levelScene').default,
    Level_01: require('./levels/Level_01').default,
    Level_02: require('./levels/Level_02').default,
    Level_03: require('./levels/Level_03').default,
    
};



// 3.在需要加载分包的地方用wx.loadSubpackage触发分包加载，，这里放在main.js中，分包加载完后创建phaser游戏实例
// 分包加载
const loadTask = wx.loadSubpackage({
    name: 'scenes', // 下载scenes分包
    success: (res) => {
        // console.log('load moduleA success', res);

         // 通过 require() 访问分包内的 game.js
        const scenes = require("./scenes/game.js");  // 本文件（这里是main.js）的相对路径

        const allScene = Object.values(scenes);
        console.log('allScene',allScene);
        // 初始化phaser游戏并传入关卡
        initGame(allScene);
    },
    fail(err) {
        console.error('load moduleA fail', err)
    }
});

loadTask.onProgressUpdate(res => {
    console.log('下载进度', res.progress)
    console.log('已经下载的数据长度', res.totalBytesWritten)
    console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
});

function initGame (allScene) {
    const config = {
        // type:Phaser.AUTO, // 自动尝试WebGL，否则退回到Canvas
        type: Phaser.CANVAS,
        canvas: canvas, //微信自己的 Canvas 上下文供 Phaser 使用，而不是创建一个
        scale: {
            width: width,  // 设置游戏画布的宽度
            height: height, // 设置游戏画布的高度
            autoCenter: Phaser.Scale.CENTER_BOTH, // 设置游戏画布居中
            mode: Phaser.Scale.FIT, // 自动调整游戏画布大小以适应窗口
            resolution: window.devicePixelRatio // 自动匹配屏幕分辨率
        },
        backgroundColor: '#73B7FF',  // 画布背景
        scene: allScene,
        // [ //游戏的具体场景
            // LoadingScene, // 加载
            // GameBeginScene,  // 开始
            // LevelScene,  // 关卡选择
            // Level_01, // 第一关
            // Level_02, // 第二关
            // Level_03, // 第二关
        // ],
        physics:{ // 开启游戏物理引擎，不然物理环境不会生效，分别是arcade\impact\matter
            default:"arcade",//默认arcade
            arcade:{
                debug: true //开启调试模式，如果开启了，就会给每隔元素加上边框，还有移动的方向
            }
        },
        input: {
            activePointers: 1,  // 激活的指针数量
            touch: { 
                enabled: true // 启用触摸输入
            }
        },
        loader: {
            imageLoadType: "HTMLImageElement", // 让 Phaser 使用 <img> 加载图片
        },
        audio: {
            disableWebAudio: true,  // 禁用 WebAudio，使用 HTML5 音频
        },
        render: {
            pixelArt: false,
            antialias: true,
            roundPixels: false
        }
    }
    
    new Phaser.Game(config);
}


```

## 实际情况中，图片音效资源是占内存最大的，将游戏资源放到远程服务器上或者CDN,可以有效减少微信小游戏主包大小
1. 将资源文件夹assets放入服务器/var/www/html/smallPressBig-assets-wx/

2. 在nginx中配置smallPressBig-assets-wx/的访问
```nginx
server {
    # 根路径直接指向 cheersjoy 项目
    location / {
        # alias /var/www/html/cheersjoy;
        index index.html;
        try_files $uri /index.html;
    }

    # smallPressBig 项目路径
    location /smallPressBig {
        alias /var/www/html/smallPressBig;
        index index.html;
        try_files $uri /index.html;
    }
    
    # 让所有资源路径指向 /smallPressBig-assets-wx 目录
    location /smallPressBig-assets-wx/ {
        alias /var/www/html/smallPressBig-assets-wx/;
        expires max;
        add_header Access-Control-Allow-Origin *;
    }

} 

```

3. 外网可以通过访问 域名/smallPressBig-assets-wx/assets/images/testure_frame/texture1.png 访问到texture1.png

4. 在phaser微信小游戏中：
assetsConfig.js（资源统一存放位置）
```js
const BASE_URL = 'https://cheersjoy.cn/smallPressBig-assets-wx/';

const preloadSceneAssets = {
    'DouyinSansBold': BASE_URL + 'assets/fonts/DouyinSansBold.otf',
    'Roboto': BASE_URL + 'assets/fonts/Roboto-Black-1.ttf',

    // 小图片精灵图集合
    'texture1': BASE_URL + 'assets/images/testure_frame/texture1.png',
    'texture1_JSON': BASE_URL + 'assets/images/testure_frame/texture1.json',
}
export default preloadSceneAssets ;
```
loadingScene.js中使用preloadSceneAssets
```js
import preloadSceneAssets from '../utils/assetsConfig.js';
class LoadingScene extends Phaser.Scene { 
    preload() {
        this.load.atlas('texture1', preloadSceneAssets['texture1'], preloadSceneAssets['texture1_JSON']);
        this.load.image("background1",preloadSceneAssets['background1']);
    }
    create() { 
        const img2 = this.add.image(1230 * this.scaleX, 73 * this.scaleY, "texture1", "装饰中@2x").setScale(0.5 * this.scaleX).setOrigin(0,0);
    }
}

```

5. 注意：资源存放在CDN或者远程服务器上时，微信小游戏支持phaser的加载json, 不用非把json文件换成js文件再导出为变量
比如：
```js
preload() {
        this.load.setBaseURL('https://cheersjoy.cn/smallPressBig-assets-wx/');
        this.load.image('sonic', 'assets/images/background1.png');
        this.load.atlas('texture1', 'assets/images/testure_frame/texture1.png', 'assets/images/testure_frame/texture1.json');
}
```


5. 真机调试报错：errno: 600002, errMsg: "request:fail url not in domain list: cheersjoy.cn
解决：登录[微信公众平台](https://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?token=535956032&lang=zh_CN)
【管理】-【开发管理】，服务器域名：设置request合法域名：https://cheersjoy.cn

## 微信小游戏发布
1. 微信开发者工具，点击【上传】，
2. 登录[微信公众平台](https://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?token=535956032&lang=zh_CN)
【管理】-【版本管理】可看到开发版本中，有刚提交的版本，可以将版本设置为体验版
3. 【管理】-【版本管理】可以将版本设置为体验版或者提交审核。
体验版：生成体验版二维码，可下载该二维码分享给大家。
（体验版只有开发者和管理员体验者可体验。【管理】-【成员管理】可添加体验者成员微信号）
提交审核：确定要发布了，就提交审核。但会先弹出个填写游戏内容的界面，按照要求填写即可。
审核通过点击发布


登录小程序管理后台，在”版本管理“种可以看到小程序的所有版本。现在至少发现了四种：开发版本，体验版本，审核版本，线上版本。
首先，开发、自测完成，上传成功了，就成了开发版本。
开发版本可以进行两种操作（不互斥）：
1、可以设置成体验版本，并可以指定谁来体验，最多能指定90个。
2、提交审核。
开发版本提交审核后，就出现了一个同版本号的审核版本（状态为审核中）。审核可能通过也可能不通过。通过审核的审核版本的状态
变为审核通过可以发布'，此时可以发布（全量或灰度），从而变成线上版本。一个审核版本被成功发布后，就消失了。
线上版可能有多个。包括最多一个全量发布的版本和多个灰度发布Q的版本。多个全量发布的线上版会按先后顺序覆盖，并可以按照发
布时间线逐个回退。


## 部分手机（iphone XR预览加载图片失败）问题
将图片资源名称改为英文后正常加载了

## IOS系统上预览第一行文字显示不完整--文字上部被"削头"
phaser的文字样式需要设置padding: {top: 3},显示正常
```js
// 扩展 Phaser.Scene，使所有场景都可以调用 addText 方法
Phaser.Scene.prototype.addText = function (x, y, text,fontFamily = 'Douyin Sans, PingFang SC', fontStyle, fontSize, lineSpacing , color, wordWrapWidth = null, originX = 0, originY = 0,letterSpacing = 3) {
    const style = {
        // fontFamily: 'Douyin Sans, PingFang SC',
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        fontSize: fontSize,
        lineSpacing : lineSpacing ,
        color: color,
        padding: {top: 3},
    };

    if (wordWrapWidth) {
        style.wordWrap = { width: wordWrapWidth, useAdvancedWrap: true };  //useAdvancedWrap: true 启用高级换行
    };

    const renderText = this.add.text(x, y, text, style).setOrigin(originX, originY)
    renderText.setLetterSpacing(letterSpacing);

    return renderText;
};
```

## 微信小游戏开启分享功能，开启版本检测-客户端主动触发最新版本下载
```js
const passiveShareApp = (imgUrl) => {
    wx.showShareMenu({
        // shareAppMessage分享好友 ， shareTimeline分享朋友圈
        menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.onShareAppMessage(function () {
        // 用户点击了“转发”按钮
        return {
            title: '邀你一起玩！',
            // imageUrl: canvas.toTempFilePathSync({
            //     destWidth: 500,
            //     destHeight: 400
            // })
            imageUrl: imgUrl
        }
    })
}

export default passiveShareApp;

/* -------------------------- */

const updateApp = () => {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
        wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
            if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
            }
            }
        })
    })

    updateManager.onUpdateFailed(function () {
        // 新版本下载失败
    })

}
export default updateApp;

```

在phaser游戏开始入口执行passiveShareApp函数
```js
// main.js
import Phaser from './libs/phaser.min.js'
import 'utils/sceneExtensions.js'; // 导入Phaser.Scene扩展
import passiveShareApp from './passiveShareApp.js'
import updateApp from './updateApp.js'
import preloadSceneAssets from 'utils/assetsConfig.js'

import GameBeginScene from 'scenes/gameBeginScene.js';
import LoadingScene from 'scenes/loadingScene.js';
import LevelScene from 'scenes/levelScene.js';
import Level_01 from 'scenes/levels/Level_01.js';
import Level_02 from 'scenes/levels/Level_02.js';
import Level_03 from 'scenes/levels/Level_03.js';


let { windowWidth, windowHeight } = wx.getWindowInfo()

const dpr = window.devicePixelRatio || 2;
let width = windowWidth * dpr;
let height = windowHeight * dpr;


// 启动小程序转发，分享朋友圈功能
passiveShareApp(preloadSceneAssets['shareImg']);
// 检测小程序新版本并自动更新程序包
updateApp();


const config = {
    // type:Phaser.AUTO, // 自动尝试WebGL，否则退回到Canvas
    type: Phaser.CANVAS,
    canvas: canvas, //微信自己的 Canvas 上下文供 Phaser 使用，而不是创建一个
    scale: {
        width: width,  // 设置游戏画布的宽度
        height: height, // 设置游戏画布的高度
        autoCenter: Phaser.Scale.CENTER_BOTH, // 设置游戏画布居中
        mode: Phaser.Scale.FIT, // 自动调整游戏画布大小以适应窗口
        resolution: window.devicePixelRatio // 自动匹配屏幕分辨率
    },
    backgroundColor: '#73B7FF',  // 画布背景
    scene: [ //游戏的具体场景
        LoadingScene, // 加载
        GameBeginScene,  // 开始
        LevelScene,  // 关卡选择
        Level_01, // 第一关
        Level_02, // 第二关
        Level_03, // 第二关
    ],
    physics:{ // 开启游戏物理引擎，不然物理环境不会生效，分别是arcade\impact\matter
        default:"arcade",//默认arcade
        arcade:{
            debug: true //开启调试模式，如果开启了，就会给每隔元素加上边框，还有移动的方向
        }
    },
    input: {
        activePointers: 1,  // 激活的指针数量
        touch: { 
            enabled: true // 启用触摸输入
        }
    },
    loader: {
        imageLoadType: "HTMLImageElement", // 让 Phaser 使用 <img> 加载图片
    },
    audio: {
        disableWebAudio: true,  // 禁用 WebAudio，使用 HTML5 音频
    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: false
    }
}

new Phaser.Game(config);
```


# phaser2 实践笔记

## phaser2 游戏初始化配置
```js
// 获取设备信息
const windowInfo = wx.getWindowInfo();

// 更新游戏画布宽高
gameOptions.width = windowInfo.windowWidth;
gameOptions.height = windowInfo.windowHeight; 

// 游戏初始化配置
const config = {
    renderer: Phaser.CANVAS,
    canvas: canvas,
    width: gameOptions.width,
    height: gameOptions.height
};
// 初始化游戏
game = new Phaser.Game({...config});

// 添加start场景
game.state.add('start', new Start(game));
game.state.add('play', new Play(game));

// 启动start场景
game.state.start('start');


// console.log('gameOptions:', gameOptions.width, gameOptions.height); // 375 667
// console.log('scale:', this.scale.width, this.scale.height); // 375 667
// console.log('world:', this.world.width, this.world.height); // 375 667
```

## 设定世界边界
```js
    init() {
        // 屏幕比例系数
        this.screenWidthRatio = this.scale.width / 480;
        this.screenHeightRatio = this.scale.height / 640;

        this.centerX = this.scale.width / 2;
        this.centerY = this.scale.height / 2;

        // console.log('gameOptions:', gameOptions.width, gameOptions.height); // 375 667
        // console.log('scale:', this.scale.width, this.scale.height); // 375 667
        // console.log('world:', this.world.width, this.world.height); // 375 667
        
        // 设定世界边界
        this.world.setBounds(0, -1000000, this.scale.width, 1000000);
        // 启动 Arcade 物理引擎
        this.physics.startSystem(Phaser.Physics.ARCADE);

        /* phaser2语法：this.world.setBounds(x, y, width, height); 
        世界左侧边界的 x 坐标（从 0 开始）；
        世界顶部边界的 y 坐标（负值表示向上扩展很远）；
        世界的宽度，通常与屏幕宽度一致；
        世界底部边界的 y 坐标（向下扩展到 1000000）；
        允许玩家或物体在一个超大的垂直范围内移动（上下共 2,000,000 像素高）。适用于无限滚动（如无尽模式）游戏，比如：
        无尽跳跃类游戏（如《Doodle Jump》）
        向下坠落的游戏（如掉落到深渊）

        优化：
        如果你的游戏真的需要无限上升或下降，可以使用 camera.follow() 来跟随玩家：
        this.camera.follow(player);
        这样摄像机会自动跟随玩家，而不会固定在屏幕顶部或底部。
        */

        /* phaser2语法：this.physics.startSystem(Phaser.Physics.ARCADE);
        Arcade 物理引擎是 Phaser 2 中最轻量级的物理系统，适用于简单的碰撞检测和重力系统。
        使用：this.physics.arcade.enable(sprite);来让 sprite 受物理影响，比如：
        重力 (sprite.body.gravity.y = 500;)
        速度 (sprite.body.velocity.y = -200;)
        碰撞检测 (this.physics.arcade.collide(player, platforms);)
        */
    }

```

## 使用this.add.image()和this.add.sprite(),添加物理属性后，image才有body属性
```js
// 启动 Arcade 物理引擎
this.physics.startSystem(Phaser.Physics.ARCADE);

// Phaser.Image 对象本身不具备物理体，尽管你可以通过 this.physics.arcade.enable() 来手动启用它，但是建议使用 Phaser.Sprite，它天生就拥有 body 属性。
const oneAsteroid = this.add.sprite(x * this.screenWidthRatio, y, 'sat1');

oneAsteroid.anchor.setTo(0.5);
oneAsteroid.radius = radius; // 碰撞体积半径
oneAsteroid.width = radius * 2; // 设置球体宽度为半径两倍
oneAsteroid.height = radius * 2;

this.physics.arcade.enable(oneAsteroid); // 添加物理碰撞检测
oneAsteroid.body.immovable = true; // 让oneAsteroid被碰撞后不会移动
```

## sprite播放帧动画
```js
/* 星空闪烁背景 */
        const skybox = this.add.sprite(0, 0, 'skybox');
        skybox.width = this.scale.width; // 直接修改元素width/height这种写法会拉伸变形
        skybox.height = this.scale.height;
        
        const twinkle = skybox.animations.add('twinkle');
        skybox.animations.play('twinkle', 3, true); 
        
        skybox.fixedToCamera = true; // fixedToCamera = true 让 skybox 不会随游戏世界移动，始终停留在屏幕上
```

## 固定到屏幕，不随游戏世界移动 fixedToCamera
```js
const skybox = this.add.sprite(0, 0, 'skybox');
skybox.fixedToCamera = true; // fixedToCamera = true 让 skybox 不会随游戏世界移动，始终停留在屏幕上
```

## phaser中弧度rotation和角度angle
```js
/* 
    rotation 属性表示火箭的旋转角度，以 弧度 为单位。弧度是一种角度的度量方式，范围是从 -Math.PI 到 Math.PI（即 -180° 到 180°）
    常见用法: 如果你需要使用旋转来进行物理计算或者与其他旋转值进行数学运算，通常使用弧度来进行处理。

    angle 属性表示火箭的旋转角度，以 度 为单位。角度是更直观的旋转度量，范围通常是从 0 到 360 度，或者从 -180 到 180 度（根据需要）。它更加人类友好，适合用于展示或直观的角度变化。
    常见用法: 如果你需要设置或读取角度值，并且不想进行弧度和角度之间的转换，使用 angle 更加方便。

    弧度到角度: angle = rotation * (180 / Math.PI)
    角度到弧度: rotation = angle * (Math.PI / 180)

    在 Phaser 中，angle 和 rotation 的值都是 弧度（radians）单位，所以在 Phaser 中，这两个属性的作用是相同的，都是表示物体的旋转角度，单位都是弧度
    */

    // 记录火箭旋转
    this.rocket.rotation = this.rotation.body.angle + Math.PI / 2;
```

## phaser检测物理重叠（碰撞）
```js
/* 
this.physics.arcade.overlap(),Phaser 中的 arcade physics 系统来检测两个游戏对象 (this.rocket 和 this.fire) 是否发生了重叠。如果它们发生了重叠，就会触发一个回调函数
*/
this.physics.arcade.overlap(this.rocket, this.fire, 
    (rocket, fire) => {
        this.gameOver();  // 游戏结束
    }
);
```