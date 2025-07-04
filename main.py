from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

app = FastAPI()

# Configuration de la base de données
db_config = {
    'host': 'localhost',
    'database': 'ecocycle_db',
    'user': 'votre_utilisateur',
    'password': 'votre_mot_de_passe'
}

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

# Exemple de route protégée
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