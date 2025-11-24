<template>
  <div>
    <el-dialog
      title="选择默认教室类型"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="changeClassroomForm" :model="formData" :rules="rules">
          <el-form-item label="教室类型" label-width="80px" prop="virtualClassTypeId">
            <el-radio-group v-model="formData.virtualClassTypeId">
              <el-radio
                v-for="item in VIRTUAL_CLASS_TYPE"
                :key="item.id"
                :label="item.id"
              >
                {{item.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因" label-width="80px" prop="remark">
            <el-input 
              v-model="formData.remark"
              minlength="10"
              maxlength="200"
              placeholder="请详细描述默认教室原因，不少于10字符"
              style="width: 80%"
            />
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="“批量固定默认教室”的原因相同，若实际为不同原因，请分别操作。"
            >
              <i v-if="!defaultClassroom" slot="reference" class="el-icon-question"/>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfim">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted } from '@vue/composition-api';
import {ONETOONE_OR_SMALLCLASS, VIRTUAL_CLASS_TYPE} from '../constants';

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    defaultClassroom: {type: Number, default: void 0},
    idList: {type: Array, default: []},
    classType:  {type: Number, default: void 0},
  },
  setup(props, {root, emit, refs}) {
    const constants = {VIRTUAL_CLASS_TYPE, ONETOONE_OR_SMALLCLASS}
    const formData = reactive({
      virtualClassTypeId: '', 
      remark: ''
    })
    const rules = reactive({
      virtualClassTypeId: [{ required: true, message: root.$t('请选择'), trigger: 'change' }],
      remark: [
        { required: true, message: root.$t('请输入'), trigger: 'blur' },
        { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
      ]
    })
    // 确认
    const handleConfim = () => {
      refs.changeClassroomForm.validate((valid) => {
        if (valid) {
          const userId = JSON.parse(window.localStorage.getItem("userInfo")).id;
          let requestFun = props.classType === ONETOONE_OR_SMALLCLASS.oneToOne
            ? root.$Api.systemManagement.updateOneToOneList({...formData, idList: props.idList})
            : root.$Api.systemManagement.updateSmallClassList({...formData, idList: props.idList, operatorId: userId})
          requestFun.then(({status, data:{code, data}}) => {
            if (status === 200 && code === 200) {
              root.$message.success('修改成功');
              handleClose();
              emit("refreshTable");
            }
          })
        } else {
          return false;
        }
      });
    }
    // 设置默认教室类型
    const setClassType = () => {
      formData.virtualClassTypeId = props.defaultClassroom;
      
    }

    const handleClose = () => {
      emit('update:dialogVisible', false);
    }

    onMounted(() => {
      setClassType();
    })

    return {
      formData,
      rules,
      ...toRefs(constants),
      handleClose,
      handleConfim,
    }
  }
}
</script>

<style lang='scss' scoped>
</style>