import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import DrawerContent from "../components/app/DrawerContent";
import { useSelector } from "react-redux";
import { userSelector } from "../store/selectors/userSelector";
import AgentSuperiveurAilleRetourScreen from "../screens/retour/AgentSuperiveurAilleRetourScreen";
import AllVolumesRecusScreen from "../screens/scanning/chefEquipe/AllVolumesRecusScreen";
import AllVolumeRecusChefEquiScreen from "../screens/scanning/chefEquipe/AllVolumeRecusChefEquiScreen";
import AllFolioRecusScanScreen from "../screens/scanning/agentSuperviseur/AllFolioRecusScanScreen";
import AllFolioEquipeRetourScreen from "../screens/scanning/agentSuperviseur/retour/AllFolioEquipeRetourScreen";
import AllFoliosSuperviseurPvScreen from "../screens/scanning/agentSuperviseur/retour/AllFoliosSuperviseurPvScreen";
import AllVolumeRetourScreen from "../screens/scanning/chefEquipe/retour/AllVolumeRetourScreen";

export default function DrawerNavigator() {
        const drawr = true
        const user = useSelector(userSelector)
        const Drawer = createDrawerNavigator()
        return (
                <Drawer.Navigator screenOptions={{ headerShown: false, lazy: true, unmountOnBlur: true }} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                        {user.ID_PROFIL == 9 ?
                                <>
                                        <Drawer.Screen name="AllVolumesRecusScreen" component={AllVolumesRecusScreen} />
                                        <Drawer.Screen name="AgentSuperiveurAilleRetourScreen" component={AgentSuperiveurAilleRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == 13 ?
                                <>
                                        <Drawer.Screen name="AllFolioRecusScanScreen" component={AllFolioRecusScanScreen} />
                                        <Drawer.Screen name="AllFolioEquipeRetourScreen" component={AllFolioEquipeRetourScreen} />
                                        <Drawer.Screen name="AllFoliosSuperviseurPvScreen" component={AllFoliosSuperviseurPvScreen} />
                                </>
                                : null}
                        <Drawer.Screen name="AllVolumeRecusChefEquiScreen" component={AllVolumeRecusChefEquiScreen} />
                        <Drawer.Screen name="AllVolumeRetourScreen" component={AllVolumeRetourScreen} />
                </Drawer.Navigator>
        )
}