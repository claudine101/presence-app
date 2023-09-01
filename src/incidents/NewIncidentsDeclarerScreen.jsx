import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, TouchableNativeFeedback, ScrollView, ActivityIndicator, TouchableWithoutFeedback } from "react-native";
import AppHeader from "../components/app/AppHeader";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from "../hooks/useForm";
import { useFormErrorsHandle } from "../hooks/useFormErrorsHandle";
import { COLORS } from "../styles/COLORS"
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useRef } from "react";
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/app/Loading";
import fetchApi from "../helpers/fetchApi";

/**
 * Le screen pour creer une incidents
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 1/09/2023
 * @returns 
 */


export default function NewIncidentsDeclarerScreen() {
        const [loadingData, setLoadingData] = useState(false)
        const navigation = useNavigation()

        const [data, handleChange, setValue] = useForm({
                description: "",
                newTypes:""
        })
        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                description: {
                        required: true,
                }
        }, {
                description: {
                        required: "La description est obligatoire",
                },
        })

        const isValidAdd = () => {
                var isValid = false
                isValid = types != null ? true : false
                return isValid && isValidate()
        }

        // Types incidents select
        const typeIncidentModalizeRef = useRef(null);
        const [types, setTypes] = useState(null);
        const openTypeIncidentModalize = () => {
                typeIncidentModalizeRef.current?.open();
        };
        const setSelectedTypeIncident = (type) => {
                typeIncidentModalizeRef.current?.close();
                setTypes(type)
        }


        //Composent pour afficher la liste des types d'incidents
        const TypeIncidentList = () => {
                const [loadingTypes, TypesIncidentsAll] = useFetch('/types/incident/allTypesIncidents')

                return (
                        <>
                                {loadingTypes ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }} >
                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                </View > :
                                        <View style={styles.modalContainer}>
                                                <View style={styles.modalHeader}>
                                                        <Text style={styles.modalTitle}>Sélectionner le type</Text>
                                                </View>
                                                {TypesIncidentsAll.result?.length == 0 ? <View style={styles.modalHeader}><Text>Aucun types trouvés</Text></View> : null}
                                                <View style={styles.modalList}>
                                                        <TouchableNativeFeedback onPress={() => setSelectedTypeIncident('autre')}>
                                                                <View style={styles.modalItem}>
                                                                        {types == 'autre' ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />:
                                                                        <MaterialIcons name="check-box-outline-blank" size={24} color="black" />}
                                                                        <Text numberOfLines={1} style={styles.modalText}>Autre</Text>
                                                                </View>
                                                        </TouchableNativeFeedback>
                                                        {TypesIncidentsAll.result.map((type, index) => {
                                                                return (
                                                                        <ScrollView key={index}>
                                                                                <TouchableNativeFeedback onPress={() => setSelectedTypeIncident(type)}>
                                                                                        <View style={styles.listItem} >
                                                                                                <View style={styles.listItemDesc}>
                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                {/* <Image source={{ uri: chef.PHOTO_USER }} style={styles.listItemImage} /> */}
                                                                                                                <FontAwesome5 name="typo3" size={24} color="black" />
                                                                                                        </View>
                                                                                                        <View style={styles.listNames}>
                                                                                                                <Text style={styles.itemTitle}>{type.TYPE_INCIDENT}</Text>
                                                                                                                {/* <Text style={styles.itemTitleDesc}>{chef.EMAIL}</Text> */}
                                                                                                        </View>
                                                                                                </View>
                                                                                                {types?.ID_TYPE_INCIDENT == type.ID_TYPE_INCIDENT ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                                                                        <MaterialIcons name="check-box-outline-blank" size={24} color="black" />}

                                                                                        </View>
                                                                                </TouchableNativeFeedback>
                                                                        </ScrollView>
                                                                )
                                                        })}
                                                </View>
                                        </View>
                                }
                        </>
                )
        }

        const getSelectedTypesLabel = () => {
                if (types?.TYPE_INCIDENT) {
                          return types?.TYPE_INCIDENT
                } else if (types == 'autre') {
                          return 'Autre'
                }
                return 'Cliquer pour choisir le type'
      }

        const submitIncidentData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        if(types.ID_TYPE_INCIDENT){
                                form.append('ID_TYPE_INCIDENT', types.ID_TYPE_INCIDENT)
                        }
                        if(data.description){
                                form.append('DESCRIPTION', data.description)
                        }
                        if(types=='autre'){
                                form.append('Autres', data.newTypes)
                        }
                        const incide = await fetchApi(`/types/incident/allTypesIncidents/declarer`, {
                                method: "POST",
                                body: form
                        })
                        navigation.goBack()
                }
                catch (error) {
                        console.log(error)
                } finally {
                        setLoadingData(false)
                }
        }




        return (
                <>
                         {loadingData && <Loading />}
                        <AppHeader />
                        <View style={styles.container}>
                                <View style={styles.inputs}>
                                        <View style={styles.cardTitle}>
                                                <Text style={styles.titleName}>Déclarer une incident</Text>
                                        </View>

                                        <TouchableOpacity style={styles.selectContainer} onPress={openTypeIncidentModalize}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <Feather name="user" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Type incident
                                                        </Text>
                                                </View>
                                                 <Text style={styles.selectedValue}>
                                                        {getSelectedTypesLabel()}
                                                </Text>
                                        </TouchableOpacity>
                                        {types == 'autre' && <View style={{ marginVertical: 8 }}>
                                                <OutlinedTextField
                                                        label="Types"
                                                        fontSize={14}
                                                        baseColor={COLORS.smallBrown}
                                                        tintColor={COLORS.primary}
                                                        containerStyle={{ borderRadius: 20 }}
                                                        lineWidth={0.25}
                                                        activeLineWidth={0.25}
                                                        errorColor={COLORS.error}
                                                        value={data.newTypes}
                                                        onChangeText={(newValue) => handleChange('newTypes', newValue)}
                                                        onBlur={() => checkFieldData('newTypes')}
                                                        error={hasError('newTypes') ? getError('newTypes') : ''}
                                                        autoCompleteType='off'
                                                        blurOnSubmit={false}
                                                        multiline
                                                />
                                        </View>}
                                        <View style={{ marginVertical: 8 }}>
                                                <OutlinedTextField
                                                        label="Description"
                                                        fontSize={14}
                                                        baseColor={COLORS.smallBrown}
                                                        tintColor={COLORS.primary}
                                                        containerStyle={{ borderRadius: 20 }}
                                                        lineWidth={0.25}
                                                        activeLineWidth={0.25}
                                                        errorColor={COLORS.error}
                                                        value={data.description}
                                                        onChangeText={(newValue) => handleChange('description', newValue)}
                                                        onBlur={() => checkFieldData('description')}
                                                        error={hasError('description') ? getError('description') : ''}
                                                        autoCompleteType='off'
                                                        blurOnSubmit={false}
                                                        multiline
                                                />
                                        </View>
                                </View>
                        </View>

                        <TouchableWithoutFeedback
                                disabled={!isValidAdd()}
                                onPress={submitIncidentData}
                        >
                                <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                </View>
                        </TouchableWithoutFeedback>
                        <Modalize ref={typeIncidentModalizeRef}  >
                                <TypeIncidentList />
                        </Modalize>
                </>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#fff'
        },
        inputs: {
                marginHorizontal: 10
        },
        cardTitle: {
                paddingVertical: 8
        },
        titleName: {
                fontWeight: "bold",
                fontSize: 16
        },
        selectContainer: {
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#ddd",
                marginVertical: 10
        },
        selectedValue: {
                color: '#777',
                marginTop: 2
        },
        labelContainer: {
                flexDirection: 'row',
                alignItems: 'center'
        },
        selectLabel: {
                marginLeft: 5
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
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#ddd',
                justifyContent: 'center',
                alignItems: 'center'
        },
        listItemImage: {
                width: '90%',
                height: '90%',
                borderRadius: 10
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
        button: {
                marginTop: 10,
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
        modalItem: {
                paddingVertical: 10,
                paddingHorizontal: 10,
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center'
        },
        modalText: {
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 10
        },
})