from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
import cloudinary.uploader
import logging

from .models import Message, ImageAnnonce, Notification
from .serializers import (
    MessageSerializer,
    MessageDetailSerializer,
    StatutUpdateSerializer,
    ReponseCreateSerializer,
    ImageAnnonceSerializer,
    UploadImageSerializer,
    NotificationSerializer,
)

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════
# PERMISSIONS PERSONNALISÉES
# ═══════════════════════════════════════════════════════════════

class EstAcheteur(BasePermission):
    """Seuls les utilisateurs avec role='acheteur' peuvent envoyer."""
    message = "Seuls les acheteurs peuvent envoyer des messages."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'acheteur'
        )


class EstDestinataireMessage(BasePermission):
    """Seul le destinataire du message peut y accéder."""
    message = "Vous n'êtes pas le destinataire de ce message."

    def has_object_permission(self, request, view, obj):
        return obj.destinataire == request.user


class EstParticipantMessage(BasePermission):
    """Expéditeur OU destinataire peut accéder au message."""
    message = "Accès non autorisé à ce message."

    def has_object_permission(self, request, view, obj):
        return (
            obj.destinataire == request.user or
            obj.expediteur == request.user
        )


# ═══════════════════════════════════════════════════════════════
# NOTIFICATIONS — fonctions internes (appelées automatiquement)
# ═══════════════════════════════════════════════════════════════

def _creer_notif_nouveau_message(message):
    """
    Appelée après qu'un acheteur envoie un message.
    Crée une notification pour le destinataire (vendeur).
    """
    try:
        Notification.objects.create(
            destinataire=message.destinataire,
            type_notif=Notification.TypeNotif.NOUVEAU_MESSAGE,
            titre=f"Nouveau message : {message.annonce.titre}",
            message=(
                f"{message.expediteur.get_full_name() or message.expediteur.email} "
                f"vous a contacté pour l'annonce "
                f"« {message.annonce.titre} ».\n"
                f"Sujet : {message.sujet}"
            ),
            annonce_id=message.annonce.id,
            message_id=message.id,
        )
    except Exception as e:
        logger.error(f"Erreur création notification : {e}")


def _creer_notif_reponse(message, auteur):
    """
    Appelée après qu'un vendeur répond.
    Crée une notification pour l'expéditeur (acheteur).
    """
    try:
        Notification.objects.create(
            destinataire=message.expediteur,
            type_notif=Notification.TypeNotif.REPONSE_VENDEUR,
            titre="Le vendeur a répondu à votre message",
            message=(
                f"{auteur.get_full_name() or auteur.email} "
                f"a répondu concernant l'annonce "
                f"« {message.annonce.titre} »."
            ),
            annonce_id=message.annonce.id,
            message_id=message.id,
        )
    except Exception as e:
        logger.error(f"Erreur création notification réponse : {e}")


# ═══════════════════════════════════════════════════════════════
# VUES — MESSAGES
# ═══════════════════════════════════════════════════════════════

class EnvoyerMessageView(generics.CreateAPIView):
    """
    POST /api/messagerie/messages/envoyer/
    Acheteur envoie un message à un vendeur.
    Crée automatiquement une notification pour le vendeur.
    """
    serializer_class   = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        message = serializer.save(expediteur=self.request.user)
        # Notification automatique au destinataire
        _creer_notif_nouveau_message(message)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'success': True,
                'message': 'Message envoyé avec succès.',
                'data': serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class MessagesEnvoyesView(generics.ListAPIView):
    """
    GET /api/messagerie/messages/envoyes/
    Acheteur consulte ses messages envoyés.
    """
    serializer_class   = MessageDetailSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [OrderingFilter]
    ordering           = ['-created_at']

    def get_queryset(self):
        return Message.objects.filter(
            expediteur=self.request.user
        ).select_related('destinataire', 'annonce').prefetch_related('reponses')


class MessagesRecusView(generics.ListAPIView):
    """
    GET /api/messagerie/messages/recus/
    Vendeur liste ses messages reçus.
    Filtres disponibles :
      ?statut=non_lu|lu|archive
      ?annonce=<id>
      ?ordering=-created_at
    """
    serializer_class   = MessageDetailSerializer
    permission_classes = [IsAuthenticated]
    filter_backends    = [DjangoFilterBackend, OrderingFilter]
    filterset_fields   = ['statut', 'annonce']
    ordering_fields    = ['created_at', 'statut']
    ordering           = ['-created_at']

    def get_queryset(self):
        return Message.objects.filter(
            destinataire=self.request.user
        ).select_related('expediteur', 'annonce').prefetch_related('reponses')


class MessageRecuDetailView(generics.RetrieveAPIView):
    """
    GET /api/messagerie/messages/recus/<id>/
    Vendeur lit un message.
    → Marqué automatiquement comme 'lu' à la consultation.
    """
    serializer_class   = MessageDetailSerializer
    permission_classes = [IsAuthenticated, EstDestinataireMessage]

    def get_queryset(self):
        return Message.objects.filter(
            destinataire=self.request.user
        ).select_related('expediteur', 'annonce').prefetch_related('reponses')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Marquage automatique comme lu
        if instance.statut == 'non_lu':
            instance.statut = 'lu'
            instance.save(update_fields=['statut'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class MessageStatutUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/messagerie/messages/recus/<id>/statut/
    Vendeur change le statut : 'lu' ou 'archive'.

    Body : {"statut": "archive"}
    """
    serializer_class   = StatutUpdateSerializer
    permission_classes = [IsAuthenticated, EstDestinataireMessage]
    http_method_names  = ['patch']

    def get_queryset(self):
        return Message.objects.filter(destinataire=self.request.user)

    def update(self, request, *args, **kwargs):
        instance   = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'success': True,
            'message': f"Message marqué comme '{instance.statut}'.",
            'statut':  instance.statut,
        })


class RepondreMessageView(generics.CreateAPIView):
    """
    POST /api/messagerie/messages/recus/<id>/repondre/
    Vendeur répond à un message.
    → Crée automatiquement une notification pour l'acheteur.

    Body : {"contenu": "..."}
    """
    serializer_class   = ReponseCreateSerializer
    permission_classes = [IsAuthenticated, EstParticipantMessage]

    def get_message(self):
        msg = get_object_or_404(Message, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, msg)
        return msg

    def create(self, request, *args, **kwargs):
        message    = self.get_message()
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request, 'message': message}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Notification automatique à l'acheteur si c'est le vendeur qui répond
        if request.user == message.destinataire:
            _creer_notif_reponse(message, request.user)

        return Response(
            {'success': True, 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )


class StatsMessagesView(views.APIView):
    """
    GET /api/messagerie/messages/stats/
    Retourne le nombre de messages non lus + total.
    Utilisé pour le badge dans l'espace vendeur.

    Réponse : {"non_lus": 3, "total": 10}
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        non_lus = Message.objects.filter(
            destinataire=request.user,
            statut='non_lu'
        ).count()
        total = Message.objects.filter(
            destinataire=request.user
        ).count()
        return Response({
            'non_lus': non_lus,
            'total':   total,
        })


# ═══════════════════════════════════════════════════════════════
# VUES — IMAGES CLOUDINARY
# ═══════════════════════════════════════════════════════════════

class UploadImageView(generics.CreateAPIView):
    """
    POST /api/messagerie/images/upload/
    Upload une image vers Cloudinary et l'associe à une annonce.

    Body multipart/form-data :
      - image        : fichier JPEG/PNG/WebP (max 5 Mo)
      - annonce_id   : ID de l'annonce
      - est_principale : true/false
    """
    serializer_class   = UploadImageSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        image_obj = serializer.save()
        return Response(
            {
                'success': True,
                'message': 'Image uploadée avec succès.',
                'data':    ImageAnnonceSerializer(image_obj).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ImagesAnnonceListView(generics.ListAPIView):
    """
    GET /api/messagerie/images/annonce/<annonce_id>/
    Liste toutes les images d'une annonce.
    Accès public — pas besoin de token.
    """
    serializer_class   = ImageAnnonceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ImageAnnonce.objects.filter(
            annonce_id=self.kwargs['annonce_id']
        ).order_by('ordre', '-est_principale')


class SupprimerImageView(generics.DestroyAPIView):
    """
    DELETE /api/messagerie/images/<id>/
    Supprime l'image sur Cloudinary ET en base de données.
    Seul le vendeur propriétaire de l'annonce peut supprimer.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ImageAnnonce.objects.filter(
            annonce__vendeur=self.request.user
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Suppression sur Cloudinary
        if instance.cloudinary_public_id:
            try:
                cloudinary.uploader.destroy(
                    instance.cloudinary_public_id,
                    resource_type='image'
                )
            except Exception as e:
                logger.warning(
                    f"Cloudinary delete failed "
                    f"{instance.cloudinary_public_id}: {e}"
                )

        instance.delete()
        return Response(
            {'success': True, 'message': 'Image supprimée avec succès.'},
            status=status.HTTP_200_OK,
        )


class DefinirImagePrincipaleView(views.APIView):
    """
    PATCH /api/messagerie/images/<id>/principale/
    Définit cette image comme principale pour son annonce.
    Remet automatiquement les autres images à False.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        image = get_object_or_404(
            ImageAnnonce,
            pk=pk,
            annonce__vendeur=request.user
        )
        # Reset toutes les images de cette annonce
        ImageAnnonce.objects.filter(
            annonce=image.annonce
        ).update(est_principale=False)

        # Définir celle-ci comme principale
        image.est_principale = True
        image.save(update_fields=['est_principale'])

        return Response({
            'success': True,
            'message': 'Image définie comme principale.',
        })


# ═══════════════════════════════════════════════════════════════
# VUES — NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════

class NotificationsListView(generics.ListAPIView):
    """
    GET /api/messagerie/notifications/
    Liste les notifications de l'utilisateur connecté.

    Filtre : ?non_lues=true → uniquement les non lues
    """
    serializer_class   = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.filter(
            destinataire=self.request.user
        )
        if self.request.query_params.get('non_lues') == 'true':
            qs = qs.filter(est_lue=False)
        return qs


class CompteurNotificationsView(views.APIView):
    """
    GET /api/messagerie/notifications/compteur/
    Retourne le nombre de notifications non lues.
    Utilisé par React pour le badge dans la navbar.

    Réponse : {"non_lues": 4}
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        nb = Notification.objects.filter(
            destinataire=request.user,
            est_lue=False
        ).count()
        return Response({'non_lues': nb})


class MarquerNotifLueView(views.APIView):
    """
    PATCH /api/messagerie/notifications/<id>/lire/
    Marque une notification spécifique comme lue.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notif = get_object_or_404(
            Notification,
            pk=pk,
            destinataire=request.user
        )
        if not notif.est_lue:
            notif.est_lue = True
            notif.save(update_fields=['est_lue'])
        return Response({
            'success': True,
            'message': 'Notification marquée comme lue.',
        })


class ToutLireView(views.APIView):
    """
    POST /api/messagerie/notifications/tout-lire/
    Marque toutes les notifications non lues comme lues.

    Réponse : {"success": true, "nb_mis_a_jour": 4}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        nb = Notification.objects.filter(
            destinataire=request.user,
            est_lue=False
        ).update(est_lue=True)
        return Response({
            'success':       True,
            'nb_mis_a_jour': nb,
        })