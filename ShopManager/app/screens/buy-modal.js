import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
  Dimensions
} from 'react-native';

export default class BuyModal extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      adTitle: props.adTitle,
      adDescription: props.adDescription,
      adPrice: props.adPrice,
      adBuyCount: 1,
    }
  }
  componentWillReceiveProps(props){
    this.setState({
      adTitle: props.adTitle,
      adDescription: props.adDescription,
      adPrice: props.adPrice,
      adBuyCount: 1,
    });
  }

  render() {
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        visible={this.props.parent.state.modalVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={styles.topTitle} numberOfLines={1} >{this.state.adTitle}</Text>
            <View style={styles.line}/>
            <Text style={styles.descTitle} >{this.state.adDescription}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLeftText}>单价: </Text>
              <Text style={styles.priceText}>{this.state.adPrice}</Text>
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countLeftText}>购买数量: </Text>
              <View style={styles.countInputContainer}>
                <TouchableNativeFeedback onPress={this.onMinuesButtonPress.bind(this)}>
                  <View style={styles.changeNumButton}><Text style={styles.changeNumText}>-</Text></View>
                </TouchableNativeFeedback>
                <Text style={styles.inputCount}> {this.state.adBuyCount}</Text>
                <TouchableNativeFeedback onPress={this.onAddButtonPress.bind(this)}>
                  <View style={styles.changeNumButton}><Text style={styles.changeNumText}>+</Text></View>
                </TouchableNativeFeedback>
              </View>
              <Text style={styles.countRightText}>合计: </Text>
              <Text style={styles.countTotalText}>{this.state.adPrice*this.state.adBuyCount}</Text>
            </View>
            <View style={styles.confirmContainer}>
              <TouchableNativeFeedback onPress={this.onConfrimButtonPress.bind(this)}>
                <View style={styles.confirmButton}>
                  <Text style={styles.confirmText}>确定</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  onMinuesButtonPress(){
    if (this.state.adBuyCount>1) {
      this.setState({adBuyCount: this.state.adBuyCount-1})
    }
  }

  onAddButtonPress(){
    this.setState({adBuyCount: this.state.adBuyCount+1})
  }

  onConfrimButtonPress(){
    this.props.parent.setState({modalVisible: false})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    width: Dimensions.get('window').width - 326,
    borderRadius: 10,
    alignItems: 'stretch',
    backgroundColor: 'white',
    padding: 10,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(181, 181, 181, 255)',
  },
  topTitle: {
    alignItems: 'stretch',
    textAlign: 'left',
    color: '#333',
    padding: 15,
    fontSize: 12,
    // backgroundColor: 'red',
  },
  descTitle: {
    color: '#666',
    padding: 15,
    fontSize: 10,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 5,
  },
  priceLeftText: {
    color: '#333',
    fontSize: 12,
  },
  priceText: {
    color: 'rgba(88, 88, 88, 255)',
    fontSize: 12,
    padding: 0,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 15,
  },
  countLeftText: {
    color: '#666',
    fontSize: 12,
  },
  priceText: {
    color: 'rgba(233, 84, 18, 255)',
    fontSize: 12,
    padding: 0,
  },
  countRightText: {
    color: '#333',
    fontSize: 12,
    paddingLeft: 10,
  },
  countInputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    alignItems: 'stretch',
    marginLeft: 5,
  },
  inputCount: {
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: 40,
    color: '#333',
  },
  countTotalText: {
    color: 'rgba(233, 84, 18, 255)',
    fontSize: 12,
  },
  changeNumButton: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  changeNumText: {
    color: '#333',
  },
  confirmContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  confirmButton: {
    height: 30,
    width: 80,
    backgroundColor: 'rgba(233, 84, 18, 255)',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 14
  }

});
