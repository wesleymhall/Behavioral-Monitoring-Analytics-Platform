from app import bcrypt

def hash_password(password):
    # bcrypt uses salt and cost factor to hash password
    # salt allows unique hashes for the same password
    # cost factor slows hashing process to prevent brute force attacks
    return bcrypt.generate_password_hash(password).decode('utf-8')

def verify_password(hashed_password, password):
    return bcrypt.check_password_hash(hashed_password, password)
