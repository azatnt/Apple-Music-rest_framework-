from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
