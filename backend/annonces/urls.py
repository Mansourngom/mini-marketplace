from django.urls import path
from .views import (
    AnnonceListView, AnnonceCreateView,
    AnnonceDetailView, MesAnnoncesView, CategorieListView
)

urlpatterns = [
    path('', AnnonceListView.as_view(), name='annonces-list'),
    path('creer/', AnnonceCreateView.as_view(), name='annonce-create'),
    path('<int:pk>/', AnnonceDetailView.as_view(), name='annonce-detail'),
    path('mes-annonces/', MesAnnoncesView.as_view(), name='mes-annonces'),
    path('categories/', CategorieListView.as_view(), name='categories'),
]