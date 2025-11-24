<template>
  <el-dialog
    :title="$t('预排课')"
    :show-close="true"
    :visible.sync="show"
    :before-close="close"
    custom-class="m-scroll-height"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-table
      :data="startTimes"
      height="380"
      stripe
      :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
      style="width: 100%">
      <el-table-column
        type="index"
        width="120"
        :label="$t('序号')">
      </el-table-column>
      <el-table-column
        :label="$t('上课时间 bj')">
        <template slot-scope="scope">
          <span>{{DateTimeUtils.timeHaveWeek(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index)"
            type="text"
            size="small">
            {{$t('删除本节课')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      v-show="tableData.total > 0"
      class="fr"
      layout="prev, pager, next"
      :size="tableData.pageSize"
      @current-change="getData()"
      :total="tableData.total"
    ></el-pagination> -->
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ["show","startTimes"],
  data() {
    return {
   
    }
  },
  watch: {

  },
  methods: {
    close() {
      this.$emit("close");
    },
    deleteRow(index) {
      this.$emit("removeRow", index)
    },
    getData() {

    }
  }
};
</script>
