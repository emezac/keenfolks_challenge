import sqlite3
import json
from uuid import uuid4
from ..domain.models import CampaignCreate, Campaign

DB_PATH = "campaigns.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS campaigns (
            id TEXT PRIMARY KEY,
            name TEXT,
            budget REAL,
            audience TEXT,
            rule TEXT
        )
    ''')
    conn.commit()
    conn.close()

def create_campaign(campaign: CampaignCreate) -> Campaign:
    campaign_id = str(uuid4())
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute(
        'INSERT INTO campaigns (id, name, budget, audience, rule) VALUES (?, ?, ?, ?, ?)',
        (campaign_id, campaign.name, campaign.budget, campaign.audience.model_dump_json(), campaign.rule.model_dump_json())
    )
    conn.commit()
    conn.close()
    
    return Campaign(id=campaign_id, **campaign.model_dump())

def get_campaign(campaign_id: str) -> Campaign | None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, budget, audience, rule FROM campaigns WHERE id = ?', (campaign_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return Campaign(
            id=row[0],
            name=row[1],
            budget=row[2],
            audience=json.loads(row[3]),
            rule=json.loads(row[4])
        )
    return None
