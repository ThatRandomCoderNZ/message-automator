from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index.as_view(), name='tasks' ),
]
