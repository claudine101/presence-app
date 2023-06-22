import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import fetchApi from "../../helpers/fetchApi";


/**
 * Screen pour afficher  les incidents
 * @author NDAYISABA Claudine <claudine@mediabox.bi>
 * @date 10/05/2023 à   10:26
 * @returns 
 */

const Incident = ({ incident, index, handleincidentPress, selectedincident }) => {
    return (
        <TouchableNativeFeedback onPress={() => handleincidentPress(incident)}>

            <View style={styles.institution}>
                <View style={styles.institutionLeftSide}>
                    <View style={styles.logoContainer}>
                        {incident.IMAGE ?
                            <Image source={{ uri: incident.IMAGE }} style={styles.logoInstitution} /> :
                            <FontAwesome5 name="building" size={24} color="#fff" />
                        }
                    </View>
                    <View style={styles.institutionDetails}>
                        <Text style={styles.institutionName} numberOfLines={1} >
                           {incident.DESCRIPTION}
                        </Text>
                    </View>
                </View>
                {selectedincident && selectedincident.ID_INCIDENT_COURRIER == incident.ID_INCIDENT_COURRIER ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
            </View>
        </TouchableNativeFeedback>
    )
}

const ListHeader = ({ handleincidentPress, selectedincident, newIncident,previousRouteName }) => {
    const navigation = useNavigation()
    const route = useRoute()
    const previousRouteincidet = navigation.getState().routes[navigation.getState().index - 1].name
    return (
        <View style={styles.listHeader}>

            <TouchableNativeFeedback onPress={() => navigation.navigate("NewIncidentScreen", { newIncident, previousRouteName, ...route.params })}>

                <View style={[styles.institution]}>
                    <View style={styles.institutionLeftSide}>
                        <View style={[styles.logoContainer, { backgroundColor: '#18678E' }]}>
                            <AntDesign name="plus" size={24} color="#fff" />
                        </View>
                        <View style={styles.institutionDetails}>
                            <Text style={styles.institutionName} numberOfLines={1} >
                                Nouveau incident
                            </Text>
                            <Text style={styles.institutionAddress} numberOfLines={1} >
                                Enregistrer une Nouveau incident
                            </Text>
                        </View>
                    </View>
                    {selectedincident && selectedincident.ID_INCIDENT_COURRIER== 'new' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}


                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

export default function IncidentScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [remets, setRemets] = useState([])

    const { incident, newIncident ,previousRouteName,courrier} = route.params

    const previousRouteincident = navigation.getState().routes[navigation.getState().index - 1].name
    const [isInSearch, setIsInSearch] = useState(false)
    const [selectedincident, setSelectedincident] = useState(incident)
    const [q, setQ] = useState('')
    const handleincidentPress = remets => {
        setSelectedincident(remets)
        navigation.navigate(previousRouteincident, { ...route.params, incident: remets })
    }

    const handleBackPress = useCallback(() => {
        if (isInSearch) {
            setIsInSearch(false)
            return false
        }
        navigation.goBack()
    }, [isInSearch])
    const handleSearchPress = () => {
        setIsInSearch(true)
    }



    useEffect(() => {
        (async () => {
            if (q && q.trim() != '') {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/signale/incident?q=${q}`)
                    setRemets(remt.result)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            } else {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/signale/incident`)
                    setRemets(remt.result)

                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        })()
    }, [q])

    useFocusEffect(useCallback(() => {
        (async () => {
            try {
                const remt = await fetchApi('/signale/incident')
                setRemets(remt.result)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.exiitSearch}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleBackPress}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="arrow-back-outline" size={24} color="#18678E" />
                        </View>
                    </TouchableNativeFeedback>
                    {!isInSearch ? <Text style={styles.title}>{ "Sélectionner incident" }</Text> : null}
                    {isInSearch ? <TextInput autoFocus style={styles.searchInput} value={setQ} onChangeText={n => setQ(n)} /> : false}
                </View>
                {!isInSearch ? <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleSearchPress}>
                    <View style={styles.headerBtn}>
                        <Feather name="search" size={24} color="#18678E" />
                    </View>
                </TouchableNativeFeedback> : null}
            </View>
            {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating size={'large'} color='#000' />
            </View> :
                <FlatList
                    data={remets}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => {
                        return (
                            <Incident incident={item} index={index}
                                selectedincident={selectedincident}
                                handleincidentPress={handleincidentPress}
                            />
                        )
                    }}
                    ListHeaderComponent={() => <ListHeader
                        selectedincident={selectedincident} newIncident={selectedincident && selectedincident.ID_INCIDENT_COURRIER == "new" ? selectedincident : null}
                        handleincidentPress={handleincidentPress}
                        previousRouteName={previousRouteName}
                    />}

                    keyboardShouldPersistTaps='handled'
                />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    exiitSearch: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerBtn: {
        padding: 10,
        borderRadius: 20
    },
    searchInput: {
        flex: 1
    },
    title: {
        fontWeight: 'bold',
        opacity: 0.8,
        color: "#18678E",
        fontSize: 16,
        marginLeft: 5
    },
    institution: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    institutionLeftSide: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#85969F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoInstitution: {
        width: '95%',
        height: '95%',
        borderRadius: 100
    },
    institutionDetails: {
        marginLeft: 10
    },
    institutionName: {
        fontWeight: 'bold',
        opacity: 0.8
    },
    institutionAddress: {
        color: '#777',
        fontSize: 12
    },
    listHeader: {
    }
})