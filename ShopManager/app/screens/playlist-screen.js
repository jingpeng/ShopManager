import React from 'react'
import {
    Dimensions,
    Image,
    ListView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import {connect} from 'react-redux'
import Video from 'react-native-video'
import moment from 'moment'
import DeviceInfo from 'react-native-device-info'

import ApiClient from '../api/api-client'
import ApiInterface from '../api/api-interface'
import ApiConstant from '../api/api-constant'
import IOConstant from '../io/io-constant'
import BuyModal from './buy-modal'
import OrderSuccessModal from './order-success-modal'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

function Timer(callback, delay) {
    var timerId, start, remaining = delay
    this.pause = function () {
        clearTimeout(timerId)
        remaining -= new Date() - start
    }
    this.resume = function () {
        start = new Date();
        clearTimeout(timerId)
        timerId = setTimeout(callback, remaining)
    }
    this.resume()
}

class PlaylistScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props)
        this.selectAd.bind(this)

        var data = []
        this.state = {
            originData: data,
            dataSource: ds.cloneWithRows(data),
            index: -1,
            currentData: null,
            isImage: true,
            videoSource: '',
            adTitle: "",
            adDesc: "",
            adPrice: 0,
            buyModalVisible: false,
            orderSuccessModalVisible: false
        }
    }

    back() {
        this.props.navigation.dispatch({type: 'Playlist2Ad'})

        // 存储用户点击清单关闭操作
        storage.load({key: IOConstant.OPERATE_RECORD})
            .then(result => {
                console.log(result)
                result.push({
                    type: 4,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: result})
            })
            .catch(error => {
                var operations = []
                operations.push({
                    type: 4,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
            })
    }

    showBuyModal() {
        this.setState({buyModalVisible: true})
        this.timer && clearTimeout(this.timer)

        var adv = this.state.currentData
        this.setState({
            adTitle: adv.advertisement.name,
            adDesc: adv.advertisement.content,
            adPrice: adv.advertisement.price
        })

        this.buyModalTimer = new Timer(() => {
            this.hideBuyModal()
        }, 18 * 1000)
        // 存储用户点击下单操作
        storage.load({key: IOConstant.OPERATE_RECORD})
            .then(result => {
                console.log(result)
                result.push({
                    type: 5,
                    playAdvId: adv.id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: result})
            })
            .catch(error => {
                var operations = []
                operations.push({
                    type: 5,
                    playAdvId: adv.id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
            })
    }

    hideBuyModal() {
        this.setState({buyModalVisible: false})
        this.timer = setTimeout(() => {
            this.props.navigation.dispatch({type: 'Playlist2Ad'})
        }, 30000)
        this.buyModalTimer.pause()
    }

    orderInModal(num) {
        var adv = this.state.currentData
        ApiClient
            .access(ApiInterface.advOrderAdd(DeviceInfo.getUniqueID(), adv.id, num))
            .then(response => response.json())
            .then((json) => {
                this.setState({orderSuccessModalVisible: true})
                this.timer && clearTimeout(this.timer)
                this.orderSuccessModalTimer = new Timer(() => {
                    this.hideOrderSuccessModal()
                }, 18 * 1000)
                console.log(json)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    hideOrderSuccessModal() {
        this.setState({orderSuccessModalVisible: false})
        this.timer = setTimeout(() => {
            this.props.navigation.dispatch({type: 'Playlist2Ad'})
        }, 30000)
        this.orderSuccessModalTimer.pause()
    }

    componentDidMount() {
        // 存储用户点击弹出清单操作
        storage.load({key: IOConstant.OPERATE_RECORD})
            .then(result => {
                console.log(result)
                result.push({
                    type: 2,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: result})
            })
            .catch(error => {
                var operations = []
                operations.push({
                    type: 2,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
            })

        RCTDeviceEventEmitter.emit('pause_component', 'mount')

        var copy = this

        this.timer = setTimeout(() => {
            this.props.navigation.dispatch({type: 'Playlist2Ad'})
        }, envData.shutTime * 1000)

        var all = this.props.advs
        for (var i = 0; i < all.length; i++) {
            all[i].selected = false
        }
        this.setState({
            originData: all,
            dataSource: ds.cloneWithRows(all)
        })
        if (all.length > 0) {
            this.setState({
                index: 0,
                currentData: all[0]
            }, () => {
                this.delayTimer = setTimeout(() => {
                    //this.selectAd(0)
                }, 2000)
            })
        }
    }

    componentWillUnmount() {
        RCTDeviceEventEmitter.emit('pause_component', 'unmount')
        this.timer && clearTimeout(this.timer)
        this.delayTimer && clearTimeout(this.delayTimer)
        this.buyModalTimer && this.buyModalTimer.pause()
        this.orderSuccessModalTimer && this.orderSuccessModalTimer.pause()
    }

    selectAd(rowId) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.props.navigation.dispatch({type: 'Playlist2Ad'})
        }, 30000)

        var data = this.state.originData;
        for (var i = 0; i < data.length; i++) {
            if (i == rowId) {
                data[i].selected = true
            } else {
                data[i].selected = false
            }
        }

        // 存储用户点击广告操作
        storage.load({key: IOConstant.OPERATE_RECORD})
            .then(result => {
                console.log(result)
                result.push({
                    type: 3,
                    playAdvId: data[rowId].id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: result})
            })
            .catch(error => {
                var operations = []
                operations.push({
                    type: 3,
                    playAdvId: data[rowId].id,
                    operateDate: moment().format("YYYY-MM-DD HH:mm:ss")
                })
                storage.save({key: IOConstant.OPERATE_RECORD, data: operations})
            })

        this.setState({
            originData: data,
            dataSource: ds.cloneWithRows(data),
            index: rowId,
            currentData: data[rowId]
        }, () => {
            this.setState({
                isImage: true
            })

            if (this.state.index >= 0) {
                if (this.state.currentData.advertisement.fileType == 0) {

                } else if (this.state.currentData.advertisement.fileType == 1) {
                    // this.setState({
                    //   isImage: false,
                    //   videoSource: this.state.currentData.advertisement.fileSrc
                    // })
                }
            }

        })
    }

    playFullScreen() {
        this.props.navigation.dispatch({type: 'PlayFull', data: [this.state.currentData,this.props.advs]})
    }

    render() {
        var coverSource = null
        if (this.state.index >= 0) {
            if (this.state.currentData.advertisement.fileType == 0) {
                coverSource = {uri: this.state.currentData.advertisement.fileSrc}
            } else if (this.state.currentData.advertisement.fileType == 1) {
                coverSource = {uri: this.state.currentData.advertisement.fileSrc + "?vframe/jpg/offset/1/w/640/h/360"}
            } else {
                coverSource = require('../resources/ad-large.png')
            }
        } else {
            coverSource = require('../resources/ad-large.png')
        }
        return (
            <View style={styles.container}>
                {(!this.state.isImage) ? (
                    <Video
                        ref={(ref) => {
                            this.player = ref
                        }}
                        source={{uri: this.state.videoSource}}   // Can be a URL or a local file.                                      // Store reference
                        rate={1.0}                              // 0 is paused, 1 is normal.
                        volume={1.0}                            // 0 is muted, 1 is normal.
                        muted={false}                           // Mutes the audio entirely.
                        paused={false}                          // Pauses playback entirely.
                        repeat={true}                           // Repeat forever.
                        playInBackground={true}                // Audio continues to play when app entering background.
                        style={styles.backgroundVideo}
                        onEnd={() => {
                            this.player.setNativeProps({seek: 0, paused: false})
                        }}/>
                ) : (
                    <TouchableWithoutFeedback
                        onPress={this.playFullScreen.bind(this)}>
                        <Image
                            style={styles.leftPanel}
                            source={coverSource}
                            resizeMode={'contain'}>
                            {
                                (this.state.currentData && this.state.currentData.advertisement.fileType == 1) ? (
                                    <TouchableWithoutFeedback
                                    onPress={this.playFullScreen.bind(this)}>
                                        <Image
                                            style={styles.playButtonLarge}
                                            source={require('../resources/start-play-large.png')}
                                        />
                                    </TouchableWithoutFeedback>
                                ) : ( null )
                            }
                            {
                                (this.state.index >= 0 && this.state.currentData.isOrder == 1) ? (
                                    <TouchableWithoutFeedback
                                        onPress={this.showBuyModal.bind(this)}>
                                        <View style={styles.trolleyContainer}>
                                            <Text style={styles.trolleyText}>下单</Text>
                                            <View style={styles.trolleyImageContainer}>
                                                <Image
                                                    style={styles.trolleyImage}
                                                    source={require('../resources/trolley.png')}/>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ) : (null)
                            }
                        </Image>
                    </TouchableWithoutFeedback>
                )
                }
                <View>
                    <View style={styles.arrowContainer}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.back()
                            }}>
                            <Image
                                style={styles.backArrow}
                                source={require('../resources/back-arrow.png')}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <ListView
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                        renderRow={(rowData, sectionId, rowId) => {
                            var imageSource = null
                            if (rowData.advertisement.fileType == 0) {
                                imageSource = {uri: rowData.advertisement.fileSrc}
                            } else if (rowData.advertisement.fileType == 1) {
                                imageSource = {uri: rowData.advertisement.fileSrc + "?vframe/jpg/offset/1/w/640/h/360"}
                            } else {
                                imageSource = require('../resources/ad-small.png')
                            }
                            return (
                                <View>
                                    <View style={styles.divider}/>
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            this.selectAd(rowId)
                                        }}>
                                        <View style={[
                                            styles.rightPanel,
                                            {backgroundColor: rowData.selected ? '#ff7132' : 'transparent'}
                                        ]}>
                                            <Image
                                                style={styles.adSmall}
                                                resizeMode={'contain'}
                                                source={imageSource}>
                                                {
                                                    (rowData.advertisement.fileType == 1) ? (
                                                        <Image
                                                            style={styles.playButtonSmall}
                                                            source={require('../resources/start-play-small.png')}/>
                                                    ) : ( null )
                                                }
                                            </Image>
                                            <View style={styles.adDescContainer}>
                                                <Text
                                                    style={[
                                                        styles.adTitle,
                                                        {color: rowData.selected ? '#fff' : '#333'}
                                                    ]}>{rowData.playAdvShowName}</Text>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[
                                                        styles.adDesc,
                                                        {color: rowData.selected ? '#fff' : '#999'}
                                                    ]}>{rowData.advertisement.content}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={styles.divider}/>
                                    <View style={{height: 10}}/>
                                </View>
                            )
                        }}/>
                </View>
                <BuyModal parent={this} adTitle={this.state.adTitle} adDescription={this.state.adDesc}
                          adPrice={this.state.adPrice}/>
                <OrderSuccessModal parent={this}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    leftPanel: {
        width: Dimensions.get('window').width * 2 / 3,
        height: Dimensions.get('window').height,
        justifyContent: 'center'
    },
    backgroundVideo: {
        height: Dimensions.get('window').height * 0.5625,
        width: Dimensions.get('window').height
    },
    playButtonLarge: {
        width: 40,
        height: 40,
        alignSelf: 'center'
    },
    trolleyContainer: {
        width: 180,
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
    },
    trolleyImageContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#ff7132',
        justifyContent: 'center',
        alignItems: 'center'
    },
    trolleyImage: {
        width: 36,
        height: 36
    },
    arrowContainer: {
        width: Dimensions.get('window').width * 1 / 3,
        height: 96,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    backArrow: {
        width: 22,
        height: 40,
        marginTop: 30,
        marginBottom: 26,
        marginRight: 20
    },
    rightPanel: {
        width: Dimensions.get('window').width * 1 / 3,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    adSmall: {
        width: 69,
        height: 69,
        marginLeft: 13,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        justifyContent: 'center'
    },
    playButtonSmall: {
        width: 20,
        height: 20,
        alignSelf: 'center'
    },
    divider: {
        width: Dimensions.get('window').width - Dimensions.get('window').height,
        height: 1,
        backgroundColor: 'rgba(232, 232, 232, 255)'
    },
    adDescContainer: {
        width: Dimensions.get('window').width - Dimensions.get('window').height - 95,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'space-between'
    },
    adTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        width: 180
    },
    adsDesc: {
        fontSize: 15,
        // width: Dimensions.get('window').width - Dimensions.get('window').height - 95 - 10,
        width: 180,
        height: 50,
        lineHeight: 26
    }
})

const mapStateToProps = state => ({
    advs: state.nav.advs
})

export default connect(mapStateToProps)(PlaylistScreen)
