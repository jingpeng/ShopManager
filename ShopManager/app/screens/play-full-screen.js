import React from 'react'
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import {connect} from 'react-redux'
import Video from 'react-native-video'
import moment from 'moment'

import IOConstant from '../io/io-constant'

class PlayFullScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.navigation.dispatch({type: 'PlayFull2Ad'})
        }, envData.popTime * 1000)

        var data = this.props.data
        // 存储用户点击弹出广告操作
        storage.load({key: IOConstant.OPERATE_RECORD})
            .then(result => {
                console.log(result)
                result.push({
                    type: 1,
                    playAdvId: data.id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: result})
            })
            .catch(error => {
                var operations = []
                operations.push({
                    type: 1,
                    playAdvId: data.id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
            })
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
        var data = this.props.data
        // 存储用户点击弹出广告关闭 操作
        storage.load({key: IOConstant.OPERATE_RECORD})
            .then(result => {
                console.log(result)
                result.push({
                    type: 6,
                    playAdvId: data.id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: result})
            })
            .catch(error => {
                var operations = []
                operations.push({
                    type: 6,
                    playAdvId: data.id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
            })

        global.popupAd = false
    }

    back() {
        this.props.navigation.dispatch({type: 'PlayFull2Ad'})
        //this.props.navigation.dispatch({ type: 'Playlist', advs: this.mapStateToProps.data})
        // console.log(this.props.navigation)
    }

    render() {
        var holder = null
        if (this.props.data.advertisement.fileType == 0) {
            holder =
                <Image
                    style={styles.adBackground}
                    resizeMode={'contain'}
                    source={{uri: this.props.data.advertisement.fileSrc}}/>
        } else if (this.props.data.advertisement.fileType == 1) {
            holder =
                <Video
                    source={{uri: this.props.data.advertisement.fileSrc}}   // Can be a URL or a local file.                                      // Store reference
                    rate={1.0}                              // 0 is paused, 1 is normal.
                    volume={1.0}                            // 0 is muted, 1 is normal.
                    muted={false}                           // Mutes the audio entirely.
                    paused={false}                          // Pauses playback entirely.
                    resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
                    repeat={true}                           // Repeat forever.
                    playInBackground={true}                // Audio continues to play when app entering background.
                    style={styles.backgroundVideo}/>
        } else {

        }
        return (
            <View style={styles.container}>
                {holder}
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.back()
                    }}>
                    <View style={styles.trolleyContainer}>
                        <Text style={styles.trolleyText}>关闭</Text>
                    </View>
                </TouchableWithoutFeedback>
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
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    backgroundVideo: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    trolleyContainer: {
        width: 120,
        height: 60,
        position: 'absolute',
        right: 0,
        bottom: 0,
        flexDirection: 'row'
    },
    trolleyText: {
        color: '#fff',
        fontSize: 28,
        width: 120,
        height: 60,
        textAlign: 'center',
        textAlignVertical: "center",
        backgroundColor: '#e95412'
    }
})

const mapStateToProps = state => ({
    data: state.nav.data
})

export default connect(mapStateToProps)(PlayFullScreen)
