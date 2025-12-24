-- Create storage bucket for temporary photo uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('photo-dump', 'photo-dump', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']);

-- Allow anyone to upload photos (guests don't need to be authenticated)
CREATE POLICY "Anyone can upload photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'photo-dump');

-- Allow the service role to read and delete (for the edge function)
CREATE POLICY "Service role can read photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'photo-dump');

CREATE POLICY "Service role can delete photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'photo-dump');