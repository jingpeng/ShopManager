import React from 'react'
import {
  Dimensions,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class PlaylistScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.selectAd.bind(this)

    var data = [{
      selected: false
    }, {
      selected: false
    }, {
      selected: false
    }, {
      selected: false
    }, {
      selected: false
    }, {
      selected: false
    }]
    this.state = {
      originData: data,
      dataSource: ds.cloneWithRows(data)
    }
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
      dataSource: ds.cloneWithRows(data)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.leftPanel}
          source={require('../resources/ad-large.png')}
          >
          <Image
            style={styles.playButtonLarge}
            source={require('../resources/start-play-large.png')}
          />
        </Image>
        <View>
          <View style={styles.arrowContainer}>
            <Image
              style={styles.backArrow}
              source={require('../resources/back-arrow.png')}
            />
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionId, rowId) => {
              return (
                <View>
                  <View style={styles.divider}/>
                  <TouchableNativeFeedback
                    onPress={() => {this.selectAd(rowId)}}>
                    <View style={[
                      styles.rightPanel,
                      {backgroundColor : rowData.selected ? '#ff7132' : 'transparent'}
                      ]}>
                      <Image
                        style={styles.adSmall}
                        source={require('../resources/ad-small.png')}>
                        <Image
                          style={styles.playButtonSmall}
                          source={require('../resources/start-play-small.png')}/>
                      </Image>
                      <View style={styles.adDescContainer}>
                        <Text style={styles.adTitle}>广告名称</Text>
                        <Text
                          numberOfLines={2}
                          style={styles.adDesc}>广告描述广告描述广告描述广告描述广告描述广告描述广告描述广告描述广告描述
                        </Text>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                  <View style={styles.divider}/>
                  <View style={{height: 10}}/>
                </View>
              )
            }}
          />
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
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14
  },
  adDesc: {
    color: '#999',
    fontSize: 11,
    width: Dimensions.get('window').width - Dimensions.get('window').height - 95 - 10,
    height: 50,
    lineHeight: 26
  }
})
