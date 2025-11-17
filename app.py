from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# ===================== DATABASE PATH =====================
# Ensure the 'data' folder exists
db_folder = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(db_folder, exist_ok=True)
db_path = os.path.join(db_folder, 'data.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ===================== DATABASE MODELS =====================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    item = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20), nullable=False)

# ===================== CREATE DB TABLES =====================
with app.app_context():
    db.create_all()

# ===================== ROUTES =====================
@app.route('/')
def home():
    return render_template('index.html')

# ------------------- SIGNUP -------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = generate_password_hash(data.get('password'))

    if User.query.filter_by(email=email).first():
        return jsonify({'status':'error', 'message':'Email already exists'})
    if User.query.filter_by(username=username).first():
        return jsonify({'status':'error', 'message':'Username already exists'})

    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'status':'success', 'message':'Signup successful'})

# ------------------- LOGIN -------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({'status':'success', 'message':'Login successful'})
    else:
        return jsonify({'status':'error', 'message':'Invalid credentials'})

# ------------------- ORDER -------------------
@app.route('/order', methods=['POST'])
def order():
    if 'user_id' not in session:
        return jsonify({'status':'error', 'message':'Please login first'})

    data = request.get_json()
    item = data.get('item')
    quantity = data.get('quantity')
    phone = data.get('phone')

    new_order = Order(user_id=session['user_id'], item=item, quantity=quantity, phone=phone)
    db.session.add(new_order)
    db.session.commit()

    return jsonify({'status':'success', 'message':'Order placed successfully'})

# ------------------- LOGOUT -------------------
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('home'))

# ===================== RUN SERVER =====================
if __name__ == '__main__':
    app.run(debug=True)
