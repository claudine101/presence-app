import React from "react";
import { Image, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native"
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import { COLORS } from "../../styles/COLORS";

export default function Folio({ folio, onPress, isSelected, style = {} }) {
          return (
                    <TouchableNativeFeedback onPress={() => onPress(folio)} disabled={onPress ? false : true} useForeground background={TouchableNativeFeedback.Ripple("#c4c4c4", false)}>
                              <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }}>
                                        <View style={[styles.folio, style]}>
                                                  <View style={styles.folioLeftSide}>
                                                            <View style={styles.folioImageContainer}>
                                                                      <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                                                            </View>
                                                            <View style={styles.folioDesc}>
                                                                      <Text style={styles.folioName}>{ folio.NUMERO_FOLIO }</Text>
                                                                      <Text style={styles.folioSubname}>{ folio.NUMERO_FOLIO }</Text>
                                                            </View>
                                                  </View>
                                                  {isSelected(folio) ? <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} /> :
                                                            <MaterialIcons style={styles.checkIndicator} name="check-box-outline-blank" size={24} color="#ddd" />}
                                        </View>
                              </View>
                    </TouchableNativeFeedback>
          )
}


const styles = StyleSheet.create({
          folio: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    padding: 10
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
          }
})