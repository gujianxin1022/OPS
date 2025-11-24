<template>
  <div>
    <el-dialog
      :title="$t('创建老师账号')"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        ref="teacherAccountForm"
        :rules="rules"
        :model="form"
        :label-width="currentLang === 'en' ? '150px' : '100px'"
      >
        <el-form-item
          prop="identify"
          :label="$t('my-home-Teacher\'s Account') + ':'"
        >
          <el-input
            v-model="form.identify"
            type="text"
            :placeholder="$t('请使用邮箱或者手机号')"
          />
        </el-form-item>
        <el-form-item prop="realName" :label="$t('昵称') + ':'">
          <el-input
            v-model="form.realName"
            type="text"
            :placeholder="$t('glb-input')"
          />
          <span class="span-info text-wrap"
            >{{ $t("教师昵称会展示给用户，请按要求进行填写～") }}({{
              $t("例：中国老师：")
            }}李华华：<span class="span-warn">Huahua LI</span>；{{
              $t("非中国老师：")
            }}Jessica Koh WANG：<span class="span-warn">Jessica K. W.</span
            >)</span
          >
        </el-form-item>
        <el-form-item prop="gender" :label="$t('Teacher Gender') + ':'">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">{{ $t("男") }}</el-radio>
            <el-radio :label="2">{{ $t("女") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="businessLine" :label="$t('所属业务') + ':'">
          <el-radio-group v-model="form.businessLine">
            <el-radio disabled :label="1">{{ $t("中文直播课") }}</el-radio>
            <el-radio disabled :label="2">{{ $t("英文直播课") }}</el-radio>
            <el-radio disabled :label="3">{{ $t("数学直播课") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item prop="source" :label="$t('渠道来源') + ':'">
          <el-radio-group v-model="form.source">
            <el-radio :label="2">{{ $t("自主招聘") }}</el-radio>
            <el-radio :label="5">{{ $t("供应商合作") }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t("确定") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from "@vue/composition-api";

export default {
  props: {
    dialogVisible: { type: Boolean, default: false },
    parentBusinessLine: { type: Number, default: void 0 },
  },
  setup(props, { root, emit, refs }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const form = reactive({
      identify: "",
      realName: "",
      gender: "",
      businessLine: "",
      // source: 1,
    });
    const rules = computed(() => ({
      identify: [
        { required: true, message: root.$t("glb-input"), trigger: "blur" },
      ],
      realName: [
        { required: true, message: root.$t("glb-input"), trigger: "blur" },
      ],
      gender: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      businessLine: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      // source: [
      //   { required: true, message: root.$t("请选择"), trigger: "change" },
      // ],
    }));

    const confirm = () => {
      refs["teacherAccountForm"].validate((valid) => {
        if (valid) {
          root.$Api.tutorManagement
            .createTeacherAccount(form)
            .then(({ status, data: { code, data } }) => {
              if (status === 200 && code === 200) {
                root.$message.success("添加成功");
                let url = `/tutorManagement/teacherInfo?id=${data}&teacherName=${
                  form.realName ? form.realName : ""
                }`;
                window.open(url, "__blank");
                handleClose();
                emit("updateTabel");
              }
            });
        }
      });
    };
    const handleClose = () => {
      emit("update:dialogVisible", false);
      refs["teacherAccountForm"].resetFields();
    };

    const setBusinessLine = () => {
      form.businessLine = props.parentBusinessLine;
    };

    onMounted(() => {
      setBusinessLine();
    });

    return {
      currentLang,
      form,
      rules,
      confirm,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-box {
  text-align: right;
  margin: 0 0 10px;
}
.span-info {
  color: #a3a3a3;
  font-size: 12px;
}
.span-warn {
  color: #ff0000;
}
</style>
