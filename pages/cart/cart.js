// pages/cart/cart.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    isShow: true,
    receive: true,
    notReceive: false,
    saveHidden: true,
    noSelect: false,
    iscart: true,
    hidden: null,
    totalMoney: 0,
    level:"",
    iSAllSelect: false,
    carts: [], //数据 
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
  // 编辑
  editTap: function() {
    this.setData({
      saveHidden: false
    });
  },
  saveTap: function() {
    this.setData({
      saveHidden: true
    });
  },
  // 获取身份信息
  loadUser: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/get-shop-user-info.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {},
      method: "post",
      success: function (res) {
        that.setData({
          level: res.data.data.membership_level
        })
      }
    })
  },
  // 没有选中任何元素的状态
  noSelect: function () {
    var list = this.data.carts;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.is_check) {
        noSelect++;
      }}
    if (noSelect == list.length) {
      this.setData({
        noSelect: true
      })
    } else {
      this.setData({
        noSelect: false
      })
    }
  },
  // 数量加减
  jianBtnTap: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = this.data.carts;
    if (index !== "" && index != null) {
      var carShopBean = list[parseInt(index)].id;
      if (list[parseInt(index)].goods_number > 1) {
        list[parseInt(index)].goods_number--;
      }
      wx.request({
        url: app.globalData.baseUrl + '/cart/change-num.html?token='+wx.getStorageSync('token'),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          cart_id: carShopBean,
          num: list[parseInt(index)].goods_number
        },
        method: "post",
        success: function(res) {
          that.priceCount();
        }
      })
    }
    that.setData({
      carts: that.data.carts
    })
  },

  jiaBtnTap: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = this.data.carts;
    var carShopBean = list[parseInt(index)].id;
    list[parseInt(index)].goods_number++;
    wx.request({
      url: app.globalData.baseUrl + '/cart/change-num.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        cart_id: carShopBean,
        num: list[parseInt(index)].goods_number
      },
      method: "post",
      success: function(res) {
        that.priceCount();
      }
    })
    that.setData({
      carts: that.data.carts
    })
  },
  // 单选
  checkboxChange: function(e) {
    // 获取item项的id，和数组的下标值  
    var Allprice = 0,
      i = 0;
    let id = e.target.dataset.id,

      index = parseInt(e.target.dataset.index);
    this.data.carts[index].is_check = !this.data.carts[index].is_check;
    //价钱统计
    if (this.data.carts[index].is_check) {
      if(this.data.carts[index].opt_text == null){
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].ordinary_user_price * this.data.carts[index].goods_number);
      }else{
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].opt_price * this.data.carts[index].goods_number);
      }
    } else {
      if (this.data.carts[index].opt_text == null) {
        this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].ordinary_user_price * this.data.carts[index].goods_number);
      } else {
        this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].opt_price * this.data.carts[index].goods_number);
      }
    }
    //是否全选判断
    for (i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].opt_text == null) {
        Allprice = Allprice + (this.data.carts[i].ordinary_user_price * this.data.carts[i].goods_number);
      } else {
        Allprice = Allprice + (this.data.carts[i].opt_price * this.data.carts[i].goods_number);
      }
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    } else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
    this.noSelect()
    this.priceCount();
  },
  // 全选
  chooseAll: function(e) {
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].is_check = true;
        if (this.data.carts[i].opt_text == null) {
          this.data.totalMoney = this.data.totalMoney + (parseFloat(this.data.carts[i].ordinary_user_price) * this.data.carts[i].goods_number);
        } else {
          this.data.totalMoney = this.data.totalMoney + (parseFloat(this.data.carts[i].opt_price) * this.data.carts[i].goods_number);
        }
    
      }
    } else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].is_check = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,

    })
    this.noSelect()
    this.priceCount();
  },
  // 计算价格
  priceCount: function(e) {
    this.data.totalMoney = 0;
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].is_check == true) {
        if (this.data.carts[i].opt_text == null) {
          this.data.totalMoney = this.data.totalMoney + (parseFloat(this.data.carts[i].ordinary_user_price) * this.data.carts[i].goods_number);
        } else {
          this.data.totalMoney = this.data.totalMoney + (parseFloat(this.data.carts[i].opt_price) * this.data.carts[i].goods_number);
        }
      }
    }
    this.data.totalMoney = parseFloat(this.data.totalMoney.toFixed(2))
    this.setData({
      totalMoney: this.data.totalMoney,
    })
  },
  // 删除商品
  delItem: function() {
    var that = this;
    if (that.data.noSelect) {
      wx.hideLoading();
      return;
    }
    let i = 0;
    var that = this
    var attr = [];
    that.data.totalMoney = 0;
    for (i = 0; i < that.data.carts.length; i++) {
      if (that.data.carts[i].is_check) {
        attr.push(that.data.carts[i].id)
      }
    }
    wx.request({
      url: app.globalData.baseUrl + '/cart/delete-cart.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        cart_id: attr.toString()
      },
      method: "post",
      success: function(res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          content: '确认删除购物车?',
          success: function(res) {

            if (res.confirm) {
              // that.onHide()
              for (var i = 0; i < that.data.carts.length; i++) {
                that.data.carts[i].is_check = false
              }
              that.setData({
                isAllSelect: false,
                noSelect: true

              })
              that.loadData(that.priceCount())
            } else {}
          },
          fail: function() {},
          complete: function() {
            wx.hideLoading();
          }
        })
      }
    })
    this.noSelect()
  },
  // 提交订单
  subOrder: function() {
    var that = this;
    if (that.data.noSelect) {
      wx.hideLoading();
      return;
    }
    var that = this
    let i = 0;
    var attr = [];
    that.data.totalMoney = 0;
    for (i = 0; i < that.data.carts.length; i++) {
      if (that.data.carts[i].is_check) {
        attr.push(that.data.carts[i].id)
      }
    }
    // console.log(attr.toString())
    wx.setStorageSync('cart_id', attr.toString())
    wx.navigateTo({
          url: "/pages/to-pay-order/index"
        })
    // wx.request({
    //   url: app.globalData.baseUrl + '/order/sumbit-order.html?token=' + wx.getStorageSync('token'),
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: {
    //     cart_id: attr.toString()
    //   },
    //   method: "post",
    //   success: function(res) {
    //     wx.navigateTo({
    //       url: "/pages/shop/to-pay-order/index"
    //     })
    //   }
    // })
  },
  loadData: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/cart/list.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "post",
      success: function(res) {
        if (res.data.data.length > 0) {
          that.setData({
            iscart: true,
            hidden: false,
            carts: res.data.data
          })
        } else {
          that.setData({
            iscart: false,
            hidden: true,
          });

        }
    
      },
      complete: function () {
        wx.hideLoading();
      }
    })
 
  },
  /**
   * 优惠券弹窗出现取消按钮点击事件
   */
  toRceive: function() {
    this.setData({
      showModal: true
    });
  },
  onCancel: function() {
    this.hideModal();
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
    let that = this;
    that.loadUser()
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
    } else {
      that.setData({
        userInfo: userInfo

      })
    }
    this.loadData();
    this.noSelect()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    for (var i = 0; i < this.data.carts.length; i++) {
      this.data.carts[i].is_check = false
    }
    this.setData({
      isAllSelect: false,
      totalMoney: 0,
      noSelect:false
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '美颜空间',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})