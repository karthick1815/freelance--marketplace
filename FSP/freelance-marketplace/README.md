# Corkboard — Freelance Marketplace (Java Full Stack Project)

A full-stack freelance marketplace application built with **Java (Spring Boot)** on the backend and
**React** on the frontend, backed by **MySQL**. Clients can browse and post projects; freelancers can
browse projects, view other freelancers, and submit proposals. Accounts are optional to browse, but
required to post a project or submit a proposal. Built as a portfolio project for a Java Full Stack
Developer role.

This project has **two frontends** you can choose from — pick whichever fits what you want to show:

| Frontend | Folder | Tech |
|---|---|---|
| **React (recommended for resumes)** | `frontend-react/` | React 19 + Vite, calls the same backend API |
| **Vanilla JS (original version)** | `frontend/` | Plain HTML/CSS/JS, no build step, double-click to run |

Both talk to the exact same Spring Boot backend — nothing on the backend changes based on which
frontend you use.

---

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.5, Spring Data JPA, Hibernate, Spring Security (for password
  hashing only — not used to lock down endpoints)
- **Database:** MySQL
- **Frontend (React):** React 19, Vite, Bootstrap 5 (as an npm package, not a CDN)
- **Frontend (Vanilla):** HTML, Bootstrap 5 (bundled locally, not via CDN), vanilla JavaScript (`fetch` API)
- **Build tools:** Maven (backend), npm/Vite (React frontend)
- **IDEs:** Eclipse or VS Code for the backend; VS Code for the React frontend

---

## Project Structure

```
freelance-marketplace/
├── backend/                        # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/java/com/freelance/marketplace/
│       ├── FreelanceMarketplaceApplication.java
│       ├── entity/                 # JPA entities: User, Project, Category, ClientProfile,
│       │                           # FreelancerProfile, Proposal
│       ├── repository/             # Spring Data JPA repositories
│       ├── controller/             # REST controllers
│       │   ├── AuthController.java       -> /api/auth/**   (register, login)
│       │   ├── ProjectController.java    -> /api/projects/** (CRUD)
│       │   ├── FreelancerController.java -> /api/freelancers/** (read-only)
│       │   ├── ProposalController.java   -> /api/proposals/** (submit, accept/reject)
│       │   └── CategoryController.java   -> /api/categories
│       └── config/
│           ├── CorsConfig.java     # lets the frontend call the API from a file:// or different port
│           └── SecurityConfig.java # disables Spring Security's default endpoint lock-down
│   └── src/main/resources/
│       └── application.properties  # MySQL connection settings
├── frontend/                        # ORIGINAL vanilla JS frontend (no build step)
│   ├── index.html
│   ├── css/style.css
│   ├── js/script.js                # all fetch() calls + session/login logic
│   └── vendor/                     # Bootstrap + Bootstrap Icons, bundled locally (no CDN dependency)
│       ├── bootstrap/
│       └── bootstrap-icons/
├── frontend-react/                  # NEW React frontend (Vite)
│   ├── package.json
│   ├── index.html                  # Vite's entry HTML (mounts <div id="root">)
│   └── src/
│       ├── main.jsx                 # React entry point, imports Bootstrap CSS
│       ├── App.jsx                  # top-level component, wires everything together
│       ├── index.css                # custom styles (hero gradient, card hover, status badges)
│       ├── api/client.js            # every fetch() call to the Spring Boot API, in one place
│       ├── context/SessionContext.jsx  # login/session state via React Context (replaces localStorage helpers)
│       └── components/
│           ├── Navbar.jsx, Hero.jsx, Stats.jsx, Footer.jsx
│           ├── ProjectGrid.jsx, ProjectCard.jsx
│           ├── FreelancerGrid.jsx, FreelancerCard.jsx, FreelancerDetailModal.jsx
│           ├── PostProjectModal.jsx, SubmitProposalModal.jsx, ViewProposalsModal.jsx
│           ├── LoginModal.jsx, RegisterClientModal.jsx, RegisterFreelancerModal.jsx
│           └── Modal.jsx            # shared modal shell (pure React state, no bootstrap.js needed)
└── database/
    └── freelance_marketplace.sql   # schema + sample data (includes the `password` column)
```

---

## How to Run

### 1. Set up the database
Open MySQL Workbench (or the `mysql` CLI) and run the full script:
```sql
SOURCE database/freelance_marketplace.sql;
```
This drops and recreates the `freelance_marketplace` database with all tables and sample data,
including the `password` column on `users` (required for login to work).

### 2. Configure the backend
Edit `backend/src/main/resources/application.properties` and set your real MySQL username/password:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### 3. Run the backend — choose Eclipse or VS Code

**Option A — Eclipse**
1. Open Eclipse → **File → Import → Maven → Existing Maven Projects**
2. Browse to the `backend` folder → select it → **Finish**
   (Eclipse reads `pom.xml` and downloads all dependencies automatically — this can take a minute
   the first time.)
3. Make sure Eclipse is using **JDK 17**: right-click the project → **Properties → Java Build Path →
   Libraries** — confirm the JRE System Library is 17. If not, **Properties → Java Compiler** → set
   compliance level to 17, and install/select a JDK 17 under **Window → Preferences → Java →
   Installed JREs** if it isn't listed yet.
4. In the **Project Explorer**, expand to
   `src/main/java/com/freelance/marketplace/FreelanceMarketplaceApplication.java`
5. Right-click it → **Run As → Java Application**
6. Watch the **Console** tab at the bottom for:
   ```
   Freelance Marketplace API running at http://localhost:8080
   ```

**Option B — VS Code**
Open `FreelanceMarketplaceApplication.java` and click the **▷ Run** link above the class, or from a
terminal in the `backend` folder:
```bash
mvn spring-boot:run
```

Either way, confirm it's working by visiting `http://localhost:8080/api/projects` in a browser —
you should see raw JSON.

### 4. Run the frontend — choose React or Vanilla JS

**Option A — React (in VS Code)**
```bash
cd frontend-react
npm install
npm run dev
```
Vite will print a local URL, typically `http://localhost:5173`. Open that in your browser. Changes
to any `.jsx` file hot-reload instantly while `npm run dev` is running.

To build a production-ready static version (for deployment, not needed for local development):
```bash
npm run build
```
This outputs static files into `frontend-react/dist/`.

**Option B — Vanilla JS (no build step)**
Double-click `frontend/index.html` — it opens directly in your browser, no server or npm required.

Either frontend shows a green **"API connected"** badge once it successfully reaches the backend.

---

## How the Site Works

- **Browsing is public.** Anyone can view Projects and Freelancers without an account.
- **Posting a project or submitting a proposal requires an account.** Click **Register** (top right) →
  choose **As a Client** or **As a Freelancer** → fill in the form → you're logged in automatically.
- Once logged in, the navbar shows **"Hi, [Name] (role) — Logout"**, and the Post Project / Submit
  Proposal forms automatically use your logged-in ID instead of asking you to type one in manually.
- **Important:** the 30 seed users from `database/freelance_marketplace.sql` (e.g. "Aarav Sharma",
  client_id 1–15; "Rohan Agarwal", freelancer_id 16–30) were inserted directly by SQL, not through
  registration — they have **no password set** and **cannot log in**. Only accounts created through
  the **Register** button can log in. This is intentional and called out in the Login form itself.

---

## API Endpoints

| Method | Endpoint                              | Description                              |
|--------|----------------------------------------|-------------------------------------------|
| GET    | `/api/projects`                       | List all projects                         |
| GET    | `/api/projects/{id}`                  | Get a single project                      |
| GET    | `/api/projects/category/{categoryId}` | Filter projects by category               |
| GET    | `/api/projects/status/{status}`       | Filter by status (open/in_progress/…)     |
| GET    | `/api/projects/search?keyword=app`    | Search projects by title                  |
| POST   | `/api/projects`                       | Create a new project                      |
| PUT    | `/api/projects/{id}`                  | Update a project                          |
| DELETE | `/api/projects/{id}`                  | Delete a project                          |
| GET    | `/api/categories`                     | List all categories                       |
| GET    | `/api/freelancers`                    | List freelancers, best rated first        |
| GET    | `/api/freelancers/{id}`               | Get one freelancer profile                |
| GET    | `/api/proposals/project/{projectId}`  | Proposals submitted for a project         |
| GET    | `/api/proposals/freelancer/{id}`      | Proposals submitted by a freelancer       |
| POST   | `/api/proposals`                      | Submit a new proposal                     |
| PUT    | `/api/proposals/{id}/status`          | Accept/reject a proposal (`{"status":"accepted"}`) |
| POST   | `/api/auth/register/client`           | Register a new client (creates `users` + `client_profiles`) |
| POST   | `/api/auth/register/freelancer`       | Register a new freelancer (creates `users` + `freelancer_profiles`) |
| POST   | `/api/auth/login`                     | Login with email + password               |

---

## Authentication Notes

Passwords are hashed with **BCrypt** and never returned in any API response (the `password` field on
`User` is marked `@JsonProperty(access = WRITE_ONLY)`). The logged-in session is kept client-side in
the browser's `localStorage` for simplicity.

This is a **simplified, demo-level login** — it is not production-secure:
- No JWT / token expiry
- No HTTPS enforcement
- No rate limiting on login attempts
- `SecurityConfig.java` currently permits all requests; it exists to *stop* Spring Security's default
  behavior (auto-locking every endpoint behind a random generated password), not to enforce real
  authorization rules yet.

A natural next step for production would be replacing the `localStorage` session with proper JWT-based
authentication, enforced server-side per endpoint.

---

## React Frontend — Architecture Notes

If you're using `frontend-react/`, here's how it's structured and why, useful for explaining it in
an interview:

- **`api/client.js`** — every single `fetch()` call to the backend lives in one file, each exported
  as a small named function (`getProjects()`, `createProject()`, `loginUser()`, etc.). Components
  never call `fetch` directly — they import these functions. This means if the API ever changes
  (e.g. adding auth headers later), it's a one-file change, not a hunt through every component.

- **`context/SessionContext.jsx`** — replaces the vanilla version's manual
  `localStorage.getItem/setItem` calls scattered across functions. React's Context API lets any
  component call `useSession()` to read the logged-in user or call `login()`/`logout()`, without
  passing props down through every level ("prop drilling").

- **`components/Modal.jsx`** — a single reusable modal shell that every specific modal
  (`LoginModal`, `PostProjectModal`, etc.) wraps. Visibility is controlled by a React prop (`show`)
  and conditional rendering (`if (!show) return null`), **not** by calling `bootstrap.Modal(...).show()`
  like the vanilla version does. This was a deliberate choice: it means Bootstrap's JavaScript bundle
  isn't needed at all — only its CSS — which sidesteps an entire category of bugs (like the CDN
  failing to load, which broke every button in the vanilla version at one point during development).

- **`App.jsx`** — holds the shared state (`projects`, `freelancers`, `categories`, which modal is
  open) and passes data down as props, and callbacks up as props (e.g. `onDelete`, `onCreated`).
  This is the core React pattern: **state lives as high as the components that need it**, and data
  flows down while events flow up.

- **No React Router** — this is a single-page app with in-page anchor links (`#projects`,
  `#freelancers`), matching the vanilla version's behavior. Adding routing (e.g. a dedicated
  `/projects/:id` detail page) would be a good, resume-worthy next step using `react-router-dom`.

---

These are worth knowing if you rebuild or extend this project — some are common Java/Spring Boot
gotchas, not bugs specific to this codebase.

| Symptom | Cause | Fix |
|---|---|---|
| `UnsupportedClassVersionError` | Running on an old JDK (e.g. Java 8) when the project needs Java 17+ | Install JDK 17, set it as the active runtime in VS Code (`Java: Configure Java Runtime`) |
| Class version error even after installing JDK 17 | A *newer* JDK (e.g. 21/25) was compiling the code while JDK 17 tried to run it | Set `java.configuration.runtimes` in VS Code settings with `"default": true` on JDK 17, then run **Java: Clean Java Language Server Workspace** |
| `405 Method Not Allowed` on a new endpoint | Backend was still running old compiled code — Java doesn't hot-reload | Fully stop the backend, delete `backend/target`, restart |
| `ClassNotFoundException` right after deleting `target` | Tried to run before recompiling | Run **Java: Clean Java Language Server Workspace** and wait for it to finish before clicking Run |
| `The public type X must be defined in its own file` | Filename casing didn't match the class name exactly (e.g. `Authcontroller.java` vs `AuthController`) | Rename the file to match the class name exactly, including capitalization |
| Whitelabel Error Page | Visited `/` instead of an actual `/api/...` endpoint, or a real 404/500 occurred | Check the exact URL; check the backend terminal for a stack trace |
| Login/register always fails, "Registration failed" | Backend not running the latest `AuthController`, or database missing the `password` column | Restart backend after code changes; re-run the updated `freelance_marketplace.sql` |
| Every endpoint suddenly requires a login popup with a random generated password | Adding a password-hashing dependency pulled in full Spring Security auto-configuration | Add `SecurityConfig.java` with `authorizeHttpRequests(auth -> auth.anyRequest().permitAll())` |
| Clicking Login/Register buttons does nothing, no visible error | Bootstrap's JS failed to load from the CDN (blocked by network/antivirus) | Bundle Bootstrap locally in `frontend/vendor/` instead of loading from a CDN (already done in this project) |
| Projects/Freelancers fail to load but Categories works fine | Database schema out of sync with the Java entities (e.g. missing `password` column) after an entity change | Re-run the full `freelance_marketplace.sql` script |
| Eclipse shows red X's on the project after importing | Maven dependencies haven't finished downloading, or wrong JDK selected | Right-click project → **Maven → Update Project**; check **Properties → Java Build Path** uses JDK 17 |
| Eclipse: "Project has compile errors" but code looks fine | Project is set to compile against an older Java version than 17 | **Properties → Java Compiler** → set compliance level to 17, then **Project → Clean** |
| React page loads blank, console shows a red error | Usually a typo in an import path (case-sensitive on some systems) or the backend isn't running | Check the exact error text in the browser console (F12); confirm `http://localhost:8080/api/projects` returns JSON first |
| `npm install` fails or hangs | Network/proxy blocking the npm registry | Check your network allows `registry.npmjs.org`; retry with `npm install --verbose` to see where it stalls |

---

## Extending This Project

The original database also includes `contracts`, `milestones`, `payments`, `reviews`, `messages`, and
`disputes` tables (see the full schema comments in `database/freelance_marketplace.sql`). To add them:
create the matching `@Entity` class in `entity/`, a `JpaRepository` in `repository/`, and a
`@RestController` in `controller/`, following the same pattern used for `Project` and `Proposal`.

Other good next additions (roughly in order of interview impact):
1. **Finish the remaining tables** (contracts, payments, reviews) using the existing pattern
2. **Pagination** on `/api/projects` for scalability
3. **Input validation** (`@Valid`, `@NotBlank`, `@Min`) on POST/PUT request bodies
4. **Global exception handling** (`@ControllerAdvice`) for consistent error responses
5. **Real JWT authentication**, replacing the current `localStorage` session
6. **Unit + integration tests** (JUnit + Mockito) — often the biggest gap between a portfolio project
   and something you can defend confidently in an interview

---

## Resume Bullet Points (adapt as needed)

- Built a full-stack freelance marketplace web application using **Java Spring Boot**, **React**, and
  **MySQL**, implementing RESTful APIs for project listings, freelancer profiles, proposals, and
  authentication.
- Designed a normalized MySQL schema (11+ tables) covering users, projects, contracts, payments, and
  reviews, and mapped it to JPA/Hibernate entities with proper relationships (`@OneToOne`, `@ManyToOne`,
  `@MapsId`).
- Developed a **React** frontend (function components + hooks, Context API for session state) that
  consumes a Spring Boot REST API via `fetch`, including live search, category filtering, and
  session-based login without a page reload.
- Added BCrypt password hashing for user accounts, with passwords excluded from all API responses via
  Jackson's `WRITE_ONLY` access control.
- Developed and debugged the backend in **Eclipse** (Maven-based Spring Boot project) and the frontend
  in **VS Code** (Vite + React), reflecting a realistic multi-IDE full-stack workflow.
- Diagnosed and resolved real full-stack issues across the JDK, Maven build, Spring Security
  auto-configuration, and CORS — the kind of debugging expected on the job, not just green-field coding.
