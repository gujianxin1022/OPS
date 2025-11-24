<template>
  <div v-if="data" class="statistics">
    <el-statistic :title="$t('评价量')" :value="data.evaluateCount"></el-statistic>
    <el-statistic :title="$t('教师评分')">
      <template slot="formatter">
        {{ data.teacherRating }}
      </template>
    </el-statistic>
    <el-statistic v-for="item in starList" :key="item.star" :title="item.label">
      <template slot="formatter">
        {{ Math.round((item.value)) }}%
      </template>
    </el-statistic>
  </div>
  <div v-else class="statistics empty-wrapper">{{ $t('无数据') }}</div>
</template>

<script>
export default {
  name: 'Statistics',
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {

    };
  },
  computed: {
    starList() {
      const summaryData = this.data || {};
      console.log('summaryData', this.data, this);
      const list = [
        {
          star: 5,
          label: this.$tc('x星', 2, { x: 5 }),
          value: summaryData.fiveStarRatio, // 五星比例, 例如：37.5
        },
        {
          star: 4,
          label: this.$tc('x星', 2, { x: 4 }),
          value: summaryData.fourStarRatio,
        },
        {
          star: 3,
          label: this.$tc('x星', 2, { x: 3 }),
          value: summaryData.threeStarRatio,
        },
        {
          star: 2,
          label: this.$tc('x星', 2, { x: 2 }),
          value: summaryData.twoStarRatio,
        },
        {
          star: 1,
          label: this.$tc('x星', 1, { x: 1 }),
          value: summaryData.oneStarRatio,
        }
      ];
      // return list.sort((a, b) => b.star - a.star);
      return list;
    }
  },
};
</script>

<style scoped>
.statistics {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  border-top: 1px solid #ebeef5;
  padding: 20px 0;
}

.empty-wrapper {
  text-align: center;
  color: #c0c4cc;
}
</style>
