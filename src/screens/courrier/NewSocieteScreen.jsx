import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback,TouchableNativeFeedback, TextInput } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons,AntDesign ,Entypo,Ionicons } from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation ,useRoute} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../../store/actions/userActions"
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';
import { useEffect } from 'react';

/**
 * Screen pour l'enregistrement du societe
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 28/04/2023
 * @returns 
 */

export default function NewSocieteScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
   
    const prenomInputRef = useRef(null)
    const emailInputRef = useRef(null)
    const adresseInputRef = useRef(null)
    const telephoneInputRef = useRef(null)
    const rcInputRef = useRef(null)
    const nifInputRef = useRef(null)
    const token = useSelector(notificationTokenSelector)

    const route = useRoute()

    const{newSociete,previousRouteName}=route.params
    // console.log(route.params)

    // const previousRouteName = navigation.getState().routes[navigation.getState().index - 2].name

   
    const handleBackPress = () => {
        navigation.goBack()
}
    const [data, handleChange, setValue] = useForm({
        descriptionsociete: "",
        email:"",
        telephone:"",
        nif:"",
        rc:"",
        adresse:""
        
    })

    useEffect (()=>{
      if(newSociete&&newSociete.DESCRIPTION){
        handleChange("descriptionsociete",newSociete.DESCRIPTION)
      }
      if(newSociete&&newSociete.EMAIL){
        handleChange("email",newSociete.EMAIL)
      }
      if(newSociete&&newSociete.TELEPHONE){
        handleChange("telephone",newSociete.TELEPHONE)
      }
      if(newSociete&&newSociete.NIF){
        handleChange("nif",newSociete.NIF)
      }
      if(newSociete&&newSociete.RC){
        handleChange("rc",newSociete.RC)
      }
      if(newSociete&&newSociete.ADRESSE){
        handleChange("adresse",newSociete.ADRESSE)
      }
    }, [newSociete])
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        descriptionsociete: {
            required: true,
            length: [1, 50]
        },
        email: {
            required: true,
            length: [1, 50]
        },
        telephone: {
            required: true,
            length: [1, 8]
        },
        // nif: {
        //     required: true,
        //     length: [1, 50]
        // },
        // rc: {
        //     required: true,
        //     length: [1, 50]
        // },
        adresse: {
            required: true,
            length: [1, 255]
        }
    }, {
        descriptionsociete: {
            required: 'Ce champ est obligatoire',
            length: "Nom de la socièté est invalide"
        },
        email: {
            required: 'Ce champ est obligatoire',
            length: "L'eamil est invalide"
        },
        telephone: {
            required: 'Ce champ est obligatoire',
            length: "Ce numéro  ne doit pas dépasser  huit chiffres"
        },
        // nif: {
        //     required: 'Ce champ est obligatoire',
           
        // },
        // rc: {
        //     required: 'Ce champ est obligatoire',
           
        // },
        adresse: {
            required: 'Ce champ est obligatoire',
            
        }
    })

    const enregistrement = async () => {
        setLoading(true)
        navigation.navigate(previousRouteName,{
            ...route.params,
            societe:{
                ID_SOCIETE:"new",
                DESCRIPTION:data.descriptionsociete,
                EMAIL:data.email,
                TELEPHONE:data.telephone,
                ADRESSE:data.adresse,
                NIF:data.nif,
                RC:data.rc,
            },
        })
      
    }

    return (
        <>
            {loading && <Loading />}
            <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.exiitSearch}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleBackPress}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="arrow-back-outline" size={24} color={COLORS.primary} />
                        </View>
                    </TouchableNativeFeedback>
                    <View style={styles.cardTitle}>
                            <Text style={styles.Title}>Nouvelle Socièté</Text>
                        </View>
                </View>
                
            </View>

                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Nouvelle Socièté"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.descriptionsociete}
                                    onChangeText={(newValue) => handleChange('descriptionsociete', newValue)}
                                    onBlur={() => checkFieldData('descriptionsociete')}
                                    error={hasError('descriptionsociete') ? getError('descriptionsociete') : ''}
                                    ref={prenomInputRef}
                                    onSubmitEditing={() => {
                                        prenomInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Email"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.email}
                                    onChangeText={(newValue) => handleChange('email', newValue)}
                                    onBlur={() => checkFieldData('email')}
                                    error={hasError('email') ? getError('email') : ''}
                                    ref={emailInputRef}
                                    onSubmitEditing={() => {
                                        emailInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    keyboardType='email-address'
                                />
                            </View>

                        </View>

                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Téléphone"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    keyboardType='number-pad'
                                    value={data.telephone}
                                    onChangeText={(newValue) => handleChange('telephone', newValue)}
                                    onBlur={() => checkFieldData('telephone')}
                                    error={hasError('telephone') ? getError('telephone') : ''}
                                    ref={telephoneInputRef}
                                    onSubmitEditing={() => {
                                        telephoneInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>

                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Adresse"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.adresse}
                                    onChangeText={(newValue) => handleChange('adresse', newValue)}
                                    onBlur={() => checkFieldData('adresse')}
                                    error={hasError('adresse') ? getError('adresse') : ''}
                                    ref={adresseInputRef}
                                    onSubmitEditing={() => {
                                        adresseInputRef.current.focus()
                                    }}

                                
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>

                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="NIF"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.nif}
                                    onChangeText={(newValue) => handleChange('nif', newValue)}
                                    onBlur={() => checkFieldData('nif')}
                                    error={hasError('nif') ? getError('nif') : ''}
                                    ref={nifInputRef}
                                    onSubmitEditing={() => {
                                        nifInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="RC"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.rc}
                                    onChangeText={(newValue) => handleChange('rc', newValue)}
                                    onBlur={() => checkFieldData('rc')}
                                    error={hasError('rc') ? getError('rc') : ''}
                                    ref={rcInputRef}
                                    onSubmitEditing={() => {
                                        rcInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>
                        <TouchableWithoutFeedback
                            disabled={!isValidate()}
                            onPress={enregistrement}>
                            <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    exiitSearch: {
        flexDirection: "row",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    headerBtn: {
        padding: 10,
        borderRadius: 20
    },
    selectLabel: {
        color: '#777',
        fontSize: 13
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 2,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 7
    },
    Title: {
        fontSize: 18,
        fontWeight: "bold",
        color:COLORS.primary
    },
    description: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1D8585"
    },
    cardTitle: {
        flexDirection: "row",
        marginTop: 30,
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    inputCard: {
        marginHorizontal: 20,
        marginTop: 10
    },
    InputIcon: {
        position: "absolute",
        right: 15,
        marginTop: 15
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor:"#18678E",
        marginHorizontal: 20
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        // textTransform:"uppercase",
        fontSize: 16,
        textAlign: "center"
    },
    cardButton: {
        marginBottom: 20,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 118
    },
    container: {
        flex: 1,
    },
    errorss: {
        fontSize: 12,
        color: "red"
    }
})