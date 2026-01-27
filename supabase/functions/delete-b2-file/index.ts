import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BACKBLAZE_KEY_ID = (Deno.env.get("BACKBLAZE_KEY_ID") || "").trim();
const BACKBLAZE_APP_KEY = (Deno.env.get("BACKBLAZE_APP_KEY") || "").trim();

interface B2AuthResponse {
  authorizationToken: string;
  apiUrl: string;
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
  };
}

async function deleteFile(apiUrl: string, authToken: string, fileId: string, fileName: string): Promise<void> {
  const response = await fetch(`${apiUrl}/b2api/v2/b2_delete_file_version`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileId,
      fileName,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete file: ${error}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileId, fileName } = await req.json();

    if (!fileId || !fileName) {
      throw new Error("fileId and fileName are required");
    }

    if (!BACKBLAZE_KEY_ID || !BACKBLAZE_APP_KEY) {
      throw new Error("Backblaze credentials not configured");
    }

    // Authorize with Backblaze
    const auth = await authorizeB2();
    console.log("Authorized with Backblaze B2");

    // Delete the file
    await deleteFile(auth.apiUrl, auth.authorizationToken, fileId, fileName);
    console.log(`Deleted file: ${fileName}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error deleting B2 file:", error);

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
