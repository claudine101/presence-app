import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { EvilIcons} from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useCallback } from 'react';
 import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import * as Location from 'expo-location';


/**
 * Screen pour  affectation d'un utilisateur  sur  un  courrier
 * @author NDAYISABA Claudine <claudine@mediabox.bi>
 * @date 05/05/2023 à 20:44
 * @returns 
 */

export default function TransferScreen() {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    
    const route = useRoute()
    const { selectedAffect,inAffect,inEdit,courrier}=route.params
    const user = useSelector(userSelector)
    const [data, handleChange, setValue] = useForm({
        commentaire: null,
        societe: null,
    })
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        societe: {
            required: true
        }
       }, {
        societe: {
            required: 'ce champ est obligatoire',

        },
        
    })
    const isValid = () => {
        return isValidate() 
    }
    const utilisateurselect = () => {
        navigation.navigate('DriverScreen', {
            societe: data.societe,
            courrier:courrier,
            previousRouteName: "TransferScreen"
        })

    }

    useEffect(() => {
        const { societe } = route.params || {}
        if (societe) {
            handleChange("societe", societe)
        }
    }, [route])
    const enregistrement = async () => {

        try {
            setLoading(true)
            const form = new FormData()
            form.append('TRANSMISSION_ID',courrier.TRANSMISSION_ID)
            form.append('chauffeur',data.societe.USERS_ID)
            form.append('USERS_ID', user.USERS_ID)
            const res = await fetchApi(`/courrier/courrier_entrants/transfer`, {
                method: 'POST',
                body: form
            })
            navigation.navigate("Root")
            ToastAndroid.show('affectation effectué avec succès!', ToastAndroid.LONG);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }


    }
    return (
        <>
            {loading && <Loading />}
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: StatusBar.currentHeight }}>
                    <TouchableNativeFeedback
                        style={{}}
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={{ padding: 10 }}>
                            <Ionicons name="arrow-back-sharp" size={24} color={COLORS.primary} />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.Title}>Transfer un courrier</Text>
                </View>

                    <View>
                    <View style={styles.inputCard}>
                            <TouchableOpacity style={styles.selectContainer} onPress={utilisateurselect}>
                                <View style={{}}>
                                    <Text style={[styles.selectLabel]}>
                                        Séléctionner un chauffeur
                                    </Text>
                                    <View style={{}}>
                                    {data.societe ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                        {data.societe.NOM} {data.societe.PRENOM} 
                                    </Text> : null}
                                </View>
                                </View>
                                <EvilIcons name="chevron-down" size={30} color="#777" />
                            </TouchableOpacity> 

                        </View>
                    </View>
                <TouchableWithoutFeedback
                    disabled={!isValid()}
                    onPress={enregistrement}>
                    <View style={[styles.button, !isValid() && { opacity: 0.5 }]}>
                        <Text style={styles.buttonText}>Enregistrer</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    icon: {
        marginLeft: 2
    },
    iconDebutName: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center'
    },
    datePickerButton: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#f1f1f1',
        marginTop: 10,
        borderRadius: 5,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    text: {
        fontSize: 14,
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 15,
        padding: 20
    },

    addImager: {
        width: 360,
        height: 55,
        backgroundColor: '#F1F1F1',
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 3,
    },
    images: {
        flexDirection: "row"
    },
    sectionTitle: {
        fontSize: 13
    },
    selectControl: {
        paddingHorizontal: 0
    },
    selectLabel: {
        color: '#777',
        fontSize: 13
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 10,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10
    },
    buttonRemettant: {
        borderWidth: 2,
        marginTop: 7,
        width: 370,
        height: 50,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'gray',
        textAlign: 'center',
        color: 'white'
    },
    radio: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 190,
        height: 50,
        marginLeft: 200,
        padding: 10,
        marginTop: -32,

    },
    Title: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        color:COLORS.primary
    },
    description: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1D8585"
    },
    cardTitle: {
        flexDirection: "row",
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
        marginVertical: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primary,
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
    },
    radioBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3
    },
    radioLabel: {
        marginLeft: 5
    }
})