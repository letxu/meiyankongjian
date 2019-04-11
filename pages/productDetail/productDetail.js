var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyNumber: 1,
    indicatorDots: true,
    autoplay: false,
    show: true,
    shows: false,
    interval: 5000,
    duration: 1000,
    showModal: false,
    showModal1: false,
    backTopValue: false,
    modal1: true,
    modal2: true,
    modal3: true,
    active: false,
    goods: "",
    hideShopPopup: true,
    goodsName: "",
    goodsId: "",
    buyNumber: 1,
    level: "",
    skuId: "",
    skuId1: "",
    shopCarInfo: {},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
    url: app.globalData.baseUrl,
    name: "",
    ifShow: 0,
    ifShow1: 0,
    opt_price: 0,
    opt_price2: 0,
    stock: "",
    attrValueList: []
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
  labelItemTap: function (e) {
    var that = this
    if (that.data.goods.goods_optional.length==1){
      if (that.data.goods.goods_optional[0].id.length > 1) {
        console.log(1)
        that.setData({
          skuId: that.data.goods.goods_optional[0].id[e.currentTarget.dataset.index],
          ifShow: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index].opt_price,
          opt_price2: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index].opt_price2,
          stock: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index].stock
        })
      } else {
        that.setData({
          skuId: that.data.goods.goods_optional[0].id,
          ifShow: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[0].opt_price,
          opt_price2: that.data.goods.goods_optional[0].opt_price[0].opt_price2
        })
      }
    } if (that.data.goods.goods_optional.length == 2){
      if (that.data.goods.goods_optional[0].id.length > 1) {
        console.log(3)
        that.setData({
          skuId: that.data.goods.goods_optional[0].id[e.currentTarget.dataset.index],
          ifShow: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].opt_price,
          opt_price2: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].opt_price2,
          stock: that.data.goods.goods_optional[0].opt_price[e.currentTarget.dataset.index][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].stock
        })
      } else {
        console.log(33)
        that.setData({
          skuId: that.data.goods.goods_optional[0].id,
          ifShow: e.currentTarget.dataset.index,
          opt_price: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].opt_price,
          opt_price2: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].opt_price2
        })
      }
    }

  },
  labelItemTap1: function (e) {
    var that = this
    if (that.data.goods.goods_optional[0].id.length > 1) {
      console.log(3)
      that.setData({
        skuId1: that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index],
        ifShow1: e.currentTarget.dataset.index,
        opt_price: that.data.goods.goods_optional[0].opt_price[that.data.ifShow][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].opt_price,
        opt_price2: that.data.goods.goods_optional[0].opt_price[that.data.ifShow][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].opt_price2,
        stock: that.data.goods.goods_optional[0].opt_price[that.data.ifShow][that.data.goods.goods_optional[1].id[e.currentTarget.dataset.index]].stock
      })
    } else {
      that.setData({
        skuId1: that.data.goods.goods_optional[1].id,
        ifShow1: e.currentTarget.dataset.index,
        opt_price: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].opt_price,
        opt_price2: that.data.goods.goods_optional[0].opt_price[0][that.data.goods.goods_optional[1].id].opt_price2
      })
    }
  },
  loadData: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/goods/goods-view.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        goods_id: that.data.goodsId
      },
      method: "post",
      success: function (res) {
        console.log(res.data.data.goods_optional[0].opt_price[0].stock)
        if (res.data.data.goods_optional.length == 1) {
          let id = String(res.data.data.goods_optional[0].id)
          if (id.indexOf(',') > -1) {
            res.data.data.goods_optional[0].opt_text = res.data.data.goods_optional[0].opt_text.split(",")
            res.data.data.goods_optional[0].id = res.data.data.goods_optional[0].id.split(",")
            that.setData({
              skuId: res.data.data.goods_optional[0].id[0],
              opt_price: res.data.data.goods_optional[0].opt_price[0].opt_price,
              opt_price2: res.data.data.goods_optional[0].opt_price[0].opt_price2,
              stock: res.data.data.goods_optional[0].opt_price[0].stock
            })
          } else {
            res.data.data.goods_optional[0].opt_text = Array(res.data.data.goods_optional[0].opt_text)
            that.setData({
              skuId: res.data.data.goods_optional[0].id,
              opt_price: res.data.data.goods_optional[0].opt_price[0].opt_price,
              opt_price2: res.data.data.goods_optional[0].opt_price[0].opt_price2,
              stock: res.data.data.goods_optional[0].opt_price[0].stock
            })
          }

        } if (res.data.data.goods_optional.length == 2){
          console.log(res.data.data.goods_optional[0].opt_price[0][114])
          let id = String(res.data.data.goods_optional[0].id)
          if (id.indexOf(',') > -1) {
            res.data.data.goods_optional[0].opt_text = res.data.data.goods_optional[0].opt_text.split(",")
            res.data.data.goods_optional[1].opt_text = res.data.data.goods_optional[1].opt_text.split(",")
            res.data.data.goods_optional[0].id = res.data.data.goods_optional[0].id.split(",")
            res.data.data.goods_optional[1].id = res.data.data.goods_optional[1].id.split(",")
            that.setData({
              skuId: res.data.data.goods_optional[0].id[0],
              skuId1: res.data.data.goods_optional[1].id[0],
              opt_price: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].opt_price,
              opt_price2: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].opt_price2,
              stock: res.data.data.goods_optional[0].opt_price[0][res.data.data.goods_optional[1].id[0]].stock
            })
          } else {
            res.data.data.goods_optional[0].opt_text = Array(res.data.data.goods_optional[0].opt_text)
            that.setData({
              skuId: res.data.data.goods_optional[0].id,
              skuId1: res.data.data.goods_optional[1].id,
              opt_price: res.data.data.goods_optional[0].opt_price[0].opt_price,
              opt_price2: res.data.data.goods_optional[0].opt_price[0].opt_price2

            })
          }
        }
        that.setData({
          goods: res.data.data,
          goodsName: res.data.data.goods_info.goods_name
        })
        wx.setNavigationBarTitle({
          title: res.data.data.goods_info.goods_name
        })
        WxParse.wxParse('article', 'html', res.data.data.goods_info.goods_content, that, 5);
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  // 增加数量
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  // 减少数量
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  bindGuiGeTap: function (e) {
    this.setData({
      hideShopPopup: false
    })
  },
  toAddShopCar: function () {
    console.log(this.data.goods.goods_optional)
    this.setData({
      shopType: "addShopCar",
      shows: true
    })
    this.bindGuiGeTap();
  },
  toClosePopup: function (e) {
    this.setData({
      hideShopPopup: true,
      shows: false
    })
  },

  // 加入购物车

  // 数量加减
  numLess: function (e) {

    var currentNum = this.data.buyNumber;
    currentNum--;
    if (currentNum < 1) {
      currentNum = 1
    }
    this.setData({
      buyNumber: currentNum
    })

  },

  numPlus: function (e) {

    var currentNum = this.data.buyNumber;
    currentNum++;
    this.setData({
      buyNumber: currentNum
    })

  },
  // 监听滚动条坐标
  onPageScroll: function (e) {
    var that = this;
    var scrollTop = e.scrollTop;
    var backTopValue = scrollTop > 200 ? true : false;
    that.setData({
      backTopValue: backTopValue
    })
  },

  // 滚动到顶部
  backTop: function () {
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  },



  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false,

    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
    this.setData({
      modal1: true,
      modal2: true,
      modal3: true,

    })
  },
  close1: function () {
    this.setData({
      showModal1: false,
      show: true
    })
  },
  // 加入购物车
  addCart: function () {
    
    var that = this
    let optional_id
    if (that.data.skuId1 ==""){
      optional_id = that.data.skuId
    }else{
      optional_id = that.data.skuId + "," + that.data.skuId1
    }

    wx.request({
      url: app.globalData.baseUrl + '/cart/add-cart.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        goods_id: that.data.goodsId,
        optional_id: optional_id,
        goods_num: that.data.buyNumber
      },
      method: "post",
      success: function (res) {
        // that.toClosePopup();
        that.setData({
          hideShopPopup:true,
          shows:false
        })
        wx.showToast({
          title: '加入购物车成功!',
        })
      }
    })
  },
  buy: function (e) {
    this.setData({
      shopType: "tobuy",
      shows: true
    })
    this.bindGuiGeTap();

  },
  buyNow: function () {
    var that = this
    let optional_id
    if (that.data.skuId1 == "") {
      optional_id = that.data.skuId
    } else {
      optional_id = that.data.skuId + "," + that.data.skuId1
    }
    that.bindGuiGeTap();
    var goodId = that.data.goodsId;
    console.log(that.data.skuId)
    wx.navigateTo({
      url: "/pages/to-pay-order/index?id=" + goodId + "&optional_id=" + optional_id + "&buyNumber=" + that.data.buyNumber + "&to=" + 1
    })

  },
  service: function () {
    var that = this;
    that.setData({
      showModal: true,
      modal2: false
    })
  },
  introduce: function () {
    var that = this;
    that.setData({
      showModal: true,
      modal3: false
    })
  },
  showMask: function () {
    var that = this;
    that.setData({
      showModal1: true,
      showModal: true,
      show: false

    })
  },
  showMaskClose: function () {
    this.setData({
      showModal1: false,
      showModal: false,
      show: true
    })
  },
  // 获取身份信息
  loadUser: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/my/get-shop-user-info.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "post",
      success: function (res) {
        that.setData({
          level: res.data.data.membership_level
        })
      }
    })
  },
  // 滚动监听

  // scroll: function(e) {
  //   console.log(e.detail.scrollTop)
  //   this.setData({
  //     iconShow: false
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsId: options.id
    })
    wx.setStorageSync('goodsId', options.id)
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
    this.loadUser();
    wx.removeStorageSync('cart_id')
    this.loadData();
    // console.log(this.data.ec)
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.goodsName,
      path: '/pages/productDetail/productDetail?id=' + this.data.goodsId + "&name=" + this.data.goodsName,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})