from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('vendeur', 'Vendeur'),
        ('acheteur', 'Acheteur'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='acheteur')
    telephone = models.CharField(max_length=20, blank=True)
    ville = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username