<template>
  <div>
    <el-dialog
      title="批量查询"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <nav>说明：每行一个ID，以回车分割，最多可输入100条</nav>
        <el-input
          v-model="idStr"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder="请输入"
          type="textarea"
          style="marginTop: 15px"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfim" :disabled="idStr === ''">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import {ONETOONE_OR_SMALLCLASS} from '../constants';

export default {
  props: {
    dialogVisible: {type: Boolean, default: false},
    classType: {type: Number, default: void 0},
  },
  setup(props, {root, emit, refs}) {
    const idStr = ref('');

    const handleConfim = async () => {
      let studentIdList = [];
      let classIdList = [];

      let idList = idStr.value.split(/[\n]/g).filter((s) => s && s.trim());
      if (props.classType === ONETOONE_OR_SMALLCLASS.oneToOne) {
        idList.length ? window.sessionStorage.setItem("studentIdList", JSON.stringify(idList)) : '';
        studentIdList = JSON.parse(window.sessionStorage.getItem("studentIdList"));
      } else {
        idList.length ? window.sessionStorage.setItem("classIdList", JSON.stringify(idList)) : '';
        classIdList = JSON.parse(window.sessionStorage.getItem("classIdList"));
      }
      let notFountStr = '';
      /**
       * 这里写请求列表接口的原因是：
       * 批量查询，有一个id校验的过程，
       * 后端将 id校验 和 列表查询 的流程整合到了一个接口里
       * （我没有想到更好的解决方案，用了下面的方法）
       * 这里接口的作用只是用来处理id校验，通过emit更新table数据
      */
      let requestFun = props.classType === ONETOONE_OR_SMALLCLASS.oneToOne
          ? root.$Api.systemManagement.getOneToOneList({idList: studentIdList})
          : root.$Api.systemManagement.getSmallClassList({idList: classIdList});
      const {status, data:{code, data}} = await requestFun;
      if (status === 200 && code === 200) {
        let notFountList = props.classType === ONETOONE_OR_SMALLCLASS.oneToOne
          ? data?.notFountList : data?.notFoundClassIdList;
        if (!notFountList.length ) return surplusFun();
        notFountStr = '未查询到的账号' + data?.notFountList.join('，');
        root.$confirm(notFountStr, '批量查询结果', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(_ => {
          surplusFun();
        })
        .catch(_ => {});
      }
    }

    const surplusFun = () => {
      emit('clearInput');
      emit('changeGetTableFun')
      handleClose();
    }

    const handleClose = () => {
      emit('update:dialogVisible', false);
    }

    return {
      idStr,
      handleConfim,
      handleClose
    }
  }
}
</script>

<style lang='scss' scoped>
</style>