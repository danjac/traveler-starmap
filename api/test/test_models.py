from starmap.models import World, hexcode


def test_hexcodes():
    assert hexcode(1) == '1'
    assert hexcode(10) == 'A'
    assert hexcode(16) == 'F'


def test_uwp():

    world = World(
        starport='A',
        size=9,
        atmosphere=4,
        hydrographics=10,
        population=5,
        government=6,
        law_level=7,
        tech_level=8,
    )

    assert world.uwp == 'A94A567-8'


def test_temperature_desc():

    assert World(temperature=2).temperature_desc == 'Frozen'
    assert World(temperature=3).temperature_desc == 'Cold'
    assert World(temperature=6).temperature_desc == 'Temperate'
    assert World(temperature=10).temperature_desc == 'Hot'
    assert World(temperature=12).temperature_desc == 'Roasting'

