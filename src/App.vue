<template>
  <div class="wrap">
    <div class="score">{{ clickedRedPacket }},剩余{{ endCount }}s</div>
    <div class="canvasWrap" ref="canvasArea">
      <canvas id="canvas" @click="clickHandler"></canvas>
      <img id="canvas_bg" src="../assets/bj.jpg" alt="" />
    </div>
    <button class="startGameBtn" @click="startRain">startGame</button>
  </div>
</template>
<script>
import { randomRound, isValidClick } from "../util/util";
// const redPacket = {
//   x: "x轴位置",
//   y: "y轴位置",
//   radius: "红包大小",
//   img: "缓存好的红包图片",
//   speed: "红包的下落速度"
// };
export default {
  data() {
    return {
      innerHeight: "",
      innerWidth: "",
      timer: null,
      canvas: "",
      clickedRedPacket: 0,
      endCount: 15,
      imgArr: [
        {
          img:
            "http://pic.90sjimg.com/original_origin_pic/18/09/18/8fe63a446fb8766a5cce14ebbbbe4952.png!/fwfh/804x1201/quality/90/unsharp/true/compress/true/watermark/url/LzkwX3dhdGVyX3Y2LnBuZw==/repeat/true"
        },
        {
          img:
            "https://hbimg.huabanimg.com/04ab13e4b937fc871370ac49662cc562902600de5eab5-XIxPDN_fw658"
        },
        {
          img:
            "http://img.yipic.cn/thumb/ff6d64dc/a0a4a5ac/e6ee916c/c9480c96/effect_big_ff6d64dca0a4a5ace6ee916cc9480c96.jpg?x-oss-process=image/format,webp/sharpen,100"
        },
        {
          img:
            "http://img.yipic.cn/thumb/5200ceba/f292f2e2/e03bb2a8/340f3687/effect_small_5200cebaf292f2e2e03bb2a8340f3687.png?x-oss-process=image/format,webp/sharpen,100"
        }
      ],
      ctx: "",
      redPacketArr: []
    };
  },
  mounted() {
    this.initCanvas();
    this.resizeCanvas();
    this.$nextTick().then(() => {
      let that = this;
      window.onresize = function() {
        window.clearTimeout(this.timer);
        this.timer = window.setTimeout(() => {
          that.resizeCanvas();
        }, 100);
      };
    });
  },
  methods: {
    startRain() {
      this.pushRedPackets(); // 不断增加红包
      this.moveRedPackets(); // 红包开始运动
      this.endCountTimer = setInterval(() => {
        this.endCount--;
      }, 1000);
      // //倒计时15s后，停止动画
      this.runCountdownTimer = setTimeout(() => {
        clearTimeout(this.endCountTimer);
        clearTimeout(this.addredPacketsTimer);
        window.cancelAnimationFrame(this.moveRedPacketAnimation);
      }, 15000);
    },
    initCanvas() {
      this.canvas = document.getElementById("canvas");
      if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext("2d");
        this.loadImgs(this.imgArr);
      }
    },
    resizeCanvas() {
      this.innerHeight = window.screen.height;
      this.innerWidth = window.screen.width;
      let image = document.querySelector("#canvas_bg");
      image.height = this.innerHeight;
      image.width = this.innerWidth;
      document.getElementById("canvas").setAttribute("width", this.innerWidth);
      document
        .getElementById("canvas")
        .setAttribute("height", this.innerHeight);
    },
    loadImgs(arr) {
      return new Promise(resolve => {
        let count = 0;
        // 循环图片数组，每张图片都生成一个新的图片对象
        const len = arr.length;
        for (let i = 0; i < len; i++) {
          // 创建图片对象
          const image = new Image();
          // 成功的异步回调
          image.onload = () => {
            count++;
            arr.splice(i, 1, {
              img: image
            });
            // 这里说明 整个图片数组arr里面的图片全都加载好了
            if (count == len) {
              this.preloaded = true;
              resolve();
            }
          };
          image.src = arr[i].img;
        }
      });
    },
    //生成红包
    pushRedPackets() {
      // 每次随机生成1~3个红包
      // const random = randomRound(1, 3);
      const random = 1;
      let arr = [];
      for (let i = 0; i < random; i++) {
        // 创建新的红包对象
        const newRedPacket = {
          x: randomRound(10, this.innerWidth - 10), // 横向随机  红包不要贴近边
          y: -Math.random() * 150, // -150内高度 随机
          radius: randomRound(this.innerWidth * 0.05, this.innerWidth * 0.1), // 红包宽度
          img: this.imgArr[randomRound(0, this.imgArr.length - 1)].img, // 随机取一个红包图片对象
          speed: randomRound(
            this.innerHeight * 0.0075,
            this.innerHeight * 0.0125
          )
        };
        // console.log(newRedPacket);
        arr.push(newRedPacket);
      }
      // 每次都插入一批新红包对象arr到运动的红包数组this.redPacketArr
      this.redPacketArr = [...this.redPacketArr, ...arr];
      // 间隔多久生成一批红包
      this.addredPacketsTimer = setTimeout(() => {
        this.pushRedPackets();
      }, 200);
    },
    //清空绘制canvas,更新红包位置
    moveRedPackets() {
      // 清空canvas
      this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
      // 绘制新的一帧动画
      this.drawRedPackets();
      // 不断执行绘制，形成动画
      this.moveRedPacketAnimation = window.requestAnimationFrame(
        this.moveRedPackets
      );
    },
    //canvas红包对象绘制
    drawRedPackets() {
      // 遍历这个红包对象数组，绘制某个红包对象时，更新原来的红包对象
      this.redPacketArr.forEach((redPacket, index) => {
        const newRedPacket = {
          x: redPacket.x,
          // 每次改变y值
          y: redPacket.y + redPacket.speed,
          radius: redPacket.radius,
          img: redPacket.img,
          speed: redPacket.speed
        };
        // 替换掉原来的它
        this.redPacketArr.splice(index, 1, newRedPacket);
        if (this.redPacketArr[index].y > this.innerHeight + 500) {
          this.redPacketArr.splice(index, 1);
        }
        this.ctx.drawImage(
          redPacket.img,
          redPacket.x,
          redPacket.y,
          redPacket.radius,
          redPacket.radius * 1.5
        );
      });
    },
    clickHandler(e) {
      // console.log(e.clientX, e.clientY);
      //点击坐标
      let clickedPoint = { x: e.clientX, y: e.clientY };
      let clickedRedPacket = [];
      //循环检查点击点是否在任意redPacketArr范围内
      this.redPacketArr.forEach((redPacket, index) => {
        if (isValidClick(clickedPoint, redPacket)) {
          clickedRedPacket.push(index);
          this.clickedRedPacket++;
        }
      });
      if (clickedRedPacket.length) {
        this.redPacketArr.splice(clickedRedPacket[0], 1);
      }
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.canvasWrap {
  width: 100%;
  height: 100%;
}
.canvasWrap img {
  position: absolute;
  top: 0;
  left: 0;
}
#canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.startGameBtn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 10;
}
.score {
  position: fixed;
  left: 10px;
  top: 0;
  z-index: 10;
}
</style>
