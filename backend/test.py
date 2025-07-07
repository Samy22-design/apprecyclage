import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        database='ecocycle_db',
        user='root',
        password='samy'
    )
    if connection.is_connected():
        print("✅ Connexion à MySQL réussie")
except Exception as e:
    print("❌ Erreur :", e)
