import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5, AntDesign, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import fetchApi from "../../helpers/fetchApi";

/**
 * Screen pour lister les type courrier
 * @author HABIYAKARE Leonard <leonard@mediabox.bi>
 * @date 27/04/2023
 * @returns 
 */
const Remet = ({ remet, index, handleTypecourrierPress, selectedTypecourrier }) => {
    return (
        <TouchableNativeFeedback onPress={() => handleTypecourrierPress(remet)}>

            <View style={styles.institution}>
                <View style={styles.institutionLeftSide}>
                    <View style={styles.logoContainer}>
                        {remet.IMAGE ?
                            <Image source={{ uri: remet.IMAGE }} style={styles.logoInstitution} /> :
                            <SimpleLineIcons name="envelope-letter" size={24} color="white" />
                        }
                    </View>
                    <View style={styles.institutionDetails}>
                        <Text style={styles.institutionName} numberOfLines={1} >
                            {remet.DESCRIPTION}
                        </Text>
                    </View>
                </View>

                {selectedTypecourrier && selectedTypecourrier.ID_COURRIER_TYPE == remet.ID_COURRIER_TYPE ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
            </View>
        </TouchableNativeFeedback>
    )
}

const ListHeader = ({ handleSocietePress, selectedTypecourrier, newTypecourrier,previousRouteName }) => {
    const navigation = useNavigation()
    const route = useRoute()
    const previousRoutesociete = navigation.getState().routes[navigation.getState().index - 1].name
    return (
        <View style={styles.listHeader}>

            <TouchableNativeFeedback onPress={() => navigation.navigate("NewTypeCourrierSortantScreen", { newTypecourrier, previousRouteName, ...route.params })}>

                <View style={[styles.institution]}>
                    <View style={styles.institutionLeftSide}>
                        <View style={[styles.logoContainer, { backgroundColor: '#18678E' }]}>
                            <AntDesign name="plus" size={24} color="#fff" />
                        </View>
                        <View style={styles.institutionDetails}>
                            <Text style={styles.institutionName} numberOfLines={1} >
                                Nouvelle type 
                            </Text>
                            <Text style={styles.institutionAddress} numberOfLines={1} >
                                Enregistrer une Nouvelle type
                            </Text>
                        </View>
                    </View>
                    {selectedTypecourrier && selectedTypecourrier.ID_COURRIER_TYPE == 'new' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#18678E" /> :
                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}


                </View>
            </TouchableNativeFeedback>
        </View>
    )
}



export default function TypecourrierSortantScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const [loading, setLoading] = useState(true)
    const [remets, setRemets] = useState([])
    const [isInSearch, setIsInSearch] = useState(false)
    const [q, setQ] = useState('')
    const { typecourrier, newTypecourrier ,previousRouteName} = route.params

    const [selectedTypecourrier, SetTypecourrier] = useState(typecourrier)
    const previousRouteType = navigation.getState().routes[navigation.getState().index - 1].name
    const handleTypecourrierPress = remets => {
        SetTypecourrier(remets)
        navigation.navigate(previousRouteType, { ...route.params, typecourrier: remets })
    }

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [])
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
                const remt = await fetchApi(`/services/typecourrier?q=${q}`)
                setRemets(remt.result)

                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            } else {
                try {
                    setLoading(true)
                    const remt = await fetchApi(`/services/typecourrier`)
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
                const remt = await fetchApi('/services/typecourrier')
                setRemets(remt.result)
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
                    
                    {!isInSearch ? <Text style={styles.title}>Sélectionner le type de courrier</Text> : null}
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
                                selectedTypecourrier={selectedTypecourrier}
                                handleTypecourrierPress={handleTypecourrierPress}
                            />

                        )
                    }}
                    ListHeaderComponent={() => <ListHeader
                        selectedTypecourrier={selectedTypecourrier} newSociete={selectedTypecourrier && selectedTypecourrier.ID_COURRIER_TYPE == "new" ? selectedTypecourrier : null}
                        handleTypecourrierPress={handleTypecourrierPress}
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
    institutionAddress: {
        color: '#777',
        fontSize: 12
    },
    listHeader: {
    },
    title: {
        fontWeight: 'bold',
        opacity: 0.8,
        color: "#18678E",
        fontSize: 16,
        marginLeft: 5
    }
})