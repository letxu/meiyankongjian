// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    oneNum: 0,
    twoNum: 0,
    threeNum: 0,
    isOpen: "",
    fourNum: 0,
    hasUserInfo: false,
    mobile:"",
    level: "" ,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },
  share: function () {
    let that = this
    if (that.data.level == 1) {
      wx.navigateTo({
        url: '/pages/user/invitation/invitation',
      })
    } else {
      if (this.data.level == 0) {
        wx.showModal({
          title: '提示',
          content: '您还未完善个人信息!',
          confirmText: "完善信息",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/user/apply-dealers/apply-dealers',
              })
            } else {
              console.log('取消')
            }
          }
        })
        return
      } if (this.data.level == 3) {
        wx.showModal({
          title: '提示',
          content: '您还不是正式会员，暂不能邀请好友!',
          confirmText: "成为会员",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/user/make-money/account/top-up/top-up',
              })
            } else {
              console.log('取消')
            }
          }
        })
      }

    }
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
      method: "post",
      success: function (res) {
      that.setData({
        level: res.data.data.membership_level,
        mobile: res.data.data.mobile
      })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  invitation:function(){
    var that = this
    that.loadUser()
    // console.log(that.data.level)
    // console.log(that.data.mobile)
    if (that.data.level == 1) {
      wx.navigateTo({
        url: '/pages/user/invitation/invitation',
      })
    } else {
      if (this.data.level == 0) {
        wx.showModal({
          title: '提示',
          content: '您还未完善个人信息!',
          confirmText: "完善信息",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/user/apply-dealers/apply-dealers',
              })
            } else {
              console.log('取消')
            }
          }
        })
        return
      } if (this.data.level == 3) {
        wx.showModal({
          title: '提示',
          content: '您还不是VIP会员，暂不能邀请好友!',
          confirmText: "成为会员",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/user/make-money/account/top-up/top-up',
              })
            } else {
              console.log('取消')
            }
          }
        })
      }
    }
    // wx.navigateTo({
    //   url: '/pages/user/invitation/invitation',
    // })
  },
  addRess: function () {
    var that = this
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log(JSON.stringify(res))
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },
  loadNum: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/order/order-num.html?token=' +wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "post",
      success: function (res) {
        that.setData({
          fourNum: res.data.data.order_status_four,
          threeNum: res.data.data.order_status_three,
          twoNum: res.data.data.order_status_two,
          oneNum: res.data.data.order_status_one
        })
      }
    })
  },
  // 申请工程师
  apply: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/index/membership.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        // console.log(res)
        wx.showToast({
          icon: "none",
          title: res.data.message
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadUser();
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    // let token = wx.getStorageSync('token')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
    } else {
      that.setData({
        userInfo: userInfo
      })
      that.loadNum();
    }
    wx.request({
      url: app.globalData.baseUrl + '/login/pay-is-open.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        that.setData({
          isOpen: res.data.data.content
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  to:function(){
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'page/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '美颜空间',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})