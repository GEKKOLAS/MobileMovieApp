import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MovieCard = (movie: Movie) => {
  const router = useRouter();

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <TouchableOpacity
      className="flex-1 m-1 bg-gray-800 rounded-lg overflow-hidden"
      onPress={() => {
        // Navigate to movie details page
        // router.push(`/movie/${movie.id}`);
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: posterUrl }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex-row items-center">
          <Image
            source={icons.star}
            className="w-3 h-3 mr-1"
            tintColor="#FFD700"
          />
          <Text className="text-white text-xs font-semibold">
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>
      </View>
      <View className="p-2">
        <Text className="text-white text-xs font-semibold" numberOfLines={2}>
          {movie.title}
        </Text>
        <Text className="text-gray-400 text-xs mt-1">
          {new Date(movie.release_date).getFullYear()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
