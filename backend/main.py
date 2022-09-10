from fastapi import Depends, FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.wsgi import WSGIMiddleware

# from .dependencies import get_query_token, get_token_header
# from .internal import admin
from sumo.routes import router as sumo_routes
from smda.routes import router as smda_routes

from dash_app import webviz_app

def custom_generate_unique_id(route: APIRoute):
    print(route.tags, route.name)
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id, openapi_url="/openapi.json"
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/dash", WSGIMiddleware(webviz_app.server))

app.include_router(sumo_routes)
app.include_router(smda_routes)


@app.get("/", tags=["main"])
async def root():
    return {"message": "Hello!"}


"""TODO: Add oauth middleware"""

if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run("main:app", host="localhost", port=5000, reload=True, log_level="debug")
