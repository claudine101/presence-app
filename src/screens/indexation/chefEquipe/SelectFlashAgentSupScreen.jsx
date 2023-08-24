import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../styles/COLORS";
import { useForm } from "../../../hooks/useForm";
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle";
import PROFILS from "../../../constants/PROFILS";
import { isValidElement, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import useFetch from "../../../hooks/useFetch";
import fetchApi from "../../../helpers/fetchApi";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import Loading from "../../../components/app/Loading";

export default function SelectFlashAgentSupScreen() {
          const route = useRoute()
          const { folios } = route.params
          const [data, handleChange] = useForm({
                    flash: null,
                    agent: null,
                    pv: null
          })
          const [loadingFlashs, flashs] = useFetch(`/indexation/flashs`)
          const [loadingAgents, agents] = useFetch(`/indexation/users/${PROFILS.AGENT_SUPERVISEUR_AILE_INDEXATION}`)

          const flashModalRef = useRef()
          const agentsModalRef = useRef()
          const navigation = useNavigation()
          const [isSubmitting, setIsSubmitting] = useState(false)
          const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
          const [pvPhoto, setPvPhoto] = useState(null)

          const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
                    flash: {
                              required: true,
                    },
                    agent: {
                              required: true,
                    },
                    pv: {
                              required: true,
                    }
          })

          const openFlashModalize = () => {
                    flashModalRef.current?.open()
          }
          const handleFlashPress = flash => {
                    flashModalRef.current?.close()
                    handleChange('flash', flash)
          }

          const openAgentModalize = () => {
                    agentsModalRef.current?.open()
          }
          const handleAgentPress = agent => {
                    agentsModalRef.current?.close()
                    handleChange('agent', agent)
          }

          const handleSubmit = async () => {
                    try {
                              if (!isValidate()) return false
                              setIsSubmitting(true)
                              const form = new FormData()
                              form.append("ID_FLASH", data.flash.ID_FLASH)
                              form.append("ID_SUP_AILE_INDEXATION", data.agent.USERS_ID)
                              form.append("folios", JSON.stringify(folios.map(folio => folio.ID_FOLIO)))
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
                              const res = await fetchApi(`/indexation/agent_sup_aile_indexation`, {
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
                                                  <Text style={styles.title}>Classement des dossiers</Text>
                                        </View>
                                        <ScrollView style={styles.inputs}>
                                                  <TouchableOpacity style={styles.selectContainer} onPress={() => navigation.goBack()}>
                                                            <View style={styles.labelContainer}>
                                                                      <View style={styles.icon}>
                                                                                <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                                      </View>
                                                                      <Text style={styles.selectLabel}>
                                                                                Dossiers à classer
                                                                      </Text>
                                                            </View>
                                                            <Text style={styles.selectedValue}>
                                                                      {folios.length} dossier{folios.length > 1 && 's'}
                                                            </Text>
                                                  </TouchableOpacity>
                                                  <TouchableOpacity style={styles.selectContainer} onPress={openFlashModalize}>
                                                            <View style={styles.labelContainer}>
                                                                      <View style={styles.icon}>
                                                                                <MaterialCommunityIcons name="usb-flash-drive-outline" size={20} color="#777" />
                                                                      </View>
                                                                      <Text style={styles.selectLabel}>
                                                                                Clé USB
                                                                      </Text>
                                                            </View>
                                                            <Text style={styles.selectedValue}>
                                                                      {data.flash ? data.flash.NOM_FLASH : 'Cliquer pour choisir la clé'}
                                                            </Text>
                                                  </TouchableOpacity>
                                                  <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize}>
                                                            <View style={styles.labelContainer}>
                                                                      <View style={styles.icon}>
                                                                                <Feather name="user" size={20} color="#777" />
                                                                      </View>
                                                                      <Text style={styles.selectLabel}>
                                                                                Agent superviseur aile indexation
                                                                      </Text>
                                                            </View>
                                                            <Text style={styles.selectedValue}>
                                                                      {data.agent ? `${data.agent.NOM} ${data.agent.PRENOM}` : "Cliquer pour choisir l'agent"}
                                                            </Text>
                                                  </TouchableOpacity>
                                                  <TouchableOpacity onPress={onTakePhoto}>
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
                                                  </TouchableOpacity>
                                        </ScrollView>
                                        <View style={styles.actions}>
                                                  <TouchableOpacity style={[styles.actionBtn, { opacity: !isValidate() || isCompressingPhoto ? 0.5 : 1 }]} disabled={!isValidate() || isCompressingPhoto} onPress={handleSubmit}>
                                                            <Text style={styles.actionText}>Envoyer</Text>
                                                  </TouchableOpacity>
                                        </View>
                              </View>
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
                                                                                                              {(data.flash && data.flash.ID_FLASH == flash.ID_FLASH) ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                                                                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    </View>
                                                                                          </TouchableNativeFeedback>
                                                                                )
                                                                      })}
                                                            </View>
                                                  </View>}
                              </Modalize>
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
                                                                                                                                  <Text style={styles.listItemSubTitle}>TOSHIBA - 16GB</Text>
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
          selectContainer: {
                    backgroundColor: "#fff",
                    padding: 13,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: "#ddd",
                    marginVertical: 10
          },
          selectedValue: {
                    color: '#777',
                    marginTop: 2
          },
          inputs: {
                    paddingHorizontal: 10
          },
          labelContainer: {
                    flexDirection: 'row',
                    alignItems: 'center'
          },
          selectLabel: {
                    marginLeft: 5
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
          }
})