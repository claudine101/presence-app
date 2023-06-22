import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TextInput, TouchableNativeFeedback } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../../store/actions/userActions"
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';
import { useEffect } from 'react';
import { useCallback } from 'react';

/**
 * Screen pour l'enregistrement du remettant
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 27/04/2023
 * @returns 
 */

export default function NewRemettantScreen() {
    
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const nomInputRef = useRef(null)
    const prenomInputRef = useRef(null)
    const emailInputRef = useRef(null)
    const telephoneInputRef = useRef(null)
    const adresseInputRef = useRef(null)
    const token = useSelector(notificationTokenSelector)
    const route=useRoute()
    const handleBackPress = () => {
        navigation.goBack()
    }

    const{newRemettant,returnkey,newexpediteur,courrier,inEdit}=route.params
    

    const [data, handleChange, setValue] = useForm({
        nom: "",
        prenom: "",
        email: "",
        telephone:"",
        adresse:"",
        societe:null
    })

    useEffect (()=>{
        if(returnkey=="remettant"){
        if(newRemettant&&newRemettant.NOM){
          handleChange("nom",newRemettant.NOM)
        }
        if(newRemettant&&newRemettant.PRENOM){
            handleChange("prenom",newRemettant.PRENOM) 
          }

          if(newRemettant&&newRemettant.EMAIL){
            handleChange("email",newRemettant.EMAIL) 
          }
          if(newRemettant&&newRemettant.TELEPHONE){
            handleChange("telephone",newRemettant.TELEPHONE) 
          }

          if(newRemettant&&newRemettant.ADRESSE){
            handleChange("adresse",newRemettant.ADRESSE) 
          }
          if(newRemettant&&newRemettant.ID_SOCIETE){
            handleChange("societe",newRemettant.ID_SOCIETE) 
          }
        }
      }, [newRemettant,returnkey])

      useEffect (()=>{
        if(returnkey=="expediteur"){
        if(newexpediteur&&newexpediteur.NOM){
          handleChange("nom",newexpediteur.NOM)
        }
        if(newexpediteur&&newexpediteur.PRENOM){
            handleChange("prenom",newexpediteur.PRENOM) 
          }

          if(newexpediteur&&newexpediteur.EMAIL){
            handleChange("email",newexpediteur.EMAIL) 
          }
          if(newexpediteur&&newexpediteur.TELEPHONE){
            handleChange("telephone",newexpediteur.TELEPHONE) 
          }

          if(newexpediteur&&newexpediteur.ADRESSE){
            handleChange("adresse",newexpediteur.ADRESSE) 
          }
          if(newexpediteur&&newexpediteur.ID_SOCIETE){
            handleChange("societe",newexpediteur.ID_SOCIETE) 
          }

        }
      }, [newexpediteur,returnkey])


    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        nom: {
            required: true,
            length: [1, 50]
        },
        prenom: {
            required: true,
            length: [1, 50]
        },
        email: {
            required: true,
            email: true
        },
        telephone: {
            required: true,
            length: [8]
        },
        adresse: {
            required: true,
            length: [1-60]
        },
        societe: {
            required: true,
            
        }
    }, {
        nom: {
            required: 'Le nom est obligatoire',
            length: "Nom invalide"
        },
        prenom: {
            required: 'Le prénom est obligatoire',
            length: "Prénom invalide"
        },
        email: {
            required: "L'email est obligatoire",
            email: "Email invalide"
        },
        telephone: {
            required: "Le telephone est obligatoire",
            length: "Le telephone  est invalide"
        },
        adresse: {
            required: "Ce champ est obligatoire",
           
        },
        societe: {
            required: "Ce champ est obligatoire",
           
        }
    })


    const previousRouteName = navigation.getState().routes[navigation.getState().index - 1].name
    const societeselect = () => {
        navigation.navigate('SocieteScreen',{
            ...route.params,
            societe:data.societe,
            previousRouteName:"NewRemettantScreen"
        })
       
    }
    useEffect(() => {
       const {societe}=route.params || {}
    //    console.log(route.params)
       if (societe){
        handleChange("societe",societe)
       }
    }, [route ])



    const enregistrement = () => {
        // return console.log(route.params)
       
        inEdit ?
        navigation.navigate("UpdateCourrierScreen",{
            [returnkey]:{
                ID_REMETTANT:"new",
                NOM:data.nom,
                PRENOM:data.prenom,
                EMAIL:data.email,
                TELEPHONE:data.telephone,
                ADRESSE:data.adresse,
                ID_SOCIETE:data.societe,
            },
            courrier:courrier,
            inEdit:inEdit
        }): navigation.navigate("CourrierScreen",{
            [returnkey]:{
                ID_REMETTANT:"new",
                NOM:data.nom,
                PRENOM:data.prenom,
                EMAIL:data.email,
                TELEPHONE:data.telephone,
                ADRESSE:data.adresse,
                ID_SOCIETE:data.societe,
                courrier:courrier
            }
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

                        {returnkey=="expediteur"?<View style={styles.headerBtn}>
                            <Text style={styles.Title}>Nouveau éxpediteur</Text>
                        </View>:
                        <View style={styles.headerBtn}>
                            <Text style={styles.Title}>Nouveau remettant</Text>
                        </View>}
                    </View>

                </View>

                <ScrollView keyboardShouldPersistTaps="handled" >
                    <View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Nom"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('nom') ? COLORS.error : "#a2a2a2"} />}
                                    value={data.nom}
                                    onChangeText={(newValue) => handleChange('nom', newValue)}
                                    onBlur={() => checkFieldData('nom')}
                                    error={hasError('nom') ? getError('nom') : ''}
                                    ref={nomInputRef}
                                    onSubmitEditing={() => {
                                        nomInputRef.current.focus()
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
                                    label="Prénom"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('prenom') ? COLORS.error : "#a2a2a2"} />}
                                    value={data.prenom}
                                    onChangeText={(newValue) => handleChange('prenom', newValue)}
                                    onBlur={() => checkFieldData('prenom')}
                                    error={hasError('prenom') ? getError('prenom') : ''}
                                    ref={prenomInputRef}
                                    onSubmitEditing={() => {
                                        emailInputRef.current.focus()
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
                                    label="Téléphone"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    keyboardType='number-pad'
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <AntDesign name="phone" size={20} color={hasError('telephone') ? COLORS.error : "#a2a2a2"} />}
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
                                    label="Adresse email"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <Fontisto name="email" size={20} color={hasError('email') ? COLORS.error : "#a2a2a2"} />}
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
                                    label="Adresse "
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <Entypo name="address" size={20} color={hasError('adresse') ? COLORS.error : "#a2a2a2"} />}
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
                            <TouchableOpacity style={styles.selectContainer}
                                onPress={societeselect}
                            >
                                <View style={{}}>
                                    <Text style={[styles.selectLabel]}>
                                        Sociète
                                    </Text>
                                    {data.societe ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                        {data.societe.DESCRIPTION}
                                    </Text> : null}
                                </View>
                                <EvilIcons name="chevron-down" size={30} color="#777" />
                            </TouchableOpacity>


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