// pages/addressList/addressList.js
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindtapName: "bindtapName",
    chooseShow: 'false',
    addrList:[]
  },

  toaddressAdd: function(e) {
    wx.navigateTo({
      url: "/pages/user/addressAdd/addressAdd",
    })
  },

  toaddressModify: function(e) {
    wx.navigateTo({
      url: '/pages/user/addressModify/addressModify?id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id == "0") {
      this.setData({
        bindtapName: "chooseAddr"
      })
    }
  },
  chooseAddr: function (e) {
    var that = this;
    // console.log(e)
    // console.log(that)
    var addressId = e.currentTarget.dataset.id;
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      addrId: addressId,
    });
    wx.navigateBack({})
  },

  bindtapName:function(e) {
    var that=this;
    var addressId = e.currentTarget.dataset.id;
    console.log(addressId)
    wx.request({
      url: app.globalData.baseUrl + '/address/default.html?token=' + wx.getStorageSync('token'),
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        address_id: addressId
    
      },
      success:function(res) {
        console.log(res)
        if (res.data.code == 1000) {
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
        that.onShow()
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
    console.log(wx.getStorageSync('token'))
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/address/list.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },

      success: function (res) {
        console.log(res)
        if (res.data.code == 1000) {
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        } else {
          console.log(res.data.data)
          that.setData({
            addrList: res.data.data
  
          })
        }
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

  }
})