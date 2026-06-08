from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_emails: int
    total_phones: int
    total_accounts: int
    total_permissions: int
    total_risks: int