import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar, ToastAndroid, Alert } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addVolumeAction, resetCartAction } from '../../store/actions/planificationCartActions';
import { planificationCartSelector } from '../../store/selectors/planificationCartSelectors';
import { removeVolumeAction } from '../../store/actions/planificationCartActions';
import { userSelector } from '../../store/selectors/userSelector';
import * as DocumentPicker from 'expo-document-picker';
import fetchApi from '../../helpers/fetchApi';
import Loading from '../../components/app/Loading';

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
    const user = useSelector(userSelector)
    const [loading, setLoading] = useState(false)

    const [data, handleChange, setValue] = useForm({
        nbre_volume: '',
        numero: '',
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
        var isValid = false
        isValid = data.nbre_volume == 0 ? true : false
        return isValid
    }

    const isValidFin = () => {
        var isVal = false
        isVal = data.nbre_volume > 0 ? true : false
        return isVal
    }

    //Fonction pour ajouter un volume da le redux
    const onAddToCart = () => {
        dispatch(addVolumeAction({ ID_VOLUME: parseInt(data.nbre_volume), NUMERO_VOLUME: data.numero }))
        handleChange("nbre_volume", data.nbre_volume - 1)
        handleChange("numero", "")
    }

    //Fonction pour enlever un volume da le redux
    const onRemoveProduct = (index) => {
        Alert.alert("Enlever le volume", "Voulez-vous vraiment enlever ce volume dans les details?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Oui", onPress: async () => {
                        dispatch(removeVolumeAction(index))
                    }
                }
            ])
    }

    //Fonction pour upload un documents 
    const selectdocument = async () => {
        setError("document", "")
        handleChange("document", null)
        const document = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (document.type == 'cancel') {
            return false
        }
        var sizeDocument = ((document.size / 1000) / 1000).toFixed(2)
        if (sizeDocument <= 2) {
            handleChange("document", document)
        }
        else {
            setError("document", ["Document trop volumineux(max:2M)"])
        }

    }

    const submitPlanification = async () => {
        try {
            setLoading(true)
            const form = new FormData()
            form.append('volume', JSON.stringify(activity))
            if (data.document) {
                let localUri = data.document.uri;
                let filename = localUri.split('/').pop();
                form.append("document", JSON.stringify({uri: data.document.uri, name: filename, type: data.document.mimeType}))
            }
            const volume = await fetchApi(`/volume/dossiers`, {
                method: "POST",
                body: form
            })
            dispatch(resetCartAction())
            navigation.goBack()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loading />}
            <View style={styles.container}>
                <View style={styles.cardHeader}>
                    <TouchableNativeFeedback
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.backBtn}>
                            <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.titlePrincipal}>Planifier les volumes</Text>
                </View>
                <View style={{ marginVertical: 8 }}>
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
                        autoCompleteType='off'
                        blurOnSubmit={false}
                    />
                </View>
                {data.nbre_volume > 0 ? <View style={{ marginVertical: 8 }}>
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
                        autoCompleteType='off'
                        blurOnSubmit={false}
                    />
                </View> : null}
                <ScrollView>
                    <>
                        {activity.map((product, index) => {
                            return (
                                <View style={styles.headerRead} key={index}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                        <View style={styles.cardFolder}>
                                            <Text style={[styles.title]} numberOfLines={1}>{product.NUMERO_VOLUME}</Text>
                                            <View style={styles.cardDescription}>
                                                <AntDesign name="folderopen" size={20} color="black" />
                                            </View>

                                        </View>
                                        <View>
                                            <Text style={[styles.title, { marginTop: 5 }]} numberOfLines={1}>{product.ID_VOLUME}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={styles.reomoveBtn} onPress={() => onRemoveProduct(index)}>
                                                <MaterialCommunityIcons name="delete" size={24} color="#777" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}

                        <View>
                            <TouchableOpacity style={[styles.selectContainer, hasError("document") && { borderColor: "red" }]}
                                onPress={selectdocument}
                            >
                                <View>
                                    <Text style={[styles.selectLabel, hasError("document") && { color: 'red' }]}>
                                        Importer le proces verbal
                                    </Text>
                                    {data.document ? <View>
                                        <Text style={[styles.selectedValue, { color: '#333' }]}>
                                            {data.document.name}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text>{data.document.name.split('.')[1].toUpperCase()} - </Text>
                                            <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                {((data.document.size / 1000) / 1000).toFixed(2)} M
                                            </Text>
                                        </View>
                                    </View> : null}
                                </View>
                            </TouchableOpacity>
                        </View>

                    </>
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <TouchableOpacity
                        disabled={!isValidFin()}
                        onPress={onAddToCart}
                    >
                        <View style={[styles.amountChanger, !isValidFin() && { opacity: 0.5 }]}>
                            <Text style={styles.amountChangerText}>+</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback
                        disabled={!isValidAdd()}
                        onPress={submitPlanification}
                    >
                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                            <Text style={styles.buttonText}>Enregistrer</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: -20,
        flex: 1,
        marginHorizontal: 10
    },
    titlePrincipal: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        color: COLORS.primary
    },
    button: {
        marginVertical: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primary
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        // textTransform:"uppercase",
        fontSize: 16,
        textAlign: "center"
    },
    amountChanger: {
        width: 100,
        height: 50,
        backgroundColor: COLORS.ecommercePrimaryColor,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10

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
    },
    cardFolder: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: '#FFF',
        maxHeight: 50,
        borderRadius: 20,
        padding: 3,
        paddingVertical: 2,
        elevation: 10,
        shadowColor: '#c4c4c4',
    },
    cardDescription: {
        marginLeft: 10,
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "#ddd"
    },
    cardHeader: {
        flexDirection: 'row',
        marginTop: StatusBar.currentHeight,
        alignContent: "center",
        alignItems: "center",
        marginBottom: 15

    },
    backBtn: {
        backgroundColor: COLORS.ecommercePrimaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10
    },
    selectLabel: {
        color: '#777'
    },
})