import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableNativeFeedbackBase, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { AntDesign, Ionicons, MaterialCommunityIcons, Entypo, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { Modalize } from "react-native-modalize";
import useFetch from "../../../hooks/useFetch";
import PROFILS from "../../../constants/PROFILS";
import Loading from "../../../components/app/Loading";
import moment from "moment";
import ImageView from "react-native-image-viewing";
import Folio from "../../../components/folio/Folio";
import Folios from "../../../components/folio/Folios";

export default function DetailsFolioUploadScreen() {
    const route = useRoute()
    const { flash } = route.params
    const [flashDetail, setFlashDetail] = useState({})
    const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
    const [pvPhoto, setPvPhoto] = useState(null)
    const navigation = useNavigation()
    const natureModalRef = useRef()
    const [loadingAgents, agents] = useFetch(`/indexation/users/${PROFILS.AGENT_INDEXATION}`)
    const [loadingFlashs, flashs] = useFetch(`/indexation/flashs`)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedType, setSelectedType] = useState([])
    const [typeDocument, setTypeDocument] = useState([])
    const [selectedFolio, setSelectedFolio] = useState(null)
    const [flashIndexes, setFlashIndexes] = useState(null)
    const flashModalRef = useRef()
    // console.log(selectedItems)
    const openFlashModalize = () => {
        flashModalRef.current?.open()
    }

    const handleFlashPress = flash => {
        flashModalRef.current?.close()
        setFlashIndexes(flash)
    }

    const isSelected = folio => selectedItems.find(f => f.ID_FOLIO == folio.ID_FOLIO) ? true : false
    const handleFolioPress = (folio) => {
        if (isSelected(folio)) {
            const newItems = selectedItems.map(f => {
                if(f.ID_FOLIO == folio.ID_FOLIO) {
                    return {
                        ...f,
                        selectedType: [...f.selectedType, ...selectedType]
                    }
                } else {
                    return f
                }
            })
            setSelectedItems(newItems)
        } else {
            setSelectedItems(items => [...items, { ...folio, selectedType }])
        }
        natureModalRef.current?.close()
    }
    const isSelectedType = type => selectedType.find(f => f.ID_TYPE_FOLIO_DOCUMENT == type.ID_TYPE_FOLIO_DOCUMENT) ? true : false
    const isSelectedTypeItems = type => {
        if (isSelectedType(type)) {
            return true
        }
        if (!isSelected(selectedFolio)) {
            return false
        }
       
        const folio = selectedItems.find(f => f.ID_FOLIO == selectedFolio?.ID_FOLIO)
        if(folio){
            const isTypeSelected = folio.selectedType.find(f => f.ID_TYPE_FOLIO_DOCUMENT == type.ID_TYPE_FOLIO_DOCUMENT)
            return isTypeSelected ? true : false
        }
        return false
        
    }

    const handleFolioPressType = (type) => {
        if (isSelectedType(type)) {
            const removed = selectedType.filter(f => f.ID_TYPE_FOLIO_DOCUMENT != type.ID_TYPE_FOLIO_DOCUMENT)
            setSelectedType(removed)

        } else {
            setSelectedType(items => [...items, type])
        }
    }
    const [data, handleChange] = useForm({
        agent: null,
        pv: null
    })
    const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
        agent: {
            required: true
        },
        pv: {
            required: true
        }
    })

    const handleFoliosPress = folio => {
        navigation.navigate("DetailsFolioFlashScreen", { folio })
    }
   
    
    const isRetourValid = () => {
        return selectedItems.length > 0 && data.pv && !isCompressingPhoto && flashIndexes ? true : false
    }
    /**
     * Permet d'envoyer le chef agent d'indexation
     * @author darcydev <darcy@mediabox.bi>
     * @date 03/08/2023
     * @returns 
     */
    const handleSubmit = async () => {
        try {
            if (!isValidate()) return false
            setIsSubmitting(true)
            const form = new FormData()
            form.append("ID_FLASH", flash.ID_FLASH)
            form.append("ID_AGENT_INDEXATION", data.agent.USERS_ID)
            if (data.pv) {
                const photo = data.pv
                let localUri = photo.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append(`pv`, {
                    uri: localUri, name: filename, type
                })
            }
            const res = await fetchApi(`/indexation/agent_indexation`, {
                method: 'POST',
                body: form
            })
            ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
            navigation.goBack()
        } catch (error) {
            console.log(error)
            ToastAndroid.show("Opération non effectuée, réessayer encore", ToastAndroid.SHORT);
        } finally {
            setIsSubmitting(false)
        }
    }

    /**
     * Permet de traiter les dossiers indexes du chef agent d'indexation
     * @author darcydev <darcy@mediabox.bi>
     * @date 03/08/2023
     * @returns 
     */
    const handleSubmitRetour = async () => {
        try {
            if (!isRetourValid()) return false
            setIsSubmitting(true)
            const form = new FormData()
            form.append("ID_FLASH_INDEXES", flashIndexes.ID_FLASH)
            form.append("ID_AGENT_INDEXATION", flashDetail.agentIndexation.USER_TRAITEMENT)
            form.append("foliosIndexesIds", JSON.stringify(selectedItems.map(folio => folio.ID_FOLIO)))
            if (data.pv) {
                const photo = data.pv
                let localUri = photo.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append(`pv`, {
                    uri: localUri, name: filename, type
                })
            }
            const res = await fetchApi(`/indexation/agent_indexation/retour/indexation_folios`, {
                method: 'POST',
                body: form
            })
            ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
            navigation.goBack()
        } catch (error) {
            console.log(error)
            ToastAndroid.show("Opération non effectuée, réessayer encore", ToastAndroid.SHORT);
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleFoliosFlashPress = folio => {
        navigation.navigate("DetailsFolioFlashScreen", { folio })
    }

    return (
        <>

            {isSubmitting && <Loading />}
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableNativeFeedback
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.title}>{flash.flashs ? flash.flashs.NOM_FLASH : null}</Text>
                </View>
                {
                    <ScrollView style={styles.inputs}>
                        <View style={styles.content}>
                            {<View style={styles.folioList}>
                                {flash.folios.map((folio, index) => {
                                    return (
                                        <>
                                        <TouchableNativeFeedback onPress={() => handleFoliosPress(folio)} key={index} >
                                        <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                                  <View style={[styles.folio]}>
                                                            <View style={styles.folioLeftSide}>
                                                                      <View style={styles.folioImageContainer}>
                                                                                <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                      </View>
                                                                      <View style={styles.folioDesc}>
                                                                                <Text style={styles.folioName}>{ folio.folio.NUMERO_FOLIO }</Text>
                                                                                <Text style={styles.folioSubname}>{ folio.folio.NUMERO_FOLIO }</Text>
                                                                      </View>
                                                            </View>
                                                            
                                                  </View>
                                        </View>
                              </TouchableNativeFeedback>
                                        </>
                                    )
                                })}
                            </View>}

                        </View>
                    </ScrollView>}

            </View>
            <Modalize
                ref={natureModalRef}
                handlePosition='inside'
                modalStyle={{
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    paddingVertical: 20
                }}
                handleStyle={{ marginTop: 10 }}
                scrollViewProps={{
                    keyboardShouldPersistTaps: "handled"
                }}
                onClosed={()=>{
                    setSelectedType([])
                }}
            >
                {loadingAgents ? null :
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Type des documents</Text>
                        </View>
                        <View style={styles.modalList}>
                            {typeDocument.map((type, index) => {
                                return (
                                    <>
                                        <TouchableNativeFeedback key={index} onPress={() => handleFolioPressType(type)}>
                                            <View style={styles.listItem}>
                                                <View style={styles.listItemDesc}>
                                                    <View style={styles.listItemImageContainer}>
                                                        <Image source={require('../../../../assets/images/dossier.png')} style={styles.listItemImage} />
                                                    </View>
                                                    <View style={styles.listNames}>
                                                        <Text style={styles.listItemTitle}>{type.NOM_DOCUMENT}</Text>
                                                        {/* <Text style={styles.listItemSubTitle}>{type.NOM_DOCUMENT}</Text> */}
                                                    </View>
                                                </View>
                                                {isSelectedTypeItems(type) ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                    <MaterialIcons style={styles.checkIndicator} name="check-box-outline-blank" size={24} color="#ddd" />}
                                            </View>
                                        </TouchableNativeFeedback>
                                    </>
                                )
                            })}
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity style={[styles.actionBtn, { opacity: !selectedType.length > 0 ? 0.5 : 1 }]} disabled={!selectedType.length > 0} onPress={() => handleFolioPress(selectedFolio)}>
                                <Text style={styles.actionText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
            </Modalize>
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
    detailsHeader: {
        paddingHorizontal: 10
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectLabel: {
        marginLeft: 5
    },
    flash: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    flashName: {
        marginLeft: 5
    },
    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        padding: 10,
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    folioImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    folioImage: {
        width: '60%',
        height: '60%'
    },
    folioDesc: {
        marginLeft: 10
    },
    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
    },
    folioList: {
        // paddingHorizontal: 10
    },
    actions: {
        padding: 10
    },
    actionBtn: {
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: COLORS.primary
    },
    actionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff'
    },
    selectContainer: {
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#ddd",
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    selectedValue: {
        color: '#777',
        marginTop: 2
    },
    content: {
        paddingHorizontal: 10
    },
    addImageItem: {
        borderWidth: 0.5,
        borderColor: "#ddd",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 5
    },
    addImageLabel: {
        marginLeft: 5,
        opacity: 0.8
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    modalTitle: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        fontSize: 16
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    listItemImageContainer: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemImage: {
        width: '30%',
        height: '30%',
    },
    listItemDesc: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listNames: {
        marginLeft: 10
    },
    listItemTitle: {
        fontWeight: 'bold'
    },
    listItemSubTitle: {
        color: '#777',
        fontSize: 12,
        marginTop: 5
    },
})