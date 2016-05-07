import io

from flask import Flask, send_file, jsonify, make_response
from flask_restful import Resource, Api

from starmap import generator, map
from starmap.models import db, Subsector


app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/starmap.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db.init_app(app)


class SubsectorList(Resource):

    def post(self):
        """
        Generate subsector, store in database
        Should return subsector details

        We need some limit on the number of subectors
        """
        subsector = generator.generate_subsector('./names.txt')

        worlds = [
            dict(
                name=w.name,
                uwp=w.uwp,
                notes=w.short_trade_classifications,
                bases=w.base_codes,
            ) for w in subsector.worlds
        ]

        db.session.add(subsector)
        db.session.commit()

        return make_response(jsonify({
            'worlds': worlds,
            'subsector': {
                'id': subsector.id,
                'name': subsector.name,
            },
        }), 201)

    def get(self):
        """
        Return list of subsectors
        """
        subsectors = [
            dict(
                id=s.id,
                name=s.name
            ) for s in Subsector.query.all()
        ]
        return jsonify({'subsectors': subsectors})


class SubsectorDetail(Resource):

    def get(self, id):
        """
        Return list of subsectors
        Also: CSV option, long/short format
        """
        subsector = Subsector.query.get_or_404(id)
        worlds = [dict(
            name=w.name,
            uwp=w.uwp,
            notes=w.short_trade_classifications,
            bases=w.base_codes,
            coords=w.coords_desc,
            ) for w in subsector.worlds]
        return jsonify({
            'worlds': worlds,
            'subsector': {
                'id': subsector.id,
                'name': subsector.name,
            },
        })


class MapDetail(Resource):

    def get(self, id):
        """
        Returns map as a PNG
        """
        fp = io.BytesIO()
        subsector = Subsector.query.get_or_404(id)
        map.draw_map(fp, subsector.worlds)
        fp.seek(0)
        return send_file(fp, mimetype='image/png')

api.add_resource(SubsectorList, "/subsectors/")
api.add_resource(SubsectorDetail, "/subsector/<int:id>/")
api.add_resource(MapDetail, "/map/<int:id>/")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
