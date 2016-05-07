import math


from PIL import Image, ImageDraw, ImageChops

EDGE_LENGTH = 30
WORLD_RADIUS = 5


def draw_map(fp, worlds):

    hex_width = round(math.sqrt(3) * EDGE_LENGTH)

    image_size = (hex_width * 9, hex_width * 11)
    image = Image.new('RGB', image_size, 'white')

    draw = ImageDraw.Draw(image)
    hex_generator = HexGenerator(EDGE_LENGTH)

    for row in range(20):
        for col in range(1, 5):
            hex = list(hex_generator(row, col))
            draw.polygon(hex, outline='black', fill='white')

    world_dict = {w.coordinates: w for w in worlds}

    for row in range(1, 11):
        # this needs to be fixed a bit to the right
        # doesn't work with larger map sizes
        x = ((EDGE_LENGTH * 1.5) * 2) + 1
        for col in range(1, 9):
            # height one cell higher for odd columns
            y = hex_width * row
            if col % 2 == 1:
                y -= (hex_width / 2)
            text = "%02.d%02.d" % (col, row)
            # text/world positions should be proportional to hex size
            draw.text((x, y-20), text, 8)
            world = world_dict.get((col, row))
            if world is not None:
                draw.text((x+10, y-10), world.starport, 12)
                draw.ellipse((x+12-WORLD_RADIUS,
                              y+10-WORLD_RADIUS,
                              x+12+WORLD_RADIUS,
                              y+10+WORLD_RADIUS), fill='black')
            x += (EDGE_LENGTH * 1.5)

    # trim excess whitespace

    bg = Image.new(image.mode, image.size, image.getpixel((0, 0)))
    diff = ImageChops.difference(image, bg)
    diff2 = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff2.getbbox()

    if bbox:
        image = image.crop(bbox)

    image.save(fp, 'PNG')


class HexGenerator(object):

    def __init__(self, edge_length):
        self.edge_length = edge_length
        self.col_width = self.edge_length * 3
        self.row_height = math.sin(math.pi / 3) * self.edge_length

    def __call__(self, row, col):
        x = (col + 0.5 * (row % 2)) * self.col_width
        y = row * self.row_height
        for angle in range(0, 360, 60):
            r_angle = math.radians(angle)
            x += math.cos(r_angle) * self.edge_length
            y += math.sin(r_angle) * self.edge_length
            yield x, y
