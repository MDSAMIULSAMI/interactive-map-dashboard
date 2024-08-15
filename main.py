from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-addresses/")
async def get_addresses(
    ne_lat: float = Query(..., description="Northeast latitude"),
    ne_lng: float = Query(..., description="Northeast longitude"),
    sw_lat: float = Query(..., description="Southwest latitude"),
    sw_lng: float = Query(..., description="Southwest longitude")
):
    logger.info(f"Received parameters: ne_lat={ne_lat}, ne_lng={ne_lng}, sw_lat={sw_lat}, sw_lng={sw_lng}")
    if not all([ne_lat, ne_lng, sw_lat, sw_lng]):
        raise HTTPException(status_code=400, detail="Missing or invalid parameters")

    url = (
        f"https://nominatim.openstreetmap.org/search?"
        f"bbox={sw_lng},{sw_lat},{ne_lng},{ne_lat}&"
        f"format=json&addressdetails=1"
    )

    logger.info(f"Requesting URL: {url}")

    try:
        response = requests.get(url)
        response.raise_for_status()
        logger.info(f"API Response Status: {response.status_code}")
        logger.info(f"API Response Content: {response.text}")

        data = response.json()
        logger.info(f"Response Data Type: {type(data)}")
        logger.info(f"Response Data: {data}")

        if isinstance(data, list):
            addresses = [place.get('display_name', 'No display name') for place in data]
        else:
            raise HTTPException(status_code=500, detail="Unexpected response format")
        
        return {"addresses": addresses}
    
    except requests.RequestException as e:
        logger.error(f"Request failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
