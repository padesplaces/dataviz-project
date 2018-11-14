from random import randint
TIME_START = "time_start"
TIME_END = "time_start"
KEYWORDS = "time_start"

def compute_network(params):
    """
    params is a dict with:
        - time_start
        - time_end
        - keywords
    returns a dict with two arrays:
        - nodes
        - edges
    """
    network = {'nodes': [], 'edges': []}

    if TIME_START in params:
        tStart = params["time_start"]
    if TIME_END in params:    
        tEnd = params["time_end"]
    if KEYWORDS in params:
        keywords = params["keywords"]

    # TODO: use params to filter data

    # TODO: compute network based on actual analyzed data
    
    for i in range(0, 10):
        network['nodes'].append({'id': i})
        network['edges'].append({'source': i, 'target': (i+1)%10, 'weight': randint(0, 10)})
    return network