//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    // totalScoreToPay: 0,
    order: [],
    isNeedLogistics: 0, // 是否需要物流信息
    totalMoney: 0,
    couponPrice: "",
    coupon_id: 0,
    addressList: [],
    addressLists: [],
    goodsJsonStr: "",
    // orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    addressShow: true,
    hasNoCoupons: true,
    coupons: [],
    couponNum: 0,
    comment: "",
    addrId: "",
    couponId: "",
    goods_id: "",
    goodsArray: {},
    buyNumber: 0,
    array: "",
    addressId: 0,
    level: "",
    optional_id:"",
    url: app.globalData.baseUrl,
    curIndex: 0,
    curNav: 0,
    postage:0,//邮费
    payType: [
    {
        id: 2,
        name: "余额支付"
      }
    ],

    curCoupon: null // 当前选择使用的优惠券
  },
  couponCheck: function (e) {
    var that = this
    // 获取item项的id，和数组的下标值  
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  // 获取身份信息
  loadUser: function() {
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
      success: function(res) {
        that.setData({
          level: res.data.data.membership_level
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },

  loadItem: function(e) {
    console.log(e)
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (e == "") {
      wx.request({
        url: app.globalData.baseUrl + '/address/list.html?token=' + wx.getStorageSync('token'),
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },

        success: function(res) {
          that.setData({
            addressList: res.data.data[0],
            addressLists: res.data.data,
          })
          if (that.data.addressLists.length > 0) {
            that.setData({
              addressShow: false,
              addressId: res.data.data[0].address_id
            })
          } else {
            that.setData({
              addressShow: true

            })
          }
        },
        complete: function() {
          wx.hideLoading()
        }
      })
    } else {
      wx.request({
        url: app.globalData.baseUrl + '/address/view.html?token=' + wx.getStorageSync('token'),
        header: {
          'content-type': 'application/x-www-form-urlencoded'

        },
        method: "post",
        data: {
          address_id: e
        },
        success: function(res) {
          var s = [],
            a = [];
          s[0] = res.data.data;
          a.push(res.data.data.province, res.data.data.city, res.data.data.district);
          that.setData({
            addressList: res.data.data
          })
        },
        complete: function() {
          wx.hideLoading()
        }
      })
    }
  },
  onShow: function() {
    var that = this
    // // wx.showLoading({
    // //   title: '加载中',
    // // });
    that.loadUser();
    wx.request({
      url: app.globalData.baseUrl + '/my/postage-money.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "post",
      success: function (res) {
        that.setData({
          postage: res.data.data.content
        })
      }
    })
    var addrId = that.data.addrId
    var couponPrice = that.data.couponPrice
    if (that.data.goods_id == undefined) {
      that.data.goods_id = ""
    }
    if (that.data.buyNumber == undefined) {
      that.data.buyNumber = ""
    }
    if (that.data.coupon_id == undefined) {
      that.data.coupon_id = ""
    }
    wx.showLoading({
      title: '加载中..',
    })
    // if (wx.getStorageSync('cart_id') == undefined) {
    //   wx.getStorageSync('cart_id') = null
    // }
    that.loadItem(addrId)
    wx.request({
      url: app.globalData.baseUrl + '/order/sumbit-order.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cart_id: wx.getStorageSync('cart_id'),
        optional_id: that.data.optional_id,
        goods_id: that.data.goods_id,
        goods_num: that.data.buyNumber
      },
      method: "post",
      success: function(res) {
      
        that.data.totalMoney = 0;
        for (var i = 0; i < res.data.data.goods.length; i++) {
          if (res.data.data.goods[i].opt_text==undefined){
            that.data.totalMoney = that.data.totalMoney + (parseFloat(res.data.data.goods[i].ordinary_user_price) * res.data.data.goods[i].goods_number);
         
          }else{
            that.data.totalMoney = that.data.totalMoney + (parseFloat(res.data.data.goods[i].opt_price) * res.data.data.goods[i].goods_number);
          
          }
        }
        that.setData({
          order: res.data.data,
          couponNum: res.data.data.coupon.length,
          totalMoney: that.data.totalMoney
        })
        console.log(wx.getStorageSync('couponId'))
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },
  createOrder: function(e) {

    this.setData({
      comment: e.detail.value.remark
    })
  },
  pay: function() {
    var that = this
    console.log(that.data.addressLists.length)
    var couponId = that.data.couponId
    if (that.data.goods_id == undefined) {
      that.data.goods_id = ""
    }
    if (that.data.buyNumber == undefined) {
      that.data.buyNumber = ""
    }
    if (couponId == undefined) {
      couponId = ""
    }
    if (that.data.buyNumber == undefined) {
      that.data.buyNumber = ""
    }
    if (that.data.addressLists.length == 0 || that.data.addressLists.length == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先设置您的收货地址！',
        showCancel: false
      })
      return
    }
   else {
      wx.request({
        url: app.globalData.baseUrl + '/order/place-order.html?token=' + wx.getStorageSync('token'),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          cart_id: wx.getStorageSync('cart_id'),
          goods_id: that.data.goods_id,
          goods_num: that.data.buyNumber,
          optional_id: that.data.optional_id,
          comment: that.data.comment,
          address_id: that.data.order.address.address_id,
          pay_type: 2
        },
        method: "post",
        success: function (res) {
          let order_id = res.data.data.scalar
          if (res.data.status==10000){
              wx.showModal({
                title: '提示',
                content: '确认余额支付？',
                success: function (res) {
                  if (res.confirm) {
                    wx.showModal({
                      title: '提示',
                      content: '支付成功！',
                      showCancel:false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.request({
                            url: app.globalData.baseUrl + '/order/synchronous-callback.html?token=' + wx.getStorageSync('token'),
                            header: {
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            method: 'POST',
                            data: {
                              order_id: order_id
                            },
                            success: function (res) {
                              wx.redirectTo({
                                url: '/pages/user/orderList/orderList?currentTab=2',
                              })
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
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.message,
              confirmText:"立即充值",
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '/pages/user/make-money/account/top-up/top-up',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      })
    }
  },
  toAddressAdd: function() {
    wx.navigateTo({
      url: "/pages/user/addressAdd/addressAdd"
    })
  },
  toAddressList: function() {
    wx.navigateTo({
      url: '/pages/user/addressList/addressList?id=0',
    })
  },
  onLoad: function(e) {
    console.log(e)
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      goods_id: e.id,
      optional_id: e.optional_id,
      buyNumber: e.buyNumber
    })
  }
})