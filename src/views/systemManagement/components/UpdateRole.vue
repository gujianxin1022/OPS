<template>
  <div class="update-role">
    <el-dialog
    title="更新角色"
    :visible.sync="show"
    width="400px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    >
    <el-form 
      ref="form" 
      :model="form" 
      label-width="100px"
      :rules="rules"
      >
      <el-form-item label="角色编码" prop="nameEn">
        <el-input :disabled="Filters.disableRoleCode(form.code)" v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="角色英文名" prop="nameEn">
        <el-input :disabled="Filters.disableRoleCode(form.code)" v-model="form.nameEn"></el-input>
      </el-form-item>
      <el-form-item label="角色中文名" prop="nameZh">
        <el-input :disabled="Filters.disableRoleCode(form.code)" v-model="form.nameZh"></el-input>
      </el-form-item>
      <el-form-item label="角色排序" prop="orderNo">
        <el-input-number 
          v-model="form.orderNo" 
          :min="0" label="角色排序"></el-input-number>
      </el-form-item>
      <el-form-item label="角色描述" prop="remark">
        <el-input :disabled="Filters.disableRoleCode(form.code)" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="菜单状态" prop="type">
        <el-select :disabled="Filters.disableRoleCode(form.code)" v-model="form.status" placeholder="请选择菜单状态">
        <el-option 
          v-for="(item, index) in roleStatus" 
          :key="index"
          :label="item.label" 
          :value="item.value"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="角色类型" prop="status">
        <el-select :disabled="Filters.disableRoleCode(form.code)" v-model="form.type" placeholder="请选择角色类型">
        <el-option
          v-for="(item, index) in roleType" 
          :key="index"
          :label="item.label" 
          :value="item.value"></el-option>
      </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="onUpdate">更新</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editRoleInfoData: {
      type: Object,
      default: () => {}
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
      roleStatus: [
        {
          label: '有效',
          value: 1,
        },
        {
          label: '无效',
          value: 0
        }
      ],
      roleType: [
        {
          label: '超级管理员',
          value: 1,
        },
        {
          label: '普通用户',
          value: 2
        }
      ],
      rules: {
        nameEn: [
          { required: true, message: '请输入角色英文名', trigger: 'blur' }
        ],
        nameZh: [
          { required: true, message: '请输入角色中文名', trigger: 'blur' }
        ],
        orderNo: [
          { required: true, message: '请输入角色排序号', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入角色状态', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入角色类型', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show( newData ) {
      if( newData ) {
        Object.assign(this.form, this.editRoleInfoData)
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit("closeUpdateRole")
      this.form = this.$options.data().form
    },
    ...mapActions([
      'getSystemRolesListAction'
    ]),
    onUpdate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.$Api.systemManagement.updateRoleInfo(this.form.id, this.form)
          .then(({ status, data }) => {
            if( status == 200 && data.code == 200 ) {
              this.$notify({
                message: '更新角色成功',
                type: 'success'
              })
              this.getSystemRolesListAction()
              this.handleClose()
            }else {
              this.$notify({
                message: '更新角色失败',
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
  }
}
</script>