from flask import Flask, render_template, request
import requests


class ContentFeedAdapter:
    def __init__(self, query, max_results, location):
        self.query = query
        self.max_results = max_results
        self.location = location


class GoogleContentFeedAdapter(ContentFeedAdapter):
    url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyB85z_G1Uml_RjlV0VpHek-88WslFgd2tE&cx=011709361973084828043:lu0egzudwnk"

    def construct_divs(self, item):
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
            div = self.construct_divs(item)
            divs.append(div)
        return divs


class WeatherContentFeedAdapter(ContentFeedAdapter):
    def weatherFeed(self):
        day_max = []
        day_min = []
        day_type = []
        # change this
        # lat = self.location[1]
        # lon = self.location[0]
        lat = 22.22
        lon = 11.11
        req = requests.get('http://api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=3&appid=90e162ad04a530937bc6145440d2f5a7')
        json_object = req.json()
        # jsonObj = json.loads(json_object)
        for i in range(0,3):
            temp_max = float(json_object['list'][i]['temp']['max'])
            temp_min = float(json_object['list'][i]['temp']['min'])
            day_max.append(format(((temp_max - 273.15) * 1.8 + 32),'.2f'))
            day_min.append(format(((temp_min - 273.15) * 1.8 + 32),'.2f'))
            day_type.append((json_object['list'][i]['weather'][0]['main']))
            # fix this

        html = """<div id="design-cast">
        <div class="member" style=" display: inline-block;width: 150px;height: 200px;vertical-align: top;text-align:center;">
            <img src="/static/{0}.png" class="img-responsive img-thumbnail" alt="Responsive image" style="width: 100%; display: block;" />
            <div class="name" style="display: inline;">Max :{1}
                <br />Min :{2}</div>
        </div>
        <div class="member" style=" display: inline-block;width: 150px;height: 200px;vertical-align: top;text-align:center;">
            <img src="/static/{3}.png" class="img-responsive img-thumbnail" alt="Responsive image" style="width: 100%; display: block;"/>
            <div class="name" style="display: inline;">Max :{4}
                <br />Min :{5}</div>
        </div>
        <div class="member" style=" display: inline-block;width: 150px;height: 200px;vertical-align: top;text-align:center;">
            <img src="/static/{6}.png" class="img-responsive img-thumbnail" alt="Responsive image" style="width: 100%; display: block;" />
            <div class="name" style="display: inline;">Max :{7}
                <br />Min :{8}</div>
        </div>
        </div"""
        new_html = html.format(day_type[0], day_max[0], day_min[0],
            day_type[1], day_max[1], day_min[1],
            day_type[2], day_max[2], day_min[2])
        # return render_template('/home/ec2-user/Server/new-src/Server/app/adapter/templates/temperature.html', maxList=day_max, minList=day_min, dayType=day_type)
        return new_html
