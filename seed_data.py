from database import SessionLocal
import database_models
from datetime import date

def seed_assets():
    db = SessionLocal()
    
    # Check if assets already exist
    if db.query(database_models.Asset).count() > 0:
        print("Data already seeded.")
        return

    # Get our test users
    admin = db.query(database_models.User).filter_by(role="admin").first()
    employee = db.query(database_models.User).filter_by(role="employee").first()

    assets = [
        database_models.Asset(
            asset_name="MacBook Pro 16-inch (M3 Max)",
            category="Laptop",
            purchase_date=date(2025, 1, 15),
            cost=3499.00,
            image_url="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
            status=database_models.AssetStatusEnum.in_use,
            assigned_user_id=employee.id if employee else None
        ),
        database_models.Asset(
            asset_name="Dell UltraSharp 32 4K USB-C Hub Monitor",
            category="Monitor",
            purchase_date=date(2025, 2, 10),
            cost=899.99,
            image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
            status=database_models.AssetStatusEnum.assigned,
            assigned_user_id=employee.id if employee else None
        ),
        database_models.Asset(
            asset_name="iPhone 15 Pro Max 256GB",
            category="Phone",
            purchase_date=date(2025, 6, 20),
            cost=1199.00,
            image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
            status=database_models.AssetStatusEnum.maintenance,
            assigned_user_id=None
        ),
        database_models.Asset(
            asset_name="Lenovo ThinkPad X1 Carbon Gen 11",
            category="Laptop",
            purchase_date=date(2025, 8, 5),
            cost=1750.00,
            image_url="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800",
            status=database_models.AssetStatusEnum.available,
            assigned_user_id=None
        )
    ]

    db.add_all(assets)
    db.commit()
    print("Database seeded with cool tech assets!")
    db.close()

if __name__ == "__main__":
    seed_assets()
