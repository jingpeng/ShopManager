import React from 'react'
import {View} from 'react-native'
import DeviceInfo from 'react-native-device-info'

import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant'
import IOConstant from '../io/io-constant'


export default class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.deviceGetDetailsByMac.bind(this)
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

    render() {
        return (
            <View>
            </View>
        )
    }
}
