"""
Dashboard Router

This module contains dashboard-related API endpoints including
system statistics and overview data.
"""

from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# Mock data - in production, this would be calculated from actual database
mock_stats = {
    "total_assets": 150,
    "assigned_assets": 75,
    "available_assets": 65,
    "broken_assets": 10,
    "total_employees": 45,
    "total_departments": 8,
    "recent_assignments": 12,
    "pending_returns": 5
}

@router.get("/stats")
async def get_dashboard_stats() -> Dict[str, Any]:
    """
    Dashboard statistics endpoint.
    
    Returns:
        Dict[str, Any]: Dashboard statistics including asset counts,
        employee counts, and recent activity metrics
    """
    return mock_stats

@router.get("/overview")
async def get_dashboard_overview() -> Dict[str, Any]:
    """
    Dashboard overview endpoint.
    
    Returns:
        Dict[str, Any]: Comprehensive dashboard overview with
        system health metrics and activity summaries
    """
    return {
        "system_health": "good",
        "last_updated": "2024-01-01T12:00:00",
        "alerts": [
            {
                "type": "warning",
                "message": "5 assets due for return this week",
                "priority": "medium"
            },
            {
                "type": "info",
                "message": "3 new employees added this month",
                "priority": "low"
            }
        ],
        "quick_stats": mock_stats,
        "activity_summary": {
            "assignments_today": 3,
            "returns_today": 2,
            "new_assets_this_week": 1,
            "maintenance_required": 2
        }
    }
