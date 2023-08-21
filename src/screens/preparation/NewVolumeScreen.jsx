import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, ActivityIndicator, StatusBar, ToastAndroid, Image, Alert } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { MaterialCommunityIcons,  FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { resetCartAction } from '../../store/actions/planificationCartActions';
import { planificationCartSelector } from '../../store/selectors/planificationCartSelectors';
import { userSelector } from '../../store/selectors/userSelector';
import * as DocumentPicker from 'expo-document-picker';
import fetchApi from '../../helpers/fetchApi';
import Loading from '../../components/app/Loading';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

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
    const [volumes, setVolumes] = useState([])
    const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)

    const [data, handleChange, setValue] = useForm({
        nbre_volume: '',
        numero: '',
        PV: null
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
        isValid = (volumes.length > 0) && document != null ? true : false
        return isValid && isValidate()
    }

    const isValidFin = () => {
        var isVal = false
        isVal = (data.numero != '') ? true : false
        return isVal
    }

    //Fonction pour ajouter un volume da le redux
    const handleAdd = (vol) => {
        setVolumes(vols => [...vols, data.numero])
        handleChange("numero", "")
    }
    //Fonction pour enlever un volume da le redux
    const onRemoveVolume = (volIndex) => {
        Alert.alert("Enlever le volume", "Voulez-vous vraiment enlever ce volume dans les details?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Oui", onPress: async () => {
                        const removed = volumes.filter((vol, index) => index != volIndex)
                        setVolumes(removed)
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
        setIsCompressingPhoto(true)
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (!permission.granted) return false
        const image = await ImagePicker.launchCameraAsync()
        if (image.canceled) {
            return setIsCompressingPhoto(false)
        }
        const photo = image.assets[0]
        setDocument(photo)
        const manipResult = await manipulateAsync(
            photo.uri,
            [
                { resize: { width: 500 } }
            ],
            { compress: 0.7, format: SaveFormat.JPEG }
        );
        setIsCompressingPhoto(false)
        //     handleChange('pv', manipResult)
    }

    //fonction pour envoyer les donnees des volumes dans la bases
    const submitPlanification = async () => {
        try {
            setLoading(true)
            const form = new FormData()
            form.append('volume', JSON.stringify(volumes))
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
            navigation.navigate('AllVolumeScreen')
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
                <View style={styles.header}>
                    <TouchableNativeFeedback
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </View>
                    </TouchableNativeFeedback>
                    <View style={styles.cardTitle}>
                        <Text style={styles.title} numberOfLines={2}>Planifier les volumes</Text>
                    </View>
                </View>
                <View style={{ marginVertical: 8, marginHorizontal: 10 }}>
                    <OutlinedTextField
                        label="Nom du volume"
                        fontSize={14}
                        baseColor={COLORS.smallBrown}
                        tintColor={COLORS.primary}
                        containerStyle={{ borderRadius: 20 }}
                        lineWidth={0.25}
                        activeLineWidth={0.25}
                        errorColor={COLORS.error}
                        value={data.numero}
                        onChangeText={(newValue) => handleChange('numero', newValue)}
                        onBlur={() => checkFieldData('numero')}
                        error={hasError('numero') ? getError('numero') : ''}
                        autoCompleteType='off'
                        blurOnSubmit={false}
                    />
                </View>
                <ScrollView>
                    <>
                        {volumes.map((volume, index) => {
                            return (
                            <View style={[styles.headerRead]} key={index}>
                                        <View style={styles.folioImageContainer}>
                                            <Image source={require("../../../assets/images/dossierDetail.png")} style={styles.folioImage} />
                                        </View>
                                        <View style={styles.folioDesc}>
                                            <Text style={styles.folioName}>{volume}</Text>
                                            <Text style={styles.folioSubname}>{volume}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.reomoveBtn} onPress={() => onRemoveVolume(index)}>
                                            <MaterialCommunityIcons name="delete" size={24} color="#777" />
                                        </TouchableOpacity>
                                    </View>
                            )
                        })}
                        <TouchableOpacity onPress={onTakePicha}>
                            <View style={[styles.addImageItem]}>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FontAwesome5 name="file-signature" size={20} color="#777" />
                                        <Text style={styles.addImageLabel}>
                                            Photo du procès verbal
                                        </Text>
                                    </View>
                                    {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                                </View>
                                {document && <Image source={{ uri: document.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                            </View>
                        </TouchableOpacity>

                    </>
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <TouchableOpacity
                        disabled={!isValidFin()}
                        onPress={handleAdd}
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
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    headerBtn: {
        padding: 10
    },
    title: {
        paddingHorizontal: 5,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#777',
    },
    cardTitle: {
        maxWidth: "85%"
    },
    button: {
        marginVertical: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primary,
        marginHorizontal: 10
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
    amountChanger: {
        width: 100,
        height: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 10

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
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingHorizontal: 10,
        marginBottom: 10,
        marginHorizontal: 10
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
        borderColor: "#ddd",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5,
        marginHorizontal: 10
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
    },
    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'red',
        padding: 10
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    folioImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    folioImage: {
        width: '60%',
        height: '60%'
    },
    folioDesc: {
        marginLeft: 10,
        flex: 1
},
folioName: {
        fontWeight: 'bold',
        color: '#333',
},
folioSubname: {
    color: '#777',
    fontSize: 12
}
})