export const ORDER_STATUS = Object.freeze({
  paymentDone: 1,
  refunded: 3,
  anotherRefunded: 4, // 3 & 4 都是已退款，用来控制table里按钮的显示
});

