from pydantic import BaseModel, Field
from typing import Literal, Dict, Any, Optional

Metric = Literal["ROAS", "CTR", "CPC", "Spend"]
Operator = Literal["<", ">", "="]
Action = Literal["pause", "notify", "scale_up"]
Device = Literal["mobile", "desktop", "tablet", "all"]

class Audience(BaseModel):
    country: str
    device: Device
    ageRange: str

class Rule(BaseModel):
    metric: Metric
    operator: Operator
    value: float
    action: Action

class CampaignCreate(BaseModel):
    name: str = Field(..., min_length=1)
    budget: float = Field(..., gt=0)
    audience: Audience
    rule: Rule

class Campaign(CampaignCreate):
    id: str

class SimulationRequest(BaseModel):
    metric: Metric
    value: float

class SimulationResult(BaseModel):
    triggered: bool
    action: str
