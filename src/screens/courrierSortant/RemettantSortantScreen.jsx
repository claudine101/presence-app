import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import fetchApi from "../../helpers/fetchApi";


/**
 * Screen pour lister les remettants
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 28/04/2023
 * @returns 
 */
const Remet = ({ remet, index, handleRemettantPress, selectedRemettant, selectedExpediteur }) => {
    return (

        <TouchableNativeFeedback onPress={() => handleRemettantPress(remet)}>

            <View style={styles.institution}>
                <View style={styles.institutionLeftSide}>
                    <View style={styles.logoContainer}>
                        {remet.IMAGE ?
                            <Image source={{ uri: remet.IMAGE }} style={styles.logoInstitution} /> :
                            <FontAwesome5 name="user" size={24} color="#fff" />
                        }
                    </View>
                    <View style={styles.institutionDetails}>
                        <Text style={styles.institutionName} numberOfLines={1} >
                            {remet.NOM} {remet.PRENOM}
                        </Text>
                        <Text  numberOfLines={1} >
                            {remet.EMAIL}
                        </Text>
                    </View>
                </View>

                {selectedRemettant && selectedRemettant.ID_REMETTANT == remet.ID_REMETTANT ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}


            </View>
        </TouchableNativeFeedback>
    )
}

const ListHeader = ({ handleRemettantPress, selectedExpediteur, selectedRemettant, newRemettant, returnkey, newexpediteur }) => {
    const navigation = useNavigation()
    const route = useRoute()

    return (
        <View style={styles.listHeader}>

            <TouchableNativeFeedback onPress={() => navigation.navigate("NewRemettantSortantScreen", { newRemettant, returnkey, newexpediteur ,...route.params})}>

                <View style={[styles.institution]}>
                    <View style={styles.institutionLeftSide}>
                        <View style={[styles.logoContainer, { backgroundColor: '#18678E' }]}>
                            <AntDesign name="plus" size={24} color="#fff" />
                        </View>
                        <View style={styles.institutionDetails}>
                            {returnkey == "expediteur" ?
                                <>
                                    <Text style={styles.institutionName} numberOfLines={1} >
                                        Nouveau destinateur
                                    </Text>
                                    <Text style={styles.institutionAddress} numberOfLines={1} >
                                        Enregistrer un nouveau destinataire
                                    </Text>
                                </> :
                                <>
                                    <Text style={styles.institutionName} numberOfLines={1} >
                                        Nouveau remettant
                                    </Text>
                                    <Text style={styles.institutionAddress} numberOfLines={1} >
                                        Enregistrer un nouveau remettant
                                    </Text>
                                </>
                            }
                        </View>
                    </View>
                    {selectedRemettant && selectedRemettant.ID_REMETTANT == 'new' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

export default function RemettantSortantScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [remets, setRemets] = useState([])
    const { remettant, newRemettant, returnkey, expediteur, inEdit } = route.params
    // console.log(returnkey)
    const [isInSearch, setIsInSearch] = useState(false)
    const [selectedRemettant, setSelectedRemettant] = useState(null)
    const [q, setQ] = useState('')

    const handleRemettantPress = remets => {
        if (inEdit) {
            setSelectedRemettant(remets)
            navigation.navigate("UpdateCourrierSortantScreen", { ...route.params, [returnkey]: remets })
        }
        else {
            setSelectedRemettant(remets)
            navigation.navigate("CourrierSortantScreen", { [returnkey]: remets })
        }
    }

    useEffect(() => {
        if (returnkey == "expediteur") {
            setSelectedRemettant(expediteur)

        } else {
            setSelectedRemettant(remettant)
        }
    }, [])
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
                    const remt = await fetchApi(`/services/remettant?q=${q}`)
                    setRemets(remt.result)

                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            } else {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/services/remettant`)
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
                const remt = await fetchApi('/services/remettant')
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
                    {!isInSearch ? <Text style={styles.title}>{ "Sélectionner les  destinataires" }</Text> : null}
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
                            <Remet remet={item} index={index}
                                selectedRemettant={selectedRemettant}
                                handleRemettantPress={handleRemettantPress}
                            />
                        )
                    }}
                    ListHeaderComponent={() => <ListHeader
                        returnkey={returnkey}
                        handleRemettantPress={handleRemettantPress}
                        selectedRemettant={selectedRemettant}
                        newRemettant={selectedRemettant && selectedRemettant.ID_REMETTANT == "new" ? selectedRemettant : null}
                        newexpediteur={selectedRemettant && selectedRemettant.ID_REMETTANT == "new" ? selectedRemettant : null}
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
    institution: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    title: {
        fontWeight: 'bold',
        opacity: 0.8,
        color: "#18678E",
        fontSize: 16,
        marginLeft: 5
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