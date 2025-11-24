<template>
  <div class="gtl-wrap">
    <div class="create-gtl-wrap">
      <el-button @click="goCreate">{{$t('创建班型')}}</el-button>
      <el-button v-if="activeName == 'normal'&& Per.handleButtonPer('teach.groupMT.groupTypeList.importClassType')" @click="showImportDialog=true">{{$t('导入班型')}}</el-button>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="$t('试听')" name="try">
        <TryGroupTypeList v-if="activeName == 'try'"></TryGroupTypeList>
      </el-tab-pane>
      <el-tab-pane :label="$t('正式')" name="normal">
        <NormalGroupTypeList ref="normal" v-if="activeName == 'normal'"></NormalGroupTypeList>
      </el-tab-pane>
    </el-tabs>
    <ImportExcel :config='config' @closeDialog='closeDialog' :showDialog='showImportDialog' @importSuccess='importSuccess' />
  </div>
</template>
<script>
import TryGroupTypeList from './groupTypeSub/tryGroupTypeList'
import NormalGroupTypeList from './groupTypeSub/normalGroupTypeList'
import ImportExcel from '@/components/ImportExcel'
import { mapGetters } from "vuex"
export default {
  name: 'groupTypeList',
  components: {
    TryGroupTypeList,
    NormalGroupTypeList,
    ImportExcel
  },
  data () {
    return {
      activeName: 'try',
      config:{
        title:this.$t('导入班型'),
        requestUrl:`${process.env.VUE_APP_BASE_API}/opsapi/classmanage/api/v1/class/manage/business/small/class/type/formal/add/import`
      },
      showImportDialog:false
    }
  },
  computed:{
    ...mapGetters([
      'currentLang'
    ])
  },
  watch:{
    currentLang(data){
      if(data === 'zh'){
        this.config.title = "导入班型"
      }else{
        this.config.title = "Upload class type"
      }

    }
  },
  methods: {
    goCreate() {
      this.$router.push({
        path: '/groupManagement/createGroupType'
      })
    },
    importSuccess(){
      this.showImportDialog=false
      this.$refs['normal'].getTableData()
    },
    closeDialog(){
      this.showImportDialog=false
    }
  }
}
</script>
<style lang="scss" scoped>
.gtl-wrap {
  width: 100%;
  height: 100%;
  padding: 5px;
  position: relative;
  .create-gtl-wrap {
    position: absolute;
    right: 5px;
    z-index: 99;
  }
}
</style>
