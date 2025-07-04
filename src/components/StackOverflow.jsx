import React, { useState, useEffect } from "react";

const StackOverflow = ({ query: initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&intitle=${encodeURIComponent(
            query
          )}&site=stackoverflow&pagesize=10`
        );
        const data = await res.json();
        setSuggestions(data.items);
      } catch (err) {
        console.error("Error fetching StackOverflow suggestions:", err);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Set initial query from prop
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSelectQuestion = async (question) => {
    setSelectedQuestion(null);
    setAnswers([]);
    setCurrentAnswerIndex(0);
    setSuggestions([]);

    try {
      const [qRes, aRes] = await Promise.all([
        fetch(
          `https://api.stackexchange.com/2.3/questions/${question.question_id}?order=desc&sort=activity&site=stackoverflow&filter=withbody`
        ),
        fetch(
          `https://api.stackexchange.com/2.3/questions/${question.question_id}/answers?order=desc&sort=votes&site=stackoverflow&filter=withbody&pagesize=10`
        ),
      ]);

      const qData = await qRes.json();
      const aData = await aRes.json();

      setSelectedQuestion(qData.items[0]);
      setAnswers(aData.items);
    } catch (err) {
      console.error("Error fetching StackOverflow data:", err);
    }
  };

  return (
    <div style={styles.container} className="stackoverflow-container">
      <h2 style={styles.heading}>StackOverflow Search</h2>

      <div style={styles.searchBoxWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search StackOverflow..."
          style={styles.input}
        />
        <span style={styles.searchIcon}>🔍</span>
      </div>

      {suggestions.length > 0 && (
        <div style={styles.suggestions}>
          {suggestions.map((s) => (
            <div
              key={s.question_id}
              style={styles.suggestionItem}
              onClick={() => handleSelectQuestion(s)}
            >
              <strong>{s.title}</strong>
              <div style={styles.suggestionMeta}>
                <span style={styles.suggestionScore}>⬆️ {s.score}</span>
                <div style={styles.suggestionTags}>
                  {s.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} style={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQuestion && (
        <div style={styles.card}>
          <h3 style={styles.questionTitle}>{selectedQuestion.title}</h3>
          <div style={styles.questionMeta}>
            <span style={styles.questionScore}>
              ⬆ {selectedQuestion.score} votes
            </span>
            <div style={styles.suggestionTags}>
              {selectedQuestion.tags?.map((tag) => (
                <span key={tag} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            {selectedQuestion.owner && (
              <span style={styles.owner}>
                <img
                  src={selectedQuestion.owner.profile_image}
                  alt="user"
                  style={styles.avatar}
                />
                {selectedQuestion.owner.display_name}
              </span>
            )}
          </div>
          <div
            style={styles.body}
            dangerouslySetInnerHTML={{ __html: selectedQuestion.body }}
          />
        </div>
      )}

      {answers.length > 0 && (
        <div style={styles.carousel}>
          <div style={styles.carouselHeader}>
            <button
              onClick={() => setCurrentAnswerIndex((i) => Math.max(0, i - 1))}
              disabled={currentAnswerIndex === 0}
              style={styles.carouselBtn}
            >
              ⬅
            </button>
            <span style={styles.carouselCount}>
              {currentAnswerIndex + 1} / {answers.length}
            </span>
            <button
              onClick={() =>
                setCurrentAnswerIndex((i) =>
                  Math.min(answers.length - 1, i + 1)
                )
              }
              disabled={currentAnswerIndex === answers.length - 1}
              style={styles.carouselBtn}
            >
              ➡️
            </button>
          </div>

          <div
            style={{
              ...styles.answerCard,
              background: answers[currentAnswerIndex].is_accepted
                ? "#e6f7e6"
                : "#f9f9f9",
              border: answers[currentAnswerIndex].is_accepted
                ? "2px solid #4caf50"
                : "1px solid #ccc",
            }}
          >
            <div style={styles.answerHeader}>
              {answers[currentAnswerIndex].is_accepted ? (
                <span style={{ color: "#4caf50", fontWeight: 700 }}>
                  Accepted Answer
                </span>
              ) : (
                <span style={{ color: "#888" }}>Answer</span>
              )}
              <span style={styles.answerScore}>
                {answers[currentAnswerIndex].score}
              </span>
              {answers[currentAnswerIndex].owner && (
                <span style={styles.owner}>
                  <img
                    src={answers[currentAnswerIndex].owner.profile_image}
                    alt="user"
                    style={styles.avatar}
                  />
                  {answers[currentAnswerIndex].owner.display_name}
                </span>
              )}
            </div>
            <div
              style={styles.body}
              dangerouslySetInnerHTML={{
                __html: answers[currentAnswerIndex].body,
              }}
            />
          </div>
        </div>
      )}

      <style>
        {`
          p { margin: 0 0 6px 0; }
          pre { background: #f6f8fa; padding: 6px; border-radius: 4px; }
          code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
          a { color: #0074cc; }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    padding: 24,
    maxWidth: 800,
    margin: "32px auto",
    // background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 16,
  },
  searchBoxWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "12px 40px 12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #f48024",
    outline: "none",
    background: "#fff !important",
    color: "#000 !important",
    fontFamily: "Segoe UI, sans-serif",
  },
  searchIcon: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 20,
    color: "#f48024",
  },
  suggestions: {
    position: "absolute",
    width: "100%",
    zIndex: 10,
    background: "#fff",
    border: "1.5px solid #f48024",
    borderRadius: 8,
    maxHeight: 240,
    overflowY: "auto",
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    background: "#fff",
    transition: "background 0.2s",
  },
  suggestionMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  suggestionScore: {
    color: "#f48024",
    fontWeight: 600,
    fontSize: 13,
  },
  suggestionTags: {
    display: "flex",
    gap: 6,
  },
  tag: {
    background: "#f1f1f1",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 12,
    color: "#39739d",
  },
  card: {
    marginTop: 24,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 10,
    background: "#fdf7e2",
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
  },
  questionMeta: {
    display: "flex",
    gap: 12,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  questionScore: {
    color: "#f48024",
    fontWeight: 600,
    fontSize: 14,
  },
  owner: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#555",
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: "50%",
  },
  body: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 1.6,
    background: "#fff",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #eee",
  },
  carousel: {
    marginTop: 24,
  },
  carouselHeader: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    marginBottom: 12,
  },
  carouselBtn: {
    padding: "6px 14px",
    background: "#f48024",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },
  carouselCount: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f48024",
  },
  answerCard: {
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  answerHeader: {
    fontSize: 14,
    marginBottom: 8,
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  answerScore: {
    color: "#f48024",
    fontWeight: 600,
  },
};

export default StackOverflow;
