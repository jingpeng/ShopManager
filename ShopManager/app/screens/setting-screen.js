import React from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  View
} from 'react-native'
import { connect } from 'react-redux'

import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant'

class SettingScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      place: ""
    }
  }

  placeOnChange(text) {
    this.setState({place: text})
  }

  setting() {
    var deviceData = this.props.deviceData
    var userData = this.props.userData
    ApiClient
    .access(ApiInterface.deviceUpdate(userData.token, deviceData.id, this.state.place))
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      console.log(json)
      if (json.callStatus == ApiConstant.SUCCEED) {
        this.props.navigation.dispatch({ type: 'Setting' })
      } else {
        ToastAndroid.show(json.data, ToastAndroid.SHORT)
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render() {
    var deviceData = this.props.deviceData
    var userData = this.props.userData
    console.log(userData)
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
            editable={false}
            value={(userData == undefined) ? '' : userData.data.allName}
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
            editable={false}
            value={(deviceData == undefined) ? '' : deviceData.id.toString()}
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
            editable={false}
            value={(deviceData == undefined) ? '' : deviceData.mac}
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
            onChangeText = {this.placeOnChange.bind(this)}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <View style={styles.divider}/>

        <View style={styles.space2}/>

        <TouchableNativeFeedback
          onPress={this.setting.bind(this)}
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

const mapStateToProps = state => ({
  deviceData: state.nav.deviceData,
  userData: state.nav.userData
})

export default connect(mapStateToProps)(SettingScreen)
