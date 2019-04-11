var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    numberperpage: 6,
    pagenumber: 1,
    product: [],
    type: 0,
    text: "",
    id: 0,
    level: "",
    url: app.globalData.baseUrl
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
      data: {

      },
      method: "post",
      success: function(res) {
        that.setData({
          level: res.data.data.membership_level
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },

  listenerSearchInput: function(e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      text: e.detail.value
    })
    that.loadDada()
  },
  loadDada: function() {
    var that = this
    var numberperpage = that.data.numberperpage
    var pagenumber = that.data.pagenumber

    if (that.data.id == undefined) {
      that.setData({
        id: ""
      })

    }
    if (that.data.text == undefined) {
      that.setData({
        text: ""
      })

    }
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/goods/list.html?token=' + app.globalData.token,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        classify_id: that.data.id,
        title: that.data.text,
        numberperpage: numberperpage,
        pagenumber: pagenumber,
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        that.setData({
          product: res.data.data
        })

      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  pageData: function() {
    var that = this
    var numberperpage = that.data.numberperpage
    var pagenumber = that.data.pagenumber
    if (that.data.id == undefined) {
      that.setData({
        id: ""
      })

    }
    if (that.data.text == undefined) {
      that.setData({
        text: ""
      })

    }
    wx.request({
      url: app.globalData.baseUrl + '/goods/list.html?token=' + app.globalData.token,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        classify_id: that.data.id,
        title: that.data.text,
        numberperpage: numberperpage,
        pagenumber: pagenumber,
        type: that.data.type
      },
      method: 'post',
      success: function(res) {
        if (res.data.data.length > 0) {
          that.setData({
            product: that.data.product.concat(res.data.data)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: options.name,
    })
    that.setData({
      id: options.id,
      type: options.type,
      text: options.text
    })

  },
  // 加入购物车
  toCart: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this

    wx.request({
      url: app.globalData.baseUrl + '/cart/add-cart.html?token=' + app.globalData.token,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        goods_id: id
      },
      method: "post",
      success: function(res) {
        // that.toClosePopup();
        wx.showToast({
          title: '加入购物车成功!',
        })
      }
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
    this.loadDada()
    this.loadUser()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      pagenumber:1
    })
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
  onReachBottom: function(e) {
    var that = this;
    var pagenumber = that.data.pagenumber

    that.setData({
      pagenumber: ++pagenumber
    });
    setTimeout(function() {
      wx.showToast({
          icon: "loading",
          title: '加载中..',
        }),
        that.pageData()

    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})