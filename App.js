import 'react-native-reanimated'
import 'react-native-gesture-handler';
import AppContainer from './src/AppContainer';
import { Provider } from 'react-redux';
import { store } from './src/store'
import { Host } from 'react-native-portalize';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(["flexWrap: `wrap``", "Warning: This synthetic event is reused for performance reasons", "Possible Unhandled Promise Rejection"]);
let App = () =>  {
          return (
                    <>
                    <StatusBar backgroundColor='#fff' barStyle='dark-content' hidden />
                    <Provider store={store}>
                              <Host>
                                        <AppContainer />
                              </Host>
                    </Provider>

                    </>
          )
}
App = codePush({
    updateDialog: false,
    installMode: codePush.InstallMode.ON_NEXT_RESTART,
})(App)
export default App