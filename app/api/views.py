from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

class SendMessagesView(APIView):
    def post(self, request):
        print("Accessed new API route")
        query = {'key': '17eab8f4074305e411446df3a0d0acc9485f0fdc',
                 'phone':'642108672121',
                 'message':'message-to-myself'}
        response = requests.get("https://textfoo.com/api/send", params=query)
        print(response)
        return Response({"status": "success", "data": ["placeholder"]}, status=status.HTTP_200_OK)