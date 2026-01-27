import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BACKBLAZE_KEY_ID = Deno.env.get("BACKBLAZE_KEY_ID") || "";
const BACKBLAZE_APP_KEY = Deno.env.get("BACKBLAZE_APP_KEY") || "";
const BACKBLAZE_BUCKET_NAME = Deno.env.get("BACKBLAZE_BUCKET_NAME") || "";

interface B2AuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}

interface B2UploadUrlResponse {
  uploadUrl: string;
  authorizationToken: string;
}

interface B2UploadResponse {
  fileId: string;
  fileName: string;
}

function mimeTypeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    mp4: "video/mp4",
    mov: "video/quicktime",
    heic: "image/heic",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}

async function authorizeB2(): Promise<B2AuthResponse> {
  const credentials = btoa(`${BACKBLAZE_KEY_ID}:${BACKBLAZE_APP_KEY}`);
  
  const response = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`B2 authorization failed: ${error}`);
  }

  const data = await response.json();
  return {
    authorizationToken: data.authorizationToken,
    apiUrl: data.apiUrl,
    downloadUrl: data.downloadUrl,
  };
}

async function getBucketId(apiUrl: string, authToken: string): Promise<string> {
  const response = await fetch(`${apiUrl}/b2api/v2/b2_list_buckets`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: BACKBLAZE_KEY_ID.substring(0, 12), // First 12 chars is account ID
      bucketName: BACKBLAZE_BUCKET_NAME,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get bucket ID: ${error}`);
  }

  const data = await response.json();
  const bucket = data.buckets.find((b: { bucketName: string }) => b.bucketName === BACKBLAZE_BUCKET_NAME);
  
  if (!bucket) {
    throw new Error(`Bucket "${BACKBLAZE_BUCKET_NAME}" not found`);
  }

  return bucket.bucketId;
}

async function getUploadUrl(apiUrl: string, authToken: string, bucketId: string): Promise<B2UploadUrlResponse> {
  const response = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bucketId }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get upload URL: ${error}`);
  }

  return response.json();
}

async function uploadToB2(
  uploadUrl: string,
  uploadAuthToken: string,
  fileName: string,
  fileData: ArrayBuffer,
  mimeType: string
): Promise<B2UploadResponse> {
  // Calculate SHA1 hash
  const hashBuffer = await crypto.subtle.digest("SHA-1", fileData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha1Hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadAuthToken,
      "Content-Type": mimeType,
      "Content-Length": fileData.byteLength.toString(),
      "X-Bz-File-Name": encodeURIComponent(fileName),
      "X-Bz-Content-Sha1": sha1Hash,
    },
    body: fileData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`B2 upload failed: ${error}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, fileName, guestName } = await req.json();

    console.log(`Processing upload for file: ${fileName} from guest: ${guestName}`);

    if (!BACKBLAZE_KEY_ID || !BACKBLAZE_APP_KEY || !BACKBLAZE_BUCKET_NAME) {
      throw new Error("Backblaze credentials not configured");
    }

    // Backend client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download file from temporary storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("photo-dump")
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download from storage: ${downloadError.message}`);
    }

    console.log(`Downloaded file from storage, size: ${fileData.size}`);

    // Authorize with Backblaze
    const auth = await authorizeB2();
    console.log("Authorized with Backblaze B2");

    // Get bucket ID
    const bucketId = await getBucketId(auth.apiUrl, auth.authorizationToken);
    console.log(`Got bucket ID: ${bucketId}`);

    // Get upload URL
    const uploadInfo = await getUploadUrl(auth.apiUrl, auth.authorizationToken, bucketId);
    console.log("Got upload URL");

    // Prepare file name with guest prefix
    const finalFileName = guestName ? `${guestName}/${fileName}` : fileName;
    const mimeType = mimeTypeFromName(fileName);
    const fileBuffer = await fileData.arrayBuffer();

    // Upload to Backblaze
    const uploadResult = await uploadToB2(
      uploadInfo.uploadUrl,
      uploadInfo.authorizationToken,
      finalFileName,
      fileBuffer,
      mimeType
    );

    console.log(`Uploaded to Backblaze B2: ${uploadResult.fileId}`);

    // Cleanup temporary storage
    await supabase.storage.from("photo-dump").remove([filePath]);
    console.log("Cleaned up temporary storage");

    // Construct public URL
    const publicUrl = `${auth.downloadUrl}/file/${BACKBLAZE_BUCKET_NAME}/${encodeURIComponent(finalFileName)}`;

    return new Response(
      JSON.stringify({
        success: true,
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        publicUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in upload-to-drive:", error);

    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
