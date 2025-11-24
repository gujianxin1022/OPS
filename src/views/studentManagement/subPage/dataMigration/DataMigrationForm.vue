<script>
import { computed, reactive, unref, ref, watch } from "@vue/composition-api";

const InitialRow = { studentUserId: void 0, transferOutBalance: void 0 };

export default {
  name: "DataMigrationForm",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    balanceTotal: {
      type: Number,
      default: null,
    },
    balance: {
      type: Number,
      default: null,
    },
    balanceId: {
      type: Number,
      default: null,
    },
    parentUserId: {
      type: String,
      default: null,
    },
    studentUserId: {
      type: String,
      default: null,
    },
    parentUserName: {
      type: String,
      default: null,
    },
    coursePackageId: {
      type: Number,
      default: null,
    },
    coursePackageName: {
      type: String,
      default: null,
    },
  },
  setup(props, { root, emit, refs }) {
    const formState = reactive({
      studentList: [],
      transferList: [{ ...InitialRow }],
    });

    const submitLoading = ref(false);

    const quantityTotal /* 迁移数量总数 */ = computed(() =>
      formState.transferList.reduce(
        (a, b) => (a += b.transferOutBalance ?? 0),
        0
      )
    );

    const totalMax = computed(() => {
      const max = Math.max(props.balanceTotal, props.balance);
      const min = Math.min(props.balanceTotal, props.balance);
      return props.balanceTotal < 0 ? max : min;
    });

    const handleStudentChange = (value, row) => {
      const item = formState.studentList.find((item) => item.id === value);
      item.disabled = true;
      row.studentUserId = value;
    };

    const handleAdd = () => {
      formState.transferList.push({ ...InitialRow });
    };

    const handleRemove = (idx) => {
      if (formState.transferList[idx]["studentUserId"] !== void 0) {
        const item = formState.studentList.find(
          (item) => item.id === formState.transferList[idx]["studentUserId"]
        );
        item.disabled = false;
      }
      formState.transferList.splice(idx, 1);
    };

    const handleClose = () => {
      refs.form.resetFields();
      Object.assign(formState, {
        studentList: [],
        transferList: [{ ...InitialRow }],
      });
      emit("update:visible", false);
    };

    const handleOk = async () => {
      await refs.form.validate();
      if (props.balanceTotal > 0 && unref(quantityTotal) > unref(totalMax)) {
        return root.$message.error(
          props.balanceTotal === unref(totalMax)
            ? root.$t("迁移数量总数不能大于可迁移课时总数")
            : root.$t("迁移数量总数不能大于该条明细课时总数")
        );
      }
      if (props.balanceTotal < 0 && unref(quantityTotal) < unref(totalMax)) {
        return root.$message.error(
          props.balanceTotal === unref(totalMax)
            ? root.$t("迁移数量总数不能小于可迁移课时总数")
            : root.$t("迁移数量总数不能小于该条明细课时总数")
        );
      }
      try {
        submitLoading.value = true;
        props.studentUserId
          ? await studentClassHoursTransferStudent()
          : await parentsClassHoursTransferStudent();
        emit("ok");
        handleClose();
      } finally {
        submitLoading.value = false;
      }
    };

    const studentClassHoursTransferStudent /* 学生账户转换 */ = async () => {
      const { studentUserId, coursePackageId, balanceId } = props;
      const {
        status,
        data: { code },
      } = await root.$Api.studentManagement.studentClassHoursTransferStudent({
        studentUserId,
        coursePackageId,
        balanceId,
        transferList: formState.transferList,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
    };

    const parentsClassHoursTransferStudent /* 家长账户转换 */ = async () => {
      const { parentUserId, coursePackageId, balanceId } = props;
      const {
        status,
        data: { code },
      } = await root.$Api.studentManagement.parentsClassHoursTransferStudent({
        parentUserId,
        coursePackageId,
        balanceId,
        transferList: formState.transferList,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
    };

    const getStudentList /* 学生列表 */ = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.financeManagement.getStudentListByParentAccount(
        props.parentUserName
      );
      if (status !== 200 || code !== 200) return Promise.reject();
      if (props.studentUserId) {
        return (formState.studentList = data.studentInfoList.filter(
          (v) => String(v.id) !== props.studentUserId
        ));
      }
      formState.studentList = data.studentInfoList;
    };

    watch(
      () => props.visible,
      (val) => val && getStudentList()
    );

    return () => (
      <el-dialog
        width="800px"
        title={
          props.studentUserId
            ? root.$t("课时转换学员")
            : root.$t("家长账户数据迁移")
        }
        before-close={handleClose}
        visible={props.visible}
      >
        <el-form props={{ model: formState }} inline ref="form">
          <el-form-item label={root.$t("课程包名称")} class="mr20">
            {props.coursePackageName}
          </el-form-item>
          <el-form-item label={root.$t("账户余额")}>
            {`${props.balance}${root.$t("课时")}`}
          </el-form-item>
          {formState.transferList.map((row, idx) => (
            <div key={idx}>
              <el-form-item
                label={root.$t("选择学生")}
                prop={"transferList." + idx + ".studentUserId"}
                rules={{
                  required: true,
                  message: root.$t("请选择"),
                  trigger: "change",
                }}
              >
                <el-select
                  placeholder={root.$t("请选择")}
                  value={row.studentUserId}
                  onChange={(value) => handleStudentChange(value, row)}
                >
                  {formState.studentList.map((v) => (
                    <el-option
                      key={v.id}
                      label={v.realName}
                      value={v.id}
                      disabled={v.disabled}
                    />
                  ))}
                </el-select>
              </el-form-item>
              <el-form-item
                label={root.$t("迁移数量")}
                prop={"transferList." + idx + ".transferOutBalance"}
                rules={{
                  required: true,
                  trigger: "blur",
                  validator: (rule, value, callback) => {
                    if (value === 0) {
                      return callback(new Error(root.$t("迁移数量不可以为0")));
                    }
                    if (value === void 0) {
                      return callback(new Error(root.$t("请输入")));
                    }
                    return callback();
                  },
                }}
              >
                <el-input-number
                  placeholder={root.$t("请输入")}
                  max={props.balanceTotal > 0 ? Infinity : -1}
                  min={props.balanceTotal > 0 ? 1 : -Infinity}
                  value={row.transferOutBalance}
                  onChange={(value) => (row.transferOutBalance = value)}
                  precision={0}
                />
              </el-form-item>
              <el-button type="text" onClick={handleAdd}>
                {root.$t("增加")}
              </el-button>
              {formState.transferList.length > 1 && (
                <el-button type="text" onClick={() => handleRemove(idx)}>
                  {root.$t("删除")}
                </el-button>
              )}
            </div>
          ))}
        </el-form>
        <span slot="footer">
          <el-button onClick={handleClose}>{root.$t("取消")}</el-button>
          <el-button
            type="primary"
            onClick={handleOk}
            loading={unref(submitLoading)}
          >
            {root.$t("确定")}
          </el-button>
        </span>
      </el-dialog>
    );
  },
};
</script>

<style lang="scss" scoped>
.operation-button {
  line-height: 32px;
  margin-right: 8px;
  cursor: pointer;
}
</style>
