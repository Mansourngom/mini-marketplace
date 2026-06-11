class MessageSerializer(serializers.ModelSerializer):
    expediteur_nom   = serializers.CharField(
        source='expediteur.username', read_only=True
    )
    destinataire_nom = serializers.CharField(
        source='destinataire.username', read_only=True
    )

    class Meta:
        model  = Message
        fields = [
            'id',
            'expediteur',
            'expediteur_nom',
            'destinataire',
            'destinataire_nom',
            'annonce_id_ref',     # ← remplace annonce
            'annonce_titre',      # ← titre saisi manuellement
            'sujet',
            'contenu',
            'telephone_contact',
            'statut',
            'date_envoi',
        ]
        read_only_fields = [
            'id', 'expediteur', 'expediteur_nom',
            'destinataire_nom', 'statut', 'date_envoi',
        ]


class MessageDetailSerializer(serializers.ModelSerializer):
    expediteur_nom   = serializers.CharField(
        source='expediteur.username', read_only=True
    )
    expediteur_email = serializers.EmailField(
        source='expediteur.email', read_only=True
    )
    destinataire_nom = serializers.CharField(
        source='destinataire.username', read_only=True
    )
    reponses    = ReponseSerializer(many=True, read_only=True)
    nb_reponses = serializers.SerializerMethodField()

    class Meta:
        model  = Message
        fields = [
            'id',
            'expediteur_nom',
            'expediteur_email',
            'destinataire_nom',
            'telephone_contact',
            'annonce_id_ref',
            'annonce_titre',
            'sujet',
            'contenu',
            'statut',
            'nb_reponses',
            'reponses',
            'date_envoi',
        ]
        read_only_fields = fields

    def get_nb_reponses(self, obj):
        return obj.reponses.count()