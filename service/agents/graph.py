from langgraph.graph import StateGraph, END
from agents.state import AgentState
from agents.nodes import research_node, analysis_node

def compile_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("research", research_node)
    workflow.add_node("analysis", analysis_node)
    
    workflow.set_entry_point("research")
    workflow.add_edge("research", "analysis")
    workflow.add_edge("analysis", END)
    
    return workflow.compile()

agent_app = compile_graph()