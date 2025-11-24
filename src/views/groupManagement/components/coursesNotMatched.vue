<template>
  <div class="interactionJob">
    <el-dialog
      :title="$t('查看未匹配课程')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="450"
        :header-cell-style="{ background: '#f1f1f1', color: '#000', fontSize: '14px'}"
        v-loading="loading"
      >
        <el-table-column :label="$t('上课时间')" prop="starTime" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, toRefs, watch } from '@vue/composition-api';

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    matchTeacherTime: {type: Array, default: () => ([])},
    teacherId: {type: Number, default: -1},
  },
  setup(props, {root, emit, refs}) {
    const tableData = ref([]);
    const loading = ref(false);

    const handleClose = () => {
      emit('update:dialogVisible', false);
      tableData.value = [];
    };

    const getData = async () => {
      loading.value = true;
      const params = {
        classId: +root.$route.query.id,
        startTimes: props.matchTeacherTime,
        tutorUserId: props.teacherId
      };
      await root.$Api.groupManagement.unmatchStartTime(params).then(({status, data: {code, data}}) => {
        if (status === 200) {
          data.forEach(item => {
            tableData.value.push({
              starTime: `${root.DateTimeUtils.dateClockTime(item)} （${root.Filters.mapWeek(new Date(item).getDay())}）`
            });
          });
        } else {
          tableData.value = [];
        };
      })
      .catch(() =>  tableData.value = [])
      .finally(() => loading.value = false);
    };

    onMounted(async () => {
      await getData();
    });
      

    return {
      tableData,
      loading,
      handleClose
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
