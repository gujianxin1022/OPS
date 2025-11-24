<template>
  <div class="prower-management-wrapper">
    <div
      class="tree-wrapper"
      v-loading="treeWrapLoading"
      v-if="Per.handleButtonPer('system.powerMT.powerList.plViewPowerList')"
    >
      <el-button
        type="primary w150"
        class="update-power-tree-btn mb10"
        :loading="updatePowerTreeLoading"
        @click="updatePowerTree"
      >{{ $t("更新权限树") }}</el-button>
      <el-input
        v-if="Per.handleButtonPer('system.powerMT.powerList.plFilterbyKeyword')"
        class="mb10"
        :placeholder="$t('输入关键字进行过滤')"
        v-model="filterText"
      >
      </el-input>
      <el-tree
        :key="treeKey"
        ref="rightsTree"
        node-key="id"
        :data="tree"
        :props="defaultProps"
        :expand-on-click-node="false"
        default-expand-all
        :filter-node-method="filterNode"
        :draggable="false"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-button
              v-if="Per.handleButtonPer('system.powerMT.powerList.plEditPower')"
              type="text"
              size="mini"
              @click="() => edit(node, data)"
            >
              {{ $t("编辑") }}
            </el-button>
            <el-button
              v-if="Per.handleButtonPer('system.powerMT.powerList.plAddPower')"
              type="text"
              size="mini"
              @click="() => append(data)"
            >
              {{ $t("添加") }}
            </el-button>
            <el-button
              v-if="
                Per.handleButtonPer('system.powerMT.powerList.plDeletePower')
              "
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              {{ $t("删除") }}
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('添加节点')"
      :visible.sync="show"
      width="400px"
      :before-close="handleClose"
      center
    >
      <el-form
        ref="form"
        :model="form"
        label-width="110px"
        :rules="rules"
      >
        <el-form-item
          :label-width="currentLang === 'en' ? '136px' : '110px'"
          :label="$t('权限编码')"
          prop="code"
        >
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('资源图标')"
          prop="icon"
        >
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="currentLang === 'en' ? '206px' : '110px'"
          :label="$t('资源英文名称')"
          prop="nameEn"
        >
          <el-input v-model="form.nameEn"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="currentLang === 'en' ? '200px' : '110px'"
          :label="$t('资源中文名称')"
          prop="nameZh"
        >
          <el-input v-model="form.nameZh"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="currentLang === 'en' ? '120px' : '110px'"
          :label="$t('资源类型')"
          prop="type"
        >
          <el-select
            v-model="form.type"
            :placeholder="$t('请选择资源类型')"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="currentLang === 'en' ? '120px' : '110px'"
          :label="$t('前端页面路由')"
          prop="url"
        >
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="currentLang === 'en' ? '120px' : '110px'"
          :label="$t('apiUrl')"
          prop="url"
        >
          <el-input v-model="form.apiUrl"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button
          :loading="appendLoading"
          type="primary"
          @click="onAppend"
        >{{
          $t("添加")
        }}</el-button>
      </span>
    </el-dialog>
    <UpdatePower
      :show="showUpdatePowerDialog"
      @closeUpdatePowerDialog="closeUpdatePowerDialog"
      @getData="getData"
      :nodeInfo="nodeInfo"
    ></UpdatePower>
  </div>
</template>

<script>
import UpdatePower from "./components/UpdatePower";
import { mapActions, mapState, mapMutations } from "vuex";
import { sortList } from "@/utils/list";
export default {
  name: "powerManagement",
  components: {
    UpdatePower,
  },
  data () {
    return {
      treeKey: 0,
      treeWrapLoading: false,
      showUpdatePowerDialog: false,
      defaultProps: {
        children: "subList",
        label: "nameZh",
      },
      nodeInfo: null,
      tree: [],
      show: false,
      appendLoading: false,
      updatePowerTreeLoading: false,
      form: {
        code: "",
        icon: "",
        nameEn: "",
        nameZh: "",
        type: "",
        url: "",
        apiUrl: "",
      },
      typeList: [
        {
          label: "公司",
          value: 999,
        },
        {
          label: "系统",
          value: 0,
        },
        {
          label: "菜单",
          value: 1,
        },
        {
          label: "Tab页签",
          value: 2,
        },
        {
          label: "按钮/选项",
          value: 3,
        },
      ],
      rules: {
        code: [{ required: true, message: "请输入权限编码", trigger: "blur" }],
        nameEn: [
          { required: true, message: "请输入资源英文名称", trigger: "blur" },
        ],
        nameZh: [
          { required: true, message: "请输入资源中文名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入资源类型", trigger: "blur" }],
      },
      currentData: null,
      filterText: "",
      hint: "",
      tips: "",
      confirm: "",
      cancel: "",
    };
  },
  computed: {
    ...mapState({
      currentLang: (state) => state.app.currentLang,
    }),
  },
  watch: {
    filterText (val) {
      this.$refs.rightsTree.filter(val);
    },
    currentLang (val) {
      this.defaultProps = {
        children: "subList",
        label: val === "en" ? "nameEn" : "nameZh",
      };
      this.treeKey++;
    },
  },
  methods: {
    ...mapMutations(["SET_PAGE_TITLE"]),
    ...mapActions(["getSystemPowerListAction"]),
    closeUpdatePowerDialog () {
      this.showUpdatePowerDialog = false;
    },
    /**
     * tree 搜索方法
     */
    filterNode (value, data) {
      if (!value) return true;
      // return data.nameZh.indexOf(value) !== -1;
      const label = this.currentLang === "en" ? data.nameEn : data.nameZh
      return label.indexOf(value) !== -1;
    },
    append (data) {
      this.currentData = data;
      this.show = true;
    },
    onAppend () {
      if (!this.currentData.subList) {
        this.$set(this.currentData, "subList", []);
      }
      this.currentData.subList.push(this.form);
      this.tree = JSON.parse(JSON.stringify(this.tree));
      this.handleClose();
      this.$notify({
        message: "添加资源成功",
        type: "success",
      });
    },
    remove (node, data) {
      if (this.currentLang === "zh") {
        this.tips = "警告";
        this.hint = "此操作将永久删除资源, 是否继续?";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "warning";
        this.hint =
          "This operation will permanently delete the resource. Do you want to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }
      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          let parent = node.parent;
          let subList = parent.data.subList || parent.data;
          let index = subList.findIndex((d) => d.id == data.id);
          subList.splice(index, 1);
          this.tree = JSON.parse(JSON.stringify(this.tree));
          this.$notify({
            message: "删除资源成功",
            type: "success",
          });
        })
        .catch((_) => { });
    },
    edit (node, data) {
      if (this.currentLang === "zh") {
        this.hint = "该权限未更新到权限树中，若需要编辑，请先更新权限树！";
      } else {
        this.hint =
          "This permission has not been updated to the permission tree. If you need to edit, please update the permission tree first!";
      }
      this.nodeInfo = { ...node.data };
      if (this.nodeInfo.fullCode === undefined) {
        this.$notify({
          message: this.hint,
          type: "warning",
        });
        return;
      }
      this.showUpdatePowerDialog = true;
    },
    handleClose () {
      this.show = false;
    },
    updatePowerTree () {
      this.updatePowerTreeLoading = true;
      this.$Api.systemManagement
        .updateSystemAllPower(this.tree)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: "更新权限树成功",
              type: "success",
            });
            this.updatePowerTreeLoading = false;
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        });
    },
    getData () {
      this.tree = [];
      this.getSystemPowerListAction().then((data) => {
        let flatList = data.data;
        flatList.forEach((item) => {
          if (item.pid === 0) {
            this.tree.push(item);
          } else {
            flatList.forEach((ite) => {
              if (ite.id == item.pid) {
                ite.subList = ite.subList || [];
                ite.subList.push(item);
              }
            });
          }
        });
        // 递归排序
        sortList(this.tree, "orderNo", "subList");
        this.treeWrapLoading = false;
      });
    },
  },
  created () {
    this.SET_PAGE_TITLE("权限管理");
    this.treeWrapLoading = true;
    this.getData();
    this.defaultProps = {
      children: "subList",
      label: this.currentLang === "en" ? "nameEn" : "nameZh",
    };
  },
};
</script>
<style lang="scss" scoped>
.prower-management-wrapper {
  padding: 20px;
  min-width: 1280px;
}
.tree-wrapper {
  width: 50%;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .update-power-tree-btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
