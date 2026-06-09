from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .extensions import db, migrate
from .models import IPCBNSMap
from .routes.auth import auth_bp
from .routes.lookup import lookup_bp


jwt = JWTManager()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(lookup_bp, url_prefix="/api")

    register_commands(app)
    register_error_handlers(app)

    return app


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(_error):
        return jsonify({"message": "Internal server error"}), 500


def register_commands(app):
    def seed_ipc_bns_rows():
        seed_rows = [
            {
                "ipc_section": "302",
                "ipc_title": "Punishment for murder",
                "bns_section": "103",
                "bns_title": "Punishment for murder",
                "notes": "Core offence retained under BNS with updated numbering.",
            },
            {
                "ipc_section": "304",
                "ipc_title": "Punishment for culpable homicide not amounting to murder",
                "bns_section": "105",
                "bns_title": "Punishment for culpable homicide not amounting to murder",
                "notes": "Mapped to BNS section 105.",
            },
            {
                "ipc_section": "307",
                "ipc_title": "Attempt to murder",
                "bns_section": "109",
                "bns_title": "Attempt to murder",
                "notes": "Mapped to BNS section 109.",
            },
            {
                "ipc_section": "354",
                "ipc_title": "Assault or criminal force to woman with intent to outrage modesty",
                "bns_section": "74",
                "bns_title": "Assault or use of criminal force to woman with intent to outrage modesty",
                "notes": "Mapped to BNS section 74.",
            },
            {
                "ipc_section": "420",
                "ipc_title": "Cheating and dishonestly inducing delivery of property",
                "bns_section": "318(4)",
                "bns_title": "Cheating",
                "notes": "Cheating offence appears under BNS section 318, with punishment in sub-section 4.",
            },
            {
                "ipc_section": "498A",
                "ipc_title": "Husband or relative of husband of a woman subjecting her to cruelty",
                "bns_section": "85",
                "bns_title": "Husband or relative of husband of a woman subjecting her to cruelty",
                "notes": "Mapped to BNS section 85.",
            },
        ]

        inserted = 0
        for row in seed_rows:
            exists = IPCBNSMap.query.filter_by(ipc_section=row["ipc_section"]).first()
            if exists:
                continue
            db.session.add(IPCBNSMap(**row))
            inserted += 1

        db.session.commit()
        return inserted

    @app.cli.command("init-db")
    def init_db():
        db.create_all()
        inserted = seed_ipc_bns_rows()
        print(f"Database initialized. Seeded {inserted} IPC-BNS mappings.")

    @app.cli.command("seed-ipc-bns")
    def seed_ipc_bns():
        inserted = seed_ipc_bns_rows()
        print(f"Seeded {inserted} IPC-BNS mappings.")
