import sys
import os

# Add the 'backend' directory to sys.path so 'app' can be imported
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from app.main import app

