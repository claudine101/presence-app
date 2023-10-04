import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, StatusBar, ScrollView, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Image } from "react-native";
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS";
import { useFormErrorsHandle } from '../../../../hooks/useFormErrorsHandle';
import { useRef } from "react";
import { useState } from "react";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import useFetch from "../../../../hooks/useFetch";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import fetchApi from "../../../../helpers/fetchApi";
import Loading from "../../../../components/app/Loading";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { useForm } from "../../../../hooks/useForm";

/**
 * Le screen pour completer le retour de folios d'une equipe scanning
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 3/8/2021
 * @returns 
 */

export default function NewFolioRetourScreen() {
        const navigation = useNavigation()
        const route = useRoute()
        const { details } = route.params
        const [sexe, setSexe] = useState(null)
        const [loadingData, setLoadingData] = useState(false)

        const isValidAdd = () => {
                var isValid = false
                isValid = sexe != null ? true : false
                return isValid
        }
        const submitEquipeData = async () => {
                try {
                        setLoadingData(true)
                        const form = new FormData()
                        form.append('IS_RECONCILIE', sexe)
                        form.append('ID_FOLIO', details.folio.ID_FOLIO)
                        const volume = await fetchApi(`/scanning/folio/renconsilier`, {
                                method: "PUT",
                                body: form
                        })
                        // navigation.goBack()
                        navigation.navigate("AllFoliosSuperviseurPvScreen")
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
                                                <Text style={styles.title} numberOfLines={2}>Folios reconciliers</Text>
                                        </View>
                                </View>
                                <ScrollView style={styles.inputs}>
                                        <TouchableOpacity style={styles.selectContainer}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Chaine
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {details.folio.equipe.CHAINE}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Odinateur
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {details.folio.equipe.ORDINATEUR}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Nom du dossier
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {details.folio.NUMERO_FOLIO}
                                                </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.selectContainer}>
                                                <View style={styles.labelContainer}>
                                                        <View style={styles.icon}>
                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                        </View>
                                                        <Text style={styles.selectLabel}>
                                                                Equipe scanning
                                                        </Text>
                                                </View>
                                                <Text style={styles.selectedValue}>
                                                        {details.folio.equipe.NOM_EQUIPE}
                                                </Text>
                                        </TouchableOpacity>
                                        {details.folio.IS_RECONCILIE == null ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={styles.inputLabel}>Scan et rencocilier</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <TouchableWithoutFeedback onPress={() => setSexe(1)}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15 }} >
                                                                        <Text style={{ color: "#000" }}>Qui</Text>
                                                                        {sexe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#007bff" style={{ marginLeft: 5 }} /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={20} color="#777" style={{ marginLeft: 5 }} />}
                                                                </View>
                                                        </TouchableWithoutFeedback>
                                                        <TouchableWithoutFeedback s onPress={() => setSexe(0)}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15 }}>
                                                                        <Text style={{ color: "#000" }}>Non</Text>
                                                                        {sexe == 0 ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#007bff" style={{ marginLeft: 5 }} /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={20} color="#777" style={{ marginLeft: 5 }} />}
                                                                </View>
                                                        </TouchableWithoutFeedback>
                                                </View>
                                        </View> : null}
                                </ScrollView>
                                <TouchableWithoutFeedback
                                        disabled={!isValidAdd()}
                                        onPress={submitEquipeData}
                                >
                                        <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                                                <Text style={styles.buttonText}>Enregistrer</Text>
                                        </View>
                                </TouchableWithoutFeedback>
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
                // color: COLORS.primary
        },
        cardTitle: {
                maxWidth: "85%"
        },
        inputs: {
                paddingHorizontal: 10
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
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F1F1F1'
        },
        listItemImageContainer: {
                width: 50,
                height: 50,
                borderRadius: 10,
                backgroundColor: '#ddd',
                justifyContent: 'center',
                alignItems: 'center'
        },
        listItemImage: {
                width: '60%',
                height: '60%',
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
        button: {
                marginTop: 10,
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 10,
                backgroundColor: COLORS.primary,
                marginHorizontal: 10,
                marginBottom:5
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        buttonText: {
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center"
        },
        butConfirmer: {
                borderRadius: 8,
                paddingVertical: 14,
                backgroundColor: COLORS.primary,
                marginHorizontal: 50,
                marginVertical: 15
        },
})