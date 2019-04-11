const app = getApp();
Page({
  data: {
    all: "",
    cateItems: [],
    curNav: "",
    curIndex: 0,
    text:"",
    height:"",
    level: "",
    classify_id:"",
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
  listenerSearchInput: function (e) {
    wx.navigateTo({
      url: '/pages/shop/list/list?text=' + e.detail.value
    })
  },
  toGoods:function(e){
    console.log(e)
    let id=e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/classifys/classifyList?id=' + id + '&name='+ name
    })
  },
  loadData: function () {
    var that =this
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/goods-classify/list.html?token=' + wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        classify_id: that.data.classify_id
      },
      method: "post",
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          cateItems: res.data.data
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
    this.loadData(id)
  },
  onLoad: function (options) {
    
    var that = this
    wx.setNavigationBarTitle({
      title: options.name
    })
    that.setData({
      classify_id: options.id
    })
  },
  onShow: function () {
    this.loadData()
    this.loadUser()
  },
  onHide:function(){
    this.setData({
        text:""
    })
  }
})
