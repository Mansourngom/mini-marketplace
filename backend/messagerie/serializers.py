from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    expediteur_nom = serializers.CharField(source='expediteur.username', read_only=True)
    destinataire_nom = serializers.CharField(source='destinataire.username', read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['expediteur', 'date_envoi']