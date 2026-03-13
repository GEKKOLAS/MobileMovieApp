import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface StatProps {
  label: string;
  value: string;
}

const Stat = ({ label, value }: StatProps) => (
  <View className="items-center flex-1">
    <Text className="text-white font-bold text-xl">{value}</Text>
    <Text className="text-accentText text-xs mt-1">{label}</Text>
  </View>
);

interface MenuItemProps {
  icon: any;
  label: string;
  value?: string;
}

const MenuItem = ({ icon, label, value }: MenuItemProps) => (
  <View className="flex-row items-center px-5 py-4 border-b border-ratingBox">
    <View className="bg-ratingBox rounded-full p-2 mr-4">
      <Image source={icon} className="size-5" tintColor="#AB8BFF" />
    </View>
    <Text className="text-white flex-1 text-sm font-medium">{label}</Text>
    {value ? (
      <Text className="text-accentText text-sm mr-2">{value}</Text>
    ) : null}
    <Image source={icons.arrow} className="size-4" tintColor="#A8B5DB" />
  </View>
);

const Profile = () => {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header background strip */}
        <View className="relative">
          <Image
            source={images.bg}
            className="absolute w-full h-48 z-0"
            resizeMode="cover"
          />

          {/* Avatar + name */}
          <View className="items-center pt-12 pb-6 z-10">
            <View className="bg-ratingBox rounded-full p-1 mb-4 border-2 border-darkAccent">
              <View className="bg-searchBar rounded-full size-24 items-center justify-center">
                <Image
                  source={icons.person}
                  className="size-10"
                  tintColor="#AB8BFF"
                />
              </View>
            </View>
            <Text className="text-white text-2xl font-bold">Movie Fan</Text>
            <Text className="text-accentText text-sm mt-1">@moviefan</Text>
          </View>
        </View>

        {/* Stats row */}
        <View className="flex-row bg-searchBar mx-5 rounded-2xl py-5 mb-6 border border-ratingBox">
          <Stat label="Watched" value="128" />
          <View className="w-px bg-ratingBox" />
          <Stat label="Saved" value="34" />
          <View className="w-px bg-ratingBox" />
          <Stat label="Reviews" value="12" />
        </View>

        {/* Favorite genres */}
        <View className="mx-5 mb-6">
          <Text className="text-white font-bold text-base mb-3">
            Favorite Genres
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {["Action", "Sci-Fi", "Thriller", "Drama", "Horror"].map(
              (genre) => (
                <View
                  key={genre}
                  className="bg-ratingBox px-4 py-2 rounded-full border border-darkAccent"
                >
                  <Text className="text-secondaryText text-xs font-semibold">
                    {genre}
                  </Text>
                </View>
              ),
            )}
          </View>
        </View>

        {/* Menu section */}
        <View className="mx-5 bg-searchBar rounded-2xl overflow-hidden border border-ratingBox mb-6">
          <MenuItem icon={icons.save} label="Saved Movies" value="34" />
          <MenuItem icon={icons.star} label="My Reviews" value="12" />
          <MenuItem icon={icons.search} label="Watch History" value="128" />
        </View>

        {/* Settings section */}
        <View className="mx-5 bg-searchBar rounded-2xl overflow-hidden border border-ratingBox">
          <MenuItem icon={icons.person} label="Edit Profile" />
          <MenuItem icon={icons.home} label="Notifications" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
