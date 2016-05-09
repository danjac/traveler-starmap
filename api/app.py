import io

from flask import Flask, send_file, jsonify, make_response
from sqlalchemy.sql.expression import func

from starmap import generator, map
from starmap.models import db, Subsector


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/starmap.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db.init_app(app)


def create_subsector():
    # names file should be arg/setting
    subsector = generator.generate_subsector('./names.txt')

    db.session.add(subsector)
    db.session.commit()
    return subsector


@app.route("/", methods=['POST'])
def new_subsector():
    """
    Generate subsector, store in database
    Should return subsector details

    We need some limit on the number of subectors
    """
    subsector = create_subsector()
    return make_response(jsonify(subsector.to_json()), 201)


@app.route("/random/")
def get_random_subsector():
    """
    Returns a random subsector. If no subsectors exist yet,
    then creates a new subsector and returns that.
    """

    status_code = 200
    subsector = Subsector.query.order_by(func.random()).first()

    if subsector is None:
        subsector = create_subsector()
        status_code = 201

    return make_response(jsonify(subsector.to_json()), status_code)


@app.route("/<int:id>/")
def get_subsector_detail(id):
    """
    Returns details for specific subsector
    If format=csv then return details CSV download
    """
    subsector = Subsector.query.get_or_404(id)
    return jsonify(subsector.to_json())


@app.route("/<int:id>/map/")
def download_map(id):
    """
    Download map as a PNG
    """
    fp = io.BytesIO()
    subsector = Subsector.query.get_or_404(id)
    map.draw_map(fp, subsector.worlds)
    fp.seek(0)
    return send_file(fp, mimetype='image/png')


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
