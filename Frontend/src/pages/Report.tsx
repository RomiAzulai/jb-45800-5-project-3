import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import { ReportItem } from '../types';

const Report = () => {
  const [report, setReport] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/api/vacations/report');
        setReport(response.data);
      } catch {
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleDownloadCsv = async () => {
    try {
      const response = await api.get('/api/vacations/report/csv', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vacations-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Failed to download CSV');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Vacations Report</h1>
        <button className="btn btn-primary" onClick={handleDownloadCsv}>
          Download CSV
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading report...</div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={report} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="destination"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Likes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="likesCount" fill="#4a90d9" name="Likes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Report;
