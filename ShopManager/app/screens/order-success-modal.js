import React from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  View
} from 'react-native'

export default class OrderSuccessModal extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: true
    }
  }

  render() {
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {this.setState({modalVisible: !this.state.modalVisible})}}>
        <View style={styles.container}>
          <View style={styles.background}/>
          <View style={styles.content}>
            <Image
              style={styles.successIcon}
              source={require('../resources/order-success.png')}/>
            <Image
              style={styles.successHint}
              source={require('../resources/order-success-hint.png')}/>
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
  content: {
    backgroundColor: '#fff',
    width: Dimensions.get('window').width - 326,
    height: Dimensions.get('window').height - 160,
    borderRadius: 4
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
