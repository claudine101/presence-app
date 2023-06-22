import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import fetchApi from "../../helpers/fetchApi";


/**
 * Screen pour lister les NUMERO CLASSEUR
 * @author NDAYISABA claudine <claudine@mediabox.bi>
 * @date 12/06/2023 à 11:24
 * @returns 
 */

const Departemant = ({ departemant, index, handleDepartemantPress, selecteddepartemant }) => {
    return (
        <TouchableNativeFeedback onPress={() => handleDepartemantPress(departemant)}>

            <View style={styles.institution}>
                <View style={styles.institutionLeftSide}>
                    <View style={styles.logoContainer}>
                        {departemant.IMAGE ?
                            <Image source={{ uri: departemant.IMAGE }} style={styles.logoInstitution} /> :
                            <FontAwesome5 name="building" size={24} color="#fff" />
                        }
                    </View>
                    <View style={styles.institutionDetails}>
                        <Text style={styles.institutionName} numberOfLines={1} >
                            {departemant.NUMERO_CLASSEUR}
                        </Text>
                    </View>
                </View>
                {selecteddepartemant && selecteddepartemant.ID_CLASSEUR == departemant.ID_CLASSEUR ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
            </View>
        </TouchableNativeFeedback>
    )
}

const ListHeader = ({ handleDepartemantPress, selecteddepartemant, newNumero,previousRouteName }) => {
    const navigation = useNavigation()
    const route = useRoute()
    return (
        <View style={styles.listHeader}>

            <TouchableNativeFeedback onPress={() => navigation.navigate("NewNumeroClasseurScreen", { newNumero, previousRouteName, ...route.params })}>
                <View style={[styles.institution]}>
                    <View style={styles.institutionLeftSide}>
                        <View style={[styles.logoContainer, { backgroundColor: '#18678E' }]}>
                            <AntDesign name="plus" size={24} color="#fff" />
                        </View>
                        <View style={styles.institutionDetails}>
                            <Text style={styles.institutionName} numberOfLines={1} >
                                Nouveau classeur
                            </Text>
                            <Text style={styles.institutionAddress} numberOfLines={1} >
                                Enregistrer une Nouveau classeur
                            </Text>
                        </View>
                    </View>
                    {selecteddepartemant && selecteddepartemant.ID_CLASSEUR == 'new' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}


                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

export default function NumeroClasseurScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [departemants, setDepartemants] = useState([])
    const { departemant, newDepartemant,societe ,previousRouteName} = route.params
    const [isInSearch, setIsInSearch] = useState(false)
    const [selecteddepartemant, setSelectedDepartemante] = useState(departemant)
    const [q, setQ] = useState('')
    const handleDepartemantPress = departemants => {
        setSelectedDepartemante(departemants)
        navigation.navigate(previousRouteName, { ...route.params,departemant:departemant, numeroClasseur: departemants })
    }
    const handleBackPress = useCallback(() => {
        if (isInSearch) {
            setIsInSearch(false)
            return false
        }
        navigation.goBack()
    }, [isInSearch])
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
        (async () => {
            if (q && q.trim() != '') {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/services/numero/${departemant.DEPARTEMENT_ID}?q=${q}`)
                    setDepartemants(remt.result)
                } catch (error) {
                    console.log(error)
                }
                 finally {
                    setLoading(false)
                }
            }else {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/services/numero/${departemant.DEPARTEMENT_ID}`)
                    setDepartemants(remt.result)
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
                const remt = await fetchApi(`/services/numero/${departemant.DEPARTEMENT_ID}`)
                setDepartemants(remt.result)
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
                    {!isInSearch ? <Text style={styles.title}>{ "Sélectionner le departement" }</Text> : null}
                    {isInSearch ? <TextInput autoFocus style={styles.searchInput} value={q} onChangeText={n => setQ(n)} /> : false}
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
                    data={departemants}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => {
                        return (
                            <Departemant departemant={item} index={index}
                                selecteddepartemant={selecteddepartemant}
                                handleDepartemantPress={handleDepartemantPress}
                            />
                        )
                    }}
                    ListHeaderComponent={() => <ListHeader
                        selecteddepartemant={selecteddepartemant} newNumero={selecteddepartemant && selecteddepartemant.ID_CLASSEUR == "new" ? selecteddepartemant : null}
                        handleDepartemantPress={handleDepartemantPress}
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
    title: {
        fontWeight: 'bold',
        opacity: 0.8,
        color:"#18678E",
        fontSize: 18
    },
    institutionAddress: {
        color: '#777',
        fontSize: 12
    },
    listHeader: {
    }
})