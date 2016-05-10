import random
import math

from .models import World, Subsector


STARPORTS = ("X", "E", "E", "D", "D", "C", "C", "B", "B", "A", "A")


TEMP_MODIFIERS = (
    ((2, 3), 2),
    ((4, 5, 14), -1),
    ((8, 9), 1),
    ((10, 13, 15), 2),
    ((11, 12), 6),
)

BERTHING_COST_MODIFIERS = {
    "A": 1000,
    "B": 500,
    "C": 100,
    "D": 10,
}

TAS_MODIFIERS = {
    "A": 4,
    "B": 2,
    "C": -2,
}

CONSULATE_MODIFIERS = {
    "A": 2,
    "C": -2,
}


STARPORT_TECH_MODIFIERS = {
    "A": 6,
    "B": 4,
    "C": 2,
    "X": -4,
}

SIZE_TECH_MODIFIERS = {
    0: 2,
    1: 2,
    2: 1,
    3: 1,
    4: 1,
}

HYDRO_TECH_MODIFIERS = {
    0: 1,
    9: 1,
    10: 2,
}

POP_TECH_MODIFIERS = {
    9: 1,
    10: 2,
    11: 3,
    12: 4,
}

GOV_TECH_MODIFIERS = {
    0: 1,
    5: 2,
    13: -4,
    15: -2,
}


def die_roll(dice, modifier=0, min=None, max=None):
    result = sum(random.randint(1, 6) for die in range(dice)) + modifier
    if min is not None and result < min:
        result = min
    if max is not None and result > max:
        result = max
    return result


def generate_world(name, coordinates):

    world = World()
    world.name = name
    world.coordinates = coordinates

    world.is_gas_giant = die_roll(2) >= 10

    world.size = die_roll(2, -2)

    # atmosphere

    world.atmosphere = die_roll(2, (-7 + world.size), 0, 15)

    # temperature

    temp_modifier = 0

    for (atmospheres, modifier) in TEMP_MODIFIERS:
        if world.atmosphere in atmospheres:
            temp_modifier += modifier

    world.temperature = die_roll(2, temp_modifier, 0, 15)

    # hydrographics

    hydro_modifier = world.size - 7
    if world.atmosphere in (0, 1, 10, 11, 12):
        hydro_modifier -= 4
    if world.atmosphere != 13:
        if world.temperature in (10, 11):
            hydro_modifier -= 2
        elif world.temperature >= 12:
            hydro_modifier -= 6

    world.hydrographics = die_roll(2, hydro_modifier, 0, 10)

    # population

    world.population = die_roll(2)
    low_pop_bound = math.pow(10, world.population)
    high_pop_bound = math.pow(10, world.population + 1)
    world.exact_population = int(
        random.randint(low_pop_bound, high_pop_bound)
    )

    # starport

    starport_modifier = world.population - 7
    starport_roll = die_roll(2, starport_modifier, 2, 12)
    world.starport = STARPORTS[starport_roll - 2]

    berthing_cost_modifier = \
        BERTHING_COST_MODIFIERS.setdefault(world.starport, 0)

    world.berthing_cost = die_roll(1) * berthing_cost_modifier

    # bases & facilities

    world.is_naval_base = False

    if world.starport in ("A", "B"):
        world.is_naval_base = die_roll(2) > 7

    world.is_scout_base = False

    if world.starport not in ("E", "X"):
        scout_base_modifier = 1 if world.starport == "D" else 0
        world.is_scout_base = die_roll(2, scout_base_modifier) > 7

    world.is_research_base = False

    if world.starport in ("A", "B", "C"):
        research_base_modifier = 0 if world.starport == "A" else -2
        world.is_research_base = die_roll(2, research_base_modifier) > 7

    world.is_tas = False

    if world.starport in ("A", "B", "C"):
        tas_modifier = TAS_MODIFIERS.setdefault(world.starport, 0)
        world.is_tas = die_roll(2, tas_modifier) > 7

    world.is_consulate = False

    if world.starport in ("A", "B", "C"):
        consulate_modifier = \
            CONSULATE_MODIFIERS.setdefault(world.starport, 0)

        world.is_consulate = die_roll(2, consulate_modifier) > 7

    world.is_pirate_base = False

    if world.starport not in ("A", "X"):
        pirate_base_modifier = 0
        if world.starport in ("B", "D", "E"):
            pirate_base_modifier = -4
        elif world.starport == "C":
            pirate_base_modifier = -2
        world.is_pirate_base = die_roll(2, pirate_base_modifier) > 7

    # government

    gov_modifier = world.population - 7
    world.government = die_roll(2, gov_modifier, 0, 13)

    # law level

    law_modifier = world.government - 7
    world.law_level = die_roll(2, law_modifier, 0, 10)

    # tech level

    tech_modifier = 0

    tech_modifier += STARPORT_TECH_MODIFIERS.setdefault(world.starport, 0)
    tech_modifier += SIZE_TECH_MODIFIERS.setdefault(world.size, 0)
    tech_modifier += HYDRO_TECH_MODIFIERS.setdefault(world.hydrographics, 0)
    tech_modifier += POP_TECH_MODIFIERS.setdefault(world.population, 0)
    tech_modifier += GOV_TECH_MODIFIERS.setdefault(world.government, 0)

    if world.atmosphere < 4 or world.atmosphere > 9:
        tech_modifier += 1

    if world.population > 0 or world.population < 6:
        tech_modifier += 1

    world.tech_level = die_roll(1, tech_modifier, 0, 16)

    travel_zone = 'Green'
    travel_zone_roll = die_roll(2)

    if world.starport == 'X' or travel_zone_roll == '2':
        travel_zone = 'Red'
    elif all((
        world.atmosphere > 9,
        world.government in (0, 7, 10),
        world.law_level == 0,
        world.law_level > 8,
    )) or travel_zone_roll in (11, 12):
        travel_zone = 'Amber'

    world.travel_zone = travel_zone

    return world


def generate_subsector(names_file):

    names = []

    with open(names_file) as fp:
        names = set([n for n in [
            n.strip() for n in fp.readlines()] if n])
    if len(names) < 80:
        raise RuntimeError(
            "You must have at least 80 names in the list")
    names = list(names)
    subsector_name = random.choice(names)
    subsector = Subsector(name=subsector_name)
    random.shuffle(names)

    worlds = []
    for i in range(1, 11):
        for j in range(1, 9):
            if die_roll(2) > 7:
                name = names.pop()
                world = generate_world(name, (j, i))
                world.subsector = subsector
                worlds.append(world)

    return subsector
