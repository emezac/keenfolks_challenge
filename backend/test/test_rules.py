from src.domain.rules import evaluate_rule
from src.domain.models import Rule

def test_evaluate_rule_less_than_triggered():
    rule = Rule(metric="ROAS", operator="<", value=3.0, action="pause")
    metrics = {"ROAS": 2.5, "CTR": 5.0}
    result = evaluate_rule(rule, metrics)
    assert result["triggered"] == True
    assert result["action"] == "pause"

def test_evaluate_rule_less_than_not_triggered():
    rule = Rule(metric="ROAS", operator="<", value=3.0, action="pause")
    metrics = {"ROAS": 3.5, "CTR": 5.0}
    result = evaluate_rule(rule, metrics)
    assert result["triggered"] == False
    assert result["action"] == "none"

def test_evaluate_rule_greater_than_triggered():
    rule = Rule(metric="CTR", operator=">", value=2.0, action="scale_up")
    metrics = {"CTR": 2.5}
    result = evaluate_rule(rule, metrics)
    assert result["triggered"] == True
    assert result["action"] == "scale_up"
