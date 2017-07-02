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
