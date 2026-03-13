import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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

  useEffect(() => {
    if (!isWeb) {
      setDebouncedQuery(searchQuery);
      return;
    }

    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery, isWeb]);

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await fetchMovies({ query });
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View
        className="px-5 pt-5"
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
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-5 flex-row items-center"
        >
          <Image
            source={icons.arrow}
            className="w-6 h-6 mr-2"
            tintColor="#fff"
          />
          <Text className="text-white text-lg">Back</Text>
        </TouchableOpacity>

        {/* Search bar */}
        <SearchBar
          placeholder="Search for a movie"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (!isWeb) {
              handleSearch(text);
            }
          }}
        />

        {/* Results */}
        <View className="mt-5">
          {isSearching ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
          ) : searchResults.length > 0 ? (
            <>
              <Text className="text-white text-lg font-bold mb-3">
                Search Results ({searchResults.length})
              </Text>
              <FlatList
                key={`search-page-${searchColumns}`}
                data={searchResults}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={searchColumns}
                initialNumToRender={isWeb ? 18 : 9}
                maxToRenderPerBatch={isWeb ? 24 : 12}
                windowSize={isWeb ? 10 : 7}
                updateCellsBatchingPeriod={16}
                removeClippedSubviews
                columnWrapperStyle={{
                  gap: isWeb ? 16 : 8,
                  marginBottom: isWeb ? 12 : 8,
                }}
                contentContainerStyle={{
                  gap: isWeb ? 16 : 8,
                  paddingBottom: 120,
                }}
                style={
                  isWeb
                    ? {
                        width: "100%",
                        maxWidth: 1360,
                        alignSelf: "center",
                      }
                    : undefined
                }
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : searchQuery.trim() ? (
            <Text className="text-gray-400 text-center mt-10">
              No results found for: {searchQuery}
            </Text>
          ) : (
            <Text className="text-gray-400 text-center mt-10">
              Start typing to search for movies
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Search;
