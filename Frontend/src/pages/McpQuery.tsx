import { useState, FormEvent } from 'react';
import api from '../services/api';

const McpQuery = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleQuestions = [
    'How many active vacations are there?',
    'What is the average price of vacations?',
    'What future European vacations are available?',
    'What are the most liked vacations?',
    'How many vacations are in total?',
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setAnswer('');
    setLoading(true);

    try {
      const response = await api.post('/api/mcp/query', { question });
      setAnswer(response.data.answer);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to process query');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (q: string) => {
    setQuestion(q);
  };

  return (
    <div className="page-container">
      <h1>MCP Database Query</h1>
      <p className="page-description">
        Ask questions about the vacation database. The MCP server will analyze your question
        and return relevant information from the database.
      </p>

      <div className="example-questions">
        <h4>Example questions:</h4>
        <div className="example-buttons">
          {exampleQuestions.map((q) => (
            <button
              key={q}
              className="btn btn-outline btn-sm"
              onClick={() => handleExampleClick(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <form className="query-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about vacations, prices, likes, users..."
            rows={3}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Ask Question'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {answer && (
        <div className="query-result">
          <h3>Answer</h3>
          <div className="answer-text">
            {answer.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default McpQuery;
