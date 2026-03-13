import { Tabs } from "expo-router";
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

function TabIcon({ focused, icon, title, isWeb }: any) {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-4 justify-center items-center rounded-full overflow-hidden"
        style={
          isWeb
            ? {
                minHeight: 46,
                marginTop: 0,
                borderRadius: 12,
                width: "92%",
                flex: 0,
                alignSelf: "center",
              }
            : undefined
        }
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <View
      className="size-full justify-center items-center mt-4 rounded-full"
      style={isWeb ? { marginTop: 0 } : undefined}
    >
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
}

export default function TabsLayout() {
  const isWeb = Platform.OS === "web";

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          tabBarPosition: isWeb ? "top" : "bottom",
          sceneStyle: { backgroundColor: "#030014" },

          tabBarShowLabel: false,
          tabBarItemStyle: {
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: isWeb
            ? {
                backgroundColor: "#0F0D23",
                borderRadius: 50,
                marginLeft: "auto" as any,
                marginRight: "auto" as any,
                marginTop: 14,
                marginBottom: 8,
                height: 52,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#0F0D23",
                width: "90%",
                maxWidth: 680,
              }
            : {
                backgroundColor: "#0F0D23",
                borderRadius: 50,
                marginHorizontal: 20,
                marginBottom: 36,
                height: 52,
                position: "absolute",
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#0F0D23",
              },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "index",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.home}
                title="Home"
                isWeb={isWeb}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.search}
                title="Search"
                isWeb={isWeb}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="save"
          options={{
            title: "Save",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.save}
                title="Save"
                isWeb={isWeb}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.person}
                title="Profile"
                isWeb={isWeb}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#030014",
  },
});
