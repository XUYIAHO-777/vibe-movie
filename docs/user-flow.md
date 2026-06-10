# User Flow

```mermaid
journey
  title VibeMovie emotional movie journey
  section Start
    User enters current mood: 5: User
    App sends mood to AI: 4: App
  section Reflection
    AI returns questions: 4: DeepSeek
    User answers what resonates: 5: User
  section Recommendation
    App requests movie matches: 4: App
    AI returns three movie candidates: 4: DeepSeek
    TMDB adds posters and ratings: 4: TMDB
  section Memory
    User selects one movie: 5: User
    App saves the emotional record: 4: App
    User can view archive or wall: 5: User
```

## Flow Summary

1. Mood input: The user describes their current feeling in natural language.
2. Resonance questions: The app asks AI-generated follow-up questions to clarify the emotional context.
3. Movie selection: The app recommends three movies matched to the user's mood and answers.
4. Poster view: The user can create a cinematic shareable poster.
5. Archive: The recommendation is saved as an emotional record.
6. Wall: Public records can be displayed as shared emotional traces.
