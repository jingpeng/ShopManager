import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'
import Video from 'react-native-video'

class PlayFullScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.navigation.dispatch({ type: 'PlayFull2Ad' })
    }, envData.popTime * 1000)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }

  render() {
    var holder = null
    if (this.props.data.advertisement.fileType == 0) {
      holder =
        <Image
          style={styles.adBackground}
          resizeMode={'contain'}
          source={{uri: this.props.data.advertisement.fileSrc}}/>
    } else if (this.props.data.advertisement.fileType == 1) {
      holder =
        <Video
          source={{uri: this.props.data.advertisement.fileSrc}}   // Can be a URL or a local file.                                      // Store reference
          rate={1.0}                              // 0 is paused, 1 is normal.
          volume={1.0}                            // 0 is muted, 1 is normal.
          muted={false}                           // Mutes the audio entirely.
          paused={false}                          // Pauses playback entirely.
          resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
          repeat={false}                           // Repeat forever.
          playInBackground={true}                // Audio continues to play when app entering background.
          style={styles.backgroundVideo} />
    } else {

    }
    return (
      <View style={styles.container}>
        {holder}
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
  }
})

const mapStateToProps = state => ({
  data: state.nav.data
})

export default connect(mapStateToProps)(PlayFullScreen)
