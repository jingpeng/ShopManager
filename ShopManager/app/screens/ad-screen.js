import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class AdScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.adBackground}
          source={require('../resources/ad-background.png')}/>
        <View style={styles.trolleyContainer}>
          <Text style={styles.trolleyText}>下单</Text>
          <View style={styles.trolleyImageContainer}>
            <Image
              style={styles.trolleyImage}
              source={require('../resources/trolley.png')}/>
          </View>
        </View>
        <View style={styles.gameContainer}>
          <Image
            style={styles.gameImage}
            source={require('../resources/game.png')}/>
        </View>
        <View style={styles.billContainer}>
          <Image
            style={styles.billImage}
            source={require('../resources/bill.png')}/>
        </View>
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
    width: Dimensions.get('window').height * 1.6
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
