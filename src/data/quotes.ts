// Replace these with your own quotes — the brief calls for "every quote
// provided by the user," but none were included in the source prompt.
export type Quote = {
  text: string;
  author: string;
};

export const quotes: Quote[] = [
  {
    text: "Good software isn't clever. It's the kind of clever no one notices because it just works.",
    author: "Dhanush",
  },
  {
    text: "I'd rather ship something small that survives contact with real users than something large that only survives a demo.",
    author: "Dhanush",
  },
  {
    text: "Automation isn't about removing people from the loop — it's about removing the parts of the loop that waste their time.",
    author: "Dhanush",
  },
  {
    text: "Every system fails eventually. The job is making sure it fails loudly, early, and somewhere safe.",
    author: "Dhanush",
  },
  {
    text: "The best architecture is the one you can explain to someone in one sentence and still be right.",
    author: "Dhanush",
  },
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
