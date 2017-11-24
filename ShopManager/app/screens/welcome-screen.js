import React from 'react'
import {Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'
import DeviceInfo from 'react-native-device-info'

import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant'
import IOConstant from '../io/io-constant'
import * as BackAndroid from "react-native/Libraries/Utilities/BackAndroid";


export default class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.deviceGetDetailsByMac.bind(this)

        this._timer = null;
        this.startTime = 0;
        this.endTime = 0;
    }

    componentDidMount() {
        this.deviceGetDetailsByMac()
    }

    deviceGetDetailsByMac() {
        ApiClient
            .access(ApiInterface.deviceGetDetailsByMac(DeviceInfo.getUniqueID()))
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                console.log(json)
                if (json.callStatus == ApiConstant.SUCCEED) {
                    if (json.data == null) {
                        this.props.navigation.dispatch({type: 'Welcome'})
                    } else {
                        if (json.data.userId) {
                            console.log("DeviceData")
                            console.log(json.data)
                            storage.save({key: IOConstant.DEVICE_DATE, data: json.data})
                            storage.save({key: "USERID", data: json.data.userId})
                            console.log(json.data.userId)
                        }
                        if (json.data.place == ApiConstant.DEFAULT_DEVICE_PLACE) {
                            this.props.navigation.dispatch({type: 'Welcome', defaultPlace: true})
                        } else {
                            this.props.navigation.dispatch({type: 'Ad', deviceData: json.data})
                        }
                    }
                } else {
                    ToastAndroid.show(json.data, ToastAndroid.SHORT)
                }
            })
            .catch((error) => {
                console.log(error)
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
            <View>
                <Image
                    style={{
                        height: 600,
                        width: 1024,
                    }}
                    source={require('../resources/welcome.png')}
                />
                <TouchableWithoutFeedback
                    onPressIn={this.startCount.bind(this)}
                    onPressOut={this.stopCount.bind(this)}>
                    <View style={styles.backStyle}>
                        {/*<Text style={styles.backText}>长按退出</Text>*/}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            position: 'relative',
            alignItems: 'center',
        },
        backStyle: {
            width: 100,
            height: 100,
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
            fontSize: 24
        }
    }
);
