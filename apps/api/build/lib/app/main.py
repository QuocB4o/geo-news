import uuid

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from geo_news.config import get_settings
from sqlalchemy import create_engine, text
from starlette.exceptions import HTTPException as StarletteHTTPException

settings = get_settings()
app = FastAPI(title="Geo News API", version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.middleware("http")
async def correlation_id(request: Request, call_next):
    cid = request.headers.get("x-correlation-id") or str(uuid.uuid4())
    request.state.correlation_id = cid
    response = await call_next(request)
    response.headers["x-correlation-id"] = cid
    return response


def error_response(request: Request, status: int, code: str, message: str, details=None):
    body = {
        "code": code,
        "message": message,
        "correlationId": getattr(request.state, "correlation_id", None),
    }
    if details:
        body["details"] = details
    return JSONResponse(status_code=status, content=body)


@app.exception_handler(StarletteHTTPException)
async def http_error(request: Request, exc: StarletteHTTPException):
    return error_response(request, exc.status_code, f"http_{exc.status_code}", str(exc.detail))


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    details = [{"loc": e["loc"], "msg": e["msg"]} for e in exc.errors()]
    return error_response(request, 422, "validation_error", "Invalid request.", details)


@app.get("/api/v1/health/live")
def live():
    return {"status": "ok"}


@app.get("/api/v1/health/ready")
def ready(request: Request):
    try:
        engine = create_engine(settings.database_url, pool_pre_ping=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        return error_response(request, 503, "not_ready", "Database unavailable.")
    return {"status": "ready"}


@app.get("/api/v1/version")
def version():
    return {"version": settings.app_version, "environment": settings.app_env}
