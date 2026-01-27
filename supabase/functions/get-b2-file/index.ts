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
  downloadUrl: string;
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
    downloadUrl: data.downloadUrl,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const fileName = url.searchParams.get("file");

    if (!fileName) {
      return new Response(
        JSON.stringify({ error: "file parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!BACKBLAZE_KEY_ID || !BACKBLAZE_APP_KEY || !BACKBLAZE_BUCKET_NAME) {
      throw new Error("Backblaze credentials not configured");
    }

    // Authorize with Backblaze
    const auth = await authorizeB2();

    // Download the file with authorization
    const fileUrl = `${auth.downloadUrl}/file/${BACKBLAZE_BUCKET_NAME}/${encodeURIComponent(fileName)}`;
    
    const response = await fetch(fileUrl, {
      headers: {
        Authorization: auth.authorizationToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type") || "application/octet-stream";
    const body = await response.arrayBuffer();

    return new Response(body, {
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching B2 file:", error);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
