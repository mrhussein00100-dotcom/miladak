'use client';

/**
 * مكون عرض مقاييس الجودة
 */

interface QualityMetricsProps {
  qualityScore: number;
  readabilityScore: number;
  seoScore: number;
  uniquenessScore: number;
}

export default function QualityMetrics({
  qualityScore,
  readabilityScore,
  seoScore,
  uniquenessScore,
}: QualityMetricsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const metrics = [
    { label: 'الجودة الإجمالية', value: qualityScore, icon: '⭐' },
    { label: 'قابلية القراءة', value: readabilityScore, icon: '📖' },
    { label: 'تحسين SEO', value: seoScore, icon: '🔍' },
    { label: 'التفرد', value: uniquenessScore, icon: '✨' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
        <span>📊</span>
        مقاييس الجودة
      </h4>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <span>{metric.icon}</span>
                {metric.label}
              </span>
              <span
                className={`text-sm font-bold ${getScoreColor(metric.value)}`}
              >
                {Math.round(metric.value)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreBg(
                  metric.value
                )} transition-all duration-500`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* تقييم عام */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(qualityScore)}`}>
            {Math.round(qualityScore)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {qualityScore >= 80
              ? 'ممتاز! 🎉'
              : qualityScore >= 60
              ? 'جيد 👍'
              : 'يحتاج تحسين ⚠️'}
          </div>
        </div>
      </div>
    </div>
  );
}
