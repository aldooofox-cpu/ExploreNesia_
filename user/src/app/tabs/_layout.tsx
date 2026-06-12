import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
          headerShown: false,
        }}
    >
      <Tabs.Screen
        name="wisata"
        options={{
          title: "Wisata",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("../../../assets/images/tabIcons/home.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs> 
  );
}
  


