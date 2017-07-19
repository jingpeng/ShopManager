import React from 'react'
import BuyModal from './buy-modal'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  ViewPagerAndroid
} from 'react-native'
import { connect } from 'react-redux'
import RNFS from "react-native-fs"
import Video from 'react-native-video'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import DeviceInfo from 'react-native-device-info'
import FileOpener from 'react-native-file-opener'
import VersionNumber from 'react-native-version-number'

import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant'
import IOConstant from '../io/io-constant'
import OrderSuccessModal from './order-success-modal'

const rootDirectory = RNFS.ExternalStorageDirectoryPath + IOConstant.ROOT_DIRECTORY
const directory = RNFS.ExternalStorageDirectoryPath + IOConstant.ADV_DIRECTORY
var envData = {
  gameReturnTime: 10,
  playRate: 1,
  playTime: 10,
  refreshTime: "00:00",
  shutTime: 10,
  version: 1
}
var playIds = new Set()

function Timer(callback, delay) {
  var timerId, start, remaining = delay
  this.pause = function() {
      clearTimeout(timerId)
      remaining -= new Date() - start
  }
  this.resume = function() {
      start = new Date();
      clearTimeout(timerId)
      timerId = setTimeout(callback, remaining)
  }
  this.resume()
}

class AdScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      buyModalVisible: false,
      orderSuccessModalVisible: false,
      advs: [],
      players: [],
      currentPage: 0,
      loading: false,
      isOrder: false,
      adTitle: "",
      adDesc: "",
      adPrice: 0,
      popupAd: null,
      isSelf: true,
      selfAds: [],
      adminAdvs: [],
      key: 0
    }

    this.getAdList.bind(this)
    this.downloadAds.bind(this)
  }

  envGetDetailsByMac() {
    ApiClient
    .access(ApiInterface.envGetDetailsByMac(DeviceInfo.getUniqueID()))
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      console.log(json)
      envData = json.data

      if (VersionNumber.buildVersion < parseInt(envData.version, 10)) {
        this.downloadApk()
      }

      var callback = () => {
        if (this.state.isSelf) {
          RCTDeviceEventEmitter.emit('all_load', this.state.adminAdvs)
        } else {
          RCTDeviceEventEmitter.emit('all_load', this.state.selfAds)
        }

        this.setState({ isSelf: !this.state.isSelf, key: this.state.key + 1 })
        this.switchTimer = new Timer(callback, this.state.isSelf ? envData.playTime * 1000 : envData.playTime * envData.playRate * 1000)
      }
      this.switchTimer = new Timer(callback, envData.playTime * envData.playRate * 1000)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  componentDidMount() {
    var copy = this

    this.pingbackTimer = setInterval(() => {
      var date = new Date;
      date.setTime(Date.now())
      var minutes = date.getMinutes()
      var hour = date.getHours()
      var timeStr = ''
      var formattedHour = ("0" + hour).slice(-2)
      var formattedMinutes = ("0" + minutes).slice(-2)
      console.log(formattedHour + ":" + formattedMinutes)
      if (envData.refreshTime == (formattedHour + ":" + formattedMinutes)) {
        // 投递广告播放记录
        console.log(playIds)
        ApiClient.access(ApiInterface.recordAddPlay(DeviceInfo.getUniqueID(), playIds))
        .then(response => response.json())
        .then(json => {
          console.log(json)
          playIds.clear()
        })
        .catch(error => {console.log(error)})
      } else {
        console.log(envData.refreshTime)
      }
    }, 30000)

    RCTDeviceEventEmitter.addListener('pause_component', function(data){
      switch (data) {
        case "mount":
          copy.timer && copy.timer.pause()
          copy.switchTimer && copy.switchTimer.pause()
          for (var i = 0; i < copy.state.players.length; i++) {
            if (copy.state.players[i] != undefined) {
              copy.state.players[i].setNativeProps({ paused: true })
            }
          }
          break
        case "unmount":
          copy.timer && copy.timer.resume()
          copy.switchTimer && copy.switchTimer.resume()
          var player = copy.state.players[copy.state.currentPage]
          if (player != undefined) {
            player.setNativeProps({ paused: false })
          }
          break
      }
    })

    RCTDeviceEventEmitter.addListener('all_load', function(advs){
      console.log(advs)
      copy.setState({
        advs: advs,
        players: new Array(advs.length),
        loading: false
      }, () => {
        RCTDeviceEventEmitter.emit('on_next', 0)
      })
    })

    RCTDeviceEventEmitter.addListener('on_key_pressed', function(advs){
      copy.props.navigation.dispatch({ type: 'PlayFull', data: copy.state.popupAd })
    })

    RCTDeviceEventEmitter.addListener('on_next', function(page){
      if (page >= copy.state.advs.length) {
        page = 0

      }
      copy.viewPager.setPage(page)
      copy.setState({currentPage: page})

      if (copy.state.advs.length > 0) {
        playIds.add(copy.state.advs[page].id)
      }

      var adv = copy.state.advs[page]

      if (adv.advertisement.fileType == 0) {
        var callback = () => {
          RCTDeviceEventEmitter.emit('on_next', page + 1)
        }
        copy.timer = new Timer(callback, adv.advertisement.time * 1000)
      } else if (adv.advertisement.fileType == 1){
        var player = copy.state.players[page]
        for (var i = 0; i < copy.state.players.length; i++) {
          if (copy.state.players[i] != undefined) {
            copy.state.players[i].setNativeProps({ paused: true })
          }
        }
        if (player != undefined) {
          player.setNativeProps({ seek: 0, paused: false })
        }
      }

      var adv = copy.state.advs[page]
      if (adv.isOrder == 1) {
        copy.setState({isOrder: true})
      } else {
        copy.setState({isOrder: false})
      }
    })

    if (this.props.deviceData != undefined) {
      this.envGetDetailsByMac()
      this.setState({loading: true})
      this.getAdList()
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      .then((jsons) => {
        this.downloadAds(jsons)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }

  componentWillUnmount() {
    this.timer && this.timer.pause()
    this.switchTimer && this.switchTimer.pause()
    this.buyModalTimer && this.buyModalTimer.pause()
    this.orderSuccessModalTimer && this.orderSuccessModalTimer.pause()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.deviceData == undefined && this.props.deviceData != undefined) {
      this.envGetDetailsByMac()
      this.setState({loading: true})
      this.getAdList()
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      .then((jsons) => {
        this.downloadAds(jsons)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }

  getAdList() {
    var deviceData = this.props.deviceData
    var promiseAds = ApiClient.access(ApiInterface.playAdvGetList(deviceData.userId, ApiConstant.DEFAULT_NUMBER_PER_PAGE, 1))
    var promiseAdsFromAdmin = ApiClient.access(ApiInterface.playAdvGetListFromAdmin(deviceData.userId, ApiConstant.DEFAULT_NUMBER_PER_PAGE, 1))

    return Promise.all([promiseAds, promiseAdsFromAdmin])
  }

  downloadApk() {
    var path = rootDirectory + 'update.apk'
    RNFS.downloadFile({
      fromUrl: encodeURI('http://imtt.dd.qq.com/16891/244F219B57F47DDE123FC720607E99BD.apk'),
      toFile: path,
      background: false
    }).promise
    .then(response => {
      FileOpener.open(
        path,
        'application/vnd.android.package-archive'
      ).then((msg) => {

      },() => {

      })
    })
    .catch(error => {
      console.log(error)
    })
  }

  downloadAds(jsons) {
    var advs = jsons[0].data
    var advsAdmin = jsons[1].data

    var popupAd = null
    for (var i = 0; i < advs.length; i++) {
      if (advs[i].type == 0) {
        popupAd = advs[i]
        advs.splice(i, 1)
        break
      }
    }
    for (var i = 0; i < advsAdmin.length; i++) {
      if (advsAdmin[i].type == 0) {
        popupAd = advsAdmin[i]
        advsAdmin.splice(i, 1)
        break
      }
    }
    if (popupAd != null) {
      this.setState({ popupAd: popupAd })
    }
    this.setState({ selfAds: advs, adminAdvs: advsAdmin })

    storage.save({key: IOConstant.ADV_LIST, data: advs})
    storage.save({key: IOConstant.ADV_LIST_ADMIN, data: advsAdmin})

    // 检查目录是否存在
    RNFS.exists(directory).then((result) => {
      if (!result) { RNFS.mkdir(directory) }

      var downloadFutures = []
      var storeFutures = []
      var collection = advs.concat(advsAdmin)

      for (var i = 0; i < collection.length; i++) {
        var adv = collection[i].advertisement
        var path = directory + adv.id + '_' + adv.fileName

        storeFutures.push(RNFS.exists(path))
      }

      Promise.all(storeFutures)
      .then((results) => {
        for (var i = 0; i < collection.length; i++) {
          var adv = collection[i].advertisement
          var path = directory + adv.id + '_' + adv.fileName

          if (!results[i]) {
            downloadFutures.push(
              RNFS.downloadFile({
                fromUrl: encodeURI(adv.fileSrc),
                toFile: path,
                background: false
              }).promise
            )
          }
        }
        // 合并下载结果
        Promise.all(downloadFutures)
        .then(responses => {
          console.log(responses)
          RCTDeviceEventEmitter.emit('all_load', advs)
        })
        .catch((error) => {
          console.log(error)
        })
      })
    })
  }

  launchGame() {
    this.props.navigation.dispatch({ type: 'Game' })
  }

  launchPlaylist() {
    this.props.navigation.dispatch({ type: 'Playlist' })
  }

  showBuyModal() {
    this.setState({buyModalVisible: true})
    this.timer.pause()
    var player = this.state.players[this.state.currentPage]
    if (player != undefined) {
      player.setNativeProps({ paused: true })
    }
    var adv = this.state.advs[this.state.currentPage]
    this.setState({
      adTitle: adv.advertisement.name,
      adDesc: adv.advertisement.content,
      adPrice: adv.advertisement.price
    })

    this.buyModalTimer = new Timer(() => {
      this.hideBuyModal()
    }, 18 * 1000)
  }

  orderInModal(num) {
    var adv = this.state.advs[this.state.currentPage]
    ApiClient
    .access(ApiInterface.advOrderAdd(DeviceInfo.getUniqueID(), adv.id, num))
    .then(response => response.json())
    .then((json) => {
      this.setState({orderSuccessModalVisible: true})
      this.timer.pause()
      var player = this.state.players[this.state.currentPage]
      if (player != undefined) {
        player.setNativeProps({ paused: true })
      }
      this.orderSuccessModalTimer = new Timer(() => {
        this.hideOrderSuccessModal()
      }, 18 * 1000)
      console.log(json)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  hideBuyModal() {
    this.setState({buyModalVisible: false})
    this.timer.resume()
    var player = this.state.players[this.state.currentPage]
    if (player != undefined) {
      player.setNativeProps({ paused: false })
    }
    this.buyModalTimer.pause()
  }

  hideOrderSuccessModal() {
    this.setState({orderSuccessModalVisible: false})
    this.timer.resume()
    var player = this.state.players[this.state.currentPage]
    if (player != undefined) {
      player.setNativeProps({ paused: false })
    }
    this.orderSuccessModalTimer.pause()
  }

  onPageSelected(e) {
    this.timer && this.timer.pause()
    this.setState({currentPage: e.nativeEvent.position})

    var adv = this.state.advs[e.nativeEvent.position]
    var player = this.state.players[e.nativeEvent.position]
    for (var i = 0; i < this.state.players.length; i++) {
      if (this.state.players[i] != undefined) {
        this.state.players[i].setNativeProps({ paused: true })
      }
    }
    if (player != undefined) {
      player.setNativeProps({ seek: 0, paused: false })
    } else {
      RCTDeviceEventEmitter.emit('on_next', e.nativeEvent.position)
    }

    if (adv.isOrder == 1) {
      this.setState({isOrder: true})
    } else {
      this.setState({isOrder: false})
    }
  }

  render() {
    var advList = (object, i) => {
      switch (object.advertisement.fileType) {
        case 0:
          var imageSource = 'file://' + directory + object.advertisement.id + '_' + object.advertisement.fileName
          var duration = object.advertisement.time * 1000
          return (
            <View
              key={i}
              style={styles.adBackground}>
              <Image
                ref={(ref) => { this.state.players[i] = undefined }}
                style={styles.adBackground}
                resizeMode={'contain'}
                source={{uri: imageSource}}/>
              <Text style={styles.playAdvShowName}>{object.playAdvShowName}</Text>
            </View>
          )
          break
        case 1:
          var videoSource = directory + object.advertisement.id + '_' + object.advertisement.fileName
          return (
            <View
              key={i}
              style={styles.backgroundVideo}>
              <Video
                ref={(ref) => { this.state.players[i] = ref }}
                source={{uri: videoSource}}   // Can be a URL or a local file.                                      // Store reference
                rate={1.0}                              // 0 is paused, 1 is normal.
                volume={1.0}                            // 0 is muted, 1 is normal.
                muted={false}                           // Mutes the audio entirely.
                paused={true}                          // Pauses playback entirely.
                resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
                repeat={false}                           // Repeat forever.
                playInBackground={true}                // Audio continues to play when app entering background.
                // onLoadStart={this.loadStart}            // Callback when video starts to load
                // onLoad={this.onLoad}               // Callback when video loads
                // onProgress={this.setTime}               // Callback every ~250ms with currentTime
                onEnd={() => {RCTDeviceEventEmitter.emit('on_next', i + 1)}}                      // Callback when playback finishes
                // onError={this.videoError}               // Callback when video cannot be loaded
                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                // onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
                style={styles.backgroundVideo} />
              <Text style={styles.playAdvShowName}>{object.playAdvShowName}</Text>
            </View>
          )
          break
      }
    }

    let holder = null
    if (this.state.advs.length > 0) {
      holder =
        <ViewPagerAndroid
          key={this.state.key}
          ref={(ref) => { this.viewPager = ref }}
          style={styles.viewPager}
          onPageSelected={this.onPageSelected.bind(this)}
          initialPage={0}>
          {this.state.advs.map(advList)}
        </ViewPagerAndroid>
    } else {
      holder =
        <View/>
    }

    let buyButtonHolder = null
    if (this.state.isOrder) {
      buyButtonHolder = <View style={styles.trolleyContainer}>
        <TouchableNativeFeedback
          onPress={this.showBuyModal.bind(this)}>
          <Text style={styles.trolleyText}>下单</Text>
        </TouchableNativeFeedback>
        <View style={styles.trolleyImageContainer}>
          <Image
            style={styles.trolleyImage}
            source={require('../resources/trolley.png')}/>
        </View>
      </View>
    } else {
      buyButtonHolder =
        <View/>
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          style={[styles.centering, {height: 80}]}
          size="large" />
        { holder }
        { buyButtonHolder}
        <TouchableNativeFeedback
          onPress={this.launchGame.bind(this)}>
          <View style={styles.gameContainer}>
            <Image
              style={styles.gameImage}
              source={require('../resources/game.png')}/>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={this.launchPlaylist.bind(this)}>
          <View style={styles.billContainer}>
            <Image
              style={styles.billImage}
              source={require('../resources/bill.png')}/>
          </View>
        </TouchableNativeFeedback>
        <BuyModal parent={this} adTitle={this.state.adTitle} adDescription={this.state.adDesc} adPrice={this.state.adPrice} />
        <OrderSuccessModal parent={this}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  centering: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute'
  },
  playAdvShowName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },
  viewPager: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute'
  },
  adBackground: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  backgroundVideo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  trolleyContainer: {
    width: 90,
    height: 30,
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row'
  },
  trolleyText: {
    color: '#fff',
    fontSize: 14,
    width: 60,
    height: 30,
    textAlign: 'center',
    textAlignVertical: "center",
    backgroundColor: '#e95412'
  },
  trolleyImageContainer: {
    width: 30,
    height: 30,
    backgroundColor: '#ff7132',
    justifyContent: 'center',
    alignItems: 'center'
  },
  trolleyImage: {
    width: 18,
    height: 18
  },
  gameContainer: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 45,
    top: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009944'
  },
  gameImage: {
    width: 25,
    height: 17,
  },
  billContainer: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 10,
    top: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff7132'
  },
  billImage: {
    width: 17,
    height: 20,
  }
})

const mapStateToProps = state => ({
  deviceData: state.nav.deviceData
})

export default connect(mapStateToProps)(AdScreen)
