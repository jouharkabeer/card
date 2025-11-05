# LSofito NFC Business Card Platform

A full-stack NFC Business Card system built with React (Vite) and Django REST Framework. Share your contact information instantly with NFC technology.

**Production URLs:**
- Frontend: https://card.lsofito.com
- Backend API: https://api-card.lsofito.com

## Features

### Public Side
- **Homepage** - Product overview, pricing, and "Get Your Card" CTA
- **Profile Page** (`/:username`) - Public profile view when someone taps an NFC card
  - Profile image, name, designation
  - Contact information (email, phone, WhatsApp)
  - Social media links (Instagram, LinkedIn, YouTube, Website)
  - Additional custom links
  - Gallery with up to 3 images
  - About section
  - **4 Different Templates** - Users can choose from Classic, Modern, Minimal, or Elegant designs
  - Open Graph meta tags for social sharing
  - **"Get Your Card" Button** - Shown to non-logged-in visitors

### Authenticated Side
- **Login Page** - JWT-based authentication
- **Dashboard Page** - Edit profile with live preview
  - Image upload with preview
  - Edit all profile fields
  - Dynamic link management
  - **Template Selection** - Choose from 4 different templates
  - **Gallery Management** - Upload up to 3 images
  - Real-time preview of public profile
  - **Save Details (PDF)** - Download profile as PDF
  - **Share Details** - Share profile in text format via native share or copy to clipboard

### Admin Features (Django Superuser)
- **User Management** - View all users with their status
- **Status Management** - Update user card status:
  - Payment Received
  - Printing
  - Shipped
  - Delivered
- **Profile Management** - Edit user profiles, templates, and gallery

## New Features (Latest Update)

### Admin Dashboard
- Django admin interface now shows all users with their card status
- Admins can change user status (Payment Received → Printing → Shipped → Delivered)
- Filter users by status, template, and creation date
- View and edit user profiles directly from admin

### Template System
- **4 Professional Templates**:
  1. **Template 1 - Classic**: Traditional business card layout with gradient hero
  2. **Template 2 - Modern**: Contemporary design with card-based layout
  3. **Template 3 - Minimal**: Clean and simple design with minimal styling
  4. **Template 4 - Elegant**: Sophisticated design with premium look
- Users can select their preferred template from the dashboard
- Template selection is saved and applied to public profile

### Gallery Feature
- Upload up to 3 images to showcase work or portfolio
- Images appear in the public profile gallery section
- Drag-and-drop or click to upload interface
- Real-time preview in dashboard

### Export & Share
- **Save Details (PDF)**: Download current profile view as PDF document
- **Share Details**: Share profile information in text format
  - Uses native share API when available (mobile)
  - Falls back to copy-to-clipboard on desktop
  - Includes all contact information and links

### Public Profile Enhancements
- "Get Your Card" button appears for non-logged-in visitors
- Encourages new user registration
- Template-based rendering for personalized experience

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for routing
- Axios for API calls
- React Icons for icons
- React Helmet Async for meta tags
- React Toastify for notifications
- jsPDF & html2canvas for PDF generation

### Backend
- Django 4.2
- Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- SQLite database (development) / PostgreSQL (production)
- CORS headers for cross-origin requests
- Pillow for image handling

## Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- PostgreSQL database (optional, only for production)
- pip (Python package manager)
- npm or yarn

## Setup Instructions

### Create Django Superuser (For Admin Access)

After setting up the backend, create a superuser to access the admin panel:

```bash
cd backend
python manage.py createsuperuser
```

Follow the prompts to create your admin account. Then access the admin panel at:
- **Admin URL**: `http://localhost:8000/admin/`

In the admin panel, you can:
- View all users and their card statuses
- Change user status (Payment Received → Printing → Shipped → Delivered)
- Edit user profiles, templates, and gallery
- Filter users by status, template, or date

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```
   
   **Note:** By default, the project uses SQLite for development (no database setup needed). 
   For production with PostgreSQL, add these additional variables:
   ```env
   DB_ENGINE=postgresql
   DB_NAME=lsofitocard_db
   DB_USER=postgres
   DB_PASSWORD=your-database-password
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. **Run migrations:**
   The database file (`db.sqlite3`) will be created automatically on first migration.
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create a superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/register/` - Register a new user
- `POST /api/login/` - Login and get JWT tokens
- `POST /api/token/refresh/` - Refresh access token

### Profile
- `GET /api/profile/<username>/` - Get public profile by username (no auth required)
- `GET /api/my-profile/` - Get authenticated user's profile
- `PUT /api/my-profile/` - Update authenticated user's profile

## Project Structure

```
card/
├── backend/
│   ├── config/          # Django project settings
│   ├── profiles/         # Profile app
│   ├── users/            # User app
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Usage

1. **Register a new account:**
   - Visit the homepage and click "Get Your Card"
   - Register with username, email, and password

2. **Login:**
   - Go to `/login` and enter your credentials

3. **Edit your profile:**
   - After logging in, go to `/dashboard`
   - Fill in your profile information
   - Upload a profile image
   - Add social media links and custom links
   - Click "Save Changes"

4. **View your public profile:**
   - Visit `/:username` (replace `username` with your username)
   - Share this link or the QR code

5. **Set up NFC card:**
   - Program your NFC card to point to `https://lsofitocard.com/:username`
   - When someone taps the card, they'll see your profile

## Development

### Running Tests
- Backend: `python manage.py test`
- Frontend: Add test framework as needed

### Building for Production

**Backend:**
```bash
python manage.py collectstatic
```

**Frontend:**
```bash
npm run build
```

The built files will be in `frontend/dist/`

### Switching to PostgreSQL for Production

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE lsofitocard_db;
   ```

2. **Update `.env` file:**
   ```env
   DB_ENGINE=postgresql
   DB_NAME=lsofitocard_db
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

   **Note:** If you have existing data in SQLite, you'll need to export and import it separately.

## Environment Variables

### Backend (.env)

**Required for all environments:**
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins

**For PostgreSQL (production only):**
- `DB_ENGINE=postgresql` - Set to use PostgreSQL (defaults to SQLite if not set)
- `DB_NAME` - PostgreSQL database name
- `DB_USER` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `DB_HOST` - Database host
- `DB_PORT` - Database port

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

### Quick Production Setup

**Backend:**
1. Create `.env` file with production settings (see `backend/.env.example`)
2. Set `DEBUG=False`, `ALLOWED_HOSTS=api-card.lsofito.com`
3. Set `CORS_ALLOWED_ORIGINS=https://card.lsofito.com`
4. Run migrations and collect static files
5. Deploy with Gunicorn + Nginx

**Frontend:**
1. Create `.env` file with `VITE_API_URL=https://api-card.lsofito.com/api`
2. Run `npm run build`
3. Deploy `dist/` folder to web server

## Security Notes

- Always use strong SECRET_KEY in production
- Keep DEBUG=False in production
- Use HTTPS for all production traffic
- Set `DEBUG=False` in production
- Use environment variables for sensitive data
- Configure proper CORS origins for production
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs

## License

This project is proprietary software for LSofito.

## Support

For issues and questions, please contact the development team.

