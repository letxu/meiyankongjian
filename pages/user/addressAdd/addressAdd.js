// pages/addressAdd/addressAdd.js
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionTS: "地区信息",
    region: []
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      regionTS: ''
    })
  },

  toAddAddress: function(e) {
    console.log(e)
    var myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    var that=this;
    var name=e.detail.value.linkname;
    var phone=e.detail.value.tel;
    var address = e.detail.value.address;
    var province=that.data.region[0];
    var city=that.data.region[1];
    var district=that.data.region[2];
    var zipcode = e.detail.value.zipcode
    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    } else if (phone.length< 11) {
      wx.showModal({
        title: '提示',
        content: '手机号码长度有误!',
        showCancel: false
      })
      return
    } else if(!myreg.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号码有误!',
        showCancel: false
      })
      return
    }
    if (that.data.region.length==0) {
      wx.showModal({
        title: '提示',
        content: '请选择地区!',
        showCancel: false
      })
      return
    }
    if (address=="") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址!',
        showCancel: false
      })
      return
    } 
    wx.request({
      url: app.globalData.baseUrl +  '/address/add.html?token='+wx.getStorageSync('token'),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      }, 
      data:{
        consignee: name,
        mobile: phone,
        address: address,
        province: province,
        city: city,
        district: district,
        zipcode: zipcode
      },
      success:function(res) {
      console.log(res)
        wx.navigateBack({})
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