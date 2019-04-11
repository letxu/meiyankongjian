// pages/user/make-money/addCart/addCart.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  addCatr: function (e) {
    var that = this
    var myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (e.detail.value.cartName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入卡号',
        showCancel: false
      })
      return
    }
    if (e.detail.value.bank == "") {
      wx.showModal({
        title: '提示',
        content: '请输入开户行',
        showCancel: false
      })
      return
    }
    if (e.detail.value.zbank == "") {
      wx.showModal({
        title: '提示',
        content: '请输入开户支行',
        showCancel: false
      })
      return
    }
    if (e.detail.value.name == "") {
      wx.showModal({
        title: '提示',
        content: '请输入持卡人姓名',
        showCancel: false
      })
      return
    }

    if (e.detail.value.mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请输入开户手机号码',
        showCancel: false
      })

      return
    } else if (!myreg.test(e.detail.value.mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号码有误!',
        showCancel: false
      })
      return
    }else{
      wx.request({
        url: app.globalData.baseUrl + '/my/create-bankcard.html?token=' + wx.getStorageSync('token'),
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          open_bank: e.detail.value.bank,
          opening_branch: e.detail.value.zbank,
          bankcard_id: e.detail.value.cartName,
          cardholder: e.detail.value.name,
          mobile:e.detail.value.mobile 
        },
        success: function (res) {
          console.log(res)
          if (res.data.status == 10000) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
            })
          }
          // wx.navigateBack({})
        }
      })
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