from typing import TypedDict, Any

class AgentState(TypedDict):
    query: str
    classification: str
    reasoning: str
    metrics_data: str
    final_response: Any
    iterations: int