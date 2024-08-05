from flask import Flask, jsonify
from flask_cors import CORS

import traceback

from .routes.Files import (CreateUserDirectoryRoute, DownloadFilesRoute, 
                           GetUploadFilesRoute, 
                           UploadImageRoutes,
                           DeleteFilesRoute)

from src.utils.Logger import Logger

try:
    app = Flask(__name__)
    
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    CORS(app, resources={r"/delete/input-files/.*\.csv$": {"origins": "http://localhost:3000", "methods": ["DELETE"]}})
    
    def init_app(config):
        try:
            # Configuration
            app.config.from_object(config)

            # Blueprints
            app.register_blueprint(GetUploadFilesRoute.main, url_prefix='/api/get-upload-files/<id>')
            app.register_blueprint(CreateUserDirectoryRoute.main, url_prefix='/api/create-directory/<id>')
            app.register_blueprint(UploadImageRoutes.main, url_prefix='/api/upload-image/<id>')
            app.register_blueprint(DownloadFilesRoute.main, url_prefix='/api/download/<path>/<file>')
            app.register_blueprint(DeleteFilesRoute.main, url_prefix='/api/delete-file/<filename>')
            
            return app
        except Exception as ex:
            Logger.add_to_log('error', traceback.format_exc())
except Exception as ex:
    Logger.add_to_log('Error al cargar las dependencias en el archivo de configuración de rutas', traceback.format_exc())
