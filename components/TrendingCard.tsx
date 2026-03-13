import { images } from "@/constants/images";
import {
    Image,
    Platform,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

const TrendingCard = ({ movie, index }: TrendingCardProps) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const cardWidth = isWeb ? (width >= 1280 ? 230 : 210) : 192;
  const cardHeight = isWeb ? (width >= 1280 ? 338 : 310) : 288;

  return (
    <TouchableOpacity
      className="relative"
      onPress={() => {
        // Navigate to movie details page
        // router.push(`/movie/${movie.movie_id}`);
      }}
    >
      <View
        className="relative"
        style={{ width: cardWidth, height: cardHeight }}
      >
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
        <View
          className="absolute bottom-0 left-0 right-0 bg-black/70 rounded-b-2xl"
          style={{ padding: isWeb ? 12 : 10 }}
        >
          <Text
            className="text-white font-bold text-sm"
            style={isWeb ? { fontSize: 14 } : undefined}
            numberOfLines={2}
          >
            {movie.title}
          </Text>
          <Text
            className="text-gray-300 text-xs mt-1"
            style={isWeb ? { fontSize: 12 } : undefined}
          >
            {movie.count} searches
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingCard;
