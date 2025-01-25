from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import inspect
from flask_login import LoginManager
from flask_login import login_user
from flask_login import login_required, current_user  # type: ignore
from werkzeug.security import check_password_hash
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os, re, jwt
import json
from PIL import Image
from colorthief import ColorThief
import io
import requests
import colorsys
import numpy as np
import random

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

    # Database Configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    # Secure app configurations
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    
    # Setting permanent session time
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
    # Path for where to save the uploaded files
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads/profile_pictures')
    # Setting Max file size
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size (16 MB)
    # Set the path for the profile pictures folder
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads/profile_pictures')

    # Initialize Flask extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'login'  # Redirect here if the user is not logged in
    
    # Initialize JWT manager
    jwt = JWTManager(app)

    # Default colors for initial render
    DEFAULT_PALETTE = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"]
    DEFAULT_DOTS =  [{ "x": 20, "y": 20, "color": "#ffffff" }, { "x": 80, "y": 20, "color": "#000000" }, { "x": 140, "y": 20, "color": "#ff0000" }, { "x": 200, "y": 20, "color": "#00ff00" }, { "x": 260, "y": 20, "color": "#0000ff" }]
    
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
    
    # Helper function to convert RGB to Hex
    def rgb_to_hex(rgb):
         return '#%02x%02x%02x' % rgb

    # Helper function to calculate initial dot positions
    def calculate_dot_positions(image, palette):
        width, height = image.size
        dots = []
        SAMPLE_SIZE = 200  # Set a number of pixels to sample
        # Ensure image is in RGBA format
        temp_image = image.convert("RGBA")
        pixel_array = np.array(temp_image)

        for color_hex in palette:
            # Convert hex to RGB
            rgb_color = tuple(int(color_hex[i:i+2], 16) for i in (1, 3, 5))
            rgb_array = np.array(rgb_color)

              # Find all matching pixels
            matching_pixels = np.where(np.all(pixel_array[:, :, :3] == rgb_array, axis=2))

            if matching_pixels[0].size > 0:
                  # Get the positions of the matching pixels
                  x_positions = matching_pixels[1]
                  y_positions = matching_pixels[0]
                  
                  # Randomly sample pixels based on their matching count
                  if x_positions.size <= SAMPLE_SIZE:
                    # If few pixels just use the coordinates directly
                    random_index = random.choice(range(x_positions.size))
                    x = x_positions[random_index]
                    y = y_positions[random_index]

                  else:
                    # Get random samples if there are more than the required sample size
                    random_indices = random.sample(range(x_positions.size), SAMPLE_SIZE)
                    
                    sampled_x_positions = x_positions[random_indices]
                    sampled_y_positions = y_positions[random_indices]
                    
                    # get a random pixel from sampled
                    random_index = random.choice(range(SAMPLE_SIZE))
                    x = sampled_x_positions[random_index]
                    y = sampled_y_positions[random_index]


                  dots.append({'x': int(x), 'y': int(y), 'color': color_hex})
            else:
              # Fallback: distribute dots evenly if no matching pixels are found
              index = palette.index(color_hex)
              x = (width / (len(palette) + 1)) * (index + 1)
              y = height / 2
              dots.append({'x': x, 'y': y, 'color': color_hex})

        return dots
    
    # Endpoint to extract color palette from image
    @app.route('/api/extract-palette', methods=['POST'])
    def extract_palette():
        """
        Extracts a color palette from an uploaded image, also generates interactive color dots on the image.
        If there is no image, the method will send the default palette and dots.
        """
        try:
            if 'image' in request.files:
                # Handle file upload
                image_file = request.files['image']
                # Use color thief directly with file-like object
                color_thief = ColorThief(image_file)
            elif 'image_url' in request.form:
                # Handle image URL
                image_url = request.form['image_url']
                response = requests.get(image_url, stream=True)
                response.raw.decode_content = True
                # Use color thief with the response's raw stream
                color_thief = ColorThief(response.raw)
            else:
                 # Send initial data when no image is uploaded
                 return jsonify({'palette': DEFAULT_PALETTE, 'dots': DEFAULT_DOTS}), 200

            # Use ColorThief to extract palette
            palette = color_thief.get_palette(color_count=5)
            image = color_thief.image


            # Convert palette to hex (now using the helper function within create_app)
            hex_palette = [rgb_to_hex(color) for color in palette]
            dots = calculate_dot_positions(image, hex_palette)
            return jsonify({'palette': hex_palette, 'dots': dots})

        except Exception as e:
             print(f"Error extracting palette: {e}")
             return jsonify({'error': str(e)}), 500


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
    
    # Upload profile picture route     
    @app.route('/upload_profile_picture', methods=['POST'])
    @jwt_required() 
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
     
     # Serve profile picture route     
    @app.route('/uploads/profile_pictures/<filename>')
    def serve_profile_picture(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)


    
    # User routes
    from flask import request, jsonify
    #register route
    @app.route('/register', methods=['POST'])
    def register():
        """Registers a new user with username, email and password, and an optional profile picture."""
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
        """Authenticates a user with email and password and returns a JWT token on successful login."""
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
        """Logs out a user."""
        return jsonify({"message": "Successfully logged out"}), 200


    # Validate the color format
    def is_valid_hex(hex_value):
        return bool(re.match(r'^#[0-9A-Fa-f]{6}$', hex_value))

    # Adding Color route
    @app.route('/colors', methods=['POST'])
    @jwt_required()  # Ensures the user must be authenticated
    def create_color():
        """Creates and saves a color associated with the authenticated user."""
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
    
    @app.route('/api/users/<int:user_id>', methods=['GET'])
    def get_user(user_id):
        """Retrieves basic user information."""
        user = User.query.get(user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,      
        }

        return jsonify(user_data), 200

    @app.route('/api/users/<int:user_id>/colors', methods=['GET'])
    @jwt_required()
    def get_user_colors(user_id):
        """Retrieves a list of colors saved by the user."""
    
        # Check if the user exists (optional, but good practice)
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Query the Color model directly, filtering by user_id
        colors = Color.query.filter_by(user_id=user_id).all()

        colors_data = [
        {
            'id': color.id,
            'hex_code': color.hex_value,
            'name' : color.name,
        }
        for color in colors
        ]

        return jsonify({
            'colors': colors_data,
        }), 200


    @app.route('/api/users/<int:user_id>/palettes', methods=['GET'])
    @jwt_required()
    def get_user_palettes(user_id):
        """Retrieves a list of palettes for a specific user."""
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        palettes = Palette.query.filter_by(user_id=user_id).all()

        palettes_data = []
        for palette in palettes:
            palette_data = {
                'id': palette.id,
                'name': palette.name,
                'colors': [] # Set it as an empty list by default.
            }
            if palette.colors: #Check if palette.colors field is set.
                if isinstance(palette.colors, str): # Check if it is a string.
                    try:
                        palette_data['colors'] = json.loads(palette.colors) # if it is, parse it as json list.
                    except json.JSONDecodeError:
                        print(f"Could not decode json in palette {palette.id}")
                        continue
                elif isinstance(palette.colors, list): #check if it is already a list
                    palette_data['colors'] = palette.colors #use as is

            palettes_data.append(palette_data)

        return jsonify({
            'palettes': palettes_data,
        }), 200
    return app
