import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { useSelector } from "react-redux";
import DrawerContent from "../components/app/DrawerContent";
import AllVolumeScreen from "../screens/preparation/AllVolumeScreen";
import AgentPreparationFolioScreen from "../screens/preparation/AgentPreparationFolioScreen";
import FolioRetourScreen from "../screens/preparation/FolioRetourScreen";
import AgentSuperviseurScreen from "../screens/preparation/AgentSuperviseurScreen";
import ChefPlateauScreen from "../screens/preparation/ChefPlateauScreen";
import AgentSuperviseurAileScreen from "../screens/preparation/AgentSuperviseurAileScreen";
import AllVolumeDetaillerScreen from "../screens/preparation/AllVolumeDetaillerScreen";
import { userSelector } from "../store/selectors/userSelector";
import PROFILS from "../constants/PROFILS";
export default function DrawerNavigator() {
        const drawr = true
        const user = useSelector(userSelector)
        const Drawer = createDrawerNavigator()
        return (
                <Drawer.Navigator screenOptions={{ headerShown: false, lazy: true, unmountOnBlur: true }} useLegacyImplementation={true} drawerContent={props => <DrawerContent {...props} />}>
                        {(user.ID_PROFIL == PROFILS.CHEF_DIVISION_ARCHIGES) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENTS_DESARCHIVAGES ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                </>
                                : null}

                        {user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_ARCHIVE ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AllVolumeDetaillerScreen" component={AllVolumeDetaillerScreen} />
                                </>
                                : null}
                        {(user.ID_PROFIL == PROFILS.AGENTS_DISTRIBUTEUR) ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.CHEF_PLATEAU ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentSuperviseurScreen" component={AgentSuperviseurScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENTS_SUPERVISEUR_AILE ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="ChefPlateauScreen" component={ChefPlateauScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.AGENT_SUPERVISEUR ?
                                <>
                                        <Drawer.Screen name="AllVolumeScreen" component={AllVolumeScreen} />
                                        <Drawer.Screen name="AgentPreparationFolioScreen" component={AgentPreparationFolioScreen} />
                                        <Drawer.Screen name="FolioRetourScreen" component={FolioRetourScreen} />
                                </>
                                : null}
                        {user.ID_PROFIL == PROFILS.CHEF_EQUIPE ?
                                <>
                                        <Drawer.Screen name="AgentSuperviseurAileScreen" component={AgentSuperviseurAileScreen} />
                                </>
                                : null}
                </Drawer.Navigator>
        )
}