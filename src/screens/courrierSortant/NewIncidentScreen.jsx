import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput, ToastAndroid } from "react-native";
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
import * as Location from 'expo-location';


/**
 * Screen pour l'enregistrement du incident
 * @author NDAYISABA Claudine<claudine@mediabox.bi>
 * @date 10/05/2023 à 11:59
 * @returns 
 */

export default function NewIncidentScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const [loadingCoords, setLoadingCoords] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const prenomInputRef = useRef(null)
    const token = useSelector(notificationTokenSelector)
    const route = useRoute()
    const { newIncident, previousRouteName ,courrier} = route.params
    const handleBackPress = () => {
        navigation.goBack()
    }
    const [data, handleChange, setValue] = useForm({
        descriptionincident: "",
    })
    useEffect(() => {
        if (newIncident && newIncident.DESCRIPTION) {
            handleChange("descriptionincident", newIncident.DESCRIPTION)
        }
    }, [newIncident])
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        descriptionincident: {
            required: true,
            length: [1, 50]
        }
    }, {
        descriptionincident: {
            required: 'Ce champ est obligatoire',
            length: "Description est invalide"
        }
    })
    /**
     * fonction utilise pour recupere les coordonnes
     * @author NDAYISABA  claudine <claudine@mediabox.bi>
     * @date 08/05/2023 à 10:07
     */
    useEffect(() => {
        (async () => {
            try {
                setLoadingCoords(true)
                let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
                if (locationStatus !== 'granted') {
                    return setLoading(false)
                }
                var loc = await Location.getCurrentPositionAsync({});
                setLatitude(loc.coords.latitude)
                setLongitude(loc.coords.longitude)
            }
            catch (error) {
                console.log(error)
            } finally {
                setLoadingCoords(false)
            }
        }
        )()

    }, []);
    const isValid = () => {
        var isValiCoords = false
        isValiCoords = !loadingCoords ? true : false
        return isValidate() && isValiCoords
    }
    const enregistrement = async () => {
        try {
            setLoading(true)
            const form = new FormData()
            form.append('TRANSMISSION_ID', courrier.TRANSMISSION_ID)
            form.append('descriptionincident', data.descriptionincident)
            form.append('latitude', latitude)
            form.append('longitude', longitude)
            const res = await fetchApi(`/signale/nouveau`, {
                method: 'POST',
                body: form
            })
            navigation.navigate("Root")
            ToastAndroid.show('Signalement effectué avec succès!', ToastAndroid.LONG);
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

                <View style={styles.header}>
                    <View style={styles.exiitSearch}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleBackPress}>
                            <View style={styles.headerBtn}>
                                <Ionicons name="arrow-back-outline" size={24} color="#777" />
                            </View>
                        </TouchableNativeFeedback>
                        <View style={styles.cardTitle}>
                            <Text style={styles.Title}>Nouveau incident</Text>
                        </View>
                    </View>

                </View>

                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Nouveau incident"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.descriptionincident}
                                    onChangeText={(newValue) => handleChange('descriptionincident', newValue)}
                                    onBlur={() => checkFieldData('descriptionincident')}
                                    error={hasError('descriptionincident') ? getError('descriptionincident') : ''}
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
                        <TouchableWithoutFeedback
                            disabled={!isValid()}
                            onPress={enregistrement}>
                            <View style={[styles.button, !isValid() && { opacity: 0.5 }]}>
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
        fontWeight: "bold"
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
    }
})