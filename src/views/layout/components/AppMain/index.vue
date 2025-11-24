<template>
  <section class="app-main flex-wrapper flex-direction-column">
    <div
      ref="pageTitle"
      :style="titleStyle"
      class="page-title flex-wrapper flex-column-center"
    >
      <div
        class="route-item"
        v-for="(item, index) in routesMemoryList"
        :key="index"
        :class="{'route-item-active': isActiveRoute(item)}"
        @click="changeRoute(item)"
      >
        <span v-if="item.name === 'studentInfo'" class="route-name">{{
          item.query.studentName
        }}</span>
        <span v-else>
          <span v-if="item.name === 'notification'" class="route-name">{{
            item.query.name ||
            (currentLang == "en"
              ? item.meta.title.nameEn
              : item.meta.title.nameZh)
          }}</span>
          <span v-else class="route-name">{{
            currentLang == "en"
              ? item.meta.title.nameEn
              : item.meta.title.nameZh
          }}</span>
        </span>
        <div
          class="route-item-active-close"
          @click.stop="deleteRoute(item, index)"
          v-if="routesMemoryList.length>1"
          :data-length="routesMemoryList.length"
        ><span class="el-icon-close"></span></div>
      </div>
    </div>
    <div
      ref="scrollDom"
      class="flex-item"
    >
      <div class="main-wraper">
        <!-- noKeepAlive: 设置页面是否需要缓存 true: 不缓存 false: 缓存 -->
        <keep-alive
          v-if="cacheComponents"
          :exclude="excludeCacheComponentsList"
        >
          <router-view
            class="main-container-box"
            :key="key"
          />
        </keep-alive>
        <router-view
          v-else
          class="main-container-box"
          :key="key"
        />
      </div>
    </div>

  </section>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'AppMain',
  data () {
    return {
      scrollDom: null,
      cacheComponents: process.env.COMPONENTS_CACHE === 'cache',
    }
  },
  watch: {},
  computed: {
    currentPage () {
      return this.$route.fullPath
    },
    cachedViews () {
      return ['clearingList', 'appealList', 'unitReport', 'firstClassFeedback']
    },
    key () {
      return this.$route.fullPath
    },
    titleStyle () {
      return `left: ${this.device === 'mobile' ? '0px' : this.isCollapse ? '60px' : '180px'}`
    },
    isCollapse () {
      return !this.sidebar.opened
    },
    ...mapGetters([
      'secondMenuIndex',
      'themeColor',
      'pageTitle',
      'sidebar',
      'device',
      'routesMemoryList',
      'currentLang',
      'excludeCacheComponentsList'
    ]),
  },
  methods: {
    deleteRoute (item, index) {
      this.deleteThisRoute([item, index, 'no_cache'])
      if (item.fullPath === this.currentPage) {
        if (index > 0) {
          this.$router.push({
            name: this.routesMemoryList[index - 1].name,
            query: this.routesMemoryList[index - 1].query,
            params: {
              delete: true
            }
          })
        } else {
          this.$router.push({
            name: this.routesMemoryList[0].name,
            query: this.routesMemoryList[0].query,
            params: {
              delete: true
            }
          })
        }
      }
    },
    changeRoute (item) {
      if (item.fullPath !== this.currentPage) {
        this.$router.push({
          path: item.path,
          query: {
            ...item.query
          }
        })
      }
    },
    // 刷新
    refresh () {
      location.reload()
    },
    ...mapMutations({
      'deleteThisRoute': 'DELETE_ROUTE'
    }),
    // tag-view 判断是否是当前路由
    isActiveRoute(routeItem){
      if(this.$route.name === 'im' && routeItem.name === 'im'){
        return true;
      }
      return this.currentPage === routeItem.fullPath;
    }
  },
}

</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.app-main {
  padding-top: 30px;
  position: relative;
  overflow: hidden;
  flex: 1;
  box-sizing: border-box;

  .page-title {
    position: fixed;
    right: 0;
    top: 50px;
    left: 180px;
    padding-left: 20px;
    height: 30px;
    transition: all 0.3s;
    z-index: 101;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    background-color: #fff;
    white-space: nowrap;
    overflow-x: auto;
    div.route-item {
      display: flex;
      height: 24px;
      line-height: 24px;
      color: #495060;
      margin-right: 10px;
      border: 1px solid #d8dce5;
      padding: 0 8px;
      font-size: 12px;
      cursor: pointer;
      align-items: center;
      font-family: 'Courier New', Courier, monospace;
      .route-item-active-close {
        width: 16px;
        height: 16px;
        border-radius: 10px;
        margin-left: 5px;
        line-height: 16px;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        color: #495060;
        &:hover {
          background-color: #b4bccc;
        }
      }
    }

    div.route-item-active {
      background-color: $customPrimaryColor;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      .route-item-active-close {
        color: white;
      }
      .route-name::before {
        content: "";
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 3px;
      }
    }

    @include font-style(14px, #999);

    .line {
      padding-left: 6px;
      height: 20px;
      line-height: 20px;
    }
  }
}

.main-wraper {
  background: #f4f4f4;
  padding: 15px;

  .main-container-box {
    background: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 122px);
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
