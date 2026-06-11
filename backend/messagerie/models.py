from django.db import models
from users.models import User
import cloudinary
from cloudinary.models import CloudinaryField


# ═══════════════════════════════════════════════════════════════
# MESSAGES DE CONTACT
# ═══════════════════════════════════════════════════════════════

class Message(models.Model):

    class Statut(models.TextChoices):
        NON_LU  = 'non_lu',  'Non lu'
        LU      = 'lu',      'Lu'
        ARCHIVE = 'archive', 'Archivé'

    expediteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='messages_envoyes',
        verbose_name='Expéditeur',
    )
    destinataire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='messages_recus',
        verbose_name='Destinataire',
    )

    # Référence à l'annonce par ID simple
    # (ForeignKey sera ajoutée quand l'app annonces sera prête)
    annonce_id_ref = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='ID Annonce',
    )
    annonce_titre = models.CharField(
        max_length=200,
        blank=True,
        default='',
        verbose_name='Titre annonce',
    )

    sujet   = models.CharField(
        max_length=200,
        default='Sans sujet',
        verbose_name='Sujet',
    )
    contenu = models.TextField(verbose_name='Contenu')

    telephone_contact = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Téléphone de contact',
    )

    statut = models.CharField(
        max_length=20,
        choices=Statut.choices,
        default=Statut.NON_LU,
        verbose_name='Statut',
    )

    lu         = models.BooleanField(default=False)
    date_envoi = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Message'
        ordering     = ['-date_envoi']
        indexes = [
            models.Index(fields=['destinataire', 'statut']),
            models.Index(fields=['expediteur']),
        ]

    def __str__(self):
        return f"[{self.statut}] {self.expediteur} → {self.destinataire}"

    def marquer_lu(self):
        if self.statut == self.Statut.NON_LU:
            self.statut = self.Statut.LU
            self.lu     = True
            self.save(update_fields=['statut', 'lu', 'updated_at'])


class ReponseMessage(models.Model):
    message_original = models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='reponses',
        verbose_name='Message original',
    )
    auteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reponses_envoyees',
        verbose_name='Auteur',
    )
    contenu    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Réponse de {self.auteur} — {self.created_at:%d/%m/%Y}"


# ═══════════════════════════════════════════════════════════════
# IMAGES D'ANNONCES — CLOUDINARY
# ═══════════════════════════════════════════════════════════════

class ImageAnnonce(models.Model):

    # ID de l'annonce simple (pas de ForeignKey vers annonces)
    annonce_id_ref = models.IntegerField(
        verbose_name='ID Annonce',
    )
    annonce_titre = models.CharField(
        max_length=200,
        blank=True,
        default='',
        verbose_name='Titre annonce',
    )

    image = CloudinaryField(
        'image',
        folder='marketplace/annonces',
        transformation=[
            {'quality': 'auto', 'fetch_format': 'auto'}
        ],
    )
    cloudinary_public_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Public ID Cloudinary',
    )
    est_principale = models.BooleanField(default=False)
    ordre          = models.PositiveSmallIntegerField(default=0)

    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='images_uploadees',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Image d'annonce"
        ordering     = ['annonce_id_ref', 'ordre', '-est_principale']

    def __str__(self):
        tag = ' [principale]' if self.est_principale else ''
        return f"Image {self.ordre} — annonce #{self.annonce_id_ref}{tag}"

    def _build_url(self, **options):
        opts = {
            'quality':      'auto',
            'fetch_format': 'auto',
            'secure':       True,
        }
        opts.update(options)
        return cloudinary.CloudinaryImage(
            str(self.image)
        ).build_url(**opts)

    @property
    def url_thumbnail(self):
        return self._build_url(width=150, height=150, crop='fill')

    @property
    def url_medium(self):
        return self._build_url(width=400, height=300, crop='fill')

    @property
    def url_large(self):
        return self._build_url(width=800, height=600, crop='fill')

    @property
    def url_original(self):
        return self._build_url()


# ═══════════════════════════════════════════════════════════════
# NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════

class Notification(models.Model):

    class TypeNotif(models.TextChoices):
        NOUVEAU_MESSAGE = 'nouveau_message', 'Nouveau message reçu'
        REPONSE_VENDEUR = 'reponse_vendeur', 'Le vendeur a répondu'

    destinataire = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    type_notif = models.CharField(
        max_length=30,
        choices=TypeNotif.choices,
    )
    titre   = models.CharField(max_length=200)
    message = models.TextField()

    annonce_id  = models.IntegerField(null=True, blank=True)
    message_id  = models.IntegerField(null=True, blank=True)

    est_lue    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes  = [
            models.Index(fields=['destinataire', 'est_lue']),
        ]

    def __str__(self):
        statut = '✓' if self.est_lue else '●'
        return f"[{statut}] {self.destinataire} — {self.titre}"

    def marquer_lue(self):
        if not self.est_lue:
            self.est_lue = True
            self.save(update_fields=['est_lue'])