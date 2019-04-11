// pages/user/make-money/account/account.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    income:"",
    account_balance:""
 
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
        if (res.data.data.account_balance==null){
          res.data.data.account_balance =0
        }
        if (res.data.data.income == null) {
          res.data.data.income = 0
        }
        that.setData({
          income: res.data.data.income,
          account_balance: res.data.data.account_balance,
          membership_level: res.data.data.membership_level
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  makeMoney:function(){
    if (this.data.membership_level==1){
      wx.navigateTo({
        url: '/pages/user/make-money/make-money',
      })
    }else{
      if (this.data.membership_level == 0) {
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
      } if (this.data.membership_level == 3){
        wx.showModal({
          title: '提示',
          content: '您还不是VIP会员，暂不能提现!',
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
  topUp:function(){
    if (this.data.membership_level != 0) {
      wx.navigateTo({
        url: '/pages/user/make-money/account/top-up/top-up',
      })
    } else{
      if (this.data.membership_level == 0) {
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
      } if (this.data.membership_level == 3) {
        wx.showModal({
          title: '提示',
          content: '您还不是VIP会员，暂不能充值!',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that =this
    that.loadUser()
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

  }
})