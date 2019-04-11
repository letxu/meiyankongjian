//app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var that = this;
    // that.globalData.token = wx.getStorageSync('token')
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.globalData.token = res.data;
      },
    });
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        that.globalData.openId = res.data;
      },
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  logins:function(){
    console.log(2442)
    wx.request({
      url: this.globalData.baseUrl + '/login/login.html',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { wx_openid: 1 },
      success: function (res) {
        // console.log(res)
        if (res.data.status == 1000) {
          return;
        }
        if (res.data.status != 10000) {
          // console.log(2)
          // 登录错误
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '无法登录，请重试',
            showCancel: false
          })
          return;
        }

        // console.log(wx.getStorageSync('openId'))
        // 回到原来的地方
      }
    })
  },
  globalData: {
    userInfo: null,
    token: null,
    openId:null,
    baseUrl:"https://meiyankongjian.com",
    // baseUrl: "http://192.168.0.116"
  }
})