import React from 'react'
import {
  Dimensions,
  Image,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native'

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
  playButton: {
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
    justifyContent: 'center',
    backgroundColor: '#ff7132',
    marginBottom: 10
  },
  adSmall: {
    width: 69,
    height: 69,
    marginLeft: 13,
    marginTop: 10,
    marginBottom: 10
  }
})

export default class PlaylistScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([
        {
          selected: false
        },
        {
          selected: false
        },
        {
          selected: false
        },
        {
          selected: false
        },
        {
          selected: false
        },
        {
          selected: false
        }
      ])
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.leftPanel}
          source={require('../resources/ad-large.png')}
          >
          <Image
            style={styles.playButton}
            source={require('../resources/start-play.png')}/>
        </Image>
        <View>
          <View style={styles.arrowContainer}>
            <Image
              style={styles.backArrow}
              source={require('../resources/back-arrow.png')}/>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => {
              return (
                <View
                  style={styles.rightPanel}>
                  <Image
                    style={styles.adSmall}
                    source={require('../resources/ad-small.png')}/>
                </View>
              )
            }}
          />
        </View>
      </View>
    )
  }
}
