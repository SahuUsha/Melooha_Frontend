
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface QuestionRequest {
  user_id: number;
  question: string;
}
export interface Citation {
  source: string;
  page_number: number;
}

export interface QuestionDoneResponse {
  question_id: number;
  answer: string;
  citations: Citation[];
  chart_citations: Citation[];
  provider: string;
  retrieved_count: number;
  remaining_balance: number;
}

// interface StreamEvent {
//   event: string;
//   data: Record<string, unknown>;
// }

interface StreamCallbacks {
  onToken: (token: string) => void;
  onReset: () => void;
  onDone: (data: QuestionDoneResponse) => void;
  onError: (message: string) => void;
}

export async function askQuestionStream(
  request: QuestionRequest,
  callbacks: StreamCallbacks,
    signal?: AbortSignal
): Promise<void> {
  const token = localStorage.getItem("melooha_token");

  const response = await fetch(`${API_BASE_URL}/questions/ask/stream`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  signal,
  body: JSON.stringify(request),
});
  if (!response.ok) {
    let message = "Unable to submit your question.";

    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      // Keep the default message.
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processEvent = (rawEvent: string) => {
    let eventName = "message";
    let dataText = "";

    rawEvent.split("\n").forEach((line) => {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataText += line.slice(5).trim();
      }
    });

    if (!dataText) return;

    const data = JSON.parse(dataText) as Record<string, unknown>;

    if (eventName === "token") {
      callbacks.onToken(String(data.token ?? ""));
    } else if (eventName === "reset") {
      callbacks.onReset();
    } else if (eventName === "done") {
      callbacks.onDone(data as unknown as QuestionDoneResponse);
    } else if (eventName === "error") {
      callbacks.onError(
        String(data.message ?? "Answer generation failed.")
      );
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      events.forEach(processEvent);
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      processEvent(buffer);
    }
  } finally {
    reader.releaseLock();
  }
}


export interface HistoryItem {
  question_id: number;
  question: string;
  answer: string;
  status: string;
  provider: string | null;
  created_at: string;
}

export interface QuestionHistoryResponse {
  user_id: number;
  total_questions: number;
  history: HistoryItem[];
}

export async function getQuestionHistory(
  userId: number
): Promise<QuestionHistoryResponse> {
  const token = localStorage.getItem("melooha_token");

  if (!token) {
    throw new Error("Please sign in to view your question history.");
  }

  const response = await fetch(
    `${API_BASE_URL}/questions/history/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let message = "Unable to load question history.";

    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return (await response.json()) as QuestionHistoryResponse;
}
export interface QuestionTopUpResponse {
  message: string;
  user_id: number;
  questions_added: number;
  remaining_balance: number;
}

export async function addQuestionCredits(
  userId: number,
  amount: number
): Promise<QuestionTopUpResponse> {
  const token = localStorage.getItem("melooha_token");

  if (!token) {
    throw new Error("Please sign in to add question credits.");
  }

  const response = await fetch(`${API_BASE_URL}/questions/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      amount,
    }),
  });

  if (!response.ok) {
    let message = "Unable to add question credits.";

    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return (await response.json()) as QuestionTopUpResponse;
}

export interface QuestionBalanceResponse {
  user_id: number;
  question_balance: number;
}

export async function getQuestionBalance(
  userId: number
): Promise<QuestionBalanceResponse> {
  const token = localStorage.getItem("melooha_token");

  if (!token) {
    throw new Error("Please sign in to view your question credits.");
  }

  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/balance`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch your current question balance.");
  }

  return (await response.json()) as QuestionBalanceResponse;
}
