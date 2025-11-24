<template>
    <div style="padding:20px;">
        <div v-if="display == 'order'" style="text-align:center;position:absolute;right:50px;">
            <el-button v-if="!modifyorder.channel" type="primary" @click="channEdit">{{ $t('编辑') }}</el-button>
            <el-button v-if="modifyorder.channel" type="primary" @click="saveData">{{ $t('保存') }}</el-button>
            <el-button v-if="modifyorder.channel" type="primary" @click="cancel">{{ $t('取消') }}</el-button>
        </div>
        <div v-if="bankInfo" class="el-descriptions">
            <div class="el-descriptions__header">
                <div class="el-descriptions__title">{{ $t('支付信息') }}</div>
                <div class="el-descriptions__extra"></div>
            </div>
            <div class="el-descriptions__body">
                <table v-for='item in bankDetail' :key="item.id" class="el-descriptions__table is-bordered">
                    <tbody>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('支付流水ID') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.paymentLogId}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('支付流水号') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.channelLogId}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('渠道') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.channel}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('手续费') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.fees}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('支付金额') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.amount}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('支付币种') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.currency}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('最终入账金额') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.finalAmount}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('最终入账币种') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{item.finalCurrency}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{$t('流水创建时间')}}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{DateTimeUtils.dateClockTime(item.createTime)}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('支付成功时间') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{DateTimeUtils.dateClockTime(item.payTime)}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{$t('收款时间')}}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{DateTimeUtils.dateClockTime(item.updateTime)}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{$t('异常原因')}}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{errorStatusType[item.errorStatus]}}</td>
                        </tr>
                        <tr class="el-descriptions-row" v-if="display==='bank'">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{$t('对账状态')}}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{reconciliationStatus[item.reconciliationStatus]}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{$t('处理备注')}}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">
                                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="item.artificialMark"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="orderInfo" class="el-descriptions" style="margin-top:20px;">
            <div class="el-descriptions__header">
                <div class="el-descriptions__title">{{ $t('订单信息') }}</div>
                    {{orderchannel}}
                <div class="el-descriptions__extra"></div>
            </div>
            <div class="el-descriptions__body">
                <table class="el-descriptions__table is-bordered">
                    <tbody>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('订单ID') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.orderId}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('订单编号') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.orderNo}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('第三方支付订单号') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">
                                <div v-for="i in orderdetails.referenceArr" :key="i.reference">{{ i. reference}}</div>
                            </td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('产品名称') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{currentLang === "en" ? orderdetails.productNameEn :  orderdetails.productNameZh}}</td>
                        </tr>
                        <tr class="el-descriptions-row">   
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('充值课时(课时)') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.rechargeAmount}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('奖励课时(课时)') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.incentiveAmount}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('课包单价') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.rate}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('总课时(课时)') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.totalAmount}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('渠道') }}</th>
                            <td v-if="!modifyorder.channel" :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">
                                {{orderdetails.paymentChannel}}
                            </td>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content" v-else><el-input v-model="updateOrder.paymentChannel" clearable placeholder="请输入支付通道"></el-input></td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('币种') }}</th>
                            <td v-if="!modifyorder.channel"  :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.currency}}</td>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content" v-else>
                                <el-select v-model="updateOrder.currency" :placeholder="$t('请选择')">
                                    <el-option
                                    v-for="item in currylist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('商品总原价') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.originTotalPrice}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('优惠码') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.code?orderdetails.code:"无"}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('优惠金额') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.savePrice}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('税率') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.taxRate}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('税费金额') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.taxFee}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('实际支付金额') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.totalPrice}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('第三方支付订单号') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">
                                <div v-for="i in orderdetails.referenceArr" :key="i.reference">{{ i. reference}}</div>
                            </td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('支付成功时间（订单）') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{DateTimeUtils.dateClockTime(orderdetails.paymentSuccessTime)}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('支付方式') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.paymentType}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('异常原因') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{errorStatusType[orderdetails.errorStatus]}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            
                        </tr>
                        <tr class="el-descriptions-row" v-if="display=='order'">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('对账状态') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{reconciliationStatus[orderdetails.reconciliationStatus]}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('修改备注') }}</th>
                            <td v-if="!modifyorder.channel" :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.artificialMark?orderdetails.artificialMark:"无"}}</td>
                            <td v-else :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">
                                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="updateOrder.artificialMark"></el-input>
                            </td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('是否首次充值') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{firstRecharge[orderdetails.firstRecharge]}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('家长用户标识') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.parentUserId?orderdetails.parentUserId:"无" }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="el-descriptions" v-if='details.difference!==0' style="margin-top:20px;">
          <div class="el-descriptions__header">
              <div class="el-descriptions__title">{{ $t('对账差额补单') }}</div>
                  {{orderchannel}}
              <div class="el-descriptions__extra"></div>
          </div>
          <div class="el-descriptions__body">
                <table class="el-descriptions__table is-bordered">
                    <tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('订单创建时间') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{DateTimeUtils.dateClockTime(orderdetails.createTime)}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('创建人') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.artificialUserName}}</td>
                        </tr>
                    </tr>
                    <tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('订单编号') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{orderdetails.orderNo}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('订单金额') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{details.difference}} {{ details.currency }}</td>
                        </tr>
                    </tr>
                </table>
          </div>
        </div>
        <div v-if="display == 'record'" class="el-descriptions" style="margin-top:20px;">
            <div class="el-descriptions__header">
                <div class="el-descriptions__title">{{ $t('对账信息') }}</div>
                <div class="el-descriptions__extra"></div>
            </div>
            <div class="el-descriptions__body">
                <table class="el-descriptions__table is-bordered">
                    <tbody>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('对账ID') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{details.id}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('对账金额') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{details.amount}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('对账币种') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{details.currency}}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('对账完成时间') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{DateTimeUtils.dateClockTime(details.updateTime)}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('人工处理备注') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{details.artificialMark?details.artificialMark:"无" }}</td>
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('人工处理用户姓名') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{details.artificialUserName?details.artificialUserName:"无"}}</td>
                        </tr>
                        <tr class="el-descriptions-row">
                            <th :colspan="thcollpan" class="el-descriptions-item__cell el-descriptions-item__label is-bordered-label">{{ $t('对账状态') }}</th>
                            <td :colspan="collpan" class="el-descriptions-item__cell el-descriptions-item__content">{{errorStatusType[details.errorStatus]}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div> 
        <div v-if="display == 'bank' && !modifyorder.channel" style="text-align:center;margin-top:20px;">
            <el-button :loading="loading" type="primary" @click="righting">{{ $t('冲正处理') }}</el-button>
        </div>
    </div>
</template>

<script>
import {onMounted, ref, computed, reactive} from "@vue/composition-api"
export default {
    setup(props,{root}){
        const display = ref("")
        const collpan = ref(6)
        const thcollpan = ref(1)
        const details = ref({
            artificialMark:""
        })
        const modifyorder = reactive({
            channel:false,
            mark:""
        })
        const orderdetails = ref({})
        const bankDetail = ref({})
        const mark = ref("")
        const loading = ref(false)
        const currentLang = computed(() =>
            root.$store.getters.currentLang
        );
        const errorStatusType = {
            0:"正常",
            1:"订单单边",
            2:"支付单边",
            3:"金额不一致"
        }
        const reconciliationStatus = {
            0:"未对账",
            1:"已对账"
        }

        const payStatus = {
            0:"待支付",
            1:"已支付",
            2:"支付失败",
            3:"退款",
            4:"重复支付，支付取消退还",
            5:"用户取消订单",
            6:"系统设置订单已超时"
        }
        const orderType = {
            1:"普通充值",
            2:"双十二拼团",
            3:"兑换码活动"
        }
        const firstRecharge = {
            0:"续费",
            1:"首充"
        }
        const receiptStatus = {
            0:"生成中",
            1:"已生成",
            2:"历史数据"
        }
        const currylist = reactive([
            {label:"USD",value:"USD"},
            {label:"SGD",value:"SGD"},
            {label:"THB",value:"THB"},
            {label:"IDR",value:"IDR"},
            {label:"HKD",value:"HKD"},
            // {label:"OTHER",value:"OTHER"}
        ])
        const updateOrder = reactive({
            artificialMark:"",
            paymentChannel:"",
            currency:""
        })
        // 业务订单 编辑
        const channEdit = () => {
            modifyorder.channel = true
            const obj = JSON.parse(JSON.stringify(orderdetails.value))
            updateOrder.artificialMark = obj.artificialMark
            updateOrder.paymentChannel = obj.paymentChannel
            updateOrder.currency = obj.currency
        }
        const cancel = () => {
            modifyorder.channel=false
        }
        const saveData = async() => {
            let params = {
                currency:updateOrder.currency,
                mark:updateOrder.artificialMark,
                channel:updateOrder.paymentChannel
            }
            const {status,data:{code,message}} = await root.$Api.financeManagement.orderArtificial(root.$route.query.id,params)
            if(status == 200 && code == 200){
                modifyorder.channel = false
                root.$notify.success({
                    message: message
                })
                getdetails()
            }
        }
        const orderInfo = computed(() => {
            return display.value === "record" && ordetStatus.value === 1 ||  display.value === "order" 
        })
        const bankInfo = computed(() => {
            return display.value === "record" && bankStatus.value === 2 ||  display.value === "bank" 
        })
        const ordetStatus = ref(0)
        const bankStatus = ref(0)
        const getdetails = async () => {
            switch(root.$route.query.name){
                case "order":
                    const {status,data:{code,data}} = await root.$Api.financeManagement.getOrderDetail(root.$route.query.id)
                    if(data){
                        orderdetails.value = Object.assign(data)
                    }
                    break;
                case "bank":
                    const {data:bankDetails} = await root.$Api.financeManagement.getPaymentDetail(root.$route.query.id)
                    bankDetail.value = Object.assign(bankDetails.data) 
                    break;
                case "record":
                    const {data:recordDetail} = await root.$Api.financeManagement.getBusinessDetail(root.$route.query.id)
                    console.log(recordDetail)
                    details.value = Object.assign(recordDetail.data)
                    if(recordDetail.data.paymentLogDetailResp){
                        bankDetail.value = Object.assign(recordDetail.data.paymentLogDetailResp)
                        bankStatus.value = 2
                    }
                    
                    if(recordDetail.data.orderDetailResp){
                        orderdetails.value = Object.assign(recordDetail.data.orderDetailResp)
                        if(orderdetails.value.referenceAdditions?.length){
                            orderdetails.value.referenceArr= JSON.parse(orderdetails.value.referenceAdditions)
                        }
                        ordetStatus.value = 1
                    }
                    break;
            }
        }
        const righting = () => {
            if(root.$route.query.name == "order"){
                opsorder()
            }else{
                paybank()
            }
        }
            // 业务对账
        const opsorder = async() => {
            loading.value = true
            modifyorder.channel = false
            let params = {
            mark:modifyorder.mark,
            orderSyncId:root.$route.query.id
            }
            const { status, data:{code,message}} = await root.$Api.financeManagement.businessOrder(params)
            if(status == 200 && code == 200){
                root.$notify.success({
                    message: message
                })
                setTimeout(() => {
                    loading.value = false
                    root.$router.push("/financeManagement/bankrecord")
                },1000)
                
            }
        }
        // 银行对账
        const paybank = async() => {
            loading.value = true
            let params = {
                mark:bankDetail.value.artificialMark,
                paymentLogId:root.$route.query.id
            }
            const {status, data: {code,message}} = await root.$Api.financeManagement.businessArtificialpaymentlog(params)
            if(status == 200 && code == 200){
                root.$notify.success({
                    message: message
                })
                setTimeout(() => {
                    loading.value = false
                    root.$router.push("/financeManagement/bankrecord")
                },1000)
                
            }
        }
        onMounted(() =>{
            display.value = root.$route.query.name
            getdetails()
        })
        return{
            collpan,
            thcollpan,
            display,
            details,
            orderdetails,
            currentLang,
            mark,
            righting,
            channEdit,
            modifyorder,
            saveData,
            currylist,
            bankDetail,
            reconciliationStatus,
            cancel,
            updateOrder,
            loading,
            orderInfo,
            bankInfo,
            payStatus,
            errorStatusType,
            orderType,
            firstRecharge,
            receiptStatus
        }
    }
}
</script>

<style lang="scss" scoped>
.el-descriptions {
    box-sizing: border-box;
    font-size: 14px;
    color: #303133;
}
.el-descriptions__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.el-descriptions__body {
    color: #606266;
    background-color: #fff;
}
.el-descriptions .is-bordered {
    table-layout: auto;
}
.el-descriptions__body .el-descriptions__table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;
}

table {
    display: table;
    border-collapse: separate;
    box-sizing: border-box;
    text-indent: initial;
    border-spacing: 2px;
    border-color: grey;
}
tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
}

.el-descriptions .el-descriptions-item__cell {
    width: 200px;
    border: 1px solid #ebeef5;
    padding: 12px 10px;
}
.el-descriptions__body .el-descriptions__table .el-descriptions-item__cell {
    box-sizing: border-box;
    font-weight: 400;
    line-height: 1.5;
}
.el-descriptions-item__label.is-bordered-label {
    font-weight: 700;
    color: #909399;
    background: #fafafa;
    text-align: center;
}

</style>