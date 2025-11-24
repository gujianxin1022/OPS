import { onMounted, reactive, ref, computed } from "@vue/composition-api";

export default function gettable(root, name) {
  const data = reactive({
    opspage: 1,
    opspageSize: 50,
    page: 1,
    pageSize: 50,
    total: 0,
    banktotal: 0,
    opstotal: 0,
    dialogVisible: false,
  });
  const screenData = reactive({
    errorStatus: "",
    channelLogId: "",
    currency: "",
    time: "",
    orderNo: "",
    status: "",
    orderCreateTime: "",
    paymentChannel: "",
    paymentSecondChannel: "",
    paymentType: "",
    paymentTypeList: [],
    selectedRows: [],
    loading: false,
  });
  const opsscreenData = reactive({
    errorStatus: "",
    spuIdList: "",
    orderType: "",
    orderCreateStartTime: "",
    orderCreateEndTime: "",
    orderNo: "",
    paymentChannel: "",
    paymentType: "",
    channelLogId: "",
    paySuccessStartTime: "",
    paySuccessEndTime: "",
    currency: "",

    paymentType: "",
    paymentTypeList: [],
    selectedRows: [],
    loading: false,
  });
  const tableData = ref([]);
  const opstableData = ref([]);
  const currentLang = computed(() => root.$store.getters.currentLang);
  const getData = async (name) => {
    const { page, pageSize, opspage, opspageSize } = data;
    switch (name) {
      case "账号":
        tableData.value = [
          {
            code: "01",
            bank: "040473009",
            name: "PPLingo Pte.Lid",
            country: "新加坡",
            channel: "Stripe",
            open: "花期银行",
            currency: "SGD",
            date: "2021-11-28 16:41:03",
            enable: 1,
            create: "2021-11-28 16:41:03",
            operator: "张三",
          },
          {
            code: "01",
            bank: "040473009",
            name: "PPLingo Pte.Lid",
            country: "新加坡",
            channel: "Stripe",
            open: "花期银行",
            currency: "SGD",
            date: "2021-11-28 16:41:03",
            enable: 1,
            create: "2021-11-28 16:41:03",
            operator: "张三",
          },
          {
            code: "01",
            bank: "040473009",
            name: "PPLingo Pte.Lid",
            country: "新加坡",
            channel: "Stripe",
            open: "花期银行",
            currency: "SGD",
            date: "2021-11-28 16:41:03",
            enable: 1,
            create: "2021-11-28 16:41:03",
            operator: "张三",
          },
          {
            code: "01",
            bank: "040473009",
            name: "PPLingo Pte.Lid",
            country: "新加坡",
            channel: "Stripe",
            open: "花期银行",
            currency: "SGD",
            date: "2021-11-28 16:41:03",
            enable: 1,
            create: "2021-11-28 16:41:03",
            operator: "张三",
          },
        ];
        break;
      case "银行对账":
        let {
          errorStatus,
          spuIdList,
          orderType,
          orderCreateStartTime,
          orderCreateEndTime,
          orderNo: opsorderNo,
          paymentChannel,
          paymentType,
          channelLogId: opschannelLogId,
          currency: opscurrency,
          paySuccessStartTime,
          paySuccessEndTime,
        } = opsscreenData;
        let opsparams = {
          errorStatus,
          spuIdList,
          orderType,
          orderCreateStartTime,
          orderCreateEndTime,
          orderNo: opsorderNo,
          paymentChannel,
          paymentType,
          channelLogId: opschannelLogId,
          currency: opscurrency,
          paySuccessStartTime,
          paySuccessEndTime,
        };
        let bankParams = {
          channelLogId: screenData.channelLogId,
          currency: screenData.currency,
          paySuccessStartTime: screenData.paySuccessStartTime,
          paySuccessEndTime: screenData.paySuccessEndTime,
          paymentType: screenData.paymentType,
          errorStatus: screenData.errorStatus,
          paymentChannel: screenData.paymentChannel,
          paymentSecondChannel: screenData.paymentSecondChannel,
        };
        const { data: opsdata } =
          await root.$Api.financeManagement.getOrderReconciliation(
            opspage,
            opspageSize,
            opsparams
          );
        const { data: bankdata } =
          await root.$Api.financeManagement.getPaymentReconciliation(
            page,
            pageSize,
            bankParams
          );
        if (opsdata.data.list) {
          opsdata.data.list.forEach((e) => {
            e.referenceArr = JSON.parse(e.referenceAdditions);
          });
        }
        data.opstotal = opsdata.data.total;
        data.banktotal = bankdata.data.total;
        opstableData.value = opsdata.data.list;
        tableData.value = bankdata.data.list;
        break;
      case "ops":
        const { data: opsData } =
          await root.$Api.financeManagement.getOrderReconciliation(
            page,
            pageSize,
            screenData
          );
        data.taotal = opsData.data.total;
        break;
      case "对账单":
        const { data: bankData } =
          await root.$Api.financeManagement.getPaymentReconciliation(
            page,
            pageSize,
            screenData
          );
        data.total = bankData.data.total;
        tableData.value = bankData.data.list;
        break;
      case "核对":
        let recordparams = {
          channelLogId: screenData.channelLogId || "",
          orderNo: screenData.orderNo || "",
          status: screenData.status || "",
          startTime: screenData.startTime || "",
          endTime: screenData.endTime || "",
          orderCreateStartTime: screenData.orderCreateStartTime || "",
          orderCreateEndTime: screenData.orderCreateEndTime || "",
          paySuccessStartTime: screenData.paySuccessStartTime || "",
          paySuccessEndTime: screenData.paySuccessEndTime || "",
          orderType: screenData.orderType,
          paymentType: screenData.paymentType,
          difference: screenData.difference ? 1 : null,
          paymentChannel: screenData.paymentChannel || "",
          paymentSecondChannel: screenData.paymentSecondChannel || "",
        };
        // for (var key in objrecord) {
        //   if (objrecord[key] !== "") {
        //     recordparams[key] = objrecord[key];
        //   }
        // }
        const { data: checkdata } =
          await root.$Api.financeManagement.checkRecord(
            page,
            pageSize,
            recordparams
          );
          checkdata.data.list&&checkdata.data.list.forEach(e=>{
            e.paymentLogIdArr=e?.paymentLogId.split(',')||[]
          })
        tableData.value = checkdata.data.list;
        data.total = checkdata.data.total;
    }
  };

  // 获取当前页码
  const opsgetCurrentPage = (currentPage) => {
    data.opspage = currentPage;
    getData(name)
      .then(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      })
      .catch(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      });
  };

  // 改变每页展示数据的条数
  const opsgetPerPage = (perPage) => {
    data.opspageSize = perPage;
    data.opspage = 1;
    getData()
      .then(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      })
      .catch(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      });
  };

  // 获取当前页码
  const getCurrentPage = (currentPage) => {
    data.page = currentPage;
    getData(name)
      .then(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      })
      .catch(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      });
  };
  // 改变每页展示数据的条数
  const getPerPage = (perPage) => {
    data.pageSize = perPage;
    data.page = 1;
    getData(name)
      .then(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      })
      .catch(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      });
  };

  //   ops 查询
  const opssearch = () => {
    opsscreenData.loading = true;
    data.opspage = 1;
    getData(name)
      .then(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      })
      .catch(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      });
  };
  const search = () => {
    screenData.loading = true;
    data.page = 1;
    getData(name)
      .then(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      })
      .catch(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      });
  };
  onMounted(() => {
    opsscreenData.loading = true;
    screenData.loading = true;
    getData(name)
      .then(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      })
      .catch(() => {
        opsscreenData.loading = false;
        screenData.loading = false;
      });
  });
  return {
    data,
    tableData,
    opstableData,
    currentLang,
    screenData,
    opsscreenData,
    getData,
    opsgetCurrentPage,
    opsgetPerPage,
    getCurrentPage,
    getPerPage,
    opssearch,
    search,
  };
}
