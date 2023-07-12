import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../styles/COLORS';
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';

/**
 * Le screen pour  mettre le volume detailler dans un malle
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 12/7/2021
 * @returns 
 */

export default function AgentSuperviseurMalleScreen() {
        const navigation = useNavigation()

        const [data, handleChange, setValue] = useForm({
                malle: '',
                aille: ''
        })

        const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
                dossier: {
                        required: true
                },
                aille: {
                        required: true
                }
        }, {
                dossier: {
                        required: 'ce champ est obligatoire',
                },
                aille: {
                        required: 'ce champ est obligatoire',
                }
        })

        // Batiment select
        const batimentModalizeRef = useRef(null);
        const [batiments, setBatiments] = useState(null);
        const openBatimentModalize = () => {
                batimentModalizeRef.current?.open();
        };
        const setSelectedBatiment = (bat) => {
                batimentModalizeRef.current?.close();
                setBatiments(bat)
        }

        // Distributeur select
        const distributrutModalizeRef = useRef(null);
        const [distributeur, setDistributeur] = useState(null);
        const openDistributeurModalize = () => {
                distributrutModalizeRef.current?.open();
        };
        const setSelectedDistibuteur = (distr) => {
                distributrutModalizeRef.current?.close();
                setDistributeur(distr)
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

        //Composent pour afficher le modal des batiments 
        const BatimentList = () => {
                return (
                        <>
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Les batiments</Text>

                                        </View>
                                        <ScrollView>
                                                <TouchableNativeFeedback >
                                                        <View style={styles.modalItem} >
                                                                <View style={styles.modalImageContainer}>
                                                                        <FontAwesome5 name="house-damage" size={20} color="black" />
                                                                </View>
                                                                <Text style={styles.itemTitle}>dgdg</Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        </ScrollView>
                                </View>
                        </>
                )
        }

        //Composent pour afficher le modal de liste des distrubuteur 
        const DistributeurAgentList = () => {
                return (
                        <>
                                <View style={styles.modalContainer}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Les distributeurs</Text>

                                        </View>
                                        <ScrollView>
                                                <TouchableNativeFeedback >
                                                        <View style={styles.modalItem} >
                                                                <View style={styles.modalImageContainer}>
                                                                        <AntDesign name="addusergroup" size={24} color="black" />
                                                                </View>
                                                                <Text style={styles.itemTitle}>dgdg</Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                        </ScrollView>
                                </View>
                        </>
                )
        }

        const submitInMalle = async () => {
                try {
                        const form = new FormData()
                        form.append('USER', data.malle)
                        form.append('USER', data.aille)

                        // form.append('VOLUME', JSON.stringify(activity))
                        if (data.document) {
                                let localUri = data.document.uri;
                                let filename = localUri.split('/').pop();
                                form.append("document", {
                                        uri: data.document.uri, name: filename, type: data.document.mimeType
                                })
                        }
                        console.log(form)
                }
                catch (error) {
                        console.log(error)
                }
        }


        return (
                <View style={styles.container}>
                        <View style={styles.cardHeader}>
                                <TouchableNativeFeedback
                                        onPress={() => navigation.goBack()}
                                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                        <View style={styles.backBtn}>
                                                <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                        </View>
                                </TouchableNativeFeedback>
                                <Text style={styles.titlePrincipal}>Detail de volume dans un malle</Text>
                        </View>
                        <ScrollView>
                                <View>
                                        <View style={styles.selectContainer}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Volume
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdh
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>
                                        <View style={{ marginVertical: 8 }}>
                                                <OutlinedTextField
                                                        label="Numero de la malle"
                                                        fontSize={14}
                                                        baseColor={COLORS.smallBrown}
                                                        tintColor={COLORS.primary}
                                                        containerStyle={{ borderRadius: 20 }}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        errorColor={COLORS.error}
                                                        value={data.malle}
                                                        onChangeText={(newValue) => handleChange('malle', newValue)}
                                                        onBlur={() => checkFieldData('malle')}
                                                        error={hasError('malle') ? getError('malle') : ''}
                                                        autoCompleteType='off'
                                                        blurOnSubmit={false}
                                                />
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openBatimentModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le batiment
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdggk
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
                                        <View style={{ marginVertical: 8 }}>
                                                <OutlinedTextField
                                                        label="Numero de l'aille"
                                                        fontSize={14}
                                                        baseColor={COLORS.smallBrown}
                                                        tintColor={COLORS.primary}
                                                        containerStyle={{ borderRadius: 20 }}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        errorColor={COLORS.error}
                                                        value={data.aille}
                                                        onChangeText={(newValue) => handleChange('aille', newValue)}
                                                        onBlur={() => checkFieldData('aille')}
                                                        error={hasError('aille') ? getError('aille') : ''}
                                                        autoCompleteType='off'
                                                        blurOnSubmit={false}
                                                />
                                        </View>
                                        <TouchableOpacity style={styles.selectContainer} onPress={openDistributeurModalize}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Selectioner le distributeur
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        hdhdggk
                                                                </Text>
                                                        </View>
                                                </View>
                                        </TouchableOpacity>
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
                                </View>
                        </ScrollView>
                        <TouchableWithoutFeedback
                                onPress={submitInMalle}
                        >
                                <View style={styles.button}>
                                        <Text style={styles.buttonText}>Enregistrer</Text>
                                </View>
                        </TouchableWithoutFeedback>

                        <Portal>
                                <Modalize ref={batimentModalizeRef}  >
                                        <BatimentList />
                                </Modalize>
                        </Portal>
                        <Portal>
                                <Modalize ref={distributrutModalizeRef}  >
                                        <DistributeurAgentList />
                                </Modalize>
                        </Portal>
                </View>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                marginHorizontal: 10,
                marginTop: -20
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
        titlePrincipal: {
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 10,
                color: COLORS.primary
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
        selectedValue: {
                color: '#777'
        },
        modalHeader: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 5
        },
        modalItem: {
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F1F1F1'
        },
        modalImageContainer: {
                width: 40,
                height: 40,
                backgroundColor: '#F1F1F1',
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center"
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
        },
        itemTitle: {
                marginLeft: 10
        },
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: "#18678E",
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
})