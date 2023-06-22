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
 * @date 09/06/2023 à 20:44
 * @returns 
 */

export default function ClasseurScreen() {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    
    const route = useRoute()
    const { selectedAffect,inAffect,inEdit,courrier}=route.params
    const user = useSelector(userSelector)
    const [data, handleChange, setValue] = useForm({
        numeroClasseur: null,
        departemant: null,
    })
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        departemant: {
            required: true
        },
        numeroClasseur: {
            required: true
        }
       }, 
       {
        departemant: {
            required: 'ce champ est obligatoire',
        },
        numeroClasseur: {
            required: 'ce champ est obligatoire',
        },
        
    })
    const isValid = () => {
        return isValidate() 
    }
    const departemantselect = () => {
        navigation.navigate('DepartemantScreen', {
            departemant: data.departemant,
            courrier:courrier,
            previousRouteName: "ClasseurScreen",
            societe:user
        })

    }

    useEffect(() => {
        const { departemant } = route.params || {}
        if (departemant) {
            handleChange("departemant", departemant)
        }
    }, [route])


    const numeroselect = () => {
        navigation.navigate('NumeroClasseurScreen', {
            numeroClasseur: data.numeroClasseur,
            courrier:courrier,
            previousRouteName: "ClasseurScreen",
            departemant:data.departemant
        })

    }
    useEffect(() => {
        const { numeroClasseur } = route.params || {}
        if (numeroClasseur) {
            handleChange("numeroClasseur", numeroClasseur)
        }
    }, [route])
    const enregistrement = async () => {

        try {
            setLoading(true)
            const form = new FormData()
            form.append('ID_COURRIER',courrier.ID_COURRIER_ENTRANT)
            form.append('departemant', JSON.stringify(data.departemant))
            form.append('numero',  JSON.stringify(data.numeroClasseur))
           
            const res = await fetchApi(`/courrier/courrier_entrants/classer`, {
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
                            <TouchableOpacity style={styles.selectContainer} onPress={departemantselect}>
                                <View style={{}}>
                                    <Text style={[styles.selectLabel]}>
                                        Séléctionner un departemant
                                    </Text>
                                    <View style={{}}>
                                    {data.departemant ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                        {data.departemant.DESCRIPTION}
                                    </Text> : null}
                                </View>
                                </View>
                                <EvilIcons name="chevron-down" size={30} color="#777" />
                            </TouchableOpacity> 

                        </View>
                        {data.departemant ?
                        <View style={styles.inputCard}>
                            <TouchableOpacity style={styles.selectContainer} onPress={numeroselect}>
                                <View style={{}}>
                                    <Text style={[styles.selectLabel]}>
                                        Séléctionner un numero classeur
                                    </Text>
                                    <View style={{}}>
                                    {data.numeroClasseur ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                        {data.numeroClasseur.NUMERO_CLASSEUR}
                                    </Text> : null}
                                </View>
                                </View>
                                <EvilIcons name="chevron-down" size={30} color="#777" />
                            </TouchableOpacity> 

                        </View>: null}
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