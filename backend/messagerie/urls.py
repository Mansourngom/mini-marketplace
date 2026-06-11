from django.urls import path
from .views import (
    # ── Images ──────────────────────────────
    UploadImageView,
    ImagesAnnonceListView,
    SupprimerImageView,
    DefinirImagePrincipaleView,

    # ── Messages ────────────────────────────
    EnvoyerMessageView,
    MesMessagesEnvoyesView,
    MessagesRecusListView,
    MessageRecuDetailView,
    MessageStatutUpdateView,
    RepondreMessageView,
    StatsMessagesView,

    # ── Notifications ────────────────────────
    NotificationsListView,
    MarquerNotifLueView,
    ToutLireView,
    CompteurNotificationsView,
)

urlpatterns = [

    # ── Images ──────────────────────────────────────────────────────────
    path('images/upload/',
         UploadImageView.as_view(),               name='image-upload'),
    path('images/annonce/<int:annonce_id>/',
         ImagesAnnonceListView.as_view(),          name='images-annonce'),
    path('images/<int:pk>/',
         SupprimerImageView.as_view(),             name='image-supprimer'),
    path('images/<int:pk>/principale/',
         DefinirImagePrincipaleView.as_view(),     name='image-principale'),

    # ── Messages ────────────────────────────────────────────────────────
    path('messages/envoyer/',
         EnvoyerMessageView.as_view(),             name='message-envoyer'),
    path('messages/envoyes/',
         MesMessagesEnvoyesView.as_view(),         name='messages-envoyes'),
    path('messages/recus/',
         MessagesRecusListView.as_view(),          name='messages-recus-list'),
    path('messages/recus/<int:pk>/',
         MessageRecuDetailView.as_view(),          name='message-recus-detail'),
    path('messages/recus/<int:pk>/statut/',
         MessageStatutUpdateView.as_view(),        name='message-statut'),
    path('messages/recus/<int:pk>/repondre/',
         RepondreMessageView.as_view(),            name='message-repondre'),
    path('messages/stats/',
         StatsMessagesView.as_view(),              name='messages-stats'),

    # ── Notifications ────────────────────────────────────────────────────
    path('notifications/',
         NotificationsListView.as_view(),          name='notifications-list'),
    path('notifications/<int:pk>/lire/',
         MarquerNotifLueView.as_view(),            name='notification-lire'),
    path('notifications/tout-lire/',
         ToutLireView.as_view(),                   name='notifications-tout-lire'),
    path('notifications/compteur/',
         CompteurNotificationsView.as_view(),      name='notifications-compteur'),
]