import React from 'react'
import {
  Dimensions,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import moment from 'moment'

import IOConstant from '../io/io-constant'
import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class GameScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

    var data = []
    this.state = {
      currentData: null,
      originData: data,
      dataSource: ds.cloneWithRows(data),
      index: -1
    }
  }

  pingback(data) {
    // 存储用户点击游戏清单上的游戏操作
    storage.load({key: IOConstant.OPERATE_RECORD})
    .then(result => {
      console.log(result)
      result.push({
        type: 8,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: result})
    })
    .catch(error => {
      var operations = []
      operations.push({
        type: 8,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
    })
  }

  componentDidMount() {
    RCTDeviceEventEmitter.emit('pause_component', 'mount')
    this.timer = setTimeout(() => {
      this.props.navigation.dispatch({ type: 'Game2Ad' })
    }, envData.shutTime * 1000)

    ApiClient.access(ApiInterface.gameGetList(ApiConstant.DEFAULT_NUMBER_PER_PAGE, 1))
    .then(response => response.json())
    .then(json => {
      console.log(json)
      var array = json.data
      if (array.length >= 1) {
        this.setState({index: 0, currentData: array[0]})
      }
      var twinArray = []
      for (var i = 0; i < array.length; i+=2) {
        var eachItemArray = new Array(2)
        if (i < array.length) {
          eachItemArray[0] = array[i]
        }
        if(i + 1 < array.length) {
          eachItemArray[1] = array[i + 1]
        }
        twinArray.push(eachItemArray)
      }
      this.setState({
        originData: twinArray,
        dataSource: ds.cloneWithRows(twinArray)
      })
    })
    .catch(error => {
      console.log(error)
    })

    // 存储用户点击游戏清单操作
    storage.load({key: IOConstant.OPERATE_RECORD})
    .then(result => {
      console.log(result)
      result.push({
        type: 7,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: result})
    })
    .catch(error => {
      var operations = []
      operations.push({
        type: 7,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
    })
  }

  componentWillUnmount() {
    RCTDeviceEventEmitter.emit('pause_component', 'unmount')
    this.timer && clearTimeout(this.timer)
  }

  clearTimer() {
    this.timer && clearTimeout(this.timer)
  }

  resetTimer() {
    this.timer = setTimeout(() => {
      this.props.navigation.dispatch({ type: 'Game2Ad' })
    }, envData.shutTime * 1000)
  }

  back() {
    this.props.navigation.dispatch({ type: 'Game2Ad' })
    // 存储用户点击关闭游戏操作
    storage.load({key: IOConstant.OPERATE_RECORD})
    .then(result => {
      console.log(result)
      result.push({
        type: 11,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: result})
    })
    .catch(error => {
      var operations = []
      operations.push({
        type: 11,
        operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.leftPanel}
          source={(this.state.index < 0) ? require('../resources/ad-large.png') : {uri: this.state.currentData.bigPic}}>
          {
            (this.state.index >= 0) ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.navigation.dispatch({
                    type: 'WebGame',
                    uri: this.state.currentData.src,
                    parent: this
                  })
                }}>
                <View style={styles.startContainer}>
                  <Text style={styles.startText}>开始</Text>
                </View>
              </TouchableWithoutFeedback>
            ) : ( null )
          }
        </Image>
        <View>
          <View style={styles.arrowContainer}>
            <TouchableWithoutFeedback
              onPress={() => { this.back() }}>
              <Image
                style={styles.backArrow}
                source={require('../resources/back-arrow.png')}/>
            </TouchableWithoutFeedback>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            showsVerticalScrollIndicator={false}
            enableEmptySections={true}
            renderRow={(rowData, sectionId, rowId) => {
              console.log(rowId)
              var holder1, holder2
              if (rowData[0] != undefined) {
                holder1 =
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({index: rowId * 2, currentData: rowData[0]})
                      this.pingback(rowData[0])
                    }}>
                    <Image
                      style={[styles.gameCoverImage, {marginLeft: 15}]}
                      source={{uri: rowData[0].smallPic}}>
                      <View style={styles.descContainer}>
                        <View style={styles.gameDescContainer}>
                          <Text style={styles.gameDescText}>{ rowData[0].name }</Text>
                          <Text style={styles.gameDescText}>手机游戏</Text>
                        </View>
                        {/*<Text style={styles.gamePlayerNumText}>112万人爱玩</Text>*/}
                      </View>
                    </Image>
                  </TouchableWithoutFeedback>
              } else {
                holder1 =
                  <Image
                    style={[styles.gameCoverImage, {marginLeft: 15}]}>
                  </Image>
              }
              if (rowData[1] != undefined) {
                holder2 =
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({index: rowId * 2 + 1, currentData: rowData[1]})
                      this.pingback(rowData[1])
                    }}>
                    <Image
                      style={[styles.gameCoverImage, {marginRight: 15}]}
                      source={{uri: rowData[1].smallPic}}>
                      <View style={styles.descContainer}>
                        <View style={styles.gameDescContainer}>
                          <Text style={styles.gameDescText}>{ rowData[1].name }</Text>
                          <Text style={styles.gameDescText}>手机游戏</Text>
                        </View>
                        {/*<Text style={styles.gamePlayerNumText}>112万人爱玩</Text>*/}
                      </View>
                    </Image>
                  </TouchableWithoutFeedback>
              } else {
                holder2 =
                  <Image
                    style={[styles.gameCoverImage, {marginRight: 15}]}>
                  </Image>
              }

              return (
                <View>
                  <View style={styles.rowContainer}>
                    {holder1}
                    {holder2}
                  </View>
                  <View style={{height: 10}}/>
                </View>
              )
            }}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5FCFF'
  },
  leftPanel: {
    width: Dimensions.get('window').width * 2 / 3,
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  startContainer: {
    width: 180,
    height: 60,
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row'
  },
  startText: {
    color: '#fff',
    fontSize: 28,
    width: 180,
    height: 60,
    textAlign: 'center',
    textAlignVertical: "center",
    backgroundColor: '#e95412'
  },
  arrowContainer: {
    height: 96,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  backArrow: {
    width: 22,
    height: 40,
    marginTop: 30,
    marginBottom: 26,
    marginRight: 20
  },
  rowContainer: {
    width: Dimensions.get('window').width * 1 / 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  gameCoverImage: {
    width: (Dimensions.get('window').width / 3 - 40) / 2,
    height: (Dimensions.get('window').width / 3 - 40) / 2,
    justifyContent: 'flex-end'
  },
  descContainer: {
    backgroundColor: '#fff'
  },
  gameDescContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4
  },
  gameDescText: {
    color: '#333',
    fontSize: 14,
      width:50
  },
  gamePlayerNumText: {
    color: '#999',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
    alignSelf: 'center',
    marginBottom: 7
  }
})
