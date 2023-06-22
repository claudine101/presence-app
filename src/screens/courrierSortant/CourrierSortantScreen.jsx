import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, StatusBar, ToastAndroid } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../../store/actions/userActions"
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'
import * as DocumentPicker from 'expo-document-picker';

/**
 * Screen pour l'enregistrement du courrier sortant
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 04/05/2023
 * @returns 
 */

export default function CourrierSortantScreen() {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const route = useRoute()
    const [visible, setVisible] = useState(false)
    const [mode, setMode] = useState('')
    const showPicker = () => {
        setVisible(true)
    }

    const showDate = () => {
        setMode('date')
        showPicker()
    }
    const showTime = () => {
        setMode('time')
        showPicker()
    }

    const dateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setVisible(false)
        handleChange("datereception", currentDate)
    }
    const [data, handleChange, setValue] = useForm({
        // remettant: null,
        typecourrier: null,
        expediteurtpe: null,
        courriertpe: null,
        expediteur: null,
        societe: null,
        objet: "",
        document: null,
        moyen: null,
        datereception: new Date()
    })


    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        expediteur: {
            // required: true
        },
        objet: {
            required: true,
            length: [1, 255]
        },
        expediteurtpe: {
            required: true
        },
        
        datereception: {
            required: true
        }
    }, {
        expediteur: {
            required: 'ce champ est obligatoire',
        },
        objet: {
            required: 'ce champ est obligatoire',

        },
        expediteurtpe: {
            required: 'ce champ est obligatoire',
        },
        remettant: {
            required: 'ce champ est obligatoire',
        },
        societe: {
            required: 'ce champ est obligatoire',

        }
    })
    const isValid = () => {
        var isValiExpediteur = false
        if (data.expediteurtpe == 1) {
            isValiExpediteur = data.expediteur ? true : false
        } else if (data.expediteurtpe == 2) {
            isValiExpediteur = data.societe ? true : false
        }
        if (data.courriertpe == 1) {
            isValiExpediteur = data.typecourrier ? true : false
        }
        return isValidate() && isValiExpediteur
    }

    const societeselect = () => {
        navigation.navigate('SocieteSortantScreen', {
            societe: data.societe,
            previousRouteName: "CourrierSortantScreen"
        })

    }

    useEffect(() => {
        const { societe } = route.params || {}
        if (societe) {
            handleChange("societe", societe)
        }
    }, [route])

    const remettantselect = (returnkey) => {

        navigation.navigate('RemettantSortantScreen', {
            remettant: data.remettant,
            returnkey,
            expediteur: data.expediteur
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
            typecourrier: data.typecourrier,
            previousRouteName: "CourrierSortantScreen"
        })
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

    useFocusEffect(useCallback(() => {
        const { typecourrier } = route.params || {}
        // console.log(route.params)
        if (typecourrier) {
            handleChange("typecourrier", typecourrier)
        }
    }, [route]))

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
    const enregistrementsortant = async () => {
        try {
            setLoading(true)
            const form = new FormData()
            form.append('typecourrier', JSON.stringify(data.typecourrier))
            form.append('objet', data.objet)
            form.append('expediteurtpe', data.expediteurtpe)
            form.append('courriertpe', data.courriertpe)
            if (data.expediteurtpe == 1) {
                form.append('expediteur', JSON.stringify(data.expediteur))
            } else {
                form.append('societe', JSON.stringify(data.societe))
            }
            form.append('datereception', data.datereception.toString())
            if (data.document) {
                let localUri = data.document.uri;
                let filename = localUri.split('/').pop();
                form.append("document", {
                    uri: data.document.uri, name: filename, type: data.document.mimeType
                })
            }
            console.log(form)

            const res = await fetchApi("/services/createsortant", {
                method: 'POST',
                body: form

            })
            navigation.navigate("AllCourrierSortantScreen")
            ToastAndroid.show('Enregistrement effectué avec succès!', ToastAndroid.LONG);
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
                    <Text style={styles.Title}>Nouveau courrier sortant</Text>
                </View>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <View style={styles.inputCard}>
                            <View style={styles.selectContainer}>
                                <View style={{}}>
                                    <Text style={[styles.selectLabel]}>
                                        Categorie
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => handleChange("courriertpe", 1)} >
                                        <Text >
                                            {data?.courriertpe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}Courrier</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleChange("courriertpe", 2)} >
                                        <Text>
                                            {data?.courriertpe == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}colis</Text>
                                    </TouchableOpacity>
                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {data?.courriertpe == 1 ?<View style={styles.inputCard}>
                            <TouchableOpacity style={styles.selectContainer}
                                onPress={typecourriertselect}>
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
                        </View>:null}
                        <View style={styles.inputCard}>
                            <View style={styles.selectContainer}>
                                <View style={{}}>
                                    <Text style={[styles.selectLabel]}>
                                        Type destinataire
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => handleChange("expediteurtpe", 1)} >
                                        <Text >
                                            {data?.expediteurtpe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} Personne physique</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleChange("expediteurtpe", 2)} >
                                        <Text>
                                            {data?.expediteurtpe == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />} Personne morale</Text>
                                    </TouchableOpacity>
                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                    </Text>
                                </View>
                            </View>
                            {data.expediteurtpe == 1 ? <TouchableOpacity style={styles.selectContainer}
                                onPress={() => remettantselect("expediteur")} >
                                <View style={{}}>
                                    <Text style={[styles.selectLabel]}>
                                        Transmis à
                                    </Text>
                                    {data.expediteur ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                        {data.expediteur.NOM} {data.expediteur.PRENOM}
                                    </Text> : null}
                                </View>
                                <EvilIcons name="chevron-down" size={30} color="#777" />
                            </TouchableOpacity> : null}
                            {data.expediteurtpe == 2 ? <TouchableOpacity style={styles.selectContainer}
                                onPress={societeselect} >
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
                        </View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Object"
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
                                />
                            </View>
                        </View>

                        <View style={styles.inputCard}>
                            <TouchableOpacity style={[styles.selectContainer, hasError("document") && { borderColor: "red" }]}
                                onPress={selectdocument}
                            >
                                <View style={{}}>
                                    <Text style={[styles.selectLabel, hasError("document") && { color: 'red' }]}>
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
                        </View>
                        {hasError('document') ? <Text style={{ marginTop: -10, paddingHorizontal: 30, fontSize: 12, color: "red" }}> {getError('document')} </Text> : null}
                        <View style={styles.inputCard}>
                            <TouchableOpacity style={styles.selectContainer} onPress={() => showDate(true)}>
                                <View style={{}}>
                                    <Text style={styles.selectLabel}>Date de signature</Text>
                                    {data.datereception && <Text style={styles.rightDateText1}>{`${data.datereception.getDate()}/${data.datereception.getMonth() + 1}/${data.datereception.getFullYear()}`}</Text>}
                                </View>
                            </TouchableOpacity>
                            {visible &&
                                <DateTimePicker
                                    value={data.datereception}
                                    mode={mode}
                                    onChange={dateChange}
                                />
                            }
                        </View>
                        <TouchableWithoutFeedback
                            disabled={!isValid()}
                            onPress={enregistrementsortant}>
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