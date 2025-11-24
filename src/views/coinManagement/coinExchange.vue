<template>
  <div class="coin-exchange-wrap">
    <el-dialog :before-close="close" :close-on-click-modal="false" :title="$t('分享')" center :visible.sync="qrDialogVisiable">
      <div class="dialog-item">
        <span class="key">{{$t('链接')}}：</span>
        <span>
          <el-input disabled style="width: 350px;" v-model="currentLinkUrl" class="input-with-select">
            <el-button slot="append" type="primary" style="color: #7580E5;" @click="cpLink">{{$t('复制专属链接')}}</el-button>
          </el-input>
        </span>
      </div>
      <div class="dialog-item">
        <span class="key">{{$t('二维码')}}：</span>
        <span>
          <img id="qrImg" src="@/assets/qrcode.png">
          <el-button type="text" @click="downloadImg">{{$t('下载二维码')}}</el-button>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="qrDialogVisiable = false">{{$t('关闭')}}</el-button>
      </span>
    </el-dialog>
    <div class="tips-box">
      <div class="section-name">
        <span class="title" :style="{width:currentLang === 'en' ? '196px' : '100px'}">{{$t('积分兑换功能')}}：</span>
        <span>{{exchangeName}}</span>
      </div>
      <div class="section-radio">
        <span class="title" :style="{width:currentLang === 'en' ? '196px' : '100px'}">{{$t('积分兑换状态')}}：</span>
        <el-radio-group v-model="exchangeRadio" @change="changeExchangeRadio">
          <el-radio :label="1">{{$t('开启')}}</el-radio>
          <el-radio :label="2">{{$t('关闭')}}</el-radio>
        </el-radio-group>
      </div>
      <div class="section-tip">
        <span class="title" :style="{width:currentLang === 'en' ? '196px' : '100px'}">{{$t('积分兑换说明')}}：</span>
        <span>{{$t('用户可在【个人中心 > 积分中心 > 积分兑换】使用积分兑换制定商品，您可以设置兑换商品所需积分分值，对积分兑换页面所有商品进行排序。')}}</span>
      </div>
    </div>
    <div class="table-box" v-if="exchangeRadio == 1">
      <div class="title">{{$t('适用商品')}}</div>
      <el-table :border="false" :data="tableData" v-loading="loading" tooltip-effect="dark" fit show-overflow-tooltip="true" style="width: 100%;margin-top:10px" stripe :header-cell-style="{background:'#f1f1f1',color:'#606266'}">
        <el-table-column fixed align="center" :label="$t('序号')" :width="50">
          <template slot-scope="scope">{{ (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" :label="$t('商品')" prop="name" min-width="200"></el-table-column>
        <el-table-column align="center" :label="$t('积分数量')" prop="unitCoin" min-width="120"></el-table-column>
        <el-table-column align="center" :label="$t('商品状态')" prop="status" min-width="120">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status == 1">{{$t('未上架')}}</el-tag>
            <el-tag type="success" v-if="scope.row.status == 2">{{$t('已上架')}}</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 3">{{$t('已下架')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('产品名称')" prop="name" min-width="200"></el-table-column>
        <el-table-column align="center" :label="$t('上架时间')" prop="validStartTime" min-width="160">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime( scope.row.validStartTime ) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('下架时间')" prop="endTime" min-width="160">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime( scope.row.validEndTime ) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('操作')" prop="op" min-width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="move(scope.$index, 'up')" :disabled="scope.$index == 0">{{$t('上移')}}</el-button>
            <el-button style="margin-right: 8px!important;" :disabled="scope.$index + 1 == tableData.length" type="text" @click="move(scope.$index, 'down')">{{$t('下移')}}</el-button>
            <el-dropdown>
              <el-button type="text">
                {{$t('更多')}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="share">{{$t('分享')}}</el-dropdown-item>
                <el-dropdown-item @click.native="removeItem(scope.row.id)">{{$t('移除')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination :total="total" :current-page="screenData.pageNum" @getCurrentPage="getCurrentPage" @getPerPage="getPerPage" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'coinExchange',

  computed:{
    ...mapGetters([
      'currentLang'
    ])
  },

  data() {
    return {
      currentLinkUrl: 'https://m.lingoace.com/coin/index.html',
      qrDialogVisiable: false,
      exchangeName: null,
      exchangeRadio: null,
      loading: false,
      total: 0,
      tableData: [],
      screenData: {
        pageNum: 1,
        pageSize: 50
      }
    }
  },

  watch: {

  },

  created() {
    this.exchangeName = this.$route.query.name == 1 ? '积分兑换' : '积分抵现'
    this.exchangeRadio = this.$route.query.status == 1 ? 1 : 2
    this.getCoinConvert()
  },

  methods: {
    getCoinConvert() {
      this.loading = true
      this.$Api.coinManagement.getCoinConvert(this.$route.query.name, this.screenData.pageNum, this.screenData.pageSize).then(({ status, data }) => {
        this.loading = false
        this.total = data.data.total
        this.tableData = data.data.list
      })
    },
    move(index, direction) {
      let currentItem = this.tableData[index]
      let targetItem = direction == 'up' ? this.tableData[index - 1] : this.tableData[index + 1]
      this.$Api.coinManagement.putCoinProductSort(currentItem.id, targetItem.id).then(res => {
        if (res.data.code == 200) {
          this.getCoinConvert()
        }
      })
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page
      this.getCoinConvert()
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage
      this.getCoinConvert()
    },
    // 开启关闭积分兑换功能
    changeExchangeRadio(e) {
      if (e == 1) {
        this.$confirm('确定要开启积分功能？开启后，用户将可以使用已有积分进行商品兑换。')
          .then(_ => {
            this.$Api.coinManagement.putCoinConsumeStatus(this.$route.query.id, 1).then(res => {
              if (res.data.code == 200) {
                this.exchangeRadio = 1
              } else {
                this.exchangeRadio = 2
              }
            })
          })
          .catch(_ => {
            this.exchangeRadio = 2
          })
      } else {
        this.$confirm('确定要关闭积分功能？关闭后，用户将无法使用已有积分进行商品兑换。')
          .then(_ => {
            this.$Api.coinManagement.putCoinConsumeStatus(this.$route.query.id, 2).then(res => {
              if (res.data.code == 200) {
                this.exchangeRadio = 2
              } else {
                this.exchangeRadio = 1
              }
            })
            this.exchangeRadio = 2
          })
          .catch(_ => {
            this.exchangeRadio = 1
          })
      }
    },
    // 移除功能
    removeItem(id) {
      this.$confirm('确定要移除此商品？')
        .then(_ => {
          this.$Api.coinManagement.removeCoinConsume(id).then(res => {
            if (res.data.code == 200) {
              this.$notify({
                message: '移除成功',
                type: 'success'
              })
              this.getCoinConvert()
            } else {
              this.$notify({
                message: '移除失败',
                type: 'error'
              })
            }
          })
          // this.tableData.splice(e.$index, 1)
        })
        .catch(_ => {

        })
    },
    // 分享
    share() {
      this.qrDialogVisiable = true
    },
    // 拷贝链接
    cpLink() {
      this.$notify({
        message: '链接已复制至粘贴板',
        type: 'success'
      })
    },
    downloadImg() {
      var img = document.getElementById('qrImg'); // 获取要下载的图片
      var url = img.src; // 获取图片地址
      var a = document.createElement('a'); // 创建一个a节点插入的document
      var event = new MouseEvent('click') // 模拟鼠标click点击事件
      a.download = '分享二维码' // 设置a节点的download属性值
      a.href = url; // 将图片的src赋值给a节点的href
      a.dispatchEvent(event)
    },
    // 两个元素互换位置
    swapArr(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    }
  }

}

</script>
<style lang="scss" scoped>
.coin-exchange-wrap {
  padding: 15px;

  .tips-box {
    width: 100%;
    background: #f6f6f6;
    padding: 15px;
    color: #333;
    font-size: 14px;

    .section-radio {
      margin-top: 10px;
    }

    .section-tip {
      margin-top: 10px;
    }

    .title {
      width: 100px;
      display: inline-block;
    }
  }

  .table-box {
    .title {
      color: #99a9bf;
      font-size: 14px;
      padding: 20px 0 0 0;
    }
  }
}

.dialog-item {
  margin-bottom: 20px;

  .key {
    display: inline-block;
    width: 72px;
  }

  img {
    width: 150px;
    height: 150px;
    vertical-align: top;
  }
}

</style>
