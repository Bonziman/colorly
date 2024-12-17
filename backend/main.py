from app import create_app, db
from flask_migrate import Migrate  # type: ignore

# Create the Flask app using the factory function
app = create_app()

# Initialize Flask-Migrate with the app and db object
migrate = Migrate(app, db)

@app.cli.command('db_init')
def db_init():
    """Initialize the database."""
    db.create_all()
    print("Database initialized.")

@app.cli.command('db_migrate')
def db_migrate():
    """Run database migrations."""
    from flask_migrate import upgrade
    upgrade()
    print("Migrations applied.")

@app.cli.command('db_upgrade')
def db_upgrade():
    """Upgrade the database."""
    from flask_migrate import upgrade
    upgrade()
    print("Database upgraded.")

if __name__ == '__main__':
    app.run(debug=True)  # This will start the server in debug mode
