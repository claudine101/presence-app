import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TouchableNativeFeedback } from "react-native";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import * as DocumentPicker from 'expo-document-picker';
import { EvilIcons, AntDesign } from '@expo/vector-icons';

/**
 * Screen pour afficher le details de volume de chef de division
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 11/7/2023
 * @returns 
 */

export default function VolumeDetailsScreen() {
        const modelRef = useRef(null)
        const onOpenModal = async () => {
                modelRef.current.open()
        }
        return (
                <>
                        <ScrollView style={styles.container}>
                                <View style={styles.cardDetails}>
                                        <View style={styles.carddetailItem}>
                                                <View style={styles.cardDescription}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                <View>
                                                                        <Text style={styles.itemVolume}> hhh</Text>
                                                                        <Text>333</Text>
                                                                </View>
                                                                <View>
                                                                        <Text>En attente...</Text>
                                                                        <Text>sjsjsj</Text>
                                                                </View>

                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.separator}></View>
                                        <View style={styles.carddetailItem}>
                                                <View style={styles.cardDescription}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                <View>
                                                                        <Text style={styles.itemVolume}> Nombre de dossier</Text>
                                                                        <Text>333</Text>
                                                                        <Text>Vanny</Text>
                                                                </View>
                                                                <View>
                                                                        <Text>Etape</Text>
                                                                </View>

                                                        </View>
                                                </View>
                                        </View>
                                        <View style={styles.separator}></View>
                                        <View style={styles.footer}>
                                                <View>
                                                        <Text>Pas encore etape retour</Text>
                                                </View>
                                                <TouchableOpacity onPress={onOpenModal}>
                                                        <View style={styles.nextBtn}>
                                                                <Text style={styles.nextBtnText}>
                                                                        Valider
                                                                </Text>
                                                        </View>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </ScrollView>
                        <Portal>
                                <Modalize ref={modelRef}
                                        handlePosition="inside"
                                        adjustToContentHeight
                                        modalStyle={{ backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                                        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
                                >
                                        <View style={styles.modalContent}>
                                                <TouchableNativeFeedback >
                                                        <View style={[styles.modalItem, { marginTop: 10 }]}>
                                                                <EvilIcons name="image" size={24} color="black" />
                                                                <Text style={styles.modalItemTitle}>
                                                                        Prendre
                                                                </Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                                <View style={styles.separator} />
                                                <TouchableNativeFeedback>
                                                        <View style={styles.modalItem}>
                                                                <AntDesign name="folderopen" size={24} color="black" />
                                                                <Text style={styles.modalItemTitle}>
                                                                        Importer
                                                                </Text>
                                                        </View>
                                                </TouchableNativeFeedback>
                                                <View style={styles.separator} />
                                        </View>
                                </Modalize>
                        </Portal>
                </>
        )
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: '#ddd'
        },
        cardDetails: {
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#c4c4c4',
                marginTop: 10,
                backgroundColor: '#fff',
                padding: 15,
                overflow: 'hidden',
                marginHorizontal: 10
        },
        carddetailItem: {
                flexDirection: 'row',
                alignItems: 'center',
        },
        cardDescription: {
                flex: 1
        },
        itemVolume: {
                fontSize: 15,
                fontWeight: "bold",
        },
        separator: {
                height: 1,
                width: "100%",
                backgroundColor: '#F1F1F1',
                marginVertical: 10
        },
        footer: {
                backgroundColor: '#FFF',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
        },
        nextBtn: {
                backgroundColor: '#DCE4F7',
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
                alignSelf: "flex-end"
        },
        backBtn: {
                backgroundColor: '#fff',
                borderColor: '#ddd',
                borderWidth: 1
        },
        nextBtnText: {
                color: '#000',
                fontWeight: "bold",
        },
})