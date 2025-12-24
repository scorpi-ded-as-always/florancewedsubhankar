import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DRIVE_FOLDER_ID = Deno.env.get("GOOGLE_DRIVE_FOLDER_ID") || "";

function base64UrlEncode(input: string) {
  return btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function mimeTypeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

async function getAccessToken(serviceAccountKey: string): Promise<string> {
  const key = JSON.parse(serviceAccountKey);

  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: key.client_email,
    // Full Drive scope for server-to-server uploads into Shared Drives
    scope: "https://www.googleapis.com/auth/drive",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(payload)
  )}`;

  const encoder = new TextEncoder();
  const pemContents = key.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${unsignedToken}.${signatureB64}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

async function assertSharedDriveFolder(accessToken: string, folderId: string) {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,driveId&supportsAllDrives=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Could not access the configured Drive folder. Make sure the service account has access. Details: ${text}`
    );
  }

  const data = JSON.parse(text) as { id: string; name?: string; driveId?: string };
  console.log(`Drive folder check: name=${data.name ?? "(unknown)"}, driveId=${data.driveId ?? "(none)"}`);

  if (!data.driveId) {
    throw new Error(
      'The configured folder is not inside a Shared Drive. Service accounts cannot upload into regular "My Drive" folders because they have no storage quota. Move/create this folder inside a Shared Drive and update the folder ID.'
    );
  }
}

async function uploadToDrive(
  accessToken: string,
  fileName: string,
  fileBlob: Blob,
  mimeType: string,
  folderId: string
): Promise<{ id: string; name: string }> {
  const metadata = {
    name: fileName,
    parents: folderId ? [folderId] : undefined,
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", fileBlob, fileName);

  // supportsAllDrives is required for Shared Drives
  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Drive upload failed: ${errorText}`);
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
    console.log(`Drive folder configured: ${DRIVE_FOLDER_ID ? "yes" : "no"}`);

    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!serviceAccountKey) {
      throw new Error("Google Service Account key not configured");
    }

    if (!DRIVE_FOLDER_ID) {
      throw new Error("Google Drive folder ID not configured");
    }

    // Backend client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("photo-dump")
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download from storage: ${downloadError.message}`);
    }

    console.log(`Downloaded file from storage, size: ${fileData.size}`);

    const accessToken = await getAccessToken(serviceAccountKey);
    console.log("Got Google access token");

    // Make the failure mode explicit: shared drive required
    await assertSharedDriveFolder(accessToken, DRIVE_FOLDER_ID);

    const finalFileName = guestName ? `${guestName}_${fileName}` : fileName;

    const driveResult = await uploadToDrive(
      accessToken,
      finalFileName,
      fileData,
      fileData.type || mimeTypeFromName(fileName),
      DRIVE_FOLDER_ID
    );

    console.log(`Uploaded to Google Drive: ${driveResult.id}`);

    // Cleanup
    await supabase.storage.from("photo-dump").remove([filePath]);
    console.log("Cleaned up temporary storage");

    return new Response(
      JSON.stringify({
        success: true,
        driveFileId: driveResult.id,
        fileName: driveResult.name,
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
