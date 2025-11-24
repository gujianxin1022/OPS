<template>
  <div class="update-power-wrap">
    <el-dialog
      :title="$t('更新资源')"
      :visible.sync="show"
      width="400px"
      :before-close="handleClose"
      center
      :close-on-click-modal="false"
      >
      <el-form 
        ref="form" 
        :model="form" 
        label-width="110px"
        :rules="rules"
        >
        <el-form-item :label-width="currentLang == 'en' ? '134px' : '110px'" :label="$t('权限编码')" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('资源图标')" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item :label-width="currentLang == 'en' ? '204px' : '110px'" :label="$t('资源英文名称')" prop="nameEn">
          <el-input v-model="form.nameEn"></el-input>
        </el-form-item>
        <el-form-item :label-width="currentLang == 'en' ? '204px' : '110px'" :label="$t('资源中文名称')" prop="nameZh">
          <el-input v-model="form.nameZh"></el-input>
        </el-form-item>
        <el-form-item :label-width="currentLang == 'en' ? '120px' : '110px'" :label="$t('资源类型')" prop="type">
          <el-select v-model="form.type" :placeholder="$t('请选择资源类型')">
          <el-option 
            v-for="(item, index) in typeList" 
            :key="index"
            :label="item.label" 
            :value="item.value"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item :label-width="currentLang == 'en' ? '166px' : '110px'" :label="$t('前端页面路由')" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item :label-width="currentLang == 'en' ? '166px' : '110px'" :label="$t('apiUrl')" prop="url">
          <el-input v-model="form.apiUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('取消')}}</el-button>
        <el-button :loading="loading" type="primary" @click="onUpdate">{{$t('更新')}}</el-button>
      </span>
      </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex"
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    nodeInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      form: {
        code: '',
        icon: '',
        nameEn: '',
        nameZh: '',
        type: '',
        url: '',
        apiUrl:''
      },
      typeList: [
         {
          label: '公司',
          value: 999
        },
         {
          label: '系统',
          value: 0
        },
        {
          label: '菜单',
          value: 1
        },
        {
          label: 'Tab页签',
          value: 2
        },
        {
          label: '按钮/选项',
          value: 3
        }
      ],
      rules: {
        code: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ],
        nameEn: [
          { required: true, message: '请输入资源英文名称', trigger: 'blur' }
        ],
        nameZh: [
          { required: true, message: '请输入资源中文名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入资源类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    ...mapState({
      currentLang: (state) => state.app.currentLang
    })
  },
  watch: {
    nodeInfo(newData) {
      Object.assign(this.form, newData)
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeUpdatePowerDialog')
    },
    onUpdate() {
      this.loading = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$Api.systemManagement.updatePowerInfo(this.form.id, this.form)
          .then(({ status, data }) => {
            if( status == 200 && data.code == 200 ) {
              this.$emit('getData')
              this.$notify({
                message: '更新资源信息成功',
                type: 'success'
              })
              this.handleClose()
            }else {
              this.$messanotifyge({
                message: '更新资源信息失败',
                type: 'error'
              })
            }
            this.loading = false
          })
        }
      });
    } 
  }
}
</script>