# Mission 12: Online Bookstore

**Author:** Tyler Mitton  
**Course:** IS 413

## Project Overview
Mission 12 is a full-stack bookstore application with a .NET Web API backend and a React frontend. The app serves a SQLite-backed book catalog with server-side pagination, sorting, and category filtering, then layers in a client-side shopping cart experience.

Users can browse books, filter by category, adjust page size, sort by title, add items to cart, and manage cart quantities from a Bootstrap offcanvas cart panel. Cart state is persisted to localStorage so it survives browser refreshes.

## Tech Stack
- **Backend:** ASP.NET Core Web API (.NET 10)
- **Frontend:** React 19 + TypeScript + Vite
- **Database:** SQLite
- **ORM:** Entity Framework Core (SQLite provider)
- **Styling/UI:** Bootstrap 5

## Mission 12 Features
- **Server-side pagination:** API returns page metadata and results per page.
- **Category filtering:** Dynamic category list is loaded from API and used to filter books.
- **Sorting:** Title ascending/descending sorting through query params.
- **Responsive catalog UI:** Bootstrap card grid with pagination controls.
- **Shopping cart offcanvas:** Cart opens from header and supports quantity updates/removal.
- **Cart persistence:** Cart data is saved in localStorage.
- **Add-to-cart feedback:** Toast notification confirms added items.

## API Endpoints
Base URL (dev):
- `http://localhost:5145`
- `https://localhost:7145`

Books:
- `GET /api/Books`
	- Query params:
		- `page` (default `1`)
		- `pageSize` (default `5`)
		- `sortOrder` (`title_asc` or `title_desc`, default `title_asc`)
		- `category` (optional)
- `GET /api/Books/Categories`
	- Returns distinct, alphabetized categories.

Swagger (Development):
- `http://localhost:5145/swagger`
- `https://localhost:7145/swagger`

## Getting Started

### Prerequisites
- [.NET SDK 10](https://dotnet.microsoft.com/download) (or compatible newer SDK)
- [Node.js](https://nodejs.org/)

### 1. Run the Backend
From the project root:

```bash
cd backend
dotnet restore
dotnet run
```

### 2. Run the Frontend
Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server:
- `http://localhost:5173`

### 3. Verify End-to-End Behavior
1. Open Swagger and confirm API endpoints are available.
2. Open the frontend and confirm books load.
3. Test category filter, sorting, and pagination.
4. Add books to cart and verify totals/quantities update.
5. Refresh the page and confirm cart contents persist.

## Configuration Notes

### CORS
Allowed origins are configured in `backend/Program.cs`:
- `http://localhost:5173`
- `http://localhost:5174`

If your frontend runs on a different port, add it to the CORS policy.

### Database
The API uses the SQLite connection string in backend configuration files:
- `backend/appsettings.json`
- `backend/appsettings.Development.json`

## Project Structure

```text
Mission12/
├── backend/   # ASP.NET Core Web API + EF Core + SQLite
├── frontend/  # React + TypeScript + Vite client
└── README.md
```

## Common Commands

Backend:

```bash
cd backend
dotnet run
```

Frontend:

```bash
cd frontend
npm run dev
```