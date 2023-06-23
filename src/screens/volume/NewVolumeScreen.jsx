import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar, ToastAndroid, Alert } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { addVolumeAction } from '../../store/actions/volumeCartActions';
import { ecommerceCartReducer } from '../../store/reducers/ecommerceCartReducer';
import { ecommerceCartSelector } from '../../store/selectors/ecommerceCartSelectors';
import { removeVolumeAction } from '../../store/actions/ecommerceCartActions';

/**
 * Screen pour l'enregistrement volume
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 23/06/2023
 * @returns 
 */

export default function NewVolumeScreen() {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const route = useRoute()
    const dispatch = useDispatch()
    const products = useSelector(ecommerceCartSelector)

    const user = useSelector(userSelector)
    const showPicker = () => {
        setVisible(true)
    }
    const [data, handleChange, setValue] = useForm({
        nbre_volume: null,
        numero: null,
    })


    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        nbre_volume: {
            required: true,
            length: [1, 255]
        },
        numero: {
            required: true
        }
    }, {
        nbre_volume: {
            required: 'ce champ est obligatoire',
        },
        numero: {
            required: 'ce champ est obligatoire',

        }
    })
    const isValidAdd = () => {
        var isVali = false
        isVali = data.nbre_volume > 0 && data.numero ? true : false
        return isVali
    }
    const isValid = () => {
        // var isValiExpediteur = false

        // var isValiExpediteur = false
        // var isValidDestinateur = false
        // if (data.expediteurtpe == 1) {
        //     isValiExpediteur = data.expediteur ? true : false
        // } else if (data.expediteurtpe == 2) {
        //     isValiExpediteur = data.societe ? true : false
        // }
        // if (data.isconfidentiel == 1 && data.destinatairetpe == 2) {
        //     isValidDestinateur = data.selectedUser.length > 0
        // } else if (data.isconfidentiel == 1 && data.destinatairetpe == 1) {
        //     isValidDestinateur = data.departemant
        // }
        // else if (data.isconfidentiel == 0) {
        //     isValidDestinateur = data.isconfidentiel != null
        // }
        // return isValidate() && isValiExpediteur && isValidDestinateur
    }
    const onAddToCart = () => {

        dispatch(addVolumeAction({ ID_VOLUME: parseInt(data.nbre_volume)+ parseInt(products.length), NUMERO_VOLUME: data.numero }))
        handleChange("nbre_volume", data.nbre_volume - 1)
        handleChange("numero", "")
    }
    const enregistrement = async () => {

        try {
            setLoading(true)
            const form = new FormData()
            form.append('isconfidentiel', data.isconfidentiel.toString())
            form.append('remettant', JSON.stringify(data.remettant))
            form.append('typecourrier', JSON.stringify(data.typecourrier))
            // form.append('numero', data.numero)
            form.append('objet', data.objet)
            form.append('liencourrier', data.liencourrier)
            form.append('expediteurtpe', data.expediteurtpe)
            if (data.expediteurtpe == 1) {
                form.append('expediteur', JSON.stringify(data.expediteur))
            } else {
                form.append('societe', JSON.stringify(data.societe))
            }
            if (data.destinatairetpe == 1) {
                form.append('selectedDest', JSON.stringify(data.selectedDest))
                form.append('departemant', JSON.stringify(data.departemant))
            } else {
                form.append('selectedUser', JSON.stringify(data.selectedUser))
            }

            form.append('datereception', data.datereception.toString())
            form.append('signaturedate', data.signaturedate.toString())
            if (data.document) {
                let localUri = data.document.uri;
                let filename = localUri.split('/').pop();
                form.append("document", {
                    uri: data.document.uri, name: filename, type: data.document.mimeType
                })
            }
            const res = await fetchApi("/services/create", {
                method: 'POST',
                body: form
            })
            navigation.navigate("Root")
            ToastAndroid.show('Enregistrement effectué avec succès!', ToastAndroid.LONG);

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }


    }
    const onRemoveProduct = () => {
        Alert.alert("Enlever le produit", "Voulez-vous vraiment enlever ce produit du panier ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Oui", onPress: async () => {
                        dispatch(removeVolumeAction(product.ID_VOLUME))
                    }
                }
            ])
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
                    <Text style={styles.Title}>Planifier les volumes</Text>
                </View>
                <View>
                    <View style={styles.inputCard}>
                        <View>
                            <OutlinedTextField
                                label="Nombre de volume"
                                fontSize={14}
                                baseColor={COLORS.smallBrown}
                                tintColor={COLORS.primary}
                                containerStyle={{ borderRadius: 20 }}
                                lineWidth={1}
                                activeLineWidth={1}
                                errorColor={COLORS.error}
                                value={data.nbre_volume}
                                onChangeText={(newValue) => handleChange('nbre_volume', newValue)}
                                onBlur={() => checkFieldData('nbre_volume')}
                                error={hasError('nbre_volume') ? getError('nbre_volume') : ''}
                                // onSubmitEditing={() => {
                                //     objetInputRef.current.focus()
                                // }}
                                autoCompleteType='off'
                                // returnKeyType="next"
                                blurOnSubmit={false}
                            />
                        </View>
                    </View>
                    {data.nbre_volume > 0 ? <View style={styles.inputCard}>
                        <View>
                            <OutlinedTextField
                                label="Numero"
                                fontSize={14}
                                baseColor={COLORS.smallBrown}
                                tintColor={COLORS.primary}
                                containerStyle={{ borderRadius: 20 }}
                                lineWidth={1}
                                activeLineWidth={1}
                                errorColor={COLORS.error}
                                value={data.numero}
                                onChangeText={(newValue) => handleChange('numero', newValue)}
                                onBlur={() => checkFieldData('numero')}
                                error={hasError('numero') ? getError('numero') : ''}
                                // onSubmitEditing={() => {
                                //     objetInputRef.current.focus()
                                // }}
                                autoCompleteType='off'
                                // returnKeyType="next"
                                blurOnSubmit={false}
                            />
                        </View>
                    </View> : null}
                </View>
                {/* <Text style={styles.titlePrincipal}>Mon panier</Text> */}
                {/* <View style={{marginBottom:200 }}> */}
                <ScrollView>
                    {products.map((product, index) => {
                        return (
                            <View style={{marginHorizontal:20}}>
                            <View style={styles.headerRead}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' ,flex:1}}>
                                    <View style={{ maxWidth: 220 }} >
                                        <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                            {product.NUMERO_VOLUME}</Text>
                                    </View>
                                    <View style={{ maxWidth: 220 }} >
                                        <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>
                                            {product.ID_VOLUME}</Text>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <TouchableOpacity style={styles.reomoveBtn} onPress={onRemoveProduct}>
                                            <MaterialCommunityIcons name="delete" size={24} color="#777" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            </View>



                        )
                    })}
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <TouchableOpacity
                        style={[styles.amountChanger, !isValidAdd() && { opacity: 0.5 }]} onPress={onAddToCart} >
                        <Text style={styles.amountChangerText}>+</Text>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback
                        disabled={!isValid()}
                        onPress={enregistrement}>
                        <View style={[styles.button, !isValid() && { opacity: 0.5 }]}>
                            <Text style={styles.buttonText}>Enregistrer</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
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
        color: COLORS.primary
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
    },
    amountChanger: {
        width: 100,
        height: 50,
        backgroundColor: COLORS.ecommercePrimaryColor,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 20

    },
    amountChangerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20
    },
    product: {
        flexDirection: 'row',
        height: 135,
        marginTop: 10,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 8,
    },
    productImage: {
        height: "100%",
        width: "30%",
        borderRadius: 10,
        backgroundColor: '#F1F1F1'
    },
    image: {
        height: "100%",
        width: "100%",
        borderRadius: 10,
        resizeMode: 'contain'
    },
    productDetails: {
        marginLeft: 10,
        justifyContent: 'space-between',
        flex: 1,
    },
    productNames: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    productName: {
        color: COLORS.ecommercePrimaryColor,
        fontWeight: 'bold'
    },
    reomoveBtn: {
        width: 30,
        height: 30,
        backgroundColor: '#F1F1F1',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    unitPrice: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#777'
    },
    detailsFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    productPrice: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
        maxWidth: "55%"
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 30,
        marginLeft: 10,
        width: "45%"
    },
    input: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        height: "100%",
        marginHorizontal: 5,
        textAlign: 'center',
        color: COLORS.ecommercePrimaryColor,
        fontWeight: 'bold'
    },
    // amountChanger: {
    //     width: 30,
    //     height: "100%",
    //     backgroundColor: COLORS.ecommercePrimaryColor,
    //     borderRadius: 5,
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    amountChangerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    inventoryOption: {
        flexDirection: "row"
    },
    headerRead: {
        borderRadius: 8,
        backgroundColor: "#ddd",
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 30
    },
    titleObject: {
        fontWeight: "bold",

    },
    title: {
        color: '#777',
        fontSize: 12,
        flex: 1

    },
    titleDate: {
        color: '#777',
        fontSize: 8,
        color: COLORS.primary

    },
})