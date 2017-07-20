import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  WebView
} from 'react-native'
import { connect } from 'react-redux'

class WebGameScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  back() {
    this.props.navigation.dispatch({ type: 'WebGame2Game' })
  }

  componentDidMount() {
    this.props.parent.clearTimer()
  }

  componentWillUnmount() {
    this.props.parent.resetTimer()
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          style={styles.webView}
          source={{uri: this.props.uri}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          startInLoadingState={true}
          scalesPageToFit={true}
        />
        <TouchableWithoutFeedback
          onPress={() => { this.back() }}>
          <View style={styles.trolleyContainer}>
            <Text style={styles.trolleyText}>关闭</Text>
          </View>
        </TouchableWithoutFeedback>
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
  webView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  trolleyContainer: {
    width: 60,
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
  }
})

const mapStateToProps = state => ({
  uri: state.nav.uri,
  parent: state.nav.parent
})

export default connect(mapStateToProps)(WebGameScreen)
