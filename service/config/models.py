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