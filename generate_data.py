# generate_data.py

import pandas as pd
import numpy as np
import random
from faker import Faker

fake = Faker("en_IN")

# =========================================================
# TELANGANA DISTRICTS
# =========================================================

districts = [
    "Hyderabad",
    "Warangal",
    "Karimnagar",
    "Nizamabad",
    "Khammam",
    "Adilabad",
    "Mahabubnagar",
    "Medak",
    "Rangareddy",
    "Nalgonda"
]

mandals = {
    "Hyderabad": ["Secunderabad", "Charminar", "Amberpet"],
    "Warangal": ["Hanamkonda", "Kazipet", "Parkal"],
    "Karimnagar": ["Huzurabad", "Jammikunta", "Manakondur"],
    "Nizamabad": ["Bodhan", "Armoor", "Bheemgal"],
    "Khammam": ["Kothagudem", "Palair", "Wyra"],
    "Adilabad": ["Utnoor", "Boath", "Nirmal"],
    "Mahabubnagar": ["Jadcherla", "Narayanpet", "Shadnagar"],
    "Medak": ["Sangareddy", "Narsapur", "Toopran"],
    "Rangareddy": ["Chevella", "Ibrahimpatnam", "Shamshabad"],
    "Nalgonda": ["Suryapet", "Miryalaguda", "Devarakonda"]
}

school_prefixes = [
    "ZPHS",
    "Govt High School",
    "Telangana Model School",
    "KGBV",
    "MJPTBCWREIS",
    "Residential School"
]

school_types = [
    "Government",
    "Private",
    "Aided"
]

area_types = [
    "Urban",
    "Rural"
]

# =========================================================
# GENERATE SCHOOLS DATA
# =========================================================

schools = []

NUM_SCHOOLS = 500

for i in range(NUM_SCHOOLS):

    district = random.choice(districts)
    mandal = random.choice(mandals[district])

    school_type = random.choices(
        school_types,
        weights=[0.65, 0.25, 0.10]
    )[0]

    area_type = random.choices(
        area_types,
        weights=[0.55, 0.45]
    )[0]

    school_name = f"{random.choice(school_prefixes)} {mandal}"

    enrollment = random.randint(250, 1500)

    boys = random.randint(int(enrollment * 0.45), int(enrollment * 0.55))
    girls = enrollment - boys

    teachers = random.randint(8, 55)

    # Infrastructure logic
    electricity = random.choices(
        ["Yes", "No"],
        weights=[0.92, 0.08]
    )[0]

    internet = random.choices(
        ["Yes", "No"],
        weights=[0.75, 0.25]
    )[0]

    library = random.choices(
        ["Yes", "No"],
        weights=[0.78, 0.22]
    )[0]

    playground = random.choices(
        ["Yes", "No"],
        weights=[0.82, 0.18]
    )[0]

    toilets = "Yes"

    digital_classrooms = random.randint(0, 10)

    teacher_student_ratio = round(enrollment / teachers, 1)

    # Better infra => better attendance
    infra_score = 50

    if electricity == "Yes":
        infra_score += 10

    if internet == "Yes":
        infra_score += 12

    if library == "Yes":
        infra_score += 10

    if playground == "Yes":
        infra_score += 8

    infra_score += digital_classrooms * 1.5

    infra_score = min(100, round(infra_score))

    # Attendance correlation
    attendance_rate = round(
        random.uniform(70, 95) + (infra_score - 70) * 0.1,
        1
    )

    attendance_rate = max(55, min(attendance_rate, 98))

    # Dropout correlation
    dropout_rate = round(
        max(
            1,
            25 - (attendance_rate * 0.18) - (infra_score * 0.08)
        ),
        1
    )

    schools.append({
        "school_id": f"TS{i+1:03}",
        "school_name": school_name,
        "district": district,
        "mandal": mandal,
        "school_type": school_type,
        "area_type": area_type,
        "enrollment": enrollment,
        "boys": boys,
        "girls": girls,
        "teachers": teachers,
        "toilets": toilets,
        "electricity": electricity,
        "internet": internet,
        "playground": playground,
        "library": library,
        "digital_classrooms": digital_classrooms,
        "attendance_rate": attendance_rate,
        "dropout_rate": dropout_rate,
        "infrastructure_score": infra_score,
        "teacher_student_ratio": teacher_student_ratio
    })

schools_df = pd.DataFrame(schools)

# =========================================================
# SAVE SCHOOLS DATA
# =========================================================

schools_df.to_csv("schools.csv", index=False)

print("schools.csv generated successfully!")

# =========================================================
# GENERATE STUDENT DATA
# =========================================================

students = []

NUM_STUDENTS = 8000

parent_education_levels = [
    "None",
    "Primary",
    "Secondary",
    "Graduate"
]

income_levels = [
    "Low",
    "Medium",
    "High"
]

for i in range(NUM_STUDENTS):

    school = schools_df.sample(1).iloc[0]

    attendance = round(random.uniform(45, 98), 1)

    previous_absences = random.randint(0, 30)

    income_level = random.choices(
        income_levels,
        weights=[0.45, 0.40, 0.15]
    )[0]

    travel_distance = round(random.uniform(0.5, 12), 1)

    internet_access = random.choices(
        ["Yes", "No"],
        weights=[0.75, 0.25]
    )[0]

    parent_education = random.choices(
        parent_education_levels,
        weights=[0.15, 0.35, 0.35, 0.15]
    )[0]

    # Academic performance correlation
    base_score = attendance * 0.9

    if internet_access == "Yes":
        base_score += 5

    if income_level == "High":
        base_score += 5

    math_score = int(max(25, min(base_score + random.randint(-10, 10), 99)))
    science_score = int(max(25, min(base_score + random.randint(-10, 10), 99)))
    english_score = int(max(25, min(base_score + random.randint(-10, 10), 99)))

    # Dropout risk logic
    risk_score = 0

    if attendance < 70:
        risk_score += 3

    if previous_absences > 15:
        risk_score += 2

    if income_level == "Low":
        risk_score += 2

    if internet_access == "No":
        risk_score += 1

    if travel_distance > 7:
        risk_score += 1

    if math_score < 45:
        risk_score += 2

    dropout_label = 1 if risk_score >= 5 else 0

    students.append({
        "student_id": f"ST{i+1:05}",
        "student_name": fake.name(),
        "school_id": school["school_id"],
        "gender": random.choice(["Male", "Female"]),
        "class": random.randint(6, 10),
        "attendance": attendance,
        "math_score": math_score,
        "science_score": science_score,
        "english_score": english_score,
        "income_level": income_level,
        "travel_distance": travel_distance,
        "internet_access": internet_access,
        "parent_education": parent_education,
        "previous_absences": previous_absences,
        "dropout_label": dropout_label
    })

students_df = pd.DataFrame(students)

# =========================================================
# SAVE STUDENT DATA
# =========================================================

students_df.to_csv("students.csv", index=False)

print("students.csv generated successfully!")

# =========================================================
# GENERATE TRENDS DATA
# =========================================================

trends = []

years = [2020, 2021, 2022, 2023, 2024]

for district in districts:

    enrollment_base = random.randint(30000, 90000)

    for year in years:

        enrollment = enrollment_base + random.randint(-3000, 5000)

        digital_access = random.randint(45, 95)

        teacher_ratio = round(random.uniform(24, 38), 1)

        girls_enrollment = int(enrollment * random.uniform(0.47, 0.50))

        dropout_rate = round(
            max(2, 18 - (digital_access * 0.12)),
            1
        )

        trends.append({
            "district": district,
            "year": year,
            "enrollment": enrollment,
            "dropout_rate": dropout_rate,
            "digital_access": digital_access,
            "teacher_ratio": teacher_ratio,
            "girls_enrollment": girls_enrollment
        })

trends_df = pd.DataFrame(trends)

# =========================================================
# SAVE TRENDS DATA
# =========================================================

trends_df.to_csv("trends.csv", index=False)

print("trends.csv generated successfully!")