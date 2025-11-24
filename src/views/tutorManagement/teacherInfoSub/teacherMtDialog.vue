<template>
  <el-dialog
    :title="$t('分配教师管理人员')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    :before-close="handleClose"
  >
    <div>
      <span>{{ $t("选择教师管理人员") }}</span>
      <el-select
        v-model="selectMt"
        @change="selectMT"
        filterable
        clearable
        :placeholder="$t('请选择')"
      >
        <el-option
          v-for="item in teachPersonlist"
          :key="item.id"
          :label="item.username"
          :value="`${item.id},${item.username}`"
        >
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t("my-home-CCancel") }}</el-button>
      <el-popover
        placement="top"
        width="160"
        v-model="secondConfirmationVisible"
      >
        <p>
          {{
            $t("是否确认将该{teacherNum}名老师{isShowAll}分配给{mtName}教管？", {
              teacherNum: this.teachersData.length===1?'':this.teachersData.length,
              isShowAll:this.teachersData.length===1?'':'全部',
              mtName: this.mtName,
            })
          }}
        </p>
        <div style="text-align: right; margin: 0">
          <el-button
            size="mini"
            type="text"
            @click="secondConfirmationVisible = false"
            >{{$t('取消')}}</el-button
          >
          <el-button  type="primary" :loading="loading" @click="sure" size="mini"
            >{{$t('确定')}}</el-button
          >
        </div>
        <el-button :disabled='mtId.length<=0' slot="reference" type="primary">{{
          $t("my-home-CConfirm")
        }}</el-button>
      </el-popover>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    teachPersonlist: {
      type: Array,
      default: () => [],
    },
    teachersData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectMt: "",
      mtId: "",
      mtName: "",
      list: [],
      loading: false,
      secondConfirmationVisible: false,
    };
  },
  computed: {
    handleTacherIds() {
      return this.teachersData.map((v) => v.id);
    },
  },
  watch: {
    selectMt(val) {
      this.mtId = val.split(",")[0];
      this.mtName = val.split(",")[1];
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    sure() {
      this.loading = true;
      this.$Api.tutorManagement
        .tutorAssiginManage(this.mtId, this.handleTacherIds)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: this.$t("Allocation succeeded"),
              type: "success",
            });
            this.$emit("getTableData");
            this.handleClose();
          }
          this.loading = false;
        });
    },
  },
};
</script>