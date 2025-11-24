
import GetData from '@/utils/axios.js'

const { $get, $post, $put } = new GetData()


/**
 * 获取天猫订单列表
 * @param {Int} pageNum 页号
 * @param {Int} pageSize 页尺寸
 */
export const getOrderList = function(params ) {
  return $post(`/opsapi/tianmao/order/list`, params)
}

export const getDownloadFile = function ({ params }) {
  const url = `${process.env.VUE_APP_BASE_API}/opsapi/tianmao/order/downloadFile`;
  return $get({
    url: url,
    method: 'get',
    params,
    responseType: 'blob',
  }).then(handleBlobResponse('天猫订单.xlsx'))
    .catch(error => {
      console.error('下载文件失败:', error);
      // 这里可以根据需要进一步处理错误，例如显示错误消息
    });
};

function handleBlobResponse(filename) {
  return response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    return new Promise((resolve, reject) => {
      link.addEventListener('click', () => {
        link.remove();
        window.URL.revokeObjectURL(url);
        resolve();
      });
    });
  };
}
