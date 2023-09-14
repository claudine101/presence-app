import React, { useRef, useState, useEffect } from 'react'
import { ImageBackground, ScrollView, StyleSheet, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions, StatusBar } from "react-native";
import { TextField, FilledTextField, InputAdornment, OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import fetchApi from "../../helpers/fetchApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUserAction } from "../../store/actions/userActions"
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import registerPushNotification from '../../helpers/registerPushNotification';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';


export default function ConnexionScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { height } = useWindowDimensions()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef(null)
  const token = useSelector(notificationTokenSelector)
  const [data, handleChange, setValue] = useForm({
    email: "",
    password: "",
  })
  const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      length: [8]
    }
  }, {
    email: {
      required: "L'email est obligatoire",

      email: "Email invalide"
    },
    password: {
      required: "Le mot de passe est obligatoire",
      length: "Mot de passe trop court"
    }
  })

  const [additioanalErrors, setAdditionalErrors] = useState({})

  const handleLogin = async () => {
    const user = {
      email: data.email,
      password: data.password,
      PUSH_NOTIFICATION_TOKEN: token,
      DEVICE: Platform.OS === 'ios' ? 1 : 0

    }
    try {
      setLoading(true)
      setAdditionalErrors({})
      const userData = await fetchApi("/auth/users/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });
      await AsyncStorage.setItem("user", JSON.stringify(userData.result));
      dispatch(setUserAction(userData.result))
    }

    catch (error) {
      console.log(error)
      if (error.httpStatus == "NOT_FOUND") {
        setAdditionalErrors(error.result)
      } else {
        setAdditionalErrors({ main: ["Erreur inconnue, réessayer plus tard"] })
      }
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <>
      {loading && <Loading />}
      <ScrollView keyboardShouldPersistTaps='handled'>
          <View style={styles.container}>
            <Image source={require('../../../assets/images/archivage_collage.png')} style={{...styles.image, resizeMode:"center"}}/>
          
              <Text style={styles.title}>Connexion</Text>

            <View style={styles.inputCard}>
              <View>
                <OutlinedTextField
                  label="Adresse email"
                  fontSize={14}
                  baseColor={COLORS.smallBrown}
                  tintColor={COLORS.primary}
                  containerStyle={{ borderRadius: 20 }}
                  lineWidth={1}
                  activeLineWidth={1}
                  errorColor={COLORS.error}
                  renderRightAccessory={() => <Fontisto name="email" size={20} color={hasError('email') ? COLORS.error : "#a2a2a2"} />}
                  value={data.email}
                  onChangeText={(newValue) => handleChange('email', newValue)}
                  onBlur={() => checkFieldData('email')}
                  error={hasError('email') ? getError('email') : ''}
                  onSubmitEditing={() => {
                    passwordInputRef.current.focus()
                  }}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>

            </View>
            <View style={[styles.inputCard, { marginTop: 20 }]}>
              <View>
                <OutlinedTextField
                  label="Mot de passe"
                  fontSize={14}
                  baseColor={COLORS.smallBrown}
                  tintColor={COLORS.primary}
                  secureTextEntry={!showPassword}
                  lineWidth={1}
                  activeLineWidth={1}
                  errorColor={COLORS.error}
                  renderRightAccessory={() => <Ionicons name={!showPassword ? "eye-off-outline" : "eye-outline"} size={25} color={hasError('password') ? COLORS.error : "#a2a2a2"}
                    onPress={() => setShowPassword(t => !t)} />}
                  value={data.password}
                  onChangeText={(newValue) => handleChange('password', newValue)}
                  onBlur={() => checkFieldData('password')}
                  error={hasError('password') ? getError('password') : ''}
                  ref={passwordInputRef}
                  onSubmitEditing={() => {
                    // password_confirmInputRef.current.focus()
                  }}
          //         autoCompleteType='off'
          //         returnKeyType="next"
          //         blurOnSubmit={false}
                />
              </View>

            </View>

            <TouchableWithoutFeedback
              disabled={!isValidate()}
              onPress={handleLogin} >
              <View style={[styles.button,!isValidate() && { opacity: 0.5 }]}>
                <Text style={styles.buttonText}>Se connecter</Text>
              </View>
            </TouchableWithoutFeedback>

            {additioanalErrors.main && <View>
              <View style={styles.button2}>
                <View style={{ marginLeft: 10 }}>
                  <AntDesign name="closecircleo" size={24} color="white" />
                </View>
                <View style={{ marginLeft: 10 }}>
                  {errors && <Text style={styles.buttonText}>{additioanalErrors.main[0]} </Text>}
                </View>

              </View>
            </View>}
          </View>
          </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  inputCard: {
    marginHorizontal: 20,
    marginTop: 10
  },
  button: {
    // marginTop: 10,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginVertical:30
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
  button2: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: "#D24646",
    marginHorizontal: 40,
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
  },

  container: {
    flex: 1,
  },
  image:{
    maxWidth: '80%',
    alignSelf: 'center',
    height: 200,
},
title: {
  fontSize: 25,
  fontWeight: 'bold',
  marginVertical: 25,
  opacity: 0.8,
  color:COLORS.primary,
  paddingHorizontal: 20
},
cardTitle: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
},
})