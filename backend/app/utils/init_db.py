from app import create_app, db

# use python -m to run
# used for modules that are part of a package
# helps python import from the correct directory

app = create_app()

# activate the app context to access the database
# grants access to config and extensions without running the server
with app.app_context():
    confirm = input('This will reset the database. Are you sure? (y/n): ')
    if confirm.lower() == 'y':
        db.drop_all()
        db.create_all()
        print('Database reset successfully.')
    else:
        print('Database reset cancelled.')