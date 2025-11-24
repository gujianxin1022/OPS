<template>
  <el-card class="themeManagement" shadow="hover">
    <header slot="header">
      <span>{{$t('主题管理')}}</span>
    </header>
    <main>
      <section class="searchWarp">
        <dl class="formWarp">
          <dt class="formWarp-title">{{$t('主题名称')}}</dt>
          <dd class="formWarp-inner">
            <el-input v-model="themeName" clearable :placeholder="$t('请输入主题名称')" />
          </dd>
          <dd class="formWarp-btn">
            <el-button type="primary" @click="search">{{ $t('my-home-Search') }}</el-button>
          </dd>
        </dl>
        <div class="btns">
          <el-button @click="addTheme(ENUM_VAL.add)"><i class="el-icon-plus"/>{{ $t('新建主题') }}</el-button>
        </div>
      </section>
      <section class="tableBox">
        <el-table
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
        >
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="title" :label="$t('主题名称')" width="180" />
          <el-table-column prop="courseString" :label="$t('关联课程树')">
            <template slot-scope="scope">
              <div v-if="scope.row.courseString" class="courseMsg">
                <div v-show="!scope.row.courseStrShow">
                  <p v-for="(val, key) in scope.row.courseString.slice(0,5)" :key="key">{{val}}</p>
                </div>
                <div v-show="scope.row.courseStrShow">
                  <p v-for="(val, key) in scope.row.courseString" :key="key">{{val}}</p>
                </div>
                <el-button
                  v-if="scope.row.courseString.length > 5"
                  type="text"
                  @click="scope.row.courseStrShow = !scope.row.courseStrShow"
                >
                  {{courseStrTitle(scope.row.courseStrShow)}}
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="videoCount" :label="$t('关联视频数量')" />
          <el-table-column prop="createUserName" :label="$t('操作人')"/>
          <el-table-column prop="updateTime" :label="$t('最后更新时间')">
            <template slot-scope="scope">
              {{DateTimeUtils.dateClockTime(scope.row.updateTime)}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('操作')">
            <template slot-scope="scope">
              <el-button type="text" @click="addTheme(ENUM_VAL.edit, scope.row)">{{ $t('编辑') }}</el-button>
              <el-button type="text" @click="delTheme(scope.row)">{{ $t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          :total="total"
          :current-page="pageNum"
          :pageSize="pageSize"
          @getCurrentPage="getCurrentPage"
          @getPerPage="getPerPage"
        />
      </section>
    </main>
    <AddThemeDialog
      v-if="themeDialogVisible"
      :dialogVisible.sync="themeDialogVisible"
      :type="themeDialogType"
      :themeMsg="themeMsg"
      @getTableList="search"
    />
    <el-dialog
      :title="$t('提示')"
      :visible.sync="deleteDialog"
      width="30%"
      :before-close="deleteDialogClose">
      <span>
        {{deleteDialogType === DELETE_DIALOG_TYPE.use ? $t('该主题正在使用，不能删除') : $t('您是否要删除该主题')}}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="deleteDialogType === DELETE_DIALOG_TYPE.unUse" @click="deleteDialogClose">{{$t('取消')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { ref, reactive, toRefs, onMounted, computed } from "@vue/composition-api";
import AddThemeDialog from "./components/addThemeDialog.vue";
import { ENUM_VAL, DELETE_DIALOG_TYPE } from "./constants";

export default {
  components: { AddThemeDialog },
  setup(props, {root}) {
    // 筛选项
    const formData = reactive({
      themeName: '',
    });
    const pageDto = reactive({
      total: 0,
      pageNum: 1,
      pageSize: 20,
    });
    const themeDialog = reactive({
      themeDialogVisible: false,
      themeDialogType: 0,
      themeMsg: 0
    });
    const tableData = ref([]);
    const deleteDialog = ref(false);
    const deleteDialogType = ref(1);
    const loading = ref(false);
    const courseStrTitle = computed(() => {
      return function(val) {
        return val ? root.$t('收起') : root.$t('更多')
      }
    });

    // 添加 & 编辑
    const addTheme = (type, row={}) => {
      themeDialog.themeDialogVisible = true;
      themeDialog.themeDialogType = type;
      themeDialog.themeMsg = row;
    };
    // 删除主题
    const delTheme = (row) => {
      themeDialog.themeMsg = row;
      row.videoCount === 0 ? deleteDialogType.value = 2 : deleteDialogType.value = 1;
      deleteDialog.value = true;
    }
    // 确定
    const confirm = () => {
      if (deleteDialogType.value === DELETE_DIALOG_TYPE.unUse) {
        root.$Api.teacherManagement.delTheme(themeDialog.themeMsg.id).then(({data:{code, data}}) => {
          if (code === 200) {
            root.$message.success(data);
            deleteDialogClose();
            getTableList();
          };
        }).finally(() => {});
      }
      deleteDialogClose()
    };
    // 关闭删除弹框
    const deleteDialogClose = () => {
      deleteDialog.value = false;
    };
    // 查询方法
    const search = () => {
      pageDto.pageSize = 20;
      pageDto.pageNum = 1;
      getTableList();
    };
    // 第几页
    const getCurrentPage = (val) => {
      pageDto.pageNum = val;
      getTableList()
    }
    // 每页几条
    const getPerPage = (val) => {
      pageDto.pageSize = val;
      pageDto.pageNum = 1;
      getTableList()
    }
    // 获取table数据
    const getTableList = () => {
      // let {pageNum, pageSize} = pageDto;
      let params = {...pageDto, title: formData.themeName};
      loading.value = true;
      root.$Api.teacherManagement.getThemeList(params).then(({data:{code, data}}) => {
        if (code === 200) {
          pageDto.total = data.total;
          data.list.forEach(item => {
            item.courseStrShow = false;
          });
          tableData.value = data.list ?? [];
        };
      }).finally(() => loading.value = false);
      
    };

    const initData = () => {
      getTableList()
    }

    onMounted(initData);

    return {
      ...toRefs(formData),
      ...toRefs(pageDto),
      ...toRefs(themeDialog),
      tableData,
      loading,
      deleteDialog,
      deleteDialogType,
      courseStrTitle,
      search,
      addTheme,
      confirm,
      deleteDialogClose,
      getCurrentPage,
      getPerPage,
      delTheme,
      ENUM_VAL,
      DELETE_DIALOG_TYPE
    }
  },
  
}
</script>

<style lang="scss" scoped>
.themeManagement {
  .searchWarp {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: 32px;
    margin: 0 0 16px;
  }
  .formWarp {
    display: flex;
    margin: 0;
    align-items: center;
    &-inner {
      width: 200px;
      margin: 0 10px;
    }
    &-btn {
      width: auto;
      margin: 0 10px;
    }
  }
  p {
    margin: 0;
  }
}
</style>