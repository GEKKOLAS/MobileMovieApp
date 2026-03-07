import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
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
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
      <View className="px-5 pt-5">
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
            handleSearch(text);
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
                data={searchResults}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{ gap: 8 }}
                contentContainerStyle={{ gap: 8 }}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : searchQuery.trim() ? (
            <Text className="text-gray-400 text-center mt-10">
              No results found for "{searchQuery}"
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
