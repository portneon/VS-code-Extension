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
          style={{
            ...styles.input,
            borderBottomLeftRadius: suggestions.length > 0 ? 0 : 8,
            borderBottomRightRadius: suggestions.length > 0 ? 0 : 8,
          }}
        />
        <span style={styles.searchIcon}>🔍</span>

        {suggestions.length > 0 && (
          <div style={styles.suggestions}>
            {suggestions.map((s) => (
              <div
                key={s.question_id}
                style={styles.suggestionItem}
                onClick={() => handleSelectQuestion(s)}
              >
                <strong style={styles.suggestionTitle}>{s.title}</strong>
                <div style={styles.suggestionMeta}>
                  <span style={styles.suggestionScore}>⬆️ {s.score}</span>
                  <div style={styles.suggestionTags}>
                    {s.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedQuestion && (
        <div style={styles.card}>
          <h3 style={styles.questionTitle}>{selectedQuestion.title}</h3>
          <div style={styles.questionMeta}>
            <span style={styles.questionScore}>
              ⬆️ {selectedQuestion.score} votes
            </span>
            <div style={styles.suggestionTags}>
              {selectedQuestion.tags?.map((tag) => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>
            {selectedQuestion.owner && (
              <span style={styles.owner}>
                <img src={selectedQuestion.owner.profile_image} alt="user" style={styles.avatar} />
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
              onClick={() => setCurrentAnswerIndex(i => Math.max(0, i - 1))}
              disabled={currentAnswerIndex === 0}
              style={styles.carouselBtn}
            >
              ⬅️
            </button>
            <span style={styles.carouselCount}>
              {currentAnswerIndex + 1} / {answers.length}
            </span>
            <button
              onClick={() =>
                setCurrentAnswerIndex(i => Math.min(answers.length - 1, i + 1))
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
                ? "#e8f5e8"
                : "#f9f9f9",
              border: answers[currentAnswerIndex].is_accepted
                ? "2px solid #4caf50"
                : "1px solid #d1d5db",
            }}
          >
            <div style={styles.answerHeader}>
              {answers[currentAnswerIndex].is_accepted ? (
                <span style={{ color: "#16a34a", fontWeight: 700 }}>
                  ✅ Accepted Answer
                </span>
              ) : (
                <span style={{ color: "#374151" }}>Answer</span>
              )}
              <span style={styles.answerScore}>
                ⬆️ {answers[currentAnswerIndex].score}
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
          .stackoverflow-container * {
            color: #374151 !important;
          }
          .stackoverflow-container p { margin: 0 0 8px 0; color: #374151 !important; }
          .stackoverflow-container pre { background: #f3f4f6; padding: 8px; border-radius: 4px; color: #1f2937 !important; border: 1px solid #e5e7eb; }
          .stackoverflow-container code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; color: #1f2937 !important; }
          .stackoverflow-container a { color: #0369a1 !important; text-decoration: underline; }
          .stackoverflow-container h1, .stackoverflow-container h2, .stackoverflow-container h3, 
          .stackoverflow-container h4, .stackoverflow-container h5, .stackoverflow-container h6 { color: #1f2937 !important; }
          .stackoverflow-container ul, .stackoverflow-container ol, .stackoverflow-container li { color: #374151 !important; }
          .stackoverflow-container blockquote { color: #6b7280 !important; border-left: 4px solid #d1d5db; padding-left: 12px; }
          .stackoverflow-container strong, .stackoverflow-container b { color: #1f2937 !important; }
          .stackoverflow-container em, .stackoverflow-container i { color: #374151 !important; }
          .stackoverflow-container span { color: #374151 !important; }
          .stackoverflow-container div { color: #374151 !important; }
          .stackoverflow-container input { color: #1f2937 !important; }
          .stackoverflow-container input::placeholder { color: #6b7280 !important; }
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
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    color: "#374151",
  },
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 16,
    color: "#1f2937",
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
    border: "1.5px solid #4b5563",
    outline: "none",
    background: "#fff !important",
    color: "#1f2937 !important",
    fontFamily: "Segoe UI, sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },
  searchIcon: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 16,
    color: "#6b7280",
  },
  suggestions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 10,
    background: "#fff",
    border: "1.5px solid #4b5563",
    borderTop: "none",
    borderRadius: "0 0 8px 8px",
    maxHeight: 240,
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  suggestionItem: {
    padding: "12px",
    cursor: "pointer",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
    transition: "background 0.2s",
    color: "#374151",
  },
  suggestionTitle: {
    color: "#1f2937",
    fontSize: 14,
    display: "block",
    marginBottom: 4,
  },
  suggestionMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  suggestionScore: {
    color: "#4b5563",
    fontWeight: 600,
    fontSize: 13,
  },
  suggestionTags: {
    display: "flex",
    gap: 6,
  },
  tag: {
    background: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 12,
    color: "#4b5563",
    border: "1px solid #e5e7eb",
  },
  card: {
    marginTop: 24,
    padding: 16,
    border: "1px solid #d1d5db",
    borderRadius: 10,
    background: "#fef3c7",
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
    color: "#1f2937",
  },
  questionMeta: {
    display: "flex",
    gap: 12,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  questionScore: {
    color: "#4b5563",
    fontWeight: 600,
    fontSize: 14,
  },
  owner: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#4b5563",
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
    padding: 12,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    color: "#374151",
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
    padding: "8px 16px",
    background: "#374151",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  carouselCount: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4b5563",
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
    color: "#4b5563",
    fontWeight: 600,
  },
};

export default StackOverflow;