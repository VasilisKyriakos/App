import requests
import json

# Overpass API URL
overpass_url = 'https://overpass-api.de/api/interpreter'
query = """
[out:json][timeout:25];
(
  node["natural"="beach"](34.7000,19.3000,41.8000,28.2000);
  way["natural"="beach"](34.7000,19.3000,41.8000,28.2000);
  relation["natural"="beach"](34.7000,19.3000,41.8000,28.2000);
);
out body;
>;
out skel qt;
"""

# Fetch data from Overpass API
response = requests.post(overpass_url, data={'data': query})

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    # Save the data to a JSON file
    with open('beaches.json', 'w') as f:
        json.dump(data, f, indent=2)
    print('Data saved to beaches.json')
else:
    print('Error fetching data from Overpass API:', response.status_code)
