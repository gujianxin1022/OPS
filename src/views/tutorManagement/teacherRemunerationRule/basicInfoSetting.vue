<template>
    <div class="basic-info-setting">
    <el-form :model="form" :disabled="disabledForm" label-width="100px" :rules="rules" ref="formRef" labelPosition="right" style="width: 500px;">
        <el-form-item :label="$t('规则类型')"  prop="type">
            <el-select v-model="form.type" :placeholder="$t('请选择规则类型')" :disabled="disabledPart" @change="handleChangeType">
                <el-option v-for="item in ruleType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('规则名称')" prop="name">
            <el-input type="textarea" v-model="form.name" :placeholder="$t('请输入规则名称')" :maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t('关联课包树')" prop="num" v-if="form.type === 1 || form.type === 4">
            <el-button type="primary" @click="handleOpenRelatedCourseTree" :disabled="disabledPart || disabledForm">+{{ $t('关联课包树') }}</el-button><i style="color: #999;">（{{$t('已关联')+form.num+$t('个')}}）</i>
        </el-form-item>
        <el-form-item :label="$t('计薪币种')" prop="currency">
            <el-select v-model="form.currency" :placeholder="$t('请选择计薪币种')" prop="currency" :disabled="disabledPart">
                <el-option v-for="item in currencyList" :key="item.value" :label="item.currencyZh + '(' + item.currency + ')'" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('生效时间')" prop="effectiveTime">
            <el-date-picker 
            v-model="form.effectiveTime" 
            type="datetime" 
            :placeholder="$t('请选择生效时间')" 
            :disabled="disabledPart" 
            :picker-options="{
                disabledDate(time) {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                }
            }" />
        </el-form-item>
        <el-form-item :label="$t('失效时间')" prop="invalidTime">
            <el-date-picker 
            v-model="form.invalidTime" 
            type="datetime" 
            :placeholder="$t('请选择失效时间')"
            :picker-options="{
                disabledDate(time) {
                    return time.getTime() < Date.now() - 3600 * 1000 * 24;
                }
            }" />
        </el-form-item>
    </el-form>

    <div class="basic-info-setting-footer">
        <el-button @click="handleCancel" style="margin-right: 100px;">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="handleNext">{{ $t('下一步') }}</el-button>
    </div>
    <related-course-tree :visible="dialogVisible" :subjectType="subjectType" :salaryLabel="salaryLabel"  :ruleId="ruleId" @confirm="handleConfirmDialog" :ruleInfo="ruleInfo" @cancel="handleCancelDialog"/>
    </div>
</template>

<script>
import { ruleType } from "./data";
import { reactive, ref, computed, onMounted, watch, nextTick } from "@vue/composition-api";
import relatedCourseTree from "./relatedCourseTree.vue";
import { getStorage } from "@/utils/handleStorage";
import moment from "moment";
export default {
    name: "basicInfoSetting",
    components: {
        relatedCourseTree,
    },
    props: {
        disabledForm: {
            type: Boolean,
            default: false
        },
        disabledPart: {
            type: Boolean,
            default: false
        },
        subjectType: {
            type: String,
            default: ""
        },
        salaryLabel: {
            type: String,
            default: ""
        },
        salaryLabelName: {
            type: String,
            default: ""
        },
        ruleId: {
            type: String,
            default: ""
        },
        ruleInfo: {
            type: Object,
            default: () => ({})
        },
    },
    setup(props, { root, emit }) {
        const disabledForm = computed(() => props.disabledForm || false);
        const disabledPart = computed(() => props.disabledPart || false);
        const formRef = ref(null);
        const dialogVisible = ref(false);
        const rules = {
            type: [
                { required: true, message: root.$t('请选择规则类型'), trigger: 'change' }
            ],
            name: [
                { required: true, message: root.$t('请输入规则名称'), trigger: 'blur' }
            ],
            num: [
                { required: true, message: root.$t('请选择关联课包树'), trigger: 'change' },
                { validator: (rule, value, callback) => {
                    if (form.num === 0) {
                        callback(new Error(root.$t('请选择关联课包树')));
                    }
                    callback();
                }, trigger: 'change' }
            ],
            currency: [
                { required: true, message: root.$t('请选择计薪币种'), trigger: 'change' }
            ],

            effectiveTime: [
                { required: true, message: root.$t('请选择生效时间'), trigger: 'blur' },
                { validator: (rule, value, callback) => {
                    if (value && value < Date.now()) {
                        callback(new Error(root.$t('生效时间不能早于当前时间')));
                    }
                    callback();
                }, trigger: 'blur' }
            ],
            invalidTime: [
                { required: true, message: root.$t('请选择失效时间'), trigger: 'blur' },
                { validator: (rule, value, callback) => {
                    if (value && value < form.effectiveTime) {
                        callback(new Error(root.$t('失效时间不能早于生效时间')));
                    }
                    callback();
                },   trigger: 'blur' }
            ]
        }
        const form = reactive({
            type: "",
            name: "",
            num: 0,
            currency: "",
            effectiveTime: "",
            invalidTime: "",
            packageInfoList: [],
        });
        const currencyList = ref([]);
        const getCurrencyList = async () => {
            const data = await root.$Api.systemManagement.getCurrency();
            currencyList.value = data.filter(item => item.currency === "CNY" || item.currency === "USD");
        };
        const submitForm = () => {
            const params = {
                "ruleType": form.type,
                "ruleName": form.name.trim(),
                "packageInfoList":[...form.packageInfoList],
                "effectiveTime": moment(form.effectiveTime).toISOString(),
                "expireTime": moment(form.invalidTime).toISOString(),
                "subjectType": props.subjectType,
                "salaryCurrency": form.currency,
                "salaryLabel": props.salaryLabel,
                "salaryCurrencyName":currencyList.value.find(item => item.id == form.currency)?.currency || "",
            };
            if(props.ruleId){
                params.updateUserId = JSON.parse(getStorage("userInfo")).id;
            }else{
                params.createUserId = JSON.parse(getStorage("userInfo")).id;
            }
            emit("next",params);
        };
        const handleChangeType = () => {
            form.name = props.salaryLabelName + '-' + (ruleType.find(item => item.value === form.type)?.label || "");
        };
        const handleOpenRelatedCourseTree = () => {
            dialogVisible.value = true;
        };
        const handleConfirmDialog = (data) => {
            dialogVisible.value = false;
            if(data.length > 0){
                form.packageInfoList = data[1];
                form.num = data[0];
                nextTick(() => {
                    formRef.value.validateField("num");
                });
            }
        };
        const handleCancelDialog = () => {
            dialogVisible.value = false;
        };
        const handleCancel = () => {
            root.$confirm('确定要取消吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				root.$message({
					type: 'success',
					message: '取消成功!'
				});
				emit("cancel");
			});
        };
        const handleNext = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    console.log("valid success");
                    submitForm();
                }else{
                    console.log("error submit!!");
                    return false;
                }
            });
        };
        watch(() => props.ruleInfo,(newVal) => {
            if(newVal.ruleId){
                form.type = newVal.ruleType;
                form.name = newVal.ruleName;
                form.packageInfoList = newVal.packageInfoList;
                form.currency = newVal.salaryCurrency;
                form.effectiveTime = newVal.effectiveTime;
                form.invalidTime = newVal.expireTime;
                form.num = newVal.packageTreeCount;
            }
        });
        onMounted(() => {
            getCurrencyList();
        });
        return {
            disabledForm,
            disabledPart,
            form,
            formRef,
            rules,
            handleOpenRelatedCourseTree,
            handleConfirmDialog,
            handleCancelDialog,
            handleCancel,
            handleNext,
            handleChangeType,
            ruleType,
            dialogVisible,
            currencyList,
        };
    },
};
</script>

<style lang="scss" scoped>
.basic-info-setting {
    .el-form-item {
        margin-bottom: 16px;
        
        // 统一所有输入控件的宽度
        ::v-deep .el-input,
        ::v-deep .el-select,
        ::v-deep .el-date-editor {
            width: 100%;
        }
        
        // 确保输入框内部组件也保持统一宽度
        ::v-deep .el-input__inner,
        ::v-deep .el-select__inner,
        ::v-deep .el-date-editor .el-input__inner {
            width: 100%;
        }
    }
    .basic-info-setting-footer {
        display: flex;
        padding: 20px 100px;
    }
}
</style>