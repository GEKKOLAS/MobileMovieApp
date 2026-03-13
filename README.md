# MobileMovieApp

A cross-platform movie discovery app built with Expo + React Native, designed to run on iOS, Android, and Web from a single codebase.

## Tech Stack

### Frontend
- `Expo` (`~54`)
- `React Native` (`0.81`) + `React` (`19`)
- `Expo Router` (file-based routing)
- `NativeWind` + `TailwindCSS` for styling
- `react-native-safe-area-context` for safe areas
- `react-native-web` for browser support

### Backend and Data
- `TMDB API` for movie catalog, search, and movie details
- `Appwrite` for trending/search analytics storage
- Local saved movies state via React Context
   - Web persistence with `localStorage`
   - In-memory fallback on native

## Core Features

- Home feed with:
   - Trending movies (from Appwrite)
   - Latest movies (from TMDB popular endpoint)
- Search with debounce and result tracking
- Movie details modal with:
   - Poster image
   - Title
   - Description (overview)
   - Rating and vote count
- Save/unsave movie flow from modal
- Saved movies tab with responsive grid
- Profile tab UI
- Web-specific layout optimizations (responsive columns, centered containers, virtualized list tuning)

## Project Structure

```text
app/
   _layout.tsx              # Root stack + providers
   search.tsx               # Standalone search route
   (tabs)/
      _layout.tsx            # Tab layout/navigation styles
      index.tsx              # Home tab
      search.tsx             # Search tab
      save.tsx               # Saved movies tab
      profile.tsx            # Profile tab
   movie/[id].tsx           # Legacy full details screen

components/
   MovieCard.tsx
   TrendingCard.tsx
   SearchBar.tsx
   MovieModal.tsx           # Details modal + save button

context/
   SavedMoviesContext.tsx   # Saved movie state/persistence

services/
   api.ts                   # TMDB integration
   appwrite.ts              # Appwrite integration + ping helper
   usefetch.ts              # Reusable fetch hook

constants/
   icons.ts
   images.ts
```

## Architecture Overview

### Frontend Flow
- UI renders movie lists via `MovieCard` and `TrendingCard`.
- Tapping a card opens `MovieModal`.
- `MovieModal` fetches full movie details via `fetchMovieDetails(movieId)`.
- Save button in modal uses `SavedMoviesContext.toggleSave()`.
- `Save` tab consumes `SavedMoviesContext.saved` and renders saved movies.

### Backend Flow

#### TMDB (`services/api.ts`)
- `fetchMovies({ query, page })`
   - `query` present: `search/movie`
   - no query: `movie/popular`
- `fetchMovieDetails(movieId)`
   - fetches detailed data for modal/details pages

#### Appwrite (`services/appwrite.ts`)
- `pingAppwrite()`
   - calls `GET {ENDPOINT}/health` to validate connectivity
- `updateSearchCount(query, movie)`
   - updates existing search term count or inserts new document
- `getTrendingMovies()`
   - fetches and returns top movies by search count

## Environment Variables

Create `.env` at project root:

```env
EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_bearer_token

EXPO_PUBLIC_APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_PROJECT_NAME=your_project_name
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
```

Notes:
- `DATABASE_ID` and `COLLECTION_ID` are required for trending/search analytics.
- All vars are exposed with `EXPO_PUBLIC_` prefix because they are used client-side.

## Appwrite Collection Schema

The analytics collection used by `updateSearchCount`/`getTrendingMovies` needs fields:

- `searchTerm` (string)
- `movie_id` (number)
- `title` (string)
- `count` (number)
- `poster_url` (string)

Recommended index:
- index on `count` (descending sort support)

## Installation and Run

```bash
npm install
```

```bash
npm run start
```

Platform shortcuts:

```bash
npm run android
npm run ios
npm run web
```

Lint:

```bash
npm run lint
```

## Useful Scripts

- `npm run start` - Start Expo dev server
- `npm run web` - Start web build locally
- `npm run android` - Open Android target
- `npm run ios` - Open iOS target
- `npm run lint` - Lint project with Expo ESLint config

## Current Persistence Behavior

- Saved movies:
   - Web: persisted to `localStorage`
   - Native: memory only (resets on app restart)

If you want native persistence, add `AsyncStorage` in `SavedMoviesContext`.

## Troubleshooting

- Appwrite ping fails:
   - verify `EXPO_PUBLIC_APPWRITE_ENDPOINT`
   - verify project ID
   - check network/firewall

- Trending list empty:
   - verify `DATABASE_ID` and `COLLECTION_ID`
   - verify collection schema fields
   - ensure permissions allow reads/writes

- TMDB requests fail:
   - verify `EXPO_PUBLIC_MOVIE_API_KEY` bearer token

## License

Private project (set `private: true` in `package.json`).
