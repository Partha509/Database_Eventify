<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function handleChat(Request $request)
    {
        //Validate the user's input
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $userMessage = $request->input('message');
        $apiKey = env('GEMINI_API_KEY');
        $primaryModel = env('GEMINI_MODEL', 'gemini-2.5-flash');

        if (!$apiKey) {
            return response()->json(['error' => 'AI configuration missing on server.'], 500);
        }

        try {
            $modelCandidates = array_values(array_unique([
                $primaryModel,
                'gemini-2.5-flash',
                'gemini-flash-latest',
                'gemini-2.0-flash',
            ]));

            foreach ($modelCandidates as $model) {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->timeout(20)
                ->post($url, [
                    'system_instruction' => [
                        'parts' => [
                            ['text' => 'You are a helpful, enthusiastic customer support agent for a university project ticketing platform named Eventify. Keep your answers brief, friendly, and helpful. You help users find events, buy and sell tickets.']
                        ]
                    ],
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $userMessage]
                            ]
                        ]
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $aiReply = $data['candidates'][0]['content']['parts'][0]['text'] ?? "I'm sorry, I couldn't process that.";

                    return response()->json([
                        'reply' => $aiReply
                    ]);
                }

                Log::warning('Gemini model request failed', [
                    'model' => $model,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                if ($response->status() === 429) {
                    return response()->json(['error' => 'AI quota exceeded. Please try again later.'], 429);
                }

                if (in_array($response->status(), [401, 403], true)) {
                    return response()->json(['error' => 'AI authentication failed. Check GEMINI_API_KEY.'], 500);
                }

                if ($response->status() !== 404) {
                    break;
                }
            }

            return response()->json(['error' => 'Failed to connect to AI.'], 500);

        } catch (\Exception $e) {
            Log::error('Chatbot Controller Exception: ' . $e->getMessage());
            return response()->json(['error' => 'AI Service unavailable'], 500);
        }
    }
}