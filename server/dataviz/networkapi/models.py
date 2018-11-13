from django.db import models

class Node(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

class Edge(models.Model):
    id = models.AutoField(primary_key=True)
    node1 = models.ForeignKey(Node, models.CASCADE, blank = False, related_name='node_one')
    node2 = models.ForeignKey(Node, models.CASCADE, blank = False, related_name='node_two')
    weight = models.IntegerField()
