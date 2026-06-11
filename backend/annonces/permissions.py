from rest_framework.permissions import BasePermission


class EstVendeur(BasePermission):
    message = "Accès réservé aux vendeurs."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'vendeur'
        )


class EstProprietaireAnnonce(BasePermission):
    message = "Vous n'êtes pas autorisé à modifier cette annonce."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.vendeur == request.user