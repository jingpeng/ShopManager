import React from 'react'
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import {connect} from 'react-redux'
import DeviceInfo from 'react-native-device-info'

import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant';
import * as BackAndroid from "react-native/Libraries/Utilities/BackAndroid";

class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null
    }


    constructor(props) {
        super(props)
        this.state = {
            userName: "",

            password: "",
        }


        this._timer = null;
        this.startTime = 0;
        this.endTime = 0;

        this.userLogin.bind(this)
        this.deviceAdd.bind(this)
        this.deviceGetDetailsByMac.bind(this)
    }

    userNameOnChange(text) {
        this.setState({userName: text})
    }

    passwordOnChange(text) {
        this.setState({password: text})
    }

    userLogin() {
        ApiClient
            .access(ApiInterface.userLogin(this.state.userName, this.state.password))
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                console.log("json = "+json)
                if (json.callStatus == ApiConstant.SUCCEED) {
                    if (!this.props.defaultPlace) {
                        this.deviceAdd(json)
                    } else {
                        this.deviceGetDetailsByMac(json)
                    }
                } else {
                    ToastAndroid.show(json.data, ToastAndroid.SHORT)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deviceAdd(loginResponse) {
        ApiClient
            .access(ApiInterface.deviceAdd(loginResponse.token, ApiConstant.DEFAULT_DEVICE_PLACE, DeviceInfo.getUniqueID()))
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                console.log("1" + json)
                if (json.callStatus == ApiConstant.SUCCEED) {
                    this.props.navigation.dispatch({type: 'Login', userData: loginResponse, deviceData: json.data})
                } else {
                    ToastAndroid.show(json.data, ToastAndroid.SHORT)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deviceGetDetailsByMac(loginResponse) {
        ApiClient
            .access(ApiInterface.deviceGetDetailsByMac(DeviceInfo.getUniqueID()))
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                console.log("2"+ json)
                if (json.callStatus == ApiConstant.SUCCEED) {
                    this.props.navigation.dispatch({type: 'Login', userData: loginResponse, deviceData: json.data})
                } else {
                    ToastAndroid.show(json.data, ToastAndroid.SHORT)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 删除设备的方法用于测试
    deviceDelete(token) {
        ApiClient
            .access(ApiInterface.deviceDelete(token, 3))
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                console.log(json)
                if (json.callStatus == ApiConstant.SUCCEED) {
                    ToastAndroid.show(json.data, ToastAndroid.SHORT)
                } else {
                    ToastAndroid.show(json.data, ToastAndroid.SHORT)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    startCount() {
        this.startTime = new Date().getTime()
        console.log('当前时间 = ' + this.startTime)
        this._timer = setTimeout(() => {
            BackAndroid.exitApp();
            this.startTime = 0;
            console.log("定时器")
        }, 10000)
    }

    stopCount() {
        this.endTime = new Date().getTime()
        console.log('结束时间 = ' + this.endTime)
        console.log(parseInt(this.endTime, 10) - parseInt(this.startTime, 10))
        if (parseInt(this.endTime, 10) - parseInt(this.startTime, 10) < 10000) {
            console.log("清除")
            this._timer && clearTimeout(this._timer)
            console.log('2223' + this._timer)
            this.startTime = 0;
            this.endTime = 0;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<View style={styles.backStyle}/>*/}
                <TouchableWithoutFeedback
                    onPressIn={this.startCount.bind(this)}
                    onPressOut={this.stopCount.bind(this)}>
                    <View style={styles.backStyle}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputTitle}
                        editable={false}
                        placeholder={'商铺账号：'}
                        underlineColorAndroid={'transparent'}
                    />
                    <TextInput
                        onChangeText={this.userNameOnChange.bind(this)}
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
                        placeholder={'商铺密码：'}
                        underlineColorAndroid={'transparent'}
                    />
                    <TextInput
                        onChangeText={this.passwordOnChange.bind(this)}
                        style={styles.inputContent}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
                <View style={styles.divider}/>

                <View style={styles.space2}/>
                <TouchableNativeFeedback
                    onPress={() => {
                        this.userLogin()
                    }}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={styles.loginButton}>
                        <Text style={styles.loginText}>确定</Text>
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
        position: 'relative',
        alignItems: 'center',
    },
    backStyle: {
        width: 60,
        height: 60,
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    backText: {
        position: 'absolute',
        height: 60,
        width: 60,
        top: 0,
        left: 0,
        fontSize: 22
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
        width: 70
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
        marginTop: 65
    },
    loginButton: {
        height: 30,
        width: 150,
        backgroundColor: 'rgba(233, 84, 18, 255)',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginText: {
        color: '#ffffff',
        fontSize: 14
    }
})

const mapStateToProps = state => ({
    defaultPlace: state.nav.defaultPlace,
})


export default connect(mapStateToProps)(LoginScreen)