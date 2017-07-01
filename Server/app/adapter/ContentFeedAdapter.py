class ContentFeedAdapter:
    def __init__(self, query, max_results, location):
        self.query = query
        self.max_results = max_results
        self.location = location


class GoogleContentFeedAdapter(ContentFeedAdapter):
    pass

if __name__ == '__main__':
    print "working"