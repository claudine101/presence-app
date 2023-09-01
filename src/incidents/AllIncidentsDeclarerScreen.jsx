import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import AppHeader from "../components/app/AppHeader";
import { COLORS } from "../styles/COLORS"
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useState } from "react";
import fetchApi from "../helpers/fetchApi";
import moment from 'moment'

/**
 * Le screen pour afficher tous les incidents declarer par un agents
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 1/09/2023
 * @returns 
 */


export default function AllIncidentsDeclarerScreen() {
        const navigation = useNavigation()
        const [loading, setLoading] = useState(false)
        const [allIncidents, setAllIncidents] = useState([])

        useFocusEffect(useCallback(() => {
                (async () => {
                        try {
                                setLoading(true)
                                const res = await fetchApi(`/types/incident/allTypesIncidents/allIncidents/declarer`)
                                setAllIncidents(res.result)
                        } catch (error) {
                                console.log(error)
                        } finally {
                                setLoading(false)
                        }
                })()
        }, []))
        return (
                <>
                        <AppHeader />
                        <View style={styles.container}>
                                <View style={styles.cardHeader}>
                                        <View style={styles.modalHeader}>
                                                <Text style={styles.modalTitle}>Les Incidents</Text>
                                        </View>
                                        <TouchableOpacity style={styles.buttonPlus}
                                                onPress={() => navigation.navigate("NewIncidentsDeclarerScreen")}
                                        >
                                                <Text style={styles.buttonTextPlus}>Nouveau</Text>
                                        </TouchableOpacity>
                                </View>
                                <FlatList
                                        style={styles.contain}
                                        data={allIncidents}
                                        renderItem={({ item: incident, index }) => {
                                                return (
                                                        <>
                                                                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <ActivityIndicator animating size={'large'} color={'#777'} />
                                                                </View>:
                                                                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                                                        key={index}
                                                                // onPress={() => handleSubmit(volume)}
                                                                >
                                                                        <View style={styles.cardNotification}>
                                                                                <View style={styles.entetePrincipal}>
                                                                                        <View style={styles.entete}>
                                                                                                <View style={styles.cardImages}>
                                                                                                        <MaterialIcons name="report-problem" size={30} color="black" />
                                                                                                </View>
                                                                                        </View>
                                                                                        <View style={styles.itemsCard}>
                                                                                                <View style={styles.itemContainer}>
                                                                                                        <Text style={styles.username} numberOfLines={1} >{incident?.types_incidents?.TYPE_INCIDENT}</Text>
                                                                                                        <Text style={styles.date} numberOfLines={2}>{moment(incident?.DATE_INSERTION).format('DD-MM-YYYY, HH:mm')}</Text>
                                                                                                </View>
                                                                                                <View style={styles.itemContainer}>
                                                                                                        <Text style={styles.contenu} numberOfLines={2}>{incident.DESCRIPTION}</Text>
                                                                                                </View>
                                                                                        </View>
                                                                                </View>
                                                                        </View>
                                                                </TouchableNativeFeedback>}
                                                        </>
                                                )
                                        }}

                                />

                        </View>
                </>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#ddd'
        },
        cardNotification: {
                backgroundColor: "#fff",
                padding: 10,
                marginBottom: 5,
                borderRadius: 10,
                marginHorizontal: 10,
        },
        entetePrincipal: {
                flexDirection: "row"
        },
        entete: {
                flexDirection: "row"
        },
        cardImages: {
                backgroundColor: "#ddd",
                width: 50,
                height: 50,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
        },
        itemsCard: {
                marginLeft: 10,
                flex: 1
        },
        itemContainer: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center',
                marginBottom: 5
        },
        username: {
                fontWeight: 'bold',
                fontSize: 15,
                color: "#000",
                maxWidth: "60%"
        },
        date: {
                justifyContent: "space-between",
                textAlign: "right",
                color: "#777",
                fontSize: 13
        },
        contenu: {
                opacity: 0.8,
                color: '#777'
        },
        buttonPlus: {
                width: 80,
                height: 40,
                borderRadius: 10,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginHorizontal: 10,
                marginBottom: 10
        },
        buttonTextPlus: {
                color: "#fff",
                fontWeight: "bold"
        },
        cardHeader: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 7
        },
        modalHeader: {
                alignItems: "center",
                paddingHorizontal: 10,
                marginTop: 7
        },
        modalTitle: {
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 16
        },

})