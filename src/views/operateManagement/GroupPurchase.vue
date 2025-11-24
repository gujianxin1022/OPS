<template>
  <div class="group-purchase-wrap">
    <!-- <el-tabs v-model="activeName"> -->
      <!-- <el-tab-pane label="拼团进度" name="purchaseProgress"> -->
        <!-- <PurchaseProgress></PurchaseProgress> -->
      <!-- </el-tab-pane> -->
      <!-- <el-tab-pane label="用户视图" name="userView">用户视图</el-tab-pane> -->
    <!-- </el-tabs> -->
    <PurchaseProgress></PurchaseProgress>
  </div>
</template>
<script>
import PurchaseProgress from './purchaseSub/PurchaseProgress'
export default {
  name: 'groupPurchase',
  components: {
    PurchaseProgress
  },
  data () {
    return {
      activeName: 'purchaseProgress'
    }
  }
}
</script>
