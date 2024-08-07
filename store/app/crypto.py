"""Defines crypto functions."""

import hashlib
import secrets
import string
import uuid

from argon2 import PasswordHasher


def new_token(length: int = 64) -> str:
    """Generates a cryptographically secure random 64 character alphanumeric token."""
    return "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def check_hash(token: str, hash: str) -> bool:
    return hash_token(token) == hash


def new_uuid() -> uuid.UUID:
    return uuid.uuid4()


def check_password(password: str, hash: str) -> bool:
    try:
        return PasswordHasher().verify(hash, password)
    except Exception:
        return False
