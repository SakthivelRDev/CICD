from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- MySQL Connection ---
db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    database=os.getenv("DB_NAME")
)
cursor = db.cursor(dictionary=True)

# --- Routes ---
@app.route("/api/students", methods=["GET"])
def get_students():
    cursor.execute("SELECT * FROM students")
    return jsonify(cursor.fetchall())

@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.json
    cursor.execute("INSERT INTO students (name) VALUES (%s)", (data["name"],))
    db.commit()
    return jsonify({"message": "Student added"}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
