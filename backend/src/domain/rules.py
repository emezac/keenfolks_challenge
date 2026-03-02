from typing import Dict, Any
from .models import Rule

def evaluate_rule(rule: Rule, metrics: Dict[str, float]) -> dict:
    actual_value = metrics.get(rule.metric, 0.0)
    triggered = False

    if rule.operator == "<":
        triggered = actual_value < rule.value
    elif rule.operator == ">":
        triggered = actual_value > rule.value
    elif rule.operator == "=":
        triggered = actual_value == rule.value

    return {
        "triggered": triggered,
        "action": rule.action if triggered else "none"
    }

def generate_mock_performance() -> Dict[str, float]:
    import random
    return {
        "ROAS": round(random.uniform(0, 10), 2),
        "CTR": round(random.uniform(0, 5), 2),
        "CPC": round(random.uniform(0, 2), 2),
        "Spend": round(random.uniform(50, 1000), 2),
    }
