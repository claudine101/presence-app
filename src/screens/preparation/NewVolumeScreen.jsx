import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar, ToastAndroid, Image, Alert } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
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
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

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
    const [document, setDocument] = useState(null)

    const [data, handleChange, setValue] = useForm({
        nbre_volume: '',
        numero: '',
        // document: null
    })

    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        // document: {
        //     required: true
        // }
    }, {
        // document: {
        //     required: 'ce champ est obligatoire',

        // }
    })
    const isValidAdd = () => {
        var isValid = false
        isValid = (data.nbre_volume == '' && activity.length > 0) && document != null ? true : false
        return isValid && isValidate()
    }

    const isValidFin = () => {
        var isVal = false
        isVal = (data.nbre_volume > 0 && data.numero != '') ? true : false
        return isVal
    }

    //Fonction pour ajouter un volume da le redux
    const onAddToCart = () => {
        dispatch(addVolumeAction({ ID_VOLUME: parseInt(data.nbre_volume), NUMERO_VOLUME: data.numero }))
        handleChange("numero", "")
        if (data.nbre_volume - 1 == 0) {
            handleChange("nbre_volume", "")
        } else {
            handleChange("nbre_volume", data.nbre_volume - 1)
        }
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

    //Fonction pour le prendre l'image avec l'appareil photos
    const onTakePicha = async () => {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync()
            if (!permission.granted) return false
            const image = await ImagePicker.launchCameraAsync()
            if (!image.canceled) {
                setDocument(image)
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    //fonction pour envoyer les donnees des volumes dans la bases
    const submitPlanification = async () => {
        try {
            setLoading(true)
            const form = new FormData()
            form.append('volume', JSON.stringify(activity))
            if (document) {
                const manipResult = await manipulateAsync(
                    document.uri,
                    [
                        { resize: { width: 500 } }
                    ],
                    { compress: 0.8, format: SaveFormat.JPEG }
                );
                let localUri = manipResult.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append('PV', {
                    uri: localUri, name: filename, type
                })
            }
            const volume = await fetchApi(`/preparation/volume`, {
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
                        keyboardType='number-pad'
                        blurOnSubmit={false}
                    />
                </View>
                {data.nbre_volume > 0 ? <View style={{ marginVertical: 8 }}>
                    <OutlinedTextField
                        label="Nom du volume"
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
                                            <TouchableOpacity style={styles.reomoveBtn} onPress={() => onRemoveProduct(index)}>
                                                <MaterialCommunityIcons name="delete" size={24} color="#777" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        <TouchableOpacity onPress={onTakePicha}>
                            <View style={[styles.addImageItem]}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Feather name="image" size={24} color="#777" />
                                    <Text style={styles.addImageLabel}>
                                        Photo du proces verbal
                                    </Text>
                                </View>
                                {document && <Image source={{ uri: document.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                            </View>
                        </TouchableOpacity>

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
        paddingHorizontal: 30,
        marginBottom: 10
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
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#000",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
    },
})