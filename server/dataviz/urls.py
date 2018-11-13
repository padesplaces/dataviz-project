from django.urls import path, include
from dataviz.networkapi import views

urlpatterns = [
    path('network', views.network, name='index'),
]
