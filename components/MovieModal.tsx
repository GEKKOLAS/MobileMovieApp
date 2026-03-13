import { icons } from "@/constants/icons";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { fetchMovieDetails } from "@/services/api";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface MovieModalProps {
  movieId: number | null;
  visible: boolean;
  onClose: () => void;
}

export default function MovieModal({
  movieId,
  visible,
  onClose,
}: MovieModalProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const isWeb = Platform.OS === "web";
  const { isSaved, toggleSave } = useSavedMovies();
  const saved = movie ? isSaved(movie.id) : false;

  useEffect(() => {
    if (!visible || !movieId) {
      setMovie(null);
      return;
    }
    setLoading(true);
    fetchMovieDetails(movieId)
      .then(setMovie)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [visible, movieId]);

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : null;

  return (
    <Modal
      visible={visible}
      animationType={isWeb ? "fade" : "slide"}
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        {/* Backdrop tap to close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Sheet */}
        <View style={[styles.sheet, isWeb && styles.sheetWeb]}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeTxt}>✕</Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#AB8BFF" />
            </View>
          ) : (
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {/* Poster */}
              {posterUrl && (
                <View>
                  <Image
                    source={{ uri: posterUrl }}
                    style={styles.poster}
                    resizeMode="cover"
                  />
                  <View style={styles.posterFade} />
                </View>
              )}

              <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>{movie?.title}</Text>

                {/* Year · runtime */}
                <Text style={styles.meta}>
                  {movie?.release_date?.split("-")[0]}
                  {movie?.runtime ? ` · ${movie.runtime} min` : ""}
                </Text>

                {/* Rating */}
                <View style={styles.ratingRow}>
                  <Image
                    source={icons.star}
                    style={styles.starIcon}
                    tintColor="#FFD700"
                  />
                  <Text style={styles.ratingValue}>
                    {(movie?.vote_average ?? 0).toFixed(1)}
                    <Text style={styles.ratingMax}>/10</Text>
                  </Text>
                  <Text style={styles.voteCount}>
                    ({movie?.vote_count?.toLocaleString()} votes)
                  </Text>
                </View>

                {/* Genres */}
                {(movie?.genres?.length ?? 0) > 0 && (
                  <View style={styles.genreRow}>
                    {movie!.genres.map((g) => (
                      <View key={g.id} style={styles.genreChip}>
                        <Text style={styles.genreText}>{g.name}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Overview */}
                <Text style={styles.overviewLabel}>Overview</Text>
                <Text style={styles.overview}>
                  {movie?.overview || "No overview available."}
                </Text>

                {/* Save button */}
                <TouchableOpacity
                  style={[styles.saveBtn, saved && styles.saveBtnActive]}
                  onPress={() =>
                    movie &&
                    toggleSave({
                      id: movie.id,
                      title: movie.title,
                      poster_path: movie.poster_path,
                      vote_average: movie.vote_average,
                      release_date: movie.release_date,
                      overview: movie.overview ?? "",
                    })
                  }
                >
                  <Image
                    source={icons.save}
                    style={styles.saveBtnIcon}
                    tintColor={saved ? "#030014" : "#AB8BFF"}
                  />
                  <Text
                    style={[
                      styles.saveBtnText,
                      saved && styles.saveBtnTextActive,
                    ]}
                  >
                    {saved ? "Saved" : "Save Movie"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#030014",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    overflow: "hidden",
  },
  sheetWeb: {
    width: "90%",
    maxWidth: 660,
    alignSelf: "center",
    borderRadius: 28,
    marginBottom: 48,
    maxHeight: "85%",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.65)",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  closeTxt: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 17,
  },
  loader: {
    paddingVertical: 72,
    alignItems: "center",
  },
  poster: {
    width: "100%",
    height: 320,
  },
  posterFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(3,0,20,0.75)",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    paddingRight: 36,
  },
  meta: {
    color: "#A8B5DB",
    fontSize: 14,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#221F3D",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    alignSelf: "flex-start",
    gap: 6,
    marginBottom: 16,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  ratingMax: {
    color: "#A8B5DB",
    fontWeight: "normal",
    fontSize: 13,
  },
  voteCount: {
    color: "#A8B5DB",
    fontSize: 13,
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  genreChip: {
    backgroundColor: "#221F3D",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#AB8BFF",
  },
  genreText: {
    color: "#D6C7FF",
    fontSize: 12,
    fontWeight: "600",
  },
  overviewLabel: {
    color: "#A8B5DB",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  overview: {
    color: "#e0e0e0",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#AB8BFF",
    backgroundColor: "transparent",
  },
  saveBtnActive: {
    backgroundColor: "#AB8BFF",
    borderColor: "#AB8BFF",
  },
  saveBtnIcon: {
    width: 18,
    height: 18,
  },
  saveBtnText: {
    color: "#AB8BFF",
    fontWeight: "700",
    fontSize: 15,
  },
  saveBtnTextActive: {
    color: "#030014",
  },
});
