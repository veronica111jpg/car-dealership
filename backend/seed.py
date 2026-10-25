"""Fill the database with sample vehicles (only if it is empty).

Usage: python seed.py
"""
from app.database import Base, SessionLocal, engine
from app.models import user, vehicle  # noqa: F401  (registers the tables)
from app.models.vehicle import Vehicle

"""Reset the vehicles table to a set of sample Indian-market cars.

Usage: python seed.py
(Development only: this deletes all existing vehicles first.)
Prices are illustrative, in rupees.
"""
from app.database import Base, SessionLocal, engine
from app.models import user, vehicle  # noqa: F401  (registers the tables)
from app.models.vehicle import Vehicle

SAMPLES = [
    ("Maruti Suzuki", "Swift", "Hatchback", 650000, 6),
    ("Maruti Suzuki", "Baleno", "Hatchback", 750000, 5),
    ("Maruti Suzuki", "Dzire", "Sedan", 700000, 4),
    ("Hyundai", "Creta", "SUV", 1450000, 3),
    ("Hyundai", "Verna", "Sedan", 1250000, 2),
    ("Tata", "Nexon", "SUV", 1150000, 5),
    ("Tata", "Punch", "SUV", 800000, 4),
    ("Tata", "Nexon EV", "Electric", 1500000, 2),
    ("Mahindra", "Thar", "SUV", 1500000, 0),  # out of stock, to test the disabled button
    ("Mahindra", "Scorpio-N", "SUV", 1400000, 3),
    ("Mahindra", "Bolero Pickup", "Pickup", 1000000, 1),
    ("Honda", "City", "Sedan", 1250000, 3),
    ("Kia", "Seltos", "SUV", 1300000, 4),
    ("Toyota", "Innova Crysta", "MPV", 2000000, 2),
    ("Toyota", "Fortuner", "SUV", 3600000, 1),
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    db.query(Vehicle).delete()
    for make, model, category, price, quantity in SAMPLES:
        db.add(Vehicle(make=make, model=model, category=category,
                       price=price, quantity=quantity))
    db.commit()
    print(f"Loaded {len(SAMPLES)} vehicles")
    db.close()


if __name__ == "__main__":
    main()