import json


with open('counties-input.json') as f:
    data_in = json.loads(f.read())

with open('states.txt') as f:
    states = [line.strip().split('\t') for line in f if line]
    states = {int(i[2]): {'name': i[0], 'abb': i[1]} for i in states}

for county in data_in['objects']['counties']['geometries']:
    del county['properties']['population']

for state in data_in['objects']['states']['geometries']:
    state_id = int(state['id'])
    state['properties'] = states[state_id]

with open('counties-output.json', 'w') as f:
    f.write(json.dumps(data_in))
