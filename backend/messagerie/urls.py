from django.urls import path
from .views import EnvoyerMessageView, MessagesRecusView, MessagesEnvoyesView

urlpatterns = [
    path('envoyer/', EnvoyerMessageView.as_view(), name='envoyer-message'),
    path('recus/', MessagesRecusView.as_view(), name='messages-recus'),
    path('envoyes/', MessagesEnvoyesView.as_view(), name='messages-envoyes'),
]