from typing import Optional

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from langchain_groq import ChatGroq

from config import GROQ_API_KEY, GROQ_MODEL
from utils.logger import logger

router = APIRouter(tags=["Classify"])


class CallerReport(BaseModel):
    scamType: Optional[str] = None
    description: str
    severity: Optional[int] = None


class ClassifyCallerRequest(BaseModel):
    number: str
    reports: list[CallerReport] = Field(default_factory=list)


class CallerVerdict(BaseModel):
    scamType: str = Field(
        description="The single most likely scam type, e.g. 'Digital Arrest Scam', 'KYC/Bank Scam', 'Fake Delivery Scam'."
    )
    riskScore: int = Field(
        description="Integer risk score from 0 (clearly safe) to 100 (definite scam).",
        ge=0,
        le=100,
    )
    label: str = Field(description="One of exactly: 'Safe', 'Suspicious', or 'Scam'.")
    explanation: str = Field(
        description="A concrete 1-2 sentence explanation that references the community report patterns."
    )
    recommendation: str = Field(
        description="A short, actionable recommendation for the user (what to do about this caller)."
    )


SYSTEM_PROMPT = (
    "You are a fraud-analysis engine for India-focused scam detection. "
    "Given a phone number and a set of community-submitted reports about that number, "
    "classify the single most likely scam type, assign an integer riskScore from 0 to 100, "
    "and a label ('Safe', 'Suspicious', or 'Scam'). "
    "Provide a concrete 1-2 sentence explanation that references the specific patterns in the reports, "
    "and a short, actionable recommendation. "
    "Be concrete and grounded in the reports. Use the Indian scam context (e.g. Digital Arrest, "
    "KYC/bank update, UPI refund, fake delivery/courier, lottery, job offer, investment, electricity-bill "
    "disconnection). More reports and higher severity should increase the riskScore. "
    "Map the label from the riskScore: >=70 is 'Scam', 40-69 is 'Suspicious', below 40 is 'Safe'."
)


def _format_reports(reports: list[CallerReport]) -> str:
    if not reports:
        return "(no community reports provided)"
    lines = []
    for i, r in enumerate(reports, start=1):
        scam_type = r.scamType or "Unspecified"
        severity = r.severity if r.severity is not None else "Unspecified"
        lines.append(
            f"{i}. scamType: {scam_type} | severity: {severity} | description: {r.description}"
        )
    return "\n".join(lines)


@router.post("/classify/caller", response_model=CallerVerdict)
def classify_caller(payload: ClassifyCallerRequest):
    try:
        llm = ChatGroq(model=GROQ_MODEL, api_key=GROQ_API_KEY, temperature=0)
        structured_llm = llm.with_structured_output(CallerVerdict)

        human_message = (
            f"Phone number: {payload.number}\n\n"
            f"Community reports ({len(payload.reports)} total):\n"
            f"{_format_reports(payload.reports)}\n\n"
            "Classify this caller now."
        )

        verdict: CallerVerdict = structured_llm.invoke(
            [
                ("system", SYSTEM_PROMPT),
                ("human", human_message),
            ]
        )
        return verdict
    except Exception as exc:
        logger.error(f"Groq classification failed for number {payload.number}: {exc}")
        return JSONResponse(
            status_code=502,
            content={
                "success": False,
                "message": f"Failed to classify caller via AI engine: {exc}",
            },
        )
