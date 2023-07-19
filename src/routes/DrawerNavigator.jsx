import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import DrawerContent from "../components/app/DrawerContent";
import AllVolumeScreen from "../screens/volume/AllVolumeScreen";
import VolumePrepareScreen from "../screens/volume/VolumePrepareScreen";
import AgentSupPhasePreparationRetourScreen from "../screens/retour/AgentSupPhasePreparationRetourScreen";
import AllFolioSupAgentScreen from "../screens/chefPlateaux/AllFolioSupAgentScreen";
import { useSelector } from "react-redux";
import { userSelector } from "../store/selectors/userSelector";
import AgentChefPlateauRetourScreen from "../screens/retour/AgentChefPlateauRetourScreen";

export default function DrawerNavigator() {
        const drawr = true
        const user = useSelector(userSelector)
        const Drawer = createDrawerNavigator()
        return (
                <Drawer.Navigator screenOptions={{ headerShown: false, lazy: true, unmountOnBlur: true }} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                        {(user.ID_PROFIL == 1 || user.ID_PROFIL == 2 || user.ID_PROFIL == 3 || user.ID_PROFIL == 29 || user.ID_PROFIL == 7) ?
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
                        <Drawer.Screen name="AllFolioSupAgentScreen" component={AllFolioSupAgentScreen} />
                        <Drawer.Screen name="AgentSupPhasePreparationRetourScreen" component={AgentSupPhasePreparationRetourScreen} />
                </Drawer.Navigator>
        )
}