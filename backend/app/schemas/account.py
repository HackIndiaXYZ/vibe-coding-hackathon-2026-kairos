from pydantic import BaseModel


class AccountResponse(BaseModel):
    id: int
    platform_name: str
    username: str
    has_2fa: bool
    risk_level: str

    class Config:
        from_attributes = True