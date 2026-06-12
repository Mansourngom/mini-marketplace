from rest_framework import serializers
from .models import Annonce, Categorie

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class AnnonceSerializer(serializers.ModelSerializer):
    vendeur_nom = serializers.CharField(source='vendeur.username', read_only=True)
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)

    class Meta:
        model = Annonce
        fields = '__all__'
        read_only_fields = ['vendeur', 'date_publication']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data.get('image'):
            data['image'] = data['image'].strip()
        return data