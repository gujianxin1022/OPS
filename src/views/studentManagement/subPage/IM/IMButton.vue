<template>
  <el-popover v-if="visible" v-model="popupVisible" trigger="manual">
    <el-button
      slot="reference"
      class="im-button"
      type="primary"
      :loading="btnLoading"
      @click="handleClick"
      >{{ $t("打开会话窗口") }}</el-button
    >
    <div class="popup-confirm">
      <div class="popup-row">
        <label class="popup-label">{{ $t("会话身份") }}:</label>
        <el-radio-group v-model="selectedRole" size="mini">
          <el-radio-button
            v-for="item in roleList"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="popup-row">
        <label class="popup-label">{{ $t("会话类型") }}</label>
        <el-radio-group
          class="subject-list"
          v-model="selectedSubject"
          size="mini"
        >
          <el-radio
            v-for="item in subjectList"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="popup-footer">
        <el-button @click="closePopup">{{ $t("取消") }}</el-button>
        <el-button type="primary" :disabled="subjectList.length === 0" :loading="btnLoading" @click="openIM">{{
          $t("确认")
        }}</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { getStorage } from "@/utils/handleStorage";
import {
  checkIMEnabled,
  getRelationWithStudent,
  getIMGroupInfo,
} from "@/api/im/index";
import { toRoleName } from "@/components/IM/util";

export default {
  props: {
    studentId: {
      type: String,
      required: true,
    },
    parentId: {
      type: Number,
      required: true,
    },
    studentInfo: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      visible: false,
      popupVisible: false,
      userInfo: JSON.parse(getStorage("userInfo")),
      // 一个 WindowProxy 对象。使用 window.open 打开的 IM 窗口的引用
      openedTab: null,
      parentIMUserId: "",
      btnLoading: false,
      // 与学生的学科关系
      roleRelationList: null,
      // 选择的角色
      selectedRole: 0,
      // 选择的学科
      selectedSubject: 0,
      // IM 群信息
      imGroupInfo: null,
    };
  },
  computed: {
    imOrigin() {
      return process.env.VUE_APP_IM_URL;
    },
    // 角色列表
    roleList() {
      const list = [];
      const isEn = this.$i18n.locale === "en";
      (this.roleRelationList || []).forEach((item) => {
        const roleCode = item.roleCode;
        if (!list.some((p) => p.value === roleCode)) {
          list.push({
            label: toRoleName(roleCode, isEn),
            value: roleCode,
          });
        }
      });
      return list;
    },
    // 当前角色下的学科列表
    subjectList() {
      const relationList = this.roleRelationList || [];
      const list = relationList
        .filter((p) => p.roleCode === this.selectedRole)
        .map((item) => {
          const value = item.subjectTypeId;
          return {
            label: this.Filters.getSubjectLabel(value, this.$i18n.locale),
            value,
          };
        });
      return list;
    },
  },
  watch: {
    selectedRole() {
      // 角色变化时，重置学科选择
      this.selectedSubject =
        this.subjectList.length > 0 ? this.subjectList[0].value : 0;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const data1 = {
        userId: this.userInfo.id,
        studentUserId: this.studentId,
        parentUserId: this.parentId,
        roleCode: 4, // 不需要此值
      };
      const enable = await checkIMEnabled(data1);
      // 灰度开关
      if (enable) {
        this.visible = true;
      }
    },
    // 获取与学生的关系
    getRelation() {
      const data = {
        opsUserId: this.userInfo.id,
        studentUserId: this.studentId,
        parentUserId: this.parentId,
      };
      return getRelationWithStudent(data).then((val) => {
        const reVal = val.subjectRoles;
        this.roleRelationList = reVal || [];
        // 默认选中第一个身份
        if (reVal && reVal.length > 0) {
          this.selectedRole = reVal[0].roleCode;
        }
        return reVal;
      });
    },
    // 获取或创建 IM 群
    getOrCreateIMGroup() {
      const info = this.imGroupInfo;
      if (info) {
        const newInfo = {
          ...info,
          isFirstCreate: false, // 重复使用时，将此字段置为 false
        };
        return Promise.resolve(newInfo);
      }
      const role = this.selectedRole;
      const data = {
        groupBizId: role === 4 ? 2 : 3, // 群业务编码 1.老师服务群, 2.CC服务群, 3.LA服务群
        // cc 或la 成员列表
        members: [
          {
            userId: this.userInfo.id,
            roleCode: role,
            nickName: this.userInfo.nickName || this.userInfo.username || "",
            avatar: this.userInfo.avatar || "",
          },
        ],
        parentUserId: this.parentId,
        studentUserId: this.studentId,
        studentName: this.studentInfo?.studentName,
        subjectTypeId: this.selectedSubject,
      };
      return getIMGroupInfo(data).then((val) => {
        this.imGroupInfo = val;
        return val;
      });
    },
    // 按钮点击事件
    async handleClick() {
      if (this.roleRelationList) {
        this.popupVisible = true;
        return;
      }
      try {
        this.btnLoading = true;
        // 检查权限 - 是否为该学生的销售/学管
        const hasPerm = await this.getRelation();
        if (hasPerm) {
          this.popupVisible = true;
        } else {
          this.$message.error(this.$t("您暂无与该学生会话的权限"));
        }
      } catch (error) {}
      this.btnLoading = false;
    },
    closePopup() {
      this.btnLoading = false;
      this.popupVisible = false;
    },
    async openIM() {
      try {
        this.btnLoading = true;
        const info = await this.getOrCreateIMGroup();
        // 打开IM会话窗口
        this.$router.push({
          name: "im",
          query: {
            groupId: info.groupId,
            roleCode: this.selectedRole,
          },
        });
        this.closePopup();
      } catch (error) {}
      this.btnLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.im-button {
  position: relative;
  float: right;
  z-index: 100;
}
.popup-row {
  display: flex;
  margin-bottom: 20px;
}
.popup-label {
  font-weight: 400;
  margin-right: 5px;
}
.popup-footer {
  display: flex;
  justify-content: space-around;
}
.subject-list {
  .el-radio {
    display: block;
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
