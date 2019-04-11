// pages/index1/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rightList: [],
    indicatorDots1: false,
    autoplay1: true,
    interval1: 5000,
    duration1: 800,
    curNavId: 1,
    sortid: null,
    page: 1,
    url: app.globalData.baseUrl,
    goods: [],
    autoplay: true,
    indicatorDots: true,
    circular: true,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    level: "",
    Mall_name: "",
    Mall_header_img: "",
    Mall_header_background_image: "",
    banner: []
  },
  //事件处理函数
  swiperchange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  tolist: function() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  // 获取身份信息
  loadUser: function() {
    var that = this
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
      }
    })
  },
  tovipLog: function() {
    wx.navigateTo({
      url: '/pages/index/vipLog/vipLog',
    })
  },
  toDetail: function() {
    wx.navigateTo({
      url: '/pages/index/aDetail/aDetail',
    })
  },
  tapBanner: function(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    if (id == "" || id == undefined || id == null) {
      return
    } else {
      wx.navigateTo({
        url: '/pages/productDetail/productDetail?id=' + id,
      })
    }
  },
  // 加载数据
  loadData: function() {
    var that = this
    wx.showLoading({
      title: '加载中'
    });
    wx.request({
      url: app.globalData.baseUrl + '/index/index.html?token=' + wx.getStorageSync('token'),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var str = res.data.data.Reserved_Page.parameter
        var strArr = [];
        var n = 22;
        for (var i = 0, l = str.length; i < l / n; i++) {
          var a = str.slice(n * i, n * (i + 1));
          strArr.push(a);
        }
        that.setData({
          rightList: strArr,
          Mall_header_img: res.data.data.Mall_header_img.img,
          Mall_header_background_image: res.data.data.Mall_header_background_image.img,
          Mall_name: res.data.data.Mall_name.content,
          goods: res.data.data.classify,
          banner: res.data.data.banner
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  switchTab: function(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = parseInt(e.currentTarget.dataset.index);
    if (that.data.curIndex != index) {
      var state = "首页";
      if (index == 0) {
        state = "首页";
      }
      if (index == 1) {
        state = "全部商品";
      }
      if (index == 2) {
        state = "限时抢购";
      }
    }
    this.setData({
      curNavId: id,
      curIndex: index,
    })

  },
  listenerSearchInput: function(e) {
    var that = this
    that.setData({
      text: e.detail.value
    })
    that.loadData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let userInfo = wx.getStorageSync('userInfo')
    console.log(wx.getStorageSync('shop_user_id'))
    wx.setStorageSync('shop_user_id', options.shop_user_id);
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
    } else {
      console.log(0)
      that.setData({
        userInfo: userInfo
      })
    }


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
    this.loadData();
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if (userInfo && wx.getStorageSync('shop_user_id')) {
      wx.request({
        url: app.globalData.baseUrl + '/my/binding-online.html?token=' + wx.getStorageSync('token'),
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          shop_user_id: wx.getStorageSync('shop_user_id')
        },
        method: "post",
        success: function(res) {

        }
      })
    } else {}
    that.loadUser();
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

    var that = this
    that.setData({
      page: that.data.page + 1
    })

    // that.loadData()

  },
  share: function() {
    let that =this
    if (that.data.level==1){
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '美颜空间',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})