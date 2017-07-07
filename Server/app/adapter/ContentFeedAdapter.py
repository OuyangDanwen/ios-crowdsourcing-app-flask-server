from flask import Flask, render_template, request
import requests


class ContentFeedAdapter:
    def __init__(self, query, max_results, location):
        self.query = query
        self.max_results = max_results
        self.location = location


class GoogleContentFeedAdapter(ContentFeedAdapter):
    url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyB85z_G1Uml_RjlV0VpHek-88WslFgd2tE&cx=011709361973084828043:lu0egzudwnk"

    def construct_div(self, item):
        title = '<h3>{0}</h3>'.format(item["title"].encode('utf-8'))
        url = '<a href="{0}">{1}</a>'.format(item["formattedUrl"].encode('utf-8'), title)
        snippet = '<p>{0}</p>'.format(item["htmlSnippet"].encode('utf-8'))
        div = "<div>{0}{1}</div>".format(url, snippet)
        return div

    def send_request(self):
        r = requests.get("{0}&num={1}&q={2}".format(self.url, self.max_results, self.query))
        return r.json()

    def render_html(self):
        data = self.send_request()
        divs = []
        for item in data["items"]:
            div = self.construct_div(item)
            divs.append(div)
        return divs


class WeatherContentFeedAdapter(ContentFeedAdapter):
    url = 'http://api.openweathermap.org/data/2.5/forecast/daily?cnt=3&appid=90e162ad04a530937bc6145440d2f5a7&units=metric'
    def weatherFeed(self):
        req = requests.get("{0}&lat={1}&lon={2}".format(self.url, self.location[0], self.location[1]))
        json_object = req.json()
        res_list = []
        for day in json_object['list']:
            res_list.append(self.construct_div(day))
        div = '<div id="design-cast">{0}{1}{2}</div>'.format(res_list[0], res_list[1], res_list[2])
        return div

    def construct_div(self, day):
        temp = '<div class="name" style="display: inline;">Max :{0} <br /> Min :{1} </div>'.format(day['temp']['max'], day['temp']['min'])
        # img = '<img src="/static/{0}.png" class="img-responsive img-thumbnail" alt="Responsive image" style="width: 100%; display: block;" />'.format(day['weather'][0]['main'])
        name = '<div class="member" style=" display: inline-block;width: 150px;height: 200px;vertical-align: top;text-align:center;">{0}</div>'.format(temp)
        return name