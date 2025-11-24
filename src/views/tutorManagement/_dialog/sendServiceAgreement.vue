<template>
    <el-dialog
      width="980px"
      :title="$t(`批量发送服务协议`)"
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
        <el-table-column
          :label="$t('服务协议')"
          align="center"
          :width="currentLang === 'en' ? '200' : '160'"
          v-if="
            (businessLine === 2 || businessLine === 3) &&
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
        >
          <template slot-scope="{ row }">
            {{ getContract(row.contractStatus) }}
            <el-button
              v-if="
                Per.handleButtonPer(
                  'teach.tutorMT.searchTeacher.serviceAgreement'
                ) &&
                (row.contractStatus === 1 ||
                  row.contractStatus === 2 ||
                  row.contractStatus === 3)
              "
              type="text"
              @click="openProtocolVisible(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('服务协议')"
          align="center"
          width="140"
          v-if="
            businessLine === 1 &&
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
        >
          <template slot-scope="scope">
            <span>{{
              Filters.laborAgreementStatusFilters(
                scope.row.laborAgreementStatus,
                currentLang
              )
            }}</span>
            <el-popover
              v-if="
                Filters.laborAgreementStatusFilters(
                  scope.row.laborAgreementStatus,
                  currentLang
                ) == $t('已签')
              "
              placement="bottom"
              width="200"
              trigger="hover"
            >
              <img
                style="width: 200px; height: auto"
                :src="scope.row.signFileUrl"
                alt=""
              />
              <el-button
                type="text"
                slot="reference"
                @click="openProtocolVisible(scope.row.laborAgreementFileUrl)"
                >{{ $t("查看") }}</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
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
  import {ref,computed} from "@vue/composition-api";
  export default {
    props: {
      visible: { type: Boolean, default: false },
      hide: { type: Number, default: void 0 },
      working: { type: Number, default: void 0 },
      tableData: { type: Array, default: () => [] },
      businessLine: { type: Number, default: 0 },
    },
    setup(props, { root, refs, emit }) {
      const isEn = computed(() => root.$store.getters.currentLang === "en")
      const confirmLoading = ref(false);
      // 获取服务协议状态
      const getContract = (val) => {
        switch (val) {
          case 0:
            return root.$t("未签");
          case 1:
            return root.$t("已签（非续签期）");
          case 2:
            return root.$t("已签（续签期）");
          case 3:
            return root.$t("已过期");
          default:
            return "--";
        }
      }
      // 查看服务协议
      const openProtocolVisible = (url) => {
        window.open(url, '__blank');
      }
      // 关闭弹窗
      const handleClose = () => {
        emit("update:visible", false);
      };
      // 确定发送服务协议
      const handleOk = async () => {
        confirmLoading.value = true;
        const tutorUserIdList = props.tableData.map((item) => item.id)
        root.$Api.tutorManagement.tutorSendProtocol(tutorUserIdList).then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            root.$notify({
              message: root.$t("Allocation succeeded"),
              type: "success",
            });
            emit("ok");
            handleClose();
          }
          confirmLoading.value = false;
        }).catch(error => {
          confirmLoading.value = false;
        });
      };
  
      return {
        isEn,
        confirmLoading,
        handleClose,
        handleOk,
        getContract,
        openProtocolVisible
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
  