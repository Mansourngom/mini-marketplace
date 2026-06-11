from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Annonce

User = get_user_model()

ANNONCE_DATA = {
    'titre':       'iPhone 13 Pro Max',
    'description': 'Téléphone en excellent état, peu utilisé, avec boîte et chargeur.',
    'prix':        450000,
    'devise':      'FCFA',
    'categorie':   'electronique',
    'ville':       'Dakar',
    'quartier':    'Plateau',
}

def creer_vendeur(email='vendeur@test.com'):
    return User.objects.create_user(email=email, password='Test1234!', role='vendeur', first_name='Amadou')

def creer_acheteur():
    return User.objects.create_user(email='acheteur@test.com', password='Test1234!', role='acheteur')


class AnnonceModelTest(TestCase):

    def test_creation_annonce(self):
        vendeur = creer_vendeur()
        annonce = Annonce.objects.create(vendeur=vendeur, **ANNONCE_DATA)
        self.assertEqual(annonce.statut, 'active')
        self.assertEqual(annonce.vues, 0)
        self.assertIsNone(annonce.image_principale)

    def test_ordering_par_date(self):
        vendeur = creer_vendeur()
        Annonce.objects.create(vendeur=vendeur, **{**ANNONCE_DATA, 'titre': 'Annonce 1'})
        a2 = Annonce.objects.create(vendeur=vendeur, **{**ANNONCE_DATA, 'titre': 'Annonce 2'})
        self.assertEqual(Annonce.objects.first(), a2)


class AnnonceAPITest(TestCase):

    def setUp(self):
        self.client   = APIClient()
        self.vendeur  = creer_vendeur()
        self.autre    = User.objects.create_user(email='autre@test.com', password='Test1234!', role='vendeur')
        self.acheteur = creer_acheteur()

    def auth(self, user):
        self.client.force_authenticate(user=user)

    def test_liste_publique(self):
        Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        res = self.client.get('/api/annonces/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['total'], 1)

    def test_filtre_categorie(self):
        Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        Annonce.objects.create(vendeur=self.vendeur, **{**ANNONCE_DATA, 'categorie': 'services'})
        res = self.client.get('/api/annonces/?categorie=electronique')
        self.assertEqual(res.data['total'], 1)

    def test_recherche(self):
        Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        Annonce.objects.create(vendeur=self.vendeur, **{**ANNONCE_DATA, 'titre': 'Voiture Toyota Corolla'})
        res = self.client.get('/api/annonces/?recherche=iPhone')
        self.assertEqual(res.data['total'], 1)

    def test_detail_incremente_vues(self):
        annonce = Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        self.client.get(f'/api/annonces/{annonce.pk}/')
        annonce.refresh_from_db()
        self.assertEqual(annonce.vues, 1)

    def test_creer_vendeur_ok(self):
        self.auth(self.vendeur)
        res = self.client.post('/api/annonces/', ANNONCE_DATA, format='multipart')
        self.assertEqual(res.status_code, 201)

    def test_creer_acheteur_interdit(self):
        self.auth(self.acheteur)
        res = self.client.post('/api/annonces/', ANNONCE_DATA, format='multipart')
        self.assertEqual(res.status_code, 403)

    def test_modifier_proprietaire(self):
        self.auth(self.vendeur)
        annonce = Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        res = self.client.put(f'/api/annonces/{annonce.pk}/', {'titre': 'Nouveau titre OK'}, format='multipart')
        self.assertEqual(res.status_code, 200)

    def test_modifier_autre_interdit(self):
        annonce = Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        self.auth(self.autre)
        res = self.client.put(f'/api/annonces/{annonce.pk}/', {'titre': 'Hack'}, format='multipart')
        self.assertEqual(res.status_code, 403)

    def test_supprimer_proprietaire(self):
        self.auth(self.vendeur)
        annonce = Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        res = self.client.delete(f'/api/annonces/{annonce.pk}/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Annonce.objects.count(), 0)

    def test_mes_annonces(self):
        self.auth(self.vendeur)
        Annonce.objects.create(vendeur=self.vendeur, **ANNONCE_DATA)
        Annonce.objects.create(vendeur=self.autre, **ANNONCE_DATA)
        res = self.client.get('/api/annonces/mes-annonces/')
        self.assertEqual(res.data['total'], 1)