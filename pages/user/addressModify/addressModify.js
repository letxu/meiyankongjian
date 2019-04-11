// pages/addressModify/addressModify.js
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionTS: "地区信息",
    region:[],
    adressId:0,
    addrInfo:[]
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      regionTS: ''
    })
  },

  todelete:function(e) {
    var that=this;
    var id = that.data.addrInfo[0].id
    wx.showModal({
      title: '',
      content: '确定要删除该地址吗？',
      confirmText: '删除',
      confirmColor: '#cd9b01',
      success:function(res) {
        if (res.cancel) {
          
        } else {
          wx.request({
            url: app.globalData.baseUrl + '/address/delete.html?token=' + wx.getStorageSync('token'),
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            data:{
              address_id: that.data.adressId
            },
            method:"post",
            success: function(res) {
              console.log(res)
              if (res.data.status==10000) {
                wx,wx.showModal({
                  title: '',
                  content: '删除成功',
                  showCancel: false,
                  success: function(res) {
                    wx.navigateBack({})
                  },
                  fail: function(res) {},
                  complete: function(res) {},
                })
              } else {
                wx.showModal({
                  title: '',
                  content: '删除失败',
                  showCancel: true
                })
              }
            }
          })
        }
      }
    })
  },

  bindModifySave:function(e) {
    var that=this;
    var myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    var that = this;
    var isDefault=0;
    var name = e.detail.value.linkname;
    var phone = e.detail.value.tel;
    var address = e.detail.value.address;
    var province = that.data.region[0];
    var city = that.data.region[1];
    var district = that.data.region[2];
    var defaulted=e.detail.value.default;
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
    } else if (phone.length < 11) {
      wx.showModal({
        title: '提示',
        content: '手机号码长度有误!',
        showCancel: false
      })
      return
    } else if (!myreg.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号码有误!',
        showCancel: false
      })
      return
    }
    if (that.data.region.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择地区!',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址!',
        showCancel: false
      })
      return
    }
    if(defaulted) {
      isDefault=1;
    } 
    var id = that.data.addrInfo[0].id;
    console.log(id)
    wx.request({
      url: app.globalData.baseUrl + '/address/add.html?token=' + wx.getStorageSync('token'),
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
   
      },
      data:{
        consignee: name,
        mobile: phone,
        address: address,
        province: province,
        city: city,
        district: district,
        zipcode: zipcode,
        address_id: that.data.adressId,
        is_default: isDefault
      },
      success:function(res) {
        console.log(res)
        if (res.data.status==10000) {
          wx.showModal({
            title: '',
            content: '修改成功',
            showCancel: false,
            success:function(res) {
              wx.navigateBack({})
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    that.setData({
      adressId:e.id
    })
    wx.request({
      url: app.globalData.baseUrl + '/address/view.html?token='+ wx.getStorageSync('token'),
      header: {
        'content-type': 'application/x-www-form-urlencoded'

      },
      method:"post",
      data: {
        address_id: e.id
      },
      success: function (res) {
        console.log(res)
        var s=[],a=[];
        s[0]=res.data.data;
        console.log(s[0])
        a.push(res.data.data.province,res.data.data.city,res.data.data.district);
        that.setData({
          addrInfo: s,
          region: a,
          regionTS: "",
        })
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