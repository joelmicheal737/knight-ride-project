from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime, timedelta
import jwt
import hashlib
import uuid

app = FastAPI(title="Knight Ride API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "knight-ride-secret-key-2024"
ALGORITHM = "HS256"

# In-memory storage (replace with MongoDB in production)
users_db = {}
contacts_db = {}
requests_db = {}
sos_alerts_db = {}

# Sample data for services
SAMPLE_SERVICES = [
    {
        "id": "1",
        "name": "Shell Petrol Pump",
        "type": "fuel",
        "location": {"lat": 19.0760, "lng": 72.8777},
        "address": "Bandra West, Mumbai",
        "rating": 4.5,
        "is_open": True,
        "phone": "+91 9876543210"
    },
    {
        "id": "2", 
        "name": "HP Fuel Station",
        "type": "fuel",
        "location": {"lat": 19.0896, "lng": 72.8656},
        "address": "Andheri West, Mumbai",
        "rating": 4.2,
        "is_open": True,
        "phone": "+91 9876543211"
    },
    {
        "id": "3",
        "name": "Royal Enfield Service Center",
        "type": "garage",
        "location": {"lat": 19.0728, "lng": 72.8826},
        "address": "Kurla West, Mumbai",
        "rating": 4.8,
        "is_open": True,
        "phone": "+91 9876543212"
    },
    {
        "id": "4",
        "name": "Bajaj Authorized Service",
        "type": "garage", 
        "location": {"lat": 19.0825, "lng": 72.8428},
        "address": "Goregaon East, Mumbai",
        "rating": 4.3,
        "is_open": True,
        "phone": "+91 9876543213"
    }
]

# Pydantic models
class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    bike_model: str

class UserLogin(BaseModel):
    email: str
    password: str

class Location(BaseModel):
    lat: float
    lng: float

class SOSRequest(BaseModel):
    location: Location
    message: str

class ServiceRequest(BaseModel):
    service_id: str
    location: Location
    message: str
    service_type: str

class EmergencyContact(BaseModel):
    name: str
    phone: str
    relationship: str

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.get("/")
async def root():
    return {"message": "Knight Ride API is running!"}

@app.post("/auth/register")
async def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    users_db[user.email] = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": hash_password(user.password),
        "bike_model": user.bike_model,
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Initialize empty contacts for user
    contacts_db[user.email] = []
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user_id": user_id}

@app.post("/auth/login")
async def login(user: UserLogin):
    if user.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    stored_user = users_db[user.email]
    if not verify_password(user.password, stored_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user_id": stored_user["id"]}

@app.get("/user/profile")
async def get_profile(current_user: str = Depends(get_current_user)):
    if current_user not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[current_user].copy()
    del user["password"]  # Don't return password
    return user

@app.get("/location/nearby-services")
async def get_nearby_services(service_type: Optional[str] = None):
    services = SAMPLE_SERVICES
    if service_type:
        services = [s for s in services if s["type"] == service_type]
    return {"services": services}

@app.post("/request-service")
async def request_service(request: ServiceRequest, current_user: str = Depends(get_current_user)):
    request_id = str(uuid.uuid4())
    
    # Find the service
    service = next((s for s in SAMPLE_SERVICES if s["id"] == request.service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Store the request
    requests_db[request_id] = {
        "id": request_id,
        "user_email": current_user,
        "service_id": request.service_id,
        "service_name": service["name"],
        "location": request.location.dict(),
        "message": request.message,
        "service_type": request.service_type,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    
    return {
        "request_id": request_id,
        "status": "pending",
        "message": f"Service request sent to {service['name']}",
        "estimated_arrival": "15-30 minutes"
    }

@app.post("/sos/send")
async def send_sos(sos: SOSRequest, current_user: str = Depends(get_current_user)):
    sos_id = str(uuid.uuid4())
    
    # Get user's emergency contacts
    user_contacts = contacts_db.get(current_user, [])
    
    # Store SOS alert
    sos_alerts_db[sos_id] = {
        "id": sos_id,
        "user_email": current_user,
        "location": sos.location.dict(),
        "message": sos.message,
        "contacts_notified": len(user_contacts),
        "status": "active",
        "created_at": datetime.utcnow().isoformat()
    }
    
    return {
        "sos_id": sos_id,
        "status": "sent",
        "contacts_notified": len(user_contacts),
        "message": "Emergency alert sent successfully"
    }

@app.post("/contacts/add")
async def add_contact(contact: EmergencyContact, current_user: str = Depends(get_current_user)):
    if current_user not in contacts_db:
        contacts_db[current_user] = []
    
    contact_data = contact.dict()
    contact_data["id"] = str(uuid.uuid4())
    contact_data["added_at"] = datetime.utcnow().isoformat()
    
    contacts_db[current_user].append(contact_data)
    
    return {"message": "Contact added successfully", "contact": contact_data}

@app.get("/contacts")
async def get_contacts(current_user: str = Depends(get_current_user)):
    return {"contacts": contacts_db.get(current_user, [])}

@app.delete("/contacts/{contact_index}")
async def delete_contact(contact_index: int, current_user: str = Depends(get_current_user)):
    user_contacts = contacts_db.get(current_user, [])
    
    if contact_index < 0 or contact_index >= len(user_contacts):
        raise HTTPException(status_code=404, detail="Contact not found")
    
    deleted_contact = user_contacts.pop(contact_index)
    return {"message": "Contact deleted successfully", "deleted_contact": deleted_contact}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)