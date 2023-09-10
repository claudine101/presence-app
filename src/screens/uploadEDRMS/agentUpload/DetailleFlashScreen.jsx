import {  useNavigation, useRoute } from "@react-navigation/native"
import {  Image, Text, TouchableNativeFeedback,  View } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons} from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { COLORS } from "../../../styles/COLORS";

export default function DetailleFlashScreen() {
    const route = useRoute()
    const { flash } = route.params
    const navigation = useNavigation()
    const handleFoliosPress = folio => {
        navigation.navigate("DetailsFolioFlashScreen", { folio })
    }
    return (
        <>

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableNativeFeedback
                        onPress={() => navigation.goBack()}
                        background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.title}>{flash.flash ? flash.flash.NOM_FLASH : null}</Text>
                </View>
                {
                    <ScrollView style={styles.inputs}>
                        <View style={styles.content}>
                            {<View style={styles.folioList}>
                                {flash?.folios?.map((folio, index) => {
                                    return (
                                        <TouchableNativeFeedback onPress={() => handleFoliosPress(folio)} key={index} >
                                        <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                                  <View style={[styles.folio]}>
                                                            <View style={styles.folioLeftSide}>
                                                                      <View style={styles.folioImageContainer}>
                                                                                <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                      </View>
                                                                      <View style={styles.folioDesc}>
                                                                                <Text style={styles.folioName}>{ folio.NUMERO_FOLIO }</Text>
                                                                                <Text style={styles.folioSubname}>{ folio.NUMERO_FOLIO }</Text>
                                                                      </View>
                                                            </View>
                                                            
                                                  </View>
                                        </View>
                              </TouchableNativeFeedback>
                                    )
                                })}
                            </View>}

                        </View>
                    </ScrollView>}

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
    },
    detailsHeader: {
        paddingHorizontal: 10
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectLabel: {
        marginLeft: 5
    },
    flash: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    flashName: {
        marginLeft: 5
    },
    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        padding: 10,
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    folioImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    folioImage: {
        width: '60%',
        height: '60%'
    },
    folioDesc: {
        marginLeft: 10
    },
    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
    },
    folioList: {
        // paddingHorizontal: 10
    },
    actions: {
        padding: 10
    },
    actionBtn: {
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: COLORS.primary
    },
    actionText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff'
    },
    selectContainer: {
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#ddd",
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    selectedValue: {
        color: '#777',
        marginTop: 2
    },
    content: {
        paddingHorizontal: 10
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
        paddingHorizontal: 10
    },
    listItemImageContainer: {
        width: 35,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listItemImage: {
        width: '30%',
        height: '30%',
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
})