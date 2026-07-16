from langchain_community.tools import DuckDuckGoSearchResults
from config.agent import AGENT_CONFIG
from tenacity import retry, stop_after_attempt, wait_fixed
from utils.logger import logger

search_tool = DuckDuckGoSearchResults(num_results=AGENT_CONFIG["MAX_SEARCH_RESULTS"])

@retry(
    stop=stop_after_attempt(AGENT_CONFIG["RATE_LIMIT_RETRIES"]), 
    wait=wait_fixed(AGENT_CONFIG["RATE_LIMIT_DELAY_SECONDS"])
)
def execute_search(query: str) -> str:
    try:
        logger.info(f"Executing web search for: {query}")
        results = search_tool.invoke(query)
        return results
    except Exception as e:
        logger.error(f"Search failed or rate limited: {e}")
        raise e