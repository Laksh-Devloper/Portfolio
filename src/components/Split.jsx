// Splits text into per-letter spans for reveal animations. `auto` opts into the global scroll reveal in App.
export default function Split({ text, auto = true }) {
  return (
    <span className={auto ? 'split split-auto' : 'split'}>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((w, k) => (
        <span className="split-word" aria-hidden="true" key={k}>
          {[...w].map((c, j) => <span className="ch" key={j}>{c}</span>)}
        </span>
      ))}
    </span>
  );
}
