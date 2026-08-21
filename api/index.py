import sys
import os

# Ensure the api directory is on the path
sys.path.insert(0, os.path.dirname(__file__))

from app.main import app
from mangum import Mangum

# Vercel invokes this as an AWS Lambda-compatible handler
handler = Mangum(app, lifespan="off")
