from pydantic import BaseModel


class RiskResponse(BaseModel):
    id: int
    title: str
    severity: str
    description: str
    recommendation: str

    class Config:
        from_attributes = True