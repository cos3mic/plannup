# PlanUp – Monorepo

PlanUp is a full-stack project-management platform.  
This monorepo contains:

| Folder | Stack | Purpose |
|--------|-------|---------|
| `backend/` | Java • Spring Boot 3 • MongoDB | REST API, authentication bridge, background jobs |
| `plan_up/` | React Native Expo • Clerk | Mobile application |

---

## Prerequisites

| Area | Requirement |
|------|-------------|
| Backend | JDK **17+** ( project currently targets 24 ), Maven 3.9 |
| Mobile | Node 18+, npm / yarn, Expo CLI, Android Studio and/or Xcode |
| Shared | A running MongoDB instance |

---

## Getting Started

### 1. Clone
```bash
git clone <repo-url>
cd plannup
```

### 2. Environment variables
Create the following files (samples are committed):

* `backend/.env` → Mongo credentials, mail server keys, etc.
* `plan_up/.env` → `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_key>`

### 3. Run Backend
```bash
cd backend
mvn spring-boot:run
```
REST API is now available at `http://localhost:8080`.

### 4. Run Mobile App
```bash
cd ../plan_up
npm install        # or yarn
npm start          # Expo dev server
```
Press **a** for Android, **i** for iOS, or **w** for Web.

---

## API
A high-level contract lives in [`backend/API_SPECIFICATION.md`](backend/API_SPECIFICATION.md).

---

## Project Structure (simplified)
```
plannup/
├── backend/            <- Spring Boot  application
│   ├── src/main/java/…
│   └── pom.xml
├── plan_up/            <- React Native Expo app (see dedicated README inside)
├── README.md           <- you are here
└── .gitignore
```

---

## Useful Scripts
| Location | Command | Description |
|----------|---------|-------------|
| backend  | `mvn test` | Run backend test-suite |
| backend  | `mvn package` | Build runnable JAR `target/backend-<ver>.jar` |
| plan_up  | `npm run lint` | ESLint/TypeScript checks |
| plan_up  | `npm run android / ios / web` | Launch on specific platform |

---

## Contributing
1. Fork → Branch → Commit with conventional messages.  
2. Ensure **both** backend & mobile tests pass.  
3. Open a Pull Request.

### Coding Standards
* Backend: Spring Boot best-practices, Lombok, Jakarta Validation.  
* Frontend: ESLint (Expo), TypeScript strict mode.

---

## License
This project is licensed under the MIT License.
