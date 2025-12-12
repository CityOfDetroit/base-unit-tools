import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';
import { Flex, Spinner, Text } from '@radix-ui/themes';

const MAPILLARY_TOKEN = 'MLY|4690399437648324|de87555bb6015affa20c3df794ebab15';

const PanoramaViewer = ({ imageId, onLoad, onError }) => {
  const viewerRef = useRef(null);
  const viewerInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentImageId = useRef(null);

  // Initialize viewer when we have both a container and an imageId
  useEffect(() => {
    if (!viewerRef.current || !imageId) return;

    // If viewer exists and imageId changed, navigate to new image
    if (viewerInstance.current) {
      if (imageId !== currentImageId.current) {
        currentImageId.current = imageId;
        setLoading(true);
        setError(null);

        viewerInstance.current
          .moveTo(imageId)
          .catch((err) => {
            // Ignore cancellation errors (happen when component unmounts or image changes)
            if (err?.name === 'CancelMapillaryError' || err?.message?.includes('aborted')) {
              return;
            }
            // Only set error if this is still the current image we're trying to load
            if (currentImageId.current === imageId) {
              console.error('Failed to load panorama:', err);
              setError('Failed to load panorama');
              setLoading(false);
              if (onError) onError(err);
            }
          });
      }
      return;
    }

    // Create new viewer with the imageId
    currentImageId.current = imageId;
    const viewer = new Viewer({
      accessToken: MAPILLARY_TOKEN,
      container: viewerRef.current,
      component: {
        // Disable navigation - player shouldn't be able to move to other images
        direction: false,
        sequence: false,
        // Disable other location hints
        bearing: false,
        attribution: false,
        // Keep these for viewing experience
        cover: false,
        cache: true,
        marker: false,
        zoom: true,
      },
      imageId: imageId,
    });

    viewer.on('image', () => {
      setLoading(false);
      setError(null);
      if (onLoad) onLoad();
    });

    viewerInstance.current = viewer;

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.remove();
        viewerInstance.current = null;
      }
    };
  }, [imageId, onLoad, onError]);

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <div
        ref={viewerRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '300px' }}
      />

      {/* Loading overlay */}
      {loading && (
        <Flex
          align="center"
          justify="center"
          direction="column"
          gap="2"
          className="absolute inset-0 bg-black/50 rounded-lg"
        >
          <Spinner size="3" />
          <Text size="2" className="text-white">
            Loading panorama...
          </Text>
        </Flex>
      )}

      {/* Error overlay - only show if not loading */}
      {error && !loading && (
        <Flex
          align="center"
          justify="center"
          className="absolute inset-0 bg-black/70 rounded-lg"
        >
          <Text size="2" color="red">
            {error}
          </Text>
        </Flex>
      )}
    </div>
  );
};

export default PanoramaViewer;
