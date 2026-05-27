def detect_crisis(message: str):

    message = message.lower()

    crisis_keywords = [

        # Direct suicidal thoughts
        "suicide",
        "kill myself",
        "end my life",
        "want to die",
        "i want to die",
        "don't want to live",
        "dont want to live",
        "can't live anymore",
        "cant live anymore",
        "i should disappear",
        "i want to disappear",
        "i'm done with life",
        "im done with life",
        "no reason to live",
        "life is pointless",
        "i give up on life",

        # Self-harm
        "hurt myself",
        "self harm",
        "cut myself",
        "harm myself",
        "i hurt myself",
        "i cut myself",

        # Emotional hopelessness
        "nobody would care if i disappeared",
        "everyone would be better without me",
        "i feel empty",
        "i feel hopeless",
        "nothing matters anymore",
        "i can't do this anymore",
        "i cant do this anymore",
        "i feel broken",
        "i feel trapped",
        "i hate my life",
        "i'm tired of everything",
        "im tired of everything",
        "everything feels pointless",
        "i feel numb",

        # Indirect depressive indicators
        "i don't see a future",
        "i dont see a future",
        "i feel worthless",
        "i am worthless",
        "i'm worthless",
        "i feel like giving up",
        "i want everything to stop",
        "i don't want to wake up",
        "i dont want to wake up",
        "i feel dead inside",
        "i can't take this anymore",
        "i cant take this anymore",

        # Severe emotional collapse
        "mental breakdown",
        "panic attack",
        "losing my mind",
        "i feel destroyed",
        "i'm falling apart",
        "im falling apart",
        "i can't breathe",
        "i cant breathe",
        "everything is too much",

        # Isolation + danger
        "nobody understands me",
        "i'm completely alone",
        "im completely alone",
        "nobody cares about me",
        "i have nobody",
        "i feel abandoned",

        # Emergency-like phrases
        "goodbye forever",
        "this is my last message",
        "i won't be here tomorrow",
        "you won't hear from me again"
    ]

    for keyword in crisis_keywords:
        if keyword in message:
            return True

    return False