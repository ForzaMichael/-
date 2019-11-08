<template>
  <div class="main">
    <nav>
      <ul class="nav-list" ref="listItem">
        <li v-for="(nav,index) in navs" :key="index" @mouseenter="setCurrentNav(index)">{{nav.name}}</li>
      </ul>
    </nav>
    <div class="nav-underline" :style="navUnderlineStyle"></div>
  </div>
</template>

<script>
export default {
  name: "articallist",
  data() {
    return {
      currentNav: "",
      currentNavStyle: {},
      navs: [
        { name: "1" },
        { name: "Gardelli" },
        { name: "geisha" },
        { name: "v60" },
        { name: "visual studio code" }
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
    }
  },
  computed: {
    navUnderlineStyle() {
      let style = this.currentNavStyle;
      return {
        width: `${style.width}px`,
        left: `${style.left}px`
      };
    }
  }
};
</script>
<style scoped>
.main .nav-list li {
  list-style: none;
  padding: 10px;
  margin: 0;
  float: left;
}

.nav-underline {
  position: absolute;
  bottom: 0;
  display: block;
  height: 2px;
  background-color: red;
  transition: all 0.2s ease-out;
}
</style>