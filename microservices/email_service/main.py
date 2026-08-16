from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import httpx
import os
from jinja2 import Environment, FileSystemLoader
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Email Transport Service")

INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY", "dev-secret-key-12345")
BREVO_API_KEY = os.environ.get("BREVO_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "contact@jobsira.com")
SENDER_NAME = os.environ.get("SENDER_NAME", "Jobsira")

env = Environment(loader=FileSystemLoader("templates"))

def verify_api_key(x_internal_api_key: str = Header(...)):
    if x_internal_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid internal API key")
    return x_internal_api_key

class Recipient(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class EmailPayload(BaseModel):
    recipient: Optional[Recipient] = None
    to: Optional[list[Recipient]] = None
    bcc: Optional[list[Recipient]] = None
    templateId: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    html: Optional[str] = None
    subject: Optional[str] = None

@app.post("/v1/emails/send")
async def send_email(payload: EmailPayload, api_key: str = Depends(verify_api_key)):
    if not BREVO_API_KEY:
        raise HTTPException(status_code=500, detail="BREVO_API_KEY not configured in environment")

    html_content = payload.html
    subject = payload.subject

    # 1. Résolution du template (si demandé)
    if payload.templateId:
        try:
            template = env.get_template(f"{payload.templateId}.html")
            html_content = template.render(**(payload.data or {}))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Template rendering error: {str(e)}")
            
        # Defaults for known templates
        if payload.templateId == "b2b_invitation" and not subject:
            subject = "Votre invitation officielle - Jobsira"

    # 2. Validation
    if not html_content or not subject:
         raise HTTPException(status_code=400, detail="You must provide either (html + subject) OR a valid templateId")

    # 3. Envoi via Brevo
    async with httpx.AsyncClient() as client:
        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }
        
        to_payload = []
        if payload.to:
             to_payload = [{"email": r.email, "name": r.name} if r.name else {"email": r.email} for r in payload.to]
        elif payload.recipient:
             to_payload = [{"email": payload.recipient.email, "name": payload.recipient.name} if payload.recipient.name else {"email": payload.recipient.email}]
             
        if not to_payload and not payload.bcc:
             raise HTTPException(status_code=400, detail="Must provide at least one recipient (to or bcc)")

        body = {
            "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
            "subject": subject,
            "htmlContent": html_content
        }
        
        if to_payload:
            body["to"] = to_payload
        
        if payload.bcc:
            body["bcc"] = [{"email": r.email, "name": r.name} if r.name else {"email": r.email} for r in payload.bcc]
        
        try:
            response = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers=headers,
                json=body,
                timeout=10.0
            )
        except Exception as e:
             raise HTTPException(status_code=500, detail=f"Failed to connect to Brevo: {str(e)}")
        
        if response.status_code >= 400:
             error_detail = response.text
             try:
                 error_detail = response.json()
             except:
                 pass
             raise HTTPException(status_code=response.status_code, detail=f"Brevo API Error: {error_detail}")
             
        data = response.json()
        return {"status": "success", "providerMessageId": data.get("messageId")}

@app.get("/health")
async def health_check():
    return {"status": "ok", "brevo_configured": bool(BREVO_API_KEY)}
