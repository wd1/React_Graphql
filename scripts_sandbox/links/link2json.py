import json
import requests
from lxml import html
import datetime
from PIL import Image

BASE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
}


def fetch_link(url):
    print url
    content = requests.get(url, headers=BASE_HEADERS).content
    tree = html.fromstring(content)
    title = tree.xpath('//h1[@class="headline__title"]/text()')[0].strip()
    image = tree.xpath('//div[contains(@class, "entry__body")]/div[@id="photo-strip"]/following-sibling::div[1]//a/@href')[0]
    text = tree.xpath('//div[contains(@class, "entry__body")]')[0].text_content()[:200].strip()

    date = tree.xpath('//span[contains(@class, "timestamp__date--published")]/text()')[0]
    date = date.split(' ')[0]
    date = datetime.datetime.strptime(date, '%m/%d/%Y').isoformat()

    return {'url': url,
            'title': title,
            'image': image,
            'text': text,
            'date': date,
            }


def get_image(item):
    url = item['image']
    response = requests.get(url, stream=True)
    response.raw.decode_content = True  # to decode gzip if necessary
    image = Image.open(response.raw)

    base_width = 330
    ratio = base_width / float(image.size[0])
    new_size = [int(i * ratio) for i in image.size]
    image = image.resize(new_size, resample=Image.LANCZOS)

    image_file = url.split('/')[-1].split('.')[0] + '.jpg'
    image.save(image_file, "JPEG")
    item['imageFile'] = image_file


def dump_json(json_data, output_file):
    with open(output_file, 'w') as f:
        f.write(json.dumps(json_data,
                           sort_keys=True,
                           indent=4,
                           separators=(',', ': '),
                           ))


def get_links():
    input_file = 'links.txt'
    output_file = 'links.json'
    with open(input_file) as f:
        links = [line.strip() for line in f]
        links = filter(None, links)

    json_data = [fetch_link(link) for link in links]
    dump_json(json_data, output_file)


def get_images():
    json_file = 'links.json'
    with open(json_file) as f:
        links = json.loads(f.read())
    for link in links:
        get_image(link)
    dump_json(links, json_file)


if __name__ == '__main__':
    #get_links()
    get_images()
