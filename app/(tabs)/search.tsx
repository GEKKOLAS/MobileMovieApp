import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/usefetch";

import MovieDisplayCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  const searchColumns = isWeb
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
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();

        // Call updateSearchCount only if there are results
        if (movies?.length! > 0 && movies?.[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        }
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        style={
          isWeb
            ? {
                width: "100%",
                maxWidth: 1360,
                alignSelf: "center",
              }
            : undefined
        }
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieDisplayCard {...item} />}
        key={`search-${searchColumns}`}
        numColumns={searchColumns}
        initialNumToRender={isWeb ? 18 : 9}
        maxToRenderPerBatch={isWeb ? 24 : 12}
        windowSize={isWeb ? 10 : 7}
        updateCellsBatchingPeriod={16}
        removeClippedSubviews
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: isWeb ? 120 : 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
