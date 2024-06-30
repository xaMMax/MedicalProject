import requests


def get_medical_records(patient_id):
    try:
        response = requests.get(f'http://localhost:8000/api/medical-records/?patient={patient_id}')
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching medical records: {e}")
        return None
