from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json


class SendMessagesView(APIView):
    def post(self, request):
        print("Accessed new API route")

        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        data = body['data']
        for message in data:
            query = {'key': '17eab8f4074305e411446df3a0d0acc9485f0fdc',
                     'phone': message['number'].replace("0", "64", 1),
                     'message': message['message']}
            response = requests.get("https://textfoo.com/api/send", params=query)

        return Response({"status": "success", "data": ["placeholder"]}, status=status.HTTP_200_OK)