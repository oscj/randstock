'''
This tool serves to take the CSVs which hold sector information for stocks,
and convert it into a more compact JSON form for usage within the app.

Example: python3 csvTransformer.py stocks.json amex.csv asx.csv nasdaq.csv nyse.csv
'''
import pandas as pd
import sys
import json

if not sys.argv[1].endswith(".json"):
    print("first arg needs to be output json file")
    quit()
if not all(map(lambda x: x.endswith(".csv"), sys.argv[2:])):
    print("2nd+ arg need to be input csv files")
    quit()

paths = sys.argv[2:]

data = {}
for path in paths:
    df = pd.read_csv(path, na_filter = False)
    name = path.removesuffix(".csv")
    sectors = df["Sector"].unique()

    data[name] = {"name": name, "sectors": {}}
    for sector in sectors:
        data[name]["sectors"][sector] = df[df["Sector"] == sector]["Symbol"].to_list()

out = open(sys.argv[1], "w")
json.dump(data, out, indent = 2)

