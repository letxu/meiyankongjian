// pages/user/make-money/make-money.js
let WxParse = require('../../../../../wxParse/wxParse.js');
var app = getApp()
// var util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    numberperpage: 6,
    pagenumber: 1,
    income: 0,
    bankcard_id: "",
    open_bank: "",
    money: "",
    disabled: true,
    log: [],
    tid: "",
    mobile: "",
    membership_level: "",
    hidden: false
  },

  instr: function() {
    wx.navigateTo({
      url: "/pages/user/make-money/account/top-up/topUp-instructions/topUp-instructions",
    })
  },
  money: function(e) {
    console.log(e)
    this.setData({
      money: e.detail.value
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
        console.log(res)
        if (res.data.data.account_balance == null) {
          res.data.data.account_balance = 0
        }
        that.setData({
          mobile: res.data.data.mobile,
          income: res.data.data.income,
          membership_level: res.data.data.membership_level
        })
        if (res.data.data.membership_level==3){
          wx.request({
            url: app.globalData.baseUrl + '/my/get-recharge-num.html?token=' + wx.getStorageSync('token'),
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
              that.setData({
                money: res.data.data.content
              })
            }
          })
        }
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  // 充值
  makeMoney: function() {
    var that = this
    console.log(that.data.mobile)
    if (that.data.money == "") {
      wx.showModal({
        title: '提示',
        content: '请选择您充值金额!',
        showCancel: false
      })
      return
    }
    if (that.data.mobile == "" || that.data.mobile == null) {
      wx.showModal({
        title: '提示',
        content: '请先绑定您的手机号',
        confirmText: "前往绑定",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/user/make-money/account/binding-mobile/binding-mobile',
            })
          } else {
            console.log('取消')
          }
        }
      })
      return
    } else {

      wx.request({
        url: app.globalData.baseUrl + '/order/recharge.html?token=' + wx.getStorageSync('token'),
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          money: that.data.money
        },
        success: function(res) {
          var order_id = res.data.data
          console.log(res.data.status)
          if (res.data.status == 10000) {
            wx.request({
              url: app.globalData.baseUrl + '/order/wxpay-string.html?token=' + wx.getStorageSync('token'),
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              data: {
                open_id: wx.getStorageSync('openId'),
                order_id: order_id
              },
              success: function(res) {
                console.log(res.data.data.paySign)
                wx.requestPayment({
                  timeStamp: String(res.data.data.timeStamp),
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: res.data.data.signType,
                  paySign: res.data.data.paySign,
                  success: function(res) {
                    console.log(res)
                    wx.request({
                      url: app.globalData.baseUrl + '/order/synchronous-callback.html?token=' + wx.getStorageSync('token'),
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      data: {
                        order_id: order_id
                      },
                      success: function(res) {
                        that.loadUser();
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    })
                  },
                  fail: function(res) {
                    wx.showToast({
                      duration: 1000,
                      title: '支付失败！',
                      icon: 'none'
                    });
                  }
                });
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
          }

        },
        complete: function() {
          wx.hideLoading();
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  toLog: function() {
    wx.navigateTo({
      url: "/pages/user/make-money/log/log"
    })
  },
  loadData: function() {

   

    var that = this
    if (that.data.cid != "") {
      that.setData({
        hidden: true
      })
    } else {
      that.setData({
        hidden: false
      })
    }
  },

  onShow: function() {
    this.loadUser();
    this.loadData();
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/get-instructions-config.html?token=' + wx.getStorageSync('token'),
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        WxParse.wxParse('article', 'html', res.data.data[2].content, that, 5);
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {
    var that = this;
    var pagenumber = that.data.pagenumber + 1

    that.setData({
      pagenumber: pagenumber++
    });
    setTimeout(function() {
      wx.showToast({
          icon: "loading",
          title: '加载中..',
        }),
        that.loadMoreData()

    }, 1000)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})