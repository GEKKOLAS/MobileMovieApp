import { icons } from "@/constants/icons";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({
  onPress,
  placeholder = "Search",
  value,
  onChangeText,
}: SearchBarProps) => {
  if (onPress) {
    // Render as a touchable button
    return (
      <TouchableOpacity
        onPress={onPress}
        className="bg-gray-800/50 rounded-xl p-4 flex-row items-center border border-gray-700"
      >
        <Image
          source={icons.search}
          className="w-5 h-5 mr-3"
          tintColor="#9CA3AF"
        />
        <Text className="text-gray-400 flex-1">{placeholder}</Text>
      </TouchableOpacity>
    );
  }

  // Render as an actual input
  return (
    <View className="bg-gray-800/50 rounded-xl p-4 flex-row items-center border border-gray-700">
      <Image
        source={icons.search}
        className="w-5 h-5 mr-3"
        tintColor="#9CA3AF"
      />
      <TextInput
        className="text-white flex-1"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;
