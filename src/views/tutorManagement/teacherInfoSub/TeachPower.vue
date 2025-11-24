<template>
  <div class="aaa">
    <section class="formBox">
      <div class="formItems">
        <div class="formTitle">{{ $t("上课方式") }}</div>
        <div>
          <el-checkbox-group v-model="classModeIds" :disabled="!isEdit">
            <el-checkbox
              v-for="item in classTypeList"
              :key="item.typeCode"
              :label="item.typeCode"
            >
              {{ currentLang === "zh" ? item.typeNameCn : item.typeNameEn }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="editbBtn">
        <el-button
          v-if="
            Per.handleButtonPer('teach.tutorMT.teacherPower.editTeachPowerBtn')
          "
          v-show="!isEdit"
          type="primary"
          :disabled="!treeData.length"
          @click="editPower"
          >{{ $t("编辑教学权限") }}</el-button
        >
      </div>
    </section>
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item :label="$t('学科')">
        <el-select
          v-model="formData.subjectType"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in subjectTypeList"
            :key="item.typeCode"
            :label="currentLang === 'zh' ? item.typeNameCn : item.typeNameEn"
            :value="item.typeCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('课程类型')">
        <el-select
          v-model="formData.courseType"
          clearable
          :placeholder="$t('请选择')"
        >
          <!-- 后端和产品确认过没有中文名称一直展示中文 -->
          <el-option
            v-for="item in courseTypeList"
            :key="item.typeCode"
            :label="item.typeNameCn"
            :value="item.typeCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('商户')">
        <el-select
          v-model="formData.merchant"
          @change="getAppList"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in merchantList"
            :key="item.merchantId"
            :label="item.merchantName"
            :value="item.merchantId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="appid">
        <el-select
          v-model="formData.appID"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in appIdList"
            :key="item.appId"
            :label="item.appName"
            :value="item.appId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">{{ $t("查询") }}</el-button>
      </el-form-item>
    </el-form>
    <div
      v-loading="treeLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中"
      element-loading-background="rgba(20, 34, 58, 0.8)"
    >
      <el-tree
        v-if="refreshTree"
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :filter-node-method="filterNode"
      />
    </div>
    <footer v-if="isEdit" class="footer-btn">
      <el-button @click="cancel">{{ $t("取消") }}</el-button>
      <el-button type="primary" @click="reasonDialogVisible = true">{{
        $t("保存")
      }}</el-button>
    </footer>
    <ReasonDialog
      ref="reasonDialog"
      :dialogVisible.sync="reasonDialogVisible"
      :btnLoading="submitAndSureEditLoading"
      @submitEdit="submitEdit"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import ReasonDialog from "./components/reasonDialog.vue";

export default {
  name: "teachPower",
  components: { ReasonDialog },
  data() {
    return {
      classModeIds: [],
      courseTypeList: [],
      subjectTypeList: [],
      classTypeList: [],
      merchantList: [],
      appIdList: [],
      formData: {
        subjectType: "",
        courseType: "",
        merchant: "",
        appID: "",
      },
      options: [],
      isEdit: false, // false: 不修改，true: 修改
      treeData: [],
      refreshTree: false,
      defaultProps: {
        children: "levelInfoList",
        label: "name",
      },
      courseEditionList: [], // 渲染tree
      teachableCourses: [], // 教师已有权限
      defaultCheckedKeys: [], // 默认勾选
      reasonDialogVisible: false,
      submitAndSureEditLoading: false,
      treeLoading: false,
    };
  },
  computed: {
    ...mapState({
      currentLang: (state) => state.app.currentLang,
    }),
  },
  watch: {
    currentLang: {
      immediate: true,
      handler(newVal) {
        // 切换中英文时刷新tree组件
        this.refreshTree = false;
        this.$nextTick(() => (this.refreshTree = true));
      },
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    /**
     * tree 搜索方法
     */
    filterNode(value, data) {
      let [subjectType, courseType] = value;
      if (subjectType === "" && courseType === "") return true;
      if (courseType === "") {
        return data.courseSubjectId === subjectType;
      } else if (subjectType === "") {
        return data.courseTypeId === courseType;
      } else {
        return (
          data.courseSubjectId === subjectType &&
          data.courseTypeId === courseType
        );
      }
    },
    expandAll(bool) {
      var nodes = this.$refs.tree.store.nodesMap;
      for (var i in nodes) {
        nodes[i].expanded = bool;
      }
    },
    initData() {
      this.getOptionList();
      this.getData();
    },
    getOptionList() {
      // 上课方式、学科、课程类型、商户、appId下拉列表
      this.$Api.tutorManagement
        .getCourseBasicInfoList()
        .then(({ status, data: { code, data } }) => {
          if (status == 200 && code == 200) {
            this.courseTypeList = data.courseTypeList;
            this.subjectTypeList = data.subjectTypeList;
            this.classTypeList = data.classTypeList;
            this.merchantList = data.merchantList;
          }
        });
    },
    // 初始化数据 - 获取下拉数据 和 权限信息
    async getData() {
      this.defaultCheckedKeys = [];
      let params = {
        subjectType: "",
        courseType: "",
        appId: this.formData.appID,
      };
      this.treeLoading = true;
      await this.$Api.tutorManagement
        .getTutorCoursePower(this.$route.query.id, params)
        .then(({ status, data: { code, data } }) => {
          if (status == 200 && code == 200) {
            // 上课方式
            this.classModeIds =
              data.scheduleTutorClasstypeList.map((item) => item.classTypeId) ??
              [];
            // 权限树数据
            this.treeData = data.courseEditionList;
            this.treeData.forEach((item) => {
              item.id = item.editionId + 'editionId';
              item.name =
                this.currentLang === "zh"
                  ? item.editionNameOpsZh
                  : item.editionNameOpsEn;
              item.levelInfoList.forEach((ite) => {
                ite.id = ite.levelId;
                ite.name = `${ite.levelName} ${ite.levelNo}`;
                ite.courseSubjectId = item.courseSubjectId;
                ite.courseTypeId = item.courseTypeId;
              });
            });
            this.setCheckDisable(this.treeData); // 初始化设置节点禁用状态
            this.teachableCourses = data.teachableCourses;
            // 获取老师权限
            this.teachableCourses.forEach((item) =>
              this.defaultCheckedKeys.push(item.levelId)
            );
            this.$refs?.tree?.setCheckedKeys(this.defaultCheckedKeys);
          }
        })
        .finally(() => {
          this.treeLoading = false;
          this.$refs.tree.filter([
            this.formData.subjectType,
            this.formData.courseType,
          ]);
          this.expandAll(false)
        });
    },
    // 获取appId列表
    getAppList(val) {
      this.merchantList.forEach((item) => {
        if (item.merchantId === val) {
          this.appIdList = item.appIdInfoList;
          return;
        }
      });
    },
    search() {
      this.getData();
    },
    // 修改
    editPower() {
      this.isEdit = true;
      this.setCheckDisable(this.treeData);
      // 权限第一版tree组件交互
      // // 获取选中节点的key
      // const keyList = this.$refs.tree.getCheckedKeys();
      // // 数据回显时的数据处理
      // this.setTree(keyList, this.treeData);
    },
    // 提交修改
    async submitEdit(reason) {
      // 拿到所有的子节点
      let allChildKeys = [];
      this.treeData.forEach((item) => {
        item?.levelInfoList.forEach((ite) => allChildKeys.push(ite.levelId));
      });
      // 获取选中节点的key
      const keyList = this.$refs.tree.getCheckedKeys();
      // 获取被勾选中的子节点
      let checkChild = [];
      allChildKeys.forEach((allkey) => {
        keyList.forEach((key) => {
          if (allkey === key) {
            return checkChild.push(key);
          }
        });
      });
      // 获取 新增 和 删除 的节点
      let { addList, delList } = this.diffArray(
        this.defaultCheckedKeys,
        checkChild
      );
      let params = {
        createUserId: JSON.parse(window.localStorage.getItem("userInfo")).id,
        reason: reason,
        addCourseIdList: addList,
        delCourseIdList: delList,
        finalCourseList: checkChild,
      };
      let classModeIds = [...new Set(this.classModeIds)];
      this.submitAndSureEditLoading = true;
      try {
        const [res1, res2] = await Promise.all([
          this.p1(params),
          this.p2(classModeIds),
        ]);
        this.$refs.reasonDialog.closeReasonDialog();
        this.getData();
        this.isEdit = false;
        this.setCheckDisable(this.treeData);
        this.$notify({ type: "success", message: "修改成功" });
      } finally {
        this.submitAndSureEditLoading = false;
      }
    },
    // 修改教室权限
    async p1(params) {
      const {
        status,
        data: { code, data },
      } = await this.$Api.tutorManagement.updateTutorCoursePower(
        this.$route.query.id,
        params
      );
      if (status !== 200 || code !== 200) return Promise.reject();
      return data;
    },
    // 更新老师的教学班型
    async p2(classModeIds) {
      const {
        status,
        data: { code, data },
      } = await this.$Api.tutorManagement.teacherCanTeachClassType(
        this.$route.query.id,
        classModeIds
      );
      if (status !== 200 || code !== 200) return Promise.reject();
      return data;
    },
    // 获取 新增 和 删除 的节点
    diffArray(originArr, resultarr) {
      let addList = [],
        delList = [];
      if (!Array.isArray(originArr) || !Array.isArray(resultarr))
        throw new TypeError("originArr and resultarr must be a array");
      // 处理结果与源 一致
      if (JSON.stringify(originArr) === JSON.stringify(resultarr))
        return { addList, delList };
      // 处理全部新增
      if (originArr.length === 0 && resultarr.length !== 0) {
        addList = [...resultarr];
        return { addList, delList };
      }
      // 处理全部清空
      if (originArr.length !== 0 && resultarr.length === 0) {
        delList = [...originArr];
        return { addList, delList };
      }
      // 处理删除的
      originArr.forEach((item) => {
        let flag = resultarr.find((ite) => item === ite);
        flag === undefined ? delList.push(item) : null;
      });
      // 处理新增的
      resultarr.forEach((item) => {
        let flag = originArr.find((ite) => item === ite);
        flag === undefined ? addList.push(item) : null;
      });
      console.log(addList);
      console.log(delList);
      return {
        addList,
        delList,
      };
    },
    // 取消
    cancel() {
      this.isEdit = false;
      this.setCheckDisable(this.treeData);
      // 勾选节点恢复初始值
      this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
    },
    // 初始化设置节点禁用状态
    setCheckDisable(arr) {
      arr.forEach((item) => {
        if (this.isEdit) {
          this.$set(item, "disabled", false);
          if (!item.levelInfoList || !item.levelInfoList.length) return;
          this.setCheckDisable(item.levelInfoList);
        } else {
          this.$set(item, "disabled", true);
          if (!item.levelInfoList || !item.levelInfoList.length) return;
          this.setCheckDisable(item.levelInfoList);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.formBox {
  display: flex;
  justify-content: space-between;
  margin: 0 0 5px 0;
  line-height: 40px;
  border-bottom: 1px solid rgb(179, 177, 177);
  .formItems {
    display: flex;
    .formTitle {
      text-align: right;
      vertical-align: middle;
      font-size: 14px;
      font-weight: 700;
      color: #606266;
      padding: 0 12px 0 0;
    }
  }
  .editbBtn {
    float: right;
  }
}
.footer-bt {
  width: 100%;
  padding: 10px 0 0;
}
</style>
