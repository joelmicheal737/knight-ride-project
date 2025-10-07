# Knight Ride Backend API

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Install and Start MongoDB (Optional - uses sample data if no DB)
```bash
# Install MongoDB locally or use MongoDB Atlas
# For local installation:
# - Download MongoDB Community Server
# - Start MongoDB service
```

### 3. Run the Backend Server
```bash
cd backend
python run.py
```

The API will be available at: `http://localhost:8000`

### 4. API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### User Profile
- `GET /user/profile` - Get user profile (requires auth)

### Services
- `GET /location/nearby-services` - Get nearby fuel stations and garages
- `POST /request-service` - Request roadside assistance

### Emergency
- `POST /sos/send` - Send SOS alert
- `POST /contacts/add` - Add emergency contact
- `GET /contacts` - Get emergency contacts
- `DELETE /contacts/{index}` - Delete emergency contact

## Sample API Usage

### Register User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "password": "password123",
    "bike_model": "Royal Enfield Classic 350"
  }'
```

### Get Nearby Services
```bash
curl "http://localhost:8000/location/nearby-services?service_type=fuel"
```

### Send SOS Alert
```bash
curl -X POST "http://localhost:8000/sos/send" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"lat": 19.0760, "lng": 72.8777},
    "message": "Emergency help needed!"
  }'
```