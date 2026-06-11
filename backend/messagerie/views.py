from rest_framework import generics, permissions
from .models import Message
from .serializers import MessageSerializer

class EnvoyerMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(expediteur=self.request.user)

class MessagesRecusView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(destinataire=self.request.user)

class MessagesEnvoyesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(expediteur=self.request.user)