<template>
  <div>
    <div class="wrap" v-show="!lotteryFlag">
      <div v-if="disBg" class="wrap_bg">
        <div v-if="!start" class="text">{{ timerNum }}</div>
        <button v-if="start" @click="startGame" class="button startGame">
          开始游戏
        </button>
        <button
          v-if="LotteryButtonFlag"
          @click="lotteryFlag = true"
          class="button"
        >
          去抽奖
        </button>
      </div>
      <div class="score">{{ clickedCount }},剩余{{ endCount }}s</div>
      <div class="canvasWrap" ref="canvasArea">
        <canvas class="canvas" id="canvas" @click="clickHandler"></canvas>
        <canvas class="canvas bubbleCanvas" id="bubbleCanvas"></canvas>
        <img id="canvas_bg" src="../assets/bj.jpg" alt="" />
      </div>
    </div>
    <Lottery
      @restartFromLottery="restartRainGame"
      class="lottory"
      v-if="lotteryFlag"
      :phone="phone"
    ></Lottery>
  </div>
</template>
<script>
import { randomRound, isValidClick } from "../util/util";
import Lottery from "./components/lottery";

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
      bubbleCanvas: "",
      clickedCount: 0,
      endCount: 15,
      start: true,
      disBg: true,
      timerNum: 5,
      bubbleArr: [],
      lotteryFlag: false,
      phone: "13530424394",
      LotteryButtonFlag: false,
      ctx: "",
      bubbleCtx: "",
      redPacketArr: [],
      imgArr: [
        {
          img:
            "http://pic.90sjimg.com/original_origin_pic/18/09/18/8fe63a446fb8766a5cce14ebbbbe4952.png!/fwfh/804x1201/quality/90/unsharp/true/compress/true/watermark/url/LzkwX3dhdGVyX3Y2LnBuZw==/repeat/true"
        },
        {
          img:
            "http://pic.90sjimg.com/original_origin_pic/18/09/18/8fe63a446fb8766a5cce14ebbbbe4952.png!/fwfh/804x1201/quality/90/unsharp/true/compress/true/watermark/url/LzkwX3dhdGVyX3Y2LnBuZw==/repeat/true"
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
      bubbleImage: [
        {
          img:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX/Pj7/////MzP/LS3/oKD/ysr/PDz/OTn/Njb/MDD/JSX/KSn/5ub/4+P/iYn/x8f/m5v/q6v/tbX/YmL/dHT/urr/7u7/hYX/R0f/6+v/2Nj/Wlr/9/f/UVH/rq7/eHj/HR3/aWn/v7//ERH/TEz/l5f/0tL/Q0P/d3f/gIDqnPQqAAAJsElEQVR4nO2d63ayOhCGAylJSDyfsFYrVr+6e/83uKFW5ZAAykyCtu9Pu1bxkclhJpMZ4mFrvfbm4/H4fcvJVXz7nnw2T/+ILYL4vxf9XjSYxVKGfqIsYIKYfhRKGc8GUa+/QPwWWITDz6/dUioh8mBlcSGUXO6+PodI3wSDcDWZHhUVnNXAXcW4oOo4nawQvg004eJjxGV4A1wWM5R89AFtsaCEi2BLqX8P3YXSp3QbgEICEg53RyXa4P1ACnXcAQ5KKML+TNG7bFMLyama9YG+GQjh63wpAd5eDlLI5fwV4ssBEPYGKoTF+4EM1aDXAcJF5LeaWyoZfT9qPeu0JBxGMbB5FhhFHLWcdVoRvk6lQMQ7Schpq/HYgvB1ENZtyWDEw0ELxrsJFxFFtc+smKD3j8d7CedHtPlFy+gf51YJ+xtlk++bUW3u2wPcRTijdgZgXpzOLBGu9tYGYF5M7O9wr24mXEexE7yT4ujmsMethAH3HQIS4vMAl3AUuzHQq1g8QiRck9AxX6qQ3GSptxBODi6m0LL4YYJDOJGuLfQsJm9AbE74huIE3icWvsETbvC9iFskNsCEw44BpogN/cZmhIHqxhyTFVfNVsZGhMG+O0PwKrZvhNiEMIhdwxgUN0FsQBhY95SaijUx1HrCl84CpqtGvUNVS/jSmXVepwaIdYTdNdGTWFhnqDWEXQdsMBarCQPnzlK9WM2MWkkY7F1//UaqXherCIedN9GTmKrawFURbrq3VdOLV23DKwg7t9k2q8rTMBO+PQ5ggmj2F42Eky6EZJorNHr9JsLuhCyayRzYMBCuD48FmCAeDBE4AyF5lGn0Km5C0X46eqxBeFKoDxVrCdFcXuafhWEj+u2bjnANlvpTEOOjl5PGOwRExnVDUUcYYR2+ZOzoBeMZftSMcBUjPDwVzyzLKIQk1pwvagixHArGM9kGOIRk34RwhrRbY2HWA0AiFOWgRomwT5GmGfov+xgkQkZL6QwlQiyXSexyj0Ei1DhSRcK5QnryMj+TYxESVcy7KRAujjg2yljBetAI2bGQPVUgRFoKGf0s/LJohKVFMU/4ijPNsJLpIBIymk/zyxMOcFYKNS4CIhISMTATvuIcZFPNph+RkIW5l5gjnKKsFDT/m6ITEj41EQ4lxvO0gKiERGZ3T1nCJYaNUt1+H5mQLfWEC4xXqPSAuIREZtbEDGEEP5Gy/GbUGqHI/K5Xwh58WjPTzaI2CJl/vYpyJRyAP5PRdxMgMiHxr9PbhfAV/KCp8kgImZCpy5p4IZxDBxAFq0pZRiYk4WWfeCGEXir8t8pbINiE1wXjTNgHXirUV3WaKzYhkWd37UwIG51hsrzXtkx4idicCUHnGbGszVVCJ2QqTzikgP+czspDcFGYdtAJCR3mCAGD7Ey+aN7ZW2HlwCfkuywhYHjGP2gWifVSFuwWn/AcsDkRBmARNjHQzKH9A6fWCclPstSJcAs2k1LNKvh55MQBodheCRdwAShavn39kcZGHBAyurgQfsDNpGXC0XfOgwNCQj8uhCO4xxUJ1/+dfj0XhP7oQgh45lsg7G9+SFwQMn4mXAHuSfOE88stBheERK5+CCHTn7KE66/rXtAJ4XeiVEoIGSbNEK4OGQonhN+B05QQ8rzpSviSyyhxQsiOJ8Ih5JHhmbBfuOrmhJCkcZSE8BPUrzgRjosXpdwQpod6CeEXpPP7Tbialo543BCKr29C0PSklPCfpiCBG8LUgyLeAjQGRXvBUXdG54aQLRcJIWwMihku07ohTONRxOvBZl8YDMIRoeolhAgHMho5IhRRQoh0dl+QK8JBQjizkvDsiJDPPLKOrTzKESGJ12SNcnhfkitCuSbekxN6BPxUTS9XhOGcjO08yhWhP/4jhJJDwvcnJ3wnWzs3nFwR8q2tK1yuCO1dUXNGaE1/hI+vP8LH1x/h4+uP8PH1R4io59+XPr9v8fz+4fP7+H+EQHJI+Pzx0uePeT//ucXznz09//nhLzgDfv5zfOBcDINc5mJA3+nSy2U+DWxOlEkuc6Jg89pMcpnXBpubaJLT3ETQ/FKTnOaXguYIG5/lMkcYNM/bJKd53kglTfJym6tvo9ys2/sWkHdmTHJ7Zwby3pNJbu89Qd5dM8nx3TXA+4cmOb5/CHiH1Pg0t3dIAe8Bm+T4HjDgXW6TXN/lxiqXeJV9wvx9fHwPyj5hvqYCbF0MnewTFupiwNY20T3PNmGxtgla9eCzrBOW6tNgx6OsE5ZqDOGUFLzKNmG5ThR8ra+8bBNqan3B12vLyTKhrl4bQs29rCwT6mruYdRNzMguob5uIu4RjV1Cfe1LnPqlZ9klNNQvRV0wrBKaatAi1RE+ySqhsY4wZuDUJqG5FjRWPe9UFgmr6nkjnulbJKyqyY5VV5/YJKyuq4/XJsgeYXVvBLyAjTXCuv4WaD1KrBHW9ShB6zNji7C+zwxWryBLhE16BSFFbCwRNun3hNSzyxJho55dOH3XqJUquw37rqEsiowsczLVImqlpr3zcPofsoLgn3BD/0O8Hpa4at7D8hf0If0FvWR/QT/g5+/p/Av6cv+C3uqJl/E4iKLkUTQiRGvYCa6yy9SQcIh99A2kyqZElYRegNUaGFb7yo4olYTJ9q37b5HpN2sNCb2g84bKVE1PmxpCL8ALg4OIhXVNe+oIvVmnEVlYDlvcSthpxAaADQg7PBZrx2BDwu46xDWzaHPCZF3s4ltk1evgTYSJoXZvA8ebmGhjQm/YuW242FRt1W4n7JynUeVN3EnoGcrJOxELzf7g/YQdCmyYQxbtCL3JoRvzDT/cAHgTobcmXQjehKS6AWgbQs8bOXenWGzsogxC6AXcbaE1nzdbBe8n9NZR7BAwjm6y0LsIPW+1F25MlYl9VRNlOMLEodK0ysEXp/WuEhSh199Y96iY2pSSEBAJPW9+RE2aLvH5x2KeDDaht4ioteHIBI0W9V8JmNDzXgehneHIw0FlF3M0woRxKvE9DianLfhaEiZ+YxSj2ioTctnQD0QiTMejjzbnMN+/f/yBEXpeb6BQXEcWqkG5u7ALwmQ8zpcS2FhT85y3Gn9ngRAm6s8UBUs0Ypyq2X3re1lQhImGu6MCeJNMqOOu5eySFSBhMusEW0pbzTvMp3QbtJ5dsgIlTLT4GHEZ3mWvjIeSjz5A8Tx4wlSryfSoqLgBk3FB1XE6ucM5qhUGYarh59duKZUQdRs7LoSSy93XJ+DQywmLMNWi34sGs1jK0E+UR+XpR6GU8WwQ9frQlpkVJuFJ67U3H4/H77nS6Hz7nnw2T/+Irf8BNcGLtXsMEXQAAAAASUVORK5CYII="
        }
      ]
    };
  },
  components: {
    Lottery
  },
  mounted() {
    this.initCanvas();
    this.addLotteryCount();
  },
  methods: {
    startGame() {
      this.start = !this.start;
      this.LotteryButtonFlag = false;
      this.startTimer = setInterval(() => {
        this.timerNum--;
        if (this.timerNum === 0) {
          this.timerNum = "Go!";
        }
      }, 1000);
      this.startGamer = setTimeout(() => {
        clearTimeout(this.startTimer);
        this.timerNum = 5;
        this.disBg = !this.disBg;
        this.start = !this.start;
        this.initCanvas();
        this.startRain();
      }, 6000);
    },
    startRain() {
      this.pushRedPackets(); // 不断增加红包
      this.moveRedPackets(); // 红包开始运动
      this.moveBubble(); //气泡开始
      this.endCountTimer = setInterval(() => {
        this.endCount--;
      }, 1000);
      // //倒计时15s后，停止动画
      this.runCountdownTimer = setTimeout(() => {
        this.clearTimerAndAnimation();
        alert("游戏结束！");
        this.disBg = !this.disBg;
        if (this.clickedCount >= 1) {
          this.LotteryButtonFlag = true;
          this.addLotteryCount();
        }
        this.clearData();
      }, 3000);
    },
    initCanvas() {
      this.canvas = document.getElementById("canvas");
      this.bubbleCanvas = document.getElementById("bubbleCanvas");
      if (this.canvas.getContext && this.bubbleCanvas.getContext) {
        this.ctx = this.canvas.getContext("2d");
        this.bubbleCtx = this.bubbleCanvas.getContext("2d");
        this.loadImgs(this.imgArr);
        this.loadImgs(this.bubbleImage);
      }
      this.resizeCanvas();
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
      document
        .getElementById("bubbleCanvas")
        .setAttribute("width", this.innerWidth);
      document
        .getElementById("bubbleCanvas")
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
            // 整个图片数组arr里面的图片全都加载好了
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
          speed: randomRound(this.innerHeight * 0.006, this.innerHeight * 0.008)
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
        //删除离屏红包对象
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
          clickedRedPacket.push({
            index,
            x: clickedPoint.x,
            y: clickedPoint.y
          });
        }
      });
      if (clickedRedPacket.length > 0) {
        this.clickedCount++;
        const bubble = {
          x: clickedRedPacket[0].x,
          y: clickedRedPacket[0].y,
          opacity: 1
        };
        this.bubbleArr.push(bubble);
        this.redPacketArr.splice(clickedRedPacket[0].index, 1);
      }
    },
    drawBubble() {
      this.bubbleArr.forEach((bubble, index) => {
        if (bubble.opacity > 0) {
          // 透明度渐变
          this.bubbleCtx.globalAlpha = bubble.opacity;
          this.bubbleCtx.drawImage(
            this.bubbleImage[0].img,
            bubble.x,
            bubble.y,
            this.innerWidth * 0.05,
            this.innerWidth * 0.05
          );
          const newBubble = {
            x: bubble.x + 0.2,
            y: bubble.y - 0.3,
            opacity: bubble.opacity - 0.01
          };
          this.bubbleArr.splice(index, 1, newBubble);
        }
      });
    },
    moveBubble() {
      this.bubbleCtx.clearRect(0, 0, this.innerWidth, this.innerHeight);
      // 把opacity为0的全部清除
      this.bubbleArr.forEach((bubble, index) => {
        if (bubble.opacity < 0) {
          this.bubbleArr.splice(index, 1);
        }
      });
      this.drawBubble();
      this.moveBubbleAnimation = window.requestAnimationFrame(this.moveBubble);
    },
    // checkLottoryStatus() {
    //   //刷新canvas状态
    //   this.clickedCount = 0;
    //   this.endCount = 15;
    //   this.ctx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    //   this.bubbleCtx.clearRect(0, 0, this.innerWidth, this.innerHeight);
    //   window.alert("游戏结束!");
    // },
    //抽奖数据及页面
    addLotteryCount() {
      this.$post("/addOpportunity", {
        activityId: 2019121901,
        channelName: "APP",
        opportunityQuantity: 1,
        phone: this.phone
      });
    },
    clearTimerAndAnimation() {
      clearTimeout(this.endCountTimer);
      clearTimeout(this.addredPacketsTimer);
      window.cancelAnimationFrame(this.moveRedPacketAnimation);
      window.cancelAnimationFrame(this.moveBubbleAnimation);
    },
    clearData() {
      this.canvas = "";
      this.bubbleCanvas = "";
      this.redPacketArr = [];
      this.endCount = 15;
      this.clickedCount = 0;
    },
    restartRainGame() {
      this.clearData();
      this.lotteryFlag = false;
    }
  }
};
</script>
<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.wrap_bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  color: #ffffff;
  text-align: center;
  line-height: 100%;
}
.wrap_bg .text {
  position: absolute;
  text-align: center;
  top: 40%;
  font-size: 140px;
  width: 100%;
  animation: scaleSize 1s linear infinite;
}
@keyframes scaleSize {
  0% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
/* .wrap_bg button {
  position: absolute;
  top: 40%;
  left: 50%;
} */
.canvasWrap {
  width: 100%;
  height: 100%;
}
.canvasWrap img {
  position: absolute;
  top: 0;
  left: 0;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.canvas.bubbleCanvas {
  z-index: 11;
  pointer-events: none;
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
.wrap_bg {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.el-loading-spinner .path {
  stroke: #ed4014 !important;
}
.el-loading-spinner .el-loading-text {
  color: #ed4014 !important;
}
</style>
