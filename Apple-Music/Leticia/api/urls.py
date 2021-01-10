from django.urls import path
from .views import *


urlpatterns = [
    path('room', RoomView.as_view(), name='all_rooms_url'),
    path('create-room', CreateRoomView.as_view(), name='create_room_url'),
    path('get-room', GetRoom.as_view(), name='get_room_url'),
    path('join-room', JoinRoom.as_view(), name='join_room_url'),
    path('user-in-room', UserInRoom.as_view(), name='user_in_room_url'),
    path('leave-room', LeaveRoom.as_view(), name='leave_room_url'),
]