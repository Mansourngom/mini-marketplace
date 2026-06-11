from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from .models import MessageContact, Notification

User = get_user_model()


def creer_vendeur(email='vendeur@test.sn'):
    u = User.objects.create_user(email=email, username=email, password='pass123')
    if hasattr(u, 'role'):
        u.role = 'vendeur'; u.save()
    return u

def creer_acheteur(email='acheteur@test.sn'):
    u = User.objects.create_user(email=email, username=email, password='pass123')
    if hasattr(u, 'role'):
        u.role = 'acheteur'; u.save()
    return u

def creer_annonce(vendeur):
    from annonces.models import Annonce
    return Annonce.objects.create(
        vendeur=vendeur, titre='Samsung A54',
        prix=120000, localisation='Dakar', est_active=True,
    )


class TestMessages(TestCase):
    def setUp(self):
        self.client   = APIClient()
        self.vendeur  = creer_vendeur()
        self.acheteur = creer_acheteur()
        self.annonce  = creer_annonce(self.vendeur)

    def test_acheteur_envoie_message(self):
        self.client.force_authenticate(user=self.acheteur)
        r = self.client.post(reverse('message-envoyer'), {
            'annonce': self.annonce.id,
            'sujet': 'Disponible ?',
            'contenu': 'Je suis intéressé.',
        })
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MessageContact.objects.count(), 1)

    def test_notification_creee_automatiquement(self):
        self.client.force_authenticate(user=self.acheteur)
        self.client.post(reverse('message-envoyer'), {
            'annonce': self.annonce.id,
            'sujet': 'Test', 'contenu': 'Contenu',
        })
        self.assertEqual(
            Notification.objects.filter(destinataire=self.vendeur).count(), 1
        )

    def test_vendeur_liste_messages_recus(self):
        MessageContact.objects.create(
            acheteur=self.acheteur, vendeur=self.vendeur,
            annonce=self.annonce, sujet='Q', contenu='?',
        )
        self.client.force_authenticate(user=self.vendeur)
        r = self.client.get(reverse('messages-recus-list'))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 1)

    def test_lecture_marque_lu(self):
        msg = MessageContact.objects.create(
            acheteur=self.acheteur, vendeur=self.vendeur,
            annonce=self.annonce, sujet='Q', contenu='?',
        )
        self.client.force_authenticate(user=self.vendeur)
        self.client.get(reverse('message-recus-detail', kwargs={'pk': msg.pk}))
        msg.refresh_from_db()
        self.assertEqual(msg.statut, MessageContact.Statut.LU)

    def test_stats_messages(self):
        MessageContact.objects.create(
            acheteur=self.acheteur, vendeur=self.vendeur,
            annonce=self.annonce, sujet='Q', contenu='?',
        )
        self.client.force_authenticate(user=self.vendeur)
        r = self.client.get(reverse('messages-stats'))
        self.assertEqual(r.data['non_lus'], 1)


class TestNotifications(TestCase):
    def setUp(self):
        self.client  = APIClient()
        self.vendeur = creer_vendeur()
        self.notif   = Notification.objects.create(
            destinataire=self.vendeur,
            type_notif=Notification.TypeNotif.NOUVEAU_MESSAGE,
            titre='Nouveau message', message='Test',
        )

    def test_liste_notifications(self):
        self.client.force_authenticate(user=self.vendeur)
        r = self.client.get(reverse('notifications-list'))
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_compteur_non_lues(self):
        self.client.force_authenticate(user=self.vendeur)
        r = self.client.get(reverse('notifications-compteur'))
        self.assertEqual(r.data['non_lues'], 1)

    def test_marquer_lue(self):
        self.client.force_authenticate(user=self.vendeur)
        self.client.patch(reverse('notification-lire', kwargs={'pk': self.notif.pk}))
        self.notif.refresh_from_db()
        self.assertTrue(self.notif.est_lue)


class TestImages(TestCase):
    def setUp(self):
        self.client  = APIClient()
        self.vendeur = creer_vendeur()
        self.annonce = creer_annonce(self.vendeur)

    @patch('cloudinary.uploader.upload')
    def test_upload_image(self, mock_upload):
        mock_upload.return_value = {
            'public_id': 'marketplace/annonces/1/test',
            'secure_url': 'https://res.cloudinary.com/test.jpg',
            'width': 800, 'height': 600, 'format': 'jpg',
        }
        self.client.force_authenticate(user=self.vendeur)
        from io import BytesIO
        from PIL import Image as PILImage
        from django.core.files.uploadedfile import SimpleUploadedFile
        buf = BytesIO()
        PILImage.new('RGB', (100, 100), color='blue').save(buf, format='JPEG')
        buf.seek(0)
        fichier = SimpleUploadedFile('test.jpg', buf.read(), content_type='image/jpeg')
        r = self.client.post(reverse('image-upload'), {
            'image': fichier, 'annonce_id': self.annonce.id,
        }, format='multipart')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)