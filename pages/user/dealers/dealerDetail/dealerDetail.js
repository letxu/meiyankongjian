// pages/user/dealers/dealerDetail/dealerDetail.js
const app = getApp()
var util = require('../../../../utils/util1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    wx.request({
      url: app.globalData.baseUrl + '/my/my-dealer-list.html?token=' + wx.getStorageSync('token'),
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {},
      success: function (res) {
        var datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          datas[i]["create_time"] = util.tsFormatTime(datas[i]["create_time"])
        }
        that.setData({
          list: datas
        })
      }
    })
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