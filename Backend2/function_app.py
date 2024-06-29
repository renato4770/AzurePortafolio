import azure.functions as func
import logging
import json
import os
from azure.cosmos import CosmosClient

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


### req es el que esta fallando ----------------------------

@app.route(route="httptrigercosmodb")
def httptrigercosmodb(req: func.HttpRequest) -> func.HttpResponse:

    logging.info('Python HTTP trigger function processed a request.')

    

    # Cosmos DB connection global vars
    endpoint = os.environ["COSMOS_ENDPOINT"]
    account_key = os.environ["COSMOS_KEY"]

    client = CosmosClient(url=endpoint, credential=account_key)
    database_name = "ToDoList"
    container_name = "Items"
    item_id = "1"
    partition_key = "1"


    database = client.get_database_client(database_name)
    container = database.get_container_client(container_name)

    # Retrieve the current count item
    count_item = container.read_item(item_id,partition_key)

    
    if not count_item:
        return func.HttpResponse(
            "Count item missing",
            status_code=400  # Bad Request
        )
    
    # Extract the integer property from the item
    current_count = count_item.get('count', 0)

    # increment the count for each page refresh/API call
    updated_count = current_count + 1

    # Update the count item with the new value
    count_item['count'] = updated_count
    container.upsert_item(count_item)
    
    # Serialize the item to JSON
    item_json = json.dumps(count_item, indent=2)

    return func.HttpResponse(
        body=item_json, 
        mimetype='application/json',
        status_code=200
        
    )