<template>
  <div class="main">
    <div class="nav-list" ref="listItem" @mouseleave="mouseLeaveHandle">
      <div
        v-for="(nav,index) in navs"
        :key="index"
        class="nav-item"
        :class="{active:itemActive===index}"
        @mouseenter="setCurrentNav(index)"
        @click="setActiveNav(index)"
      >{{nav.name}}</div>
      <div class="nav-underline" :style="navUnderlineStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "articallist",
  data() {
    return {
      currentNav: "",
      currentNavStyle: {},
      itemActive: "",
      activeNavStyle: {},
      navs: [
        { name: "1" },
        { name: "Gardelli" },
        { name: "V60" },
        { name: "Geisha" },
        { name: "Visual Studio Code" }
      ]
    };
  },
  methods: {
    setCurrentNav(index) {
      this.currentNav = index;
      this.currentNavStyle = this.getNavStyle(index);
    },
    getNavStyle(index) {
      let childNodes = this.$refs.listItem.childNodes;
      let width = childNodes[index].clientWidth;
      let left = 0;
      if (index > 0) {
        for (let i = 0; i < index; i++) {
          left += childNodes[i].clientWidth;
        }
      }
      return { width, left };
    },
    setActiveNav(index) {
      this.itemActive = index;
      this.activeNavStyle = this.getNavStyle(index);
    },
    mouseLeaveHandle() {
      this.currentNavStyle = null;
    }
  },
  computed: {
    navUnderlineStyle() {
      let style = this.currentNavStyle || this.activeNavStyle;
      console.log(`${style.width}px`);
      return {
        width: `${style.width}px`,
        left: `${style.left}px`
      };
    }
  }
};
</script>
<style scoped>
.main {
  font-family: "Segoe UI";
  height: 100%;
  display: flex;
  justify-content: center;
}
.main .nav-list {
  position: relative;
  height: 36px;
}
.main .nav-list .nav-item {
  font-size: 16px;
  list-style: none;
  padding: 10px;
  margin: 0;
  float: left;
  text-align: center;
  cursor: pointer;
}

.main .nav-list .nav-underline {
  position: absolute;
  bottom: 0;
  display: block;
  height: 2px;
  background-color: red;
  transition: all 0.2s ease-out;
}
.active {
  color: red;
}
</style>