import json
import requests

data_dir = 'data/'
countries = requests.get('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code').json()

# download stats for each country
for country in countries:
    code = country['alpha2Code']
    print(code)
    response = requests.get('https://api.wigle.net/api/v2/stats/regions?country={}'.format(code)).json()

    with open('{}stats_regions_{}_{}.json'.format(data_dir, code, country['name']), 'w+') as new_file:
        json.dump(response, new_file)

# download wifi count for all countries
response = requests.get('https://api.wigle.net/api/v2/stats/countries').json()
with open('{}stats_countries_wifi_count.json'.format(data_dir), 'w+') as stats_countries_file:
    json.dump(response, stats_countries_file)