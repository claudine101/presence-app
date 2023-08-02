import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import DrawerContent from "../components/app/DrawerContent";
import AllVolumeScreen from "../screens/preparation/AllVolumeScreen";
import AllFolioScreen from "../screens/preparation/AllFolioScreen";
import VolumePrepareScreen from "../screens/volume/VolumePrepareScreen";
import AgentSupPhasePreparationRetourScreen from "../screens/retour/AgentSupPhasePreparationRetourScreen";
import AgentPreparationFolioScreen from "../screens/preparation/AgentPreparationFolioScreen";
import FolioRetourScreen from "../screens/preparation/FolioRetourScreen";
import AgentSuperviseurScreen from "../screens/preparation/AgentSuperviseurScreen";


import { useSelector } from "react-redux";
import { userSelector } from "../store/selectors/userSelector";
import AgentChefPlateauRetourScreen from "../screens/retour/AgentChefPlateauRetourScreen";
import AgentSuperiveurAilleRetourScreen from "../screens/retour/AgentSuperiveurAilleRetourScreen";
import AgentDesarchivagesRetourScreen from "../screens/retour/AgentDesarchivagesRetourScreen";
import AgentSupArchiveRetourScreen from "../screens/retour/AgentSupArchiveRetourScreen";
import AgentDistributionRetourScreen from "../screens/retour/AgentDistributionRetourScreen";
import PROFILS from "../constants/PROFILS";

export default function DrawerNavigator() {
        const drawr = true
        const user = useSelector(userSelector)
        const Drawer = createDrawerNavigator()
        return (
                <Drawer.Navigator screenOptions={{ headerShown: false, lazy: true, unmountOnBlur: true }} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                        {(user.ID_PROFIL == 1) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name='VolumePrepareScreen' component={VolumePrepareScreen} />
                                </>
                                : null}
                        {(user.ID_PROFIL == 4) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name='VolumePrepareScreen' component={VolumePrepareScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == 15 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentChefPlateauRetourScreen" component={AgentChefPlateauRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentPreparationFolioScreen" component={AgentPreparationFolioScreen} />
                                        <Drawer.Screen name="FolioRetourScreen" component={FolioRetourScreen} />

                                </>
                                : null}
                        {user.ID_PROFIL == 2 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentDesarchivagesRetourScreen" component={AgentDesarchivagesRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == 3 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentSupArchiveRetourScreen" component={AgentSupArchiveRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == 5 ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentDistributionRetourScreen" component={AgentDistributionRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.CHEF_PLATEAU ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentSuperviseurScreen" component={AgentSuperviseurScreen} />
                                </>
                                : null}
                                
                                
                </Drawer.Navigator>
        )
}