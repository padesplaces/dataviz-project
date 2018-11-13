from dataviz.networkapi.models import *
from django.http import *
from django.views.decorators.csrf import csrf_exempt
import json

import sys
sys.path.append('../')
from data_analysis.network import compute_network

@csrf_exempt 
def network(request):
    if request.method == 'POST':
        params = json.loads(request.body)
        network = compute_network(params)
        return HttpResponse(json.dumps(network), content_type='application/json')
    else:
        return HttpResponseServerError("Malformed data!")