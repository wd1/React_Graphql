#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import requests
from lxml import html
import datetime
from PIL import Image
from os import path
from io import BytesIO

PATH = path.dirname(path.realpath(__file__))
BASE_PATH = path.dirname(path.dirname(PATH))
BLACK_LIST_FILE = path.join(PATH, 'blacklist.txt')
OUTPUT_PATH = path.join(BASE_PATH, 'src', 'public', 'stories-gallery')
OUTPUT_FILE = path.join(OUTPUT_PATH, 'links.json')

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
    print('Fetching link:', url)
    content = requests.get(url, headers=BASE_HEADERS).content
    tree = html.fromstring(content)
    title = tree.xpath('//h1[@class="headline__title"]/text()')[0].strip()
    if (len(tree.xpath('//img[@class="image__src"]/@src')) > 0):
        image = tree.xpath('//img[@class="image__src"]/@src')[0]
    else:
        image = tree.xpath('//div[contains(@class, "entry__body")]//img/@src')[0]

    image = image.replace('/scalefit_820_noupscale', '')
    image = image.replace('-thumb', '')

    text = tree.xpath('//div[contains(@class, "entry__body")]')[0].text_content()[:200].strip()

    date = tree.xpath('//span[contains(@class, "timestamp__date--published")]/text()')[0]
    date = date.split(' ')[0]
    date = datetime.datetime.strptime(date, '%m/%d/%Y').isoformat()

    item = {'url': url,
            'title': title,
            'image': image,
            'text': text,
            'date': date,
            }

    item['imageFile'] = get_image(item)
    return item


def get_image(item):
    url = item['image']
    print('Fetching image:', url)
    response = requests.get(url, stream=True)
    response.raw.decode_content = True  # to decode gzip if necessary
    image = BytesIO(response.raw.read())
    image = Image.open(image)

    base_width = 330
    ratio = base_width / float(image.size[0])
    new_size = [int(i * ratio) for i in image.size]

    image = image.resize(new_size, resample=Image.ANTIALIAS)
    image_filename = url.split('/')[-1].split('.')[0] + '.jpg'
    image_full_filename = path.join(OUTPUT_PATH, image_filename)
    image.save(image_full_filename, 'JPEG')
    return image_filename


def fetch_links():
    with open(BLACK_LIST_FILE) as f:
        black_list = {line.strip() for line in f}

    url = 'http://www.huffingtonpost.com/author/jahandad-memarian-880'
    content = requests.get(url, headers=BASE_HEADERS).content
    tree = html.fromstring(content)
    articles = str(tree.xpath('//script[@id="recirc-bootstrap"]/text()')[0])
    articles = json.loads(articles)

    links = [article['url'] for article in articles]
    links = [link for link in links if link not in black_list]

    data = [fetch_link(link) for link in links]
    with open(OUTPUT_FILE, 'w') as f:
        f.write(json.dumps(data))


if __name__ == '__main__':
    fetch_links()
