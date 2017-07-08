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

import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant'
import IOConstant from '../io/io-constant'

const directory = RNFS.ExternalStorageDirectoryPath + IOConstant.ADV_DIRECTORY

class AdScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      advs: [],
      players: [],
      loading: false,
      isOrder: false
    }

    this.getAdList.bind(this)
    this.downloadAds.bind(this)
  }

  componentDidMount() {
    var copy = this
    RCTDeviceEventEmitter.addListener('all_load', function(advs){
      copy.setState({
        advs: advs,
        players: new Array(advs.length),
        loading: false
      }, () => {
        RCTDeviceEventEmitter.emit('on_next', 0)
      })
    })

    RCTDeviceEventEmitter.addListener('on_next', function(page){
      console.log(page)
      if (page >= copy.state.advs.length) {
        page = 0
        copy.viewPager.setPage(page)
      }
      var adv = copy.state.advs[page]
      if (adv.isOrder == 1) {
        copy.setState({isOrder: true})
      } else {
        copy.setState({isOrder: false})
      }

      if (adv.advertisement.time != null) {
        copy.timer = setTimeout(() => {
          copy.viewPager.setPage(page + 1)
          RCTDeviceEventEmitter.emit('on_next', page + 1)

          var player = copy.state.players[page + 1]
          for (var i = 0; i < copy.state.players.length; i++) {
            if (copy.state.players[i] != undefined) {
              copy.state.players[i].setNativeProps({ paused: true })
            }
          }
          if (player != undefined) {
            player.setNativeProps({ seek: 0, paused: false })
          }
        }, adv.advertisement.time * 1000)
      }
    })

    if (this.props.deviceData != undefined) {
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
    this.timer && clearTimeout(this.timer)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.deviceData == undefined && this.props.deviceData != undefined) {
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

  downloadAds(jsons) {
    console.log(jsons)
    var advs = jsons[0].data
    var advsAdmin = jsons[1].data

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
          RCTDeviceEventEmitter.emit('all_load', jsons[0].data)
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
    this.setState({modalVisible: true})
  }

  onPageSelected(e) {
    this.timer && clearTimeout(this.timer)

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
            </View>
          )
          break
      }
    }

    let holder = null
    if (this.state.advs.length > 0) {
      holder =
        <ViewPagerAndroid
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
        <BuyModal parent={this} adTitle={'ad-screen给的广告标题'} adDescription={'ad-screen给的广告描述'} adPrice={99911} />
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
