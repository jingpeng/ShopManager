import React from 'react'
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View, WebView} from 'react-native'
import {connect} from 'react-redux'
import moment from 'moment'

import IOConstant from '../io/io-constant'

class WebGameScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  back() {
    this.props.navigation.dispatch({ type: 'WebGame2Game' })
    // 存储用户点击关闭游戏操作
    storage.load({key: IOConstant.OPERATE_RECORD})
    .then(result => {
      console.log(result)
      result.push({
        type: 10,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: result})
    })
    .catch(error => {
      var operations = []
      operations.push({
        type: 10,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
    })
  }

  pressScreen() {
    this.timer && clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.navigation.dispatch({ type: 'WebGame2Game' })
    }, envData.shutTime * 1000)
  }

  componentDidMount() {
    this.props.parent.clearTimer()
    this.timer = setTimeout(() => {
      this.props.navigation.dispatch({ type: 'WebGame2Game' })
    }, envData.shutTime * 1000)

    // 存储用户点击开始游戏操作
    storage.load({key: IOConstant.OPERATE_RECORD})
    .then(result => {
      console.log(result)
      result.push({
        type: 9,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: result})
    })
    .catch(error => {
      var operations = []
      operations.push({
        type: 9,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
    })
  }

  componentWillUnmount() {
    this.props.parent.resetTimer()
    this.timer && clearTimeout(this.timer)
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => { this.pressScreen() }}>
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
      </TouchableWithoutFeedback>
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
    width: 120,
    height: 60,
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row'
  },
  trolleyText: {
    color: '#fff',
    fontSize: 28,
    width: 120,
    height: 60,
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
