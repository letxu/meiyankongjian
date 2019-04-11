// pages/user/dealers/dealerDetail/dealerDetail.js
const app = getApp()
var util = require('../../../../utils/util1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numberperpage: 6,
    pagenumber: 1,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/income-log.html?token=' + wx.getStorageSync('token'),
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        pagenumber: 1,
        numberperpage: 6
      },
      success: function (res) {
        console.log(res.data.data)
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
  loadMoreData:function(){
    var that = this
    var numberperpage = that.data.numberperpage
    var pagenumber = that.data.pagenumber
    wx.request({
      url: app.globalData.baseUrl + '/my/income-log.html?token=' + wx.getStorageSync('token'),
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        numberperpage: numberperpage,
        pagenumber: pagenumber
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.data)
        var datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          datas[i]["create_time"] = util.tsFormatTime(datas[i]["create_time"])
        }

        if (res.data.data.length > 0) {
          that.setData({
            list: that.data.list.concat(datas)
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
  onReachBottom: function (e) {
    var that = this;
    var pagenumber = that.data.pagenumber+1

    that.setData({
      pagenumber: pagenumber++
    });
    setTimeout(function () {
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
  onShareAppMessage: function () {

  }
})