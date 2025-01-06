from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import inspect
from flask_login import LoginManager
from flask_login import login_user
from flask_login import login_required, current_user  # type: ignore
from werkzeug.security import check_password_hash
import datetime
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os, re, jwt

# Folder where profile pictures will be stored
UPLOAD_FOLDER = 'uploads/profile_pictures'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Initialize db here but don't import models yet
db = SQLAlchemy()
login_manager = LoginManager()

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Helper function to check file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# creating the app inside a function to avoid circular import issues
def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads/profile_pictures')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size (16 MB)
    # Set the path for the profile pictures folder
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads/profile_pictures')


    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'login'  # Redirect here if the user is not logged in
    
    jwt = JWTManager(app)

    from models import User

    

    # Load the user by ID for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Import models inside create_app to avoid circular import
    from models import Color, Palette

    # Simple test route
    @app.route('/')
    def home():
        return "Hello, Flask is working!"

    # Test db route
    @app.route('/debug/db')
    def debug_db():
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        return {"tables": tables}

    # Profile route with JWT protection
    @app.route("/profile", methods=["GET"])
    @jwt_required()
    def profile():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user:
            profile_picture_url = None
            if user.profile_picture:
                profile_picture_url = f'/uploads/profile_pictures/{os.path.basename(user.profile_picture)}'

            return jsonify({
                "id": user.id,
                "username": user.username,
                "profile_picture": profile_picture_url
            }), 200
        else:
            return jsonify({"error": "User not found"}), 404
          
    @app.route('/upload_profile_picture', methods=['POST'])
    @jwt_required()  # Ensure the user is authenticated
    def upload_profile_picture():
        user_id = get_jwt_identity()  # Get user ID from JWT token
        user = User.query.get(user_id)

        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)

            # Update the user's profile picture in the database
            user.profile_picture = filepath
            db.session.commit()

            return jsonify({"message": "Profile picture uploaded successfully!", "profile_picture": filepath}), 200

        return jsonify({"error": "Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed."}), 400
          
    @app.route('/uploads/profile_pictures/<filename>')
    def serve_profile_picture(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)


    
    # User routes
    from flask import request, jsonify
    #register route
    @app.route('/register', methods=['POST'])
    def register():
        # Get form data
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # Check if profile picture is included in the request
        profile_picture = request.files.get('file')

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400

        # If profile picture exists, handle the file saving logic
        if profile_picture:
            filename = secure_filename(profile_picture.filename)
            file_extension = filename.rsplit('.', 1)[1].lower()
            new_filename = f"{username}_profile_picture.{file_extension}"  # Unique filename with username
            file_path = os.path.join(UPLOAD_FOLDER, new_filename)
            profile_picture.save(file_path)  # Save the file

        # Create the user and save to the database
        user = User(username=username, email=email)
        user.set_password(password)

        # If profile picture was uploaded, associate it with the user
        if profile_picture:
            user.profile_picture = new_filename  # Store only the filename in the database

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered successfully!"}), 201


    @app.route('/login', methods=['POST'])
    def login_user():
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        # Find the user by email
        user = User.query.filter_by(email=email).first()
        if user is None or not check_password_hash(user.password_hash, password):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Create JWT token
        token = create_access_token(identity=user.id)
        return jsonify({'token': token}), 200
    
    @app.route('/logout', methods=['POST'])
    @jwt_required()  # Ensure the user is authenticated before logging out
    def logout():
        return jsonify({"message": "Successfully logged out"}), 200


    # Validate the color format
    def is_valid_hex(hex_value):
        return bool(re.match(r'^#[0-9A-Fa-f]{6}$', hex_value))

    # Adding Color route
    @app.route('/colors', methods=['POST'])
    @jwt_required()  # Ensures the user must be authenticated
    def create_color():
        try:
            data = request.get_json()

            # Check if the current user is authenticated
            user_id = get_jwt_identity()  # Get user ID from the JWT token
            if not user_id:
                return jsonify({"error": "User is not authenticated"}), 401

            # Create a new color with user_id (we assume the token contains the user's ID)
            color = Color(hex_value=data['hex_value'], name=data.get('name'), user_id=user_id)

            db.session.add(color)
            db.session.commit()

            return jsonify({"message": "Color created successfully!", "id": color.id}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
          
    # Endpoint to retrieve all colors
    @app.route('/colors', methods=['GET'])
    def get_colors():
        colors = Color.query.all()  # Fetch all colors from the database
        color_list = [
            {"id": color.id, "hex_value": color.hex_value, "name": color.name}
            for color in colors
        ]
        return jsonify(color_list), 200

    # Adding Palette route
    @app.route('/palettes', methods=['POST'])
    @jwt_required()
    def save_palette():
        data = request.get_json()

        # Extract relevant data from the request
        palette_name = data.get('name')
        colors = data.get('colors')  # This should be a list of hex color values
        user_id = get_jwt_identity()  # Get user ID from JWT token

        if not palette_name or not colors or not user_id:
            return jsonify({"error": "Missing required fields"}), 400

        # Create a new Palette instance
        new_palette = Palette(name=palette_name, user_id=user_id, colors=colors)

        try:
            db.session.add(new_palette)
            db.session.commit()
            return jsonify({"message": f"Palette '{new_palette.name}' saved successfully!", "id": new_palette.id}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    
    # Retrieve all palettes
    @app.route('/palettes', methods=['GET'])
    def get_palettes():
        palettes = Palette.query.all()  # Fetch all palettes from the database
        palette_list = [
            {
                "id": palette.id,
                "name": palette.name,
                "description": palette.description,
                "colors": palette.colors
            }
            for palette in palettes
        ]
        return jsonify(palette_list), 200
    
    # Retrieve colors by user: GET /user/colors
    @app.route('/user/colors', methods=['GET'])
    @jwt_required()  # Ensure the user is authenticated
    def get_user_colors():
        user_id = get_jwt_identity()  # Get user ID from the JWT token
        print(f"Authenticated User ID: {user_id}")
        try:
            # Fetch colors associated with the user
            user_colors = Color.query.filter_by(user_id=user_id).all()
            print(f"Fetched User Colors: {user_colors}")
            colors_list = [
                {"id": color.id, "hex_value": color.hex_value, "name": color.name}
                for color in user_colors
            ]
            return jsonify(colors_list), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    # Retrieve palettes by user: GET /user/palettes
    @app.route('/user/palettes', methods=['GET'])
    @jwt_required()  # Ensure the user is authenticated
    def get_user_palettes():
        user_id = get_jwt_identity()  # Get user ID from the JWT token
        try:
            # Fetch palettes associated with the user
            user_palettes = Palette.query.filter_by(user_id=user_id).all()
            palettes_list = [
            {
                "id": palette.id,
                "name": palette.name,
                "colors": palette.colors,  # JSON list of color hex values
            }
            for palette in user_palettes
        ]
            return jsonify(palettes_list), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500


    return app
