// pages/user/card/card.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards:[]
  },
  toaddressAdd: function () {
    wx.navigateTo({
      url: '/pages/user/make-money/addCard/addCard',
    })
  },
  deleteItem:function(e){
    var that = this;
    // var images = that.data.images;
    console.log(e)
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    var id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定要删除该银行卡吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/my/delete-bankcard.html?token=' + wx.getStorageSync('token'),
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              bankcard_id: id
            },
            success: function (res) {
              that.loadData()

            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        // that.setData({
        //   images
        // });
      }
    })
  },
  loadData: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/my-bankcard-list.html?token=' + wx.getStorageSync('token'),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {},
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          cards: res.data.data
        })

      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})