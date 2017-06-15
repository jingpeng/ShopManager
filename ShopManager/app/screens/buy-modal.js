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
          <Text>广告名称</Text>
          <View style={styles.line}></View>
          <Text>广告描述 广告描述 广告描述 广告描述 广告描述广告描述广告描述 广告描述 广告描述 广告描述</Text>
          
         </View>
  <TouchableNativeFeedback onPress={() => {
          alert("Modal need to close.")
        }}>
          <Text>close Modal</Text>
        </TouchableNativeFeedback>
  </Modal>
  </View>
);


// BuyModal.navigationOptions = {
//   header: null
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:200,
    height:100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(181, 181, 181, 255)',
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(88, 88, 88, 255)',
    width:170,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 254,
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
});
