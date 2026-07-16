LLAMA = {
    "MODEL_NAME": "llama-3.3-70b-versatile",
}

NEMOTRON = {
    "MODEL_NAME": "nvidia/nemotron-3-ultra-550b-a55b",
    "TEMPERATURE": 1,
    "TOP_P": 0.95,
    "MAX_TOKENS": 16384,
    "REASONING_BUDGET": 16384,
    "CHAT_TEMPLATE_KWARGS": {"enable_thinking": True}
}

ROUTER_MODEL = {
    "MODEL_NAME": "meta-llama/llama-4-scout-17b-16e-instruct",
    "RESPONSE_FORMAT": {
        "type": "json_schema",
        "json_schema": {
            "name": "RouterOutput",
            "schema": {
                "type": "object",
                "properties": {
                    "classification": {
                        "type": "string",
                        "enum": ["supply_chain", "general"],
                        "description": "Classify as 'supply_chain' if related to supply chain, geopolitics, macroeconomics. Otherwise 'general'."
                    },
                    "reasoning": {
                        "type": "string",
                        "description": "Brief reasoning for why this classification was chosen."
                    }
                },
                "required": ["classification", "reasoning"],
                "additionalProperties": False
            }
        }
    }
}