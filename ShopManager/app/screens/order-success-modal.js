import React from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'

export default class OrderSuccessModal extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        visible={this.props.parent.state.orderSuccessModalVisible}
        onRequestClose={() => {this.props.parent.setState({orderSuccessModalVisible: !this.props.parent.state.orderSuccessModalVisible})}}>
        <View style={styles.container}>
          <View style={styles.background}/>
          <View style={styles.outerContainer}>
            <TouchableWithoutFeedback
              onPress={() => { this.props.parent.hideOrderSuccessModal() }}>
              <Image
                style={styles.closeImage}
                source={require('../resources/close-modal.png')}/>
            </TouchableWithoutFeedback>
            <View style={styles.content}>
              <Image
                style={styles.successIcon}
                source={require('../resources/order-success.png')}/>
              <Image
                style={styles.successHint}
                source={require('../resources/order-success-hint.png')}/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  closeImage: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 0,
    zIndex: 1
  },
  outerContainer: {
    width: Dimensions.get('window').width - 296
  },
  content: {
    backgroundColor: '#fff',
    width: Dimensions.get('window').width - 326,
    height: Dimensions.get('window').height - 160,
    borderRadius: 4,
    marginTop: 15,
    alignSelf: 'center',
    zIndex: 0
  },
  successIcon: {
    width: 34,
    height: 34,
    alignSelf: 'center',
    marginTop: 56
  },
  successHint: {
    width: 165,
    height: 15,
    alignSelf: 'center',
    marginTop: 33
  }
})
