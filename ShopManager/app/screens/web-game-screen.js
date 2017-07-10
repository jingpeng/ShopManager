import React from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  WebView
} from 'react-native'
import { connect } from 'react-redux'

class WebGameScreen extends React.Component {
  static navigationOptions = {
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
  }
})

const mapStateToProps = state => ({
  uri: state.nav.uri
})

export default connect(mapStateToProps)(WebGameScreen)
