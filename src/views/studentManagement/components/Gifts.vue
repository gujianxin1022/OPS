<template>
  <el-table
    class="gifts-warp"
    :data="listData"
    :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
  >
    <el-table-column
      :label="$t('赠品')"
      minwidth="250"
      :prop="isEn ? 'campaignTitleEn' : 'campaignTitle'"
    >
    </el-table-column>
    <el-table-column prop="value" :label="$t('数量')" minwidth="80">
    </el-table-column>
    <el-table-column
      v-if="showValidity"
      :prop="isEn ? 'descriptionEn' : 'descriptionZh'"
      :label="$t('有效期')"
      minWidth="250"
    >
      <template v-slot="{ row }">
        <div v-if="row.descriptionZh">
          {{ row.descriptionZh }}
          <el-popover
            v-if="row.hasTips"
            placement="top-start"
            width="300"
            trigger="hover"
            :content="isEn ? row.tipsContentEn : row.tipsContentZh"
          >
            <i style="cursor: pointer;" slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
        <div v-else>-</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";
export default {
  props: {
    listData: {
      type: Array,
      default: [],
    },
    showValidity:{
      type: Boolean,
      default: true,
    }
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    onMounted(() => {
      console.log(props.listData);
    });
    return {
      isEn,
    };
  },
};
</script>
<style scoped lang="scss">
.gifts-warp {
  display: inline-block;
  width: 600px;
}
</style>
<!-- <style>
.my-label {
  background: #9199ea !important;
  color: #fff !important;
}
</style> -->
