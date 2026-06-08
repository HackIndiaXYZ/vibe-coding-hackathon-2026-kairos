from pydantic import BaseModel


class EmailResponse(BaseModel):
    id: int
    email: str
    is_primary: int

    class Config:
        from_attributes = True


class PhoneResponse(BaseModel):
    id: int
    phone_number: str
    is_primary: int

    class Config:
        from_attributes = True