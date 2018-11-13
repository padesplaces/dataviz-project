from dataviz.networkapi.models import *

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets

from dataviz.networkapi.serializers import *


class NodeList(generics.ListCreateAPIView):
	queryset = Node.objects.all()
	serializer_class = NodeSerializer



class EdgeList(generics.ListCreateAPIView):
	queryset = Edge.objects.all()
	serializer_class = EdgeSerializer

