import React from 'react'
import BuyModal from './buy-modal'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
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
global.advs = []

class AdScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      imageVisible: false,
      imageSource: '',
      videoVisible: false,
      videoSource: ''
    }

    this.getAdList.bind(this)
    this.downloadAds.bind(this)
    this.autoPlayAds.bind(this)
    this.dequeue.bind(this)
    this.onLoad.bind(this)
  }

  componentDidMount() {
    var copy = this
    RCTDeviceEventEmitter.addListener('on_next', function(data) {
      console.log(data)
      copy.playTimer = setTimeout(() => {
        copy.dequeue(advs)
      }, data.duration)
    })

    if (this.props.deviceData != undefined) {
      this.getAdList()
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      .then((jsons) => {
        this.downloadAds(jsons)
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.deviceData == undefined && this.props.deviceData != undefined) {
      this.getAdList()
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      .then((jsons) => {
        this.downloadAds(jsons)
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  componentWillUnmount() {
    this.playTimer && clearTimeout(this.playTimer)
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

    storage.save({
      key: IOConstant.ADV_LIST,
      data: advs
    })
    storage.save({
      key: IOConstant.ADV_LIST_ADMIN,
      data: advsAdmin
    })

    // 检查目录是否存在
    RNFS.exists(directory).then((result) => {
      if(!result) {
        RNFS.mkdir(directory)
      }
    })

    var futures = []
    for (var i = 0; i < advs.length; i++) {
      var adv = advs[i].advertisement
      var path = directory + adv.id + '_' + adv.fileName
      console.log(path)

      futures.push(
        RNFS
        .downloadFile({
          fromUrl: encodeURI(adv.fileSrc),
          toFile: path,
          background: false
        })
        .promise
      )
    }
    // 合并下载结果
    Promise.all(futures)
    .then(responses => {
      console.log(responses)
      this.autoPlayAds()
    })
    .catch((error) => {
      console.log(error);
    })
  }

  autoPlayAds() {
    storage.load({
      key: IOConstant.ADV_LIST
    }).then(result => {
      result.reverse()
      this.dequeue(result)
    }).catch(error => {
      console.log(error)
    })
  }

  dequeue(result) {
    var copy = this
    var poped = result.pop()
    console.log("=====" + poped + "=====")
    if (!poped) {
      return
    }
    var imageVisible
    var videoVisible
    var imageSource
    var videoSource
    var path = directory + poped.advertisement.id + '_' + poped.advertisement.fileName
    switch (poped.advertisement.fileType) {
      case 0:
        imageVisible = true
        videoVisible = false
        advs = result
        this.setState({
          imageVisible: imageVisible,
          imageSource: 'file://' + path,
          videoVisible: videoVisible
        })
        RCTDeviceEventEmitter.emit('on_next', { duration: poped.advertisement.time * 1000 })
        break
      case 1:
        imageVisible = false
        videoVisible = true
        advs = result
        this.setState({
          imageVisible: imageVisible,
          videoVisible: videoVisible,
          videoSource: path
        })
        break
    }
  }

  onLoad(data) {
    RCTDeviceEventEmitter.emit('on_next', data);
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

  render() {
    let holder = null
    if (this.state.imageVisible) {
      holder =
      <Image
        style={styles.adBackground}
        resizeMode={'contain'}
        source={{uri: this.state.imageSource}}/>
    }

    if (this.state.videoVisible) {
      holder =
      <Video
        ref={(ref) => { this.player = ref }}
        source={{uri: this.state.videoSource}}   // Can be a URL or a local file.                                      // Store reference
        rate={1.0}                              // 0 is paused, 1 is normal.
        volume={1.0}                            // 0 is muted, 1 is normal.
        muted={false}                           // Mutes the audio entirely.
        paused={false}                          // Pauses playback entirely.
        resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
        repeat={false}                           // Repeat forever.
        playInBackground={true}                // Audio continues to play when app entering background.
        // onLoadStart={this.loadStart}            // Callback when video starts to load
        onLoad={this.onLoad}               // Callback when video loads
        // onProgress={this.setTime}               // Callback every ~250ms with currentTime
        // onEnd={this.onEnd}                      // Callback when playback finishes
        // onError={this.videoError}               // Callback when video cannot be loaded
        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
        // onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
        style={styles.backgroundVideo} />
    }

    return (
      <View style={styles.container}>
        {holder}
        <View style={styles.trolleyContainer}>
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
        <BuyModal modalVisible={this.state.modalVisible} adTitle={'ad-screen给的广告标题'} adDescription={'ad-screen给的广告描述'} adPrice={99911} />
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
  adBackground: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'absolute'
  },
  backgroundVideo: {
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
