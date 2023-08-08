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
                                <View style={styles.cardHeader}>
                                        <TouchableNativeFeedback
                                                onPress={() => navigation.goBack()}
                                                background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                <View style={styles.backBtn}>
                                                        <Ionicons name="arrow-back-sharp" size={24} color="#fff" />
                                                </View>
                                        </TouchableNativeFeedback>
                                        <View style={styles.cardTitle}>
                                                <Text numberOfLines={2} style={styles.titlePrincipal}>Details des folios</Text>
                                        </View>
                                </View>
                                <ScrollView>
                                        <View style={styles.selectContainer}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Chaine
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {details.folio.equipe.CHAINE}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.selectContainer}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Odinateur
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {details.folio.equipe.ORDINATEUR}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.selectContainer}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Nom du dossier
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {details.folio.NUMERO_FOLIO}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.selectContainer}>
                                                <View>
                                                        <Text style={styles.selectLabel}>
                                                                Equipe scanning
                                                        </Text>
                                                        <View>
                                                                <Text style={styles.selectedValue}>
                                                                        {details.folio.equipe.NOM_EQUIPE}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>
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
                                        </View>:null}
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
                backgroundColor: COLORS.primary,
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
        cardTitle: {
                maxWidth: "85%"
        },
        selectContainer: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 13,
                borderRadius: 5,
                // borderWidth: 0.5,
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
        modalItemCard: {
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1
        },
        itemTitle: {
                marginLeft: 10
        },
        itemTitleDesc: {
                color: "#777",
                marginLeft: 10,
                fontSize: 11
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 10,
                fontSize: 16
        },
        addImageItem: {
                borderWidth: 0.5,
                borderColor: "#000",
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginBottom: 5,
                marginTop: 7
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
                backgroundColor:COLORS.primary,
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
                backgroundColor:COLORS.primary,
                marginHorizontal: 50,
                marginVertical: 15
        },
        inputLabel: {
                color: '#000',
                fontWeight: 'bold',
                marginVertical: 5,
                marginTop: 10
      },
})