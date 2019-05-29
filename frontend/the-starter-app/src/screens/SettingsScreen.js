import * as React from "react";
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  View,
  Text
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import FormTextInput from "../components/FormTextInput";
import Button from "../components/Button";
import colors from "../config/colors";
import createStackNavigator from "react-navigation";

class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      errorMsg: "",
    };
  }

  validateLogin(min, max)
  {
    if(this.state.confirmPassword != this.state.password) {
      this.setState({
        errorMsg:"The passwords don't match"
      })
      return false;
    }

    if(this.state.password.length < min || this.state.password.length > max) {
      this.setState({
        errorMsg:"Password must be " + min + " to " + max + " characters long"
      })
      return false;
    }
    else if(!this.state.password.match(/^[a-zA-Z0-9]+$/i)) {
      this.setState({
        errorMsg: "Password must be alphanumeric"
      })
      return false;
    }
    return true
  }

  handleOldPassword = oldPassword => this.setState({ oldPassword });
  handleNewPassword = newPassword => this.setState({ newPassword });
  handleConfirmNewPassword = confirmNewPassword => this.setState({ confirmNewPassword });

  handleChangePassword = () =>{
    if(!this.validateLogin(5,20))
    return;
  }

  render() {


    const { navigation } = this.props;

    return (
    //  <KeyboardAvoidingView style={styles.container} behavior="padding">

      <View style={styles.container}>
      <Image
      style={styles.bgImage}
      source={require("../assets/images/background4.png")}
      />

      <View style = {styles.form}>

      <FormTextInput
      placeholder="Old Password"
      returnKeyType="next"
      />

      <FormTextInput
      placeholder="New Password"
      returnKeyType="next"
      />

      <FormTextInput
      placeholder="Confirm New Password"
      returnKeyType="next"
      />

      <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>


      </View>

      <View style={styles.buttonSection}>
      <Button
      //Verificar a password antiga
      //Se estiver correta verifica se as novas são iguais
      //Se estiver certo, pedir para substituir na db
      style={styles.button}
      label="Change Password"
      onPress={this.handleChangePassword}
      />

      </View>

      <View style={styles.buttonLogoutSection}>
      <Button
      //Verificar a password antiga
      //Se estiver correta verifica se as novas são iguais
      //Se estiver certo, pedir para substituir na db
      style={styles.buttonLogout}
      label="Logout"
      onPress={() => navigation.navigate("Login")}
      />
      </View>
      </View>

      //</KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  errorMsg: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  bgImage: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    opacity: 0.4
  },

  button: {
    backgroundColor: colors.GREEN2,

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19
  },

  buttonLogout: {
    backgroundColor: "#e31818",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19
  },

  buttonSection: {
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
    marginBottom: "27%"
  },

  buttonLogoutSection: {
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
    //  marginBottom: "5%"
  },

  form: {
    flex: 5,
    marginTop: "5%",
    marginLeft: "10%",
    width: "80%"
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textAlignVertical: "center"
  },

  card: {
    marginVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.4,
    opacity: 0.97,
    flex: 1,
    alignItems: "center"
  },

  FABContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  }
});

export default SettingsScreen;
