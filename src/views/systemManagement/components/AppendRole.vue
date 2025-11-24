<template>
  <div class="append-role">
    <el-dialog
    :title="$t('添加角色')"
    :visible.sync="show"
    width="500px"
    :before-close="handleClose"
    center
    :close-on-click-modal="false"
    >
      <el-form 
        ref="form" 
        :model="form" 
        :label-width="currentLang === 'en'? '150px' : '100px'"
        :rules="rules"
        >
        <el-form-item :label="$t('角色编码')" prop="nameEn">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('角色英文名')" prop="nameEn">
          <el-input v-model="form.nameEn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('角色中文名')" prop="nameZh">
          <el-input v-model="form.nameZh"></el-input>
        </el-form-item>
        <el-form-item :label="$t('角色排序')" prop="orderNo">
          <el-input-number 
            v-model="form.orderNo" 
            :min="0" :label="$t('角色排序')"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('角色描述')" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('菜单状态')" prop="type">
         <el-select v-model="form.status" :placeholder="$t('请选择菜单状态')">
          <el-option 
            v-for="(item, index) in roleStatus" 
            :key="index"
            :label="item.label" 
            :value="item.value"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item :label="$t('角色类型')" prop="status">
         <el-select v-model="form.type" :placeholder="$t('请选择角色类型')">
          <el-option
            v-for="(item, index) in roleType" 
            :key="index"
            :label="item.label" 
            :value="item.value"></el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{$t('取消')}}</el-button>
          <el-button :loading="submitLoading" type="primary" @click="onSubmit">{{$t('添加')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      submitLoading: false,
      form: {
        id: '',
        createTime: '',
        nameEn: '',
        nameZh: '',
        orderNo: '',
        remark: '',
        status: 1,
        type: 2,
        updateTime: '',
        code: ''
      },
      roleStatus: [],
      roleType: [],
      rules: {
        
      }
    }
  },
  computed:{
    ...mapGetters([
      'currentLang'
    ])
  },
  watch:{
    currentLang(){
      this.initData()
    }
  },
  methods: {
    initData(){
      this.roleType = [
        {
          label: this.$t('超级管理员'),
          value: 1,
        },
        {
          label: this.$t('普通用户'),
          value: 2
        }
      ]
      this.roleStatus = [
        {
          label: this.$t('有效'),
          value: 1,
        },
        {
          label: this.$t('无效'),
          value: 0
        }
      ]
      this.rules = {
        nameEn: [
          { required: true, message: this.$t('请输入角色英文名'), trigger: 'blur' }
        ],
        nameZh: [
          { required: true, message: this.$t('请输入角色中文名'), trigger: 'blur' }
        ],
        orderNo: [
          { required: true, message: this.$t('请输入角色排序号'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('请输入角色描述'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: this.$t('请输入角色状态'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('请输入角色类型'), trigger: 'blur' }
        ]
      }
    },
    ...mapActions([
      'getSystemRolesListAction'
    ]),
    handleClose() {
      this.$emit("closeAppendRole")
      this.form = this.$options.data().form
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.$Api.systemManagement.addRolesInfo(this.form)
          .then(({ status, data }) => {
            if( status == 200 && data.code == 200 ) {
              this.$notify({
                message: '添加角色成功',
                type: 'success'
              })
              this.getSystemRolesListAction()
              this.handleClose()
            }else {
              this.$notify({
                message: '添加角色失败',
                type: 'error'
              })
            }

            this.submitLoading = false
          })
        } else {
          this.$notify({
            message: '缺少必要信息',
            type: 'error'
          })
          return false;
        }
      });
      
    }
  },
  created(){
    this.initData()
  }
}
</script>