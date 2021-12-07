from django.urls import path
from .views import SendMessagesView

urlpatterns = [
    path('send-messages/', SendMessagesView.as_view())
]