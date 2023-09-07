import React from "react"
import { Text, StyleSheet, View, TouchableNativeFeedback, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../../store/selectors/userSelector";
import { COLORS } from "../../styles/COLORS";
import { DrawerActions } from "@react-navigation/native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unsetUserAction } from "../../store/actions/userActions";
import { runOnJS } from "react-native-reanimated";
import PROFILS from "../../constants/PROFILS";

export default function DrawerContent({ state, navigation, descriptors }) {
    const user = useSelector(userSelector)
    const dispacth = useDispatch()

    const handlePress = (routeName) => {
        navigation.navigate(routeName)
        navigation.dispatch(DrawerActions.closeDrawer)
    }
    const onLogOut = async () => {
        await AsyncStorage.removeItem('user')
        dispacth(unsetUserAction())
    }

    return (
        <View style={styles.drawerContent}>
            <TouchableNativeFeedback>
                <View style={styles.connectedUser}>
                    <View style={styles.imageContainer}>
                        {user.PHOTO_USER ? <Image source={{ uri: user.PHOTO_USER }} style={styles.image} /> :
                            <Image source={require('../../../assets/images/user.png')} style={styles.image} />}
                    </View>
                    <View style={styles.userNames}>
                        <Text style={styles.fullName} numberOfLines={1}>{user.NOM} {user.PRENOM}</Text>
                        <Text style={styles.email}>{user.profil.DESCRIPTION}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
            <View style={styles.separator} />
            <DrawerContentScrollView style={styles.drawerScroller}>
                {
                    user.ID_PROFIL == PROFILS.CHEF_DIVISION_ARCHIGES ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Volumes planifiés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                        : null}
                {
                    user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Volumes planifiés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeDesarchiveSreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                            Volumes désarchivés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeFolioRetourSupAilleScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                            Volume  Retourner
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeEnEttenteChefEquipeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                            Volume archivés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyezRetournerScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                            Volumes reenvoyez retourner
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChePlateauVolReenvoyerTraitesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                            Volumes reenvoyez traites
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Volumes non detaillés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeDetaillerScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }, { marginBottom: 3 }]}>
                                            En  attente de distribution
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeSuperviseScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }, { marginBottom: 3 }]}>
                                            Volumes distribués
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeFolioRetourSupAilleScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                            Volume  Retourner
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeEnEttenteChefEquipeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                            Volumes traités
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyezRetournerScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                            Volumes reenvoyez retourner
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChePlateauVolReenvoyerTraitesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 6) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 6) && { color: '#777' }]}>
                                            Volumes reenvoyez traites
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR ?
                    <>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                        Volumes planifiés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeDistribueSreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                        Volumes distribués
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeFolioRetourSupAilleScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                        Volumes Retourner
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeEnEttenteChefEquipeScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                        Volumes traités
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyezRetournerScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                        Volumes reenvoyez retourner
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChePlateauVolReenvoyerTraitesScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                        Volumes reenvoyez traites
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </> : null}
                {
                    user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_AILE ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                    <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel]}>
                                            Volumes planifiés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Nouveaux
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeRetourneScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                            Retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                    <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel]}>
                                            Chefs plateaux
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefPlateauScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }, { marginBottom: 3 }]}>
                                            Nouveaux
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefPlateauRetourneScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }, { marginBottom: 3 }]}>
                                            Retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                    <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                    <Image source={require('../../../assets/images/valid-doc.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel]}>
                                           Dossiers validés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeChefPlateauValidesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }, { marginBottom: 3 }]}>
                                            Nouveaux
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefPlateauValideRetourneScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }, { marginBottom: 3 }]}>
                                            Retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {(user.ID_PROFIL == PROFILS.CHEF_PLATEAU) ?
                    <>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel]}>
                                        Volumes planifiés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <View style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                        Nouveaux
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeRetourneScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <View style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                        Retournés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>



                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                    <Image source={require('../../../assets/images/team.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel]}>
                                        Agents superviseurs
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSuperviseurScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <View style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }, { marginBottom: 3 }]}>
                                        Nouveaux
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSuperviseurRetourPhaseScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <View style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                        Retournés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>

                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                    <Image source={require('../../../assets/images/valid-doc.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel]}>
                                        Dossiers prépares
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSuperviseurValideScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <View style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }, { marginBottom: 3 }]}>
                                        Nouveaux
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSuperviseurReValideScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <View style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }, { marginBottom: 3 }]}>
                                        Retournés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>

                    </>
                    : null}
                {
                    user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR ?
                        <>

                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                    <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel]}>
                                            En  attente de préparation 
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Nouveaux
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeRetourneScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                            Retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                    <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                        <Image source={require('../../../assets/images/team.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel]}>
                                            Agents preparations
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentPreparationFolioScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }, { marginBottom: 3 }]}>
                                            Nouveaux
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentPreparationFolioRetourneScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                            Retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} disabled>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }]}>
                                    <View style={[styles.drawerItem, { paddingVertical: 5 }]}>
                                        <Image source={require('../../../assets/images/team.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel]}>
                                            Dossiers non détaillés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FolioRetourScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }, { marginBottom: 3 }]}>
                                            Nouveaux
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FolioRetourneScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 6) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <View style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 6) && { color: '#777' }]}>
                                            Retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FolioRetouPrepareScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/valid-doc.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                            Dossiers préparés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>


                        </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.CHEF_EQUIPE ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSuperviseurAileScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }, { marginBottom: 3 }]}>
                                            agents superviseurs ailes
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeRecusChefEquiScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                            Volumes reçus
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeEnEttenteChefEquipeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                            Volumes traités
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSupAileScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                        Dossiers non préparés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSupRetourneScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                            Dossiers préparés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentSupRetraiteScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                        Dossiers traitées
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>


                        </>
                        : null
                }
                {
                    user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_SCANNING ? <>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeRecusChefEquiScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                        Volumes reçus
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeFolioRetourSupAilleScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/team.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                        Volumes retournés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeEnEttenteChefEquipeScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                        Volumes traités
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyerRecusScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                        Volumes reenvoyés reçus
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyezRetournerScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                        Volumes reenvoyés retournés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChePlateauVolReenvoyerTraitesScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                        Volumes reenvoyés traités
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.CHEF_PLATEAU_SCANNING ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeRecusChefEquiScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Volume Reçus
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllFolioEquipeRetourScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/team.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                            Dossiers retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeEnEttenteChefEquipeScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                            Volumes traités
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeFoliosNonInvalidePlatoScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                            Volume non validé
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyerRecusScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                            Dossiers reenvoyés reçus
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyezRetournerScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                        Dossiers reenvoyés retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChePlateauVolReenvoyerTraitesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 6) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 6) && { color: '#777' }]}>
                                        Dossiers reenvoyés traités
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                        : null
                }
                {
                    user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_SCANNING ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllFolioRecusScanScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllFolioEquipeRetourScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/team.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                            Dossiers retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllFoliosSuperviseurPvScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                            Dossiers traités
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            {/* <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FoliosNonScanNonReconcilierScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                            Dossiers non reconciliés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback> */}
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeFoliosNonInvalidePlatoScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                            Dossiers non validés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyerRecusScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                            Dossiers reenvoyés reçus
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllRetourFoliosReenvoyezSupScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                            Dossiers reenvoyés retournés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FoliosReenvoyezTraitesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 6) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 6) && { color: '#777' }]}>
                                            Dossiers reenvoyés traités
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                        : null
                }
                {
                    user.ID_PROFIL == PROFILS.CHEF_EQUIPE_SCANNING ? <>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllSuperviseurAileScanVolumeScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossierDetail.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }, { marginBottom: 3 }]}>
                                        Agents superviseurs ailes
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeFolioRetourSupAilleScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                        Volumes reçus
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VolumeEnEttenteChefEquipeScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                        Volumes traités
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AllVolumeReenvoyezRetournerScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 3) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 3) && { color: '#777' }]}>
                                        Volumes reenvoyés retournés
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChePlateauVolReenvoyerTraitesScreen')}>
                            <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 4) && { backgroundColor: COLORS.handleColor }]}>
                                <View style={styles.drawerItem}>
                                    <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                    <Text style={[styles.drawerItemLabel, (state.index == 4) && { color: '#777' }]}>
                                        Volumes reenvoyez Reçus
                                    </Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                        {/* <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChePlateauVolReenvoyerTraitesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 5) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 5) && { color: '#777' }]}>
                                        Dossiers reenvoyés traités
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback> */}
                    </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.CHEF_EQUIPE_INDEXATION ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('IndexationChefEquipeFolioScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            En ettente de classement
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefEquipeFlashRetourScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            En ettente d'indexation
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefEquipeFlashValidesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/valid-doc.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers indexés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR_AILE_INDEXATION ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('SupFlashScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers classés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('SupFlashRetourScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            En ettente du retour
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('SupFlashValidesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/valid-doc.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers validés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.CHEF_PLATEAU_INDEXATION ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefPlateauFlashScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers sans agents
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefPlateauFlashRetourScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            En ettente du retour
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefPlateauFlashValidesScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/valid-doc.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers validés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.CHEF_EQUIPE_PHASE_UPLOAD ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefEquipeFlashValideScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Flash des dossiers indexés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefEquipeFlashsRetourScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                            En ettente de vérification
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('ChefEquipeFlashUploadScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers vérifies
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.AGENT_UPLOAD_EDRMS ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('AgentFlashScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            En ettente d'upload
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FolioUploadScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            Dossiers uploadés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FolioInvalideScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                            Dossiers non uploadés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }
                {
                    user.ID_PROFIL == PROFILS.VERIFICATEUR_UPLOAD ?
                        <>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('VerificateurFlashScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 0) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 0) && { color: '#777' }]}>
                                            En ettente de vérification
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FolioEnregistreScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 1) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 1) && { color: '#777' }]}>
                                            Dossiers enregistrés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple(COLORS.handleColor)} onPress={() => handlePress('FolioNoEnregistreScreen')}>
                                <View style={[{ borderRadius: 10, overflow: "hidden" }, (state.index == 2) && { backgroundColor: COLORS.handleColor }]}>
                                    <View style={styles.drawerItem}>
                                        <Image source={require('../../../assets/images/dossier.png')} style={styles.imageIcon} />
                                        <Text style={[styles.drawerItemLabel, (state.index == 2) && { color: '#777' }]}>
                                            Dossiers no enregistrés
                                        </Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </> : null
                }

            </DrawerContentScrollView >
            <View style={styles.bottomSection}>
                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('#EFEFEF')}>
                    <View style={{ borderRadius: 10, overflow: "hidden" }}>
                        <View style={styles.drawerItem}>
                            <AntDesign name="setting" size={24} color="#777" />
                            <Text style={styles.drawerItemLabel}>Paramètres</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('COLORS.handleColor')} onPress={() => handlePress('AllIncidentsDeclarerScreen')}>
                    <View style={{ borderRadius: 10, overflow: "hidden" }}>
                        <View style={styles.drawerItem}>
                            <MaterialIcons name="report-problem" size={24} color="black" />
                            <Text style={styles.drawerItemLabel}>Incidents</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple('#EFEFEF')} onPress={onLogOut}>
                    <View style={{ borderRadius: 10, overflow: "hidden" }}>
                        <View style={styles.drawerItem}>
                            <MaterialIcons name="logout" size={20} color="#777" />
                            <Text style={styles.drawerItemLabel}>Déconnexion</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View >
    )

}
const styles = StyleSheet.create({
    separator: {
        height: 2,
        width: "95%",
        backgroundColor: COLORS.handleColor,
        alignSelf: "center"
    },
    drawerContent: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    connectedUser: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    imageContainer: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.handleColor,
        borderRadius: 10,
        padding: 5
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        resizeMode: "center"
    },
    userNames: {
        marginLeft: 10,
        flex: 1
    },
    fullName: {
        fontWeight: "bold",
        fontSize: 14,
        maxWidth: "90%"
    },
    email: {
        color: '#777',
        fontSize: 13
    },
    drawerScroller: {
        paddingHorizontal: 10
    },
    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        overflow: "hidden"
    },
    drawerItemLabel: {
        marginLeft: 10,
        fontWeight: "bold",
        color: '#777'
    },
    services: {
        paddingLeft: 20
    },
    service: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        padding: 10,
        borderRadius: 10,
        overflow: 'hidden'
    },
    serviceImageContainer: {
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderColor: COLORS.handleColor,
        borderWidth: 2
    },
    serviceImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10
    },
    serviceName: {
        color: '#777',
        marginLeft: 10,
        fontSize: 13
    },

    actionBadge: {
        minWidth: 20,
        minHeight: 18,
        backgroundColor: "red",
        borderRadius: 100,
        position: 'absolute',
        right: 10,
        // top: -9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3
    },
    actionBadgeText: {
        color: '#FFF',
        fontSize: 12,
        marginTop: -2,
        fontWeight: "bold"
    },
    bottomSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    imageIcon: {
        width: 25,
        height: 25
    }
})