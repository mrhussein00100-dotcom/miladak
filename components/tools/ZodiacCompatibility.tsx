
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { zodiacSigns, getCompatibility, ZodiacSign } from '@/lib/zodiac-data';

export default function ZodiacCompatibility() {
  const [sign1, setSign1] = useState<string>('');
  const [sign2, setSign2] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    if (!sign1 || !sign2) return;

    setLoading(true);
    setResult(null);

    // Simulate calculation delay for effect
    setTimeout(() => {
      const compatibility = getCompatibility(sign1, sign2);
      setResult(compatibility);
      setLoading(false);
    }, 1500);
  };

  const selectedSign1 = zodiacSigns.find((s) => s.id === sign1);
  const selectedSign2 = zodiacSigns.find((s) => s.id === sign2);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Selection Area */}
      <div className="grid md:grid-cols-2 gap-8 relative">
        {/* Sign 1 */}
        <Card className="border-2 border-purple-100 dark:border-purple-900/30 overflow-hidden">
          <CardHeader className="bg-purple-50 dark:bg-purple-900/10 text-center pb-6">
            <CardTitle className="text-xl text-purple-700 dark:text-purple-300">
              الطرف الأول
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-2">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setSign1(sign.id)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                    sign1 === sign.id
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-1">{sign.symbol}</span>
                  <span className="text-xs font-medium">{sign.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connection Icon (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center border-4 border-purple-50 dark:border-gray-700">
            <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
          </div>
        </div>

        {/* Sign 2 */}
        <Card className="border-2 border-pink-100 dark:border-pink-900/30 overflow-hidden">
          <CardHeader className="bg-pink-50 dark:bg-pink-900/10 text-center pb-6">
            <CardTitle className="text-xl text-pink-700 dark:text-pink-300">
              الطرف الثاني
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-2">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setSign2(sign.id)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                    sign2 === sign.id
                      ? 'bg-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-900/30 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-1">{sign.symbol}</span>
                  <span className="text-xs font-medium">{sign.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleCalculate}
          disabled={!sign1 || !sign2 || loading}
          className={`px-8 py-4 rounded-full text-lg font-bold text-white shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            !sign1 || !sign2
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:shadow-pink-500/25'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin text-2xl">🔮</span> جاري التحليل...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> تحليل التوافق
            </span>
          )}
        </button>
      </div>

      {/* Results Area */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="relative pt-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-900 shadow-xl z-10">
                %{result.score}
              </div>
              
              <Card className="border-t-4 border-t-purple-500 overflow-hidden pt-8">
                <CardContent className="p-8 text-center space-y-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {result.label}
                  </h3>
                  
                  <div className="flex justify-center items-center gap-4 text-2xl font-bold text-gray-700 dark:text-gray-200">
                    <span className="flex items-center gap-2">
                      {selectedSign1?.symbol} {selectedSign1?.name}
                    </span>
                    <ArrowRight className="text-gray-400" />
                    <span className="flex items-center gap-2">
                      {selectedSign2?.name} {selectedSign2?.symbol}
                    </span>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    {result.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 mt-8 text-right">
                    {result.tips.map((tip: string, idx: number) => (
                      <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                        <Star className="w-5 h-5 text-yellow-500 mb-2" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
