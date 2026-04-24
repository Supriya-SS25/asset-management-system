"""
Reports Router

This module contains report-related API endpoints including
asset reports and analytics data.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

router = APIRouter(prefix="/api/reports", tags=["reports"])

# Mock data - in production, this would be generated from actual database
mock_asset_report = {
    "total_assets": 150,
    "by_category": {
        "IT Equipment": 80,
        "Furniture": 35,
        "Tools": 25,
        "Other": 10
    },
    "by_status": {
        "Available": 65,
        "Assigned": 75,
        "Maintenance": 5,
        "Broken": 5
    },
    "by_department": {
        "IT": 45,
        "HR": 20,
        "Finance": 25,
        "Operations": 60
    }
}

mock_utilization_report = {
    "average_utilization": 78.5,
    "most_utilized_assets": [
        {"name": "Laptop Dell Latitude", "utilization": 95.2},
        {"name": "Conference Room Projector", "utilization": 88.7},
        {"name": "Office Printer", "utilization": 82.1}
    ],
    "least_utilized_assets": [
        {"name": "Backup Server", "utilization": 15.3},
        {"name": "Scanner", "utilization": 22.8},
        {"name": "Conference Phone", "utilization": 31.4}
    ]
}

@router.get("/assets")
async def generate_asset_report() -> Dict[str, Any]:
    """
    Generate asset inventory report.
    
    Returns:
        Dict[str, Any]: Comprehensive asset report including
        total counts, category breakdowns, and status distributions
    """
    return {
        "report_type": "asset_inventory",
        "generated_at": "2024-01-01T12:00:00",
        "data": mock_asset_report,
        "summary": {
            "total_assets": mock_asset_report["total_assets"],
            "categories": len(mock_asset_report["by_category"]),
            "departments": len(mock_asset_report["by_department"])
        }
    }

@router.get("/utilization")
async def generate_utilization_report() -> Dict[str, Any]:
    """
    Generate asset utilization report.
    
    Returns:
        Dict[str, Any]: Asset utilization analytics including
        average utilization rates and asset rankings
    """
    return {
        "report_type": "asset_utilization",
        "generated_at": "2024-01-01T12:00:00",
        "data": mock_utilization_report,
        "summary": {
            "average_utilization": mock_utilization_report["average_utilization"],
            "top_performer": mock_utilization_report["most_utilized_assets"][0]["name"],
            "underutilized_count": len(mock_utilization_report["least_utilized_assets"])
        }
    }

@router.get("/assignments")
async def generate_assignment_report() -> Dict[str, Any]:
    """
    Generate assignment report.
    
    Returns:
        Dict[str, Any]: Assignment analytics including
        current assignments, overdue items, and trends
    """
    return {
        "report_type": "assignment_report",
        "generated_at": "2024-01-01T12:00:00",
        "data": {
            "current_assignments": 75,
            "overdue_assignments": 5,
            "assignments_this_month": 23,
            "returns_this_month": 18,
            "average_assignment_duration": 45.2,  # days
            "by_department": {
                "IT": 25,
                "HR": 15,
                "Finance": 20,
                "Operations": 15
            }
        },
        "summary": {
            "total_active": 75,
            "attention_required": 5,
            "monthly_activity": 41
        }
    }
