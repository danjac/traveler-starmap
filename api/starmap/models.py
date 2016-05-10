from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property

db = SQLAlchemy()


ATMOSPHERES = (
    "None", "Trace", "Very thin, Tainted", "Very thin", "Thin, Tainted",
    "Thin", "Standard", "Standard, Tainted", "Dense", "Dense, Tainted",
    "Exotic", "Corrosive", "Insidious", "Dense, High", "Thin, Low", "Unusual",
)

GOVERNMENTS = (
    "None", "Company/Corporation", "Participating Democracy",
    "Self-Perpetuating Oligarchy", "Representative Democracy",
    "Feudal Technocracy", "Captive Government", "Balkanization",
    "Civil Service Bureaucracy", "Impersonal Bureaucracy",
    "Charismatic Dictatorship", "Non-Charismatic Leader",
    "Charismatic Oligarchy", "Religious Dictatorship",
)

LAW_LEVELS = (
    "No prohibitions",
    "Body pistols, explosives, and poison gas prohibited",
    "Portable energy weapons prohibited",
    "Machineguns, automatic rifles prohibited",
    "Light assault weapons prohibited",
    "Personal concealable weapons prohibited",
    "All firearms except shotguns prohibited",
    "Shotguns prohibited",
    "Long bladed weapons controlled; open possession prohibited",
    "Possession of weapons outside the home prohibited",
    "Weapon possession prohibited",
    "Rigid control of civilian movement",
)

SHORT_TRADE_CLASSIFICATIONS = (
    ('is_agricultural', 'Ag'),
    ('is_asteroid_belt', 'As'),
    ('is_barren', 'Ba'),
    ('is_desert', 'De'),
    ('is_fluid', 'Fl'),
    ('is_garden_world', 'Ga'),
    ('is_high_population', 'Hi'),
    ('is_ice_capped', 'Ic'),
    ('is_industrial', 'In'),
    ('is_low_population', 'Lo'),
    ('is_non_agricultural', 'Na'),
    ('is_non_industrial', 'Ni'),
    ('is_poor', 'Po'),
    ('is_rich', 'Ri'),
    ('is_vaccuum_world', 'Va'),
    ('is_water_world', 'Wa'),
)

LONG_TRADE_CLASSIFICATIONS = (
    ('is_agricultural', 'Agricultural'),
    ('is_asteroid_belt', 'Asteroid belt'),
    ('is_barren', 'Barren'),
    ('is_desert', 'Desert'),
    ('is_fluid', 'Fluid'),
    ('is_garden_world', 'Garden world'),
    ('is_high_population', 'High population'),
    ('is_ice_capped', 'Ice-capped'),
    ('is_industrial', 'Industrial'),
    ('is_low_population', 'Low population'),
    ('is_non_agricultural', 'Non-agricultural'),
    ('is_non_industrial', 'Non-industrial'),
    ('is_poor', 'Poor'),
    ('is_rich', 'Rich'),
    ('is_vaccuum_world', 'Vaccuum world'),
    ('is_water_world', 'Water world'),
)


class Subsector(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode, nullable=False)

    worlds = db.relationship(
        'World',
        backref='subsector',
        lazy='dynamic',
        order_by='World.x_coord,World.y_coord',
    )

    def to_json(self):
        worlds_json = [w.to_json() for w in self.worlds]
        return {
            'id': self.id,
            'name': self.name,
            'worlds': worlds_json,
        }


class World(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    subsector_id = db.Column(
        db.Integer,
        db.ForeignKey('subsector.id'),
        nullable=False,
    )

    x_coord = db.Column(db.Integer, nullable=False)
    y_coord = db.Column(db.Integer, nullable=False)

    name = db.Column(db.Unicode(200), nullable=False)
    starport = db.Column(db.String(1), nullable=False)

    size = db.Column(db.Integer, nullable=False)
    atmosphere = db.Column(db.Integer, nullable=False)
    hydrographics = db.Column(db.Integer, nullable=False)
    temperature = db.Column(db.Integer, nullable=False)

    population = db.Column(db.Integer, nullable=False)
    exact_population = db.Column(db.BigInteger, nullable=False)

    government = db.Column(db.Integer, nullable=False)
    law_level = db.Column(db.Integer, nullable=False)
    tech_level = db.Column(db.Integer, nullable=False)

    is_gas_giant = db.Column(db.Boolean, default=False)
    is_naval_base = db.Column(db.Boolean, default=False)
    is_scout_base = db.Column(db.Boolean, default=False)
    is_research_base = db.Column(db.Boolean, default=False)
    is_pirate_base = db.Column(db.Boolean, default=False)
    is_tas = db.Column(db.Boolean, default=False)
    is_consulate = db.Column(db.Boolean, default=False)

    travel_zone = db.Column(db.Enum('Green', 'Amber', 'Red'), default='Green')

    def __str__(self):
        if self.name:
            return "%s:%s" % (self.name, self.uwp)
        return self.uwp

    def __repr__(self):
        return "<%s>" % self

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'coords': self.coords_desc,
            'uwp': self.uwp,
            'starport': self.starport,
            'size': self.size_desc,
            'atmosphere': self.atmosphere_desc,
            'hydrographics': self.hydrographics_desc,
            'temperature': self.temperature_desc,
            'population': self.population_desc,
            'government': self.government_desc,
            'law_level': self.law_level_desc,
            'tech_level': self.tech_level,
            'short_trade_codes': self.short_trade_classifications,
            'long_trade_codes': self.long_trade_classifications,
            'is_gas_giant': self.is_gas_giant,
            'is_naval_base': self.is_naval_base,
            'is_scout_base': self.is_scout_base,
            'is_research_base': self.is_research_base,
            'is_pirate_base': self.is_pirate_base,
            'is_tas': self.is_tas,
            'is_consulate': self.is_consulate,
            'travel_zone': self.travel_zone,
        }

    @hybrid_property
    def coordinates(self):
        return (self.x_coord, self.y_coord)

    @coordinates.setter
    def coordinates(self, coords):
        self.x_coord, self.y_coord = coords

    @property
    def uwp(self):
        rv = [self.starport]
        rv += ["%.X" % value for value in (
            self.size,
            self.atmosphere,
            self.hydrographics,
            self.population,
            self.government,
            self.law_level,
        )]

        rv.append("-%.X" % self.tech_level)

        return "".join(rv)

    @property
    def base_codes(self):
        """
        Returns short base codes as string
        """
        bases = []

        if self.is_naval_base:
            bases.append("N")
        if self.is_scout_base:
            bases.append("S")
        if self.is_research_base:
            bases.append("R")
        if self.is_tas:
            bases.append("T")
        if self.is_consulate:
            bases.append("I")
        if self.is_pirate_base:
            bases.append("P")

        return " ".join(bases)

    @property
    def short_trade_classifications(self):

        trade_cls = []

        for attr, code in SHORT_TRADE_CLASSIFICATIONS:
            if getattr(self, attr):
                trade_cls.append(code)

        return " ".join(trade_cls)

    @property
    def long_trade_classifications(self):

        trade_cls = []

        for attr, code in LONG_TRADE_CLASSIFICATIONS:
            if getattr(self, attr):
                trade_cls.append(code)

        return ", ".join(trade_cls)

    @property
    def is_agricultural(self):
        return all((
            self.atmosphere > 3,
            self.atmosphere < 10,
            self.hydrographics > 3,
            self.hydrographics < 9,
            self.population > 4,
            self.population < 8,
        ))

    @property
    def is_non_agricultural(self):
        return all((
            self.atmosphere < 4,
            self.hydrographics < 4,
            self.population > 5,
        ))

    @property
    def is_asteroid_belt(self):
        return self.atmosphere == self.size == self.hydrographics == 0

    @property
    def is_barren(self):
        return self.population == 0

    @property
    def is_desert(self):
        return self.atmosphere > 1 and self.hydrographics == 0

    @property
    def is_fluid(self):
        return self.atmosphere > 9 and self.hydrographics > 0

    @property
    def is_garden_world(self):
        return all((
            self.size > 4,
            self.atmosphere > 3,
            self.atmosphere < 10,
            self.hydrographics > 3,
            self.hydrographics < 9,
        ))

    @property
    def is_high_population(self):
        return self.population > 8

    @property
    def is_low_population(self):
        return self.population < 4

    @property
    def is_ice_capped(self):
        return self.atmosphere < 2 and self.hydrographics > 0

    @property
    def is_industrial(self):
        return all((
            (self.atmosphere < 3 or self.atmosphere in (4, 7, 9)),
            self.population > 8,
        ))

    @property
    def is_non_industrial(self):
        return self.population < 7

    @property
    def is_rich(self):
        return all((
            self.atmosphere in (6, 8),
            self.population > 5,
            self.population < 9,
            self.government > 3,
            self.government < 10,
        ))

    @property
    def is_poor(self):
        return all((
            self.atmosphere > 1,
            self.atmosphere < 6,
            self.hydrographics < 4,
        ))

    @property
    def is_water_world(self):
        return self.hydrographics > 9

    @property
    def is_vaccuum_world(self):
        return self.atmosphere == 0 and self.size > 0

    @property
    def coords_desc(self):
        return "%02.d%02.d" % self.coordinates

    @property
    def size_desc(self):
        if self.size == 0:
            return "N/A"
        return "{:,} miles".format(self.size * 1000)

    @property
    def atmosphere_desc(self):
        return ATMOSPHERES[self.atmosphere]

    @property
    def temperature_desc(self):
        if self.temperature < 3:
            return "Frozen"
        if self.temperature in (3, 4):
            return "Cold"
        if self.temperature in (10, 11):
            return "Hot"
        if self.temperature > 11:
            return "Roasting"
        return "Temperate"

    @property
    def hydrographics_desc(self):
        return "{}%".format(self.hydrographics * 10)

    @property
    def population_desc(self):
        return "{:,}".format(self.exact_population)

    @property
    def government_desc(self):
        return GOVERNMENTS[self.government]

    @property
    def law_level_desc(self):
        return LAW_LEVELS[self.law_level]
