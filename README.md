# SnapSense – A Real-Time Image Interaction 

A scalable, production-ready A Real-Time Image Interaction, Where users can respond with multiple images by giving reactions via emojis and by submitting their comments..

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd your-project-folder
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## 🔧 Tech Stack

- **React** - UI library
- **TailwindCSS** - For Styling
- **Zustand** - Context management
- **React Query** - async state and caching
- **InstantDb** - Real time data
- **Material UI** - For Grid System

API Handling Strategy

The app relies on InstantDB’s real-time sync instead of a traditional REST API layer.
There is no separate backend server, client-side mutations and subscriptions directly interact with InstantDB.

Key points:

Real-time subscriptions are used to keep reactions and comments in sync across users.
Optimistic updates ensure UI responsiveness while InstantDB propagates changes.
React Query is used to manage async state, caching, and mutation lifecycle instead of manually handling loading/error states.
This approach reduced backend complexity but required careful handling of real-time conflicts, especially for reactions.

InstantDB Schema & Usage
```bash
export const schema = i.schema({
  entities: {
    reactions: i.entity({
      imageId: i.string(),
      userName: i.string(),
      emojis: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
    comments: i.entity({
      userName: i.string(),
      imageId: i.string(),
      text: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
  },
});

```


Challenges Faced & How They Were Solved

1. Reaction Constraints (One Reaction per User per Image)

Problem:
Unlike comments, reactions must be limited to one per user per image, while still allowing real-time updates.

Solution:
Before inserting a reaction, the app checks for an existing reaction by the same user for the same image.
If one exists, it is updated instead of duplicated.
This logic prevents reaction spam while preserving real-time behavior.

2. Real-Time Feed Synchronization

Problem:
Ensuring reactions and comments update instantly across all users without UI flicker or duplication.

Solution:
InstantDB real-time subscriptions handle sync.
React Query manages cache invalidation and updates.
Optimistic UI updates provide instant feedback while waiting for confirmation.


## 💡 Challenges & Learnings
This project forced learning tools outside my comfort zone, which was intentional.

Zustand
First time using it. Learned how effective minimal global state can be compared to Redux.

InstantDB
First exposure to schema-driven real-time databases.
Learned how real-time sync changes how you think about data consistency.

React Query
Coming from Redux, this was a major upgrade.
It simplified async logic, caching, and error handling dramatically.


## 📝 Future Enhancements
With more time, I would add:

Users can delete their own comments

Users can like individual comments

Users can reply to comments (nested/threaded comments)

Users can upload and post images


---

Built with a focus on clean code, scalability, and developer experience.
