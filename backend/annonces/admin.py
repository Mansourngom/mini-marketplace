from django.contrib import admin
from .models import Categorie, Annonce

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom')

@admin.register(Annonce)
class AnnonceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'titre',
        'prix',
        'categorie',
        'localisation',
        'vendeur',
        'active',
        'date_publication'
    )
    list_filter = ('active', 'categorie')
    search_fields = ('titre', 'description', 'localisation')