import React from 'react'
import {Dimensions, Image, ListView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native'
import {connect} from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import QRCode from 'react-native-qrcode'

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

class AllowanceScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.selectAd.bind(this)

        var data = []
        this.state = {
            originData: props.data,
            dataSource: ds.cloneWithRows(props.data),
            index: -1,
            currentData: null
        }
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.navigation.dispatch({type: 'Allowance2Ad'})
        }, 30000)

        console.log(this.props.data)
        if (this.props.data.length >= 0)
            this.setState({
                dataSource: ds.cloneWithRows(this.props.data),
                index: 0,
                currentData: this.props.data[0]
            })
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    selectAd(rowId) {
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.props.navigation.dispatch({type: 'Allowance2Ad'})
        }, 30000)

        var data = this.state.originData;
        for (var i = 0; i < data.length; i++) {
            if (i == rowId) {
                data[i].selected = true
            } else {
                data[i].selected = false
            }
        }
        this.setState({
            originData: data,
            dataSource: ds.cloneWithRows(data),
            index: rowId,
            currentData: data[rowId]
        }, () => {

        })
    }

    back() {
        this.props.navigation.dispatch({type: 'Allowance2Ad'})
    }

    render() {
        var coverSource = null
        if (this.state.index >= 0) {
            if (this.state.currentData.isDraw) {
                coverSource = require('../resources/draw-large.png')
            } else {
                coverSource = {uri: this.state.currentData.bigImgSrc}
            }
        }
        var qrCodeStr = ''
        if (this.state.index >= 0) {
            if (this.state.currentData.isDraw) {
                qrCodeStr = 'http://wap.tabread.com/draw/' + (this.state.currentData.userId) + '?mac=' + DeviceInfo.getUniqueID()
            } else {
                qrCodeStr = 'http://wap.tabread.com/discount/' + (this.state.currentData.id) + '?mac=' + DeviceInfo.getUniqueID()
            }
        }
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback>
                    <Image
                        style={styles.leftPanel}
                        source={coverSource}
                        resizeMode={'contain'}>
                        <View style={styles.qrCode}>
                            <QRCode
                                value={qrCodeStr}
                                size={Dimensions.get('window').height / 4}
                                bgColor='black'
                                fgColor='white'/>
                        </View>
                    </Image>
                </TouchableWithoutFeedback>
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
                            var name = null
                            var content = null
                            if (rowData.isDraw) {
                                imageSource = require('../resources/draw-small.png')
                                name = '欢乐大抽奖'
                                content = '扫描左侧二维码即可参与抽奖活动'
                            } else {
                                imageSource = {uri: rowData.smallImgSrc}
                                name = rowData.name
                                content = rowData.description
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
                                            </Image>
                                            <View style={styles.adDescContainer}>
                                                <Text
                                                    style={[
                                                        styles.adTitle,
                                                        {color: rowData.selected ? '#fff' : '#333'}
                                                    ]}>{name}</Text>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[
                                                        styles.adDesc,
                                                        {color: rowData.selected ? '#fff' : '#999'}
                                                    ]}>{content}
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
    qrCode: {
        position: 'absolute',
        right: (Dimensions.get('window').width * 2 / 3 - Dimensions.get('window').height) / 2,
        bottom: 0
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
        width: 150
    },
    adDesc: {
        fontSize: 15,
        width: 180,
        height: 50,
        lineHeight: 26
    }
})

const mapStateToProps = state => ({
    data: state.nav.data
})

export default connect(mapStateToProps)(AllowanceScreen)
