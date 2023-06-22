import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View, TouchableWithoutFeedback } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, AntDesign, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
import fetchApi from "../../helpers/fetchApi";
import { COLORS } from "../../styles/COLORS";


/**
 * Screen pour lister les utilisateurs
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 27/04/2023
 * @returns 
 */

const Remet = ({ remet, index, handleUtilPress, selectedUtilis, isSelected }) => {
    return (
        <TouchableNativeFeedback onPress={() => handleUtilPress(remet)}>

            <View style={styles.institution}>
                <View style={styles.institutionLeftSide}>
                    <View style={styles.logoContainer}>
                        {remet.IMAGE ?
                            <Image source={{ uri: remet.IMAGE }} style={styles.logoInstitution} /> :
                            <AntDesign name="user" size={24} color="white" />
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
                {/* <MaterialIcons name="check-box-outline-blank" size={24} color="black" /> */}

                {isSelected(remet.USERS_ID) ? <MaterialIcons name="check-box" size={24} color="#18678E" /> :
                    <MaterialIcons name="check-box-outline-blank" size={24} color="black" />}
            </View>
        </TouchableNativeFeedback>
    )
}


export default function DestinataireScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [remets, setRemets] = useState([])
    const [isInSearch, setIsInSearch] = useState(false)
    const { utilis,departemant,previousRouteName, newRemettant,selectedDest, selectedUsers, courrier, selectedAffect, inAffect, inEdit } = route.params
    const [selectedUser, setselectedUser] = useState(selectedDest)
    const [selectedUtilis, setUtilis] = useState(utilis)
    const [q, setQ] = useState('')
    const handleUtilPress = remets => {
        if (isSelected(remets.USERS_ID)) {
            const newusers = selectedUser.filter(u => u.USERS_ID != remets.USERS_ID)
            setselectedUser(newusers)
        } else {
            setselectedUser(u => [...u, remets])
        }
        setUtilis(remets)

        // navigation.navigate("CourrierScreen", {utilis:remets })
    }
    /**
     * fonction utiliser   pour faire recherche d'un destinataire 
     * @author NDAYISABA Claudine <claudine@mediabox.bi>
     * @date 17/05/2023 à 15:15
     * @returns 
     */
    const handleSearchPress = () => {
        setIsInSearch(true)
    }
    useEffect(() => {
        if (selectedUsers) {
            setselectedUser(selectedUsers)
        }

    }, [])

    const enregistrement = async () => {
        if (inAffect) {
            navigation.navigate("AffecterCourrierScreen", {
                ...route.params,
                selectedDest:selectedUser
            })
        }
        else if (inEdit) {
            navigation.navigate("UpdateCourrierScreen", {
                ...route.params,
                selectedDest:selectedUser

            })

        }
        else {
            navigation.navigate(previousRouteName, {...route.params, selectedDest:selectedUser })
        }

    }

    const isSelected = id_user => selectedUser.find(u => u.USERS_ID == id_user) ? true : false

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [])

    useEffect(() => {
        (async () => {
            if (q && q.trim() != '') {
                try {
                    setLoading(true)
                    if (inAffect) {
                        const remt = await fetchApi(`/services/user/${departemant.DEPARTEMENT_ID}  ? q=${courrier.ID_COURRIER_ENTRANT}&reserch=${q}`)
                        setRemets(remt.result)
                    }
                    else {
                        const remt = await fetchApi(`/services/user/${departemant.DEPARTEMENT_ID}  ?q=${0}&reserch=${q}`)
                        setRemets(remt.result)
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }

            }
            else{
                try {
                    setLoading(true)
                    if (inAffect) {
                        const remt = await fetchApi(`/services/user/${departemant.DEPARTEMENT_ID}  ? q=${courrier.ID_COURRIER_ENTRANT}`)
                        setRemets(remt.result)
                    }
                    else {
                        const remt = await fetchApi(`/services/user/${departemant.DEPARTEMENT_ID} ? q=${0}`)
                        setRemets(remt.result)
                    }
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
                if (inAffect) {
                const remt = await fetchApi(`/services/user/${departemant.DEPARTEMENT_ID}  ? q=${courrier ? courrier.ID_COURRIER_ENTRANT : 0} `)
                setRemets(remt.result) 
            }
            else{
                const remt = await fetchApi(`/services/user/${departemant.DEPARTEMENT_ID}  ? q=${0} && reserch=${q}` )
                setRemets(remt.result) 
            }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, []))

    //     const handleBackPress = () => {
    //         navigation.goBack()
    // }
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
                                selectedUtilis={selectedUtilis}
                                handleUtilPress={handleUtilPress}
                                isSelected={isSelected}
                            />

                        )
                    }}
                    keyboardShouldPersistTaps='handled'
                />}

            <TouchableWithoutFeedback
                disabled={selectedUser.length == 0}
                onPress={enregistrement}>
                <View style={[styles.button, selectedUser.length == 0 && { opacity: 0.5 }]}>
                    <Text style={styles.buttonText}>Enregistrer</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        // textTransform:"uppercase",
        fontSize: 16,
        textAlign: "center"
    },
    button: {
        marginBottom: 20,
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginHorizontal: 20,
        backgroundColor: "#18678E",
    },
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
    title: {
        fontWeight: 'bold',
        opacity: 0.8,
        color: "#18678E",
        fontSize: 16,
        marginLeft: 5
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