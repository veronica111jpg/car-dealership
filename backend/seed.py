"""Fill the database with sample vehicles (only if it is empty).

Usage: python seed.py
"""
from app.database import Base, SessionLocal, engine
from app.models import user, vehicle  # noqa: F401  (registers the tables)
from app.models.vehicle import Vehicle

SAMPLES = [
    ("Toyota", "Corolla", "Sedan", 20500, 5),
    ("Honda", "Civic", "Sedan", 22900, 3),
    ("Toyota", "RAV4", "SUV", 31200, 4),
    ("Ford", "Explorer", "SUV", 39800, 2),
    ("Volkswagen", "Golf", "Hatchback", 24100, 6),
    ("Ford", "F-150", "Truck", 44500, 1),
    ("BMW", "M4", "Coupe", 78900, 1),
    ("Mazda", "MX-5", "Convertible", 29900, 0),  # out of stock, to test the disabled button
    ("Honda", "Odyssey", "Van", 38200, 3),
    ("Tesla", "Model 3", "Sedan", 42900, 4),
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(Vehicle).count() == 0:
        for make, model, category, price, quantity in SAMPLES:
            db.add(Vehicle(make=make, model=model, category=category,
                           price=price, quantity=quantity))
        db.commit()
        print(f"Added {len(SAMPLES)} vehicles")
    else:
        print("Vehicles already exist, nothing added")
    db.close()


if __name__ == "__main__":
    main()