from fastapi import APIRouter, HTTPException
from schemas.agent import QueryRequest, QueryResponse
from agents.graph import agent_app
from services.router import ModelRouter
from config.models import ROUTER_MODEL
from utils.logger import logger

router_client = ModelRouter(model_name=ROUTER_MODEL["MODEL_NAME"])

router = APIRouter(prefix="/api/agent", tags=["Agent"])

@router.post("/query", response_model=QueryResponse)
async def execute_query(request: QueryRequest):
    try:
        # Run router classification first
        classification, reasoning = router_client.route_request(request.query)
        logger.info(f"Router classification: {classification}. Reasoning: {reasoning}")
        
        if classification == "general":
            return QueryResponse(
                success=True,
                data={
                    "reasoning": reasoning,
                    "response": "This query does not appear to be related to supply chains, geopolitics, or macroeconomics. I am Astra, a specialized AI for predictive risk management. How can I help you with supply chain intelligence?"
                },
                message="Query routed to generic response."
            )
            
        initial_state = {
            "query": request.query,
            "metrics_data": "",
            "final_response": "",
            "iterations": 0
        }
        
        logger.info(f"Starting agent graph for query: {request.query}")
        result = agent_app.invoke(initial_state)
        
        return QueryResponse(
            success=True,
            data=result.get("final_response", {}),
            message="Query executed successfully."
        )
        
    except Exception as e:
        logger.error(f"Agent router error: {e}")
        raise HTTPException(status_code=500, detail=str(e))