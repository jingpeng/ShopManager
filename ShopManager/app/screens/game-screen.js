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
      originData: data,
      dataSource: ds.cloneWithRows(data)
    }
  }

  componentDidMount() {
    ApiClient.access(ApiInterface.gameGetList(ApiConstant.DEFAULT_NUMBER_PER_PAGE, 1))
    .then(response => response.json())
    .then(json => {
      console.log(json)
      var array = json.data
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
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.leftPanel}
          source={require('../resources/ad-large.png')}>
          <Image
            style={styles.playButtonLarge}
            source={require('../resources/start-play-large.png')}/>
          <View style={styles.startContainer}>
            <Text style={styles.startText}>开始</Text>
          </View>
        </Image>
        <View>
          <View style={styles.arrowContainer}>
            <TouchableWithoutFeedback
              onPress={() => {this.props.navigation.dispatch({ type: 'Game2Ad' })}}>
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
              var holder1, holder2
              if (rowData[0] != undefined) {
                holder1 =
                  <Image
                    style={[styles.gameCoverImage, {marginLeft: 15}]}
                    source={{uri: rowData[0].smallPic}}>
                    <View style={styles.descContainer}>
                      <View style={styles.gameDescContainer}>
                        <Text style={styles.gameDescText}>{ rowData[0].name }</Text>
                        <Text style={styles.gameDescText}>手机游戏</Text>
                      </View>
                      <Text style={styles.gamePlayerNumText}>112万人爱玩</Text>
                    </View>
                  </Image>
              } else {
                holder1 =
                  <Image
                    style={[styles.gameCoverImage, {marginLeft: 15}]}>
                  </Image>
              }
              if (rowData[1] != undefined) {
                holder2 =
                  <Image
                    style={[styles.gameCoverImage, {marginRight: 15}]}
                    source={{uri: rowData[1].smallPic}}>
                    <View style={styles.descContainer}>
                      <View style={styles.gameDescContainer}>
                        <Text style={styles.gameDescText}>{ rowData[1].name }</Text>
                        <Text style={styles.gameDescText}>手机游戏</Text>
                      </View>
                      <Text style={styles.gamePlayerNumText}>112万人爱玩</Text>
                    </View>
                  </Image>
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
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  playButtonLarge: {
    width: 40,
    height: 40,
    alignSelf: 'center'
  },
  startContainer: {
    width: 90,
    height: 30,
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row'
  },
  startText: {
    color: '#fff',
    fontSize: 14,
    width: 90,
    height: 30,
    textAlign: 'center',
    textAlignVertical: "center",
    backgroundColor: '#e95412'
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
  rowContainer: {
    width: Dimensions.get('window').width - Dimensions.get('window').height,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  gameCoverImage: {
    width: (Dimensions.get('window').width - Dimensions.get('window').height - 40) / 2,
    height: (Dimensions.get('window').width - Dimensions.get('window').height - 40) / 2,
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
    fontSize: 12
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
