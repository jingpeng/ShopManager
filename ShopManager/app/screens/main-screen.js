import React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
})

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Home Screen',
  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    )
  }
}
