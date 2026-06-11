from django.db import models
from users.models import User

class Categorie(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom

class Annonce(models.Model):
    titre = models.CharField(max_length=200)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='annonces/', blank=True, null=True)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True)
    localisation = models.CharField(max_length=100)
    vendeur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='annonces')
    date_publication = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.titre

    class Meta:
        ordering = ['-date_publication']