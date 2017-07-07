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
    url = 'http://api.openweathermap.org/data/2.5/forecast/daily?cnt=3&appid=90e162ad04a530937bc6145440d2f5a7&units=metric'
    def weatherFeed(self):
        day_max = []
        day_min = []
        day_type = []
        # lat = request.json.get('lat',None)
        # lon = request.json.get('lon',None)
        lat = 49.15
        lon = 139.45
        # req = requests.post('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lon+'&cnt=3&appid=90e162ad04a530937bc6145440d2f5a7')
        req = requests.get("{0}&lat={1}&lon={2}".format(self.url, lat, lon))
        json_object = req.json()
        for day in json_object['list']:
            day_min = day['temp']['min']
            day_max = day['temp']['max']
            temp_max = float(json_object['list'][i]['temp']['max'])
            temp_min = float(json_object['list'][i]['temp']['min'])
            day_max.append(format(((temp_max - 273.15) * 1.8 + 32),'.2f'))
            day_min.append(format(((temp_min - 273.15) * 1.8 + 32),'.2f'))
            day_type.append((json_object['list'][i]['weather'][0]['main']))
        new_html = self.constructDiv(day_type[0], day_max[0], day_min[0], day_type[1], day_max[1], day_min[1], day_type[2], day_max[2], day_min[2])
        return new_html

    def constructDiv(self,day_type1, day_max1, day_min1,day_type2, day_max2, day_min2, day_type3, day_max3, day_min3):
        day1Name = '<div class="name" style="display: inline;">Max :{0} <br /> Min :{1} </div>'.format(day_max1 , day_min1)
        day1Img = '<img src="/static/{0}.png" class="img-responsive img-thumbnail" alt="Responsive image" style="width: 100%; display: block;" />'.format(day_type1)
        day1Div = '<div class="member" style=" display: inline-block;width: 150px;height: 200px;vertical-align: top;text-align:center;">{0}{1}</div>'.format(day1Name,day1Img)

        day2Name = '<div class="name" style="display: inline;">Max :{0} <br /> Min :{1} </div>'.format(day_max2 , day_min2)
        day2Img = '<img src="/static/{0}.png" class="img-responsive img-thumbnail" alt="Responsive image" style="width: 100%; display: block;" />'.format(day_type2)
        day2Div = '<div class="member" style=" display: inline-block;width: 150px;height: 200px;vertical-align: top;text-align:center;">{0}{1}</div>'.format(day2Name,day2Img)

        day3Name = '<div class="name" style="display: inline;">Max :{0} <br /> Min :{1} </div>'.format(day_max3 , day_min3)
        day3Img = '<img src="/static/{0}.png" class="img-responsive img-thumbnail" alt="Responsive image" style="width: 100%; display: block;" />'.format(day_type3)
        day3Div = '<div class="member" style=" display: inline-block;width: 150px;height: 200px;vertical-align: top;text-align:center;">{0}{1}</div>'.format(day3Name,day3Img)
        div = '<div id="design-cast">{0}{1}{2}</div>'.format(day1Div,day2Div,day3Div)
        return div