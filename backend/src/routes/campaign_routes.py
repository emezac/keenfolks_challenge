from fastapi import APIRouter, HTTPException
from ..domain.models import CampaignCreate, Campaign
from ..domain.rules import evaluate_rule, generate_mock_performance
from ..services.db import create_campaign, get_campaign

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])

@router.post("", response_model=Campaign, status_code=201)
def add_campaign(campaign: CampaignCreate):
    return create_campaign(campaign)

@router.post("/{campaign_id}/simulate")
def simulate(campaign_id: str):
    campaign = get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    mock_performance = generate_mock_performance()
    result = evaluate_rule(campaign.rule, mock_performance)

    return {
        "campaignId": campaign_id,
        "performance": mock_performance,
        "simulation": result
    }
