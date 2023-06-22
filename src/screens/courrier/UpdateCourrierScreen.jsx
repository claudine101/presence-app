import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar, ToastAndroid } from "react-native";
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
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
/**
 * Screen pour modifier un  courrie entrant 
 * @author NDAYISABA Claudine <claudine@mediabox.bi>
 * @date 04/05/2023
 * @returns 
 */
export default function UpdateCourrierScreen() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const [nbres, setNbres] = useState(null)
    const { courrier, inEdit, inAffect } = route.params
    const [document, setDocument] = useState(null)
    const [visible, setVisible] = useState(false)
    const [visibleSignature, setVisibleSignature] = useState(false)
    const [destinataires, setDestinataires] = useState([])
    const user = useSelector(userSelector)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const destinats = await fetchApi(`/courrier/courrier_entrants/destinataire/${courrier.ID_COURRIER_ENTRANT}`)
                if (destinats.result.typedest.length > 0) {
                    if (destinats.result.typedest[0].DEPARTEMANT_ID && !destinats.result.typedest[0].USERS_ID) {
                        const nombre = await getNbre(destinats.result.typedest[0].DEPARTEMANT_ID)
                        handleChange("destinatairetpe", 1)
                        handleChange("selectedDest", nombre.result)
                        handleChange("departemant",
                            {
                                "DEPARTEMENT_ID": destinats.result.typedest[0].DEPARTEMANT_ID,
                                "ID_SOCIETE": destinats.result.typedest[0].ID_SOCIETE,
                                "DESCRIPTION": destinats.result.typedest[0].DESCRIPTION,
                            })
                    }
                    else if (destinats.result.typedest[0].DEPARTEMANT_ID && destinats.result.typedest[0].USERS_ID) {
                        console.log("confidantiel SERVICE AVEC USERS SPECIFIQUE")
                        handleChange("destinatairetpe", 1)
                        handleChange("departemant",
                            {
                                "DEPARTEMENT_ID": destinats.result.typedest[0].DEPARTEMANT_ID,
                                "ID_SOCIETE": destinats.result.typedest[0].ID_SOCIETE,
                                "DESCRIPTION": destinats.result.typedest[0].DESCRIPTION,
                            })
                        handleChange("selectedDest", destinats.result.destinaires)
                    }
                    else {
                        handleChange("selectedUser", destinats.result.destinaires)
                        handleChange("destinatairetpe", 2)

                    }

                }

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [courrier, data?.selectedDest, data?.selectedUser])



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
        if (courrier.PATH_DOCUMENT) {
            const splits = courrier.PATH_DOCUMENT.split('/')
            return splits[splits.length - 1]
        }
        return ""
    }

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
    const dateChangesignature = (event, selectedDateSignature) => {
        const currentDateSignature = selectedDateSignature || date
        setVisibleSignature(false)
        handleChange("signaturedate", currentDateSignature)
    }
    const [data, handleChange, setValue] = useForm({
        isconfidentiel: courrier.NATURE_COURRIER == 1 ? 0 : 1,
        remettant: { NOM: courrier?.NOM, PRENOM: courrier?.PRENOM, ID_REMETTANT: courrier?.ID_REMETTANT },
        typecourrier: { ID_COURRIER_TYPE: courrier?.ID_COURRIER_TYPE, DESCRIPTION: courrier?.DESCRIPTION },
        expediteurtpe: courrier?.ID_EXPEDITEUR_TYPE,
        expediteur: { NOM: courrier?.NOM_EXPEDI, PRENOM: courrier?.PRENOM_EXPEDI, ID_REMETTANT: courrier?.ID_EXPEDITEUR_REMETTANT },
        societe: { ID_SOCIETE: courrier?.ID_SOCIETE, DESCRIPTION: courrier?.SOCIETE },
        numero: courrier?.REFERENCE_CLASSEUR,
        objet: courrier?.NUMERO_REFERENCE,
        selectedUser: destinataires,
        selectedDest: destinataires,
        document: courrier?.PATH_DOCUMENT,
        datereception: new Date(courrier?.DATE_RECEPTION),
        signaturedate: new Date(courrier?.DATE_SIGNATURE),
        destinatairetpe: null,
        departemant: null
    })


    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        expediteur: {
            required: true
        },
        isconfidentiel: {
            // required: true
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
        typecourrier: {
            required: 'ce champ est obligatoire',

        },
        societe: {
            required: 'ce champ est obligatoire',

        }
    })

    const isValid = () => {
        var isValiExpediteur = false
        var isValidDestinateur = false
        if (data.expediteurtpe == 1) {
            isValiExpediteur = data.expediteur ? true : false
        } else if (data.expediteurtpe == 2) {
            isValiExpediteur = data.societe ? true : false
        }
        if (data.isconfidentiel == 1 && data.destinatairetpe == 2) {
            isValidDestinateur = data.selectedUser.length > 0
        } else if (data.isconfidentiel == 1 && data.destinatairetpe == 1) {
            isValidDestinateur = data.departemant
        }
        else if (data.isconfidentiel == 0) {
            isValidDestinateur = data.isconfidentiel != null
        }
        return isValidate() && isValiExpediteur && isValidDestinateur
    }

    const societeselect = () => {
        navigation.navigate('SocieteScreen', {
            ...route.params,
            societe: data.societe,
            previousRouteName: "UpdateCourrierScreen",
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
        const { selectedUser } = route.params || {}
        if (selectedUser) {
            handleChange("selectedUser", selectedUser)
        }
    }, [route])
    const utilisateurselect = () => {
        navigation.navigate('UtisateurScreen', {
            ...route.params,
            selectedUsers: data.selectedUser


        })
    }
    const departemantselect = () => {
        navigation.navigate('DepartemantScreen', {
            departemant: data.departemant,
            societe: user,
            previousRouteName: "UpdateCourrierScreen",
            ...route.params
        })
    }
    useEffect(() => {
        const { departemant } = route.params || {}
        if (departemant) {
            handleChange("departemant", departemant)
        }
    }, [route])

    const destnataireselect = () => {
        navigation.navigate('DestinataireScreen', {
            selectedDest: data.selectedDest,
            departemant: data.departemant,
            previousRouteName: "UpdateCourrierScreen",
            ...route.params
        })
    }
    useEffect(() => {
        const { selectedDest } = route.params || {}
        if (selectedDest) {
            handleChange("selectedDest", selectedDest)
        }
    }, [route])
    useFocusEffect(useCallback(() => {
        const { utilis } = route.params || {}
        if (utilis) {
            handleChange("utilis", utilis)
        }
    }, [route]))

    /**
     * Permet de recuperer les nombre de utilisateurs par departemant
     *@author NDAYISABA Claudine <claudine@mediabox.bi>
    *@date 17/05/2023 à 10:33
    */
    const getNbre = async (DEPARTEMENT_ID) => {
        try {
            var url = `/courrier/courrier_entrants/Nbreuser/${DEPARTEMENT_ID}`
            return await fetchApi(url)
        }
        catch (error) {
            console.log(error)
        }

    }
    const remettantselect = (returnkey) => {

        navigation.navigate('RemettantScreen', {
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
    useEffect(() => {
        (async () => {

            const perm = await MediaLibrary.requestPermissionsAsync()
            if (!perm.granted) return false
            if (courrier.PATH_DOCUMENT) {

                const splits = courrier.PATH_DOCUMENT.split('/')
                const fileName = splits[splits.length - 1]
                const downloadResult = await FileSystem.downloadAsync(
                    courrier.PATH_DOCUMENT,
                    `${FileSystem.documentDirectory}/${fileName}`
                )
                const file = await FileSystem.getInfoAsync(downloadResult.uri)
                setDocument(file)
            }
        })()
    }, [courrier])

    const typecourriertselect = () => {
        navigation.navigate('TypecourrierScreen', {
            ...route.params,
            typecourrier: data.typecourrier,
            previousRouteName: "UpdateCourrierScreen",
            inEdit: inEdit,
        })

    }
    const selectNature = () => {
        if (data.isconfidentiel == 1) {
            handleChange("isconfidentiel", 0)
        }
        else {
            handleChange("isconfidentiel", 1)
        }
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
        handleChange("document", document)
    }

    const enregistrement = async () => {

        try {
            setLoading(true)
            const form = new FormData()
            form.append('isconfidentiel', data.isconfidentiel)
            form.append('remettant', JSON.stringify(data.remettant))
            form.append('typecourrier', JSON.stringify(data.typecourrier))
            form.append('numero', data.objet)
            form.append('objet', data.numero)
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
            // form.append('selectedUser', JSON.stringify(data.selectedUser))
            form.append('datereception', data.datereception.toString())
            form.append('signaturedate', data.signaturedate.toString())
            const res = await fetchApi(`/courrier/courrier_entrants/update/${courrier.ID_COURRIER_ENTRANT}`, {
                method: 'PUT',
                body: form
            })
            navigation.navigate('AllCourrierScreen')
            ToastAndroid.show('Modification effectué avec succès!', ToastAndroid.LONG);
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                        <TouchableNativeFeedback
                            style={{}}
                            onPress={() => navigation.goBack()}
                            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                            <View style={{ padding: 10 }}>
                                <Ionicons name="arrow-back-sharp" size={24} color="black" />
                            </View>
                        </TouchableNativeFeedback>
                        <Text style={styles.Title}> #{courrier.CODE_REFERENCE}</Text>
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
                                            {data.expediteur.NOM} {data.expediteur.PRENOM}
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

                                        // onSubmitEditing={() => {
                                        //     objetInputRef.current.focus()
                                        // }}
                                        autoCompleteType='off'
                                        // returnKeyType="next"
                                        blurOnSubmit={false}
                                    />
                                </View>

                            </View>
                            <View style={styles.inputCard}>

                                <View style={styles.selectContainer}
                                >
                                    <View style={{}}>

                                        <Text style={[styles.selectLabel]}>
                                            Nature du courrier
                                        </Text>

                                        <TouchableOpacity
                                            onPress={selectNature}
                                        >
                                            <Text >
                                                {data?.isconfidentiel == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} Confidentiel</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                {data.isconfidentiel == 1 ?
                                    <>
                                        <View style={styles.selectContainer}>
                                            {/* <View style={{}}>
                                <Text style={[styles.selectLabel]}>
                                        
                                    </Text>
                                <TouchableOpacity
                                        onPress={() => handleChange("destinatairetpe", 1)}
                                        style={styles.radioBtn}
                                    >
                                        {data?.destinatairetpe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                        <Text style={styles.radioLabel}>service</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleChange("destinatairetpe", 2)}
                                        style={styles.radioBtn}
                                    >
                                        
                                        <Text style={styles.radioLabel}>Personne </Text>
                                    </TouchableOpacity>
                                </View> */}
                                            <View style={{}}>

                                                <Text style={[styles.selectLabel]}>
                                                    Séléctionner type destinataire
                                                </Text>

                                                <TouchableOpacity
                                                    onPress={() => handleChange("destinatairetpe", 1)}
                                                    style={styles.radioBtn}
                                                >
                                                    <Text >
                                                        {data?.destinatairetpe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                        <Text style={styles.radioLabel}>service</Text></Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleChange("destinatairetpe", 2)}
                                                    style={styles.radioBtn}
                                                >
                                                    <Text>
                                                        {data?.destinatairetpe == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} Personne</Text>
                                                </TouchableOpacity>

                                                <Text style={[styles.selectedValue, { color: '#333' }]}>

                                                </Text>
                                            </View>
                                        </View>
                                        {data.destinatairetpe == 1 ? <><TouchableOpacity style={styles.selectContainer}
                                            onPress={departemantselect}
                                        >
                                            <View style={{}}>
                                                <Text style={[styles.selectLabel]}>
                                                    Séléctionner departemant
                                                </Text>
                                                {data.departemant ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.departemant.DESCRIPTION}
                                                </Text> : null}
                                            </View>
                                            <EvilIcons name="chevron-down" size={30} color="#777" />
                                        </TouchableOpacity>
                                            {data.departemant ?
                                                <TouchableOpacity style={styles.selectContainer}
                                                    onPress={destnataireselect}
                                                >
                                                    <View style={{}}>
                                                        <Text style={[styles.selectLabel]}>
                                                            Séléctionner le déstinataire
                                                        </Text>
                                                        {data.selectedDest.length > 0 ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                            {data.selectedDest ? data.selectedDest.length : null} déstinataire{data.selectedDest.length > 1 && 's'}
                                                        </Text> : null}
                                                    </View>
                                                    <EvilIcons name="chevron-down" size={30} color="#777" />
                                                </TouchableOpacity> : null}

                                        </> : null}


                                        {data.destinatairetpe == 2 ?
                                            <TouchableOpacity style={styles.selectContainer}
                                                onPress={utilisateurselect}
                                            >
                                                <View style={{}}>
                                                    <Text style={[styles.selectLabel]}>
                                                        Séléctionner le déstinataire
                                                    </Text>
                                                    {data.selectedUser.length > 0 ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {data.selectedUser.length} déstinataire{data.selectedUser.length > 1 && 's'}
                                                    </Text> : null}
                                                </View>
                                                <EvilIcons name="chevron-down" size={30} color="#777" />
                                            </TouchableOpacity> : null}

                                    </> : null}

                            </View>
                            <View style={styles.inputCard}>
                                <TouchableOpacity style={styles.selectContainer} onPress={() => showDate(true)}>
                                    <View style={{}}>

                                        <Text style={styles.selectLabel}>Date de récéption</Text>
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
                            <View style={styles.inputCard}>
                                <TouchableOpacity style={styles.selectContainer} onPress={() => showDateSignature(true)}>
                                    <View style={{}}>

                                        <Text style={styles.selectLabel}>Date de signature</Text>
                                        {data.signaturedate && <Text style={styles.rightDateText1}>{`${data.signaturedate.getDate()}/${data.signaturedate.getMonth() + 1}/${data.signaturedate.getFullYear()}`}</Text>}
                                        {/* {data.datesignature && <Text style={styles.rightDateText1}>{`${data.datesignature.getDate()}/${data.datesignature.getMonth() + 1}/${data.datesignature.getFullYear()}`}</Text>} */}
                                    </View>

                                </TouchableOpacity>
                            </View>
                            {visibleSignature &&
                                <DateTimePicker
                                    value={data.signaturedate}
                                    modeSignature={modeSignature}
                                    onChange={dateChangesignature}
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