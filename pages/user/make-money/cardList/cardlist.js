// pages/user/make-money/cardList/cardlist.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: null,
    curNav: "",
    card: [],

  },
  deleteItem: function(e) {
    var that = this;
    // var images = that.data.images;
   
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该银行卡吗？',
      success: function(res) {
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
            success: function(res) {
              console.log(index, that.data.curIndex)
              if (index == that.data.curIndex){
                let pages = getCurrentPages(); //当前页面
                let prevPage = pages[pages.length - 2]; //上一页面
                prevPage.setData({ //直接给上移页面赋值
                  cid: "",
                  bankcard_id: "",
                  open_bank: ""
                });
              }
              that.setData({
                curIndex: -1
              })
              that.loadData()
         
            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },
  couponCheck: function(e) {
    console.log(e)
    var that = this
    // 获取item项的id，和数组的下标值  
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
    var cid = this.data.card[this.data.curIndex].id;
    var open_bank = this.data.card[this.data.curIndex].open_bank;
    var bankcard_id = this.data.card[this.data.curIndex].bankcard_id;
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({ //直接给上移页面赋值
      cid: cid,
      bankcard_id: bankcard_id,
      open_bank: open_bank
    });
    wx.navigateBack({})
  },
  loadData: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/my-bankcard-list.html?token=' + wx.getStorageSync('token'),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {},
      success: function(res) {
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].id == that.data.curNav) {
            that.setData({
              curIndex: i
            })
          }
        }
        that.setData({
          card: res.data.data
        })

      }
    })
  },
  toaddressAdd: function() {
    wx.navigateTo({
      url: '/pages/user/make-money/addCard/addCard',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    //显示收货地址标识
    that.setData({
      open_bank: options.open_bank,
      curNav: options.cid,
      bankcard_id: options.bankcard_id
      // orderType: e.orderType
    })
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
    this.loadData()
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