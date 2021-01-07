from django.urls import path
from .views import *


urlpatterns = [
    path('room', RoomView.as_view(), name='all_rooms_url'),
    path('create-room', CreateRoomView.as_view(), name='create_room_url'),
]