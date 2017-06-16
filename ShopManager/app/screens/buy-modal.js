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

export default BuyModal = ({ navigation }) => (
  <View>
    <Modal 
    animationType={"slide"}
    transparent={true}
    visible={true}
    onRequestClose={() => {alert("Modal has been closed.")}}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.topTitle} numberOfLines={1} >广告名称</Text>
          <View style={styles.line}></View>
          <Text>广告描述 广告描述 广告描述 广告描述 广告描述广告描述广告描述 广告描述 广告描述 广告描述</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLeftText}>单价:</Text>
            <TextInput style={styles.inputText}> 1212</TextInput>
          </View>
          <View style={styles.countContainer}>
            <Text style={styles.countLeftText}>购买数量:</Text>
            <TextInput style={styles.inputText}> 1212</TextInput>
            <Text style={styles.countRightText}>合计:</Text>
            <Text style={styles.countTotalText}>1233</Text>
          </View>
          <TouchableNativeFeedback onPress={() => {
              alert("Modal need to close.")
            }}>
            <Text style={styles.confirmButton}>确定</Text>
          </TouchableNativeFeedback>
        </View>
      </View>
    </Modal>
  </View>
);


// BuyModal.navigationOptions = {
//   header: null
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    width:200,
    borderRadius: 10,
    alignItems: 'stretch',
    backgroundColor: 'white',
    padding: 10,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(88, 88, 88, 255)',
  },
  topTitle: {
    alignItems: 'stretch',
    textAlign: 'left',
    // backgroundColor: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  inputLeftText: {
    
  },
  inputText: {
    color: 'rgba(88, 88, 88, 255)',
    fontSize: 14,
    padding: 0,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countLeftText: {
    
  },
  inputText: {
    color: 'rgba(88, 88, 88, 255)',
    fontSize: 14,
    padding: 0,
  },
  countRightText: {
    paddingLeft: 10,
  },
  countTotalText: {
    color: 'rgba(88, 88, 88, 255)',
    fontSize: 14,
  },

  space1: {
    marginTop: 30
  },
  inputTitle: {
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
  confirmButton: {
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
});
