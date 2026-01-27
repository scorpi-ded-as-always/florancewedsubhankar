import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BACKBLAZE_KEY_ID = (Deno.env.get("BACKBLAZE_KEY_ID") || "").trim();
const BACKBLAZE_APP_KEY = (Deno.env.get("BACKBLAZE_APP_KEY") || "").trim();
const BACKBLAZE_BUCKET_NAME = (Deno.env.get("BACKBLAZE_BUCKET_NAME") || "").trim();

interface B2AuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
  accountId: string;
}

interface B2File {
  fileId: string;
  fileName: string;
  contentLength: number;
  contentType: string;
  uploadTimestamp: number;
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
    accountId: data.accountId,
  };
}

async function getBucketId(apiUrl: string, authToken: string, accountId: string): Promise<string> {
  const response = await fetch(`${apiUrl}/b2api/v2/b2_list_buckets`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId,
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

async function listFiles(apiUrl: string, authToken: string, bucketId: string): Promise<B2File[]> {
  const files: B2File[] = [];
  let startFileName: string | null = null;

  // Paginate through all files
  do {
    const body: Record<string, unknown> = {
      bucketId,
      maxFileCount: 1000,
    };
    
    if (startFileName) {
      body.startFileName = startFileName;
    }

    const response = await fetch(`${apiUrl}/b2api/v2/b2_list_file_names`, {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list files: ${error}`);
    }

    const data = await response.json();
    files.push(...data.files);
    startFileName = data.nextFileName || null;
  } while (startFileName);

  return files;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!BACKBLAZE_KEY_ID || !BACKBLAZE_APP_KEY || !BACKBLAZE_BUCKET_NAME) {
      throw new Error("Backblaze credentials not configured");
    }

    // Authorize with Backblaze
    const auth = await authorizeB2();
    console.log("Authorized with Backblaze B2");

    // Get bucket ID
    const bucketId = await getBucketId(auth.apiUrl, auth.authorizationToken, auth.accountId);
    console.log(`Got bucket ID: ${bucketId}`);

    // List all files
    const files = await listFiles(auth.apiUrl, auth.authorizationToken, bucketId);
    console.log(`Found ${files.length} files`);

    // Transform files with public URLs
    const transformedFiles = files.map((file) => ({
      id: file.fileId,
      name: file.fileName,
      size: file.contentLength,
      contentType: file.contentType,
      uploadedAt: new Date(file.uploadTimestamp).toISOString(),
      publicUrl: `${auth.downloadUrl}/file/${BACKBLAZE_BUCKET_NAME}/${encodeURIComponent(file.fileName)}`,
    }));

    // Sort by upload date, newest first
    transformedFiles.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return new Response(
      JSON.stringify({ success: true, files: transformedFiles }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error listing B2 files:", error);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
