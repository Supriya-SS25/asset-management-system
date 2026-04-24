import urllib.request
import json

def create_user(name, email, role):
    url = "http://localhost:8000/api/users/"
    data = json.dumps({
        "name": name,
        "email": email,
        "role": role,
        "department_id": 1
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Created {role} user: {email}", response.read())
    except Exception as e:
        if hasattr(e, 'read'):
            print(f"Failed {email}:", e.read())
        else:
            print("Failed:", e)

create_user("System Admin", "admin@company.com", "admin")
create_user("Standard Employee", "employee@company.com", "employee")
