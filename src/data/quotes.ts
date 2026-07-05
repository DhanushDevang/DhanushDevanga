// Name attribution intentionally omitted for now — will be added back later.
export type Quote = {
  text: string;
  author?: string;
};

export const quotes: Quote[] = [
  {
    text: "Good software isn't clever. It's the kind of clever no one notices because it just works.",
  },
  {
    text: "I'd rather ship something small that survives contact with real users than something large that only survives a demo.",
  },
  {
    text: "Automation isn't about removing people from the loop — it's about removing the parts of the loop that waste their time.",
  },
  {
    text: "Every system fails eventually. The job is making sure it fails loudly, early, and somewhere safe.",
  },
  {
    text: "The best architecture is the one you can explain to someone in one sentence and still be right.",
  },
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
