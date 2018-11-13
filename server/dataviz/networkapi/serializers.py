from dataviz.networkapi.models import *
from rest_framework import serializers

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = "id", "name"

class EdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edge
        fields = "id", "node1", "node2", "weight"

