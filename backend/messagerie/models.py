from django.db import models
from users.models import User

class Message(models.Model):
    expediteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='messages_envoyes'
    )

    destinataire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='messages_recus'
    )

    contenu = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.expediteur} → {self.destinataire}"

    class Meta:
        ordering = ['-date_envoi']