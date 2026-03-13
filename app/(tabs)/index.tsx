import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/usefetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";

const Index = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  const latestMovieColumns = isWeb
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

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        style={
          isWeb
            ? {
                width: "100%",
                maxWidth: 1360,
                alignSelf: "center",
              }
            : undefined
        }
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push("/search" as any);
              }}
              placeholder="Search for a movie"
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  initialNumToRender={isWeb ? 8 : 5}
                  maxToRenderPerBatch={isWeb ? 8 : 5}
                  windowSize={isWeb ? 8 : 5}
                  removeClippedSubviews
                  contentContainerStyle={{ gap: isWeb ? 20 : 26 }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                key={`latest-${latestMovieColumns}`}
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={latestMovieColumns}
                initialNumToRender={isWeb ? 18 : 9}
                maxToRenderPerBatch={isWeb ? 24 : 12}
                windowSize={isWeb ? 10 : 7}
                updateCellsBatchingPeriod={16}
                removeClippedSubviews
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: isWeb ? 16 : 20,
                  paddingRight: 5,
                  marginBottom: isWeb ? 14 : 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
