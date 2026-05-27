const API_URL = 'http://127.0.0.1:8000/chat'

export async function sendMessage(
  message,
  onChunk
) {

  const response = await fetch(API_URL, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      user_id: 'omkar',
      message
    })
  })

  const reader = response.body.getReader()

  const decoder = new TextDecoder()

  let fullText = ''

  while (true) {

    const { done, value } = await reader.read()

    if (done) break

    const chunk = decoder.decode(value)

    fullText += chunk

    onChunk(fullText)
  }

  return fullText
}