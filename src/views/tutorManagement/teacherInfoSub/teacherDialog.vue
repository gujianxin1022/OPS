<template>
    <el-dialog :visible.sync="visible" :title="$t(title)" width="500px" :before-close="handleClose" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" ref="formRef" :label-width=" $i18n.locale === 'en' ? '150px' : '80px'" label-position="left">
            <el-form-item :label="$t('质检结果')" prop="qualityCheckResult" v-if="isQualityCheck">
                <el-radio-group v-model="form.qualityCheckResult" :placeholder="$t('请输入质检结果')">
                    <el-radio :label="0">{{ $t('合格') }}</el-radio>
                    <el-radio :label="1">{{ $t('不合格') }}</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('原因')" prop="reason" v-if="(!isQualityCheck && !isModify) || form.qualityCheckResult === 1">
                <el-select v-model="form.reason" :placeholder="$t('请选择原因')" style="width: 80%" multiple>
                    <el-option v-for="item in reasonList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <div v-if="!isQualityCheck && isModify">
                <span>{{ $t('是否确认修改课堂投诉结果') }}</span>
            </div>
            <el-form-item :label="!isQualityCheck && isModify ? $t('原因') : $t('备注')" prop="remark">
                <el-input v-model="form.remark" :placeholder="!isQualityCheck && isModify ? $t('请输入原因') : $t('请输入备注')" type="textarea" :maxlength="200" :show-word-limit="true" style="width: 80%"/>
            </el-form-item>
        </el-form>
        <div class="action-btn">
            <el-button @click="handleClose" class="mr50">{{ $t('取消') }}</el-button>
            <el-button type="primary" @click="handleSubmit">{{ $t('确定') }}</el-button>
        </div>
        <div>
            {{ isQualityCheck ? $t('课堂质检') : $t('课堂投诉') }}{{  $t('结果如用于薪酬计算时，请在每月北京时间6号0点前完成标记，否则会影响教师薪酬计算结果') }}
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'teacherDialog',
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        isQualityCheck: {
            type: Boolean,
            default: false,
        },
        isModify: {
            type: Boolean,
            default: false,
        },
        virtualclassId: {
            type: String,
            default: '',
        },
        tutorUserId: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            id: '',
            form: {
                qualityCheckResult: 0,
                reason: [],
                remark: '',
            },
            reasonList: [
                { value: '1', label: this.$t('教学背景不合适') },
                { value: '2', label: this.$t('教室灯光不合适') },
                { value: '3', label: this.$t('网络不稳定') },
                { value: '4', label: this.$t('教师声音（麦克风）问题') },
                { value: '5', label: this.$t('教师耳机问题') },
                { value: '6', label: this.$t('沟通态度不好') },
                { value: '7', label: this.$t('上课分心') },
                { value: '8', label: this.$t('备课不充分') },
                { value: '9', label: this.$t('上课困倦') },
                { value: '10', label: this.$t('上课敷衍') },
                { value: '11', label: this.$t('其他') },
            ],
            rules: {
                qualityCheckResult: [{ required: true, message: this.$t('请输入质检结果'), trigger: 'blur' }],
                remark: [{ required: true, message: this.$t('请输入备注'), trigger: 'blur' }],
                reason: [{ required: true, message: this.$t('请选择原因'), trigger: 'blur' }],
            },
        }
    },
    computed: {
        title() {
            return this.isQualityCheck ? this.$t('课堂质检') : this.isModify ? this.$t('修正课堂质检') : this.$t('课堂投诉')
        }
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        handleSubmit() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    if(this.isQualityCheck) {
                        this.handleQualityCheck();
                    } else {
                        this.handleTouch();
                    }
                }
            });
        },
        async handleQualityCheck() {
            let api;
            if(this.isModify) {
                api = this.$Api.tutorManagement.updateQualityCheck;
            }else {
                api = this.$Api.tutorManagement.qualityCheck;
            }
            const params = {
                tutorUserId: this.tutorUserId,
                virtualclassId: this.virtualclassId,
                checkResult: this.form.qualityCheckResult,
                remark: this.form.remark,
                operator: JSON.parse(localStorage.getItem('userInfo')).id,
                operatorName: JSON.parse(localStorage.getItem('userInfo')).username,
                unqualifyReason: this.form.qualityCheckResult == '1' ? this.form.reason.join(',') : '',
            }   
            if(this.isModify) {
                params.id = this.id;
            }
            const res = await api(params);
            console.log(res);
            this.$emit('submit');
        },
        async handleTouch() { 
            let api;
            if(this.isModify) {
                api = this.$Api.tutorManagement.updateComplain;
            }else {
                api = this.$Api.tutorManagement.insterComplain;
            }
            const params = {
                virtualclassId: this.virtualclassId,
                operator: JSON.parse(localStorage.getItem('userInfo')).id,
                operatorName: JSON.parse(localStorage.getItem('userInfo')).username,
                tutorUserId: this.tutorUserId,
            }
            if(this.isModify) {
                params.id = this.id;
                params.amendReason = this.form.remark;
            }
            else {
                params.remark = this.form.remark;
                params.reason = this.form.reason.join(',');
            }
            const res = await api(params);
            console.log(res);
            this.$emit('submit');
        },
        async getQualityCheck() {
            const res = await this.$Api.tutorManagement.getQualityCheck({
                virtualclassId: this.virtualclassId,
            });
            this.id = res.id;
            this.form.qualityCheckResult = res.checkResult;
            this.form.reason = res.unqualifyReason ? res.unqualifyReason.split(',') : [];
            this.form.remark = res.remark;
        },
        async getTouch() {
            const res = await this.$Api.tutorManagement.getComplain({
                virtualclassId: this.virtualclassId,
            });
            this.id = res.id;
            this.form.remark = res.amendReason;
        },
        async getData() {
            if(this.isQualityCheck && this.isModify) {
                this.getQualityCheck();
            }else if(!this.isQualityCheck && this.isModify) {
                this.getTouch();
            }
        }
    },
    watch: {
        visible(newVal) {
            if(newVal) {
                this.form.qualityCheckResult = 0;
                this.form.reason = [];
                this.form.remark = '';
                this.getData();
            }
        }
    },
    mounted() {
    },
}
</script>

<style lang="scss" scoped>
.action-btn {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}
</style>