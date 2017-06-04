import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default MainScreen = () => (
  <View style={styles.container}>
  </View>
);

MainScreen.navigationOptions = {
  title: 'Home Screen',
};
