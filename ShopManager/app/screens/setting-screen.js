import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View
} from 'react-native';

export default class SettingScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputTitle}
            editable={false}
            placeholder={'商铺名称：'}
            underlineColorAndroid={'transparent'}
          />
          <TextInput
            style={styles.inputContent}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <View style={styles.divider}/>

        <View style={styles.space1}/>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputTitle}
            editable={false}
            placeholder={'设备编号：'}
            underlineColorAndroid={'transparent'}
          />
          <TextInput
            style={styles.inputContent}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <View style={styles.divider}/>

        <View style={styles.space1}/>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputTitle}
            editable={false}
            placeholder={'设备ID：'}
            underlineColorAndroid={'transparent'}
          />
          <TextInput
            style={styles.inputContent}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <View style={styles.divider}/>

        <View style={styles.space1}/>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputTitle}
            editable={false}
            placeholder={'设备位置信息：'}
            underlineColorAndroid={'transparent'}
          />
          <TextInput
            style={styles.inputContent}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <View style={styles.divider}/>

        <View style={styles.space2}/>

        <TouchableNativeFeedback
          onPress={() => navigation.dispatch({ type: 'Login' })}
          background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmText}>确定</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 254
  },
  space1: {
    marginTop: 30
  },
  inputTitle: {
    color: 'rgba(88, 88, 88, 255)',
    fontSize: 14,
    padding: 0,
    width: 98
  },
  inputContent: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(88, 88, 88, 255)',
    padding: 0
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(181, 181, 181, 255)',
    width: Dimensions.get('window').width - 254,
    marginTop: -5
  },
  space2: {
    marginTop: 45
  },
  confirmButton: {
    height: 30,
    width: 150,
    backgroundColor: 'rgba(233, 84, 18, 255)',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 14
  }
})
