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
import moment from 'moment';
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';

/**
 * Screen pour l'enregistrement du courrier
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 27/04/2023
 * @returns 
 */

export default function CourrierScreen() {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const route = useRoute()
    const [visible, setVisible] = useState(false)
    const [nbres, setNbres] = useState([])

    const [signatureVisible, setSignatureVisible] = useState(false)
    const [mode, setMode] = useState('')
    const user = useSelector(userSelector)
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


    const [data, handleChange, setValue] = useForm({
        isconfidentiel: 0,
        remettant: null,
        typecourrier: null,
        expediteurtpe: null,
        destinatairetpe: null,
        expediteur: null,
        societe: null,
        departemant: null,
        numero: "",
        liencourrier: "",
        objet: "",
        selectedUser: [],
        selectedDest: [],
        document: null,
        datereception: new Date(),
        signaturedate: new Date()
    })

    const dateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setVisible(false)
        handleChange("datereception", currentDate)
    }

    const dateChangesignature = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setSignatureVisible(false)
        handleChange("signaturedate", currentDate)
    }

    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
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
        societe: {
            // required: false
        },
        datereception: {
            required: true
        },
        signaturedate: {
            required: true
        }

    }, {
        expediteur: {
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
        if (data.isconfidentiel == 1 && data.destinatairetpe==2) {
            isValidDestinateur = data.selectedUser.length > 0 
        } else  if (data.isconfidentiel == 1 && data.destinatairetpe==1) {
            isValidDestinateur = data.departemant
        } 
        else if (data.isconfidentiel == 0) {
            isValidDestinateur = data.isconfidentiel != null
        }
        return isValidate() && isValiExpediteur && isValidDestinateur
    }

    const societeselect = () => {
        navigation.navigate('SocieteScreen', {
            societe: data.societe,
            previousRouteName: "CourrierScreen"
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
    useEffect(() => {
        (async () => {
            try {
                if(data.departemant){
                    const nombre = await getNbre(data.departemant.DEPARTEMENT_ID)
                    handleChange("selectedDest", nombre.result)
                }
                
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
            
        })()
    }, [data.departemant])
    
    const utilisateurselect = () => {
        navigation.navigate('UtisateurScreen', {
            selectedUsers: data.selectedUser
        })
    }
    const destnataireselect = () => {
        navigation.navigate('DestinataireScreen', {
            selectedDest: data.selectedDest,
            departemant: data.departemant,
            previousRouteName: "CourrierScreen"

        })
    }
    useEffect(() => {
        const { selectedDest } = route.params || {}
        if (selectedDest) {
            handleChange("selectedDest", selectedDest)
        }

    }, [route])
    const departemantselect = () => {
        navigation.navigate('DepartemantScreen', {
            departemant: data.departemant,
            societe:user,
            previousRouteName: "CourrierScreen",
            getNbre:getNbre()
        })
    }
    useEffect(() => {
        const { departemant } = route.params || {}
        if (departemant) {
            handleChange("departemant", departemant)
        }
    }, [route])

    useFocusEffect(useCallback(() => {
        const { utilis } = route.params || {}
        if (utilis) {
            handleChange("utilis", utilis)
        }
    }, [route]))
    const remettantselect = (returnkey) => {

        navigation.navigate('RemettantScreen', {
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
        navigation.navigate('TypecourrierScreen', {
            typecourrier: data.typecourrier,
            previousRouteName: "CourrierScreen"
        })

    }
    const selectNature = () => {
      if(data.isconfidentiel==1){
        handleChange("isconfidentiel", 0)
      }
      else{
        handleChange("isconfidentiel", 1)
      }
    }
    useFocusEffect(useCallback(() => {
        const { typecourrier } = route.params || {}
        // console.log(route.params)
        if (typecourrier) {
            handleChange("typecourrier", typecourrier)
        }
    }, [route]))


    const selectdocument = async () => {
        setError("document","")
        handleChange("document", null)
        const document = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (document.type == 'cancel') {
            return false
        }
        var  sizeDocument=((document.size / 1000) / 1000).toFixed(2)
        if(sizeDocument<=2){
            handleChange("document", document)
        }
        else{
            setError("document",["Document trop volumineux(max:2M)"])
        }
        
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
                    <Text style={styles.Title}>Nouveau courrier entrant</Text>
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
                                        style={styles.radioBtn}
                                    >
                                        {data?.expediteurtpe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                        <Text style={styles.radioLabel}>Personne physique</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleChange("expediteurtpe", 2)}
                                        style={styles.radioBtn}
                                    >
                                        {data?.expediteurtpe == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                        <Text style={styles.radioLabel}>Personne morale</Text>
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


                            {data.expediteurtpe == 2 ? 
                            <TouchableOpacity style={styles.selectContainer}
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
                            <TouchableOpacity style={[styles.selectContainer,hasError("document") && { borderColor: "red"}]}
                                onPress={selectdocument}
                            >
                                <View style={{}}>
                                    <Text style={[styles.selectLabel, hasError("document") && {  color: 'red' }]}>
                                        Document du courrier
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
                        {hasError('document') ? <Text style={{marginTop:-10,paddingHorizontal:30,fontSize:12,color:"red"}}> {getError('document')} </Text>:null}

                        <View style={styles.inputCard}>

                            <View style={styles.selectContainer}
                            >
                                <View style={{}}>

                                    <Text style={[styles.selectLabel]}>
                                        Nature du courrier
                                    </Text>

                                    <TouchableOpacity
                                        onPress={selectNature}
                                        style={styles.radioBtn}
                                    >
                                        {data?.isconfidentiel == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                        <Text style={styles.radioLabel} >Confidentiel</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                            
                            

                            {data.isconfidentiel == 1 ? 
                            <>
                            <View style={styles.selectContainer}>
                                <View style={{}}>
                                <Text style={[styles.selectLabel]}>
                                        Séléctionner type destinataire
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
                                        {data?.destinatairetpe == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                        <Text style={styles.radioLabel}>Personne </Text>
                                    </TouchableOpacity>
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
                                   {data.selectedDest?data.selectedDest.length:null} déstinataire{data.selectedDest.length > 1 && 's'}
                               </Text> : <Text style={[styles.selectedValue, { color: '#333' }]}>
                                   {/* {nbres?nbres:null}déstinataire{nbres> 1 && 's'} */}
                               </Text>}
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
                                    {data.datereception && <Text style={styles.rightDateText1}>
                                        {moment(data.datereception).format("DD/MM/YYYY")}
                                    </Text>}
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
                            <TouchableOpacity style={styles.selectContainer} onPress={() => setSignatureVisible(true)}>
                                <View style={{}}>

                                    <Text style={styles.selectLabel}>Date de signature</Text>
                                    {data.signaturedate && <Text style={styles.rightDateText1}>
                                        {moment(data.signaturedate).format("DD/MM/YYYY")}
                                    </Text>}
                                </View>

                            </TouchableOpacity>
                        </View>
                        {signatureVisible &&
                            <DateTimePicker
                                value={data.signaturedate}
                                mode={mode}
                                onChange={dateChangesignature}
                            />
                        }
                    </View>
                </ScrollView>
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