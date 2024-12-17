from app import db  # Import db from app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    profile_picture = db.Column(db.String(200), nullable=True)  # Optional profile picture

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
# Color Model
class Color(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hex_value = db.Column(db.String(7), nullable=False)
    name = db.Column(db.String(80))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
# Palette Model
class Palette(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    colors = db.Column(db.JSON, nullable=True)  # Store colors as JSON (list of hex values)

    def __repr__(self):
        return f"<Palette {self.name}>"

# Associative table for Many-to-Many relationship between Palette and Color
class PaletteColor(db.Model):
    __tablename__ = 'palette_colors'
    palette_id = db.Column(db.Integer, db.ForeignKey('palette.id'), primary_key=True)
    color_id = db.Column(db.Integer, db.ForeignKey('color.id'), primary_key=True)
