// Appwrite service for managing trending movies and search history
import { Client, Databases, ID, Query } from "react-native-appwrite";

const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Initialize Appwrite Client
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const databases = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // List existing documents by search term
    const documents = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", query)],
    );

    if (documents.documents && documents.documents.length > 0) {
      // Update existing document
      const doc = documents.documents[0];
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc.count as number) + 1,
      });
      console.log(`Updated search count for: ${query}`);
    } else {
      // Create new document
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
      console.log(`Created new search record for: ${query}`);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    // Don't throw - fail silently to not break the app
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    // Try to get documents - ordering might fail if schema isn't set up yet
    let result;
    try {
      result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(10),
        Query.orderDesc("count"),
      ]);
    } catch (queryError) {
      // If ordering fails, just get the documents without ordering
      console.log("Count attribute not indexed, fetching without ordering");
      result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(10),
      ]);
    }

    if (result.documents && Array.isArray(result.documents)) {
      const movies = result.documents.map((doc: any) => ({
        searchTerm: doc.searchTerm,
        movie_id: doc.movie_id,
        title: doc.title,
        count: doc.count || 0,
        poster_url: doc.poster_url,
      }));

      // Sort by count in JavaScript if database sorting failed
      movies.sort((a, b) => b.count - a.count);

      return movies.slice(0, 5);
    }

    return [];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    // Return empty array instead of mock data
    return [];
  }
};
