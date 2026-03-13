import MovieModal from "@/components/MovieModal";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { useState } from "react";
import {
    FlatList,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Save = () => {
  const { saved } = useSavedMovies();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  const numColumns = isWeb
    ? width >= 1400
      ? 6
      : width >= 1180
        ? 5
        : width >= 920
          ? 4
          : width >= 640
            ? 3
            : 2
    : 3;

  if (saved.length === 0) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <Image
          source={images.bg}
          className="absolute w-full z-0"
          resizeMode="cover"
        />
        <View className="flex-1 items-center justify-center gap-4">
          <Image source={icons.save} className="size-12" tintColor="#AB8BFF" />
          <Text className="text-white text-lg font-bold">
            No saved movies yet
          </Text>
          <Text className="text-accentText text-sm text-center px-10">
            Tap the Save button on any movie to add it here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        key={`saved-${numColumns}`}
        data={saved}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        style={
          isWeb
            ? { width: "100%", maxWidth: 1360, alignSelf: "center" }
            : undefined
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        ListHeaderComponent={
          <Text className="text-white text-xl font-bold mb-4">
            Saved Movies ({saved.length})
          </Text>
        }
        renderItem={({ item }) => {
          const posterUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image";
          return (
            <TouchableOpacity
              className="flex-1 bg-gray-800 rounded-xl overflow-hidden"
              onPress={() => setSelectedId(item.id)}
            >
              <View className="relative">
                <Image
                  source={{ uri: posterUrl }}
                  className="w-full"
                  style={{ height: isWeb ? (width >= 1180 ? 250 : 220) : 160 }}
                  resizeMode="cover"
                />
                <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex-row items-center">
                  <Image
                    source={icons.star}
                    className="w-3 h-3 mr-1"
                    tintColor="#FFD700"
                  />
                  <Text className="text-white text-xs font-semibold">
                    {item.vote_average.toFixed(1)}
                  </Text>
                </View>
              </View>
              <View className="p-2">
                <Text
                  className="text-white text-xs font-semibold"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {new Date(item.release_date).getFullYear()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <MovieModal
        movieId={selectedId}
        visible={selectedId !== null}
        onClose={() => setSelectedId(null)}
      />
    </SafeAreaView>
  );
};

export default Save;
