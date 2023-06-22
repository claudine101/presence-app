import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../../store/actions/userActions"
import moment from 'moment';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';
import { RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'
import * as DocumentPicker from 'expo-document-picker';
import { interpolateSharableColor } from 'react-native-reanimated';

/**
 * Screen pour modifier un  courrie entrant 
 * @author NDAYISABA Claudine <claudine@mediabox.bi>
 * @date 04/05/2023
 * @returns 
 */
export default function UpdateCourrierSortantScreen() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { courrier, inEdit } = route.params
    const [document, setDocument] = useState(null)
    const [visible, setVisible] = useState(false)
    const [visibleSignature, setVisibleSignature] = useState(false)

    const [destinataires, setDestinataires] = useState([])

    // useEffect(() => {
    //     (async () => {
    //             try {
    //                 setLoading(true)
    //                 const destinats = await fetchApi(`/courrier/courrier_entrants/destinataire/${courrier.ID_COURRIER_ENTRANT}`)
    //                 handleChange("selectedUser", destinats.result)

    //             } catch (error) {
    //                 console.log(error)
    //             } finally {
    //                 setLoading(false)
    //             }
    //     })()
    // }, [courrier])

    const [mode, setMode] = useState('')
    const [modeSignature, setModeSignature] = useState('')

    const showPicker = () => {
        setVisible(true)
    }
    const showPickerSignature = () => {
        setVisibleSignature(true)
    }


    const showDate = () => {
        setMode('date')
        showPicker()
    }

    const showTime = () => {
        setMode('time')
        showPicker()
    }

    const showDateSignature = () => {
        setModeSignature('date')
        showPickerSignature()
    }

    const showTimeSignature = () => {
        setModeSignature('time')
        showPickerSignature()
    }

    const dateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setVisible(false)
        handleChange("datereception", currentDate)
    }

    const [data, handleChange, setValue] = useForm({

        remettant: { NOM: courrier?.remettant, ID_REMETTANT: courrier?.ID_REMETTANT },
        typecourrier: { ID_COURRIER_TYPE: courrier?.ID_COURRIER_TYPE, DESCRIPTION: courrier?.courriertype },
        expediteurtpe: courrier?.ID_EXPEDITEUR_TYPE,
        expediteur: { NOM: courrier?.remettant, ID_REMETTANT: courrier?.ID_REMETTANT },
        societe: { ID_SOCIETE: courrier?.ID_SOCIETE, DESCRIPTION: courrier?.societes },
        objet: courrier?.OBJET_LETTRE,
        document: courrier?.LETTRE_PAPH,
        moyen: { MOYEN_TRANSPORT_ID: courrier?.MOYEN_TRANSPORT_ID, DESCR_MOYEN_TRANS: courrier?.DESCR_MOYEN_TRANS },
        datereception: new Date(courrier?.DATE_SIGNATURE)
    })

    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        expediteur: {
            required: true
        },
        objet: {
            required: true,
            length: [1, 255]
        },
        expediteurtpe: {
            required: true
        },
        remettant: {
            required: true
        },
        typecourrier: {
            required: true
        },
        moyen: {
            required: true
        },
        societe: {
            // required: false
        },
        datereception: {
            required: true
        }

    }, {
        expediteur: {
            required: 'ce champ est obligatoire',
        },
        numero: {
            required: 'ce champ est obligatoire',

        },
        objet: {
            required: 'ce champ est obligatoire',

        },
        isconfidentiel: {
            required: 'ce champ est obligatoire',
        },
        expediteurtpe: {
            required: 'ce champ est obligatoire',
        },
        remettant: {
            required: 'ce champ est obligatoire',
        },

        moyen: {
            required: 'ce champ est obligatoire',
        },
        typecourrier: {
            required: 'ce champ est obligatoire',

        },
        societe: {
            required: 'ce champ est obligatoire',

        }
    })
    // console.log(getErrors())
    // const previousRouteName = navigation.getState().routes[navigation.getState().index - 1].name
    const previousRouteName = navigation.getState().routes[navigation.getState().index - 1].name
    const documentcourrierselect = () => {
        navigation.navigate('DocumentCourrierScreen')

    }

    const isValid = () => {
        var isValiExpediteur = false
        if (data.expediteurtpe == 1) {
            isValiExpediteur = data.expediteur ? true : false
        } else if (data.expediteurtpe == 2) {
            isValiExpediteur = data.societe ? true : false
        }
        return isValidate() && isValiExpediteur
    }

    const societeselect = () => {
        navigation.navigate('SocieteSortantScreen', {
            ...route.params,
            societe: data.societe,
            previousRouteName: "UpdateCourrierSortantScreen",
            inEdit: inEdit
        })

    }

    useEffect(() => {
        const { societe } = route.params || {}
        if (societe) {
            handleChange("societe", societe)
        }
    }, [route])


    useEffect(() => {
        (async () => {

            const perm = await MediaLibrary.requestPermissionsAsync()
            if (!perm.granted) return false
            if (courrier.LETTRE_PAPH) {

                const splits = courrier.LETTRE_PAPH.split('/')
                const fileName = splits[splits.length - 1]
                const downloadResult = await FileSystem.downloadAsync(
                    courrier.LETTRE_PAPH,
                    `${FileSystem.documentDirectory}/${fileName}`
                )
                const file = await FileSystem.getInfoAsync(downloadResult.uri)
                // const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
                setDocument(file)


            }
        })()
    }, [courrier])

    const openFile = async (url) => {
        try {
            const res = await WebBrowser.openBrowserAsync(document.uri);
        } catch (error) {
            console.log(error);
        }
    };
    const openLink = async url => {
        const res = await WebBrowser.openBrowserAsync(url);
    }
    const getFileName = () => {
        if (courrier.LETTRE_PAPH) {
            const splits = courrier.LETTRE_PAPH.split('/')
            return splits[splits.length - 1]
        }
        return ""
    }

    const remettantselect = (returnkey) => {

        navigation.navigate('RemettantSortantScreen', {
            ...route.params,
            remettant: data.remettant,
            returnkey,
            expediteur: data.expediteur,
            inEdit: inEdit
        })
    }

    useFocusEffect(useCallback(() => {
        const { remettant, expediteur } = route.params || {}
        if (remettant) {
            handleChange("remettant", remettant)
        }
        if (expediteur) {
            handleChange("expediteur", expediteur)
        }
    }, [route]))


    const typecourriertselect = () => {
        navigation.navigate('TypecourrierSortantScreen', {
            ...route.params,
            typecourrier: data.typecourrier,
            inEdit: inEdit,
        })

    }

    useFocusEffect(useCallback(() => {
        const { typecourrier, courrier } = route.params || {}
        // console.log(route.params)
        if (typecourrier) {
            handleChange("typecourrier", typecourrier)
        }
    }, [route]))


    const selectdocument = async () => {
        const document = await DocumentPicker.getDocumentAsync()
        // console.log(document)
        handleChange("document", document)
    }

    const moyenselect = () => {

        navigation.navigate('MoyenScreen', {
            moyen: data.moyen
        })

    }

    useFocusEffect(useCallback(() => {
        const { moyen } = route.params || {}
        // console.log(route.params)
        if (moyen) {
            handleChange("moyen", moyen)
        }
    }, [route]))


    const enregistrement = async () => {

        try {
            setLoading(true)
            const form = new FormData()
            form.append('remettant', JSON.stringify(data.remettant))
            form.append('typecourrier', JSON.stringify(data.typecourrier))
            form.append('moyen'), JSON.stringify(data.moyen)
            form.append('objet', data.objet)
            form.append('expediteurtpe', data.expediteurtpe)
            if (data.expediteurtpe == 1) {
                form.append('expediteur', JSON.stringify(data.expediteur))
            } else {
                form.append('societe', JSON.stringify(data.societe))
            }

            form.append('datereception', data.datereception.toString())
            if (data.document) {
                // console.log(form)
                let localUri = data.document.uri;
                let filename = localUri.split('/').pop();
                form.append("document", {
                    uri: data.document.uri, name: filename, type: data.document.mimeType
                })
            }
            const res = await fetchApi(`/courrier/courrier_entrants/updatecourriersortant/${courrier.TRANSMISSION_ID}`, {
                method: 'PUT',
                body: form
            })
            navigation.navigate('DetailCourrierSortantScreen', {
                ...route.params,
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading && <Loading />}
            {inEdit &&
                <View style={styles.container}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: StatusBar.currentHeight }}>
                        <TouchableNativeFeedback
                            style={{}}
                            onPress={() => navigation.goBack()}
                            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                            <View style={{ padding: 10 }}>
                                <Ionicons name="arrow-back-sharp" size={24} color="black" />
                            </View>
                        </TouchableNativeFeedback>
                        <Text style={styles.Title}>Modification du courrier sortant</Text>
                    </View>

                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View>

                            <View style={styles.inputCard}>

                                <TouchableOpacity style={styles.selectContainer}
                                    onPress={typecourriertselect}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Type de courrier
                                        </Text>
                                        {data.typecourrier ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                            {data.typecourrier.DESCRIPTION}
                                        </Text> : null}

                                    </View>
                                    <EvilIcons name="chevron-down" size={30} color="#777" />
                                </TouchableOpacity>


                            </View>


                            <View style={styles.inputCard}>

                                <View style={styles.selectContainer}
                                >
                                    <View style={{}}>

                                        <Text style={[styles.selectLabel]}>
                                            Type d'expediteur
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => handleChange("expediteurtpe", 1)}
                                        >
                                            <Text >
                                                {data?.expediteurtpe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} Personne physique</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleChange("expediteurtpe", 2)}
                                        >
                                            <Text>
                                                {data?.expediteurtpe == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} Personne morale</Text>
                                        </TouchableOpacity>

                                        <Text style={[styles.selectedValue, { color: '#333' }]}>

                                        </Text>
                                    </View>

                                </View>

                                {data.expediteurtpe == 1 ? <TouchableOpacity style={styles.selectContainer}
                                    onPress={() => remettantselect("expediteur")}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Séléctionner l'expediteur
                                        </Text>
                                        {data.expediteur ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                            {data.expediteur.NOM} 
                                            {/* {data.expediteur.DESTINATAIRE_PHYSIQUE_ID}  */}
                                        </Text> : null}

                                    </View>
                                    <EvilIcons name="chevron-down" size={30} color="#777" />
                                </TouchableOpacity> : null}


                                {data.expediteurtpe == 2 ? <TouchableOpacity style={styles.selectContainer}
                                    onPress={societeselect}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Séléctionner la socièté
                                        </Text>
                                        {data.societe ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                            {data.societe.DESCRIPTION}

                                        </Text> : null}
                                    </View>
                                    <EvilIcons name="chevron-down" size={30} color="#777" />
                                </TouchableOpacity> : null}

                                <TouchableOpacity style={styles.selectContainer}
                                    onPress={() => remettantselect("remettant")}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Remettant
                                        </Text>
                                        {data.remettant ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                            {data.remettant.NOM}  {data.remettant.PRENOM} 
                                        </Text> : null}
                                    </View>
                                    <EvilIcons name="chevron-down" size={30} color="#777" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputCard}>
                                <View>
                                    <OutlinedTextField
                                        label="Object du courrier"
                                        fontSize={14}
                                        baseColor={COLORS.smallBrown}
                                        tintColor={COLORS.primary}
                                        containerStyle={{ borderRadius: 20 }}
                                        lineWidth={1}
                                        activeLineWidth={1}
                                        errorColor={COLORS.error}
                                        value={data.objet}
                                        onChangeText={(newValue) => handleChange('objet', newValue)}
                                        onBlur={() => checkFieldData('objet')}
                                        error={hasError('objet') ? getError('objet') : ''}
                                        autoCompleteType='off'
                                        blurOnSubmit={false}
                                    />
                                </View>

                            </View>




                            {/* <View style={styles.inputCard}>
                                <TouchableOpacity style={styles.selectContainer}
                                    onPress={selectdocument}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Document du courrier
                                        </Text>
                                        {data.document ? <View>
                                            <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                {data.document.name}
                                            </Text>
                                            <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                {((data.document.size / 1000) / 1000).toFixed(2)} M

                                            </Text></View> : null}
                                    </View>
                                </TouchableOpacity>
                            </View> */}


                            <View style={styles.inputCard}>
                                <TouchableOpacity style={styles.selectContainer}
                                    onPress={selectdocument}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Document du courrier
                                        </Text>
                                        {document ? <TouchableOpacity style={styles.detail} onPress={openFile}>
                                            <Text style={styles.detailTitle} numberOfLines={1}>
                                                <Ionicons name="document-outline" size={20} color="black" />{getFileName()}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {/* <Text style={styles.detailValue}>{getFileName().split(".")[1].toUpperCase()} - </Text> */}
                                                <Text style={[styles.detailValue, { color: '#333' }]}>
                                                    {((document.size / 1000) / 1000).toFixed(2)} M
                                                </Text>
                                            </View>
                                        </TouchableOpacity> : null}
                                    </View>
                                </TouchableOpacity>
                            </View>


                            <View style={styles.inputCard}>
                                <TouchableOpacity style={styles.selectContainer} onPress={() => showDate(true)}>
                                    <View style={{}}>

                                        <Text style={styles.selectLabel}>Date de signature</Text>
                                        {data.datereception && <Text style={styles.rightDateText1}>{`${data.datereception.getDate()}/${data.datereception.getMonth() + 1}/${data.datereception.getFullYear()}`}</Text>}
                                    </View>

                                </TouchableOpacity>
                            </View>
                            {visible &&
                                <DateTimePicker
                                    value={data.datereception}
                                    mode={mode}
                                    onChange={dateChange}
                                />
                            }


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
            }
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
        marginLeft: 10
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

        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: "#18678E",
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: '#ddd',
        paddingVertical: 5,
        borderBottomWidth: 1
    },
    actions: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    editAction: {
        borderRadius: 10,
        padding: 5,
        paddingRight: 10,
        backgroundColor: "#007FFF",
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    editText: {
        color: '#fff'
    },
    deleteAction: {
        borderRadius: 10,
        padding: 5,
        paddingRight: 10,
        backgroundColor: '#c94f4f',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        marginLeft: 5
    },
    deleteText: {
        color: '#fff'
    },
})