<template>
  <el-dialog
    width="980px"
    :title="$t(`修改教师开放状态`)"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-table :data="tableData" height="40vh">
      <el-table-column :label="$t('ID')">
        <template slot-scope="{ row }">
          <router-link
            v-if="
              Per.handleButtonPer('teach.tutorMT.teacherFile.tfViewTeacherFile')
            "
            target="_blank"
            :to="{
              path: `/tutorManagement/teacherInfo?id=${row.id}&teacherName=${
                row.realName || ''
              }`,
            }"
          >
            <el-button type="text">{{ row.id }}</el-button>
          </router-link>
          <span v-else>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="identityName" :label="$t('真实姓名')" />
      <el-table-column prop="realName" :label="$t('昵称')" />
      <el-table-column :label="$t('在岗状态')">
        <template slot-scope="{ row }">
          <span>{{ $t(Filters.getWorkingTxt(row.working)) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('开放状态')">
        <template slot-scope="{ row }">
          <span>{{ $t(Filters.getOpenTxt(row.hide)) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('变更原因')">
        <template slot-scope="{ row }">
          <span>{{ $t(Filters.getReasonTxt(row.hideReason)) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form
      ref="ruleForm"
      :model="formState"
      inline
      :label-width="isEn ? '170px' : '100px'"
      class="mt20"
    >
      <el-form-item :label="$t('开放状态')">
        <el-radio-group v-model="formState.hide" @change="handleHideChange">
          <el-radio
            :label="item.value"
            :key="item.value"
            v-for="item of Constants.openForTeacherList"
          >
            {{ $t(item.label) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <br />
      <el-form-item
        v-if="showHideReason"
        prop="hideReason"
        :rules="[{ required: true, message: $t('请输入') }]"
      >
        <div slot="label">
          <el-tooltip
            effect="dark"
            :content="$t('同一批老师变更原因相同，若原因不同请分别操作')"
            placement="top-start"
          >
            <span class="change-reason">
              {{ $t("变更原因") }}
              <i class="el-icon-question"></i>
            </span>
          </el-tooltip>
        </div>
        <el-select
          v-model="formState.hideReason"
          @change="formState.hideReasonRemark = ''"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="(item, index) in hideReasonList"
            :key="index"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="showHideReasonRemark"
        prop="hideReasonRemark"
        :rules="[{ required: true, message: $t('请输入原因') }]"
      >
        <el-input
          :maxlength="20"
          :placeholder="$t('请输入原因')"
          style="width: 196px"
          v-model="formState.hideReasonRemark"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleClose">
        {{ $t("取消") }}
      </el-button>
      <el-button type="primary" @click="handleOk" :loading="confirmLoading">
        {{ $t("确定") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  reactive,
  ref,
  watchEffect,
  computed,
  unref,
} from "@vue/composition-api";

import Constants from "@/utils/constants";

export default {
  props: {
    visible: { type: Boolean, default: false },
    hide: { type: Number, default: void 0 },
    working: { type: Number, default: void 0 },
    tableData: { type: Array, default: () => [] },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const formState = reactive({
      hide: void 0,
      hideReason: void 0,
      hideReasonRemark: "",
    });

    watchEffect(() => (formState.hide = props.hide));

    const showHideReason = computed(
      () => formState.hide > 0 /* 全部可教（试听/正式） */
    );

    const showHideReasonRemark = computed(
      () => formState.hideReason === 8 /* 其他*/
    );

    const hideReasonList = computed(() => {
      return Constants.reasonList;
    });

    const handleHideChange = () => {
      formState.hideReason = void 0;
      formState.hideReasonRemark = "";
    };

    const confirmLoading = ref(false);

    const handleClose = () => {
      emit("update:visible", false);
    };
    const handleOk = async () => {
      if (props.working !== 1) return handleClose();
      await refs.ruleForm.validate();
      try {
        confirmLoading.value = true;
        const params = {
          tutorUserIdList: props.tableData.map((item) => item.id),
          ...formState,
        };
        await root.$Api.tutorManagement.updateTeacherOpenState(params);
        emit("ok");
        handleClose();
      } finally {
        confirmLoading.value = false;
      }
    };

    return {
      isEn,
      showHideReason,
      showHideReasonRemark,
      hideReasonList,
      formState,
      confirmLoading,

      handleHideChange,
      handleClose,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  &::before {
    display: none;
  }
}
.change-reason {
  position: relative;
  &::before {
    content: "*";
    color: red;
    position: absolute;
    font-weight: bold;
    left: -8px;
  }
}
</style>
