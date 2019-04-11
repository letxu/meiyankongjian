// pages/index/productList/productList.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    page: 1,
    url: app.globalData.baseUrl,
    list: [],
    classify_id: 0,
    products: [ ]
  },
  loadData: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/goods/list.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        classify_id: that.data.classify_id
      },
      method: "post",
      success: function (res) {
        that.setData({
          list: res.data.data
        })
        console.log(res.data.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      classify_id: options.id
    })

    wx.setNavigationBarTitle({
      title: options.name
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
    this.loadData()
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
    var that = this
    console.log(that.data.page)
    that.setData({
      page: that.data.page + 1
    })
    console.log("上拉拉加载更多...." + that.data.page)
    // that.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})