<template>
  <div class="commodityManage">
    <el-radio-group v-model="listType">
      <el-radio-button label="SPUList">{{$t('交易 - SPU列表')}}</el-radio-button>
      <el-radio-button label="SKUList">{{$t('交易 - SKU列表')}}</el-radio-button>
    </el-radio-group>
    <component :is="listType" />
  </div>
</template>

<script>
import SPUList from './components/SPUList.vue';
import SKUList from './components/SKUList.vue';

export default {
  // name: 'commodityManage',
  components: {SPUList, SKUList},
  data() {
    return {
      listType: "SPUList",
    }
  },
  mounted() {
    // 查看tabID是否有值，有值需展示到对应的tab页
    const tabID = window.sessionStorage.getItem('tabID');
    if (tabID) {
      this.listType = tabID;
      window.sessionStorage.setItem('tabID', '');
    }
  },
  watch: {
    listType: {
      handler( newData ) {
        window.sessionStorage.setItem('tabID', newData);
      },
    }
  },
  beforeRouteLeave (to, from, next) {
    // 判断离开后的页面是否是sku管理，如果不是清空tabID
    if (to.path !== '/system/SKUManage') {
      window.sessionStorage.setItem('tabID', '');
    }
    next();
  }
}
</script>

<style lang='scss' scoped>
.commodityManage {
  padding: 20px;
}
</style>