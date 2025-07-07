from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Configuration de la base de données
db_config = {
    'host': os.getenv('DB_HOST', 'host.docker.internal'),
    'database': os.getenv('DB_NAME', 'ecocycle_db'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'samy')
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration JWT
SECRET_KEY = "votre_cle_secrete_ici"  # Remplacez par une clé secrète sécurisée
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Gestion des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Modèle Pydantic pour les données de connexion
class LoginRequest(BaseModel):
    email: str
    password: str

# Modèle Pydantic pour les données de l'inscription
class RegisterRequest(BaseModel):
    email: str
    password: str
    nom: Optional[str] = None

# Fonction pour se connecter à la base de données
def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Erreur de connexion à MySQL : {e}")
        return None

# Fonction pour vérifier l'utilisateur
def verify_user(email: str, password: str) -> Optional[dict]:
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Erreur de connexion à la base de données")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if user and pwd_context.verify(password, user["password"]):
            return user
        return None
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Fonction pour créer un token JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Route de test pour la connexion à la base de données
@app.get("/test-db")
async def test_db():
    connection = get_db_connection()
    if connection:
        connection.close()
        return {"message": "Connexion à la base de données réussie"}
    raise HTTPException(status_code=500, detail="Échec de la connexion à la base de données")

# Route de test simple
@app.get("/test")
async def test():
    return {"message": "Test fonctionne"}

# Route de connexion
@app.post("/login")
async def login(login_data: LoginRequest):
    user = verify_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Route d'inscription
@app.post("/register")
async def register(user_data: RegisterRequest):
    print("Route /register appelée")
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Erreur de connexion à la base de données")

    try:
        cursor = connection.cursor()
        # Vérifier si l'email existe déjà
        cursor.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email déjà utilisé")

        # Hasher le mot de passe
        hashed_password = pwd_context.hash(user_data.password)

        # Insérer l'utilisateur
        cursor.execute(
            "INSERT INTO users (email, password, nom) VALUES (%s, %s, %s)",
            (user_data.email, hashed_password, user_data.nom)
        )
        connection.commit()
        return {"message": "Utilisateur enregistré avec succès"}

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Route protégée
@app.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
    return {"message": f"Bienvenue, {email} !"}