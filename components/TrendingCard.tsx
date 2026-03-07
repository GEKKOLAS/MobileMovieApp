import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

const TrendingCard = ({ movie, index }: TrendingCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="relative"
      onPress={() => {
        // Navigate to movie details page
        // router.push(`/movie/${movie.movie_id}`);
      }}
    >
      <View className="relative w-48 h-72">
        <Image
          source={{ uri: movie.poster_url }}
          className="w-full h-full rounded-2xl"
          resizeMode="cover"
        />

        {/* Ranking badge */}
        <View className="absolute top-3 left-3">
          <Image
            source={images.rankingGradient}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
          <View className="w-12 h-12 items-center justify-center">
            <Text className="text-white text-xl font-bold">{index + 1}</Text>
          </View>
        </View>

        {/* Movie title overlay */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 rounded-b-2xl">
          <Text className="text-white font-bold text-sm" numberOfLines={2}>
            {movie.title}
          </Text>
          <Text className="text-gray-300 text-xs mt-1">
            {movie.count} searches
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingCard;
