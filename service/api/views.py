from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from . import models, serializers


class TrackViewSet(viewsets.ModelViewSet):
    queryset = models.Track.objects.all()
    serializer_class = serializers.TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PlaylistViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing, creating and editing playlists.
    """
    queryset = models.Playlist.objects.all()
    serializer_class = serializers.PlaylistSerializer

    def create(self, request):
        try:
            playlist = models.Playlist.objects.create(title=request.data["title"])
            for track_id in request.data["tracks"]:
                track = get_object_or_404(models.Track, id=track_id)
                playlist.tracks.add(track)
            return Response(self.get_serializer(playlist).data, status=status.HTTP_201_CREATED)
        except KeyError:
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self):
        try:
            playlist = self.get_object()
            playlist.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], url_path='tracks')
    def add_track(self, request, pk=None):
        playlist = self.get_object()
        tracks = request.data["tracks"]
        for track_id in tracks:
            track = get_object_or_404(models.Track, id=track_id)
            playlist.tracks.add(track)
        playlist.save()
        # Return 200 OK and the updated playlist
        return Response(self.get_serializer(playlist).data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'], url_path='tracks/(?P<track_id>[^/.]+)')
    def remove_track(self, request, *args, **kwargs):
        playlist = self.get_object()
        track_id = kwargs.get('track_id')
        track = get_object_or_404(models.Track, id=track_id)
        playlist.tracks.remove(track)
        playlist.save()
        # Return 200 OK and the updated playlist
        return Response(self.get_serializer(playlist).data, status=status.HTTP_200_OK)