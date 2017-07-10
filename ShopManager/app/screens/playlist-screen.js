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

import IOConstant from '../io/io-constant'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class PlaylistScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.selectAd.bind(this)

    var data = []
    this.state = {
      originData: data,
      dataSource: ds.cloneWithRows(data),
      index: -1,
      currentData: null
    }
  }

  componentDidMount() {
    var promise1 = storage.load({key: IOConstant.ADV_LIST})
    var promise2 = storage.load({key: IOConstant.ADV_LIST_ADMIN})
    promise1.then(results1 => {
      console.log(results1)
      promise2.then(results2 => {
        var all = results1.concat(results2)
        for (var i = 0; i < all.length; i++) {
          all[i].selected = false
        }
        this.setState({
          originData: all,
          dataSource: ds.cloneWithRows(all)
        })
        if (all.length > 0) {
          this.setState({
            index: 0,
            currentData: all[0]
          })
        }
      })
      .catch(error => {
        console.warn(error.message)
      })
    })
    .catch(error => {
      console.warn(error.message)
    })
  }

  selectAd(rowId) {
    var data = this.state.originData;
    for (var i = 0; i < data.length; i++) {
      if (i == rowId) {
        data[i].selected = true
      } else {
        data[i].selected = false
      }
    }

    this.setState({
      originData: data,
      dataSource: ds.cloneWithRows(data),
      index: rowId,
      currentData: data[rowId]
    })
  }

  playFullScreen() {
    if (this.state.index >= 0) {
      this.props.navigation.dispatch({ type: 'PlayFull', data: this.state.currentData })
    }
  }

  render() {
    var coverSource = null
    if (this.state.index >= 0) {
      if (this.state.currentData.advertisement.fileType == 0) {
        coverSource = {uri: this.state.currentData.advertisement.fileSrc}
      } else if (this.state.currentData.advertisement.fileType == 1) {
        coverSource = {uri: this.state.currentData.advertisement.fileSrc + "?vframe/jpg/offset/1/w/640/h/360"}
      } else {
        coverSource = require('../resources/ad-large.png')
      }
    } else {
      coverSource = require('../resources/ad-large.png')
    }
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={this.playFullScreen.bind(this)}>
          <Image
            style={styles.leftPanel}
            source={coverSource}>
            {
              (this.state.currentData && this.state.currentData.advertisement.fileType == 1) ? (
                <Image
                  style={styles.playButtonLarge}
                  source={require('../resources/start-play-large.png')}/>
              ) : ( null )
            }
            {
              (this.state.index >= 0 && this.state.currentData.isOrder == 1) ? (
                <View style={styles.trolleyContainer}>
                  <Text style={styles.trolleyText}>下单</Text>
                  <View style={styles.trolleyImageContainer}>
                    <Image
                      style={styles.trolleyImage}
                      source={require('../resources/trolley.png')}/>
                  </View>
                </View>
              ) : (null)
            }
          </Image>
        </TouchableWithoutFeedback>
        <View>
          <View style={styles.arrowContainer}>
            <TouchableWithoutFeedback
              onPress={() => { this.props.navigation.dispatch({ type: 'Playlist2Ad' }) }}>
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
              var imageSource = null
              if (rowData.advertisement.fileType == 0) {
                imageSource = {uri: rowData.advertisement.fileSrc}
              } else if (rowData.advertisement.fileType == 1) {
                imageSource = {uri: rowData.advertisement.fileSrc + "?vframe/jpg/offset/1/w/640/h/360"}
              } else {
                imageSource = require('../resources/ad-small.png')
              }
              return (
                <View>
                  <View style={styles.divider}/>
                  <TouchableWithoutFeedback
                    onPress={() => {this.selectAd(rowId)}}>
                    <View style={[
                      styles.rightPanel,
                      {backgroundColor : rowData.selected ? '#ff7132' : 'transparent'}
                      ]}>
                      <Image
                        style={styles.adSmall}
                        source={imageSource}>
                        {
                          (rowData.advertisement.fileType == 1) ? (
                            <Image
                              style={styles.playButtonSmall}
                              source={require('../resources/start-play-small.png')}/>
                          ) : ( null )
                        }
                      </Image>
                      <View style={styles.adDescContainer}>
                        <Text
                          style={[
                            styles.adTitle,
                            {color: rowData.selected ? '#fff' : '#333'}
                          ]}>{rowData.advertisement.name}</Text>
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.adDesc,
                            {color: rowData.selected ? '#fff' : '#999'}
                          ]}>{rowData.advertisement.content}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.divider}/>
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
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  leftPanel: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  playButtonLarge: {
    width: 40,
    height: 40,
    alignSelf: 'center'
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
  arrowContainer: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  backArrow: {
    width: 11,
    height: 20,
    marginTop: 15,
    marginBottom: 13,
    marginRight: 10
  },
  rightPanel: {
    width: Dimensions.get('window').width - Dimensions.get('window').height,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  adSmall: {
    width: 69,
    height: 69,
    marginLeft: 13,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center'
  },
  playButtonSmall: {
    width: 20,
    height: 20,
    alignSelf: 'center'
  },
  divider: {
    width: Dimensions.get('window').width - Dimensions.get('window').height,
    height: 1,
    backgroundColor: 'rgba(232, 232, 232, 255)'
  },
  adDescContainer: {
    width: Dimensions.get('window').width - Dimensions.get('window').height - 95,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between'
  },
  adTitle: {
    fontWeight: 'bold',
    fontSize: 14
  },
  adDesc: {
    fontSize: 11,
    width: Dimensions.get('window').width - Dimensions.get('window').height - 95 - 10,
    height: 50,
    lineHeight: 26
  }
})
