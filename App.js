import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/ui/IconButton";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { init } from "./util/database";
import PlaceDetails from "./screens/PlaceDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  
  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!dbInitialized) {
    return <AppLoading />;
  }
  
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { 
              backgroundColor: Colors.primary200,
            },
            headerTintColor: Colors.primary50,
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerShadowVisible: false,
            contentStyle: { 
              backgroundColor: Colors.primary200,
            },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "My Fav Spot",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 24,
                color: Colors.accent500,
              },
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => {
                    navigation.navigate("AddPlace");
                  }}
                />
              ),
              headerLeft: null,
            })}
          />
          
          <Stack.Screen
            name="AddPlace"
            component={AddPlace}
            options={{
              title: "Add New Place",
              headerTitleStyle: {
                fontWeight: "600",
                fontSize: 20,
                color: Colors.accent500,
              },
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          <Stack.Screen
            name="Map"
            component={Map}
            options={({ route }) => ({
              title: route.params?.initialLat ? "Place Location" : "Pick Location",
              headerTitleStyle: {
                fontWeight: "600",
                fontSize: 20,
                color: Colors.primary50,
              },
              presentation: "fullScreenModal",
            })}
          />
          
          <Stack.Screen
            name="PlaceDetails"
            component={PlaceDetails}
            options={{
              title: "Place Details",
              headerTitleStyle: {
                fontWeight: "600",
                fontSize: 20,
                color: Colors.accent500,
              },
              headerBackTitle: "Back",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});