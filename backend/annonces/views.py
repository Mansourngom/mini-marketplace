from rest_framework import generics, permissions, filters
from .models import Annonce, Categorie
from .serializers import AnnonceSerializer, CategorieSerializer

class AnnonceListView(generics.ListAPIView):
    queryset = Annonce.objects.filter(active=True)
    serializer_class = AnnonceSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['titre', 'description', 'localisation']

    def get_queryset(self):
        queryset = Annonce.objects.filter(active=True)
        categorie = self.request.query_params.get('categorie')
        localisation = self.request.query_params.get('localisation')
        if categorie:
            queryset = queryset.filter(categorie__nom__icontains=categorie)
        if localisation:
            queryset = queryset.filter(localisation__icontains=localisation)
        return queryset

class AnnonceCreateView(generics.CreateAPIView):
    serializer_class = AnnonceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(vendeur=self.request.user)

class AnnonceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Annonce.objects.all()
    serializer_class = AnnonceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class MesAnnoncesView(generics.ListAPIView):
    serializer_class = AnnonceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Annonce.objects.filter(vendeur=self.request.user)

class CategorieListView(generics.ListAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [permissions.AllowAny]