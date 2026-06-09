from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_

from ..extensions import db
from ..models import IPCBNSMap, QueryHistory


lookup_bp = Blueprint("lookup", __name__)


@lookup_bp.get("/ipc-bns")
@jwt_required()
def ipc_bns_lookup():
    raw_query = (request.args.get("q") or "").strip()
    if not raw_query:
        return jsonify({"message": "Query parameter q is required"}), 400

    search = f"%{raw_query}%"
    rows = (
        IPCBNSMap.query.filter(
            or_(
                IPCBNSMap.ipc_section.ilike(search),
                IPCBNSMap.ipc_title.ilike(search),
                IPCBNSMap.bns_section.ilike(search),
                IPCBNSMap.bns_title.ilike(search),
            )
        )
        .order_by(IPCBNSMap.ipc_section.asc())
        .all()
    )

    history = QueryHistory(
        user_id=int(get_jwt_identity()),
        query_text=raw_query,
        query_type="ipc_bns_lookup",
        result_count=len(rows),
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({"query": raw_query, "results": [row.to_dict() for row in rows]}), 200


@lookup_bp.get("/history")
@jwt_required()
def query_history():
    limit = min(request.args.get("limit", default=20, type=int), 100)
    rows = (
        QueryHistory.query.filter_by(user_id=int(get_jwt_identity()))
        .order_by(QueryHistory.created_at.desc())
        .limit(limit)
        .all()
    )

    return jsonify({"history": [row.to_dict() for row in rows]}), 200
