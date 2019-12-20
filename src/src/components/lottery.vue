/* eslint-disable no-console */
<template>
  <div>
    <!-- <span>Prize number: {{ prizeNumber }}</span> -->
    <!-- <button
      type="button"
      @click="!rolling && prizeNumber < 8 && prizeNumber++"
      :disabled="rolling || prizeNumber === 8"
    >
      Add
    </button>
    <button
      type="button"
      @click="!rolling && prizeNumber > 2 && prizeNumber--"
      :disabled="rolling || prizeNumber === 2"
    >
      Remove
    </button> -->
    <div class="wheel-wrapper">
      <div class="upArrow"></div>
      <div class="wheel-pointer" @click="onClickRotate">
        Start
      </div>
      <div class="wheel-bg" :class="{ freeze: freeze }" :style="`transform: rotate(${wheelDeg}deg)`">
        <div class="prize-list">
          <div class="prize-item-wrapper" v-for="(item, index) in prizeList" :key="index">
            <div class="prize-item" :style="
                `transform: rotate(${(360 / prizeList.length) * index}deg)`
              ">
              <div class="prize-name">
                {{ item.name }}
              </div>
              <div class="prize-icon">
                <img :src="item.icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="$emit('restartFromLottery')" class="startGameBtn">去玩红包雨</button>
    <div class="showCount">您剩余抽奖次数:{{ remainingOpportunityCount }}</div>
    <img src="../../assets//redBacketBG.png" alt="" class="lottery_bg">
  </div>
</template>
<script>
  let activityName = "";
  let prizeName = "";
  let opportunity = true;
  let wonFlag = true;
  let prizeId = 0;
  export default {
    data() {
      return {
        freeze: false,
        rolling: false,
        wheelDeg: 0,
        prizeNumber: 8,
        remainingOpportunityCount: 0,
        prizeList: [
          {
            icon: "https://picsum.photos/40?random=1",
            name: "100元话费券"
          },
          {
            icon: "https://picsum.photos/40?random=1",
            name: "50元流量券"
          },
          {
            icon: "https://picsum.photos/40?random=6",
            name: "iphone 11"
          },
          {
            icon: "https://picsum.photos/40?random=2",
            name: "200元电商优惠券"
          },
          {
            icon: "https://picsum.photos/40?random=6",
            name: "Thank you!"
          }
        ]
      };
    },
    props: ["phone"],
    mounted() {
      this.getRemainOpportunityCount();
    },
    methods: {
      onClickRotate() {
        if (this.rolling) {
          return;
        }
        activityName = "";
        prizeName = "";
        opportunity = true;
        wonFlag = true;
        if (!this.remainingOpportunityCount) {
          alert("您已无抽奖机会,再多玩几次吧!");
          return;
        }
        this.rolling = true;
        this.getLotteryResult();
      },
      dealLotteryEndStatus() {
        if (prizeName && activityName && wonFlag) {
          window.alert(
            "恭喜您在" +
            `${activityName}` +
            "活动中获得" +
            `${prizeName}` +
            "奖品!"
          );
        } else if (!opportunity) {
          window.alert("您已无抽奖机会,再多玩几次吧!");
        } else if (!wonFlag) {
          window.alert("很遗憾您未抽到奖品,下次准能中!");
        }
      },
      getRemainOpportunityCount() {
        this.$post("/remainingOpportunity", {
          activityId: 2019121901,
          channelName: "APP",
          phone: this.phone
        }).then(res => {
          if (res && res.data.status) {
            console.log("getRemain", res.data.data);
            this.remainingOpportunityCount = res.data.data;
          } else {
            alert("获取抽奖信息失败!");
            this.remainingOpportunityCount = 0;
          }
        });
      },
      getLotteryResult() {
        this.$post("/lottery", {
          activityId: 2019121901,
          channelName: "APP",
          phone: this.phone
        })
          .then(res => {
            if (res && res.data) {
              if (res.data.success) {
                let data = res.data.data;
                let prizeIdStr = data.prizeId.toString();
                activityName = data.activityName;
                prizeName = data.prizeName;
                prizeId = Number(prizeIdStr.charAt(prizeIdStr.length - 1)) - 1;
                console.log(prizeId);
              } else if (res.data.code == "NO_OPPORTUNITY") {
                wonFlag = false;
                opportunity = false;
                prizeId = this.prizeList[this.prizeList.length - 1];
              } else if (res.data.code == "NOT_WON") {
                wonFlag = false;
              }
            }
            this.runRotateAction();
            this.getRemainOpportunityCount();
          })
          .catch(err => {
            console.log(err);
          });
      },
      runRotateAction() {
        this.wheelDeg =
          this.wheelDeg -
          (this.wheelDeg % 360) +
          6 * 360 +
          (360 - (360 / this.prizeList.length) * prizeId);
        setTimeout(() => {
          this.rolling = false;
          this.dealLotteryEndStatus();
        }, 4500);
      }
    }
    // watch: {
    //   prizeNumber() {
    //     this.freeze = true;
    //     this.wheelDeg = 0;
    //     this.freeze = false;
    //   }
    // }
  };
</script>
<style>
  
  .wheel-wrapper {
    width: 300px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

  }
  .showCount{
    color: #fff;
  }

  .wheel-pointer {
    width: 60px;
    height: 60px;
    border-radius: 1000px;
    background: #FFB86C;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 60px;
    z-index: 10;
    cursor: pointer;
  }

  .wheel-pointer::before {}

  .wheel-bg {
    width: 100%;
    height: 100%;
    border-radius: 1000px;
    overflow: hidden;
    transition: transform 4s ease-in-out;
    background: rgba(255, 0, 0, 0.7);
    color: #fff;
  }

  .wheel-bg.freeze {
    transition: none;
    background: red;
  }

  .prize-list {
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
  }

  .prize-item-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 150px;
  }

  .prize-item {
    width: 100%;
    height: 100%;
    transform-origin: bottom;
  }

  .prize-item .prize-name {
    padding: 16px 0;
  }

  .upArrow {
    /*箭头占位符，规定宽高等*/
    width: 15px;
    height: 25px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -240%);
    z-index: 10;
  }

  .upArrow:before,
  .upArrow:after {
    /*伪元素相同属性提取*/
    content: "";
    border-color: transparent;
    /*边框颜色透明*/
    border-style: solid;
    position: absolute;
    /*绝对定位，分别定位before和after描绘的内容*/
  }

  .upArrow:before {
    /*伪元素before绘制箭头尾部矩形*/
    border: none;
    background: #869B74;
    height: 100%;
    width: 30%;
    top: 50%;
    left: 36%;
  }

  .upArrow:after {
    /*伪元素after绘制箭头的头部三角形*/
    /* left: 3px; */
    top: -5%;
    border-width: 7px;
    border-bottom-color: #869B74;
    /*如果绘制向下三角形的话，用border-top-color:#555;*/
  }

  .startGameBtn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #fff;
    color: #fff;
    border-radius: 14px;
    background: #ca2cbe;
  }
  .lottery_bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
</style>