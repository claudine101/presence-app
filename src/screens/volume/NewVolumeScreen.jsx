import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar, ToastAndroid, Alert } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addVolumeAction } from '../../store/actions/planificationCartActions';
import { ecommerceCartReducer } from '../../store/reducers/planificationCartReducer';
import { ecommerceCartSelector, planificationCartSelector } from '../../store/selectors/planificationCartSelectors';
import { removeVolumeAction } from '../../store/actions/planificationCartActions';

/**
 * Screen pour planifier et enregistrement volume
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 11/7/2023
 * @returns 
 */

export default function NewVolumeScreen() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const activity = useSelector(planificationCartSelector)
    console.log(activity)

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
        dispatch(addVolumeAction({ ID_VOLUME: parseInt(data.nbre_volume)+ parseInt(activity.length), NUMERO_VOLUME: data.numero }))
        handleChange("nbre_volume", data.nbre_volume - 1)
        handleChange("numero", "")
    }
 
    const onRemoveProduct = (product) => {
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
                    {activity.map((product, index) => {
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
                                        <TouchableOpacity style={styles.reomoveBtn} onPress={()=>onRemoveProduct(product)}>
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
                        style={[styles.amountChanger, !isValidAdd() && { opacity: 0.5 }]} 
                        onPress={onAddToCart}
                        >
                        <Text style={styles.amountChangerText}>+</Text>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback
                        disabled={!isValid()}>
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
    Title: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        color: COLORS.primary
    },
    inputCard: {
        marginHorizontal: 20,
        marginTop: 10
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
    container: {
        flex: 1,
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
    reomoveBtn: {
        width: 30,
        height: 30,
        backgroundColor: '#F1F1F1',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 30,
        marginLeft: 10,
        width: "45%"
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
    }
})