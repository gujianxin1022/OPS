<template>
  <!-- 批量增加教学权限页面 -->
  <div class="teaching-permission-configuration-warp">
    <h3>
      {{
        $t(
          "批量添加教学权限（批量操作涉及数据量大，请谨慎操作，单次最多支持1000条数据）"
        )
      }}
    </h3>
    <el-form
      v-loading="loading"
      :model="ruleForm"
      :rules="rules"
      ref="myForm"
      :label-width="isEn ? '150px' : '100px'"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="$t('添加理由')"
        prop="reason"
      >
        <el-input
          style="width: 520px"
          maxlength="100"
          :placeholder="$t('请输入添加权限的理由，不超过100字')"
          type="textarea"
          :rows="4"
          v-model="ruleForm.reason"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('上课方式')"
        prop="classTypeIdList"
      >
        <el-checkbox-group v-model="ruleForm.classTypeIdList">
          <el-checkbox
            v-for="item in classTypeList"
            :key="item.typeCode"
            :label="item.typeCode"
          >{{ isEn ? item.typeNameEn : item.typeNameCn }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        :label="$t('课程树')"
        prop="curEditionId"
      >
        <el-select
          filterable
          clearable
          v-model="ruleForm.curEditionId"
          :placeholder="$t('请选择课程树')"
        >
          <el-option
            v-for="item in editionList"
            :key="item.editionId"
            :label="isEn ? item.editionNameOpsEn : item.editionNameOpsZh"
            :value="item.editionId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="addCourseIdList">
        <div class="level-warp">
          <el-checkbox
            @change="handleSelectAll"
            v-if="levelList.length > 0"
            v-model="selectAll"
          >{{
            $t("全选")
          }}</el-checkbox>
          <el-checkbox-group v-model="ruleForm.addCourseIdList">
            <el-checkbox
              v-for="item in levelList"
              :key="item.levelId"
              :label="item.levelId"
            >{{ "level" + item.levelNo }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('批量数据')"
        prop="tutorUserIdList"
      >
        <el-input
          style="width: 520px;float:left"
          type="textarea"
          :rows="12"
          :placeholder="$t('每行一个教师ID，以回车分割，最多1000条')"
          v-model="ruleForm.tutorUserIdList"
        />
        <div
          style="vertical-align: top;color:#969696;float:left;margin-left:20px;line-height:20px"
        >
          <p>{{$t('提示:')}}</p>
          <p>{{$t('1、重复的教师ID只会对一个生效。')}}</p>
          <p>{{$t('2、若新增的权限老师已经有了，则权限无变化，也无修改记录。')}}</p>
        </div>
      </el-form-item>
      <div
        class="error-message"
        :style="isEn ? 'padding-left: 150px;' : 'padding-left: 100px;'"
        v-if="errNum !== 0"
      >
        <el-alert
          :title="
            $t('XX条数据有问题，请修正后点击确定添加', { number: errNum }) +
            '。' +
            $t('原因') +
            '：' +
            $t('账号不存在或格式错误')
          "
          type="error"
          :center="false"
          :closable="false"
          show-icon
        >
        </el-alert>
      </div>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')"> {{ $t("重置") }}</el-button>
        <el-popover
          placement="top"
          width="160"
          trigger="manual"
          v-model="visible"
        >
          <p>{{ $t("确定要进行批量添加教师权限吗？") }}</p>
          <div style="text-align: right; margin: 0">
            <el-button
              size="mini"
              type="text"
              @click="visible = false"
            >{{
              $t("取消")
            }}</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="submitForm('ruleForm')"
            >{{ $t("确定") }}</el-button>
          </div>
          <el-button
            @click="validateForm"
            slot="reference"
            type="primary"
          >{{
            $t("提交")
          }}</el-button>
        </el-popover>
      </el-form-item>
    </el-form>
    <el-dialog
      :title="$t('提醒')"
      :visible.sync="dialogVisible"
      width="30%"
      :center="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <span>{{
        $t("{successNumber}条数据已经处理完成", {
          successNumber: successNumber,
        })
      }}</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="(dialogVisible = false), resetForm()"
        >{{ $t("知道了") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  ref,
  toRefs,
  computed,
  watch,
} from "@vue/composition-api";
export default {
  name: "teachingPermissionConfiguration",
  setup (_, { root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const visible = ref(false);
    const selectAll = ref(false);
    const ruleForm = reactive({
      curEditionId: "",
      addCourseIdList: [],
      classTypeIdList: [],
      reason: "",
      tutorUserIdList: "",
    });
    const validatePass = (rule, value, callback) => {
      if (
        ruleForm.classTypeIdList.length > 0 ||
        ruleForm.addCourseIdList.length > 0
      ) {
        callback();
      } else {
        callback(root.$t("请先选择一个上课方式或者课程树的level"));
      }
    };
    const rules = reactive({
      addCourseIdList: [
        {
          validator: validatePass,
          trigger: "change",
        },
      ],
      reason: [
        { required: true, message: root.$t("请填写理由"), trigger: "blur" },
      ],
      tutorUserIdList: [
        { required: true, message: root.$t("请填写教师ID"), trigger: "blur" },
      ],
    });
    let optionList = reactive({
      classTypeList: [],
      courseTypeList: [],
    });
    const editionList = ref([]);
    const levelList = ref([]);
    const errNum = ref(0);
    const loading = ref(false);
    const dialogVisible = ref(false);
    const successNumber = ref(0);
    const submitForm = async () => {
      const { classTypeIdList, reason, addCourseIdList, tutorUserIdList } =
        ruleForm;
      visible.value = false;
      loading.value = true;
      try {
        const {
          status,
          data: { code, data, message },
        } = await root.$Api.tutorManagement.updateTeacherPowerAndClassType({
          classTypeIdList,
          reason,
          addCourseIdList,
          tutorUserIdList: tutorUserIdList.split("\n"),
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        if (data == null && message === "操作成功") {
          errNum.value = 0;
          successNumber.value = tutorUserIdList.split("\n").length;
          dialogVisible.value = true;
          selectAll.value = false;
        } else {
          errNum.value = data.length;
          let importData = tutorUserIdList.split("\n");
          data.forEach((item) => {
            importData[item.index] = `${importData[item.index]} (${item.message
              })`;
          });
          ruleForm.tutorUserIdList = importData.join(";").replace(/\;/g, "\n");
        }
      } finally {
        loading.value = false;
      }
    };
    const getOptionList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.tutorManagement.getCourseBasicInfoList();
      if (status !== 200 || code !== 200) return Promise.reject();
      optionList.classTypeList = data.classTypeList || [];
    };
    const getAllCourseTree = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.courseTree.reqAllCourseTreeList();
      if (status !== 200 || code !== 200) return Promise.reject();
      editionList.value = data;
    };
    watch(
      () => ruleForm.curEditionId,
      (val) => {
        if (val) {
          let curEdition = editionList.value.filter((v) => {
            return v.editionId === val;
          });
          levelList.value = curEdition[0].levelInfoList || [];
          selectAll.value = false;
          ruleForm.addCourseIdList = [];
        } else {
          levelList.value = [];
        }
      }
    );
    // watch(
    //   () => selectAll.value,
    //   (val) => {
    //     if (val) {
    //       ruleForm.addCourseIdList = levelList.value.map((e) => {
    //         return e.levelId;
    //       });
    //     } else {
    //       ruleForm.addCourseIdList = [];
    //     }
    //   }
    // );
    watch(
      () => ruleForm.addCourseIdList,
      (val) => {
        if (!val.length) return;
        selectAll.value = val.length === levelList.value.length;
      }
    );

    const validateForm = async () => {
      await refs.myForm.validate();
      visible.value = true;
    };
    const resetForm = async () => {
      refs.myForm.resetFields();
    };
    const handleSelectAll = (val) => {
      if (val) {
        ruleForm.addCourseIdList = levelList.value.map((e) => {
          return e.levelId;
        });
      } else {
        ruleForm.addCourseIdList = [];
      }
    }
    onMounted(async () => {
      await getOptionList();
      await getAllCourseTree();
    });
    return {
      isEn,
      ruleForm,
      rules,
      submitForm,
      ...toRefs(optionList),
      editionList,
      levelList,
      resetForm,
      validateForm,
      visible,
      errNum,
      loading,
      dialogVisible,
      successNumber,
      selectAll,
      handleSelectAll
    };
  },
};
</script>

<style lang="scss" scoped>
.teaching-permission-configuration-warp {
  padding: 10px 20px;
  .level-warp {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 20px;
    min-height: 100px;
  }
  .error-message {
    margin-bottom: 20px;
  }
}
</style>