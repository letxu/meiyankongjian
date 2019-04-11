// pages/user/dealers/last/last.js
const app = getApp();
var util = require('../../../../utils/util1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
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
      data: {},
      method: "post",
      success: function(res) {
        console.log(res.data.data.district_dealer)
        wx.request({
          url: app.globalData.baseUrl + '/my/online-info.html?token=' + wx.getStorageSync('token'),
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            district_dealer: res.data.data.district_dealer
          },
          method: "post",
          success: function(resp) {
            console.log(resp.data.data.mobile)
            var datas = resp.data.data;
            if (resp.data.data.mobile==null){
              resp.data.data.mobile="暂未绑定"
            }
            that.setData({
              list: datas
            })
          }
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadUser()
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})