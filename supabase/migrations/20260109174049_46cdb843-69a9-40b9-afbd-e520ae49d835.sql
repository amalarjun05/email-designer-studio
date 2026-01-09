-- Create storage bucket for email template images
INSERT INTO storage.buckets (id, name, public)
VALUES ('email-images', 'email-images', true);

-- Allow anyone to view images (public bucket)
CREATE POLICY "Public can view email images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'email-images');

-- Allow anyone to upload images (for demo purposes - no auth required)
CREATE POLICY "Anyone can upload email images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'email-images');

-- Allow anyone to update their uploaded images
CREATE POLICY "Anyone can update email images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'email-images');

-- Allow anyone to delete images
CREATE POLICY "Anyone can delete email images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'email-images');