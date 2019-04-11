const app = getApp()
var util = require('../../../utils/util1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numberperpage: 6,
    pagenumber: 1,
    statusType: ["全部", "待付款", "待发货", "已发货", "已完成"],
    currentTab: 0, // tab切换  
    orderList: [],
    url: app.globalData.baseUrl,
    isFromSearch:true,
    level:""
  },
  // 获取身份信息
  loadUser: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/my/get-shop-user-info.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
      },
      method: "post",
      success: function (res) {
        that.setData({
          level: res.data.data.membership_level
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  // 接收传递的订单状态链接参数
  onLoad: function (options) {
    var that = this;
    that.setData({
      currentTab: options.currentTab
    })
  }, 
  // 跳转详情页
  toDetail:function(e){
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转物流
  toWuliu:function(e){
    wx.navigateTo({
      url: '/pages/user/orderList/logistics/logistics?id=' + e.currentTarget.dataset.id,
    })
  },
  // 支付
  toPayTap:function(e){

    var that =this
    wx.request({
      url: app.globalData.baseUrl + '/order/wxpay-string.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        open_id: wx.getStorageSync('openId'),
        order_id: e.currentTarget.dataset.id
      },
      success: function (res) {

        wx.requestPayment({
          timeStamp: String(res.data.data.timeStamp),
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success: function (res) {
            wx.request({
              url: app.globalData.baseUrl + '/order/synchronous-callback.html?token=' + wx.getStorageSync('token'),
              header: {
                'content-type': 'application/x-www-form-urlencoded'

              },
              method: 'POST',
              data: {
                order_id: e.currentTarget.dataset.id
              },
              success: function (res) {
                wx.redirectTo({
                  url: '/pages/user/orderList/orderList?currentTab=2',
                })
              }
            })

          },
          fail: function (res) {
            wx.showToast({
              duration: 1000,
              title: '支付失败！',
              icon: 'none'
            });
          }

        });
      }
    })
  },
  // 取消订单
  toConfirm: function (e) {
    let that = this
    let order_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要取消订单？',
      success: function (res) {
        if (res.cancel) {

        } else {
          wx.request({
            url: app.globalData.baseUrl + '/order/cancel-order.html?token=' + wx.getStorageSync('token'),
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              order_id: order_id
            },
            method: "post",
            success: function (res) {
              if (res.data.status == 10000) {
                wx.showModal({
                  title: '',
                  content: '取消订单成功',
                  showCancel: false,
                  success: function (res) {
                    that.loadData()
                  }
                })
              }
            }
          })

        }
      }
    })

  },
  // 确认收货
  toCancel: function (e) {
    let that = this
    let order_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认收货？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/order/ordercompleted.html?token=' + wx.getStorageSync('token'),
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              order_id: order_id
            },
            method: "post",
            success: function (res) {
              if (res.data.status == 10000) {
                wx.showModal({
                  title: '',
                  content: '确认收货成功!',
                  showCancel: false,
                  success: function (res) {
                    that.loadData()
                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
     
      }
    })
  },
  loadData: function (e) {
    var that = this
  
    if (that.data.currentTab == undefined) {
      that.data.currentTab = ""
    }
    wx.request({
      url: app.globalData.baseUrl + '/order/list.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "post",
      data: {
        numberperpage: 6,
        pagenumber: 1,
        status: that.data.currentTab
      },
      success: function (res) {
        var datas = res.data.data.list;
        for (let i = 0; i < datas.length; i++) {
          datas[i]["created_date"] = util.tsFormatTime(datas[i]["created_date"]),
          datas[i]["courier_number"] = String(datas[i]["courier_number"])
           
        }
        that.setData({
          orderList: datas
        })
      }
    })
  },
  pageData: function () {
    console.log(this.data.pagenumber)
    var that = this
    if (that.data.currentTab == undefined) {
      that.data.currentTab = ""
    }
    wx.request({
      url: app.globalData.baseUrl + '/order/list.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "post",
      data: {
        status: that.data.currentTab,
        numberperpage: that.data.numberperpage,
        pagenumber: that.data.pagenumber
      },
      success: function (res) {
        console.log(res.data.data.list)
        
        if (res.data.data.list.length > 0) {
          var datas = res.data.data.list;
          for (let i = 0; i < datas.length; i++) {
            datas[i]["created_date"] = util.tsFormatTime(datas[i]["created_date"]),
              datas[i][" courier_number"] = String(datas[i][" courier_number"])
          }
          that.setData({
            orderList: that.data.orderList.concat(datas)
          })
        } else {
          wx.showToast({
            icon: "none",
            title: "数据加载完毕~"
          })
        }
      }
    })
  },
  onShow: function () {
    var that = this;
    that.loadData();
    that.loadUser()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    var that = this;
    var pagenumber = that.data.pagenumber

    that.setData({
      pagenumber: ++pagenumber,
      isFromSearch: false  
    });
    setTimeout(function () {
      wx.showToast({
        icon: "loading",
        title: '加载中..',
      }),
        that.pageData()

    }, 1000)
  },


  //点击tab切换
  swichNav: function (e) {
    // wx.scanCode({
    //   success: (res) => {
    //     console.log(res)
    //   }
    // })
    var that = this;
    if (this.data.currentTab === e.target.dataset.index) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.index,
        pagenumber:1
      })
    }
    that.loadData(e.target.dataset.index)
  },
})

//时间戳转换时间  
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
}