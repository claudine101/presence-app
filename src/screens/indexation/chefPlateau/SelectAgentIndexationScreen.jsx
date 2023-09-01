import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableNativeFeedbackBase, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { AntDesign, Ionicons, MaterialCommunityIcons, Entypo, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import fetchApi from "../../../helpers/fetchApi";
import { COLORS } from "../../../styles/COLORS";
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { Modalize } from "react-native-modalize";
import useFetch from "../../../hooks/useFetch";
import PROFILS from "../../../constants/PROFILS";
import Loading from "../../../components/app/Loading";
import moment from "moment";
import ImageView from "react-native-image-viewing";
import Folio from "../../../components/folio/Folio";

export default function SelectAgentIndexationScreen() {
          const route = useRoute()
          const { flash ,flashindexe} = route.params
          const [flashDetail, setFlashDetail] = useState({})
          const [loading, setLoading] = useState(true)
          const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
          const [pvPhoto, setPvPhoto] = useState(null)
          const navigation = useNavigation()
          const agentsModalRef = useRef()
          const [loadingAgents, agents] = useFetch(`/indexation/users/${PROFILS.AGENT_INDEXATION}`)
          const [loadingFlashs, flashs] = useFetch(`/indexation/flashs`)
          const [isSubmitting, setIsSubmitting] = useState(false)
          const [galexyIndex, setGalexyIndex] = useState(null)
          const [selectedItems, setSelectedItems] = useState([])
          const [flashIndexes, setFlashIndexes] = useState(null)
          
          const flashModalRef = useRef()

          const isSelected = folio => selectedItems.find(f => f.ID_FOLIO == folio.ID_FOLIO) ? true : false

          const openFlashModalize = () => {
                    flashModalRef.current?.open()
          }
          
          const handleFlashPress = flash => {
                    flashModalRef.current?.close()
                    setFlashIndexes(flash)
          }
          
          const handleFolioPress = (folio) => {
                    if(isSelected(folio)) {
                              const removed = selectedItems.filter(f => f.ID_FOLIO != folio.ID_FOLIO)
                              setSelectedItems(removed)
                    } else {
                              setSelectedItems(items => [...items, folio])
                    }
          }

          const [data, handleChange] = useForm({
                    agent: null,
                    pv: null
          })
          const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
                    agent: {
                              required: true
                    },
                    pv: {
                              required: true
                    }
          })

          const openAgentModalize = () => {
                    agentsModalRef.current?.open()
          }
          const handleAgentPress = agent => {
                    agentsModalRef.current?.close()
                    handleChange('agent', agent)
          }
          useFocusEffect(useCallback(() => {
                    (async () => {
                              try {
                                        const res = await fetchApi(`/indexation/flashs/details/${flash.ID_FLASH}`)
                                        setFlashDetail(res.result)
                                        if(res.result.foliosIndexes) {
                                                  setSelectedItems(res.result.foliosIndexes)
                                        }
                              } catch (error) {
                                        console.log(error)
                              } finally {
                                        setLoading(false)
                              }
                    })()
          }, []))

          const isRetourValid = () => {
         return selectedItems.length > 0 && data.pv && !isCompressingPhoto && (selectedItems.length ==  flashDetail.folios.length)? flashIndexes ? false : true : flashIndexes ? true : false
          }
          /**
           * Permet d'envoyer le chef agent d'indexation
           * @author darcydev <darcy@mediabox.bi>
           * @date 03/08/2023
           * @returns 
           */
          const handleSubmit = async () => {
                    try {
                              if (!isValidate()) return false
                              setIsSubmitting(true)
                              const form = new FormData()
                              form.append("ID_FLASH", flash.ID_FLASH)
                              form.append("ID_AGENT_INDEXATION", data.agent.USERS_ID)
                              if(data.pv) {
                                        const photo = data.pv
                                        let localUri = photo.uri;
                                        let filename = localUri.split('/').pop();
                                        let match = /\.(\w+)$/.exec(filename);
                                        let type = match ? `image/${match[1]}` : `image`;
                                        form.append(`pv`, {
                                                  uri: localUri, name: filename, type
                                        })
                              }
                              const res = await fetchApi(`/indexation/agent_indexation`, {
                                        method: 'POST',
                                        body: form
                              })
                              ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
                              navigation.goBack()
                    } catch (error) {
                              console.log(error)
                              ToastAndroid.show("Opération non effectuée, réessayer encore", ToastAndroid.SHORT);
                    } finally {
                              setIsSubmitting(false)
                    }
          }

          /**
           * Permet de traiter les dossiers indexes du chef agent d'indexation
           * @author darcydev <darcy@mediabox.bi>
           * @date 03/08/2023
           * @returns 
           */
          const handleSubmitRetour = async () => {
                    try {
                              if (!isRetourValid()) return false
                              setIsSubmitting(true)
                              const form = new FormData()
                              form.append("ID_FLASH",  flashDetail.ID_FLASH)
                              if(selectedItems.length ==  flashDetail.folios.length){
                                form.append("ID_FLASH_INDEXES",  flashDetail.ID_FLASH)
                              }
                              else{
                                form.append("ID_FLASH_INDEXES", flashIndexes.ID_FLASH)
                              }
                              form.append("ID_AGENT_INDEXATION", flashDetail.agentIndexation.USER_TRAITEMENT)
                              form.append("foliosIndexesIds", JSON.stringify(selectedItems.map(folio => folio.ID_FOLIO)))
                              if(data.pv) {
                                        const photo = data.pv
                                        let localUri = photo.uri;
                                        let filename = localUri.split('/').pop();
                                        let match = /\.(\w+)$/.exec(filename);
                                        let type = match ? `image/${match[1]}` : `image`;
                                        form.append(`pv`, {
                                                  uri: localUri, name: filename, type
                                        })
                              }
                              const res = await fetchApi(`/indexation/agent_indexation/retour/indexation_folios`, {
                                        method: 'POST',
                                        body: form
                              })
                              ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
                              navigation.goBack()
                    } catch (error) {
                              console.log(error)
                              ToastAndroid.show("Opération non effectuée, réessayer encore", ToastAndroid.SHORT);
                    } finally {
                              setIsSubmitting(false)
                    }
          }

          const onTakePhoto = async () => {
                    setIsCompressingPhoto(true)
                    const permission = await ImagePicker.requestCameraPermissionsAsync()
                    if (!permission.granted) return false
                    const image = await ImagePicker.launchCameraAsync()
                    if (image.canceled) {
                              return setIsCompressingPhoto(false)
                    }
                    const photo = image.assets[0]
                    setPvPhoto(photo)
                    const manipResult = await manipulateAsync(
                              photo.uri,
                              [
                                        { resize: { width: 500 } }
                              ],
                              { compress: 0.7, format: SaveFormat.JPEG }
                    );
                    setIsCompressingPhoto(false)
                    handleChange('pv', manipResult)
          }
          return (
                    <>
                    {(galexyIndex != null &&  flashDetail && flashDetail?.agentIndexation) &&
                              <ImageView
                                        images={[{ uri: flashDetail.agentIndexation.PV_PATH }, flashDetail.agentIndexationRetour ? { uri: flashDetail.agentIndexationRetour.PV_PATH } : undefined]}
                                        imageIndex={galexyIndex}
                                        visible={(galexyIndex != null) ? true : false}
                                        onRequestClose={() => setGalexyIndex(null)}
                                        swipeToCloseEnabled
                                        keyExtractor={(_, index) => index.toString()}
                              />
                    }
                              {isSubmitting && <Loading />}
                              <View style={styles.container}>
                                        <View style={styles.header}>
                                                  <TouchableNativeFeedback
                                                            onPress={() => navigation.goBack()}
                                                            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
                                                            <View style={styles.headerBtn}>
                                                                      <Ionicons name="chevron-back-outline" size={24} color="black" />
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  <Text style={styles.title}>{flashDetail ? flashDetail.NOM_FLASH : null}</Text>
                                        </View>
                                        {(loading) ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                  <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View> : <ScrollView style={styles.inputs}>
                                                  
                                                  <View style={styles.content}>
                                                            {flashDetail.agentIndexation ? null : <TouchableOpacity style={styles.selectContainer}>
                                                                      <View>
                                                                                <View style={styles.labelContainer}>
                                                                                          <View style={styles.icon}>
                                                                                                    <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                                                          </View>
                                                                                          <Text style={styles.selectLabel}>
                                                                                                    Dossiers
                                                                                          </Text>
                                                                                </View>
                                                                                <Text style={styles.selectedValue}>
                                                                                          {flashDetail.folios.length} dossier{flashDetail.folios.length > 1 && 's'}
                                                                                </Text>
                                                                      </View>
                                                                      <Entypo name="chevron-small-down" size={24} color="#777" />
                                                            </TouchableOpacity>}
                                                            {false && <View style={styles.folioList}>
                                                                      {flashDetail.folios.map((folio, index) => {
                                                                                return (
                                                                                          <TouchableNativeFeedback useForeground background={TouchableNativeFeedback.Ripple("#c4c4c4", false)} key={index}>
                                                                                                    <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                                                                                              <View style={styles.folio}>
                                                                                                                        <View style={styles.folioLeftSide}>
                                                                                                                                  <View style={styles.folioImageContainer}>
                                                                                                                                            <Image source={require("../../../../assets/images/folio.png")} style={styles.folioImage} />
                                                                                                                                  </View>
                                                                                                                                  <View style={styles.folioDesc}>
                                                                                                                                            <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                                            <Text style={styles.folioSubname}>{folio.NUMERO_FOLIO}</Text>
                                                                                                                                  </View>
                                                                                                                        </View>
                                                                                                              </View>
                                                                                                    </View>
                                                                                          </TouchableNativeFeedback>
                                                                                )
                                                                      })}
                                                            </View>}
                                                            <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize} disabled={flashDetail.agentIndexation ? true : false}>
                                                                      <View style={{ width: '100%' }}>
                                                                                <View style={styles.labelContainer}>
                                                                                          <View style={styles.icon}>
                                                                                                    <Feather name="user" size={20} color="#777" />
                                                                                          </View>
                                                                                          <Text style={styles.selectLabel}>
                                                                                                    Agent indexation
                                                                                          </Text>
                                                                                </View>
                                                                                {flashDetail.agentIndexation ? null : <Text style={styles.selectedValue}>
                                                                                          {data.agent ? `${data.agent.NOM} ${data.agent.PRENOM}` : "Cliquer pour choisir l'agent"}
                                                                                </Text>}
                                                                                {flashDetail.agentIndexation ? <><Text style={styles.selectedValue}>
                                                                                          {flashDetail.agentIndexation.traitement.NOM} {flashDetail.agentIndexation.traitement.PRENOM}
                                                                                </Text>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10  }}>
                                                                                          <FontAwesome5 name="file-signature" size={20} color="#777" />
                                                                                          <Text style={styles.addImageLabel}>
                                                                                                    Photo du procès verbal
                                                                                          </Text>
                                                                                </View>
                                                                                <TouchableOpacity onPress={() => {
                                                                                          setGalexyIndex(0)
                                                                                }}>
                                                                                          <Image source={{ uri: flashDetail.agentIndexation.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                </TouchableOpacity>
                                                                                {flashDetail.agentIndexation ? <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: { moment(flashDetail.agentIndexation.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm") }</Text> : null}
                                                                                </> : null}
                                                                      </View>
                                                            </TouchableOpacity>
                                                            {flashDetail.agentIndexation ? null : <TouchableOpacity onPress={onTakePhoto}>
                                                                      <View style={[styles.addImageItem]}>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                                                                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                                    <FontAwesome5 name="file-signature" size={20} color="#777" />
                                                                                                    <Text style={styles.addImageLabel}>
                                                                                                              Photo du procès verbal
                                                                                                    </Text>
                                                                                          </View>
                                                                                          {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                                                                                </View>
                                                                                {pvPhoto && <Image source={{ uri: pvPhoto.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                                                                      </View>
                                                            </TouchableOpacity>}
                                                            {flashDetail.agentIndexation ? <>
                                                            <View style={styles.selectContainer}>
                                                                      <View style={{ width: '100%' }}>
                                                                                <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>
                                                                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                    <View style={styles.icon}>
                                                                                                              <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                                                                    </View>
                                                                                                    <Text style={styles.selectLabel}>
                                                                                                              {flashDetail.agentIndexationRetour ? 'Tous les dossiers' : 'Préciser les dossiers indexés'}
                                                                                                    </Text>
                                                                                          </View>
                                                                                          {flashDetail.agentIndexationRetour ? null : <TouchableOpacity onPress={() => {
                                                                                                    if(selectedItems.length ==  flashDetail.folios.length) {
                                                                                                              setSelectedItems([])
                                                                                                    } else {
                                                                                                              setSelectedItems(flashDetail.folios)
                                                                                                    }
                                                                                          }}>
                                                                                                    {selectedItems.length ==  flashDetail.folios.length  ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                                                                              <MaterialIcons style={styles.checkIndicator} name="check-box-outline-blank" size={24} color="#ddd" />}
                                                                                          </TouchableOpacity>}
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                                                          <Text style={styles.selectedValue}>
                                                                                                    {flashDetail.folios.length} dossier{flashDetail.folios.length > 1 && 's'}
                                                                                          </Text>
                                                                                          <Text style={styles.selectedValue}>
                                                                                                    {selectedItems.length} indexé{selectedItems.length > 1 && 's'}
                                                                                          </Text>
                                                                                </View>
                                                                                <View style={styles.folioList}>
                                                                                          {flashDetail.folios.map((folio, index) => {
                                                                                                    return (
                                                                                                              <Folio style={{ backgroundColor: '#f1f1f1' }} folio={folio} key={index} onPress={flashDetail.agentIndexationRetour ? null : handleFolioPress} isSelected={isSelected} />
                                                                                                    )
                                                                                          })}
                                                                                </View>
                                                                      </View>
                                                            </View>
                                                            </> : null}
                                                            {(flashDetail.agentIndexation  && !(selectedItems.length ==  flashDetail.folios.length)) ? <TouchableOpacity style={[styles.selectContainer, { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'baseline'}]} onPress={openFlashModalize} disabled={flashDetail.agentIndexationRetour ? true : false}>
                                                                      <View style={styles.labelContainer}>
                                                                                <View style={styles.icon}>
                                                                                          <MaterialCommunityIcons name="usb-flash-drive-outline" size={20} color="#777" />
                                                                                </View>
                                                                                <Text style={styles.selectLabel}>
                                                                                         Support  de stockage des dossiers indexés
                                                                                </Text>
                                                                      </View>
                                                                      {flashDetail.foliosIndexes.length > 0 ?<Text style={styles.selectedValue}>
                                                                                {/* {flashDetail.foliosIndexes[0].flash.NOM_FLASH} */}
                                                                                { flashindexe?.NOM_FLASH}
                                                                      </Text> : null}
                                                                      {flashDetail.agentIndexationRetour ? null :<Text style={styles.selectedValue}>
                                                                                {flashIndexes ? flashIndexes.NOM_FLASH : 'Cliquer pour choisir le support'}
                                                                      </Text>}
                                                            </TouchableOpacity> : null}
                                                            {flashDetail.agentIndexation ? <TouchableOpacity onPress={onTakePhoto} disabled={flashDetail.agentIndexationRetour ? true : false}>
                                                                      <View style={[styles.addImageItem]}>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                                                                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                                    <FontAwesome5 name="file-signature" size={20} color="#777" />
                                                                                                    <Text style={styles.addImageLabel}>
                                                                                                              Procès verbal du retour
                                                                                                    </Text>
                                                                                          </View>
                                                                                          {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                                                                                </View>
                                                                                {pvPhoto && <Image source={{ uri: pvPhoto.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                                                                                {flashDetail.agentIndexationRetour ? <>
                                                                                <TouchableOpacity onPress={() => {
                                                                                          setGalexyIndex(1)
                                                                                }}>
                                                                                          <Image source={{ uri: flashDetail.agentIndexationRetour.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                </TouchableOpacity>
                                                                                <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: { moment(flashDetail.agentIndexationRetour.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm") }</Text>
                                                                                </> : null}
                                                                      </View>
                                                            </TouchableOpacity> : null}
                                                  </View>
                                        </ScrollView>}
                                        {(!flashDetail || flashDetail.agentIndexation) ? null : <View style={styles.actions}>
                                                  <View style={styles.actions}>
                                                            <TouchableOpacity style={[styles.actionBtn, { opacity: !isValidate() || isCompressingPhoto ? 0.5 : 1 }]} disabled={!isValidate() || isCompressingPhoto} onPress={handleSubmit}>
                                                                      <Text style={styles.actionText}>Envoyer</Text>
                                                            </TouchableOpacity>
                                                  </View>
                                        </View>}
                                        {(flashDetail && flashDetail.agentIndexation && !flashDetail.agentIndexationRetour) ? <View style={styles.actions}>
                                                  <View style={styles.actions}>
                                                            <TouchableOpacity style={[styles.actionBtn, { opacity: !isRetourValid() ? 0.5 : 1 }]} disabled={!isRetourValid()} onPress={handleSubmitRetour}>
                                                                      <Text style={styles.actionText}>Envoyer</Text>
                                                            </TouchableOpacity>
                                                  </View>
                                        </View> : null}
                              </View>
                              <Modalize
                                        ref={agentsModalRef}
                                        handlePosition='inside'
                                        modalStyle={{
                                                  borderTopRightRadius: 10,
                                                  borderTopLeftRadius: 10,
                                                  paddingVertical: 20
                                        }}
                                        handleStyle={{ marginTop: 10 }}
                                        scrollViewProps={{
                                                  keyboardShouldPersistTaps: "handled"
                                        }}
                              >
                                        {loadingAgents ? null :
                                                  <View style={styles.modalContainer}>
                                                            <View style={styles.modalHeader}>
                                                                      <Text style={styles.modalTitle}>Sélectionner l'agent</Text>
                                                            </View>
                                                            <View style={styles.modalList}>
                                                                      {agents.result.map((agent, index) => {
                                                                                return (
                                                                                          <TouchableNativeFeedback key={index} onPress={() => handleAgentPress(agent)}>
                                                                                                    <View style={styles.listItem}>
                                                                                                              <View style={styles.listItemDesc}>
                                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                                  <Image source={require('../../../../assets/images/usb-flash-drive.png')} style={styles.listItemImage} />
                                                                                                                        </View>
                                                                                                                        <View style={styles.listNames}>
                                                                                                                                  <Text style={styles.listItemTitle}>{agent.NOM} {agent.PRENOM}</Text>
                                                                                                                                  <Text style={styles.listItemSubTitle}>{agent.EMAIL}</Text>
                                                                                                                        </View>
                                                                                                              </View>
                                                                                                              {(data.agent && data.agent.USERS_ID == agent.USERS_ID) ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    </View>
                                                                                          </TouchableNativeFeedback>
                                                                                )
                                                                      })}
                                                            </View>
                                                  </View>}
                              </Modalize>
                              <Modalize
                                        ref={flashModalRef}
                                        handlePosition='inside'
                                        modalStyle={{
                                                  borderTopRightRadius: 10,
                                                  borderTopLeftRadius: 10,
                                                  paddingVertical: 20
                                        }}
                                        handleStyle={{ marginTop: 10 }}
                                        scrollViewProps={{
                                                  keyboardShouldPersistTaps: "handled"
                                        }}
                              >
                                        {loadingFlashs ? null :
                                                  <View style={styles.modalContainer}>
                                                            <View style={styles.modalHeader}>
                                                                      <Text style={styles.modalTitle}>Sélectionner la clé USB</Text>
                                                            </View>
                                                            <View style={styles.modalList}>
                                                                      {flashs.result.map((flash, index) => {
                                                                                return (
                                                                                          <TouchableNativeFeedback key={index} onPress={() => handleFlashPress(flash)}>
                                                                                                    <View style={styles.listItem}>
                                                                                                              <View style={styles.listItemDesc}>
                                                                                                                        <View style={styles.listItemImageContainer}>
                                                                                                                                  <Image source={require('../../../../assets/images/usb-flash-drive.png')} style={styles.listItemImage} />
                                                                                                                        </View>
                                                                                                                        <View style={styles.listNames}>
                                                                                                                                  <Text style={styles.listItemTitle}>{flash.NOM_FLASH}</Text>
                                                                                                                                  <Text style={styles.listItemSubTitle}>TOSHIBA - 16GB</Text>
                                                                                                                        </View>
                                                                                                              </View>
                                                                                                              {(flashIndexes && flashIndexes.ID_FLASH == flash.ID_FLASH) ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    </View>
                                                                                          </TouchableNativeFeedback>
                                                                                )
                                                                      })}
                                                            </View>
                                                  </View>}
                              </Modalize>
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
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: '#ddd',
                    justifyContent: 'center',
                    alignItems: 'center'
          },
          listItemImage: {
                    width: '60%',
                    height: '60%',
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