from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database_connection import get_db_dependency
from models import Company

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.get("/search")
def search_companies(q: str = Query(min_length=1), db: Session = Depends(get_db_dependency)):
    from sqlalchemy import func
    pattern = f"%{q}%"
    results = (
        db.query(Company)
        .filter(
            (func.lower(Company.name).like(func.lower(pattern))) | 
            (func.lower(Company.domain).like(func.lower(pattern)))
        )
        .order_by(Company.name.asc())
        .limit(25)
        .all()
    )
    return [
        {
            "id": c.id,
            "name": c.name,
            "domain": c.domain,
            "logo_url": c.logo_url,
            "is_active": bool(c.is_active),
        }
        for c in results
    ]

