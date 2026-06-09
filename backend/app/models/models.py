from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=True)  # nullable for Google OAuth users
    google_id = Column(String, nullable=True, unique=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    emails = relationship("EmailIdentity", back_populates="user", cascade="all, delete-orphan")
    phones = relationship("PhoneIdentity", back_populates="user", cascade="all, delete-orphan")
    accounts = relationship("PlatformAccount", back_populates="user", cascade="all, delete-orphan")
    risk_findings = relationship("RiskFinding", back_populates="user", cascade="all, delete-orphan")


class EmailIdentity(Base):
    __tablename__ = "email_identities"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="emails")


class PhoneIdentity(Base):
    __tablename__ = "phone_identities"

    id = Column(Integer, primary_key=True)
    phone_number = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="phones")


class PlatformAccount(Base):
    __tablename__ = "platform_accounts"

    id = Column(Integer, primary_key=True)
    domain = Column(String, nullable=False)           # raw domain e.g. github.com
    platform_name = Column(String, nullable=False)    # display name e.g. GitHub
    category = Column(String, default="other")        # social / finance / dev / shopping / email / other
    has_2fa = Column(Boolean, default=False)
    risk_level = Column(String, default="low")        # low / medium / high
    username = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    discovered_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="accounts")
    permissions = relationship("AccountPermission", back_populates="account", cascade="all, delete-orphan")


class AccountPermission(Base):
    __tablename__ = "account_permissions"

    id = Column(Integer, primary_key=True)
    permission_name = Column(String, nullable=False)
    account_id = Column(Integer, ForeignKey("platform_accounts.id"), nullable=False)

    account = relationship("PlatformAccount", back_populates="permissions")


class RiskFinding(Base):
    __tablename__ = "risk_findings"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(String, default="low")   # low / medium / high / critical
    category = Column(String, default="general")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="risk_findings")